import type { Metadata } from "next";
import { AdminOverviewClient } from "./_components/AdminOverviewClient";

export const metadata: Metadata = {
  title: "Vistra Concierge | Admin Dashboard",
  description: "Secure administrative dashboard providing premium concierge metrics, interactive client engagement analytics, and curated luxury catalog tracking.",
};

export default function AdminPage() {
  return <AdminOverviewClient />;
}
