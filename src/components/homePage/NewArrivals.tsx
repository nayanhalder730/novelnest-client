
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Loader2,
} from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  createdAt: string;
  totalCopies?: number;
  availableCopies?: number;
}

interface BooksResponse {
  success: boolean;
  count: number;
  books: Book[];
  message?: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_SERVER_SITE_URL ||
  "http://localhost:8000";

const NewArrivals = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/books`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch books.");
        }

        const result: BooksResponse = await response.json();

        if (!result.success || !Array.isArray(result.books)) {
          throw new Error(
            result.message || "Invalid books response."
          );
        }

        setBooks(result.books.slice(0, 6));
      } catch (error) {
        console.error("New arrivals error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#087f75]">
              Discover Something New
            </p>

            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              New Arrivals
            </h2>

            <p className="mt-3 max-w-xl text-gray-600">
              Explore the latest books added to our library.
            </p>
          </div>

          <Link
            href="/all-books"
            className="inline-flex items-center gap-2 font-semibold text-[#087f75] transition hover:gap-3"
          >
            Explore All Books
            <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <Loader2 className="animate-spin text-[#087f75]" size={32} />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        ) : books.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
            <BookOpen
              size={40}
              className="mx-auto mb-3 text-gray-400"
            />
            <p className="font-medium text-gray-700">
              No books available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <article
                key={book._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link href={`/all-books/${book._id}`}>
                  <div className="relative h-64 bg-gray-100">
                    <Image
                      src={`${API_URL}/book-image/${book._id}`}
                      alt={book.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <span className="rounded-full bg-[#087f75]/10 px-3 py-1 text-xs font-semibold text-[#087f75]">
                      {book.category}
                    </span>

                    <h3 className="mt-4 line-clamp-1 text-xl font-bold text-gray-900">
                      {book.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      By {book.author}
                    </p>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                      {book.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-sm font-medium text-gray-500">
                        {typeof book.availableCopies === "number"
                          ? `${book.availableCopies} copies available`
                          : "View book details"}
                      </span>

                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#087f75]">
                        Details
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;
