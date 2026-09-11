"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Navbar component for global application navigation.
 * Renders brand logo, user state, and navigation links.
 */
export default function Navbar() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group cursor-pointer">
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
            href="/dashboard"
            className={`text-sm font-medium transition-colors cursor-pointer ${
              pathname === "/dashboard" ? "text-gray-100 font-semibold underline underline-offset-4" : "text-gray-300 hover:text-gray-100"
            }`}
          >
            Dashboard
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className={`text-xs font-mono px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                pathname === "/admin"
                  ? "bg-emerald-950 text-emerald-400 border-emerald-700 font-bold"
                  : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
              }`}
            >
              Admin Panel
            </Link>
          )}

          <Link
            href="/privacy"
            className={`text-sm font-medium transition-colors hidden sm:inline cursor-pointer ${
              pathname === "/privacy" ? "text-gray-100 font-semibold underline underline-offset-4" : "text-gray-400 hover:text-gray-100"
            }`}
          >
            Privacy
          </Link>

          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-xs font-medium text-gray-400 bg-gray-900 border border-gray-800 px-2.5 py-1 rounded-md">
                {user.username} {isAdmin && <span className="text-emerald-400 font-semibold">(Admin)</span>}
              </span>
              <button
                onClick={logout}
                className="text-xs font-semibold px-3 py-1.5 rounded-md bg-rose-950/40 border border-rose-900/60 text-rose-300 hover:bg-rose-900/60 hover:text-rose-100 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/signin"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-md text-gray-300 hover:text-gray-100 transition-colors cursor-pointer"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-xs font-semibold px-4 py-2 rounded-md bg-gray-100 text-gray-950 hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

