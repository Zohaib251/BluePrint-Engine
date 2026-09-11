import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and data protection disclosures for Blueprint Engine.",
};

/**
 * Privacy Policy Boilerplate Page Component.
 */
export default function PrivacyPolicyPage() {
  return (
    <article className="max-w-4xl mx-auto py-8 text-gray-300 space-y-8">
      <header className="border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Privacy Policy</h1>
        <p className="text-xs text-gray-500 font-mono">Last updated: September 11, 2026</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-200">1. Information We Collect</h2>
        <p className="text-sm leading-relaxed text-gray-400">
          Blueprint Engine collects minimal account credentials (username, encrypted password hash) and user-generated project briefs to provide AI-driven software architecture, database schema, and PRD generation services.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-200">2. How We Use Data</h2>
        <p className="text-sm leading-relaxed text-gray-400">
          Project briefs provided to Blueprint Engine are processed strictly to generate system architectures and Mermaid diagrams. We do not sell user data to third parties.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-200">3. Data Retention Policy</h2>
        <p className="text-sm leading-relaxed text-gray-400">
          Standard user generation histories are subject to an automated 30-day retention schedule, after which old PRD records are automatically deleted from database storage. Admin accounts maintain permanent data retention.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-200">4. Security Disclosures</h2>
        <p className="text-sm leading-relaxed text-gray-400">
          All passwords are encrypted using industry-standard bcrypt hashing. Authentication tokens are transmitted over TLS via HTTP Bearer headers.
        </p>
      </section>
    </article>
  );
}
