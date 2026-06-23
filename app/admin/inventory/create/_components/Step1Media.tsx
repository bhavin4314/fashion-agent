"use client";

import * as React from "react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import type { ProductWizardFormValues } from "../schema";

interface Step1MediaProps {
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  isUploading: boolean;
  uploadProgress: Record<number, number>;
}

export function Step1Media({
  selectedFiles,
  setSelectedFiles,
  isUploading,
  uploadProgress
}: Step1MediaProps) {
  const { watch, setValue, setError, clearErrors, formState: { errors } } = useFormContext<ProductWizardFormValues>();
  const imageUrls = watch("image_urls") || [];
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) {
      clearErrors("image_urls");

      // Check count limit
      if (imageUrls.length + selected.length > 4) {
        setError("image_urls", {
          type: "custom",
          message: "You can upload a maximum of 4 images."
        });
        return;
      }

      // Check size limit (5MB = 5 * 1024 * 1024 bytes)
      const MAX_SIZE = 5 * 1024 * 1024;
      const oversizedFiles = selected.filter((file) => file.size > MAX_SIZE);
      if (oversizedFiles.length > 0) {
        setError("image_urls", {
          type: "custom",
          message: `Each image must be less than 5MB. Oversized: ${oversizedFiles.map(f => f.name).join(", ")}`
        });
        return;
      }

      setSelectedFiles((prev) => [...prev, ...selected]);
      const localUrls = selected.map((file) => URL.createObjectURL(file));
      setValue("image_urls", [...imageUrls, ...localUrls], { shouldValidate: true });
    }
  };

  const triggerFileSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    clearErrors("image_urls");
    
    const targetUrl = imageUrls[index];
    if (targetUrl && targetUrl.startsWith("blob:")) {
      // Find how many blob URLs precede this index
      let blobIndex = 0;
      for (let i = 0; i < index; i++) {
        if (imageUrls[i]?.startsWith("blob:")) {
          blobIndex++;
        }
      }
      // Remove that file from selectedFiles
      setSelectedFiles((prev) => prev.filter((_, i) => i !== blobIndex));
    }
    
    setValue("image_urls", imageUrls.filter((_, i) => i !== index), { shouldValidate: true });
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
        disabled={isUploading}
      />
      
      {errors.image_urls?.message && (
        <p role="alert" className="text-xs text-red-600 font-bold select-none mb-2 animate-in fade-in duration-200">
          {String(errors.image_urls.message)}
        </p>
      )}

      {/* Drag-drop Upload Slot */}
      <div 
        onClick={triggerFileSelect}
        className={`drag-drop-area h-64 flex flex-col items-center justify-center gap-md bg-surface-container-lowest rounded-xl group transition-all ${
          isUploading ? "opacity-50 cursor-not-allowed bg-neutral-50" : "hover:bg-primary/5 cursor-pointer"
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23BA0036FF' stroke-width='2' stroke-dasharray='8%2c 12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`
        }}
      >
        <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-primary text-[48px]">cloud_upload</span>
        </div>
        <div className="text-center">
          <p className="font-headline-md text-headline-md text-on-surface">
            {isUploading ? "Uploading boutique assets..." : "Drag and drop collection images"}
          </p>
          <p className="text-secondary body-md mt-xs">Support for high-resolution PNG, JPG (Max 5MB each)</p>
        </div>
        <button
          type="button"
          onClick={triggerFileSelect}
          disabled={isUploading}
          className={`px-xl py-md rounded-xl font-label-md text-label-md transition-all shadow-md active:scale-95 border-none ${
            isUploading 
              ? "bg-neutral-300 text-neutral-500 cursor-not-allowed" 
              : "bg-primary text-on-primary hover:opacity-90 cursor-pointer"
          }`}
        >
          Upload Images
        </button>
      </div>

      {/* Selected Media Grid */}
      {imageUrls.length > 0 && (
        <div className="space-y-lg">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md text-on-surface">Selected Media ({imageUrls.length})</h2>
            {!isUploading && (
              <button
                type="button"
                onClick={() => {
                  setSelectedFiles([]);
                  setValue("image_urls", [], { shouldValidate: true });
                }}
                className="text-primary font-label-md text-label-md hover:underline bg-transparent border-none cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {imageUrls.map((img, idx) => {
              const file = selectedFiles[idx];
              const filename = file ? file.name : "uploaded_asset.jpg";

              return (
                <div key={idx} className="relative group aspect-[0.73] bg-surface-container-high rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-secondary-container/30">
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
                  {!isUploading && (
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
                  )}

                  {/* Sequential Upload Progress Overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-md text-white select-none animate-in fade-in duration-200">
                      {uploadProgress[idx] === undefined ? (
                        <div className="flex flex-col items-center gap-xs">
                          <span className="material-symbols-outlined text-neutral-400 animate-pulse text-[24px]">pending</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300">Queued</span>
                        </div>
                      ) : uploadProgress[idx] < 100 ? (
                        <div className="w-full flex flex-col items-center gap-sm px-xs text-center">
                          <span className="material-symbols-outlined text-primary text-[28px] animate-spin">sync</span>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-white">Uploading {uploadProgress[idx]}%</span>
                          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-100" style={{ width: `${uploadProgress[idx]}%` }} />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-xs">
                          <span className="material-symbols-outlined text-emerald-400 text-[32px] animate-in zoom-in duration-300">check_circle</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Uploaded</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="absolute bottom-0 inset-x-0 p-md bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white font-label-sm truncate">{filename}</p>
                  </div>
                </div>
              );
            })}
            
            {/* Add More Slot */}
            {!isUploading ? (
              <div 
                onClick={triggerFileSelect}
                className="aspect-[0.73] border-2 border-dashed border-secondary-container rounded-xl flex flex-col items-center justify-center gap-sm text-secondary hover:border-primary hover:text-primary transition-all cursor-pointer bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-headline-lg">add</span>
                <span className="font-label-md text-label-md">Add More</span>
              </div>
            ) : (
              <div className="aspect-[0.73] border-2 border-dashed border-neutral-300 bg-neutral-50 rounded-xl flex flex-col items-center justify-center gap-sm text-neutral-400 opacity-60 cursor-not-allowed">
                <span className="material-symbols-outlined text-headline-lg">cloud_sync</span>
                <span className="font-label-md text-label-md">Uploading...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
