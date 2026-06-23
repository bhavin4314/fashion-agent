"use client";

import * as React from "react";
import { Modal } from "@/components/ui";
import { generateInvoicePdf, type InvoiceOrder, type InvoiceProfile } from "@/lib/invoice";
import { formatOrderId } from "@/lib/utils";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: InvoiceOrder;
  profile: InvoiceProfile;
  invoicePdfUrl: string;
}

export function InvoiceModal({
  isOpen,
  onClose,
  order,
  profile,
  invoicePdfUrl,
}: InvoiceModalProps) {
  const handleDownload = () => {
    const doc = generateInvoicePdf(order, profile);
    doc.save(`invoice-${formatOrderId(order.id)}.pdf`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice ${formatOrderId(order.id)}`}
      className="max-w-[600px] w-full flex flex-col p-4 pt-3 pb-3"
    >
      <div className="flex flex-col gap-2.5 flex-1 min-h-0 items-center">
        <p className="text-xs text-secondary font-medium shrink-0 w-full text-left">
          Generate and download your invoice details below.
        </p>

        <div 
          className="w-full max-h-[72vh] border border-border-light rounded-xl overflow-hidden bg-stone-100 relative shadow-inner"
          style={{ aspectRatio: "210 / 297" }}
        >
          <iframe
            src={`${invoicePdfUrl}#view=Fit&toolbar=0&navpanes=0`}
            className="w-full h-full border-0 block"
            title="Invoice PDF"
            scrolling="no"
          />
        </div>

        <div className="w-full flex justify-end gap-sm pt-3 border-t border-border-light shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-border-light text-secondary rounded-lg text-xs font-bold hover:bg-stone-50 cursor-pointer bg-white"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold cursor-pointer border-none shadow-md"
          >
            Download PDF
          </button>
        </div>
      </div>
    </Modal>
  );
}
