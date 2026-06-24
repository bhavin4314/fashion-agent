import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not remove this call!
  // This is necessary for setting/updating the correct session cookies.
  const { data: { user } } = await supabase.auth.getUser();

  const url = new URL(request.url);
  const pathname = url.pathname;

  // Skip middleware logic for API calls
  if (pathname.startsWith("/api")) {
    return supabaseResponse;
  }

  const isAdminPath = pathname.startsWith("/admin");
  const isCustomerPath =
    pathname.startsWith("/stylist") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/profile");
  const isAuthPath = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isProtectedPath = isAdminPath || isCustomerPath;

  // Helper to create redirect response with copied session cookies and disabled cache
  const redirect = (targetUrl: string) => {
    const redirectResponse = NextResponse.redirect(new URL(targetUrl, request.url));
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    // Set no-cache headers to prevent browser from caching redirects on back/forward buttons
    redirectResponse.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
    redirectResponse.headers.set("x-middleware-cache", "no-cache");
    return redirectResponse;
  };

  if (isProtectedPath) {
    if (!user) {
      // User is not logged in, redirect to login page with preserved path & query parameters
      let redirectUrl = pathname + url.search;
      if (pathname === "/checkout") {
        redirectUrl = "/cart";
      }
      return redirect(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }

    // Retrieve role from profiles database table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const role = profile?.role || "customer";

    // Enforce role-based access boundaries
    if (isAdminPath && role !== "admin") {
      // Customers cannot access administrative routes
      return redirect("/collection");
    }

    if (isCustomerPath && role !== "customer") {
      // Admins cannot access customer routes
      return redirect("/admin/inventory");
    }
  } else if (isAuthPath && user) {
    // Authenticated users trying to access login/signup pages should be redirected to their dashboard or redirect path
    const redirectParam = url.searchParams.get("redirect");
    if (redirectParam) {
      return redirect(redirectParam);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const role = profile?.role || "customer";

    if (role === "admin") {
      return redirect("/admin/inventory");
    } else {
      return redirect("/collection");
    }
  }

  // Prevent browser caching for all protected routes and auth routes
  if (isProtectedPath || isAuthPath) {
    supabaseResponse.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
    supabaseResponse.headers.set("x-middleware-cache", "no-cache");
  }

  return supabaseResponse;
}
