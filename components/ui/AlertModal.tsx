"use client";

import * as React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description: React.ReactNode;
  confirmLabel?: string;
  variant?: "primary" | "destructive";
  icon?: React.ReactNode;
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = "Got it",
  variant = "primary",
  icon,
}: AlertModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={
        <div className="flex items-center gap-2">
          {icon}
          {typeof title === "string" ? <span>{title}</span> : title}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="text-sm text-secondary leading-relaxed">
          {description}
        </div>
        <div className="flex justify-end pt-2">
          <Button
            variant={variant === "destructive" ? "destructive" : "primary"}
            onClick={onClose}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
