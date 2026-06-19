"use client";

import * as React from "react";

interface TrackingTimelineProps {
  status: string;
}

export function TrackingTimeline({ status }: TrackingTimelineProps) {
  const isCancelled = status.toLowerCase() === "cancelled";
  const steps = isCancelled
    ? [
        { status: "ordered", label: "Ordered", desc: "Your purchase request has been successfully placed." },
        { status: "cancelled", label: "Cancelled", desc: "The order was called off either by you, the seller, or Flipkart.", isRed: true },
      ]
    : [
        { status: "ordered", label: "Ordered", desc: "Your purchase request has been successfully placed." },
        { status: "confirmed", label: "Order Confirmed", desc: "The seller has acknowledged the order and verified stock availability." },
        { status: "shipped", label: "Shipped", desc: "The item has been packed and handed over to a courier partner (like Ekart)." },
        { status: "out_for_delivery", label: "Out for Delivery", desc: "The package has reached your local delivery hub and is in transit to your address." },
        { status: "delivered", label: "Delivered", desc: "The order has successfully reached you." },
      ];

  const activeIndex = steps.findIndex((s) => s.status === status.toLowerCase());

  return (
    <div className="p-lg md:p-xl bg-stone-50 rounded-2xl border border-border-light select-none">
      {/* Desktop Stepper (md and up) */}
      <div className="hidden md:block relative w-full pt-4 pb-2">
        {/* Horizontal tracking lines */}
        <div className="absolute h-1 left-8 right-8 top-8 bg-stone-200 rounded-full" />
        <div className="absolute h-1 left-8 right-8 top-8">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isCancelled ? "bg-red-600" : "bg-neutral-900"
            }`}
            style={{
              width: `${activeIndex <= 0 ? 0 : (activeIndex / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Stepper Dots & Labels */}
        <div className="flex justify-between items-start w-full relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = idx < activeIndex;
            const isActive = idx === activeIndex;

            return (
              <div key={step.status} className="flex flex-col items-center w-36 text-center select-none">
                {/* Dot */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isCompleted
                      ? step.isRed
                        ? "bg-red-600 text-white"
                        : "bg-neutral-900 text-white"
                      : isActive
                      ? step.isRed
                        ? "bg-white border-4 border-red-600 text-red-600 scale-110 shadow-sm"
                        : "bg-white border-4 border-neutral-900 text-neutral-900 scale-110 shadow-sm"
                      : "bg-stone-100 border-2 border-stone-200 text-stone-400"
                  }`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>
                {/* Label */}
                <span
                  className={`text-xs mt-sm transition-all ${
                    isActive
                      ? step.isRed
                        ? "font-extrabold text-red-600"
                        : "font-extrabold text-charcoal"
                      : isCompleted
                      ? "font-bold text-charcoal"
                      : "font-semibold text-secondary"
                  }`}
                >
                  {step.label}
                </span>
                {/* Description */}
                <p className="text-[10px] text-secondary/70 leading-normal mt-xs max-w-[120px] font-medium">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Stepper (under md) */}
      <div className="block md:hidden relative pl-10 py-2 space-y-md">
        {/* Vertical Line */}
        <div className="absolute left-[16px] top-4 bottom-4 w-1 bg-stone-200 rounded-full" />
        <div className="absolute left-[16px] top-4 bottom-4 w-1">
          <div
            className={`w-full rounded-full transition-all duration-700 ${
              isCancelled ? "bg-red-600" : "bg-neutral-900"
            }`}
            style={{
              height: `${activeIndex <= 0 ? 0 : (activeIndex / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Stepper Items */}
        {steps.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;

          return (
            <div key={step.status} className="flex gap-md items-start select-none">
              {/* Vertical Dot */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 relative z-10 transition-all duration-300 -ml-10 ${
                  isCompleted
                    ? step.isRed
                      ? "bg-red-600 text-white"
                      : "bg-neutral-900 text-white"
                    : isActive
                    ? step.isRed
                      ? "bg-white border-4 border-red-600 text-red-600 scale-105"
                      : "bg-white border-4 border-neutral-900 text-neutral-900 scale-105"
                    : "bg-stone-100 border-2 border-stone-200 text-stone-400"
                }`}
              >
                {isCompleted ? "✓" : idx + 1}
              </div>
              {/* Text Info */}
              <div className="flex flex-col">
                <span
                  className={`text-xs transition-all ${
                    isActive
                      ? step.isRed
                        ? "font-extrabold text-red-600"
                        : "font-extrabold text-charcoal"
                      : isCompleted
                      ? "font-bold text-charcoal"
                      : "font-semibold text-secondary"
                  }`}
                >
                  {step.label}
                </span>
                <p className="text-[10px] text-secondary/70 leading-normal mt-0.5 max-w-xs font-medium">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
