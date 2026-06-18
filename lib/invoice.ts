import { jsPDF } from "jspdf";

export interface InvoiceOrderItem {
  title: string;
  size: string | null;
  quantity: number;
  price: number;
}

export interface InvoiceOrder {
  id: string;
  createdAt: string;
  totalAmount: number;
  paymentStatus: string;
  shippingAddress: string;
  items: InvoiceOrderItem[];
}

export interface InvoiceProfile {
  fullName: string;
  email: string;
  phone: string | null;
}

export function generateInvoicePdf(order: InvoiceOrder, profile: InvoiceProfile): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Colors
  const charcoal = "#1A1A1A";
  const muted = "#737373";

  // Document Title / Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(charcoal);
  doc.text("V I S T R A", 15, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(muted);
  doc.text("PREMIUM FASHION CONCIERGE", 15, 26);

  // Invoice Metadata (Top Right)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(charcoal);
  doc.text("INVOICE", 150, 20);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.text(`Invoice No: VST-${order.id.slice(0, 8).toUpperCase()}`, 150, 26);
  doc.text(
    `Date: ${new Date(order.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`,
    150,
    32
  );
  doc.text(`Payment: ${order.paymentStatus.toUpperCase()}`, 150, 38);

  // Divider Line
  doc.setDrawColor(229, 229, 229);
  doc.setLineWidth(0.5);
  doc.line(15, 44, 195, 44);

  // Billing Details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(charcoal);
  doc.text("BILLED TO", 15, 54);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(muted);
  doc.text(profile.fullName, 15, 61);
  doc.text(profile.email, 15, 67);
  if (profile.phone) {
    doc.text(`Phone: ${profile.phone}`, 15, 73);
  }

  // Shipping details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(charcoal);
  doc.text("SHIPPING ADDRESS", 110, 54);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(muted);
  const addressLines = doc.splitTextToSize(order.shippingAddress || "No address provided", 80);
  doc.text(addressLines, 110, 61);

  // Table header
  let currentY = 88;
  
  doc.setFillColor(245, 245, 244);
  doc.rect(15, currentY, 180, 9, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(charcoal);
  doc.text("Item Details", 18, currentY + 6);
  doc.text("Size", 110, currentY + 6);
  doc.text("Qty", 135, currentY + 6);
  doc.text("Price", 155, currentY + 6);
  doc.text("Total", 180, currentY + 6);

  currentY += 9;

  // Table rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(muted);

  order.items.forEach((item) => {
    // Check page overflow
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }

    const titleLines = doc.splitTextToSize(item.title, 85);
    doc.text(titleLines, 18, currentY + 6.5);
    doc.text(item.size || "-", 110, currentY + 6.5);
    doc.text(String(item.quantity), 135, currentY + 6.5);
    doc.text(`Rs ${item.price.toLocaleString("en-US")}`, 155, currentY + 6.5);
    doc.text(`Rs ${(item.price * item.quantity).toLocaleString("en-US")}`, 180, currentY + 6.5);

    const rowHeight = Math.max(11, titleLines.length * 5.5 + 2);
    currentY += rowHeight;
  });

  // Table footer divider
  doc.line(15, currentY, 195, currentY);
  currentY += 6;

  // Total Summary (aligned right)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.text("Subtotal:", 145, currentY + 2);
  doc.text(`Rs ${order.totalAmount.toLocaleString("en-US")}`, 175, currentY + 2);

  doc.text("Tax (0%):", 145, currentY + 8);
  doc.text("Rs 0.00", 175, currentY + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(charcoal);
  doc.text("Grand Total:", 145, currentY + 15);
  doc.text(`Rs ${order.totalAmount.toLocaleString("en-US")}`, 175, currentY + 15);

  // Terms and conditions / Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(163, 163, 163);
  doc.text("Thank you for curating with Vistra. For support, reach out to milan-concierge@vistra.ai.", 15, 275);
  doc.text("This is a system generated document and does not require a physical signature.", 15, 280);

  return doc;
}
