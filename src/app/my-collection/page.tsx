
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  BookOpen,
  Plus,
  Library,
  Layers,
  AlertCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import MyCollectionCard from "@/components/homePage/MyCollectionCard";

import type {
  CollectionBook,
  CollectionBooksResponse,
} from "../../types/books";

const API_URL = process.env.NEXT_PUBLIC_SERVER_SITE_URL;

export default function MyCollectionPage() {
  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState<CollectionBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userEmail = session?.user?.email?.toLowerCase();

  useEffect(() => {
    if (isPending) return;

    if (!userEmail) {
      setBooks([]);
      setLoading(false);
      return;
    }

    const fetchMyBooks = async () => {
      try {
        setLoading(true);
        setError("");

        if (!API_URL) {
          throw new Error(
            "Server API URL is missing. Check your .env.local file."
          );
        }

        const response = await fetch(`${API_URL}/books`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const result: CollectionBooksResponse =
          await response.json();

        const myBooks = (result.data ?? []).filter(
          (book) =>
            book &&
            book._id &&
            book.userEmail?.toLowerCase() === userEmail
        );

        setBooks(myBooks);

      } catch (err) {
        console.error("My Collection Error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your collection."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();

  }, [userEmail, isPending]);

  // Summary calculations
  const totalBooks = books.length;

  const totalCopies = books.reduce(
    (total, book) =>
      total + Number(book.totalCopies ?? 0),
    0
  );

  const availableCopies = books.reduce(
    (total, book) =>
      total + Number(book.availableCopies ?? 0),
    0
  );

  // Loading State
  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#173F35]/20 border-t-[#173F35]" />

          <p className="mt-4 font-medium text-[#173F35]">
            Loading your collection...
          </p>

        </div>
      </div>
    );
  }

  // Login Required
  if (!userEmail) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4">

        <div className="max-w-md rounded-2xl border border-[#173F35]/10 bg-white p-8 text-center shadow-sm">

          <BookOpen
            className="mx-auto mb-4 text-[#B18B43]"
            size={48}
          />

          <h2 className="text-2xl font-bold text-[#173F35]">
            Login Required
          </h2>

          <p className="mt-3 text-gray-500">
            Please login to view your personal book collection.
          </p>

          <Link
            href="/sign-in"
            className="mt-6 inline-flex rounded-xl bg-[#173F35] px-6 py-3 font-semibold text-white transition hover:bg-[#B18B43]"
          >
            Sign In
          </Link>

        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6EF] px-4 py-12 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#B18B43]">
              <Library size={18} />
              My Library
            </div>

            <h1 className="text-3xl font-extrabold text-[#173F35] sm:text-4xl">
              My Collection
            </h1>

            <p className="mt-3 text-gray-500">
              Manage and explore all the books you have added.
            </p>
          </div>

          <Link
            href="/add-book"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173F35] px-6 py-3 font-bold text-white shadow-sm transition hover:bg-[#B18B43] hover:text-[#173F35]"
          >
            <Plus size={20} />
            Add New Book
          </Link>

        </div>

        {/* Summary Cards */}
        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-3">

          {/* Total Books */}
          <div className="rounded-2xl border border-[#173F35]/10 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Total Books
            </p>

            <h3 className="mt-2 text-3xl font-extrabold text-[#173F35]">
              {totalBooks}
            </h3>

            <BookOpen
              className="mt-3 text-[#B18B43]"
              size={25}
            />

          </div>

          {/* Total Copies */}
          <div className="rounded-2xl border border-[#173F35]/10 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Total Copies
            </p>

            <h3 className="mt-2 text-3xl font-extrabold text-[#173F35]">
              {totalCopies}
            </h3>

            <Layers
              className="mt-3 text-[#B18B43]"
              size={25}
            />

          </div>

          {/* Available Copies */}
          <div className="rounded-2xl border border-[#173F35]/10 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Available Copies
            </p>

            <h3 className="mt-2 text-3xl font-extrabold text-[#173F35]">
              {availableCopies}
            </h3>

            <Library
              className="mt-3 text-[#B18B43]"
              size={25}
            />

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

            <AlertCircle size={20} />

            <p>{error}</p>

          </div>
        )}

        {/* Books Heading */}
        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-[#173F35]">
            Your Books
          </h2>

          <span className="rounded-full bg-[#173F35]/10 px-4 py-2 text-sm font-bold text-[#173F35]">
            {totalBooks} Books
          </span>

        </div>

        {/* Book Cards */}
        {books.length > 0 ? (

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {books.map((book) => (
              <MyCollectionCard
                key={book._id}
                book={book}
              />
            ))}

          </div>

        ) : (

          <div className="rounded-2xl border border-dashed border-[#173F35]/20 bg-white px-6 py-16 text-center">

            <BookOpen
              size={55}
              className="mx-auto mb-5 text-[#B18B43]"
            />

            <h3 className="text-2xl font-bold text-[#173F35]">
              Your Collection is Empty
            </h3>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              You haven't added any books yet. Start building your
              personal library by adding your first book.
            </p>

            <Link
              href="/add-book"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#173F35] px-6 py-3 font-bold text-white transition hover:bg-[#B18B43] hover:text-[#173F35]"
            >
              <Plus size={20} />
              Add Your First Book
            </Link>

          </div>

        )}

      </div>
    </main>
  );
}