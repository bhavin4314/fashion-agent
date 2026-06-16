"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { FormChips } from "@/components/forms/FormChips";
import type { ProductWizardFormValues } from "../schema";
import { CATEGORY_OPTIONS, GENDER_OPTIONS } from "../constants";

interface Step2GarmentProps {
  isAiProcessing: boolean;
}

export function Step2Garment({ isAiProcessing }: Step2GarmentProps) {
  const { setValue } = useFormContext<ProductWizardFormValues>();

  return (
    <div className="grid grid-cols-12 gap-xxl animate-in fade-in duration-300">
      {/* Left Column: AI Assisted Fields */}
      <div className="col-span-12 md:col-span-7 space-y-xl">
        
        {/* Vision AI Engine Status Banner */}
        <div className={`p-lg rounded-xl border flex items-center justify-between transition-all duration-300 ${
          isAiProcessing 
            ? "bg-primary/5 border-primary/20 animate-pulse" 
            : "bg-emerald-50/50 border-emerald-100"
        }`}>
          <div className="flex items-center gap-md">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
              isAiProcessing ? "bg-primary" : "bg-emerald-500"
            }`}>
              <span className="material-symbols-outlined font-extrabold text-[20px]">
                {isAiProcessing ? "auto_awesome" : "check_circle"}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-800">
                {isAiProcessing ? "Vision AI Assistant" : "Vision AI Analysis"}
              </h4>
              <p className="text-xs text-neutral-500 font-medium">
                {isAiProcessing 
                  ? "Extracting luxury attributes from images..." 
                  : "All specifications successfully extracted & mapped."}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-xs font-extrabold uppercase tracking-widest ${
              isAiProcessing ? "text-primary animate-pulse" : "text-emerald-600"
            }`}>
              {isAiProcessing ? "Analyzing..." : "Complete"}
            </span>
          </div>
        </div>

        {/* Product Title */}
        <div className="flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <label htmlFor="title" className="font-label-md text-on-surface text-sm font-semibold">Product Title</label>
            {!isAiProcessing && (
              <div className="flex items-center gap-xs px-sm py-[2px] bg-primary-fixed rounded-full">
                <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">AI Populated</span>
              </div>
            )}
          </div>
          
          {isAiProcessing ? (
            <div className="w-full h-11 bg-neutral-100 rounded-lg animate-pulse border border-secondary-container/30" />
          ) : (
            <FormInput 
              name="title" 
              label="" 
              placeholder="Product name" 
              className="w-full"
              inputClassName="w-full px-md py-sm border border-outline rounded-lg font-body-md form-focus-ring bg-white"
            />
          )}
        </div>

        {/* Product Description */}
        <div className="flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <label htmlFor="description" className="font-label-md text-on-surface text-sm font-semibold">Editorial Description</label>
            {!isAiProcessing && (
              <div className="flex items-center gap-xs px-sm py-[2px] bg-primary-fixed rounded-full">
                <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">AI Populated</span>
              </div>
            )}
          </div>
          
          {isAiProcessing ? (
            <div className="w-full h-48 bg-neutral-100 rounded-lg animate-pulse border border-secondary-container/30 p-md space-y-3">
              <div className="h-4 bg-neutral-200 rounded w-[90%]" />
              <div className="h-4 bg-neutral-200 rounded w-[95%]" />
              <div className="h-4 bg-neutral-200 rounded w-[85%]" />
              <div className="h-4 bg-neutral-200 rounded w-[80%]" />
              <div className="h-4 bg-neutral-200 rounded w-[60%]" />
            </div>
          ) : (
            <FormTextarea 
              name="description" 
              label="" 
              placeholder="Product description" 
              rows={6}
              className="w-full"
              inputClassName="w-full px-md py-sm border border-outline rounded-lg font-body-md form-focus-ring bg-white leading-relaxed"
            />
          )}
        </div>

        {/* Category Selector (Apparel or Footwear) */}
        <div className="flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-on-surface text-sm font-semibold">Category</label>
            {!isAiProcessing && (
              <div className="flex items-center gap-xs px-sm py-[2px] bg-primary-fixed rounded-full">
                <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">AI Populated</span>
              </div>
            )}
          </div>

          {isAiProcessing ? (
            <div className="w-[200px] h-10 bg-neutral-100 rounded-xl animate-pulse border border-secondary-container/30" />
          ) : (
            <FormChips
              name="category"
              options={CATEGORY_OPTIONS}
              variant="segmented"
              className="max-w-[280px]"
              onChange={(val) => {
                setValue("sizes", [], { shouldValidate: false });
                if (val !== "apparel") {
                  setValue("fit", null, { shouldValidate: false });
                }
              }}
            />
          )}
        </div>

        {/* Gender Target Toggle */}
        <div className="flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-on-surface text-sm font-semibold">Gender Target</label>
            {!isAiProcessing && (
              <div className="flex items-center gap-xs px-sm py-[2px] bg-primary-fixed rounded-full">
                <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">AI Populated</span>
              </div>
            )}
          </div>

          {isAiProcessing ? (
            <div className="w-[300px] h-10 bg-neutral-100 rounded-xl animate-pulse border border-secondary-container/30" />
          ) : (
            <FormChips
              name="gender"
              options={GENDER_OPTIONS}
              variant="segmented"
              className="max-w-[340px]"
            />
          )}
        </div>

      </div>

      {/* Right Column: Manual Inputs (Never Skeleton) */}
      <div className="col-span-12 md:col-span-5 space-y-xl border-t md:border-t-0 md:border-l border-outline-variant pt-lg md:pt-0 md:pl-xxl">
        
        <h3 className="text-sm font-bold text-neutral-800 border-b pb-sm mb-md flex items-center gap-sm">
          <span className="material-symbols-outlined text-[20px] text-secondary">inventory_2</span>
          Foundational Tracking
        </h3>

        {/* Retail Price (USD) */}
        <div className="flex flex-col gap-sm">
          <label htmlFor="price" className="font-label-md text-on-surface text-sm font-semibold">Retail Price</label>
          <FormInput
            name="price"
            label=""
            type="number"
            placeholder="0.00"
            min={0}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                e.preventDefault();
              }
            }}
            onPaste={(e) => {
              const pasteData = e.clipboardData.getData("text");
              if (Number(pasteData) < 0 || pasteData.includes("-")) {
                e.preventDefault();
              }
            }}
            leftIcon={<span className="font-bold text-on-surface">₹</span>}
            inputClassName="bg-white font-bold"
          />
        </div>

        {/* Stock Quantity */}
        <div className="flex flex-col gap-sm">
          <label htmlFor="stock_quantity" className="font-label-md text-on-surface text-sm font-semibold">Stock Quantity</label>
          <FormInput
            name="stock_quantity"
            label=""
            type="number"
            placeholder="0"
            min={0}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+" || e.key === ".") {
                e.preventDefault();
              }
            }}
            onPaste={(e) => {
              const pasteData = e.clipboardData.getData("text");
              if (Number(pasteData) < 0 || pasteData.includes("-") || pasteData.includes(".")) {
                e.preventDefault();
              }
            }}
            leftIcon={<span className="material-symbols-outlined text-[20px]">inventory</span>}
            inputClassName="bg-white"
          />
        </div>

        {/* Inventory Notes */}
        {/* <div className="pt-xl">
          <div className="p-lg rounded-xl bg-surface-container-high/50 border border-dashed border-outline flex items-start gap-sm">
            <span className="material-symbols-outlined text-primary shrink-0 mt-0.5">info</span>
            <div className="space-y-1">
              <h4 className="font-label-md text-on-surface mb-xs flex items-center gap-sm text-xs font-bold uppercase tracking-wider text-neutral-600">
                Inventory Notes
              </h4>
              <p className="text-label-sm text-secondary leading-relaxed text-xs text-neutral-500">
                Initial stock allocated to global boutiques. Synchronized across Milan, Paris, and New York hubs.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
