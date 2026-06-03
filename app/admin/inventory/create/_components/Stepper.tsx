"use client";

import * as React from "react";
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: 1 | 2 | 3;
  onStepClick?: (step: 1 | 2 | 3) => void;
}

export function Stepper({ currentStep, onStepClick }: StepperProps) {
  const steps = [
    { id: 1, label: "Upload Images" },
    { id: 2, label: "Product Information" },
    { id: 3, label: "AI Metadata Review" }
  ] as const;

  return (
    <div className="w-full max-w-3xl mb-xl mt-md flex flex-col items-center select-none">
      <div className="flex items-center w-full relative">
        {/* Continuous background progress line connecting steps */}
        <div className="absolute top-5 left-0 w-full h-[2px] bg-[#e2dfde] z-0" />
        
        {/* Dynamic active progress fill */}
        <div 
          className="absolute top-5 left-0 h-[2px] bg-[#ba0036] transition-all duration-500 ease-in-out z-0" 
          style={{ 
            width: currentStep === 1 ? "16.6%" : currentStep === 2 ? "50%" : "100%" 
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isPending = currentStep < step.id;

          return (
            <div key={step.id} className="flex-1 flex flex-col items-center relative z-10">
              <button
                type="button"
                onClick={() => onStepClick?.(step.id)}
                disabled={isPending}
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-sm font-bold text-xs border-2 transition-all duration-300 ${
                  isActive
                    ? "bg-white border-[#ba0036] text-[#ba0036] shadow-sm scale-110 font-extrabold ring-4 ring-[#ba0036]/10"
                    : isCompleted
                    ? "bg-[#ba0036] border-[#ba0036] text-white shadow-xs"
                    : "bg-white border-[#e2dfde] text-[#5f5e5e] cursor-not-allowed hover:bg-stone-50"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                ) : (
                  <span>{step.id}</span>
                )}
              </button>
              <span 
                className={`text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 ${
                  isActive 
                    ? "text-[#ba0036] font-extrabold" 
                    : isCompleted
                    ? "text-[#1a1c1c] font-bold"
                    : "text-[#5f5e5e]"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
