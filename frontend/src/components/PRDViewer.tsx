"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PRDHistory, PRDStructuredContent } from "@/lib/api";
import MermaidRenderer from "@/components/MermaidRenderer";
import {
  Download,
  FileText,
  Copy,
  Check,
  X,
  Database,
  Layers,
  Route,
  Key,
  Cpu,
  Server,
  DollarSign,
  CheckCircle2,
  Calendar,
  Shield,
  Zap,
  Globe,
  Loader2,
} from "lucide-react";

interface PRDViewerProps {
  prd: PRDHistory;
  onClose?: () => void;
}

/**
 * Helper to rasterize the Mermaid diagram SVG into a PNG data URL for embedding in PDF.
 */
async function getMermaidPngDataUrl(): Promise<{ dataUrl: string; width: number; height: number } | null> {
  if (typeof window === "undefined") return null;
  const svgElement = document.querySelector(".mermaid-svg-container svg") as SVGSVGElement | null;
  if (!svgElement) return null;

  return new Promise((resolve) => {
    try {
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgElement);
      if (!svgString.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        const bbox = svgElement.getBoundingClientRect();
        const w = Math.max(bbox.width || 800, 600);
        const h = Math.max(bbox.height || 400, 300);

        const canvas = document.createElement("canvas");
        const scale = 2;
        canvas.width = w * scale;
        canvas.height = h * scale;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve(null);
          return;
        }

        // Fill background with a clean dark slate
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const pngDataUrl = canvas.toDataURL("image/png");
        URL.revokeObjectURL(url);
        resolve({ dataUrl: pngDataUrl, width: w, height: h });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };

      img.src = url;
    } catch {
      resolve(null);
    }
  });
}

/**
 * PRDViewer Component.
 * Elite 5-Module Master Product & Technical Blueprint viewer.
 * Includes complete UI tabs/sections, interactive Mermaid.js diagram,
 * rich Markdown export, and high-fidelity PDF export with embedded tables & diagrams.
 */
