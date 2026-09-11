"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupUser, signinUser } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { secureInputProps } from "@/components/SecurityProvider";
import { Cpu, Lock, User, ArrowRight, Loader2, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * Modern Shadcn Registration Card Block.
 * Features validation feedback, anti-inspect protection, and automated session sign-in.
 */
export default function SignUpPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signupUser(username.trim(), password);
      await signinUser(username.trim(), password);
      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try a different username.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-md mx-auto py-12 sm:py-16 px-4">
      <div className="rounded-3xl p-7 sm:p-9 bg-card/70 border border-border backdrop-blur-2xl shadow-2xl space-y-6 relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/10 blur-3xl pointer-events-none" />

        {/* Brand & Heading */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-2 shadow-cyan-glow">
            <Cpu className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Architect Account</h1>
          <p className="text-xs text-muted-foreground">
            Get instant access to 5-module system architecture blueprints.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-950/40 border border-rose-600/70 text-rose-100 p-3.5 rounded-xl flex items-start space-x-2.5 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-rose-200/90 leading-relaxed">{error}</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. alex_architect"
                required
                {...secureInputProps}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-background/80 border border-border text-foreground text-xs focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                {...secureInputProps}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-background/80 border border-border text-foreground text-xs focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                {...secureInputProps}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-background/80 border border-border text-foreground text-xs focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs text-primary-foreground bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 shadow-cyan-glow transition-all hover:scale-[1.01] flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Provisioning Account...</span>
              </>
            ) : (
              <>
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Switcher */}
        <div className="space-y-3 pt-2 text-center">
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4">
              Sign in
            </Link>
          </p>

          <div className="pt-2 border-t border-border flex items-center justify-center space-x-1.5 text-[11px] font-mono text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>5 Free Generations Included Monthly</span>
          </div>
        </div>
      </div>
    </main>
  );
}
