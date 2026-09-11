"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { listPRDs, deletePRDById, PRDHistory } from "@/lib/api";
import RetentionBanner from "@/components/RetentionBanner";
import PRDViewer from "@/components/PRDViewer";
import PRDGeneratorForm from "@/components/PRDGeneratorForm";
import {
  Trash2,
  FileText,
  RefreshCw,
  Sparkles,
  Layers,
  Database,
  ShieldCheck,
  Search,
  ChevronRight,
  Cpu,
  Clock,
  Activity
} from "lucide-react";

/**
 * User Dashboard Component composed of Shadcn Studio Blocks.
 * Features KPI metrics bar, 2-column studio layout, searchable history, and blueprint viewer.
 */
export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAdmin, refreshUser } = useAuth();

  const [prds, setPrds] = useState<PRDHistory[]>([]);
  const [selectedPrd, setSelectedPrd] = useState<PRDHistory | null>(null);
  const [isFetchingPrds, setIsFetchingPrds] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchHistory = useCallback(async () => {
    setIsFetchingPrds(true);
    try {
      const data = await listPRDs();
      setPrds(data);
      if (data.length > 0 && !selectedPrd) {
        setSelectedPrd(data[0]);
      }
    } catch {
      // Unauthenticated / token expired handled by context
    } finally {
      setIsFetchingPrds(false);
    }
  }, [selectedPrd]);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/signin");
      } else {
        fetchHistory();
      }
    }
  }, [user, isLoading, router, fetchHistory]);

  const handleGenerationSuccess = async (newPrd: PRDHistory) => {
    setPrds((prev) => [newPrd, ...prev]);
    setSelectedPrd(newPrd);
    await refreshUser();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this PRD history record?")) return;

    try {
      await deletePRDById(id);
      setPrds((prev) => prev.filter((p) => p.id !== id));
      if (selectedPrd?.id === id) {
        setSelectedPrd(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete PRD.");
    }
  };

  const filteredPrds = prds.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quotaCount = user?.generation_count || 0;
  const quotaPercentage = Math.min(100, Math.round((quotaCount / 5) * 100));

  if (isLoading || (!user && isFetchingPrds)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] space-y-3">
        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Cpu className="w-4 h-4 text-primary animate-spin" />
        </div>
        <p className="text-xs font-mono text-muted-foreground">Loading Architectural Studio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-2">
      {/* ========================================================================= */}
      {/* BLOCK 1: TOP KPI STATS ROW                                               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Quota Usage */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Monthly Free Quota</span>
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-foreground">
              {isAdmin ? "Unlimited" : `${quotaCount} / 5`}
            </span>
            <span className="text-[10px] font-mono text-primary">
              {isAdmin ? "ADMIN TIER" : `${5 - quotaCount} remaining`}
            </span>
          </div>
          {!isAdmin && (
            <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${quotaPercentage}%` }}
              />
            </div>
          )}
        </div>

        {/* Stat 2: Total Generated */}
        <div className="p-4 rounded-2xl bg-card/70 border border-border space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Stored Blueprints</span>
            <FileText className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-foreground">{prds.length}</div>
          <p className="text-[11px] text-muted-foreground font-mono">Active architecture documents</p>
        </div>

        {/* Stat 3: Engine Latency */}
        <div className="p-4 rounded-2xl bg-card/70 border border-border space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Synthesis Latency</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-foreground">~2.8s</span>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
              FAST
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground font-mono">Google Gemini 3.5 Flash-Lite</p>
        </div>

        {/* Stat 4: Security Shield */}
        <div className="p-4 rounded-2xl bg-card/70 border border-border space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Security Layer</span>
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-sm font-bold text-foreground flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Anti-Inspect Active</span>
          </div>
          <p className="text-[11px] text-muted-foreground font-mono">Capture-phase input lockdown</p>
        </div>
      </div>

      {/* Retention Policy Banner */}
      <RetentionBanner isAdmin={isAdmin} />

      {/* ========================================================================= */}
      {/* BLOCK 2: STUDIO WORKSPACE (2 COLUMNS)                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & History List (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* PRD Generative Studio Block */}
          <PRDGeneratorForm onSuccess={handleGenerationSuccess} />

          {/* History Search & Drawer Block */}
          <div className="rounded-2xl p-5 bg-card/60 border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                  Blueprint Repository ({prds.length})
                </span>
              </div>
              <button
                onClick={fetchHistory}
                disabled={isFetchingPrds}
                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isFetchingPrds ? "animate-spin" : ""}`} />
                <span>Sync</span>
              </button>
            </div>

            {/* Search Filter Input */}
            {prds.length > 0 && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter blueprints by name..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-secondary/40 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            )}

            {/* History Cards */}
            {prds.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground space-y-2 border border-dashed border-border rounded-xl">
                <FileText className="w-6 h-6 mx-auto text-muted-foreground/60" />
                <p className="font-medium text-foreground">No blueprints generated yet</p>
                <p className="text-[11px]">Fill out the studio form above to synthesize your first architecture.</p>
              </div>
            ) : filteredPrds.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground font-mono">
                No matching blueprints found.
              </div>
            ) : (
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {filteredPrds.map((prd) => {
                  const isSelected = selectedPrd?.id === prd.id;
                  return (
                    <div
                      key={prd.id}
                      onClick={() => setSelectedPrd(prd)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? "bg-primary/10 border-primary shadow-sm"
                          : "bg-secondary/40 border-border hover:border-border/80 hover:bg-secondary/70"
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <h4 className={`text-xs font-bold truncate ${isSelected ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                          {prd.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-[10px] font-mono text-muted-foreground mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(prd.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => handleDelete(prd.id, e)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete blueprint"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "text-primary translate-x-0.5" : "text-muted-foreground/50"}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected PRD Viewer Drawer (7 cols) */}
        <div className="lg:col-span-7">
          {selectedPrd ? (
            <PRDViewer prd={selectedPrd} />
          ) : (
            <div className="rounded-2xl p-12 bg-card/40 border border-border border-dashed text-center text-xs text-muted-foreground min-h-[480px] flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Select a Blueprint to Inspect</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Choose a document from the left repository list or fill out the studio form to trigger real-time AI synthesis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
