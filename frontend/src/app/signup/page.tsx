"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupUser, signinUser } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { secureInputProps } from "@/components/SecurityProvider";

/**
 * Sign Up Page Component with client-side form validation.
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

    // Client-side validation rules
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Sign up user
      await signupUser(username.trim(), password);
      // 2. Automatically sign in
      await signinUser(username.trim(), password);
      // 3. Refresh user state and redirect to dashboard
      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-gray-100">Create Account</h1>
          <p className="text-xs text-gray-400">
            Sign up for Blueprint Engine to generate system architecture PRDs.
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
              placeholder="At least 6 characters"
              required
              {...secureInputProps}
              className="w-full px-3.5 py-2 rounded-lg bg-gray-950 border border-gray-800 text-gray-100 text-sm focus:outline-none focus:border-gray-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
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
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link href="/signin" className="text-gray-200 underline font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
