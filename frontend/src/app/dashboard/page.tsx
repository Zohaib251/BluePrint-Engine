"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { listPRDs, generatePRD, deletePRDById, PRDHistory } from "@/lib/api";
import RetentionBanner from "@/components/RetentionBanner";
import PRDViewer from "@/components/PRDViewer";
import { Sparkles, Trash2, FileText, Plus, RefreshCw } from "lucide-react";

/**
 * User Dashboard Component.
 * Main hub for generating PRDs, viewing history, exporting PDF/MD, and monitoring quotas.
 */
export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAdmin, refreshUser } = useAuth();

  const [prds, setPrds] = useState<PRDHistory[]>([]);
  const [selectedPrd, setSelectedPrd] = useState<PRDHistory | null>(null);
  const [isFetchingPrds, setIsFetchingPrds] = useState<boolean>(true);

  // AI PRD Generation form state
  const [title, setTitle] = useState<string>("");
  const [brief, setBrief] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsFetchingPrds(true);
    try {
      const data = await listPRDs();
      setPrds(data);
      if (data.length > 0 && !selectedPrd) {
        setSelectedPrd(data[0]);
      }
    } catch {
      // Session expired or unauthenticated
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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 3) {
      setError("Please provide a title with at least 3 characters.");
      return;
    }
    if (brief.trim().length < 10) {
      setError("Please provide a detailed project brief (at least 10 characters).");
      return;
    }

    setIsGenerating(true);

    try {
      const newPrd = await generatePRD(title.trim(), brief.trim());
      setPrds((prev) => [newPrd, ...prev]);
      setSelectedPrd(newPrd);
      setTitle("");
      setBrief("");
      await refreshUser(); // Update generation count
    } catch (err: any) {
      setError(err.message || "Failed to generate PRD. Please try again.");
    } finally {
      setIsGenerating(false);
    }
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

  if (isLoading || (!user && isFetchingPrds)) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-xs font-mono text-gray-400">
        Loading Blueprint Dashboard...
      </div>
    );
  }

  return (
    <main className="space-y-8">
      {/* Dashboard Top Header & Quota Metric */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Architecture Dashboard</h1>
          <p className="text-xs text-gray-400 mt-1">
            Welcome back, <span className="text-gray-200 font-semibold">{user?.username}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-gray-900 border border-gray-800 px-3.5 py-1.5 rounded-lg text-xs font-mono">
            <span className="text-gray-400">Monthly Usage: </span>
            <span className="text-gray-100 font-bold">
              {isAdmin ? "Unlimited (Admin)" : `${user?.generation_count || 0} / 5`}
            </span>
          </div>

          {isAdmin && (
            <button
              onClick={() => router.push("/admin")}
              className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-950 font-semibold text-xs hover:bg-gray-300 transition-colors"
            >
              Admin Panel
            </button>
          )}
        </div>
      </div>

      {/* Prominent Data Retention Warning Banner */}
      <RetentionBanner isAdmin={isAdmin} />

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Generator Form & History List (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Generator Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-100 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-gray-300" />
                <span>New Architecture Blueprint</span>
              </h2>
            </div>

            {error && (
              <div className="bg-gray-950 border border-gray-800 text-gray-200 text-xs p-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. E-Commerce Microservice Architecture"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-gray-100 text-xs focus:outline-none focus:border-gray-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Project Brief & Technical Requirements
                </label>
                <textarea
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  rows={4}
                  placeholder="Describe your system requirements, key modules, user flows, and database specifications..."
                  required
                  className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-gray-100 text-xs focus:outline-none focus:border-gray-600 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 px-4 rounded-lg bg-gray-100 text-gray-950 font-semibold text-xs hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini 1.5 Flash Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Generate System Blueprint</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* PRD History Cards List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">
                PRD Generation History ({prds.length})
              </h3>
              <button
                onClick={fetchHistory}
                className="text-xs text-gray-400 hover:text-gray-200 transition-colors flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
            </div>

            {prds.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-xs text-gray-400 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                <p>No PRD blueprints generated yet.</p>
                <p className="text-[11px] text-gray-500">
                  Fill out the form above to generate your first architecture document.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {prds.map((prd) => (
                  <div
                    key={prd.id}
                    onClick={() => setSelectedPrd(prd)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedPrd?.id === prd.id
                        ? "bg-gray-900 border-gray-600 shadow-md"
                        : "bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-900/80"
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <h4 className="text-xs font-semibold text-gray-100 truncate">
                        {prd.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                        {new Date(prd.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(prd.id, e)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-gray-800 transition-colors"
                      title="Delete PRD"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected PRD Viewer with PDF/MD Export (7 cols) */}
        <div className="lg:col-span-7">
          {selectedPrd ? (
            <PRDViewer prd={selectedPrd} />
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center text-xs text-gray-400 min-h-[400px] flex flex-col items-center justify-center space-y-3">
              <FileText className="w-10 h-10 text-gray-700" />
              <p className="font-semibold text-gray-300">Select or Generate a PRD Blueprint</p>
              <p className="text-gray-500 max-w-xs">
                Select an existing document from your history list or create a new one using Gemini 1.5 Flash.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
