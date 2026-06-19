import type { Metadata } from "next";
import Image from "next/image";
import * as React from "react";
import { SidebarNav } from "./_components/SidebarNav";
import { AdminLogoutButton } from "./_components/AdminLogoutButton";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Vistra Concierge | Admin Dashboard",
  description: "Secure administrative inventory control and styling queue concierge.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let adminName = "Vistra Admin";
  let adminRole = "Admin";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();
  
    if (profile?.full_name) {
      adminName = profile.full_name;
    } else if (user.email) {
      adminName = user.email.split("@")[0] || "Vistra Admin";
    }
    if (profile?.role) {
      adminRole = profile.role;
    }
  }

  return (
    <div className="bg-background text-on-surface font-sans min-h-screen flex w-full relative">
      {/* Permanent Left Sidebar Navigation Dashboard */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-secondary-container flex flex-col h-screen overflow-y-auto select-none z-50">
        {/* Brand Logo Header */}
        <div className="px-lg py-xl">
          <div className="flex flex-col items-start gap-xs">
            <Image
              src="/logo-with-name.png"
              alt="Vistra Logo"
              className="h-12 w-auto object-contain cursor-pointer"
              width={180}
              height={48}
              priority
            />
            <p className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">
              Luxury Concierge
            </p>
          </div>
        </div>

        <SidebarNav />

        {/* Admin Actions Footer Panel */}
        <div className="p-lg mt-auto space-y-md border-t border-secondary-container bg-white">
          <div className="space-y-sm">
            <AdminLogoutButton />
          </div>

          {/* Admin Avatar Identity */}
          <div className="flex items-center gap-sm px-lg pt-sm border-t border-secondary-container mt-sm">
            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-secondary-container bg-secondary-container text-on-secondary-container shrink-0 select-none">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-charcoal">{adminName}</p>
              <span className="text-[9px] text-muted font-bold uppercase tracking-widest block">{adminRole}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Pane Wrapper (Offsetted by Sidebar) */}
      <main className="ml-64 flex-grow flex flex-col min-h-screen relative overflow-x-hidden">
        {children}
      </main>

      {/* Load Material Symbols Outlined stylesheet globally */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />
    </div>
  );
}
