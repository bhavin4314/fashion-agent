"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Loader2 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Form } from "@/components/forms/Form";
import { createClient } from "@/utils/supabase/client";
import { productWizardSchema, type ProductWizardFormValues } from "../schema";
import { type DbProduct } from "@/lib/db-products";
import { SEASON_OPTIONS } from "../constants";
import { Stepper } from "./Stepper";
import { ConfirmationModal, AlertModal } from "@/components/ui";
import { Step1Media } from "./Step1Media";
import { Step2Garment } from "./Step2Garment";
import { Step3Metadata } from "./Step3Metadata";
import { analyzeProductMediaAction, createProductAction, updateProductAction } from "../actions";

const DEFAULT_COVER_IMAGE = "https://lh3.googleusercontent.com/aida/AP1WRLvLL6pm-reCPtRqMuprVJq4uYIgYkhYYLqHWsE0UA6esWCrdw_zH-fh_LniYZdGk-ouobVfNHzV74tZoBdHtBSKqh4OCjfxz9QNJAhvkuxHhxyv3VIigNXUqpF6ojbWql1J8BEF3oz1BK7luzIchjg4Gfw4jDd7wZ1M3OVo5RtsfB4UC2FpEyv22L67TslEsiK9VeXGf8hDTYZU_hS2ru9gopffwK26WF6J955O-XdvsR83YvANEwRPTg";

interface CreateProductWizardClientProps {
  editId?: string;
  initialProduct?: DbProduct;
}

export function CreateProductWizardClient({ editId, initialProduct }: CreateProductWizardClientProps) {
  const defaultValues: ProductWizardFormValues = initialProduct
    ? {
        image_urls: initialProduct.image_urls || [],
        title: initialProduct.title || "",
        description: initialProduct.description || "",
        price: Number(initialProduct.price),
        stock_quantity: Number(initialProduct.stock_quantity),
        category: (initialProduct.category === "footwear" || initialProduct.category === "accessories")
          ? (initialProduct.category as "footwear" | "accessories")
          : "apparel",
        gender: (initialProduct.gender === "Men" || initialProduct.gender === "Women" || initialProduct.gender === "Unisex") ? initialProduct.gender : "Unisex",
        season: Array.isArray(initialProduct.season)
          ? initialProduct.season
          : typeof (initialProduct.season as unknown) === "string"
          ? (initialProduct.season as unknown as string).split(", ").map(s => s.trim())
          : ["Summer"],
        sizes: initialProduct.sizes || [],
        materials: initialProduct.materials || [],
        aesthetics: initialProduct.aesthetics || [],
        occasions: initialProduct.occasions || [],
        fit: initialProduct.fit || null,
      }
    : {
        image_urls: [],
        title: "",
        description: "",
        price: "" as unknown as number,
        stock_quantity: "" as unknown as number,
        category: "apparel",
        gender: "Unisex",
        season: ["Summer"],
        sizes: [],
        materials: [],
        aesthetics: [],
        occasions: [],
        fit: null,
      };

  const handleFinalSubmit = async (values: ProductWizardFormValues) => {
    console.log("Submitting wizard data:", values);
  };

  return (
    <Form
      schema={productWizardSchema}
      defaultValues={defaultValues}
      onSubmit={handleFinalSubmit}
      className="flex flex-col flex-grow select-none w-full min-h-screen gap-0"
    >
      <WizardContent editId={editId} initialProduct={initialProduct} />
    </Form>
  );
}

interface WizardContentProps {
  editId?: string;
  initialProduct?: DbProduct;
}

