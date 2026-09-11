"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAdminAnalytics, triggerManualPruning, AdminAnalytics } from "@/lib/api";
import RetentionBanner from "@/components/RetentionBanner";
import {
  Users,
  Database,
  Layers,
  ArrowLeftRight,
  Trash2,
  RefreshCw,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Search,
  Cpu,
  Clock,
  Activity
} from "lucide-react";

/**
 * Modern Shadcn Superuser Admin Control Center Block.
 * Features real-time KPI metrics, searchable user directory table, and on-demand pruning controls.
 */
export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, isAdmin } = useAuth();

  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [isFetchingAnalytics, setIsFetchingAnalytics] = useState<boolean>(true);
  const [isPruning, setIsPruning] = useState<boolean>(false);
  const [pruneResult, setPruneResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchAnalytics = useCallback(async () => {
    setIsFetchingAnalytics(true);
    setError(null);
    try {
      const data = await getAdminAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch platform analytics.");
    } finally {
      setIsFetchingAnalytics(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.push("/signin");
      } else if (isAdmin) {
        fetchAnalytics();
      }
    }
  }, [user, isAuthLoading, isAdmin, router, fetchAnalytics]);

  const handleManualPrune = async () => {
    if (!confirm("Are you sure you want to trigger the 30-day data pruning script right now?")) return;

    setIsPruning(true);
    setPruneResult(null);
    try {
      const res = await triggerManualPruning();
      setPruneResult(`Pruning finished: ${res.deleted_count} expired PRD record(s) deleted.`);
      await fetchAnalytics();
    } catch (err: any) {
      alert(err.message || "Failed to execute manual pruning.");
    } finally {
      setIsPruning(false);
    }
  };

  const filteredUsers = analytics?.users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Cpu className="w-5 h-5 text-primary animate-spin" />
        <p className="text-xs font-mono text-muted-foreground">Authenticating admin session...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <main className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-7 rounded-3xl bg-card border border-border shadow-xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-foreground">Superuser Access Restricted</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The Admin Control Center is restricted exclusively to authorized superuser accounts (Admin role required).
          </p>
          <div className="pt-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2.5 rounded-xl bg-secondary text-foreground text-xs font-semibold hover:bg-secondary/80 border border-border transition-colors cursor-pointer"
            >
              Return to Studio Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-8 py-2">
      {/* Top Header & Admin Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Admin Control Center</h1>
            <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2.5 py-0.5 rounded-full font-bold">
              SUPERADMIN
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Platform metrics, registered user directory, and manual database lifecycle controls.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Manual Pruning Action Button */}
          <button
            onClick={handleManualPrune}
            disabled={isPruning}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20 transition-colors text-xs font-semibold disabled:opacity-50 cursor-pointer"
          >
            {isPruning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            <span>{isPruning ? "Pruning Database..." : "Execute 30-Day TTL Pruning"}</span>
          </button>

          {/* Switch to User Studio */}
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Studio View</span>
          </button>
        </div>
      </div>

      {/* Admin Exemption Banner */}
      <RetentionBanner isAdmin={true} />

      {/* Prune Feedback Alert */}
      {pruneResult && (
        <div className="bg-emerald-950/30 border border-emerald-800/60 p-4 rounded-2xl flex items-center space-x-2 text-xs text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{pruneResult}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-950/40 border border-rose-800/60 p-4 rounded-2xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground font-mono">
            {isFetchingAnalytics ? "..." : analytics?.total_users || 0}
          </p>
          <p className="text-[11px] text-muted-foreground font-mono">Active account records in PostgreSQL</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Total Generated Blueprints</span>
            <Database className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground font-mono">
            {isFetchingAnalytics ? "..." : analytics?.total_prds || 0}
          </p>
          <p className="text-[11px] text-muted-foreground font-mono">Synthesized 5-module documents</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Automated TTL Pruning Loop</span>
            <Layers className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-500 font-mono">Active (24h Interval)</p>
          <p className="text-[11px] text-muted-foreground font-mono">Admin accounts permanently exempt</p>
        </div>
      </div>

      {/* Registered Users Directory Data Table Block */}
      <div className="rounded-2xl p-6 bg-card border border-border space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-foreground">Registered User Directory</h2>
            <p className="text-xs text-muted-foreground">List of all authenticated accounts and quota usages</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Table Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search username or role..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-secondary/40 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            <button
              onClick={fetchAnalytics}
              disabled={isFetchingAnalytics}
              className="px-3 py-1.5 rounded-lg bg-secondary text-xs text-muted-foreground hover:text-foreground border border-border transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isFetchingAnalytics ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {isFetchingAnalytics ? (
          <div className="text-center py-10 text-xs font-mono text-muted-foreground">
            Loading user directory...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/80">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/60 text-muted-foreground font-mono text-[11px]">
                  <th className="py-3 px-4 font-semibold">User ID</th>
                  <th className="py-3 px-4 font-semibold">Username</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Generations Used</th>
                  <th className="py-3 px-4 font-semibold">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs font-mono text-muted-foreground">
                      No matching users found in directory.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-muted-foreground/80">{u.id.substring(0, 8)}...</td>
                      <td className="py-3 px-4 font-medium text-foreground">{u.username}</td>
                      <td className="py-3 px-4">
                        {u.role === "admin" ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            ADMIN
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-secondary text-muted-foreground border border-border">
                            USER
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {u.role === "admin" ? (
                          <span className="text-emerald-400 font-semibold">Unlimited ({u.generation_count})</span>
                        ) : (
                          <span className="text-foreground">{u.generation_count} / 5</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