export default function PRDViewer({ prd, onClose }: PRDViewerProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  // Parse structured JSON content safely
  let parsedContent: PRDStructuredContent | null = null;
  try {
    parsedContent = JSON.parse(prd.content);
  } catch {
    parsedContent = null;
  }

  const isFiveModuleBlueprint = Boolean(parsedContent && parsedContent.module_1_prd);

  // Generate comprehensive GitHub-flavored Markdown string
  const generateMarkdownString = (): string => {
    if (!parsedContent) return prd.content;

    let md = `# ${parsedContent.title || prd.title}\n\n`;
    md += `> **Document Type:** Master Product & Technical Blueprint (Code-Free Architecture)\n`;
    md += `> **Blueprint ID:** \`${prd.id}\` | **Generated:** ${new Date(prd.created_at).toLocaleDateString()}\n\n`;
    md += `---\n\n`;

    if (parsedContent.module_1_prd) {
      md += `## MODULE 1: PRODUCT REQUIREMENTS DOCUMENT (PRD)\n\n`;
      md += `### 1.1 Executive Summary\n${parsedContent.module_1_prd.executive_summary}\n\n`;

      md += `### 1.2 Scope Matrix (MVP vs. Phase 2)\n\n`;
      md += `| Feature Name | Scope Tier | Priority | Details & Rationale |\n`;
      md += `| :--- | :--- | :--- | :--- |\n`;
      parsedContent.module_1_prd.scope_matrix.forEach((item) => {
        md += `| **${item.feature}** | ${item.scope} | ${item.priority} | ${item.details} |\n`;
      });
      md += `\n`;

      md += `### 1.3 Core User Stories & Acceptance Criteria\n\n`;
      parsedContent.module_1_prd.user_stories.forEach((story, idx) => {
        md += `#### Story ${idx + 1}: As a ${story.user_type}\n`;
        md += `**Action:** I want to ${story.action}\n`;
        md += `**Value:** So that ${story.value}\n\n`;
        md += `*Acceptance Criteria:*\n`;
        story.acceptance_criteria.forEach((crit) => {
          md += `- [ ] ${crit}\n`;
        });
        md += `\n`;
      });
    }

    if (parsedContent.module_2_infrastructure) {
      md += `---\n\n`;
      md += `## MODULE 2: TRAFFIC-DRIVEN INFRASTRUCTURE & SCALING SPECIFICATION\n\n`;
      md += `### 2.1 Hosting Architecture\n${parsedContent.module_2_infrastructure.hosting_architecture}\n\n`;
      md += `**Scaling Rationale ("Why"):**\n${parsedContent.module_2_infrastructure.hosting_rationale}\n\n`;
      md += `### 2.2 Caching & CDN Strategy\n${parsedContent.module_2_infrastructure.caching_cdn_strategy}\n\n`;
      md += `### 2.3 Availability & Data Safety SLAs\n${parsedContent.module_2_infrastructure.availability_and_safety}\n\n`;
    }

    if (parsedContent.module_3_tech_stack) {
      md += `---\n\n`;
      md += `## MODULE 3: BUDGET-OPTIMIZED TECH STACK SELECTION\n\n`;
      md += `### 3.1 Named Technology Stack\n`;
      md += `- **Frontend:** ${parsedContent.module_3_tech_stack.frontend_technology}\n`;
      md += `- **Backend:** ${parsedContent.module_3_tech_stack.backend_technology}\n`;
      md += `- **Database:** ${parsedContent.module_3_tech_stack.database_technology}\n`;
      md += `- **Third-Party APIs & Services:** ${parsedContent.module_3_tech_stack.third_party_tools}\n\n`;

      md += `### 3.2 Estimated Monthly Operational Costs\n\n`;
      md += `| Expense Category | Service / Platform | Estimated Monthly Cost |\n`;
      md += `| :--- | :--- | :--- |\n`;
      parsedContent.module_3_tech_stack.cost_table.forEach((row) => {
        md += `| **${row.category}** | ${row.service_or_tool} | \`${row.estimated_monthly_cost}\` |\n`;
      });
      md += `| **TOTAL ESTIMATED MONTHLY RUN RATE** | **All Core Services** | **\`${parsedContent.module_3_tech_stack.total_monthly_estimate}\`** |\n\n`;
    }

    if (parsedContent.module_4_data_architecture) {
      md += `---\n\n`;
      md += `## MODULE 4: INFORMATION ARCHITECTURE & DATABASE BLUEPRINT\n\n`;
      md += `### 4.1 System Sitemap Tree\n\n`;
      md += `| Screen / View | Route Path | Access Level | Key Panels & Components |\n`;
      md += `| :--- | :--- | :--- | :--- |\n`;
      parsedContent.module_4_data_architecture.sitemap_tree.forEach((node) => {
        md += `| **${node.page_name}** | \`${node.route_path}\` | ${node.access_level} | ${node.key_components} |\n`;
      });
      md += `\n`;

      md += `### 4.2 Relational Data Entities (Schema Tables)\n\n`;
      parsedContent.module_4_data_architecture.database_tables.forEach((tbl) => {
        md += `#### Table: \`${tbl.table_name}\`\n${tbl.description}\n\n`;
        md += `| Column Name | Data Type | Constraints |\n`;
        md += `| :--- | :--- | :--- |\n`;
        tbl.columns.forEach((col) => {
          md += `| \`${col.name}\` | \`${col.type}\` | ${col.constraints} |\n`;
        });
        md += `\n`;
      });

      if (parsedContent.module_4_data_architecture.api_routes && parsedContent.module_4_data_architecture.api_routes.length > 0) {
        md += `### 4.3 Backend API Endpoints\n\n`;
        md += `| Method | Route Path | Purpose Summary |\n`;
        md += `| :--- | :--- | :--- |\n`;
        parsedContent.module_4_data_architecture.api_routes.forEach((rt) => {
          md += `| **${rt.method}** | \`${rt.path}\` | ${rt.summary} |\n`;
        });
        md += `\n`;
      }

      md += `### 4.4 System Architecture Diagram\n\n\`\`\`mermaid\n${parsedContent.module_4_data_architecture.mermaid_diagram}\n\`\`\`\n\n`;
    }

    if (parsedContent.module_5_runbook) {
      md += `---\n\n`;
      md += `## MODULE 5: STEP-BY-STEP DEVELOPER RUNBOOK\n\n`;
      parsedContent.module_5_runbook.milestones.forEach((phase) => {
        md += `### ${phase.phase_name}\n`;
        phase.execution_tasks.forEach((task, tIdx) => {
          md += `${tIdx + 1}. ${task}\n`;
        });
        md += `\n`;
      });
    }

    // Legacy fallback rendering
    if (!isFiveModuleBlueprint) {
      if (parsedContent.architecture_overview) {
        md += `## Architecture Overview\n${parsedContent.architecture_overview}\n\n`;
      }
      if (parsedContent.database_tables) {
        md += `## Database Tables\n`;
        parsedContent.database_tables.forEach((t) => {
          md += `### Table: \`${t.table_name}\`\n${t.description}\n\n`;
        });
      }
      if (parsedContent.mermaid_diagram) {
        md += `## Architecture Diagram\n\`\`\`mermaid\n${parsedContent.mermaid_diagram}\n\`\`\`\n`;
      }
    }

    return md;
  };

  // Client-Side Download Markdown File
  const handleDownloadMarkdown = () => {
    const markdownText = generateMarkdownString();
    const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `${prd.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_master_blueprint.md`;
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Comprehensive Client-Side Download PDF File with Tables & Diagrams
  const handleDownloadPDF = async () => {
    if (!parsedContent) return;
    setIsExportingPdf(true);

    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      let y = 18;

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight >= pageHeight - 15) {
          doc.addPage();
          y = 18;
        }
      };

      // Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(margin, y, contentWidth, 22, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text(parsedContent.title || prd.title, margin + 5, y + 8.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(
        `Master Product & Technical Blueprint | Created: ${new Date(prd.created_at).toLocaleDateString()} | ID: ${prd.id.substring(0, 8)}`,
        margin + 5,
        y + 16
      );
      y += 28;

      if (parsedContent.module_1_prd) {
        // MODULE 1
        checkPageBreak(25);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text("MODULE 1: PRODUCT REQUIREMENTS DOCUMENT (PRD)", margin, y);
        y += 6;

        // Executive Summary
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        doc.text("1.1 Executive Summary", margin, y);
        y += 5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        const summaryLines = doc.splitTextToSize(parsedContent.module_1_prd.executive_summary, contentWidth);
        checkPageBreak(summaryLines.length * 4.5);
        doc.text(summaryLines, margin, y);
        y += summaryLines.length * 4.5 + 6;

        // Scope Matrix Table
        checkPageBreak(20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        doc.text("1.2 Scope Matrix (MVP vs. Phase 2)", margin, y);
        y += 3;

        const scopeBody = parsedContent.module_1_prd.scope_matrix.map((row) => [
          row.feature,
          row.scope,
          row.priority,
          row.details,
        ]);

        autoTable(doc, {
          head: [["Feature Name", "Scope Tier", "Priority", "Details & Rationale"]],
          body: scopeBody,
          startY: y,
          margin: { left: margin, right: margin },
          theme: "striped",
          headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
          bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
          columnStyles: {
            0: { cellWidth: 40, fontStyle: "bold" },
            1: { cellWidth: 35 },
            2: { cellWidth: 25 },
            3: { cellWidth: "auto" },
          },
        });

        y = (doc as any).lastAutoTable.finalY + 8;

        // User Stories & Acceptance Criteria
        checkPageBreak(20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        doc.text("1.3 Core User Stories & Acceptance Criteria", margin, y);
        y += 6;

        parsedContent.module_1_prd.user_stories.forEach((story, sIdx) => {
          checkPageBreak(22);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(15, 23, 42);
          doc.text(`Story ${sIdx + 1}: As a ${story.user_type}, I want to ${story.action}, so that ${story.value}`, margin, y);
          y += 4.5;

          doc.setFont("helvetica", "italic");
          doc.setFontSize(7.5);
          doc.setTextColor(100, 116, 139);
          doc.text("Binary Acceptance Criteria:", margin + 3, y);
          y += 4;

          story.acceptance_criteria.forEach((crit) => {
            checkPageBreak(5);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            doc.setTextColor(71, 85, 105);
            doc.text(`[x]  ${crit}`, margin + 6, y);
            y += 4;
          });
          y += 3;
        });
        y += 5;
      }

      if (parsedContent.module_2_infrastructure) {
        // MODULE 2
        checkPageBreak(25);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text("MODULE 2: TRAFFIC-DRIVEN INFRASTRUCTURE & SCALING", margin, y);
        y += 6;

        const infraData = [
          ["2.1 Hosting Architecture", parsedContent.module_2_infrastructure.hosting_architecture],
          ["Architecture Rationale ('Why')", parsedContent.module_2_infrastructure.hosting_rationale],
          ["2.2 Caching & CDN Strategy", parsedContent.module_2_infrastructure.caching_cdn_strategy],
          ["2.3 Availability & Data Safety", parsedContent.module_2_infrastructure.availability_and_safety],
        ];

        autoTable(doc, {
          head: [["Infrastructure Dimension", "Scaling Strategy Specification"]],
          body: infraData,
          startY: y,
          margin: { left: margin, right: margin },
          theme: "grid",
          headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
          bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
          columnStyles: {
            0: { cellWidth: 50, fontStyle: "bold" },
            1: { cellWidth: "auto" },
          },
        });

        y = (doc as any).lastAutoTable.finalY + 8;
      }

      if (parsedContent.module_3_tech_stack) {
        // MODULE 3
        checkPageBreak(25);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text("MODULE 3: BUDGET-OPTIMIZED TECH STACK SELECTION", margin, y);
        y += 6;

        const stackData = [
          ["Frontend Framework", parsedContent.module_3_tech_stack.frontend_technology],
          ["Backend API & Runtime", parsedContent.module_3_tech_stack.backend_technology],
          ["Database Service", parsedContent.module_3_tech_stack.database_technology],
          ["Third-Party APIs & Security", parsedContent.module_3_tech_stack.third_party_tools],
        ];

        autoTable(doc, {
          head: [["Technology Tier", "Selected Framework / Service (No Code)"]],
          body: stackData,
          startY: y,
          margin: { left: margin, right: margin },
          theme: "grid",
          headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
          bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
          columnStyles: {
            0: { cellWidth: 50, fontStyle: "bold" },
            1: { cellWidth: "auto" },
          },
        });
        y = (doc as any).lastAutoTable.finalY + 6;

        // Operational Costs
        checkPageBreak(20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        doc.text(`3.2 Estimated Monthly Operational Costs (Total: ${parsedContent.module_3_tech_stack.total_monthly_estimate})`, margin, y);
        y += 3;

        const costData: any[] = parsedContent.module_3_tech_stack.cost_table.map((c) => [
          c.category,
          c.service_or_tool,
          c.estimated_monthly_cost,
        ]);
        costData.push(["TOTAL ESTIMATED MONTHLY RUN RATE", "All Integrated Infrastructure", parsedContent.module_3_tech_stack.total_monthly_estimate]);

        autoTable(doc, {
          head: [["Expense Category", "Platform / Service", "Monthly Estimate"]],
          body: costData,
          startY: y,
          margin: { left: margin, right: margin },
          theme: "striped",
          headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
          bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
          columnStyles: {
            0: { cellWidth: 50, fontStyle: "bold" },
            1: { cellWidth: 70 },
            2: { cellWidth: "auto", fontStyle: "bold" },
          },
        });
        y = (doc as any).lastAutoTable.finalY + 8;
      }

      if (parsedContent.module_4_data_architecture) {
        // MODULE 4
        checkPageBreak(25);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text("MODULE 4: INFORMATION ARCHITECTURE & DATABASE BLUEPRINT", margin, y);
        y += 6;

        // Sitemap
        checkPageBreak(20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        doc.text("4.1 System Sitemap Tree", margin, y);
        y += 3;

        const sitemapData = parsedContent.module_4_data_architecture.sitemap_tree.map((node) => [
          node.page_name,
          node.route_path,
          node.access_level,
          node.key_components,
        ]);

        autoTable(doc, {
          head: [["Screen / Page Name", "URL Route Path", "Access Level", "Key Layout Components"]],
          body: sitemapData,
          startY: y,
          margin: { left: margin, right: margin },
          theme: "striped",
          headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
          bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
        });
        y = (doc as any).lastAutoTable.finalY + 6;

        // Relational Entities
        checkPageBreak(20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        doc.text("4.2 Relational Data Entities (Entity Schemas)", margin, y);
        y += 4;

        parsedContent.module_4_data_architecture.database_tables.forEach((tbl) => {
          checkPageBreak(25);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(15, 23, 42);
          doc.text(`Table: ${tbl.table_name} - ${tbl.description}`, margin, y);
          y += 3;

          const colData = tbl.columns.map((col) => [col.name, col.type, col.constraints]);
          autoTable(doc, {
            head: [["Column Name", "Data Type", "Constraints (PK / FK / Not Null)"]],
            body: colData,
            startY: y,
            margin: { left: margin, right: margin },
            theme: "grid",
            headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7.5 },
            bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
          });
          y = (doc as any).lastAutoTable.finalY + 5;
        });

        // Visual Mermaid Diagram Embedded into PDF
        const diagramImage = await getMermaidPngDataUrl();
        if (diagramImage) {
          checkPageBreak(50);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(51, 65, 85);
          doc.text("4.3 Visual Architecture Flowchart (Mermaid.js)", margin, y);
          y += 4;

          const imgWidth = contentWidth;
          const imgHeight = (diagramImage.height * imgWidth) / diagramImage.width;
          const clampedHeight = Math.min(imgHeight, 130);
          checkPageBreak(clampedHeight + 10);
          doc.addImage(diagramImage.dataUrl, "PNG", margin, y, imgWidth, clampedHeight);
          y += clampedHeight + 8;
        }
      }

      if (parsedContent.module_5_runbook) {
        // MODULE 5
        checkPageBreak(25);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text("MODULE 5: STEP-BY-STEP DEVELOPER RUNBOOK", margin, y);
        y += 6;

        parsedContent.module_5_runbook.milestones.forEach((phase) => {
          checkPageBreak(20);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(15, 23, 42);
          doc.text(phase.phase_name, margin, y);
          y += 3;

          const tasksData = phase.execution_tasks.map((task, tIdx) => [`Step ${tIdx + 1}`, task]);
          autoTable(doc, {
            head: [["Step", "Actionable Developer Task"]],
            body: tasksData,
            startY: y,
            margin: { left: margin, right: margin },
            theme: "striped",
            headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
            bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
            columnStyles: {
              0: { cellWidth: 20, fontStyle: "bold" },
              1: { cellWidth: "auto" },
            },
          });
          y = (doc as any).lastAutoTable.finalY + 6;
        });
      }

      // Legacy fallback PDF rendering
      if (!isFiveModuleBlueprint) {
        if (parsedContent.architecture_overview) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.text("System Architecture Overview", margin, y);
          y += 6;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          const archLines = doc.splitTextToSize(parsedContent.architecture_overview, contentWidth);
          doc.text(archLines, margin, y);
          y += archLines.length * 4.5 + 8;
        }
      }

      const filename = `${prd.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_master_blueprint.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Copy Markdown to Clipboard
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8 shadow-2xl">
      {/* Header Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center space-x-2.5 mb-1">
            <h2 className="text-xl font-bold text-gray-100">{parsedContent?.title || prd.title}</h2>
            <span className="text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded font-semibold tracking-wider">
              Master Blueprint
            </span>
          </div>
          <p className="text-xs text-gray-400 font-mono">
            ID: <span className="text-gray-300">{prd.id.substring(0, 8)}</span> &bull; Generated: {new Date(prd.created_at).toLocaleDateString()} &bull; Code-Free Specifications
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-gray-800 text-gray-200 text-xs font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy MD"}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-gray-800 text-gray-200 text-xs font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download MD</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isExportingPdf}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gray-100 text-gray-950 text-xs font-bold hover:bg-gray-300 transition-colors shadow disabled:opacity-50"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </>
            )}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-gray-100 transition-colors border border-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 5-MODULE MASTER BLUEPRINT CONTENT */}
      {parsedContent && isFiveModuleBlueprint ? (
        <div className="space-y-10 text-sm text-gray-300">
          {/* ================= MODULE 1: PRD ================= */}
          {parsedContent.module_1_prd && (
            <section className="space-y-5">
              <div className="flex items-center space-x-2.5 pb-2 border-b border-gray-800">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                  1
                </span>
                <h3 className="text-sm font-bold text-gray-100 tracking-wide uppercase font-mono">
                  Product Requirements Document (PRD)
                </h3>
              </div>

              {/* 1.1 Executive Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  1.1 Executive Summary
                </h4>
                <div className="bg-gray-950 p-5 rounded-xl border border-gray-800 leading-relaxed text-gray-200 text-xs sm:text-sm">
                  {parsedContent.module_1_prd.executive_summary}
                </div>
              </div>

              {/* 1.2 Scope Matrix */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  1.2 Scope Matrix (MVP vs. Phase 2)
                </h4>
                <div className="bg-gray-950 rounded-xl border border-gray-800 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-400 font-mono bg-gray-900/60">
                        <th className="py-3 px-4">Feature Name</th>
                        <th className="py-3 px-4">Scope Tier</th>
                        <th className="py-3 px-4">Priority</th>
                        <th className="py-3 px-4">Details & Boundary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/80">
                      {parsedContent.module_1_prd.scope_matrix.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-900/40">
                          <td className="py-3 px-4 font-semibold text-gray-100 font-mono">
                            {item.feature}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-mono font-medium border ${
                                item.scope.toLowerCase().includes("mvp") || item.scope.toLowerCase().includes("in-scope")
                                  ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                                  : "bg-gray-800 text-gray-300 border-gray-700"
                              }`}
                            >
                              {item.scope}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                                item.priority.includes("P0")
                                  ? "bg-rose-950 text-rose-400 border-rose-800"
                                  : "bg-amber-950 text-amber-400 border-amber-800"
                              }`}
                            >
                              {item.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-300 leading-relaxed">
                            {item.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 1.3 Core User Stories */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  1.3 Core User Stories & Binary Acceptance Criteria
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parsedContent.module_1_prd.user_stories.map((story, sIdx) => (
                    <div key={sIdx} className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-700">
                          STORY {sIdx + 1}
                        </span>
                        <span className="text-xs font-semibold text-gray-200">
                          Persona: {story.user_type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        <strong className="text-gray-100">Action:</strong> I want to {story.action}
                      </p>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        <strong className="text-gray-300">Value:</strong> So that {story.value}
                      </p>
                      <div className="pt-2 border-t border-gray-900 space-y-1.5">
                        <span className="text-[11px] font-mono text-gray-400 font-semibold block">
                          Acceptance Criteria:
                        </span>
                        {story.acceptance_criteria.map((crit, cIdx) => (
                          <div key={cIdx} className="flex items-start space-x-2 text-xs text-gray-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{crit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ================= MODULE 2: INFRASTRUCTURE ================= */}
          {parsedContent.module_2_infrastructure && (
            <section className="space-y-5">
              <div className="flex items-center space-x-2.5 pb-2 border-b border-gray-800">
                <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold font-mono">
                  2
                </span>
                <h3 className="text-sm font-bold text-gray-100 tracking-wide uppercase font-mono">
                  Traffic-Driven Infrastructure & Scaling Specification
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 2.1 Hosting Architecture */}
                <div className="bg-gray-950 p-5 rounded-xl border border-gray-800 space-y-3">
                  <div className="flex items-center space-x-2 text-sky-400 font-semibold text-xs uppercase tracking-wider">
                    <Server className="w-4 h-4" />
                    <span>2.1 Hosting Architecture</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-100">
                    {parsedContent.module_2_infrastructure.hosting_architecture}
                  </p>
                  <div className="bg-gray-900/60 p-3 rounded-lg border border-gray-800/80 text-xs text-gray-300 leading-relaxed">
                    <strong className="text-gray-200 block mb-1">Architecture Rationale ("Why"):</strong>
                    {parsedContent.module_2_infrastructure.hosting_rationale}
                  </div>
                </div>

                {/* 2.2 Caching & CDN Strategy */}
                <div className="bg-gray-950 p-5 rounded-xl border border-gray-800 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                    <Zap className="w-4 h-4" />
                    <span>2.2 Caching & Edge CDN Strategy</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    {parsedContent.module_2_infrastructure.caching_cdn_strategy}
                  </p>
                </div>

                {/* 2.3 Availability & Data Safety */}
                <div className="bg-gray-950 p-5 rounded-xl border border-gray-800 space-y-3 md:col-span-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                    <Shield className="w-4 h-4" />
                    <span>2.3 Availability SLAs, Latency Targets & Backup Frequencies</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    {parsedContent.module_2_infrastructure.availability_and_safety}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ================= MODULE 3: TECH STACK & COSTS ================= */}
          {parsedContent.module_3_tech_stack && (
            <section className="space-y-5">
              <div className="flex items-center space-x-2.5 pb-2 border-b border-gray-800">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold font-mono">
                  3
                </span>
                <h3 className="text-sm font-bold text-gray-100 tracking-wide uppercase font-mono">
                  Budget-Optimized Tech Stack Selection
                </h3>
              </div>

              {/* Named Tech Stack Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-gray-400 font-semibold">Frontend Layer</span>
                  <p className="text-xs font-bold text-gray-100">{parsedContent.module_3_tech_stack.frontend_technology}</p>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-gray-400 font-semibold">Backend Layer</span>
                  <p className="text-xs font-bold text-gray-100">{parsedContent.module_3_tech_stack.backend_technology}</p>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-gray-400 font-semibold">Database Engine</span>
                  <p className="text-xs font-bold text-gray-100">{parsedContent.module_3_tech_stack.database_technology}</p>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-gray-400 font-semibold">APIs & Integrations</span>
                  <p className="text-xs font-bold text-gray-100">{parsedContent.module_3_tech_stack.third_party_tools}</p>
                </div>
              </div>

              {/* Monthly Cost Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    3.2 Estimated Monthly Operational Costs
                  </h4>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded border border-emerald-800">
                    Est. Total: {parsedContent.module_3_tech_stack.total_monthly_estimate}
                  </span>
                </div>

                <div className="bg-gray-950 rounded-xl border border-gray-800 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-400 font-mono bg-gray-900/60">
                        <th className="py-3 px-4">Expense Category</th>
                        <th className="py-3 px-4">Recommended Service / Platform</th>
                        <th className="py-3 px-4">Estimated Monthly Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/80">
                      {parsedContent.module_3_tech_stack.cost_table.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-900/40">
                          <td className="py-3 px-4 font-mono font-semibold text-gray-200">
                            {row.category}
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {row.service_or_tool}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-emerald-400">
                            {row.estimated_monthly_cost}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-900/80 font-bold border-t-2 border-gray-800 text-gray-100">
                        <td className="py-3 px-4 uppercase font-mono">Total Estimated Run Rate</td>
                        <td className="py-3 px-4 text-gray-400">Integrated Architecture</td>
                        <td className="py-3 px-4 font-mono text-emerald-300 text-xs">
                          {parsedContent.module_3_tech_stack.total_monthly_estimate}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ================= MODULE 4: INFORMATION ARCHITECTURE & DB ================= */}
          {parsedContent.module_4_data_architecture && (
            <section className="space-y-6">
              <div className="flex items-center space-x-2.5 pb-2 border-b border-gray-800">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold font-mono">
                  4
                </span>
                <h3 className="text-sm font-bold text-gray-100 tracking-wide uppercase font-mono">
                  Information Architecture & Database Blueprint
                </h3>
              </div>

              {/* 4.1 Sitemap Tree */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  4.1 System Sitemap Tree & Route Map
                </h4>
                <div className="bg-gray-950 rounded-xl border border-gray-800 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-400 font-mono bg-gray-900/60">
                        <th className="py-3 px-4">Screen / View</th>
                        <th className="py-3 px-4">URL Route Path</th>
                        <th className="py-3 px-4">Access Level</th>
                        <th className="py-3 px-4">Key Layout Panels & Components</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/80">
                      {parsedContent.module_4_data_architecture.sitemap_tree.map((node, idx) => (
                        <tr key={idx} className="hover:bg-gray-900/40">
                          <td className="py-3 px-4 font-semibold text-gray-100 font-mono">
                            {node.page_name}
                          </td>
                          <td className="py-3 px-4 font-mono text-purple-400">
                            {node.route_path}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-gray-800 text-gray-300 border border-gray-700">
                              {node.access_level}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-300 leading-relaxed">
                            {node.key_components}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4.2 Relational Entities */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  4.2 Relational Data Entities (Entity Schemas)
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {parsedContent.module_4_data_architecture.database_tables.map((table, idx) => (
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
                              <th className="py-2 px-3">Constraints & Relations</th>
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
                                <td className="py-2 px-3 text-gray-300">{col.constraints}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4.3 Visual Mermaid Diagram */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center space-x-2">
                  <Layers className="w-3.5 h-3.5 text-gray-400" />
                  <span>4.3 Visual Architecture Flowchart (Mermaid.js)</span>
                </h4>
                <MermaidRenderer chart={parsedContent.module_4_data_architecture.mermaid_diagram} />
              </div>
            </section>
          )}

          {/* ================= MODULE 5: DEVELOPER RUNBOOK ================= */}
          {parsedContent.module_5_runbook && (
            <section className="space-y-5">
              <div className="flex items-center space-x-2.5 pb-2 border-b border-gray-800">
                <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold font-mono">
                  5
                </span>
                <h3 className="text-sm font-bold text-gray-100 tracking-wide uppercase font-mono">
                  Step-by-Step Developer Runbook
                </h3>
              </div>

              <div className="space-y-4">
                {parsedContent.module_5_runbook.milestones.map((phase, pIdx) => (
                  <div key={pIdx} className="bg-gray-950 p-5 rounded-xl border border-gray-800 space-y-3">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-800 text-gray-200 border border-gray-700">
                        PHASE {phase.phase_number || pIdx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-100 font-mono">
                        {phase.phase_name}
                      </h4>
                    </div>
                    <ul className="space-y-2 pt-1">
                      {phase.execution_tasks.map((task, tIdx) => (
                        <li key={tIdx} className="flex items-start space-x-2.5 text-xs text-gray-300">
                          <span className="font-mono text-gray-500 shrink-0 select-none">
                            {tIdx + 1}.
                          </span>
                          <span className="leading-relaxed">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* Legacy Backward-Compatibility View */
        <div className="space-y-6 text-sm text-gray-300">
          {parsedContent ? (
            <>
              {parsedContent.architecture_overview && (
                <section className="space-y-3">
                  <h3 className="text-xs font-mono uppercase font-bold text-gray-400">
                    System Architecture Overview
                  </h3>
                  <div className="bg-gray-950 p-5 rounded-xl border border-gray-800 leading-relaxed text-gray-300">
                    {parsedContent.architecture_overview}
                  </div>
                </section>
              )}
              {parsedContent.mermaid_diagram && (
                <section className="space-y-3">
                  <h3 className="text-xs font-mono uppercase font-bold text-gray-400">
                    Architecture Diagram
                  </h3>
                  <MermaidRenderer chart={parsedContent.mermaid_diagram} />
                </section>
              )}
              {parsedContent.database_tables && (
                <section className="space-y-4">
                  <h3 className="text-xs font-mono uppercase font-bold text-gray-400">
                    Database Schema Definitions
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {parsedContent.database_tables.map((table, idx) => (
                      <div key={idx} className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3">
                        <span className="font-mono font-bold text-gray-100 text-xs">
                          Table: {table.table_name}
                        </span>
                        <p className="text-xs text-gray-400">{table.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <pre className="bg-gray-950 p-4 rounded-lg border border-gray-800 text-xs font-mono text-gray-300 overflow-x-auto">
              {prd.content}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
