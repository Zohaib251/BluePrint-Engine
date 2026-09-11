"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupUser as registerUser, signinUser } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { secureInputProps } from "@/components/SecurityProvider";
import { Cpu, Lock, User, ArrowRight, Loader2, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Modern Shadcn Registration Card Block.
 * Includes multi-tier password verification and secure token initialization.
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

    if (!username.trim() || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters in length.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser(username.trim(), password);
      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try a different username.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-md mx-auto py-12 sm:py-16 px-4">
      <Card className="p-6 sm:p-8 border-border bg-card/95 shadow-lg space-y-6">
        {/* Brand & Heading */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary mb-1">
            <Cpu className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Architect Account</h1>
          <p className="text-xs text-muted-foreground">
            Get instant access to 5-module system architecture blueprints.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-destructive/15 border border-destructive/30 text-destructive-foreground p-3 rounded-lg flex items-start space-x-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-foreground leading-relaxed">{error}</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. alex_architect"
                required
                {...secureInputProps}
                className="w-full pl-9 pr-3 py-2 rounded-md bg-secondary/40 border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                {...secureInputProps}
                className="w-full pl-9 pr-3 py-2 rounded-md bg-secondary/40 border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                {...secureInputProps}
                className="w-full pl-9 pr-3 py-2 rounded-md bg-secondary/40 border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-xs font-semibold py-2.5 gap-2"
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
          </Button>
        </form>

        {/* Bottom Switcher */}
        <div className="space-y-3 pt-2 text-center">
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:underline font-semibold">
              Sign in
            </Link>
          </p>

          <div className="pt-3 border-t border-border flex items-center justify-center space-x-1.5 text-[11px] font-mono text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>5 Free Generations Included Monthly</span>
          </div>
        </div>
      </Card>
    </main>
  );
}
