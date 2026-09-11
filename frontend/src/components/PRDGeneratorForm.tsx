"use client";

import React, { useState } from "react";
import { generatePRD, PRDHistory } from "@/lib/api";
import { Sparkles, Loader2, AlertCircle, Layers, Database, Cpu } from "lucide-react";

interface PRDGeneratorFormProps {
  onSuccess: (newPrd: PRDHistory) => void;
}

/**
 * PRDGeneratorForm Component.
 * Modern, client-side generative form with inputs for Project Idea, Budget, Traffic, and Tech Stack.
 * Renders a dynamic skeleton loader during Gemini 1.5 Flash AI synthesis.
 */
export default function PRDGeneratorForm({ onSuccess }: PRDGeneratorFormProps) {
  const [title, setTitle] = useState<string>("");
  const [projectIdea, setProjectIdea] = useState<string>("");
  const [budget, setBudget] = useState<string>("Low / Bootstrap ($0 - $50/mo)");
  const [expectedTraffic, setExpectedTraffic] = useState<string>("MVP / Growth (< 10,000 MAU)");
  const [techStack, setTechStack] = useState<string>("");

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_IDEA_LENGTH = 1000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 3) {
      setError("Please enter a project title (minimum 3 characters).");
      return;
    }
    if (projectIdea.trim().length < 10) {
      setError("Please describe your project idea (minimum 10 characters).");
      return;
    }

    setIsGenerating(true);

    // Combine form parameters into structured prompt brief
    const fullBrief = `
PROJECT IDEA:
${projectIdea.trim()}

BUDGET CONSTRAINTS:
${budget}

EXPECTED TRAFFIC SCALE:
${expectedTraffic}

TECH STACK PREFERENCES:
${techStack.trim() || "No strict preference (select optimal architecture)"}
`.trim();

    try {
      const newPrd = await generatePRD(title.trim(), fullBrief);
      onSuccess(newPrd);

      // Reset form on success
      setTitle("");
      setProjectIdea("");
      setTechStack("");
    } catch (err: any) {
      if (err.status === 429) {
        setError(
          err.message ||
            "AI generation is currently experiencing high demand. Please try again in 1 minute."
        );
      } else {
        setError(err.message || "Failed to generate PRD blueprint. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <h2 className="text-base font-bold text-gray-100 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-gray-300" />
          <span>New Architecture Blueprint</span>
        </h2>
        <span className="text-[11px] font-mono bg-gray-800 text-gray-300 px-2.5 py-1 rounded border border-gray-700">
          GEMINI FLASH
        </span>
      </div>

      {error && (
        <div className="bg-rose-950/40 border-2 border-rose-600/80 text-rose-100 p-4 rounded-xl flex items-start space-x-3.5 shadow-xl ring-1 ring-rose-500/30 transition-all">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-rose-300 tracking-wider uppercase">
              Rate Limit / High Demand Notice
            </h4>
            <p className="text-sm font-medium leading-relaxed text-rose-100">
              {error}
            </p>
          </div>
        </div>
      )}

      {isGenerating ? (
        /* Dynamic "Building Blueprint..." Skeleton Loader */
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 space-y-5 animate-pulse">
          <div className="flex items-center space-x-3 text-gray-300">
            <Loader2 className="w-5 h-5 text-gray-100 animate-spin" />
            <div>
              <h3 className="text-sm font-semibold text-gray-100">Building Blueprint...</h3>
              <p className="text-xs text-gray-400 font-mono">
                Synthesizing architecture, DB schemas, and Mermaid diagrams
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="h-3 bg-gray-800 rounded-full w-3/4"></div>
            <div className="h-3 bg-gray-800/60 rounded-full w-full"></div>
            <div className="h-3 bg-gray-800/40 rounded-full w-5/6"></div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-gray-900 border border-gray-800 p-3 rounded-lg flex items-center space-x-2 text-xs text-gray-400">
              <Cpu className="w-3.5 h-3.5 text-gray-300" />
              <span>System Design</span>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-3 rounded-lg flex items-center space-x-2 text-xs text-gray-400">
              <Database className="w-3.5 h-3.5 text-gray-300" />
              <span>SQL Schemas</span>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-3 rounded-lg flex items-center space-x-2 text-xs text-gray-400">
              <Layers className="w-3.5 h-3.5 text-gray-300" />
              <span>Mermaid Graph</span>
            </div>
          </div>
        </div>
      ) : (
        /* Generative Form Inputs */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Project Title <span className="text-gray-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI-Powered SaaS Analytics Engine"
              required
              className="w-full px-3.5 py-2 rounded-lg bg-gray-950 border border-gray-800 text-gray-100 text-xs focus:outline-none focus:border-gray-600 transition-colors"
            />
          </div>

          {/* Project Idea (Textarea max 1000 chars) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-300">
                Project Idea & Description <span className="text-gray-500">*</span>
              </label>
              <span className="text-[11px] font-mono text-gray-500">
                {projectIdea.length}/{MAX_IDEA_LENGTH}
              </span>
            </div>
            <textarea
              value={projectIdea}
              onChange={(e) => setProjectIdea(e.target.value.slice(0, MAX_IDEA_LENGTH))}
              rows={4}
              placeholder="Describe your core product concept, key features, user actions, and business goals..."
              required
              className="w-full px-3.5 py-2 rounded-lg bg-gray-950 border border-gray-800 text-gray-100 text-xs focus:outline-none focus:border-gray-600 transition-colors resize-none"
            />
          </div>

          {/* Grid layout for Budget & Traffic Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Budget Constraints Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Budget Constraints
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-gray-950 border border-gray-800 text-gray-100 text-xs focus:outline-none focus:border-gray-600 transition-colors"
              >
                <option value="Low / Bootstrap ($0 - $50/mo)">Low / Bootstrap ($0 - $50/mo)</option>
                <option value="Moderate Scale ($50 - $500/mo)">Moderate Scale ($50 - $500/mo)</option>
                <option value="High Enterprise ($500+/mo)">High Enterprise ($500+/mo)</option>
              </select>
            </div>

            {/* Expected Traffic Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Expected Traffic Scale
              </label>
              <select
                value={expectedTraffic}
                onChange={(e) => setExpectedTraffic(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-gray-950 border border-gray-800 text-gray-100 text-xs focus:outline-none focus:border-gray-600 transition-colors"
              >
                <option value="MVP / Growth (< 10,000 MAU)">MVP / Growth (&lt; 10,000 MAU)</option>
                <option value="Medium Scale (10,000 - 100,000 MAU)">Medium Scale (10k - 100k MAU)</option>
                <option value="High Concurrency (100,000+ MAU)">High Concurrency (100k+ MAU)</option>
              </select>
            </div>
          </div>

          {/* Tech Stack Preferences */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Tech Stack Preferences <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="e.g. FastAPI, Next.js, Neon PostgreSQL, Redis, Tailwind"
              className="w-full px-3.5 py-2 rounded-lg bg-gray-950 border border-gray-800 text-gray-100 text-xs focus:outline-none focus:border-gray-600 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg bg-gray-100 text-gray-950 font-semibold text-xs hover:bg-gray-300 transition-colors shadow-lg flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Architecture Blueprint</span>
          </button>
        </form>
      )}
    </div>
  );
}
