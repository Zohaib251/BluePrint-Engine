import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist on Blueprint Engine.",
};

/**
 * Custom 404 Error Page Component.
 * High-contrast grayscale design with responsive layout and action button.
 */
export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-6 text-muted-foreground font-mono text-xl">
        404
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
        Blueprint Not Found
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-8 leading-relaxed">
        The route or resource you are trying to access has been moved, renamed, or does not exist in the engine directory.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg"
      >
        Return to Dashboard
      </Link>
    </main>
  );
}
