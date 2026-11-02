
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  BookOpen,
  Library,
  AlertCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import MyBorrowCard, {
  type Borrow,
} from "@/components/homePage/MyBorrowCard";

const API_URL = process.env.NEXT_PUBLIC_SERVER_SITE_URL;

interface BorrowsResponse {
  success: boolean;
  count: number;
  borrows: Borrow[];
  message?: string;
}

export default function MyBorrowsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userEmail = session?.user?.email?.toLowerCase() ?? "";

  // Fetch current logged-in user's borrow records
  const fetchBorrows = useCallback(async () => {
    if (!userEmail) {
      setBorrows([]);
      setLoading(false);
      return;
    }

    if (!API_URL) {
      setError(
        "Server URL is missing. Please check your environment variables."
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/borrows`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result: BorrowsResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            `Failed to fetch borrows. Status: ${response.status}`
        );
      }

      // Backend should return only the authenticated user's records.
      setBorrows(result.borrows ?? []);
    } catch (err) {
      console.error("My Borrows Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load borrowed books."
      );
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  // Fetch data after session loading
  useEffect(() => {
    if (isPending) return;

    if (!userEmail) {
      return;
    }

    const timeoutId = window.setTimeout(fetchBorrows, 0);
    return () => window.clearTimeout(timeoutId);
  }, [isPending, userEmail, fetchBorrows]);

  // Update UI after successfully returning a book
  const handleReturned = (borrowId: string) => {
    setBorrows((previousBorrows) =>
      previousBorrows.map((borrow) =>
        borrow._id === borrowId
          ? {
              ...borrow,
              status: "returned",
              returnedAt: new Date().toISOString(),
            }
          : borrow
      )
    );
  };

  // Summary counts
  const borrowedCount = borrows.filter(
    (borrow) => borrow.status === "borrowed"
  ).length;

  const returnedCount = borrows.filter(
    (borrow) => borrow.status === "returned"
  ).length;

  // Loading state
  if (isPending || (userEmail && loading)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#173F35]/20 border-t-[#173F35]" />

          <p className="mt-4 font-medium text-[#173F35]">
            Loading your borrowed books...
          </p>
        </div>
      </div>
    );
  }

  // Login required
  if (!userEmail) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <BookOpen
            size={48}
            className="mx-auto mb-4 text-[#B18B43]"
          />

          <h2 className="text-2xl font-bold text-[#173F35]">
            Login Required
          </h2>

          <p className="mt-3 text-gray-500">
            Please login to see your borrowed books.
          </p>

          <Link
            href="/sign-in"
            className="mt-6 inline-block rounded-xl bg-[#173F35] px-6 py-3 font-semibold text-white transition hover:bg-[#B18B43] hover:text-[#173F35]"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6EF] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#B18B43]">
            <Library size={18} />
            My Library
          </div>

          <h1 className="text-3xl font-extrabold text-[#173F35] sm:text-4xl">
            My Borrows
          </h1>

          <p className="mt-3 text-gray-500">
            Manage your borrowed books and return them easily.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-10 grid gap-5 sm:grid-cols-3">

          <div className="rounded-2xl border border-[#173F35]/10 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Borrow Records
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-[#173F35]">
              {borrows.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#173F35]/10 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Currently Borrowed
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-[#B18B43]">
              {borrowedCount}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#173F35]/10 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Returned Books
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-green-700">
              {returnedCount}
            </h2>
          </div>

        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} />

            <p className="flex-1">{error}</p>

            <button
              onClick={fetchBorrows}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Borrow History Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[#173F35]">
              Borrow History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              All your borrowed and returned books.
            </p>
          </div>

          <span className="rounded-full bg-[#173F35]/10 px-4 py-2 text-sm font-bold text-[#173F35]">
            {borrows.length} Records
          </span>
        </div>

        {/* Borrow Cards */}
        {borrows.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {borrows.map((borrow) => (
              <MyBorrowCard
                key={borrow._id}
                borrow={borrow}
                onReturned={handleReturned}
              />
            ))}
          </div>
        ) : (
          !error && (
            <div className="rounded-2xl border border-dashed border-[#173F35]/20 bg-white px-6 py-16 text-center">
              <BookOpen
                size={55}
                className="mx-auto mb-5 text-[#B18B43]"
              />

              <h3 className="text-2xl font-bold text-[#173F35]">
                No Borrowed Books
              </h3>

              <p className="mx-auto mt-3 max-w-md text-gray-500">
                You haven&apos;t borrowed any books yet. Explore our
                library and find your next favorite book.
              </p>

              <Link
                href="/all-books"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#173F35] px-6 py-3 font-bold text-white transition hover:bg-[#B18B43] hover:text-[#173F35]"
              >
                <BookOpen size={18} />
                Explore Books
              </Link>
            </div>
          )
        )}

      </div>
    </main>
  );
}
