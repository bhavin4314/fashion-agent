"use client";

import * as React from "react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { Loader2 } from "lucide-react";
import type { ProductWizardFormValues } from "../schema";

interface Step1MediaProps {
  aiProgress: number;
  handleMockAddFile: () => void;
  handleRemoveImage: (index: number) => void;
  setValue: (name: keyof ProductWizardFormValues, value: any, options?: any) => void;
}

export function Step1Media({
  aiProgress,
  handleMockAddFile,
  handleRemoveImage,
  setValue
}: Step1MediaProps) {
  const { watch, formState: { errors } } = useFormContext<ProductWizardFormValues>();
  const images = watch("images") || [];
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const localUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      setValue("images", [...images, ...localUrls], { shouldValidate: true });
    }
  };

  const triggerFileSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-xxl animate-in fade-in duration-300">
      {/* Hidden Native File Input */}
      <input 
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      
      {/* Drag-drop Upload Slot */}
      <div 
        onClick={triggerFileSelect}
        className="drag-drop-area h-64 flex flex-col items-center justify-center gap-md bg-surface-container-lowest rounded-xl group transition-all hover:bg-primary/5 cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23BA0036FF' stroke-width='2' stroke-dasharray='8%2c 12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`
        }}
      >
        <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-primary text-[48px]">cloud_upload</span>
        </div>
        <div className="text-center">
          <p className="font-headline-md text-headline-md text-on-surface">Drag and drop collection images</p>
          <p className="text-secondary body-md mt-xs">Support for high-resolution PNG, JPG (Max 20MB each)</p>
        </div>
        <button
          type="button"
          onClick={triggerFileSelect}
          className="bg-primary text-on-primary px-xl py-md rounded-xl font-label-md text-label-md hover:opacity-90 transition-all shadow-md active:scale-95 border-none cursor-pointer"
        >
          Upload Images
        </button>
      </div>

      {/* Selected Media Grid */}
      <div className="space-y-lg">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">Selected Media ({images.length})</h2>
          {images.length > 0 && (
            <button
              type="button"
              onClick={() => setValue("images", [], { shouldValidate: true })}
              className="text-primary font-label-md text-label-md hover:underline bg-transparent border-none cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {images.map((img, idx) => {
            let filename = "collection_asset.jpg";
            if (img.includes("loafers") || img.includes("AP1WRLvLL")) {
              filename = "img_40_loafers.jpg";
            } else if (img.includes("blazer") || img.includes("AP1WRLsQg")) {
              filename = "img_41_blazer.jpg";
            } else if (img.includes("dress") || img.includes("AP1WRLsre")) {
              filename = "img_42_dress.jpg";
            } else if (img.startsWith("blob:")) {
              filename = `custom_upload_${idx + 1}.jpg`;
            }

            return (
              <div key={idx} className="relative group aspect-[0.73] bg-surface-container-high rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-[#e2dfde]/30">
                <Image 
                  src={img} 
                  alt={`Asset ${idx + 1}`} 
                  className="w-full h-full object-cover pointer-events-none"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized
                />
                {idx === 0 && (
                  <div className="absolute top-3 left-3 bg-primary/90 text-on-primary px-sm py-xs rounded text-label-sm uppercase tracking-wider animate-in zoom-in-95">
                    Cover
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(idx);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-on-surface/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm hover:bg-error border-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
                <div className="absolute bottom-0 inset-x-0 p-md bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white font-label-sm">{filename}</p>
                </div>
              </div>
            );
          })}
          
          {/* Add More Slot */}
          <div 
            onClick={triggerFileSelect}
            className="aspect-[0.73] border-2 border-dashed border-secondary-container rounded-xl flex flex-col items-center justify-center gap-sm text-secondary hover:border-primary hover:text-primary transition-all cursor-pointer bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-headline-lg">add</span>
            <span className="font-label-md text-label-md">Add More</span>
          </div>
        </div>
        
        {errors.images?.message && (
          <p role="alert" className="text-xs text-red-600 font-bold select-none mt-2">
            {String(errors.images.message)}
          </p>
        )}
      </div>

      {/* AI Processing State Section */}
      <section className="bg-primary/5 rounded-2xl p-xl border border-primary/10">
        <div className="flex items-start gap-lg">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 animate-pulse text-white">
            <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div className="flex-1 space-y-md">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-headline-md text-on-surface">AI Concierge Engine</h3>
              <span className="text-primary font-label-md text-label-md">{aiProgress}% Complete</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${aiProgress}%` }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md pt-md">
              <div className="flex items-center gap-md text-on-surface-variant font-label-md text-xs">
                <span className="material-symbols-outlined text-primary text-body-md" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Analyzing product image...
              </div>
              
              <div className="flex items-center gap-md text-on-surface-variant font-label-md text-xs">
                <span className="material-symbols-outlined text-primary text-body-md" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Detecting clothing attributes...
              </div>
              
              <div className={`flex items-center gap-md font-label-md text-xs transition-colors duration-300`}>
                {aiProgress >= 100 ? (
                  <span className="material-symbols-outlined text-primary text-body-md" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                ) : (
                  <span className="material-symbols-outlined text-primary text-body-md animate-spin">sync</span>
                )}
                Extracting style information...
              </div>
              
              <div className={`flex items-center gap-md font-label-md text-xs transition-colors duration-300 ${aiProgress >= 100 ? "text-on-surface-variant" : "text-secondary"}`}>
                {aiProgress >= 100 ? (
                  <span className="material-symbols-outlined text-primary text-body-md" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                ) : (
                  <span className="material-symbols-outlined text-secondary-container text-body-md">pending</span>
                )}
                Generating product draft...
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
