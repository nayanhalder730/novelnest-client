
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  UserRound,
  Mail,
  ShieldCheck,
  BookOpen,
  LogOut,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Redirect logged-out users
  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/sign-in");
    }
  }, [isPending, user, router]);

  // Logout
  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      toast.success("Logged out successfully!");

      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Loading state
  if (isPending || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F6EF] dark:bg-[#101b1b]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#087f75]/20 border-t-[#087f75]" />

          <p className="mt-4 font-medium text-[#087f75]">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6EF] px-4 py-8 dark:bg-[#101b1b] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">

        {/* BACK TO HOME */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#087f75] transition hover:text-[#173F35] dark:hover:text-teal-300 sm:mb-8"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        {/* PROFILE CARD */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-[#172727] sm:rounded-3xl">

          {/* PROFILE HEADER */}
          <div className="relative overflow-hidden bg-[#173F35] px-5 py-10 text-center text-white sm:px-10 sm:py-14">

            {/* Decorative circles */}
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-[#D8B76A]/30" />

            <div className="absolute -bottom-28 -left-16 h-64 w-64 rounded-full border border-[#D8B76A]/30" />

            <div className="relative z-10">
              <Avatar className="mx-auto h-24 w-24 border-4 border-[#D8B76A] shadow-lg sm:h-28 sm:w-28">
                <AvatarImage
                  src={user.image || ""}
                  alt={user.name || "User"}
                />

                <AvatarFallback className="bg-[#D8B76A] text-3xl font-bold text-[#173F35]">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <h1 className="mt-5 break-words text-2xl font-extrabold sm:text-3xl">
                {user.name || "Reader"}
              </h1>

              <p className="mt-2 break-all text-sm text-white/70">
                {user.email}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-[#D8B76A]">
                <ShieldCheck size={16} />
                NovelNest Member
              </div>
            </div>
          </div>

          {/* PROFILE DETAILS */}
          <div className="p-5 sm:p-8 md:p-10">

            <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-extrabold text-[#173F35] dark:text-white sm:text-2xl">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Your account information
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-[#087f75]">
                <BookOpen size={18} />
                NovelNest
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* NAME */}
              <div className="rounded-2xl border border-gray-100 bg-[#F8F6EF] p-5 dark:border-slate-700 dark:bg-[#203333]">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#087f75]/10 text-[#087f75]">
                  <UserRound size={21} />
                </div>

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Full Name
                </p>

                <p className="mt-2 break-words text-base font-bold text-[#173F35] dark:text-white">
                  {user.name || "Not provided"}
                </p>
              </div>

              {/* EMAIL */}
              <div className="rounded-2xl border border-gray-100 bg-[#F8F6EF] p-5 dark:border-slate-700 dark:bg-[#203333]">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#087f75]/10 text-[#087f75]">
                  <Mail size={21} />
                </div>

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Email Address
                </p>

                <p className="mt-2 break-all text-base font-bold text-[#173F35] dark:text-white">
                  {user.email || "Not provided"}
                </p>
              </div>
            </div>

            {/* ACCOUNT STATUS */}
            <div className="mt-5 rounded-2xl border border-gray-100 bg-[#F8F6EF] p-5 dark:border-slate-700 dark:bg-[#203333]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Email Verification
                  </p>

                  <p className="mt-2 font-bold text-[#173F35] dark:text-white">
                    {user.emailVerified ? "Verified" : "Not verified"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    user.emailVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {user.emailVerified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>

            {/* LOGOUT */}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Link
                href="/"
                className="flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-[#173F35] transition hover:bg-gray-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>

              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-xl bg-red-600 px-6 py-3 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          Read. Discover. Imagine. — NovelNest
        </p>
      </div>
    </main>
  );
}
