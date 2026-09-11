"use client";

import React from "react";
import Link from "next/link";

/**
 * Navbar component for global application navigation.
 * Renders brand logo and top navigation links in high-contrast grayscale style.
 */
export default function Navbar() {
  return (
    <header className="w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-950 font-bold flex items-center justify-center text-lg group-hover:bg-gray-300 transition-colors">
            B
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-100 group-hover:text-gray-300 transition-colors">
            Blueprint<span className="text-gray-400">Engine</span>
          </span>
        </Link>

        {/* Header Links */}
        <nav className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-300 hover:text-gray-100 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium text-gray-400 hover:text-gray-100 transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm font-medium text-gray-400 hover:text-gray-100 transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold px-4 py-2 rounded-md bg-gray-100 text-gray-950 hover:bg-gray-300 transition-colors"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
