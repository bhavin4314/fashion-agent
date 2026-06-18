export const ORDER_STATUS_OPTIONS = [
  { value: "ordered", label: "Ordered" },
  { value: "confirmed", label: "Order Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export type OrderStatus = typeof ORDER_STATUS_OPTIONS[number]["value"];

export const ORDER_STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  ordered: "Your purchase request has been successfully placed.",
  confirmed: "The seller has acknowledged the order and verified stock availability.",
  shipped: "The item has been packed and handed over to a courier partner (like Ekart).",
  out_for_delivery: "The package has reached your local delivery hub and is in transit to your address.",
  delivered: "The order has successfully reached you.",
  cancelled: "The order was called off either by you, the seller, or Flipkart.",
};

export function getStatusDescription(status: string): string {
  const normalized = status.toLowerCase() as OrderStatus;
  return ORDER_STATUS_DESCRIPTIONS[normalized] || "Status details are unavailable.";
}

export function getStatusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-amber-100 text-amber-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "out_for_delivery":
      return "bg-purple-100 text-purple-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-stone-100 text-stone-800";
  }
}
