"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Code2,
  Check,
  Clock,
  Key,
  ExternalLink,
  ChevronRight,
  Copy,
  Sliders,
  Share2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Architectural Presets with associated mock specs for live playground
interface PresetData {
  id: string;
  name: string;
  badge: string;
  prompt: string;
  nodes: { id: string; name: string; type: string; latency: string; protocol: string }[];
  sqlSnippet: string;
  prdHighlight: { tier: string; title: string; desc: string }[];
  sizing: { compute: string; database: string; cache: string; cost: string };
}

const ARCHITECTURE_PRESETS: PresetData[] = [
  {
    id: "fintech",
    name: "FinTech Ledger",
    badge: "Financial Engine",
    prompt: "High-concurrency double-entry ledger with idempotent transactions, audit logs, and Redis mutexes.",
    nodes: [
      { id: "edge", name: "Cloudflare WAF", type: "Edge Shield", latency: "2ms", protocol: "TLS 1.3" },
      { id: "gw", name: "FastAPI Gateway", type: "Auth & Rate Limit", latency: "14ms", protocol: "HTTP/2" },
      { id: "worker", name: "Idempotency Worker", type: "Distributed Queue", latency: "8ms", protocol: "gRPC" },
      { id: "db", name: "Neon PostgreSQL 16", type: "ACID Ledger", latency: "18ms", protocol: "Postgres Wire" },
      { id: "cache", name: "Upstash Redis", type: "Mutex Locks", latency: "4ms", protocol: "RESP" },
    ],
    sqlSnippet: `-- Production Double-Entry Ledger Schema
CREATE TABLE ledgers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  balance NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key VARCHAR(64) UNIQUE NOT NULL,
  source_ledger_id UUID REFERENCES ledgers(id),
  dest_ledger_id UUID REFERENCES ledgers(id),
  amount NUMERIC(18, 4) NOT NULL CHECK (amount > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tx_idempotency ON transactions(idempotency_key);
CREATE INDEX idx_tx_ledger_time ON transactions(source_ledger_id, created_at DESC);`,
    prdHighlight: [
      { tier: "Tier 1: Functional Scope", title: "Double-Entry Idempotency", desc: "Guaranteed atomic balance transfers with sub-second rollback." },
      { tier: "Tier 2: API Contracts", title: "Signed Mutation Webhooks", desc: "HMAC-SHA256 authenticated settlement payloads." },
      { tier: "Tier 3: SLAs & Sizing", title: "99.999% Settlement Uptime", desc: "<25ms p99 ledger write latency under 10k req/s load." },
    ],
    sizing: { compute: "4x 0.5 vCPU Containers", database: "Neon HA 4 CU Autoscaling", cache: "Redis Multi-AZ 5GB", cost: "$82/mo" }
  },
  {
    id: "realtime",
    name: "Real-Time Canvas",
    badge: "Collaborative App",
    prompt: "Multiplayer collaborative whiteboarding canvas with CRDT synchronization and room state persistence.",
    nodes: [
      { id: "edge", name: "Anycast CDN", type: "WebSocket Edge", latency: "5ms", protocol: "WSS" },
      { id: "gw", name: "Node / Bun Hub", type: "Presence Gateway", latency: "8ms", protocol: "WebSockets" },
      { id: "worker", name: "CRDT Sync Engine", type: "Delta Resolver", latency: "6ms", protocol: "Yjs Binary" },
      { id: "db", name: "PostgreSQL + S3", type: "Canvas Snapshots", latency: "22ms", protocol: "SQL/REST" },
      { id: "cache", name: "Redis Pub/Sub", type: "Room Broadcast", latency: "2ms", protocol: "Redis Cluster" },
    ],
    sqlSnippet: `-- Collaborative Canvas Document Model
CREATE TABLE canvas_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(120) NOT NULL,
  owner_id UUID NOT NULL,
  version INT NOT NULL DEFAULT 1,
  snapshot_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE room_participants (
  room_id UUID REFERENCES canvas_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  cursor_color VARCHAR(7) NOT NULL,
  last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (room_id, user_id)
);`,
    prdHighlight: [
      { tier: "Tier 1: Functional Scope", title: "Sub-50ms Multiplayer Sync", desc: "Conflict-free state merges across 50 simultaneous cursors per room." },
      { tier: "Tier 2: Event Specs", title: "Delta Chunking Protocol", desc: "Binary serialized vector updates with differential compression." },
      { tier: "Tier 3: Reliability", title: "Offline Reconnect Recovery", desc: "Automatic state replay upon reconnect with monotonic sequence IDs." },
    ],
    sizing: { compute: "2x 1.0 vCPU Node Gateways", database: "Serverless Postgres 2 CU", cache: "Redis PubSub Cluster", cost: "$58/mo" }
  },
  {
    id: "saas",
    name: "Multi-Tenant SaaS",
    badge: "Enterprise B2B",
    prompt: "Multi-tenant B2B CRM with row-level security, organization workspaces, and RBAC permissions.",
    nodes: [
      { id: "edge", name: "Global Edge WAF", type: "Subdomain Router", latency: "3ms", protocol: "HTTPS" },
      { id: "gw", name: "FastAPI Engine", type: "Tenant Context Resolver", latency: "11ms", protocol: "REST" },
      { id: "worker", name: "Celery Task Queue", type: "Async Reports & Exports", latency: "15ms", protocol: "AMQP" },
      { id: "db", name: "PostgreSQL 16 (RLS)", type: "Isolated Tenant DB", latency: "16ms", protocol: "PostgreSQL" },
      { id: "cache", name: "Redis Org Cache", type: "Session & RBAC", latency: "3ms", protocol: "RESP" },
    ],
    sqlSnippet: `-- Row-Level Security Multi-Tenant Model
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  plan_tier VARCHAR(20) NOT NULL DEFAULT 'starter'
);

CREATE TABLE organization_members (
  org_id UUID REFERENCES organizations(id),
  user_id UUID NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  PRIMARY KEY (org_id, user_id)
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;`,
    prdHighlight: [
      { tier: "Tier 1: Architecture", title: "Subdomain Tenant Isolation", desc: "Automatic workspace routing via tenant_id JWT claim extraction." },
      { tier: "Tier 2: Security", title: "Row-Level Security (RLS)", desc: "Guaranteed cryptographic and database-level data partitioning." },
      { tier: "Tier 3: Audit Trails", title: "SOC2 Compliance Logging", desc: "Immutable tamper-evident action logs for enterprise accounts." },
    ],
    sizing: { compute: "3x 0.5 vCPU FastAPI Instances", database: "PostgreSQL 4 vCPU / 8GB RAM", cache: "Redis 2GB", cost: "$69/mo" }
  },
  {
    id: "agents",
    name: "AI Agent Orchestrator",
    badge: "Agentic Systems",
    prompt: "Asynchronous multi-agent system design with tool execution sandboxes, vector embeddings, and memory recall.",
    nodes: [
      { id: "edge", name: "API Gateway", type: "SSE Streaming", latency: "8ms", protocol: "HTTP/2" },
      { id: "gw", name: "Planner Service", type: "DAG Decomposer", latency: "25ms", protocol: "JSON-RPC" },
      { id: "worker", name: "Sandbox Runners", type: "Isolated MicroVMs", latency: "45ms", protocol: "gRPC" },
      { id: "db", name: "pgvector + PostgreSQL", type: "Semantic Recall", latency: "24ms", protocol: "SQL" },
      { id: "cache", name: "Redis Key-Value", type: "Conversation State", latency: "2ms", protocol: "RESP" },
    ],
    sqlSnippet: `-- pgvector Conversation & Memory Model
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE agent_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE semantic_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES agent_sessions(id),
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_memories_embedding ON semantic_memories USING ivfflat (embedding vector_cosine_ops);`,
    prdHighlight: [
      { tier: "Tier 1: Task Execution", title: "Deterministic DAG Execution", desc: "Sub-task graph resolution with checkpointing and state rewinding." },
      { tier: "Tier 2: Memory Tier", title: "Vector Cosine Search", desc: "Sub-30ms similarity lookup for context injection into LLM prompts." },
      { tier: "Tier 3: Guardrails", title: "Strict Tool Sandboxing", desc: "Process isolation preventing untrusted execution across containers." },
    ],
    sizing: { compute: "2x 1.0 vCPU Orchestrators", database: "pgvector PostgreSQL 4 CU", cache: "Redis Memory Store 4GB", cost: "$76/mo" }
  }
];

