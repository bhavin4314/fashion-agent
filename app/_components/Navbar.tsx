"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { signOutAction } from "@/app/login/actions";

interface NavbarProps {
  activeTab?: "explore" | "stylist" | "admin";
}

export function Navbar({ activeTab }: NavbarProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [user, setUser] = React.useState<any | null>(null);
  const [role, setRole] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

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
            .select("role")
            .eq("id", user.id)
            .single();
          setRole(profile?.role || "customer");
        } else {
          setUser(null);
          setRole(null);
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
            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-muted hover:text-charcoal transition-colors duration-150 flex items-center gap-1 border-none bg-transparent cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-border-light bg-surface-container shrink-0 select-none">
                  <Image
                    alt="User profile"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmuqdX4FM3xMfoKGOV9pqobOx9lysFIZNKePzrA9CsBBeBJUWSKs2zuLy5PzOPadgT0Lnq4BupJyeXHG5FpnG6bDrwsREE4o6E-ZVHsLzAclxx0wonMChWn8EZT5N-4zfVAN2NvYSS4yeHOoz_UdixCL5fBkUQTIYtf8iZXqy9ghWrpZgNB7pgOqypMK6DZXjXc39R0DLl5d5hdH_CtKknIpOFNJHxjip0zhWPmg4KSmrgNDLm6LbOC5hXT-YvtkpXVb7a521otyiND"
                    width={40}
                    height={40}
                    unoptimized
                  />
                </div>
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
  );
}
