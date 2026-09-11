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
    <article className="max-w-4xl mx-auto py-8 text-foreground space-y-8">
      <header className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground font-mono">Last updated: September 11, 2026</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Blueprint Engine collects minimal account credentials (username, encrypted password hash) and user-generated project briefs to provide AI-driven software architecture, database schema, and PRD generation services.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">2. How We Use Data</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Project briefs provided to Blueprint Engine are processed strictly to generate system architectures and Mermaid diagrams. We do not sell user data to third parties.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">3. Data Retention Policy</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Standard user generation histories are subject to an automated 30-day retention schedule, after which old PRD records are automatically deleted from database storage. Admin accounts maintain permanent data retention.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">4. Security Disclosures</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          All passwords are encrypted using industry-standard bcrypt hashing. Authentication tokens are transmitted over TLS via HTTP Bearer headers.
        </p>
      </section>
    </article>
  );
}
