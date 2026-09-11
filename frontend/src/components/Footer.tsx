import React from "react";
import Link from "next/link";
import { Cpu, Github, ShieldCheck, Activity } from "lucide-react";

/**
 * Shadcn-styled Technical Footer Block.
 * Includes architectural system health badge, legal links, and GitHub developer link.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/80 bg-card/40 backdrop-blur-md mt-auto py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-border/60">
          {/* Brand & System Statement */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-bold text-foreground tracking-tight text-sm">
                Blueprint<span className="text-primary">Engine</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Automated system architecture, database schema, and technical requirements generator for modern engineering teams.
            </p>
          </div>

          {/* Operational Health Badge */}
          <div className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-secondary border border-border text-xs font-mono text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-500 font-medium">All Engine Services Operational</span>
            <span className="text-border">|</span>
            <span className="text-[11px] text-muted-foreground">Gemini 1.5 Flash</span>
          </div>
        </div>

        {/* Links & Attribution Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} Blueprint Engine. Distributed under MIT License.</p>

          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Studio
            </Link>
          </div>

          {/* Developer Watermark Link */}
          <a
            href="https://github.com/Zohaib251"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] bg-secondary/80 hover:bg-secondary border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full transition-all cursor-pointer inline-flex items-center space-x-2 group shadow-xs"
          >
            <Github className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span>
              Engineered with <span className="text-foreground font-semibold group-hover:text-primary transition-colors">Blueprint Engine</span>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
