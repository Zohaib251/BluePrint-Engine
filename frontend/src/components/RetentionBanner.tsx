"use client";

import React from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";

interface RetentionBannerProps {
  isAdmin: boolean;
}

/**
 * RetentionBanner component.
 * Displays prominent data retention warning for standard users (30 days pruning)
 * or permanent retention confirmation for admin users.
 */
export default function RetentionBanner({ isAdmin }: RetentionBannerProps) {
  if (isAdmin) {
    return (
      <div className="w-full bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex items-center justify-between text-xs text-gray-300 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gray-800 text-gray-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="font-semibold text-gray-100">Admin Data Privilege:</span>{" "}
            Your PRD histories are explicitly exempted from data pruning and enjoy <strong className="text-gray-100">permanent data retention</strong>.
          </div>
        </div>
        <span className="hidden sm:inline font-mono bg-gray-800 text-gray-300 px-2.5 py-1 rounded text-[11px]">
          UNLIMITED QUOTA
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between text-xs text-gray-300 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-gray-800 text-gray-200">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <span className="font-semibold text-gray-100">Notice:</span>{" "}
          As a standard user, generated PRD history records are <strong className="text-gray-100">automatically deleted after 30 days</strong>. Download Markdown or PDF copies for long-term storage.
        </div>
      </div>
      <span className="hidden sm:inline font-mono bg-gray-800 text-gray-300 px-2.5 py-1 rounded text-[11px]">
        30-DAY RETENTION
      </span>
    </div>
  );
}
