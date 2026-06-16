"use client";

import * as React from "react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { FormChips } from "@/components/forms/FormChips";
import type { ProductWizardFormValues } from "../schema";
import {
  SEASON_OPTIONS,
  APPAREL_SIZES_PRESET,
  FOOTWEAR_SIZES_PRESET,
  MATERIALS_PRESET,
  AESTHETICS_PRESET,
  OCCASIONS_PRESET,
  FIT_PRESETS,
} from "../constants";

const DEFAULT_COVER_IMAGE = "https://lh3.googleusercontent.com/aida/AP1WRLvLL6pm-reCPtRqMuprVJq4uYIgYkhYYLqHWsE0UA6esWCrdw_zH-fh_LniYZdGk-ouobVfNHzV74tZoBdHtBSKqh4OCjfxz9QNJAhvkuxHhxyv3VIigNXUqpF6ojbWql1J8BEF3oz1BK7luzIchjg4Gfw4jDd7wZ1M3OVo5RtsfB4UC2FpEyv22L67TslEsiK9VeXGf8hDTYZU_hS2ru9gopffwK26WF6J955O-XdvsR83YvANEwRPTg";

interface Step3MetadataProps {
  editId?: string;
  handleFinalSubmitTrigger: () => void;
}

export function Step3Metadata({ editId, handleFinalSubmitTrigger }: Step3MetadataProps) {
  const { watch } = useFormContext<ProductWizardFormValues>();

  const imageUrls = watch("image_urls") || [];
  const title = watch("title") || "";
  const price = watch("price");
  const stockQuantity = watch("stock_quantity");
  const category = watch("category") || "apparel";
  const gender = watch("gender") || "Unisex";
  const season = watch("season") || [];
  const sizes = watch("sizes") || [];
  const aesthetics = watch("aesthetics") || [];
  const occasions = watch("occasions") || [];
  const materials = watch("materials") || [];
  const fit = watch("fit") || "";

  const availableSizes = category === "apparel" ? APPAREL_SIZES_PRESET : FOOTWEAR_SIZES_PRESET;

  return (
    <div className="grid grid-cols-12 gap-lg animate-in fade-in duration-300">
      
      {/* Bento Classifications Columns */}
      <div className="col-span-12 md:col-span-8 space-y-lg">
        
        {/* Section: Seasonality */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg bg-white shadow-xs">
          <h3 className="font-label-md text-tertiary mb-md flex items-center gap-sm font-bold text-sm">
            <span className="material-symbols-outlined text-[20px] text-primary">wb_sunny</span>
            Seasonality Selection
          </h3>
          
          <div>
            <label className="block font-label-sm text-on-surface-variant mb-sm uppercase tracking-wider text-[11px] font-bold text-neutral-500">Season (Multi-select)</label>
            <FormChips
              name="season"
              options={SEASON_OPTIONS}
              multiple={true}
            />
          </div>
        </div>

        {/* Dynamic Size Selection bento container (ACTION B) */}
        {category !== "accessories" && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg bg-white shadow-xs">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-label-md text-tertiary flex items-center gap-sm font-bold text-sm">
                <span className="material-symbols-outlined text-[20px] text-primary">straighten</span>
                Size Selection
              </h3>
              <span className="text-[10px] font-bold text-primary uppercase bg-primary-fixed px-sm py-[2px] rounded-full flex items-center gap-xs">
                <span className="material-symbols-outlined text-[13px]">tune</span>
                Filtered for {category === "apparel" ? "Apparel" : "Footwear"}
              </span>
            </div>
            
            <div className="space-y-xl">
              <div>
                <label className="block font-label-sm text-on-surface-variant mb-sm uppercase tracking-wider text-[11px] font-bold text-neutral-500">Available sizes (Multi-select)</label>
                <FormChips
                  name="sizes"
                  options={availableSizes}
                  multiple={true}
                  allowCustom={true}
                  customPlaceholder="Custom size..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Conditional Render Row: Garment Fit (ACTION B) */}
        {category === "apparel" && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg bg-white shadow-xs">
            <h3 className="font-label-md text-tertiary mb-md flex items-center gap-sm font-bold text-sm">
              <span className="material-symbols-outlined text-[20px] text-primary">accessibility</span>
              Garment Fit
            </h3>
            
            <div className="space-y-md">
              <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px] font-bold text-neutral-500">
                Fit choice
              </label>
              <FormChips
                name="fit"
                options={FIT_PRESETS}
                allowCustom={true}
                customPlaceholder="Or type custom fit (e.g. Extra Oversized)"
              />
            </div>
          </div>
        )}

        {/* Section: Aesthetics & Occasions */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg bg-white shadow-xs space-y-xl">
          <div>
            <h3 className="font-label-md text-tertiary mb-md flex items-center gap-sm font-bold text-sm">
              <span className="material-symbols-outlined text-[20px] text-primary">palette</span>
              Stylist Aesthetics
            </h3>
            <label className="block font-label-sm text-on-surface-variant mb-sm uppercase tracking-wider text-[11px] font-bold text-neutral-500">Aesthetics Selection</label>
            <FormChips
              name="aesthetics"
              options={AESTHETICS_PRESET}
              multiple={true}
              allowCustom={true}
              customPlaceholder="Custom aesthetic..."
            />
          </div>

          <div className="border-t border-neutral-100 pt-xl">
            <h3 className="font-label-md text-tertiary mb-md flex items-center gap-sm font-bold text-sm">
              <span className="material-symbols-outlined text-[20px] text-primary">celebration</span>
              Wear Occasions
            </h3>
            <label className="block font-label-sm text-on-surface-variant mb-sm uppercase tracking-wider text-[11px] font-bold text-neutral-500">Occasions Selection</label>
            <FormChips
              name="occasions"
              options={OCCASIONS_PRESET}
              multiple={true}
              allowCustom={true}
              customPlaceholder="Custom occasion..."
            />
          </div>
        </div>

        {/* Section: Material Composition */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg bg-white shadow-xs">
          <h3 className="font-label-md text-tertiary mb-md flex items-center gap-sm font-bold text-sm">
            <span className="material-symbols-outlined text-[20px] text-primary">texture</span>
            Materials Composition
          </h3>
          
          <div className="space-y-xl">
            <div>
              <label className="block font-label-sm text-on-surface-variant mb-sm uppercase tracking-wider text-[11px] font-bold text-neutral-500">Select materials</label>
              <FormChips
                name="materials"
                options={MATERIALS_PRESET}
                multiple={true}
                allowCustom={true}
                customPlaceholder="Custom material..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Review Sidebar Card */}
      <div className="col-span-12 md:col-span-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden sticky top-xxl shadow-xs bg-white">
          <div className="relative h-48 overflow-hidden group">
            <Image 
              src={imageUrls[0] || DEFAULT_COVER_IMAGE} 
              alt="Preview Cover" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-md left-md right-md text-white">
              <p className="font-label-sm opacity-80 mb-xs uppercase text-[10px] tracking-widest font-extrabold">Preview Catalog Profile</p>
              <h4 className="font-headline-md leading-tight truncate font-bold">{title || "Untitled Product"}</h4>
            </div>
          </div>

          <div className="p-lg space-y-md">
            
            <div className="flex justify-between items-center py-sm border-b border-surface-container text-xs">
              <span className="text-tertiary font-bold uppercase tracking-wider">Category</span>
              <span className="font-bold text-primary uppercase">
                {category}
              </span>
            </div>

            <div className="flex justify-between items-center py-sm border-b border-surface-container text-xs">
              <span className="text-tertiary font-bold uppercase tracking-wider">Price</span>
              <span className="font-bold text-on-surface">
                ₹{price ? Number(price).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}
              </span>
            </div>

            <div className="flex justify-between items-center py-sm border-b border-surface-container text-xs">
              <span className="text-tertiary font-bold uppercase tracking-wider">Stock</span>
              <span className="font-bold text-on-surface">
                {stockQuantity ? Number(stockQuantity) : 0} Units
              </span>
            </div>

            {category === "apparel" && fit && (
              <div className="flex justify-between items-center py-sm border-b border-surface-container text-xs">
                <span className="text-tertiary font-bold uppercase tracking-wider">Fit</span>
                <span className="font-bold text-on-surface">
                  {fit}
                </span>
              </div>
            )}

            <div>
              <span className="block text-tertiary font-label-sm mb-sm uppercase text-[10px] tracking-widest font-extrabold">Selected Tags</span>
              <div className="flex flex-wrap gap-xs">
                {gender && (
                  <span className="bg-neutral-100 px-sm py-[2px] rounded text-[10px] font-bold text-neutral-600 uppercase">
                    {gender}
                  </span>
                )}
                {season && season.length > 0 && (
                  <span className="bg-neutral-100 px-sm py-[2px] rounded text-[10px] font-bold text-neutral-600 uppercase">
                    {Array.isArray(season) ? season.join(", ") : season}
                  </span>
                )}
                {aesthetics.slice(0, 2).map((a) => (
                  <span key={a} className="bg-neutral-100 px-sm py-[2px] rounded text-[10px] font-bold text-neutral-600 uppercase">
                    {a}
                  </span>
                ))}
                {materials.slice(0, 2).map((m) => (
                  <span key={m} className="bg-neutral-100 px-sm py-[2px] rounded text-[10px] font-bold text-neutral-600 uppercase">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinalSubmitTrigger}
              className="w-full bg-primary text-white hover:brightness-105 py-md px-lg rounded-xl font-bold mt-lg transition-all active:scale-95 shadow-md flex items-center justify-center gap-md border-none cursor-pointer text-xs uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              {editId ? "Update Product" : "Create Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
