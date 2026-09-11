"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signinUser } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { secureInputProps } from "@/components/SecurityProvider";

/**
 * Sign In Page Component with client-side form validation.
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
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-gray-100">Welcome Back</h1>
          <p className="text-xs text-gray-400">
            Sign in to access your Blueprint Engine account.
          </p>
        </div>

        {error && (
          <div className="bg-gray-950 border border-gray-800 text-gray-200 text-xs p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. alex_architect"
              required
              {...secureInputProps}
              className="w-full px-3.5 py-2 rounded-lg bg-gray-950 border border-gray-800 text-gray-100 text-sm focus:outline-none focus:border-gray-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              {...secureInputProps}
              className="w-full px-3.5 py-2 rounded-lg bg-gray-950 border border-gray-800 text-gray-100 text-sm focus:outline-none focus:border-gray-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-lg bg-gray-100 text-gray-950 font-semibold text-sm hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-gray-200 underline font-medium">
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
