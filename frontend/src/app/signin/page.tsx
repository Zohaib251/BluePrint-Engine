"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signinUser } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { secureInputProps } from "@/components/SecurityProvider";
import { Cpu, Lock, User, ArrowRight, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Modern Shadcn Authentication Card Block.
 * Includes icon-accented inputs, anti-inspect protection, and cryptographic token verification.
 */
export default function SignInPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Please fill in both username and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signinUser(username.trim(), password);
      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify your details.");
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome to Blueprint Studio</h1>
          <p className="text-xs text-muted-foreground">
            Sign in to access your saved architecture blueprints and quotas.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-destructive/15 border border-destructive/30 text-destructive-foreground p-3 rounded-lg flex items-start space-x-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-foreground leading-relaxed">{error}</p>
          </div>
        )}

        {/* Auth Form */}
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
                placeholder="Enter account password"
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
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Studio</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Bottom Switcher & Security Guarantee */}
        <div className="space-y-3 pt-2 text-center">
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-semibold">
              Create one now
            </Link>
          </p>

          <div className="pt-3 border-t border-border flex items-center justify-center space-x-1.5 text-[11px] font-mono text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Encrypted with OAuth2 JWT &amp; Bcrypt</span>
          </div>
        </div>
      </Card>
    </main>
  );
}
