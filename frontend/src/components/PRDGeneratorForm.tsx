"use client";

import React, { useState } from "react";
import { generatePRD, PRDHistory } from "@/lib/api";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  Layers,
  Database,
  Cpu,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  Lightbulb,
  Check
} from "lucide-react";
import { secureInputProps } from "@/components/SecurityProvider";

interface PRDGeneratorFormProps {
  onSuccess: (newPrd: PRDHistory) => void;
}

const BUDGET_TIERS = [
  { label: "Bootstrap ($0 - $50/mo)", value: "Low / Bootstrap ($0 - $50/mo)", desc: "BaaS & Serverless free tiers" },
  { label: "Scale ($50 - $500/mo)", value: "Moderate Scale ($50 - $500/mo)", desc: "Managed PostgreSQL & VPS" },
  { label: "Enterprise ($500+/mo)", value: "High Enterprise ($500+/mo)", desc: "Auto-scaling HA clusters" },
];

const TRAFFIC_TIERS = [
  { label: "< 10k MAU", value: "MVP / Growth (< 10,000 MAU)", desc: "Single server / edge caching" },
  { label: "10k - 100k MAU", value: "Medium Scale (10,000 - 100,000 MAU)", desc: "Redis cache & DB read replica" },
  { label: "100k+ MAU", value: "High Concurrency (100,000+ MAU)", desc: "Distributed clusters & CDN" },
];

const QUICK_IDEAS = [
  { title: "SaaS Analytics Engine", tech: "FastAPI, Next.js, Neon Postgres, Redis" },
  { title: "Real-time Whiteboard", tech: "WebSockets, Node.js, Canvas API, Redis" },
  { title: "FinTech Payments API", tech: "FastAPI, PostgreSQL, Stripe, Docker" },
];

/**
 * Shadcn-styled Architectural Studio Generator Block.
 * Features segmented selectors, quick inspiration chips, anti-tamper inputs, and live loading stages.
 */
export default function PRDGeneratorForm({ onSuccess }: PRDGeneratorFormProps) {
  const [title, setTitle] = useState<string>("");
  const [projectIdea, setProjectIdea] = useState<string>("");
  const [budget, setBudget] = useState<string>(BUDGET_TIERS[0].value);
  const [expectedTraffic, setExpectedTraffic] = useState<string>(TRAFFIC_TIERS[0].value);
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
      const newPrd = await generatePRD(
        title.trim(),
        fullBrief,
        budget,
        expectedTraffic
      );
      onSuccess(newPrd);

      // Reset fields
      setTitle("");
      setProjectIdea("");
      setTechStack("");
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes("monthly generation quota")) {
        setError(err.message);
      } else if (err.status === 429 || (err.message && (err.message.includes("429") || err.message.toLowerCase().includes("quota")))) {
        setError("AI generation is currently experiencing high demand. Please try again in 1 minute.");
      } else {
        setError(err.message || "Failed to synthesize architecture blueprint. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="rounded-2xl p-6 sm:p-7 bg-card/70 border border-border backdrop-blur-xl shadow-xl space-y-6">
      {/* Studio Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Architecture Studio</h2>
            <p className="text-[11px] text-muted-foreground">Configure specifications for 5-module synthesis</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono bg-secondary text-foreground border border-border px-2 py-0.5 rounded flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span>PROTECTED</span>
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3.5 rounded-xl flex items-start space-x-3 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-destructive">Generation Notice</span>
            <p className="text-destructive/90 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {isGenerating ? (
        /* Dynamic Synthesis Progress Screen */
        <div className="rounded-xl p-6 border border-primary/30 bg-background/60 space-y-5">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <div>
              <h3 className="text-sm font-bold text-foreground">Synthesizing Architecture Blueprint...</h3>
              <p className="text-[11px] font-mono text-muted-foreground">
                Google Gemini is compiling 5 modules with zero code truncation
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="h-2 rounded-full bg-secondary border border-border overflow-hidden">
              <div className="h-full bg-primary rounded-full w-4/5 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono pt-2">
            <div className="p-2.5 rounded-lg bg-secondary/80 border border-border flex items-center space-x-2 text-muted-foreground">
              <Cpu className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>1. PRD Scope Matrix</span>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/80 border border-border flex items-center space-x-2 text-muted-foreground">
              <Layers className="w-3.5 h-3.5 text-foreground shrink-0" />
              <span>2. Traffic Scaling Specs</span>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/80 border border-border flex items-center space-x-2 text-muted-foreground">
              <Database className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>3. Cost Table & Stack</span>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/80 border border-border flex items-center space-x-2 text-muted-foreground">
              <Layers className="w-3.5 h-3.5 text-foreground shrink-0" />
              <span>4. DB ERD & Flowchart</span>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/80 border border-border flex items-center space-x-2 text-muted-foreground sm:col-span-2">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>5. Developer Runbook (4 Phases)</span>
            </div>
          </div>
        </div>
      ) : (
        /* Generative Form Inputs */
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Project Title <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI-Powered SaaS Analytics Engine"
              required
              {...secureInputProps}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring transition-all placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Quick Idea Chips */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[11px] text-muted-foreground">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Starter Ideas:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_IDEAS.map((idea, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTitle(idea.title);
                    setTechStack(idea.tech);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-secondary/70 hover:bg-secondary border border-border/80 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {idea.title}
                </button>
              ))}
            </div>
          </div>

          {/* Project Idea (Textarea) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-foreground">
                Project Specification & Brief <span className="text-primary">*</span>
              </label>
              <span className="text-[11px] font-mono text-muted-foreground">
                {projectIdea.length}/{MAX_IDEA_LENGTH}
              </span>
            </div>
            <textarea
              value={projectIdea}
              onChange={(e) => setProjectIdea(e.target.value.slice(0, MAX_IDEA_LENGTH))}
              rows={4}
              placeholder="Describe your core product concept, key features, target users, business goals, and special scaling constraints..."
              required
              {...secureInputProps}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring transition-all resize-none placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Budget Segmented Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Target Budget Tier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {BUDGET_TIERS.map((tier) => {
                const isSelected = budget === tier.value;
                return (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => setBudget(tier.value)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary font-semibold ring-1 ring-primary/30"
                        : "bg-background/60 border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    <div className="text-xs font-bold">{tier.label}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{tier.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Traffic Scale Segmented Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Expected Traffic Scale
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TRAFFIC_TIERS.map((tier) => {
                const isSelected = expectedTraffic === tier.value;
                return (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => setExpectedTraffic(tier.value)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary font-semibold ring-1 ring-primary/30"
                        : "bg-background/60 border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    <div className="text-xs font-bold">{tier.label}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{tier.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tech Stack Preferences (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Tech Stack Preferences <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="e.g. FastAPI, Next.js, Neon PostgreSQL, Redis, Tailwind"
              {...secureInputProps}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring transition-all placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-primary-foreground bg-primary hover:bg-primary/90 shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Synthesize Master Architecture Blueprint</span>
          </button>
        </form>
      )}
    </div>
  );
}
