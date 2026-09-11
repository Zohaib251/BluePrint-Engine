"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import RetentionBanner from "@/components/RetentionBanner";
import { ShieldCheck, Users, Database, Layers, ArrowLeftRight } from "lucide-react";

/**
 * Admin Panel Component.
 * Protected strictly for user.role == 'admin'.
 * Provides system overview metrics and seamless toggle to normal user view.
 */
export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<"admin" | "user">("admin");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-xs font-mono text-gray-400">
        Authenticating admin session...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <main className="max-w-md mx-auto py-12 text-center space-y-4">
        <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl text-gray-200 text-sm">
          <p className="font-semibold text-rose-400 mb-1">Access Denied</p>
          <p className="text-xs text-gray-400">
            The Admin Panel is restricted exclusively to authorized Admin accounts.
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
      {/* Header and Toggle Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-100">Admin Control Center</h1>
            <span className="text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
              SUPERADMIN
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            System administration, system health, and retention policy manager.
          </p>
        </div>

        {/* Seamless View Toggle Button */}
        <button
          onClick={() => {
            if (activeTab === "admin") {
              router.push("/dashboard");
            } else {
              setActiveTab("admin");
            }
          }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-950 text-xs font-semibold hover:bg-gray-300 transition-colors shadow"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>{activeTab === "admin" ? "Switch to User View" : "Switch to Admin View"}</span>
        </button>
      </div>

      {/* Permanent Retention Status Banner */}
      <RetentionBanner isAdmin={true} />

      {/* Admin Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Database System</span>
            <Database className="w-4 h-4" />
          </div>
          <p className="text-xl font-bold text-gray-100 font-mono">Neon PostgreSQL</p>
          <p className="text-[11px] text-gray-500 font-mono">Async Engine Pool Active</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Pruning Service</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-gray-100 font-mono">Active (24h Loop)</p>
          <p className="text-[11px] text-gray-500 font-mono">Exempts Admin Accounts</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Generation Quota</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-gray-100 font-mono">Unlimited (Infinite)</p>
          <p className="text-[11px] text-gray-500 font-mono">Standard: 5 / month</p>
        </div>
      </div>

      {/* System Status Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-100">System Configuration & Security</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 font-mono">
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Configuration</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-gray-200">AI Model Provider</td>
                <td className="py-2.5 px-3 font-mono text-gray-400">Google Gemini 1.5 Flash</td>
                <td className="py-2.5 px-3 text-emerald-400 font-mono font-semibold">OPERATIONAL</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-gray-200">JWT Token Security</td>
                <td className="py-2.5 px-3 font-mono text-gray-400">HS256 (60 Minute Expire)</td>
                <td className="py-2.5 px-3 text-emerald-400 font-mono font-semibold">ENFORCED</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-gray-200">Rate Limiter</td>
                <td className="py-2.5 px-3 font-mono text-gray-400">SlowAPI (5 req/min on Auth)</td>
                <td className="py-2.5 px-3 text-emerald-400 font-mono font-semibold">ACTIVE</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-gray-200">30-Day Auto Pruner</td>
                <td className="py-2.5 px-3 font-mono text-gray-400">Asyncio Background Task</td>
                <td className="py-2.5 px-3 text-emerald-400 font-mono font-semibold">RUNNING</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
