import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvatarInitials(name: string): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const firstChar = words[0]?.charAt(0) || "";
    const secondChar = words[1]?.charAt(0) || "";
    return (firstChar + secondChar).toUpperCase();
  }
  if (words.length === 1) {
    const word = words[0] || "";
    return (word.charAt(0) || "").toUpperCase();
  }
  return "";
}