function WizardContent({ editId, initialProduct }: WizardContentProps) {
  const router = useRouter();
  const { trigger, watch, setValue, reset, formState: { errors } } = useFormContext<ProductWizardFormValues>();
  
  const [currentStep, setCurrentStep] = React.useState<1 | 2 | 3>(1);
  const [isAiProcessing, setIsAiProcessing] = React.useState<boolean>(false);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = React.useState<Record<number, number>>({});
  const [isAbandonModalOpen, setIsAbandonModalOpen] = React.useState<boolean>(false);
  const [isAiErrorModalOpen, setIsAiErrorModalOpen] = React.useState<boolean>(false);
  
  // Storage keys of uploaded files in Supabase (for Wizard Abandonment Cleanup Engine)
  const [uploadedPaths, setUploadedPaths] = React.useState<string[]>([]);
  const uploadedPathsRef = React.useRef<string[]>([]);
  React.useEffect(() => {
    uploadedPathsRef.current = uploadedPaths;
  }, [uploadedPaths]);

  // Selected files pending upload
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

  // Submit states
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const isSuccessRef = React.useRef<boolean>(false);

  // Watching values for summary preview card
  const title = watch("title") || "";

  // WIZARD ABANDONMENT ENGINE:
  // Purges all uploaded assets in the Supabase Storage Bucket immediately if creation process is interrupted.
  const cleanupUploadedAssets = React.useCallback(async () => {
    const paths = uploadedPathsRef.current;
    if (paths.length > 0) {
      console.log("Wizard Abandonment Engine: purging assets", paths);
      try {
        const supabase = createClient();
        const { data, error } = await supabase.storage.from("product-bucket").remove(paths);
        if (error) {
          console.error("Abandonment cleanup failed:", error.message);
        } else {
          console.log("Abandonment cleanup purged assets:", data);
        }
      } catch (err) {
        console.error("Error during storage cleanup:", err);
      }
      setUploadedPaths([]);
      uploadedPathsRef.current = [];
    }
  }, []);

  // Cleanup on unmount if product was not created successfully
  React.useEffect(() => {
    return () => {
      if (!isSuccessRef.current) {
        cleanupUploadedAssets();
      }
    };
  }, [cleanupUploadedAssets]);

  // Cancel wizard handler
  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAbandonModalOpen(true);
  };

  const handleConfirmAbandon = async () => {
    setIsAbandonModalOpen(false);
    await cleanupUploadedAssets();
    router.push("/admin/inventory");
  };

  // Load editing item details on mount if present
  React.useEffect(() => {
    if (typeof window !== "undefined" && editId && !initialProduct) {
      const saved = localStorage.getItem("vistra_inventory_items");
      if (saved) {
        try {
          interface SavedInventoryItem {
            id: string;
            image_urls?: string[];
            image?: string;
            title: string;
            description?: string;
            price: number | string;
            stock_quantity?: number;
            status?: string;
            category?: string;
            gender?: string;
            season?: string | string[];
            sizes?: string[];
            aesthetics?: string[];
            occasions?: string[];
            materials?: string[];
            fit?: string | null;
          }
          const currentItems = JSON.parse(saved) as SavedInventoryItem[];
          const item = currentItems.find((itm) => itm.id === editId);
          if (item) {
            reset({
              image_urls: item.image_urls || (item.image ? [item.image] : [DEFAULT_COVER_IMAGE]),
              title: item.title,
              description: item.description || `This exquisite item represents the signature craftsmanship of the collection.`,
              price: Number(item.price),
              stock_quantity: item.stock_quantity || (item.status === "In Stock" ? 24 : item.status === "Low Stock" ? 3 : 0),
              category: item.category ? (item.category.toLowerCase() as "apparel" | "footwear" | "accessories") : "apparel",
              gender: (item.gender || "Unisex") as "Men" | "Women" | "Unisex",
              season: Array.isArray(item.season)
                ? item.season
                : item.season
                ? item.season.split(", ").map(s => s.trim())
                : ["Summer"],
              sizes: item.sizes || [],
              aesthetics: item.aesthetics || [],
              occasions: item.occasions || [],
              materials: item.materials || [],
              fit: item.fit || null
            });
          }
        } catch (e) {
          console.error("Failed to parse edit item:", e);
        }
      }
    }
  }, [editId, reset, initialProduct]);

  // Handle uploading and navigating next
  const handleNextStep = async () => {
    if (currentStep === 1) {
      const isValid = await trigger("image_urls");
      if (isValid) {
        setIsUploading(true);
        const currentUrls = watch("image_urls") || [];
        const publicUrls: string[] = [];
        const paths: string[] = [];
        let fileIndex = 0;

        try {
          const supabase = createClient();
          
          for (let i = 0; i < currentUrls.length; i++) {
            const currentUrl = currentUrls[i];
            
            if (currentUrl && !currentUrl.startsWith("blob:")) {
              publicUrls.push(currentUrl);
              continue;
            }

            const file = selectedFiles[fileIndex];
            fileIndex++;

            if (!file) {
              continue;
            }

            const fileExt = file.name.split(".").pop();
            const filePath = `products/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

            // Initialize progress for visual rendering and simulate smooth progress
            setUploadProgress((prev) => ({ ...prev, [i]: 0 }));
            const interval = setInterval(() => {
              setUploadProgress((prev) => {
                const current = prev[i] || 0;
                if (current < 90) {
                  return { ...prev, [i]: current + 10 };
                }
                return prev;
              });
            }, 150);

            const { error } = await supabase.storage
              .from("product-bucket")
              .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
              });

            clearInterval(interval);

            if (error) {
              throw error;
            }

            const { data: urlData } = supabase.storage.from("product-bucket").getPublicUrl(filePath);
            
            publicUrls.push(urlData.publicUrl);
            paths.push(filePath);
            
            setUploadProgress((prev) => ({ ...prev, [i]: 100 }));
          }

          // Update tracked storage paths and hydrated form URLs
          setUploadedPaths((prev) => [...prev, ...paths]);
          setValue("image_urls", publicUrls, { shouldValidate: true });
          
          setIsUploading(false);
          setUploadProgress({});
          
          // Transition to Step 2 and trigger Multi-Modal Vision Hydration (ACTION A)
          setCurrentStep(2);
          
          // Only trigger Vision AI Analysis if a new cover image was uploaded (starts with "blob:")
          const isNewCoverImage = currentUrls[0]?.startsWith("blob:");
          if (isNewCoverImage) {
            setIsAiProcessing(true);
            const coverUrl = publicUrls[0];
            if (coverUrl) {
              const res = await analyzeProductMediaAction(coverUrl);
              if (res.success && res.data) {
                const parsed = res.data;
                setValue("title", parsed.title, { shouldValidate: true });
                setValue("description", parsed.description, { shouldValidate: true });
                setValue("category", parsed.category as "apparel" | "footwear", { shouldValidate: true });
                setValue("gender", parsed.gender as "Men" | "Women" | "Unisex", { shouldValidate: true });
                
                const rawSeasons = parsed.season 
                  ? (parsed.season.includes(",") 
                     ? parsed.season.split(",").map(s => s.trim()) 
                     : [parsed.season])
                  : ["Summer"];
                
                const aiSeason = rawSeasons
                  .map(s => {
                    const matched = SEASON_OPTIONS.find(allowed => allowed.toLowerCase() === s.toLowerCase());
                    return matched || null;
                  })
                  .filter((s): s is typeof SEASON_OPTIONS[number] => s !== null);
                
                setValue("season", aiSeason.length > 0 ? aiSeason : ["Summer"], { shouldValidate: true });
                
                // Pre-populate step 3 fields
                let aiSizes = parsed.sizes || [];
                if (parsed.category === "footwear") {
                  aiSizes = aiSizes
                    .map(sz => sz.replace(/[^0-9.]/g, "").trim())
                    .filter(sz => sz.length > 0);
                }
                setValue("sizes", aiSizes, { shouldValidate: true });
                setValue("materials", parsed.materials || [], { shouldValidate: true });
                setValue("aesthetics", parsed.aesthetics || [], { shouldValidate: true });
                setValue("occasions", parsed.occasions || [], { shouldValidate: true });
                setValue("fit", parsed.fit || null, { shouldValidate: true });
              } else {
                console.error("AI Media Analysis failed:", res.error);
                if ("isIrrelevant" in res && res.isIrrelevant) {
                  toast.error(res.error || "The uploaded image is not relevant to apparel or footwear.", { position: "top-center" });
                  await cleanupUploadedAssets();
                  setSelectedFiles([]);
                  setValue("image_urls", [], { shouldValidate: true });
                  setCurrentStep(1);
                } else {
                  console.error("AI Media Analysis failed (unexpected):", res.error);
                  setIsAiErrorModalOpen(true);
                  await cleanupUploadedAssets();
                  setSelectedFiles([]);
                  setValue("image_urls", [], { shouldValidate: true });
                  setCurrentStep(1);
                }
              }
            }
            setIsAiProcessing(false);
          }

        } catch (err: unknown) {
          console.error("File upload failed:", err);
          const errorMsg = err instanceof Error ? err.message : String(err);
          toast.error("File upload failed: " + errorMsg, { position: "top-center" });
          setIsUploading(false);
          setUploadProgress({});
        }
      }
    } else if (currentStep === 2) {
      const isValid = await trigger(["title", "description", "price", "stock_quantity", "category", "gender"]);
      if (isValid) {
        setCurrentStep(3);
      }
    }
  };

  // Navigate backward
  const handlePrevStep = () => {
    if (currentStep === 2) setCurrentStep(1);
    if (currentStep === 3) setCurrentStep(2);
  };

  // Final submit triggering Server Action (ACTION C)
  const handleFinalSubmitTrigger = async () => {
    const isValid = await trigger();
    if (!isValid) {
      console.error("Validation errors:", errors);
      if (errors.image_urls) {
        toast.error(errors.image_urls.message || "Please upload at least one product image", { position: "top-center" });
      }
      return;
    }

    setIsSubmitting(true);
    const values = watch();
    
    const res = editId 
      ? await updateProductAction(editId, values)
      : await createProductAction(values);

    if (res.success) {
      isSuccessRef.current = true;
      setIsSuccess(true);
    } else {
      console.error(editId ? "Failed to update product:" : "Failed to create product:", res.error);
      toast.error(editId ? "Failed to update product: " + res.error : "Failed to create product: " + res.error, { position: "top-center" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col flex-grow select-none w-full min-h-screen bg-background relative">
      
      {/* Top bar */}
      <header className="sticky top-0 right-0 z-30 flex items-center justify-between px-margin-desktop bg-white border-b border-secondary-container h-16 shadow-sm w-full">
        <div className="flex items-center gap-md">
          <span className="text-primary font-extrabold font-headline-md text-headline-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_fix_high</span>
            Concierge Admin
          </span>
          <div className="h-6 w-[1px] bg-outline-variant mx-md" />
          <span className="text-secondary font-label-md">
            {editId ? "Product Modification Wizard" : "Product Creation Wizard"}
          </span>
        </div>
        <div className="flex items-center gap-md">
          <button
            type="button"
            onClick={handleCancelClick}
            className="text-xs font-bold uppercase tracking-wider text-primary hover:opacity-90 transition-colors bg-transparent border-none cursor-pointer"
          >
            Cancel Wizard
          </button>
        </div>
      </header>

      {/* Main stepper and central bento canvas */}
      <main className="flex-grow p-xxl max-w-[1120px] mx-auto w-full flex flex-col items-center">
        
        <h2 className="text-[32px] md:text-[40px] font-bold text-center text-on-surface mb-lg tracking-tight">
          {editId ? "Edit Product" : "Add New Product"}
        </h2>

        {/* Visual Stepper Indicators */}
        <Stepper 
          currentStep={currentStep} 
          onStepClick={(step) => {
            if (step < currentStep) {
              setCurrentStep(step);
            }
          }} 
        />

        {/* Central Content Box */}
        <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-xxl shadow-sm min-h-[460px] flex flex-col justify-between select-none">
          
          {/* STEP 1 CONTENT PAGE */}
          {currentStep === 1 && (
            <Step1Media
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          )}

          {/* STEP 2 CONTENT PAGE */}
          {currentStep === 2 && (
            <Step2Garment 
              isAiProcessing={isAiProcessing}
            />
          )}

          {/* STEP 3 CONTENT PAGE */}
          {currentStep === 3 && (
            <Step3Metadata
              editId={editId}
              handleFinalSubmitTrigger={handleFinalSubmitTrigger}
            />
          )}

          {/* Navigation Footer */}
          <div className="mt-xl pt-lg border-t border-secondary-container flex items-center justify-between select-none">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-xl py-2.5 bg-white border border-primary text-primary hover:bg-primary-fixed/20 rounded-xl text-xs font-bold transition-all flex items-center gap-xs cursor-pointer active:scale-95 duration-150"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancelClick}
                className="px-xl py-2.5 text-secondary hover:bg-surface-container-low rounded-xl text-xs font-bold transition-all flex items-center justify-center no-underline cursor-pointer border-none bg-transparent"
              >
                Cancel
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                disabled={isUploading}
                onClick={handleNextStep}
                className={`px-xl py-2.5 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-xs border-none select-none ${
                  isUploading
                    ? "bg-primary/50 cursor-not-allowed"
                    : "bg-primary hover:brightness-105 active:scale-95 cursor-pointer"
                }`}
              >
                {currentStep === 1 ? "Upload & Continue" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmitTrigger}
                className="px-xxl py-2.5 bg-primary hover:brightness-105 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-xs shadow-md border-none cursor-pointer active:scale-95"
              >
                {editId ? "Update Product" : "Create Product"}
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
       </main>

      {/* Decorative gradient backdrops */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-primary-fixed rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] bg-secondary-container rounded-full blur-[100px]" />
      </div>

      {/* ABANDON CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={isAbandonModalOpen}
        onClose={() => setIsAbandonModalOpen(false)}
        onConfirm={handleConfirmAbandon}
        title="Abandon Wizard"
        description="Are you sure you want to abandon? All uploaded images will be purged from storage. This action cannot be undone."
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        icon={
          <span className="material-symbols-outlined text-[24px] text-primary">warning</span>
        }
      />

      {/* AI GENERATION ERROR MODAL */}
      <AlertModal
        isOpen={isAiErrorModalOpen}
        onClose={() => setIsAiErrorModalOpen(false)}
        title="AI Generation Failed"
        description="We encountered an unexpected error while trying to automatically generate the product details using AI. The uploaded image was deleted to keep your storage clean. Please return to Step 1 and try again."
        confirmLabel="Got it"
        variant="primary"
        icon={
          <span className="material-symbols-outlined text-[24px] text-red-600" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
        }
      />

      {/* OVERLAY 1: PROCESSING LOADING STATE */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-on-surface/45 backdrop-blur-xs flex items-center justify-center p-xl">
          <div className="bg-white p-xl rounded-2xl max-w-[384px] w-full shadow-2xl text-center space-y-lg border border-secondary-container">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-4 border-surface-container-low rounded-full" />
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px] text-primary animate-pulse">cloud_upload</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-charcoal mb-md">
                {editId ? "Saving Modifications" : "Finalizing Creation"}
              </h3>
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider">
                {editId ? "Saving modifications & re-generating embeddings..." : "Saving product record & generating embeddings..."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 2: SUCCESS COMPLETED STATE */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 bg-on-surface/45 backdrop-blur-xs flex items-center justify-center p-xl">
          <div className="bg-white p-xl rounded-2xl max-w-[448px] w-full shadow-2xl text-center space-y-xl border border-secondary-container animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/35 text-white">
              <span className="material-symbols-outlined text-[40px] text-white">check</span>
            </div>
            
            <div className="space-y-sm">
              <h3 className="text-2xl font-extrabold text-charcoal">
                {editId ? "Product Updated Successfully" : "Product Added Successfully"}
              </h3>
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider">
                &quot;{title || "Loro Piana Loafers"}&quot; has been safely {editId ? "updated in" : "indexed in"} your boutique catalog.
              </p>
            </div>

            <Link
              href="/admin/inventory"
              className="w-full bg-primary hover:opacity-90 text-white py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase shadow-md flex items-center justify-center gap-sm border-none cursor-pointer no-underline transition-all active:scale-[0.98]"
            >
              View Product Catalog
            </Link>
          </div>
        </div>
      )}

      {/* Load Material Symbols Outlined stylesheet globally */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />
    </div>
  );
}
