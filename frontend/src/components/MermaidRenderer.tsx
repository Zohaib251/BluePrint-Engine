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

    const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

    // Initialize Mermaid configuration dynamically adapting to light/dark themes
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      securityLevel: "strict",
      fontFamily: "var(--font-inter), sans-serif",
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

    // Listen for theme attribute mutations on <html>
    const observer = new MutationObserver(() => {
      if (isMounted) {
        renderChart();
      }
    });

    if (typeof document !== "undefined") {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, [chart]);

  if (renderError) {
    return (
      <div className="space-y-2">
        <div className="p-3 bg-background/80 border border-border rounded-lg text-xs font-mono text-muted-foreground">
          <p className="text-rose-400 font-semibold mb-1">Visual Diagram Fallback</p>
          <pre className="overflow-x-auto text-foreground/80"><code>{chart}</code></pre>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background/80 p-4 rounded-lg border border-border overflow-x-auto flex justify-center items-center">
      <div
        ref={containerRef}
        className="mermaid-svg-container max-w-full"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
}
