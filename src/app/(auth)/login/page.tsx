"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl");

  // Prevent unsafe external redirects
  const getRedirectUrl = () => {
    if (
      callbackUrl &&
      callbackUrl.startsWith("/") &&
      !callbackUrl.startsWith("//")
    ) {
      return callbackUrl;
    }

    return "/";
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.add({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        type: "info",
      });
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.add({
          title: "Login Failed",
          description:
            error.message || "Invalid email or password. Please try again.",
          type: "error",
        });
        return;
      }

      console.log("Login user:", data);

      toast.add({
        title: "Login successful!",
        description: "Welcome back to StudioSpace.",
        type: "success",
      });

      router.replace(getRedirectUrl());
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);

      toast.add({
        title: "Authentication Error",
        description: "Something went wrong. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: getRedirectUrl(),
      });

      toast.add({
        title: "Redirecting...",
        description: "Signing in securely with your Google account.",
        type: "info",
      });
    } catch (err) {
      console.error("Google login error:", err);
      setLoading(false);

      toast.add({
        title: "Google Login Failed",
        description: "Could not connect to Google. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/50 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome Back
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Log in to your StudioSpace account
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-xs font-medium uppercase text-slate-600 dark:text-slate-300"
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="harry@studiospace.com"
            required
            disabled={loading}
            autoComplete="email"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Password */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-medium uppercase text-slate-600 dark:text-slate-300"
            >
              Password
            </label>

            <Link
              href="#"
              className="text-xs font-medium text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-4 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={loading}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:text-white cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-indigo-600/30 dark:hover:bg-indigo-500 cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center py-2">
        <div className="grow border-t border-slate-200 dark:border-slate-800" />

        <span className="mx-4 shrink text-xs uppercase text-slate-500">
          Or continue with
        </span>

        <div className="grow border-t border-slate-200 dark:border-slate-800" />
      </div>

      {/* Google Login */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
      >
        <svg
          className="h-5 w-5 shrink-0"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.32 7.23 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.12 0 9.87 0 12s.43 3.88 1.19 5.42l4.09-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.68 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Register Link */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Register
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-white px-4 py-12 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Loading secure connection...
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}
