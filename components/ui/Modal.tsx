import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  size = "md",
}: ModalProps) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        {/* Backdrop overlay with blur */}
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        
        {/* Modal Content container */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPrimitive.Content
            className={cn(
              // Elevation Level 3 shadow from DESIGN.md: shadow-[0px_12px_28px_rgba(0,0,0,0.15)]
              // Shape corner radius from DESIGN.md: rounded-xl (12px)
              "relative w-full bg-white p-6 shadow-[0px_12px_28px_rgba(0,0,0,0.15)] rounded-xl outline-none border border-border-light flex flex-col",
              "transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
              
              // Size options
              size === "sm" && "max-w-[384px]",
              size === "md" && "max-w-[448px]",
              size === "lg" && "max-w-[512px]",
              size === "xl" && "max-w-[576px]",
              size === "full" && "max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]",
              
              className
            )}
          >
            {/* Header */}
            <div className="flex flex-col gap-1.5 pr-6 shrink-0">
              <DialogPrimitive.Title className="text-xl font-bold text-on-surface tracking-tight">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="text-sm text-secondary">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>

            {/* Main content body */}
            <div className="mt-4 text-on-surface flex-1 min-h-0 flex flex-col">{children}</div>

            {/* Accessible close button */}
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-1 text-secondary hover:bg-surface-container hover:text-on-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
