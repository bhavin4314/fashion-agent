"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationLoader() {
  const [isLoading, setIsLoading] = React.useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset loading state when pathname or searchParams change
  React.useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  React.useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (!anchor) return;
      
      const href = anchor.getAttribute("href");
      if (!href) return;
      
      // Skip if:
      // - opens in a new tab
      // - is a download link
      // - is mailto/tel
      // - is an external link
      // - is a hash link
      if (
        e.metaKey || 
        e.ctrlKey || 
        e.shiftKey || 
        e.altKey ||
        anchor.getAttribute("target") === "_blank" ||
        anchor.hasAttribute("download") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("http") ||
        href.startsWith("#")
      ) {
        return;
      }
      
      // Skip if it navigates to the exact same page
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl || href === window.location.pathname) {
        return;
      }

      setIsLoading(true);
    };

    const handlePopState = () => {
      setIsLoading(true);
    };

    document.addEventListener("click", handleAnchorClick);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (!isLoading) return null;

  const isAdmin = pathname?.startsWith("/admin");
  const barColor = isAdmin ? "#ba0036" : "#ff385c"; // Admin Primary vs Customer Brand

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col pointer-events-auto select-none">
      {/* Custom Styles for Indeterminate Progress Bar */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress-loading {
          0% { left: -35%; right: 100%; }
          60% { left: 100%; right: -90%; }
          100% { left: 100%; right: -90%; }
        }
        @keyframes progress-loading-short {
          0% { left: -200%; right: 100%; }
          60% { left: 107%; right: -8%; }
          100% { left: 107%; right: -8%; }
        }
      `}} />

      {/* Top Loading Bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-neutral-100/50 overflow-hidden z-[10000]">
        <div 
          className="absolute top-0 bottom-0" 
          style={{ 
            backgroundColor: barColor,
            animation: 'progress-loading 2s infinite ease-in-out' 
          }} 
        />
        <div 
          className="absolute top-0 bottom-0" 
          style={{ 
            backgroundColor: barColor,
            opacity: 0.6,
            animation: 'progress-loading-short 2s infinite ease-in-out', 
            animationDelay: '0.5s' 
          }} 
        />
      </div>

      {/* Modern Backdrop Blur Overlay over the current page */}
      <div className="flex-1 bg-neutral-950/[0.04] backdrop-blur-[3px] transition-all duration-300 animate-fade-in" />
    </div>
  );
}
