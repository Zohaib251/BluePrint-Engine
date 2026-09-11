import React from "react";
import Link from "next/link";

/**
 * Footer component for global application footer.
 * Includes legal links, copyright, and mandatory developer watermark.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-800 bg-gray-950 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        {/* Copyright notice */}
        <div>
          © {currentYear} Blueprint Engine. All rights reserved.
        </div>

        {/* Legal links */}
        <div className="flex items-center space-x-6">
          <Link
            href="/privacy"
            className="hover:text-gray-200 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-gray-200 transition-colors">
            Terms & Conditions
          </Link>
        </div>

        {/* Developer Watermark */}
        <div className="text-xs font-mono text-gray-500 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
          Engineered with <span className="text-gray-200 font-semibold">Blueprint Engine</span>
        </div>
      </div>
    </footer>
  );
}
