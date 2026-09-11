"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  Database,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Download,
  FileCode,
  Terminal,
  Activity,
  CheckCircle2,
  GitBranch,
  Server,
  Zap,
  Boxes,
  Code2
} from "lucide-react";

/**
 * Homepage Landing Page composed entirely of production-grade Shadcn Blocks.
 * Features:
 * - Architectural Hero Block with Live Blueprint Canvas Mockup
 * - Tech Stack Trust Ticker
 * - Asymmetrical Feature Bento Grid Block
 * - Step-by-Step Architectural Pipeline Block
 * - Interactive Preset Prompt Cloud Block
 * - High-Impact Glassmorphic CTA Block
 */
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"prd" | "diagram" | "database">("diagram");

  const samplePresets = [
    {
      title: "FinTech High-Concurrency Payment Gateway",
      traffic: "High Concurrency (100k+ MAU)",
      budget: "High Enterprise ($500+/mo)",
      tech: "FastAPI, PostgreSQL, Redis, Stripe, Docker",
    },
    {
      title: "Real-Time Collaborative Canvas (Figma-like)",
      traffic: "Medium Scale (10k - 100k MAU)",
      budget: "Moderate Scale ($50 - $500/mo)",
      tech: "Next.js, WebSockets, Redis Pub/Sub, Node.js",
    },
    {
      title: "AI-Powered Analytics SaaS Engine",
      traffic: "MVP / Growth (< 10,000 MAU)",
      budget: "Low / Bootstrap ($0 - $50/mo)",
      tech: "Next.js, Neon PostgreSQL, Gemini AI, Tailwind",
    },
  ];

  return (
    <div className="space-y-24 py-8 sm:py-12">
      {/* ========================================================================= */}
      {/* BLOCK 1: ARCHITECTURAL HERO BLOCK WITH CANVAS PREVIEW                      */}
      {/* ========================================================================= */}
      <section className="relative flex flex-col items-center text-center space-y-8 pt-4">
        {/* Ambient background glows */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* Announcement Pill */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-secondary/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Architectural Engine v0.1 Online</span>
          <span className="text-border">|</span>
          <span className="text-muted-foreground">5-Module Master Spec</span>
        </div>

        {/* Hero Title & Subheading */}
        <div className="max-w-4xl space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Architect Systems Like a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
              Principal Engineer
            </span>{" "}
            in Seconds.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Turn functional briefs into complete 5-Module PRDs, relational database schemas, 
            infrastructure scaling strategies, and interactive Mermaid.js diagrams instantly.
          </p>
        </div>

        {/* Hero Dual CTA Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-primary-foreground bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 shadow-cyan-glow transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Architecture Studio</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <Link
            href="/signin"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-medium text-foreground bg-secondary/80 hover:bg-secondary border border-border transition-colors cursor-pointer"
          >
            <span>Sign In to Account</span>
          </Link>
        </div>

        {/* Live Interactive Blueprint Canvas Mockup Window */}
        <div className="w-full max-w-5xl pt-8">
          <div className="rounded-2xl border border-white/[0.1] bg-card/70 backdrop-blur-2xl shadow-2xl overflow-hidden text-left">
            {/* Window Titlebar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-background/60">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-muted-foreground ml-3 hidden sm:inline">
                  blueprint://engine/master-spec.v1
                </span>
              </div>

              {/* Mockup Tabs Switcher */}
              <div className="flex items-center space-x-1 bg-secondary/80 p-1 rounded-lg border border-border text-xs">
                <button
                  onClick={() => setActiveTab("diagram")}
                  className={`px-3 py-1 rounded-md transition-all font-mono ${
                    activeTab === "diagram"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  System Flowchart
                </button>
                <button
                  onClick={() => setActiveTab("database")}
                  className={`px-3 py-1 rounded-md transition-all font-mono ${
                    activeTab === "database"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Database Schema
                </button>
                <button
                  onClick={() => setActiveTab("prd")}
                  className={`px-3 py-1 rounded-md transition-all font-mono ${
                    activeTab === "prd"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Scope Matrix
                </button>
              </div>

              <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="hidden sm:inline">200 OK • 1.8s</span>
              </div>
            </div>

            {/* Window Content Pane */}
            <div className="p-6 bg-gradient-to-b from-card/30 to-background/50 min-h-[340px] flex items-center justify-center">
              {activeTab === "diagram" && (
                <div className="w-full space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-4 rounded-xl bg-secondary/50 border border-cyan-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400 font-bold">Client Tier</span>
                        <span className="text-[10px] bg-cyan-950 px-2 py-0.5 rounded text-cyan-300">Next.js 14</span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">Server components, static prerender, and optimistic state hydration.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50 border border-blue-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-400 font-bold">Application Gateway</span>
                        <span className="text-[10px] bg-blue-950 px-2 py-0.5 rounded text-blue-300">FastAPI</span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">Async route handlers, JWT authentication middleware, and SlowAPI limiter.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50 border border-emerald-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 font-bold">Data Store</span>
                        <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300">Neon PostgreSQL</span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">Async connection pooler, 30-day automated TTL pruning, and SSL encryption.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-border font-mono text-xs text-muted-foreground flex items-center justify-between">
                    <span className="text-cyan-400 font-semibold">Mermaid.js Flowchart Generated:</span>
                    <span className="text-[11px] text-muted-foreground">graph TD: Client --&gt; Gateway --&gt; Workers --&gt; DB</span>
                  </div>
                </div>
              )}

              {activeTab === "database" && (
                <div className="w-full space-y-3 font-mono text-xs">
                  <div className="border border-border rounded-xl overflow-hidden bg-background/50">
                    <div className="px-4 py-2 bg-secondary/60 border-b border-border font-semibold text-foreground flex items-center justify-between">
                      <span>Table: <span className="text-cyan-400">users</span> (User Entity)</span>
                      <span className="text-[10px] text-muted-foreground">Primary Auth Schema</span>
                    </div>
                    <div className="divide-y divide-border/40 text-[11px]">
                      <div className="px-4 py-2 flex items-center justify-between text-muted-foreground">
                        <span className="text-foreground font-medium">id</span>
                        <span className="text-amber-400">UUID</span>
                        <span className="text-cyan-300">PRIMARY KEY DEFAULT gen_random_uuid()</span>
                      </div>
                      <div className="px-4 py-2 flex items-center justify-between text-muted-foreground">
                        <span className="text-foreground font-medium">username</span>
                        <span className="text-amber-400">VARCHAR(50)</span>
                        <span className="text-muted-foreground">UNIQUE, NOT NULL, INDEXED</span>
                      </div>
                      <div className="px-4 py-2 flex items-center justify-between text-muted-foreground">
                        <span className="text-foreground font-medium">role</span>
                        <span className="text-amber-400">VARCHAR(20)</span>
                        <span className="text-muted-foreground">DEFAULT &apos;user&apos;</span>
                      </div>
                      <div className="px-4 py-2 flex items-center justify-between text-muted-foreground">
                        <span className="text-foreground font-medium">created_at</span>
                        <span className="text-amber-400">TIMESTAMP WITH TIME ZONE</span>
                        <span className="text-muted-foreground">NOT NULL</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "prd" && (
                <div className="w-full space-y-3 text-xs">
                  <div className="p-4 rounded-xl bg-secondary/40 border border-border space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">P0 CRITICAL</span>
                      <span className="font-semibold text-foreground">User Story 1.1: Multi-Factor Workspace Access</span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      As an engineering team lead, I want to authenticate into isolated organization tenants so that proprietary architecture documents remain encrypted and strictly accessible.
                    </p>
                    <div className="pt-2 flex items-center space-x-3 text-[11px] text-emerald-400 font-mono">
                      <span className="flex items-center space-x-1"><CheckCircle2 className="w-3.5 h-3.5" /><span>OAuth2 Spec Verified</span></span>
                      <span className="flex items-center space-x-1"><CheckCircle2 className="w-3.5 h-3.5" /><span>JWT Expiry Enforced</span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BLOCK 2: TECH STACK TRUST TICKER                                          */}
      {/* ========================================================================= */}
      <section className="border-y border-border/60 py-6 bg-card/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-muted-foreground text-xs font-mono uppercase tracking-wider">
          <div className="flex items-center space-x-2 hover:text-foreground transition-colors">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>FastAPI Python</span>
          </div>
          <div className="flex items-center space-x-2 hover:text-foreground transition-colors">
            <Boxes className="w-4 h-4 text-blue-400" />
            <span>Next.js 14 App Router</span>
          </div>
          <div className="flex items-center space-x-2 hover:text-foreground transition-colors">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Neon PostgreSQL</span>
          </div>
          <div className="flex items-center space-x-2 hover:text-foreground transition-colors">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Gemini 3.5 AI</span>
          </div>
          <div className="flex items-center space-x-2 hover:text-foreground transition-colors">
            <GitBranch className="w-4 h-4 text-purple-400" />
            <span>Mermaid.js Flowcharts</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BLOCK 3: ASYMMETRICAL FEATURE BENTO GRID BLOCK                            */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Engineered for High-Velocity Product Teams
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Everything modern software architects, founders, and engineers need to bridge concept to implementation.
          </p>
        </div>

        {/* Bento 5-Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: 5-Module Master Spec (Large 2-column span) */}
          <div className="md:col-span-2 rounded-2xl p-6 sm:p-8 bg-card/60 border border-border hover:border-cyan-500/40 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-bold text-foreground">5-Module Master Architecture Blueprint</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Standardized, battle-tested structure including Executive Summary, Scope Matrix (P0 MVP vs P1 Phase 2),
              User Stories with Acceptance Criteria, Infrastructure Scaling Specs, and Operational Cost Breakdowns.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-secondary text-cyan-300 border border-border">PRD Module</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary text-blue-300 border border-border">Infrastructure Specs</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary text-emerald-300 border border-border">Cost Matrix</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary text-purple-300 border border-border">DB Blueprint</span>
              <span className="px-2.5 py-1 rounded-md bg-secondary text-amber-300 border border-border">Runbook Roadmap</span>
            </div>
          </div>

          {/* Card 2: Interactive Mermaid Flowcharts */}
          <div className="rounded-2xl p-6 sm:p-8 bg-card/60 border border-border hover:border-blue-500/40 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <GitBranch className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Mermaid.js Flowcharts</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Strictly validated Mermaid graph syntax dynamically rendered into high-contrast interactive SVG flowcharts with zero XSS vulnerabilities.
            </p>
          </div>

          {/* Card 3: Relational DB Schemas */}
          <div className="rounded-2xl p-6 sm:p-8 bg-card/60 border border-border hover:border-emerald-500/40 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Database ERD & Tables</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Complete relational schemas with data types, primary and foreign keys, uniqueness constraints, and indexing recommendations.
            </p>
          </div>

          {/* Card 4: Automated 30-Day Retention */}
          <div className="rounded-2xl p-6 sm:p-8 bg-card/60 border border-border hover:border-amber-500/40 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Anti-Tamper & 30-Day TTL</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Active DevTools inspection lockout, rate limiting, and an automated background daemon that prunes expired documents every 24 hours.
            </p>
          </div>

          {/* Card 5: High-Fidelity Vector PDF Export */}
          <div className="rounded-2xl p-6 sm:p-8 bg-card/60 border border-border hover:border-cyan-500/40 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Vector PDF & Markdown</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Export high-resolution PDFs with embedded vector diagrams and structured tables, or copy Markdown straight into Notion and Jira.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BLOCK 4: STEP-BY-STEP ARCHITECTURAL PIPELINE                              */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Workflow</span>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
            From Raw Concept to Execution Blueprint
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="p-6 rounded-2xl bg-card border border-border space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center font-mono font-bold text-cyan-400 text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-foreground">Define Parameters</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Input your application idea, budget tier ($0-$50/mo to $500+/mo), expected traffic scale, and tech stack preferences.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center font-mono font-bold text-blue-400 text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-foreground">Multi-Tier AI Synthesis</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Google Gemini 3.5 reasons across technical constraints, generating strict Pydantic JSON schemas with zero truncation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center font-mono font-bold text-emerald-400 text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-foreground">Execute & Export</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Explore your visual architecture in the studio, verify DB schemas, and download publication-ready PDFs for your team.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BLOCK 5: INTERACTIVE BLUEPRINT PRESETS CLOUD                               */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Templates</span>
          <h2 className="text-2xl font-bold text-foreground">Starter Architectural Presets</h2>
          <p className="text-xs text-muted-foreground">Select an architecture blueprint archetype to prefill and explore:</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {samplePresets.map((preset, index) => (
            <Link
              key={index}
              href="/dashboard"
              className="p-5 rounded-xl bg-card border border-border hover:border-cyan-500/50 transition-all hover:scale-[1.01] space-y-3 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono bg-cyan-950/60 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/60">
                  TEMPLATE
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-cyan-300 transition-colors">
                {preset.title}
              </h3>
              <div className="space-y-1 text-[11px] font-mono text-muted-foreground">
                <p>Scale: <span className="text-foreground">{preset.traffic}</span></p>
                <p>Budget: <span className="text-foreground">{preset.budget}</span></p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BLOCK 6: HIGH-IMPACT GLASSMORPHIC CTA BLOCK                                */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-card to-background border border-cyan-500/30 shadow-cyan-glow text-center space-y-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-cyan-500/10 blur-2xl pointer-events-none" />

          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-xs font-mono text-cyan-300">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Ready in under 5 seconds</span>
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Stop Guessing Your Architecture. Generate It.
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Eliminate weeks of planning meetings and ambiguity. Build with crystal-clear database models, 
            infrastructure roadmaps, and verifiable user stories today.
          </p>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl text-sm font-bold text-primary-foreground bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 shadow-cyan-glow transition-all hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Free Architecture Studio</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
