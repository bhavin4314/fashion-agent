import * as React from "react";
import { UploadCloud, File, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface FileUploadProps {
  accept?: string;
  maxSizeMB?: number;
  value?: File;
  onChange?: (file: File | undefined) => void;
  "aria-invalid"?: boolean;
  className?: string;
}

export function FileUpload({
  accept,
  maxSizeMB = 5,
  value,
  onChange,
  "aria-invalid": ariaInvalid,
  className,
}: FileUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const validateAndSetFile = (file: File | undefined) => {
    setError(null);
    if (!file) {
      onChange?.(undefined);
      return;
    }

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    // Validate file type (basic extension or MIME type check)
    if (accept) {
      const acceptedTypes = accept.split(",").map((type) => type.trim().toLowerCase());
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      
      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return fileName.endsWith(type);
        }
        if (type.endsWith("/*")) {
          const prefix = type.slice(0, -2);
          return fileType.startsWith(prefix);
        }
        return fileType === type;
      });

      if (!isAccepted) {
        setError(`Invalid file type. Accepted formats: ${accept}`);
        return;
      }
    }

    onChange?.(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    validateAndSetFile(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />
      
      {value ? (
        // File selected state
        <div className="flex items-center justify-between p-4 bg-white border border-border-light rounded-xl shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-surface-container-low rounded-lg text-secondary">
              <File className="h-5 w-5" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-on-surface truncate">
                {value.name}
              </span>
              <span className="text-xs text-secondary">
                {(value.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFile}
            className="p-1.5 h-auto rounded-lg text-secondary hover:bg-surface-container-low"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        // Drag and drop zone
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={cn(
            "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer bg-white transition-all duration-200 hover:bg-surface-container-low",
            isDragActive ? "border-brand bg-brand/5" : ariaInvalid || error ? "border-error" : "border-border-light",
            "focus-within:border-charcoal"
          )}
        >
          <UploadCloud className={cn("h-8 w-8 mb-2 text-secondary", isDragActive && "text-brand")} />
          <p className="text-sm font-semibold text-on-surface">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-secondary mt-1">
            {accept ? `${accept.toUpperCase()} files` : "All files"} up to {maxSizeMB}MB
          </p>
          {error && (
            <p className="text-xs text-error mt-2 font-medium" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
