"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAdminAnalytics, triggerManualPruning, AdminAnalytics } from "@/lib/api";
import RetentionBanner from "@/components/RetentionBanner";
import { Users, Database, Layers, ArrowLeftRight, Trash2, RefreshCw, CheckCircle2, ShieldAlert } from "lucide-react";

/**
 * Admin Panel Component.
 * Protected strictly for user.role == 'admin'.
 * Renders real-time platform analytics table and manual 30-day data pruning trigger.
 */
export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, isAdmin } = useAuth();

  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [isFetchingAnalytics, setIsFetchingAnalytics] = useState<boolean>(true);
  const [isPruning, setIsPruning] = useState<boolean>(false);
  const [pruneResult, setPruneResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      await fetchAnalytics(); // Refresh analytics table after pruning
    } catch (err: any) {
      alert(err.message || "Failed to execute manual pruning.");
    } finally {
      setIsPruning(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-xs font-mono text-gray-400">
        Authenticating superuser session...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <main className="max-w-md mx-auto py-12 text-center space-y-4">
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl text-gray-200 text-sm space-y-2">
          <ShieldAlert className="w-8 h-8 text-rose-400 mx-auto" />
          <p className="font-semibold text-rose-400">Access Denied</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            The Admin Control Center is restricted exclusively to authorized superuser accounts (Admin role required).
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-gray-100 text-gray-950 font-semibold text-xs rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back to User Dashboard
        </button>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      {/* Top Bar with Title, Admin Badge, and View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-100">Superuser Admin Panel</h1>
            <span className="text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
              SUPERADMIN
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time platform analytics, registered users directory, and manual database maintenance.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Manual Pruning Trigger Button */}
          <button
            onClick={handleManualPrune}
            disabled={isPruning}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gray-900 border border-gray-700 text-rose-400 hover:bg-gray-800 hover:text-rose-300 transition-colors text-xs font-semibold disabled:opacity-50"
          >
            {isPruning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            <span>{isPruning ? "Pruning Database..." : "Run 30-Day Pruning Now"}</span>
          </button>

          {/* Switch to User View Toggle Button */}
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gray-100 text-gray-950 text-xs font-semibold hover:bg-gray-300 transition-colors shadow"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Switch to User View</span>
          </button>
        </div>
      </div>

      {/* Admin Permanent Data Retention Privilege Banner */}
      <RetentionBanner isAdmin={true} />

      {pruneResult && (
        <div className="bg-gray-900 border border-emerald-800 p-4 rounded-xl flex items-center space-x-2 text-xs text-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{pruneResult}</span>
        </div>
      )}

      {error && (
        <div className="bg-gray-900 border border-rose-800 p-4 rounded-xl text-xs text-rose-400">
          {error}
        </div>
      )}

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Total Registered Users</span>
            <Users className="w-4 h-4 text-gray-300" />
          </div>
          <p className="text-2xl font-bold text-gray-100 font-mono">
            {isFetchingAnalytics ? "..." : analytics?.total_users || 0}
          </p>
          <p className="text-[11px] text-gray-500 font-mono">Platform User Accounts</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Total PRDs Generated</span>
            <Database className="w-4 h-4 text-gray-300" />
          </div>
          <p className="text-2xl font-bold text-gray-100 font-mono">
            {isFetchingAnalytics ? "..." : analytics?.total_prds || 0}
          </p>
          <p className="text-[11px] text-gray-500 font-mono">Total System Architectures</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Automated Pruning Status</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono">Active (24h Loop)</p>
          <p className="text-[11px] text-gray-500 font-mono">Exempts Admin Accounts</p>
        </div>
      </div>

      {/* Registered Users Directory Data Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-100">Registered Platform Users Directory</h2>
          <button
            onClick={fetchAnalytics}
            className="text-xs text-gray-400 hover:text-gray-200 transition-colors flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh Directory</span>
          </button>
        </div>

        {isFetchingAnalytics ? (
          <div className="text-center py-8 text-xs font-mono text-gray-500">
            Fetching user analytics...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 font-mono">
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Generations Used</th>
                  <th className="py-3 px-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {analytics?.users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-900/50">
                    <td className="py-3 px-4 font-mono text-gray-500">{u.id.substring(0, 8)}...</td>
                    <td className="py-3 px-4 font-medium text-gray-200">{u.username}</td>
                    <td className="py-3 px-4">
                      {u.role === "admin" ? (
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          ADMIN
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-gray-800 text-gray-300 border border-gray-700">
                          USER
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {u.role === "admin" ? (
                        <span className="text-emerald-400 font-semibold">Unlimited ({u.generation_count})</span>
                      ) : (
                        <span className="text-gray-300">{u.generation_count} / 5</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
