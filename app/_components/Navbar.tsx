"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, User, ShoppingBag } from "lucide-react";
import { type User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { signOutAction } from "@/app/login/actions";
import { useCart } from "@/hooks/use-cart";
import { CartDrawer } from "@/components/shared/CartDrawer";
import { getAvatarInitials } from "@/lib/utils";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/components/ui";

interface NavbarProps {
  activeTab?: "explore" | "stylist" | "admin";
}

export function Navbar({ activeTab }: NavbarProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [role, setRole] = React.useState<string | null>(null);
  const [name, setName] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const { cartCount, setIsDrawerOpen } = useCart();

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    
    // Fetch authenticated user info on mount
    const supabase = createClient();
    const fetchUserAndRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, full_name")
            .eq("id", user.id)
            .single();
          setRole(profile?.role || "customer");
          setName(profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User");
        } else {
          setUser(null);
          setRole(null);
          setName(null);
        }
      } catch (error) {
        console.error("Error loading user session in Navbar:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndRole();

    // Listen to pageshow to handle back/forward navigation cache (bfcache) restorations
    const handlePageShow = () => {
      fetchUserAndRole();
    };
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOutAction();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback redirect
      window.location.href = "/login";
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full h-[80px] z-50 bg-white border-b border-border-light flex justify-between items-center px-margin-mobile md:px-margin-desktop transition-all duration-300 ${
          isScrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="flex items-center gap-2 select-none">
          <Image
            alt="Vistra Logo"
            className="h-10 w-auto object-contain cursor-pointer"
            src="/logo-with-name.png"
            onClick={() => {
              if (role === "admin") {
                window.location.href = "/admin/inventory";
              } else {
                window.location.href = "/";
              }
            }}
            width={150}
            height={40}
            priority
          />
        </div>
        
        <div className="hidden md:flex gap-xl select-none">
          {!isLoading && (
            <>
              {role === "admin" ? (
                <Link
                  className={`text-sm font-semibold transition-colors duration-150 ${
                    activeTab === "admin"
                      ? "text-brand border-b-2 border-brand pb-1"
                      : "text-charcoal hover:text-black"
                  }`}
                  href="/admin/inventory"
                >
                  Admin Overview
                </Link>
              ) : (
                <>
                  <Link
                    className={`text-sm font-semibold transition-colors duration-150 ${
                      activeTab === "explore"
                        ? "text-brand border-b-2 border-brand pb-1"
                        : "text-charcoal hover:text-black"
                    }`}
                    href="/collection"
                  >
                    Explore Collection
                  </Link>
                  <Link
                    className={`text-sm font-semibold transition-colors duration-150 ${
                      activeTab === "stylist"
                        ? "text-brand border-b-2 border-brand pb-1"
                        : "text-charcoal hover:text-black"
                    }`}
                    href="/stylist"
                  >
                    AI Stylist
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-md">
          {!isLoading && (
            <>
              {role !== "admin" && (
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="relative p-2 hover:bg-neutral-100 rounded-full transition-all text-charcoal border-none bg-transparent cursor-pointer shrink-0 flex items-center justify-center mr-2"
                  aria-label="Shopping Bag"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
              {user ? (
                <>
                  <Dropdown>
                    <DropdownTrigger asChild>
                      <button
                        className="w-10 h-10 rounded-full border border-brand/20 bg-brand/10 text-brand hover:bg-brand hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center shrink-0 select-none cursor-pointer font-bold text-sm tracking-wider shadow-sm focus:outline-none"
                      >
                        {getAvatarInitials(name || "User")}
                      </button>
                    </DropdownTrigger>
                    <DropdownContent align="end" className="w-40 mt-1">
                      <DropdownItem asChild>
                        <Link href={role === "admin" ? "/admin/inventory" : "/profile"} className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownItem>
                      <DropdownItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Log out
                      </DropdownItem>
                    </DropdownContent>
                  </Dropdown>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-semibold text-brand hover:text-brand-hover transition-colors duration-150 flex items-center"
                >
                  Log in
                </Link>
              )}
            </>
          )}
        </div>
      </nav>
      {role !== "admin" && <CartDrawer />}
    </>
  );
}
