"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidRendererProps {
  chart: string;
}

/**
 * MermaidRenderer Component.
 * Dynamically renders strict Mermaid.js graph syntax strings into interactive SVG flowcharts.
 */
export default function MermaidRenderer({ chart }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [renderError, setRenderError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    // Clean raw chart string (remove markdown code fences if present)
    let cleanedChart = chart
      .trim()
      .replace(/^```mermaid\s*/i, "")
      .replace(/^```\s*/, "")
      .replace(/\s*```$/, "")
      .trim();

    if (!cleanedChart.startsWith("graph") && !cleanedChart.startsWith("sequenceDiagram") && !cleanedChart.startsWith("classDiagram") && !cleanedChart.startsWith("erDiagram")) {
      cleanedChart = `graph TD\n${cleanedChart}`;
    }

    // Initialize Mermaid configuration for high-contrast dark theme with strict XSS protection
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "strict",
      fontFamily: "var(--font-poppins)",
    });

    const renderChart = async () => {
      try {
        const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, cleanedChart);
        if (isMounted) {
          setSvgContent(svg);
          setRenderError(false);
        }
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        if (isMounted) {
          setRenderError(true);
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (renderError) {
    return (
      <div className="space-y-2">
        <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg text-xs font-mono text-gray-400">
          <p className="text-rose-400 font-semibold mb-1">Visual Diagram Fallback</p>
          <pre className="overflow-x-auto text-gray-300"><code>{chart}</code></pre>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-950 p-4 rounded-lg border border-gray-800 overflow-x-auto flex justify-center items-center">
      <div
        ref={containerRef}
        className="mermaid-svg-container max-w-full"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
}
