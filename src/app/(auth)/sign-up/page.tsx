"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  UserRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function SignUpPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        setError(error.message || "Unable to create account.");
        toast.error(error.message || "Unable to create account.");
        return;
      }

      toast.success("Account created successfully! Welcome to NovelNest.");

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setError("");
    setLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        setError(error.message || `${provider} signup failed.`);
        setLoading(false);
      }
    } catch {
      setError("Unable to connect. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F6EF] p-4 sm:p-6">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl lg:grid-cols-2">
        {/* LEFT BRANDING SECTION */}
        <section className="relative hidden min-h-[740px] flex-col justify-between overflow-hidden bg-[#173F35] p-12 text-white lg:flex">
          <div className="absolute -bottom-24 -right-20 h-96 w-96 rounded-full border border-[#D8B76A]/30" />

          <div className="absolute -bottom-12 -right-8 h-64 w-64 rounded-full border border-[#D8B76A]/30" />

          <Link href="/" className="relative z-10 flex items-center gap-3">
            <div className="rounded-xl bg-[#D8B76A] p-3 text-[#173F35]">
              <BookOpen size={28} />
            </div>

            <span className="text-2xl font-bold tracking-tight">NovelNest</span>
          </Link>

          <div className="relative z-10 max-w-md">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[4px] text-[#D8B76A]">
              Join Our Community
            </p>

            <h1 className="text-5xl font-bold leading-tight">
              A world of books. A lifetime of stories.
            </h1>

            <p className="mt-6 text-lg leading-8 text-white/65">
              Create your account and explore a growing collection of books,
              ideas, and inspiration.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <BookOpen className="mb-3 text-[#D8B76A]" size={25} />
                <h3 className="font-semibold">Explore Books</h3>
                <p className="mt-1 text-xs text-white/50">
                  Discover new stories
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <UserRound className="mb-3 text-[#D8B76A]" size={25} />
                <h3 className="font-semibold">Your Library</h3>
                <p className="mt-1 text-xs text-white/50">
                  Build your collection
                </p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-sm text-white/45">
            © NovelNest. All rights reserved.
          </p>
        </section>

        {/* RIGHT SIGN UP FORM */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-14 lg:py-12">
          <div className="w-full max-w-md">
            {/* MOBILE LOGO */}
            <Link href="/" className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="rounded-xl bg-[#173F35] p-3 text-[#D8B76A]">
                <BookOpen size={25} />
              </div>

              <span className="text-2xl font-bold text-[#173F35]">
                NovelNest
              </span>
            </Link>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[3px] text-[#B18B43]">
                Start your journey
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#173F35]">
                Create account
              </h2>

              <p className="mt-3 leading-6 text-gray-500">
                Join NovelNest and make room for more stories.
              </p>
            </div>

            {/* SOCIAL SIGN UP */}
            <div className="mt-7 grid grid-cols-2 gap-4">
              {/* GOOGLE */}
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
                className="flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-[#173F35] transition hover:border-[#B18B43] hover:bg-[#F8F6EF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.8 6.1C12.3 13.8 17.6 9.5 24 9.5Z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.1 24.5c0-1.6-.2-3.1-.5-4.5H24v9h12.4c-.6 2.9-2.3 5.4-4.8 7.1l7.5 5.8c4.4-4.1 7-10.1 7-17.4Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.4 28.6a14.4 14.4 0 0 1 0-9.2l-7.8-6.1a24 24 0 0 0 0 21.4l7.8-6.1Z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.5 0 12-2.1 16-5.9l-7.5-5.8c-2.1 1.4-4.8 2.2-8.5 2.2-6.4 0-11.7-4.3-13.6-10.1l-7.8 6.1C6.5 42.6 14.6 48 24 48Z"
                  />
                </svg>
                Google
              </button>

              {/* GITHUB */}
              <button
                type="button"
                onClick={() => handleSocialLogin("github")}
                disabled={loading}
                className="flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-[#173F35] transition hover:border-[#B18B43] hover:bg-[#F8F6EF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.3-2.61 5.25-5.1 5.52.4.35.75 1.03.75 2.08v3.09c0 .3.2.65.76.54A11.1 11.1 0 0 0 12 .9Z" />
                </svg>
                GitHub
              </button>
            </div>

            {/* DIVIDER */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs font-medium uppercase tracking-wider text-gray-400">
                  Or register with email
                </span>
              </div>
            </div>

            {/* SIGN UP FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#173F35]"
                >
                  Full name
                </label>

                <div className="flex items-center rounded-xl border border-gray-200 px-4 transition focus-within:border-[#173F35] focus-within:ring-2 focus-within:ring-[#173F35]/10">
                  <UserRound size={19} className="text-gray-400" />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    required
                    autoComplete="name"
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-gray-800 outline-none"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#173F35]"
                >
                  Email address
                </label>

                <div className="flex items-center rounded-xl border border-gray-200 px-4 transition focus-within:border-[#173F35] focus-within:ring-2 focus-within:ring-[#173F35]/10">
                  <Mail size={19} className="text-gray-400" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-gray-800 outline-none"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#173F35]"
                >
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-gray-200 px-4 transition focus-within:border-[#173F35] focus-within:ring-2 focus-within:ring-[#173F35]/10">
                  <Lock size={19} className="text-gray-400" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-gray-800 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="text-gray-400 hover:text-[#173F35]"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#173F35] py-4 font-semibold text-white shadow-lg shadow-[#173F35]/15 transition hover:bg-[#245747] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}

                {!loading && (
                  <ArrowRight
                    size={19}
                    className="transition group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* SIGN IN LINK */}
            <p className="mt-7 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-bold text-[#B18B43] hover:text-[#173F35]"
              >
                Sign In
              </Link>
            </p>

            {/* BACK TO HOME */}
            <Link
              href="/"
              className="mt-6 block text-center text-sm text-gray-400 transition hover:text-[#173F35]"
            >
              ← Back to home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
