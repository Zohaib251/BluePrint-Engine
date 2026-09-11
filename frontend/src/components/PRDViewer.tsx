"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";
import { PRDHistory, PRDStructuredContent } from "@/lib/api";
import MermaidRenderer from "@/components/MermaidRenderer";
import { Download, FileText, Copy, Check, X, Database, Layers, Route, Key } from "lucide-react";

interface PRDViewerProps {
  prd: PRDHistory;
  onClose?: () => void;
}

/**
 * PRDViewer Component.
 * Structured JSON Blueprint View displaying architecture overview, Tailwind database tables,
 * badge-style API routes, visual Mermaid.js flowchart renderer, and client-side PDF/MD exports.
 */
export default function PRDViewer({ prd, onClose }: PRDViewerProps) {
  const [copied, setCopied] = useState<boolean>(false);

  // Parse structured JSON content safely
  let parsedContent: PRDStructuredContent | null = null;
  try {
    parsedContent = JSON.parse(prd.content);
  } catch {
    parsedContent = null;
  }

  // Generate clean Markdown string representation
  const generateMarkdownString = (): string => {
    if (!parsedContent) return prd.content;

    let md = `# ${parsedContent.title}\n\n`;
    md += `## System Architecture Overview\n${parsedContent.architecture_overview}\n\n`;

    md += `## Database Schema Definitions\n`;
    parsedContent.database_tables.forEach((table) => {
      md += `### Table: \`${table.table_name}\`\n${table.description}\n\n`;
      md += `| Column Name | Type | Constraints |\n`;
      md += `| :--- | :--- | :--- |\n`;
      table.columns.forEach((col) => {
        md += `| \`${col.name}\` | \`${col.type}\` | ${col.constraints} |\n`;
      });
      md += `\n`;
    });

    md += `## Backend API Routes\n`;
    md += `| Method | Path | Function Summary |\n`;
    md += `| :--- | :--- | :--- |\n`;
    parsedContent.api_routes.forEach((route) => {
      md += `| **${route.method}** | \`${route.path}\` | ${route.summary} |\n`;
    });
    md += `\n`;

    md += `## Mermaid Architecture Diagram\n\`\`\`mermaid\n${parsedContent.mermaid_diagram}\n\`\`\`\n`;
    return md;
  };

  // Client-Side Download Markdown File
  const handleDownloadMarkdown = () => {
    const markdownText = generateMarkdownString();
    const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `${prd.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_blueprint.md`;
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Client-Side Download PDF File via jsPDF
  const handleDownloadPDF = () => {
    if (!parsedContent) return;

    const doc = new jsPDF();
    let y = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 14;

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight >= pageHeight - 15) {
        doc.addPage();
        y = 20;
      }
    };

    // Document Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(parsedContent.title, margin, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Blueprint Engine Document | ID: ${prd.id.substring(0, 8)}`, margin, y);
    doc.setTextColor(0);
    y += 12;

    // 1. Architecture Overview
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("1. Architecture Overview", margin, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const archLines = doc.splitTextToSize(parsedContent.architecture_overview, 180);
    checkPageBreak(archLines.length * 5);
    doc.text(archLines, margin, y);
    y += archLines.length * 5 + 8;

    // 2. Database Schema
    checkPageBreak(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("2. Database Schema Definitions", margin, y);
    y += 7;

    parsedContent.database_tables.forEach((tbl) => {
      checkPageBreak(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`Table: ${tbl.table_name}`, margin, y);
      y += 5;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text(`Description: ${tbl.description}`, margin, y);
      y += 6;

      tbl.columns.forEach((col) => {
        checkPageBreak(5);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.text(`- ${col.name} (${col.type}): ${col.constraints}`, margin + 4, y);
        y += 4.5;
      });
      y += 4;
    });

    // 3. API Routes
    checkPageBreak(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("3. API Routes", margin, y);
    y += 7;

    parsedContent.api_routes.forEach((rt) => {
      checkPageBreak(6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(`[${rt.method}] ${rt.path} - ${rt.summary}`, margin, y);
      y += 5;
    });

    // Save generated PDF
    const filename = `${prd.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_blueprint.pdf`;
    doc.save(filename);
  };

  // Copy Markdown to Clipboard
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Badge styling helper for HTTP methods
  const getMethodBadgeStyle = (method: string) => {
    const m = method.toUpperCase();
    if (m === "GET") return "bg-emerald-950 text-emerald-400 border-emerald-800";
    if (m === "POST") return "bg-sky-950 text-sky-400 border-sky-800";
    if (m === "PUT" || m === "PATCH") return "bg-amber-950 text-amber-400 border-amber-800";
    if (m === "DELETE") return "bg-rose-950 text-rose-400 border-rose-800";
    return "bg-gray-800 text-gray-300 border-gray-700";
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6 shadow-2xl">
      {/* Header Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-100">{prd.title}</h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Created: {new Date(prd.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 text-xs font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy MD"}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 text-xs font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download MD</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-950 text-xs font-semibold hover:bg-gray-300 transition-colors shadow"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Structured Blueprint View */}
      {parsedContent ? (
        <div className="space-y-8 text-sm text-gray-300">
          {/* Section 1: Architecture Overview */}
          <section className="space-y-3">
            <h3 className="text-xs font-mono uppercase font-bold text-gray-400 tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-gray-300" />
              <span>1. System Architecture Overview</span>
            </h3>
            <div className="bg-gray-950 p-5 rounded-xl border border-gray-800 leading-relaxed text-gray-300 text-xs sm:text-sm">
              {parsedContent.architecture_overview}
            </div>
          </section>

          {/* Section 2: Interactive Mermaid.js Flowchart */}
          <section className="space-y-3">
            <h3 className="text-xs font-mono uppercase font-bold text-gray-400 tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-gray-300" />
              <span>2. Visual System Flowchart (Mermaid.js)</span>
            </h3>
            <MermaidRenderer chart={parsedContent.mermaid_diagram} />
          </section>

          {/* Section 3: Database Schema Tables */}
          <section className="space-y-4">
            <h3 className="text-xs font-mono uppercase font-bold text-gray-400 tracking-wider flex items-center space-x-2">
              <Database className="w-4 h-4 text-gray-300" />
              <span>3. Relational Database Schema Definitions</span>
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {parsedContent.database_tables.map((table, idx) => (
                <div key={idx} className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-gray-100 text-xs bg-gray-900 px-3 py-1 rounded-md border border-gray-800">
                      Table: {table.table_name}
                    </span>
                    <span className="text-xs text-gray-400">{table.description}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-800 text-gray-400 font-mono">
                          <th className="py-2 px-3">Column Name</th>
                          <th className="py-2 px-3">Data Type</th>
                          <th className="py-2 px-3">Constraints</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/60">
                        {table.columns.map((col, cIdx) => (
                          <tr key={cIdx} className="text-gray-300 hover:bg-gray-900/40">
                            <td className="py-2 px-3 font-mono font-medium text-gray-100 flex items-center space-x-1.5">
                              <Key className="w-3 h-3 text-gray-500" />
                              <span>{col.name}</span>
                            </td>
                            <td className="py-2 px-3 font-mono text-gray-400">{col.type}</td>
                            <td className="py-2 px-3 text-gray-400">{col.constraints}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Badge-style API Routes */}
          <section className="space-y-3">
            <h3 className="text-xs font-mono uppercase font-bold text-gray-400 tracking-wider flex items-center space-x-2">
              <Route className="w-4 h-4 text-gray-300" />
              <span>4. Backend REST API Endpoints</span>
            </h3>
            <div className="bg-gray-950 rounded-xl border border-gray-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 font-mono">
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Endpoint Path</th>
                    <th className="py-3 px-4">Function Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {parsedContent.api_routes.map((route, rIdx) => (
                    <tr key={rIdx} className="hover:bg-gray-900/40">
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-mono font-bold border ${getMethodBadgeStyle(route.method)}`}>
                          {route.method}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-gray-200">{route.path}</td>
                      <td className="py-3 px-4 text-gray-400">{route.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : (
        <pre className="bg-gray-950 p-4 rounded-lg border border-gray-800 text-xs font-mono text-gray-300 overflow-x-auto">
          {prd.content}
        </pre>
      )}
    </div>
  );
}
