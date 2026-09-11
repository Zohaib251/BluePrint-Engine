"use client";

import React from "react";
import { AlertTriangle, ShieldCheck, Clock } from "lucide-react";

interface RetentionBannerProps {
  isAdmin: boolean;
}

/**
 * Shadcn-styled Retention Alert Banner Block.
 * Displays data retention policy for standard users (30-day TTL) or permanent exemption for admins.
 */
export default function RetentionBanner({ isAdmin }: RetentionBannerProps) {
  if (isAdmin) {
    return (
      <div className="w-full bg-emerald-950/30 border border-emerald-800/50 rounded-2xl p-4 flex items-center justify-between text-xs text-muted-foreground shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-900/40 text-emerald-400 border border-emerald-700/50 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-foreground">Superuser Data Exemption:</span>{" "}
            Your architecture blueprints are protected from the automated 30-day lifecycle daemon and retained permanently.
          </div>
        </div>
        <span className="hidden sm:inline font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-lg text-[10px] font-bold">
          PERMANENT TTL
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-card/70 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between text-xs text-muted-foreground shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-foreground">30-Day Lifecycle Notice:</span>{" "}
          Unsaved cloud documents are automatically pruned after 30 days. Export PDF or Markdown copies to retain offline archives.
        </div>
      </div>
      <span className="hidden sm:inline font-mono bg-secondary text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-lg text-[10px] font-semibold">
        30-DAY LIFECYCLE
      </span>
    </div>
  );
}
