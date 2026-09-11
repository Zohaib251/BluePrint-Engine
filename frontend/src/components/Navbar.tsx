"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut, 
  ChevronRight, 
  User as UserIcon,
  Cpu,
  Sun,
  Moon
} from "lucide-react";

/**
 * Shadcn-styled Header Navigation Block.
 * Features glassmorphism, glowing brand marks, route indicators, user quota preview,
 * and live Claude Blu 2 Light/Dark theme switcher.
 */
export default function Navbar() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window === "undefined") return;
    const currentlyDark = document.documentElement.classList.contains("dark");
    if (currentlyDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("blueprint_theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("blueprint_theme", "dark");
      setIsDarkMode(true);
    }
  };

  const navLinks = [
    { name: "Overview", href: "/" },
    { name: "Studio", href: "/dashboard" },
    ...(isAdmin ? [{ name: "Admin Center", href: "/admin", isAdminOnly: true }] : []),
    { name: "Legal & Privacy", href: "/privacy" },
  ];

  return (
    <header className="w-full border-b border-border/80 bg-background/80 backdrop-blur-xl sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo Block */}
        <Link href="/" className="flex items-center space-x-2.5 group cursor-pointer">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-semibold shadow-sm transition-transform group-hover:scale-105">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground flex items-center space-x-1">
              <span>Blueprint</span>
              <span className="text-primary">Engine</span>
            </span>
            <span className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">Studio v0.1</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? "text-foreground bg-secondary font-semibold shadow-xs"
                    : link.isAdminOnly
                    ? "text-emerald-500 hover:text-emerald-400 hover:bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Authentication & Action CTA Block */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-lg bg-secondary/80 text-foreground hover:bg-secondary border border-border transition-all cursor-pointer"
            aria-label="Toggle theme mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-card border border-border text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium text-foreground max-w-[120px] truncate">{user.username}</span>
                {isAdmin ? (
                  <span className="text-[10px] font-mono bg-secondary text-foreground border border-border px-1.5 py-0.5 rounded">
                    ADMIN
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {user.generation_count}/5
                  </span>
                )}
              </div>

              <button
                onClick={logout}
                title="Sign out of your session"
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/signin"
                className="px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-md text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 shadow-sm transition-colors"
              >
                <span>Launch Studio</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 border border-border transition-all cursor-pointer"
            aria-label="Toggle theme mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground border border-border transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Block */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-3 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === link.href
                    ? "text-foreground bg-secondary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-border flex flex-col space-y-2">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-card border border-border text-xs">
                <span className="text-foreground font-medium">{user.username}</span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-400 hover:underline flex items-center space-x-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg text-xs font-medium bg-secondary text-foreground border border-border"
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 shadow-sm"
                >
                  Launch Studio
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
