import type { Metadata } from "next";
import { Navbar } from "@/app/_components/Navbar";
import { StylistClient } from "./_components/StylistClient";

export const metadata: Metadata = {
  title: "Vistra | AI Stylist Assistant",
  description: "Consult with your dedicated AI fashion stylist for premium outfit curations, smart sizes, and global trends.",
};

export default function StylistPage() {
  return (
    <div className="text-charcoal antialiased min-h-screen flex flex-col bg-white">
      {/* Top navigation header with stylist active tab */}
      <Navbar activeTab="stylist" />

      {/* Main interactive split-screen chat and search board */}
      <main className="h-screen w-full flex pt-[80px] overflow-hidden">
        <StylistClient />
      </main>
    </div>
  );
}
