import type { Metadata } from "next";
import { InventoryClient } from "./_components/InventoryClient";

export const metadata: Metadata = {
  title: "Vistra Concierge | Inventory Management",
  description: "Secure, quiet luxury product inventory management and real-time replenishment controls.",
};

export default function InventoryPage() {
  return <InventoryClient />;
}
