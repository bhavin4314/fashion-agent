import type { Metadata } from "next";
import * as React from "react";
import { CreateProductWizardClient } from "./_components/CreateProductWizardClient";

export const metadata: Metadata = {
  title: "Vistra Admin | Product Wizard",
  description: "Create new luxury items utilizing AI-assisted automated attribute indexing.",
};

export default function CreateProductPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><LoaderPlaceholder /></div>}>
      <CreateProductWizardClient />
    </React.Suspense>
  );
}

function LoaderPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-md select-none">
      <div className="w-10 h-10 border-4 border-[#ffdada] border-t-[#ba0036] rounded-full animate-spin" />
      <p className="text-xs font-bold text-secondary uppercase tracking-widest">Initializing Wizard...</p>
    </div>
  );
}
