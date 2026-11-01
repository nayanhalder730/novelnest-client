
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  BookOpen,
  CalendarDays,
  Library,
  AlertCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_SERVER_SITE_URL;

interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCategory: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
  status: "borrowed" | "returned";
}

interface BorrowsResponse {
  success: boolean;
  data: Borrow[];
  message?: string;
}

export default function MyBorrowsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userEmail = session?.user?.email?.toLowerCase();

  useEffect(() => {
    if (isPending) return;

    if (!userEmail) {
      setBorrows([]);
      setLoading(false);
      return;
    }

    const fetchBorrows = async () => {
      try {
        setLoading(true);
        setError("");

        if (!API_URL) {
          throw new Error("Server URL is missing.");
        }

        const response = await fetch(`${API_URL}/borrows`, {
          method: "GET",
          headers: {
            "x-user-email": session?.user?.email ?? "",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const result: BorrowsResponse = await response.json();

        const myBorrows = (result.data ?? []).filter(
          (borrow) =>
            borrow.userEmail?.toLowerCase() === userEmail
        );

        setBorrows(myBorrows);
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
    };

    fetchBorrows();
  }, [userEmail, isPending, session?.user?.email]);

  const borrowedCount = borrows.filter(
    (borrow) => borrow.status === "borrowed"
  ).length;

  const returnedCount = borrows.filter(
    (borrow) => borrow.status === "returned"
  ).length;

  if (isPending || loading) {
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
            className="mt-6 inline-block rounded-xl bg-[#173F35] px-6 py-3 font-semibold text-white"
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
            Keep track of the books you have borrowed.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-10 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#173F35]/10 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Borrowed
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

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Borrow History */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#173F35]">
            Borrow History
          </h2>

          <span className="rounded-full bg-[#173F35]/10 px-4 py-2 text-sm font-bold text-[#173F35]">
            {borrows.length} Books
          </span>
        </div>

        {borrows.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-[#173F35]/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead className="bg-[#173F35] text-white">
                  <tr>
                    <th className="px-6 py-4">Book</th>
                    <th className="px-6 py-4">Borrow Date</th>
                    <th className="px-6 py-4">Return Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {borrows.map((borrow) => (
                    <tr
                      key={borrow._id}
                      className="transition hover:bg-[#F8F6EF]"
                    >
                      <td className="px-6 py-5">
                        <p className="font-bold text-[#173F35]">
                          {borrow.bookTitle}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {borrow.bookAuthor}
                        </p>

                        <span className="mt-2 inline-block rounded-full bg-[#F8F6EF] px-3 py-1 text-xs text-[#B18B43]">
                          {borrow.bookCategory}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={16} />
                          {borrow.borrowDate
                            ? new Date(borrow.borrowDate).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {borrow.returnDate
                          ? new Date(borrow.returnDate).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                            borrow.status === "returned"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {borrow.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#173F35]/20 bg-white px-6 py-16 text-center">
            <BookOpen
              size={55}
              className="mx-auto mb-5 text-[#B18B43]"
            />

            <h3 className="text-2xl font-bold text-[#173F35]">
              No Borrowed Books
            </h3>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              You haven't borrowed any books yet. Explore our
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
        )}
      </div>
    </main>
  );
}
