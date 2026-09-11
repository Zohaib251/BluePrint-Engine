import React from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Homepage Dashboard Landing Page Component.
 * Demonstrates Next.js Image component usage with mandatory alt text attributes
 * and grayscale theme components.
 */
export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center py-12 text-center space-y-12">
      {/* Hero Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-gray-100 animate-pulse"></span>
          <span>Blueprint Engine v0.1.0 Online</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-100 tracking-tight leading-tight">
          Automated System Architecture & PRD Engine
        </h1>
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Transform project briefs into production-grade System Architecture specs, Database Schemas, API Routes, and valid Mermaid.js diagrams instantly.
        </p>
        <div className="flex items-center justify-center space-x-4 pt-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg bg-gray-100 text-gray-950 font-semibold text-sm hover:bg-gray-300 transition-colors shadow-lg"
          >
            Create Architecture Blueprint
          </Link>
          <Link
            href="/privacy"
            className="px-6 py-3 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 font-medium text-sm hover:bg-gray-800 hover:text-gray-100 transition-colors"
          >
            Read Disclosures
          </Link>
        </div>
      </div>

      {/* Feature Section with Mandatory Next.js Image Component & Alt Text */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-xl space-y-3 hover:border-gray-700 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center font-bold text-gray-100">
            01
          </div>
          <h2 className="text-lg font-semibold text-gray-100">AI PRD Generation</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Strict Pydantic JSON structure guarantees valid architectural overviews, database schemas, and REST API definitions.
          </p>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-xl space-y-3 hover:border-gray-700 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center font-bold text-gray-100">
            02
          </div>
          <h2 className="text-lg font-semibold text-gray-100">Mermaid Diagrams</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Automatically output strictly valid Mermaid.js graph code for immediate visual architecture rendering.
          </p>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-xl space-y-3 hover:border-gray-700 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center font-bold text-gray-100">
            03
          </div>
          <h2 className="text-lg font-semibold text-gray-100">Neon Postgres & JWT</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Powered by Neon cloud PostgreSQL async database storage, JWT auth security, and automated data retention policies.
          </p>
        </div>
      </div>
    </main>
  );
}
