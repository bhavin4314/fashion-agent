import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleCleanup(request);
}

export async function POST(request: Request) {
  return handleCleanup(request);
}

async function handleCleanup(request: Request) {
  try {
    // 1. Authorization Check
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Only enforce secret check if CRON_SECRET is configured
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase configuration environment variables.");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // 2. Initialize Supabase Admin Client
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // 3. Fetch all active image URLs from database in batches of 1000 (Supabase default page limit)
    const referencedFilenames = new Set<string>();
    let hasMoreProducts = true;
    let productPage = 0;
    const productBatchSize = 1000;

    while (hasMoreProducts) {
      const fromRange = productPage * productBatchSize;
      const toRange = fromRange + productBatchSize - 1;

      const { data: productsBatch, error: dbError } = await supabaseAdmin
        .from("products")
        .select("image_urls")
        .range(fromRange, toRange);

      if (dbError) {
        console.error("Database query failed:", dbError);
        return NextResponse.json(
          { success: false, error: `Database query failed: ${dbError.message}` },
          { status: 500 }
        );
      }

      if (!productsBatch || productsBatch.length === 0) {
        hasMoreProducts = false;
      } else {
        for (const product of productsBatch) {
          if (product.image_urls) {
            for (const url of product.image_urls) {
              const filename = url.split("/").pop();
              if (filename) {
                referencedFilenames.add(filename);
              }
            }
          }
        }
        if (productsBatch.length < productBatchSize) {
          hasMoreProducts = false;
        } else {
          productPage++;
        }
      }
    }

    // 4. List all files in the 'products' folder of 'product-bucket' using offset pagination
    const files: NonNullable<Awaited<ReturnType<ReturnType<typeof supabaseAdmin.storage.from>["list"]>>["data"]> = [];
    let hasMoreFiles = true;
    let storageOffset = 0;
    const storageBatchSize = 1000;

    while (hasMoreFiles) {
      const { data: filesBatch, error: storageError } = await supabaseAdmin.storage
        .from("product-bucket")
        .list("products", {
          limit: storageBatchSize,
          offset: storageOffset,
        });

      if (storageError) {
        console.error("Storage list failed:", storageError);
        return NextResponse.json(
          { success: false, error: `Storage list failed: ${storageError.message}` },
          { status: 500 }
        );
      }

      if (!filesBatch || filesBatch.length === 0) {
        hasMoreFiles = false;
      } else {
        files.push(...filesBatch);
        if (filesBatch.length < storageBatchSize) {
          hasMoreFiles = false;
        } else {
          storageOffset += storageBatchSize;
        }
      }
    }

    if (files.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No files found in product-bucket/products.",
        deletedCount: 0,
        deletedPaths: [],
      });
    }

    // 5. Filter orphaned files older than 24 hours
    const now = new Date();
    const ageThresholdMs = 24 * 60 * 60 * 1000; // 24 hours
    const pathsToDelete: string[] = [];

    for (const file of files) {
      // Skip directories/folders
      if (file.metadata && !file.metadata.mimetype) {
        continue;
      }

      if (!file.created_at) {
        continue;
      }

      const fileCreatedAt = new Date(file.created_at);
      const fileAgeMs = now.getTime() - fileCreatedAt.getTime();

      if (fileAgeMs > ageThresholdMs) {
        // If filename is not in active products image list, mark for deletion
        if (!referencedFilenames.has(file.name)) {
          pathsToDelete.push(`products/${file.name}`);
        }
      }
    }

    // 6. Delete orphaned files from storage
    if (pathsToDelete.length > 0) {
      const { data: deleteResult, error: deleteError } = await supabaseAdmin.storage
        .from("product-bucket")
        .remove(pathsToDelete);

      if (deleteError) {
        console.error("Failed to delete some files from storage:", deleteError);
        return NextResponse.json(
          {
            success: false,
            error: `Failed to delete files: ${deleteError.message}`,
            partialDeletions: deleteResult,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Successfully purged ${pathsToDelete.length} orphaned image(s) older than 24 hours.`,
        deletedCount: pathsToDelete.length,
        deletedPaths: pathsToDelete,
      });
    }

    return NextResponse.json({
      success: true,
      message: "No orphaned images older than 24 hours detected.",
      deletedCount: 0,
      deletedPaths: [],
    });
  } catch (error) {
    console.error("Cron job run failed with error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
