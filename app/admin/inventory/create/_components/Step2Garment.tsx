"use client";

import * as React from "react";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";

export function Step2Garment() {
  return (
    <div className="grid grid-cols-12 gap-xxl animate-in fade-in duration-300">
      {/* Left Column: AI Content */}
      <div className="col-span-12 md:col-span-7 space-y-xl">
        
        {/* Product Name */}
        <div className="flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <label htmlFor="title" className="font-label-md text-on-surface">Product Name</label>
            <div className="flex items-center gap-xs px-sm py-[2px] bg-primary-fixed rounded-full">
              <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">AI Generated</span>
            </div>
          </div>
          <FormInput 
            name="title" 
            label="" 
            placeholder="Product name" 
            className="w-full"
            inputClassName="w-full px-md py-sm border border-outline rounded-lg font-body-md form-focus-ring bg-surface-container-low/30"
          />
        </div>

        {/* Product Description */}
        <div className="flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <label htmlFor="description" className="font-label-md text-on-surface">Product Description</label>
            <div className="flex items-center gap-xs px-sm py-[2px] bg-primary-fixed rounded-full">
              <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">AI Generated</span>
            </div>
          </div>
          <FormTextarea 
            name="description" 
            label="" 
            placeholder="Product description" 
            rows={8}
            className="w-full"
            inputClassName="w-full px-md py-sm border border-outline rounded-lg font-body-md form-focus-ring bg-surface-container-low/30 leading-relaxed"
          />
        </div>
      </div>

      {/* Right Column: Manual Inputs */}
      <div className="col-span-12 md:col-span-5 space-y-xl border-t md:border-t-0 md:border-l border-outline-variant pt-lg md:pt-0 md:pl-xxl">
        
        {/* SKU / Serial Number */}
        <div className="flex flex-col gap-sm">
          <label htmlFor="sku" className="font-label-md text-on-surface">SKU / Serial Number</label>
          <FormInput
            name="sku"
            label=""
            placeholder="e.g. VST-2024-XP-01"
            leftIcon={<span className="material-symbols-outlined text-[20px]">qr_code_2</span>}
            inputClassName="w-full pl-xl pr-md py-sm border border-outline rounded-lg font-body-md form-focus-ring"
          />
        </div>

        {/* Price (USD) */}
        <div className="flex flex-col gap-sm">
          <label htmlFor="price" className="font-label-md text-on-surface">Price (USD)</label>
          <FormInput
            name="price"
            label=""
            type="number"
            placeholder="0.00"
            leftIcon={<span className="font-bold text-on-surface">$</span>}
            inputClassName="w-full pl-xl pr-md py-sm border border-outline rounded-lg font-body-md font-bold form-focus-ring"
          />
        </div>

        {/* Stock Quantity */}
        <div className="flex flex-col gap-sm">
          <label htmlFor="stock" className="font-label-md text-on-surface">Stock Quantity</label>
          <FormInput
            name="stock"
            label=""
            type="number"
            placeholder="0"
            leftIcon={<span className="material-symbols-outlined text-[20px]">inventory</span>}
            inputClassName="w-full pl-xl pr-md py-sm border border-outline rounded-lg font-body-md form-focus-ring"
          />
        </div>

        {/* Inventory Notes */}
        <div className="pt-xl">
          <div className="p-lg rounded-xl bg-surface-container-high/50 border border-dashed border-outline flex items-start gap-sm">
            <span className="material-symbols-outlined text-primary shrink-0 mt-0.5">info</span>
            <div className="space-y-1">
              <h4 className="font-label-md text-on-surface mb-xs flex items-center gap-sm">
                Inventory Notes
              </h4>
              <p className="text-label-sm text-secondary leading-relaxed">
                Initial stock allocated to global boutiques. Synchronized across Milan, Paris, and New York hubs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