export default function HomePage() {
  const router = useRouter();
  const [selectedPreset, setSelectedPreset] = useState<PresetData>(ARCHITECTURE_PRESETS[0]);
  const [activeTab, setActiveTab] = useState<"topology" | "sql" | "prd" | "sizing">("topology");
  const [selectedNode, setSelectedNode] = useState<string>("gw");
  const [copied, setCopied] = useState(false);
  const [promptInput, setPromptInput] = useState("");

  // Sizing simulator state
  const [scaleTier, setScaleTier] = useState<"starter" | "growth" | "scale">("growth");
  const [dbEngine, setDbEngine] = useState<"neon" | "supabase" | "self">("neon");

  const handleLaunchStudio = (promptToUse?: string) => {
    const text = promptToUse || promptInput || selectedPreset.prompt;
    if (text.trim()) {
      router.push(`/dashboard?prompt=${encodeURIComponent(text.trim())}`);
    } else {
      router.push("/dashboard");
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(selectedPreset.sqlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeNodeData = selectedPreset.nodes.find((n) => n.id === selectedNode) || selectedPreset.nodes[1];

  return (
    <div className="space-y-24 py-4 sm:py-8 max-w-6xl mx-auto">
      {/* ========================================================================= */}
      {/* BLOCK 1: HUMAN-ENGINEERED ASYMMETRIC STUDIO WORKBENCH HERO                */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        {/* Release Pill Header */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-2 py-1 px-3 text-xs bg-secondary/70 font-mono border-border">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-foreground">Blueprint Engine v0.1</span>
            <Separator orientation="vertical" className="h-3 bg-border" />
            <span className="text-muted-foreground font-normal">Production Architecture Studio</span>
          </Badge>
          <Badge variant="secondary" className="text-xs font-mono text-muted-foreground">
            Zero-Lock-in • DDL & Mermaid
          </Badge>
        </div>

        {/* Studio Grid: Left Pitch / Input & Right Interactive Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (5 Cols): Editorial Pitch & Command Launcher */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
                System architecture, formatted for production.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Turn high-level functional briefs into deterministic 5-Tier PRDs, 
                normalized PostgreSQL schemas, and interactive Mermaid.js diagrams.
              </p>
            </div>

            {/* Architecture Command Bar */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-1.5 rounded-lg border border-border bg-card shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                <Terminal className="w-4 h-4 text-primary ml-2 shrink-0" />
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLaunchStudio()}
                  placeholder={selectedPreset.prompt}
                  className="w-full bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
                <Button 
                  size="sm" 
                  onClick={() => handleLaunchStudio()} 
                  className="shrink-0 gap-1.5 text-xs font-semibold px-3"
                >
                  <span>Build</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Architecture Preset Selector Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider font-mono">
                  Sample Architecture Archetypes:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ARCHITECTURE_PRESETS.map((preset) => {
                    const isSelected = selectedPreset.id === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSelectedPreset(preset);
                          setSelectedNode(preset.nodes[1].id);
                        }}
                        className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-secondary/60 text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        {preset.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Guarantees Row */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>PostgreSQL & SQLite DDL</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Interactive Mermaid Topologies</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>5-Tier PRD Scope & SLAs</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Zero-Vendor Lock-in</span>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Real Interactive Architecture Workbench Card */}
          <div className="lg:col-span-7">
            <Card className="border border-border bg-card/95 shadow-md backdrop-blur-sm overflow-hidden">
              {/* Card Header with Live Spec Breadcrumb & Real Tabs */}
              <CardHeader className="p-3.5 sm:p-4 border-b border-border bg-secondary/30 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
                      spec/{selectedPreset.id}_architecture.blueprint
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-mono py-0.5 px-2 bg-secondary">
                      {selectedPreset.badge}
                    </Badge>
                  </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1 bg-secondary/80 p-1 rounded-md border border-border/70">
                    <button
                      type="button"
                      onClick={() => setActiveTab("topology")}
                      className={`text-xs px-2.5 py-1 rounded font-medium transition-all ${
                        activeTab === "topology"
                          ? "bg-card text-foreground shadow-sm font-semibold border border-border"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Topology Flow
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("sql")}
                      className={`text-xs px-2.5 py-1 rounded font-medium transition-all ${
                        activeTab === "sql"
                          ? "bg-card text-foreground shadow-sm font-semibold border border-border"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      PostgreSQL DDL
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("prd")}
                      className={`text-xs px-2.5 py-1 rounded font-medium transition-all ${
                        activeTab === "prd"
                          ? "bg-card text-foreground shadow-sm font-semibold border border-border"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      5-Tier PRD
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("sizing")}
                      className={`text-xs px-2.5 py-1 rounded font-medium transition-all ${
                        activeTab === "sizing"
                          ? "bg-card text-foreground shadow-sm font-semibold border border-border"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Sizing & Cost
                    </button>
                  </div>

                  {activeTab === "sql" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopySql}
                      className="h-7 text-[11px] gap-1 px-2 font-mono"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? "Copied" : "Copy SQL"}</span>
                    </Button>
                  )}
                </div>
              </CardHeader>

              {/* Card Body: Dynamic Tab Content */}
              <CardContent className="p-4 sm:p-5 min-h-[320px] flex flex-col justify-between">
                {/* TAB 1: TOPOLOGY GRAPH */}
                {activeTab === "topology" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-mono">System Flowchart Pipeline</span>
                      <span>Click any node to inspect protocol</span>
                    </div>

                    {/* Interactive Node Pipeline View */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                      {selectedPreset.nodes.map((node, idx) => {
                        const isNodeSelected = selectedNode === node.id;
                        return (
                          <div key={node.id} className="relative flex flex-col items-center">
                            <button
                              type="button"
                              onClick={() => setSelectedNode(node.id)}
                              className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                                isNodeSelected
                                  ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                                  : "border-border bg-secondary/40 hover:bg-secondary hover:border-border"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-mono text-muted-foreground">0{idx + 1}</span>
                                <span className="text-[9px] font-mono font-bold text-primary">{node.latency}</span>
                              </div>
                              <div className="text-xs font-semibold text-foreground truncate">{node.name}</div>
                              <div className="text-[10px] text-muted-foreground truncate">{node.type}</div>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Selected Node Spec Inspector Box */}
                    <div className="p-3 rounded-lg border border-border bg-secondary/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">Active Node:</span>
                        <span className="font-semibold text-foreground">{activeNodeData.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span>Role: <strong className="text-foreground">{activeNodeData.type}</strong></span>
                        <span>Protocol: <strong className="text-foreground">{activeNodeData.protocol}</strong></span>
                        <span>Latency: <strong className="text-emerald-500">{activeNodeData.latency}</strong></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: POSTGRESQL DDL */}
                {activeTab === "sql" && (
                  <div className="rounded-lg border border-border bg-secondary/30 p-3 sm:p-4 overflow-x-auto">
                    <pre className="text-xs font-mono text-foreground leading-relaxed">
                      <code>{selectedPreset.sqlSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* TAB 3: 5-TIER PRD SPEC */}
                {activeTab === "prd" && (
                  <div className="space-y-2.5">
                    {selectedPreset.prdHighlight.map((item, i) => (
                      <div key={i} className="p-3 rounded-lg border border-border bg-secondary/30 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-primary font-medium text-[11px]">{item.tier}</span>
                          <span className="text-[10px] text-muted-foreground">Verified SLA</span>
                        </div>
                        <div className="text-xs font-semibold text-foreground">{item.title}</div>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 4: SIZING & COST */}
                {activeTab === "sizing" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="p-3 rounded-lg border border-border bg-secondary/30 space-y-1">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">Compute</span>
                        <div className="text-xs font-semibold text-foreground">{selectedPreset.sizing.compute}</div>
                        <div className="text-[10px] text-muted-foreground">Stateless Containers</div>
                      </div>
                      <div className="p-3 rounded-lg border border-border bg-secondary/30 space-y-1">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">Database</span>
                        <div className="text-xs font-semibold text-foreground">{selectedPreset.sizing.database}</div>
                        <div className="text-[10px] text-muted-foreground">Autoscaling Storage</div>
                      </div>
                      <div className="p-3 rounded-lg border border-border bg-secondary/30 space-y-1">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">Caching</span>
                        <div className="text-xs font-semibold text-foreground">{selectedPreset.sizing.cache}</div>
                        <div className="text-[10px] text-muted-foreground">Sub-millisecond latency</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-foreground">Estimated Infrastructure Cost</div>
                        <div className="text-[11px] text-muted-foreground">Based on typical regional cloud providers</div>
                      </div>
                      <div className="text-base sm:text-lg font-bold font-mono text-primary">
                        {selectedPreset.sizing.cost}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Card Footer: Action bar to open in generator */}
              <CardFooter className="p-3 sm:p-4 border-t border-border bg-secondary/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Ready to compile into full specification</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleLaunchStudio(selectedPreset.prompt)}
                  className="text-xs gap-1.5"
                >
                  <span>Open in Full Studio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </CardFooter>
            </Card>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* BLOCK 2: 3-PILLAR ENGINEERING CAPABILITIES (SHADCN CARDS GRID)            */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs font-mono">Core Specification Engine</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Everything your team needs before writing code.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Avoid costly refactors, schema migrations, and mismatched architectural assumptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="border border-border bg-card shadow-sm flex flex-col justify-between">
            <CardHeader className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <FileCode className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">5-Tier PRD Specifications</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Structured product requirement documents detailing functional scope, 
                non-functional SLAs, idempotency limits, and data validation rules.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="p-2.5 rounded-md border border-border bg-secondary/30 text-xs font-mono space-y-1">
                <div className="flex justify-between text-muted-foreground text-[10px]">
                  <span>Tier 1: Functional Scope</span>
                  <span className="text-emerald-500">100% Coverage</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-[10px]">
                  <span>Tier 2: Edge Cases & Auth</span>
                  <span className="text-emerald-500">Verified</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-[10px]">
                  <span>Tier 3: Observability SLA</span>
                  <span className="text-primary">&lt;50ms p95</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="border border-border bg-card shadow-sm flex flex-col justify-between">
            <CardHeader className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Database className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">Production Relational Schemas</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Dual-dialect DDL schemas in PostgreSQL and SQLite. Complete with primary keys,
                foreign key cascades, indexes, and type constraints.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="p-2.5 rounded-md border border-border bg-secondary/30 text-xs font-mono space-y-1">
                <div className="text-[11px] text-foreground font-semibold">PostgreSQL & SQLite Dialects</div>
                <div className="text-[10px] text-muted-foreground">UUID v4 Primary Keys • Foreign Key Constraints</div>
                <div className="text-[10px] text-primary">Optimized B-Tree & Hash Indexing</div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="border border-border bg-card shadow-sm flex flex-col justify-between">
            <CardHeader className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <GitBranch className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">Mermaid.js System Topologies</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Live rendered system flowcharts showing service boundaries, edge caches, 
                API gateways, and storage clusters that paste into Notion or GitHub.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="p-2.5 rounded-md border border-border bg-secondary/30 text-xs font-mono space-y-1">
                <div className="text-[11px] text-foreground font-semibold">Mermaid Markdown Direct Export</div>
                <div className="text-[10px] text-muted-foreground">Client -&gt; Edge -&gt; API Gateway -&gt; Database</div>
                <div className="text-[10px] text-primary">Interactive Zoom & Pan in Studio</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BLOCK 3: INTERACTIVE ARCHITECTURE SIZING SIMULATOR                        */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <Card className="border border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="p-4 sm:p-6 border-b border-border bg-secondary/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  <CardTitle className="text-base sm:text-lg">Interactive Architecture Sizing Calculator</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Simulate your anticipated traffic volume and database engine to generate recommended provisioning.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono self-start sm:self-auto">
                Live Simulator
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-6">
            {/* Interactive Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Traffic Scale Selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Target Traffic Scale:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "starter", label: "10k MAU", desc: "MVP & Seed" },
                    { id: "growth", label: "250k MAU", desc: "Growth Phase" },
                    { id: "scale", label: "2M+ MAU", desc: "Scale Enterprise" },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setScaleTier(tier.id as any)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        scaleTier === tier.id
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border bg-secondary/30 hover:bg-secondary/60 text-muted-foreground"
                      }`}
                    >
                      <div className="text-xs font-semibold text-foreground">{tier.label}</div>
                      <div className="text-[10px] text-muted-foreground">{tier.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Database Choice */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Primary Database Stack:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "neon", label: "Neon Postgres", desc: "Serverless Autoscaling" },
                    { id: "supabase", label: "Supabase DB", desc: "Managed PostgreSQL" },
                    { id: "self", label: "Self-Hosted", desc: "Docker / EC2" },
                  ].map((db) => (
                    <button
                      key={db.id}
                      type="button"
                      onClick={() => setDbEngine(db.id as any)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        dbEngine === db.id
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border bg-secondary/30 hover:bg-secondary/60 text-muted-foreground"
                      }`}
                    >
                      <div className="text-xs font-semibold text-foreground">{db.label}</div>
                      <div className="text-[10px] text-muted-foreground">{db.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic Calculated Output */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-lg border border-border bg-secondary/20">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">API Concurrency</span>
                <div className="text-sm font-bold font-mono text-foreground">
                  {scaleTier === "starter" ? "250 req/s" : scaleTier === "growth" ? "3,500 req/s" : "25,000 req/s"}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Recommended Compute</span>
                <div className="text-sm font-bold font-mono text-foreground">
                  {scaleTier === "starter" ? "1x 0.5 vCPU" : scaleTier === "growth" ? "3x 1.0 vCPU" : "8x 2.0 vCPU + Autoscaler"}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Caching Strategy</span>
                <div className="text-sm font-bold font-mono text-foreground">
                  {scaleTier === "starter" ? "In-Memory LRU" : scaleTier === "growth" ? "Upstash Redis (5GB)" : "Redis Sentinel Cluster"}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Estimated Cloud Cost</span>
                <div className="text-sm font-bold font-mono text-primary">
                  {scaleTier === "starter" ? "~$25 / mo" : scaleTier === "growth" ? "~$95 / mo" : "~$480 / mo"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* BLOCK 4: 3-STEP ARCHITECTURAL PIPELINE                                    */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="space-y-1 text-center max-w-xl mx-auto">
          <Badge variant="outline" className="text-xs font-mono">Workflow</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            From brief to production blueprint
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            A deterministic engineering pipeline designed to save weeks of architecture drift.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card space-y-2 relative">
            <span className="text-2xl font-bold font-mono text-primary">01</span>
            <div className="text-sm font-bold text-foreground">Input Functional Brief</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Describe your business requirements, core features, traffic expectations, and budget tier.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-2 relative">
            <span className="text-2xl font-bold font-mono text-primary">02</span>
            <div className="text-sm font-bold text-foreground">Synthesize Specifications</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The engine automatically formulates normalized SQL tables, Mermaid topologies, and 5-tier PRD specs.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-2 relative">
            <span className="text-2xl font-bold font-mono text-primary">03</span>
            <div className="text-sm font-bold text-foreground">Export to Studio or GitHub</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Download clean Markdown, PDF blueprints, or copy SQL DDL directly into your database migration files.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BLOCK 5: MINIMALIST ACTION CALLOUT CARD                                   */}
      {/* ========================================================================= */}
      <section>
        <Card className="border border-border bg-secondary/30 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Start generating production system blueprints.
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Sign in to manage your blueprints, inspect schemas in the interactive studio, 
                and export complete architecture packages with zero lock-in.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button 
                onClick={() => router.push("/dashboard")}
                size="default" 
                className="gap-2 text-xs font-semibold"
              >
                <span>Open Architecture Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push("/signup")}
                size="default" 
                className="text-xs"
              >
                <span>Create Free Account</span>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
