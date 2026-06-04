import type { Metadata } from "next";
import * as React from "react";
import { CreateProductWizardClient } from "./_components/CreateProductWizardClient";

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

  return <CreateProductWizardClient editId={editId} />;
}
