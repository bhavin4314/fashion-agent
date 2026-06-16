import type { Metadata } from "next";
import * as React from "react";
import { CreateProductWizardClient } from "./_components/CreateProductWizardClient";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Vistra Admin | Product Wizard",
  description: "Create new luxury items utilizing AI-assisted automated attribute indexing.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CreateProductPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const editId = typeof searchParams.edit === "string" ? searchParams.edit : undefined;

  let initialProduct = null;
  if (editId) {
    const supabase = await createClient();
    const query = supabase.from("products").select("*");
    if (/^\d+$/.test(editId)) {
      query.eq("id", parseInt(editId, 10));
    } else {
      query.eq("id", editId);
    }
    const { data } = await query.maybeSingle();
    if (data) {
      initialProduct = data;
    }
  }

  return <CreateProductWizardClient editId={editId} initialProduct={initialProduct} />;
}
