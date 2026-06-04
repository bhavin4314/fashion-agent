"use client";

import * as React from "react";
import { signOutAction } from "@/app/login/actions";

export function AdminLogoutButton() {
  const handleLogout = async () => {
    try {
      await signOutAction();
      window.location.href = "/login";
    } catch (error) {
      console.error("Admin logout failed:", error);
      window.location.href = "/login";
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-sm px-lg py-sm text-on-surface-variant hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider bg-transparent border-none text-left cursor-pointer outline-none"
    >
      <span className="material-symbols-outlined text-[18px]">logout</span>
      Logout
    </button>
  );
}
