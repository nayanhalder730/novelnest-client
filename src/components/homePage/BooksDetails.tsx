
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Library,
  UserRound,
} from "lucide-react";

import BorrowButton from "../books/BorrowButton";
import BookActions from "./BookAction";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface Book {
  _id: string;
  userId?: string;
  title: string;
  author: string;
  category: string;
  description: string;
  totalCopies?: number;
  availableCopies?: number;
  createdAt?: string;
}

interface BookResponse {
  success: boolean;
  book?: Book;
  message?: string;
}

const API_URL =
  process.env.BACKEND_URL || "http://localhost:8000";

export default async function BookDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!slug) {
    notFound();
  }

  let result: BookResponse;

  try {
    const res = await fetch(`${API_URL}/books/${slug}`, {
      method: "GET",
      cache: "no-store",
    });

    if (res.status === 404) {
      notFound();
    }

    if (!res.ok) {
      throw new Error(
        `Failed to fetch book details: ${res.status}`
      );
    }

    result = await res.json();
  } catch (error) {
    console.error("Book Details Fetch Error:", error);
    throw new Error("Unable to load book details.");
  }

  if (!result.success || !result.book?._id) {
    notFound();
  }

  const book = result.book;
  const isOwner =
    Boolean(book.userId) &&
    session?.user?.id === String(book.userId);

  const imageUrl = `${API_URL}/book-image/${book._id}`;

  const availableCopies = Math.max(
    0,
    book.availableCopies ?? 0
  );

  const totalCopies = Math.max(
    0,
    book.totalCopies ?? 0
  );

  const parsedDate = book.createdAt
    ? new Date(book.createdAt)
    : null;

  const formattedDate =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Not available";

  return (
    <main className="min-h-screen bg-[#F8F6EF] px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}
        <Link
          href="/all-books"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#173F35] transition hover:text-[#B18B43]"
        >
          <ArrowLeft size={18} />
          Back to All Books
        </Link>

        <div className="overflow-hidden rounded-3xl border border-[#173F35]/10 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Book Cover */}
            <div className="flex items-center justify-center bg-[#173F35] p-8 md:p-14">
              <div className="relative h-[380px] w-full max-w-[280px] overflow-hidden rounded-xl shadow-2xl md:h-[480px] md:max-w-[340px]">
                <Image
                  src={imageUrl}
                  alt={book.title}
                  fill
                  unoptimized
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 80vw, 340px"
                />
              </div>
            </div>

            {/* Book Information */}
            <div className="flex flex-col justify-center p-6 md:p-12 lg:p-14">
              {/* Category */}
              <div className="mb-5">
                <span className="inline-flex rounded-full bg-[#D8B76A]/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#92702F]">
                  {book.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold leading-tight text-[#173F35] md:text-5xl">
                {book.title}
              </h1>

              {/* Author */}
              <div className="mt-5 flex items-center gap-2 text-gray-600">
                <UserRound
                  size={19}
                  className="text-[#B18B43]"
                />

                <span className="text-base">
                  By{" "}
                  <strong className="text-[#173F35]">
                    {book.author}
                  </strong>
                </span>
              </div>

              <div className="my-8 h-px w-full bg-gray-200" />

              {/* Description */}
              <div>
                <h2 className="mb-3 text-xl font-bold text-[#173F35]">
                  About This Book
                </h2>

                <p className="text-sm leading-8 text-gray-600 md:text-base">
                  {book.description ||
                    "No description available for this book."}
                </p>
              </div>

              {/* Book Stats */}
              <div className="my-8 grid grid-cols-2 gap-4">
                {/* Total Copies */}
                <div className="rounded-2xl bg-[#F8F6EF] p-4">
                  <div className="mb-2 flex items-center gap-2 text-[#B18B43]">
                    <Library size={20} />

                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Total Copies
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-[#173F35]">
                    {totalCopies}
                  </p>
                </div>

                {/* Available Copies */}
                <div className="rounded-2xl bg-[#F8F6EF] p-4">
                  <div className="mb-2 flex items-center gap-2 text-[#B18B43]">
                    <CheckCircle2 size={20} />

                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Available
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-[#173F35]">
                    {availableCopies}
                  </p>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6 flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${
                    availableCopies > 0
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />

                <span
                  className={`text-sm font-semibold ${
                    availableCopies > 0
                      ? "text-green-700"
                      : "text-red-600"
                  }`}
                >
                  {availableCopies > 0
                    ? "Available for borrowing"
                    : "Currently unavailable"}
                </span>
              </div>

              {/* Borrow and Explore Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <BorrowButton
                  bookId={book._id}
                  availableCopies={availableCopies}
                />

                <Link
                  href="/all-books"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#173F35]/20 px-6 py-4 font-semibold text-[#173F35] transition hover:bg-[#F8F6EF]"
                >
                  <BookOpen size={19} />
                  Explore More
                </Link>
              </div>

              {/* Update and Delete Buttons */}
              {isOwner && <BookActions bookId={book._id} />}

              {/* Added Date */}
              <div className="mt-8 flex items-center gap-2 border-t border-gray-200 pt-5 text-sm text-gray-500">
                <CalendarDays
                  size={17}
                  className="text-[#B18B43]"
                />

                Added to library: {formattedDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
