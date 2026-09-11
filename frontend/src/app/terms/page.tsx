import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms of service and usage conditions for Blueprint Engine.",
};

/**
 * Terms & Conditions Boilerplate Page Component.
 */
export default function TermsPage() {
  return (
    <article className="max-w-4xl mx-auto py-8 text-gray-300 space-y-8">
      <header className="border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Terms & Conditions</h1>
        <p className="text-xs text-gray-500 font-mono">Last updated: September 11, 2026</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-200">1. Acceptance of Terms</h2>
        <p className="text-sm leading-relaxed text-gray-400">
          By accessing or using Blueprint Engine, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must refrain from using the application.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-200">2. Free Tier Quotas & Account Limits</h2>
        <p className="text-sm leading-relaxed text-gray-400">
          Standard user accounts are subject to a maximum quota of 5 PRD generations per calendar month. Attempting to bypass rate limits or system quotas via automated scripts is strictly prohibited.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-200">3. Intellectual Property</h2>
        <p className="text-sm leading-relaxed text-gray-400">
          You retain full ownership rights over the project briefs submitted to Blueprint Engine and the resulting architectural PRDs generated for your account.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-200">4. Limitation of Liability</h2>
        <p className="text-sm leading-relaxed text-gray-400">
          Blueprint Engine is provided &quot;as is&quot; without warranties of any kind. AI-generated architectural specifications should be reviewed by qualified human software engineers prior to production deployment.
        </p>
      </section>
    </article>
  );
}
