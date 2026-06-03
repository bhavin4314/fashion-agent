"use client";

import * as React from "react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import type { ProductWizardFormValues } from "../schema";

const DEFAULT_COVER_IMAGE = "https://lh3.googleusercontent.com/aida/AP1WRLvLL6pm-reCPtRqMuprVJq4uYIgYkhYYLqHWsE0UA6esWCrdw_zH-fh_LniYZdGk-ouobVfNHzV74tZoBdHtBSKqh4OCjfxz9QNJAhvkuxHhxyv3VIigNXUqpF6ojbWql1J8BEF3oz1BK7luzIchjg4Gfw4jDd7wZ1M3OVo5RtsfB4UC2FpEyv22L67TslEsiK9VeXGf8hDTYZU_hS2ru9gopffwK26WF6J955O-XdvsR83YvANEwRPTg";

interface Step3MetadataProps {
  toggleSize: (sz: string) => void;
  toggleMaterial: (m: string) => void;
  handleAddNewMaterial: (e: React.FormEvent) => void;
  customMaterial: string;
  setCustomMaterial: (val: string) => void;
  showAddMaterialInput: boolean;
  setShowAddMaterialInput: (val: boolean) => void;
  handleFinalSubmitTrigger: () => void;
}

export function Step3Metadata({
  toggleSize,
  toggleMaterial,
  handleAddNewMaterial,
  customMaterial,
  setCustomMaterial,
  showAddMaterialInput,
  setShowAddMaterialInput,
  handleFinalSubmitTrigger
}: Step3MetadataProps) {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { watch, setValue, formState: { errors } } = useFormContext<ProductWizardFormValues>();

  const images = watch("images") || [];
  const title = watch("title") || "";
  const price = watch("price");
  const stock = watch("stock");
  const gender = watch("gender");
  const season = watch("season");
  const sizes = watch("sizes") || [];
  const aesthetic = watch("aesthetic") || "";
  const occasion = watch("occasion") || "";
  const materials = watch("materials") || [];
  const fit = watch("fit");

  return (
    <div className="grid grid-cols-12 gap-lg animate-in fade-in duration-300">
      
      {/* Bento Classifications Columns */}
      <div className="col-span-12 md:col-span-8 space-y-lg">
        
        {/* Section: Core Attributes */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg bg-white">
          <h3 className="font-label-md text-[#5c5c5c] mb-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-[20px]">category</span>
            Classification &amp; Seasonality
          </h3>
          
          <div className="space-y-xl">
            {/* Gender */}
            <div>
              <label className="block font-label-sm text-on-surface-variant mb-sm uppercase tracking-wider text-xs">Target Gender</label>
              <div className="flex flex-wrap gap-sm">
                {(["Men", "Women", "Unisex"] as const).map((g) => {
                  const isActive = gender === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setValue("gender", g, { shouldValidate: true })}
                      className={
                        isActive
                          ? "px-lg py-base rounded-lg bg-primary text-on-primary shadow-md font-bold font-label-md transition-all cursor-pointer border-none"
                          : "px-lg py-base rounded-lg border border-outline-variant hover:bg-surface-container transition-all font-label-md text-charcoal cursor-pointer"
                      }
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Season */}
            <div>
              <label className="block font-label-sm text-on-surface-variant mb-sm uppercase tracking-wider text-xs">Season</label>
              <div className="flex flex-wrap gap-sm">
                {(["Summer", "Autumn", "Winter", "Spring"] as const).map((s) => {
                  const isActive = season === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setValue("season", s, { shouldValidate: true })}
                      className={
                        isActive
                          ? "px-lg py-base rounded-lg bg-primary text-on-primary shadow-md font-bold font-label-md transition-all cursor-pointer border-none"
                          : "px-lg py-base rounded-lg border border-outline-variant hover:bg-surface-container transition-all font-label-md text-charcoal cursor-pointer"
                      }
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sizing grid bento container */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg bg-white">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-label-md text-[#5c5c5c] flex items-center gap-sm">
              <span className="material-symbols-outlined text-[20px]">straighten</span>
              Size Selection
            </h3>
            <div className="flex items-center gap-xs px-sm py-[2px] bg-[#ffdada] text-[#ba0036] rounded-full text-[10px] font-bold uppercase">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              AI Generated
            </div>
          </div>
          
          <div className="space-y-xl">
            <div>
              <label className="block font-label-sm text-on-surface-variant mb-sm uppercase tracking-wider text-xs">Footwear Sizing (EU)</label>
              <div className="flex flex-wrap gap-sm">
                {["38", "39", "40", "41", "42", "43", "44", "45"].map((sz) => {
                  const isActive = sizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={
                        isActive
                          ? "px-lg py-base rounded-lg bg-primary text-on-primary shadow-md font-bold font-label-md transition-all cursor-pointer border-none"
                          : "px-lg py-base rounded-lg border border-outline-variant hover:bg-surface-container transition-all font-label-md text-charcoal cursor-pointer"
                      }
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {errors.sizes?.message && (
            <p className="text-[10px] text-red-600 font-bold mt-2">{String(errors.sizes.message)}</p>
          )}
        </div>

        {/* Section: Style & Occasion */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg bg-white">
          <h3 className="font-label-md text-[#5c5c5c] mb-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            AI Style Inference
          </h3>
          
          <div className="space-y-xl">
            {/* Style */}
            <div>
              <label className="block font-label-sm text-on-surface-variant mb-sm uppercase tracking-wider text-xs">Aesthetic</label>
              <div className="flex flex-wrap gap-sm">
                {["Minimal", "Quiet Luxury", "Casual"].map((ae) => {
                  const isActive = aesthetic === ae;
                  return (
                    <button
                      key={ae}
                      type="button"
                      onClick={() => setValue("aesthetic", ae, { shouldValidate: true })}
                      className={
                        isActive
                          ? "px-lg py-base rounded-lg bg-primary text-on-primary shadow-md font-bold font-label-md transition-all cursor-pointer border-none"
                          : "px-lg py-base rounded-lg border border-outline-variant hover:bg-surface-container transition-all font-label-md text-charcoal cursor-pointer"
                      }
                    >
                      {ae}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <label className="block font-label-sm text-on-surface-variant mb-sm uppercase tracking-wider text-xs">Occasion</label>
              <div className="flex flex-wrap gap-sm">
                {["Travel", "Office", "Everyday"].map((oc) => {
                  const isActive = occasion === oc;
                  return (
                    <button
                      key={oc}
                      type="button"
                      onClick={() => setValue("occasion", oc, { shouldValidate: true })}
                      className={
                        isActive
                          ? "px-lg py-base rounded-lg bg-primary text-on-primary shadow-md font-bold font-label-md transition-all cursor-pointer border-none"
                          : "px-lg py-base rounded-lg border border-outline-variant hover:bg-surface-container transition-all font-label-md text-charcoal cursor-pointer"
                      }
                    >
                      {oc}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Composition */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg bg-white">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-label-md text-[#5c5c5c] flex items-center gap-sm">
              <span className="material-symbols-outlined text-[20px]">texture</span>
              Material &amp; Fit
            </h3>
            <button
              type="button"
              onClick={() => setShowAddMaterialInput(!showAddMaterialInput)}
              className="text-primary font-label-md flex items-center gap-xs bg-transparent border-none cursor-pointer text-sm font-bold uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-[18px]">add</span> Add Material
            </button>
          </div>
          
          <div className="space-y-xl">
            {showAddMaterialInput && (
              <div className="flex gap-sm items-center animate-in slide-in-from-top-2 duration-200">
                <input
                  type="text"
                  value={customMaterial}
                  onChange={(e) => setCustomMaterial(e.target.value)}
                  placeholder="Material name..."
                  className="flex-grow px-sm py-1.5 border border-[#e2dfde] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#ba0036] bg-white h-9"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddNewMaterial(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddNewMaterial}
                  className="bg-[#ba0036] hover:bg-[#a0002e] text-white px-md py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer h-9 transition-all active:scale-95"
                >
                  Add
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-sm">
              {materials.map((m) => {
                const isPrimaryTag = ["Suede", "Leather", "Cashmere"].includes(m);
                return (
                  <div 
                    key={m}
                    className={
                      isPrimaryTag
                        ? "px-lg py-base rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center gap-md font-label-md text-xs font-bold uppercase"
                        : "px-lg py-base rounded-lg border border-outline-variant text-secondary flex items-center gap-md font-label-md text-xs font-bold uppercase"
                    }
                  >
                    {m}
                    <span 
                      onClick={() => toggleMaterial(m)} 
                      className="material-symbols-outlined text-[16px] cursor-pointer"
                    >
                      close
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div>
              <label className="block font-label-sm text-on-surface-variant mb-sm uppercase tracking-wider text-xs">Fit</label>
              <div className="flex gap-sm">
                {(["Regular", "Slim"] as const).map((f) => {
                  const isActive = fit === f;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setValue("fit", f, { shouldValidate: true })}
                      className={
                        isActive
                          ? "px-lg py-base rounded-lg bg-primary text-on-primary shadow-md font-bold font-label-md transition-all cursor-pointer border-none"
                          : "px-lg py-base rounded-lg border border-outline-variant hover:bg-surface-container transition-all font-label-md text-charcoal cursor-pointer"
                      }
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Sidebar Card */}
      <div className="col-span-12 md:col-span-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden sticky top-xxl shadow-xs bg-white">
          <div className="relative h-48 overflow-hidden group">
            <Image 
              src={images[0] || DEFAULT_COVER_IMAGE} 
              alt="Preview Cover" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-md left-md right-md text-white">
              <p className="font-label-sm opacity-80 mb-xs uppercase text-[10px] tracking-widest font-extrabold">Preview</p>
              <h4 className="font-headline-md leading-tight truncate">{title || "Loro Summer Walk"}</h4>
            </div>
          </div>

          <div className="p-lg space-y-md">
            <div className="flex justify-between items-center py-sm border-b border-surface-container">
              <span className="text-[#5c5c5c] font-label-md text-xs font-bold uppercase tracking-wider">Price</span>
              <span className="font-bold text-on-surface">
                ${price ? Number(price).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}
              </span>
            </div>

            <div className="flex justify-between items-center py-sm border-b border-surface-container">
              <span className="text-[#5c5c5c] font-label-md text-xs font-bold uppercase tracking-wider">Stock</span>
              <span className="font-bold text-on-surface">
                {stock ? Number(stock) : 0} Units
              </span>
            </div>

            <div>
              <span className="block text-[#5c5c5c] font-label-sm mb-sm uppercase text-[10px] tracking-widest font-extrabold">Selected Tags</span>
              <div className="flex flex-wrap gap-xs">
                {gender && (
                  <span className="bg-surface-container px-sm py-[2px] rounded text-[11px] font-bold text-secondary uppercase">
                    {gender}
                  </span>
                )}
                {season && (
                  <span className="bg-surface-container px-sm py-[2px] rounded text-[11px] font-bold text-secondary uppercase">
                    {season}
                  </span>
                )}
                {aesthetic && (
                  <span className="bg-surface-container px-sm py-[2px] rounded text-[11px] font-bold text-secondary uppercase">
                    {aesthetic}
                  </span>
                )}
                {materials.slice(0, 3).map((m) => (
                  <span key={m} className="bg-surface-container px-sm py-[2px] rounded text-[11px] font-bold text-secondary uppercase">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinalSubmitTrigger}
              className="w-full bg-primary text-on-primary py-md px-lg rounded-xl font-bold font-label-md mt-lg transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-md border-none cursor-pointer text-xs uppercase tracking-widest"
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
