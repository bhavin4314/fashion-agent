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
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
  
    if (profile?.full_name) {
      adminName = profile.full_name;
    } else if (user.email) {
      adminName = user.email.split("@")[0] || "Vistra Admin";
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
            <div className="w-8 h-8 rounded-full overflow-hidden border border-secondary-container bg-surface-container shrink-0">
              <Image
                alt="Vistra Admin Avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgg56leU2hgWzQyQsNeHNxFEX4dGHR9bMUf-hViVLujQwyrKsAtEtg1VRURIftHOdk8mx28sEfOtYD7fAZZx-wG-KfG_FOp2N7KHKVev-JkIUNQTEIbOZe-4PHl_TsITFWRt6yFH7KPhFY1UrKwNF9lTmqAJ2Q8svLEXt9nYTK6YcrlG1ZC7prTCbZ5JnDaetcaYsGB91El053mCocbRJ8tq-mStX0DFgKH20-M7CSNmtLdse1uyAVBcMs7dmBYyTAADonJBSnP02P"
                width={32}
                height={32}
                unoptimized
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-charcoal">{adminName}</p>
              <span className="text-[9px] text-muted font-bold uppercase tracking-widest block">Concierge Elite</span>
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
