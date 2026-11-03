
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
  updatedAt?: string;
  imageUrl?: string;
  imageName?: string;
  imageMimeType?: string;
}

interface BookResponse {
  success: boolean;
  book?: Book;
  message?: string;
}

const API_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_SERVER_SITE_URL ||
  "http://localhost:8000";

const AUTH_URL = (
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");

export default async function BookDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  let result: BookResponse | null = null;
  let responseStatus = 0;
  let responseError = "";

  try {
    const requestHeaders = await headers();
    const cookie = requestHeaders.get("cookie") || "";

    // Get JWT from Better Auth
    if (!cookie) {
      throw new Error("Please login to view book details.");
    }

    const tokenResponse = await fetch(
      `${AUTH_URL}/api/auth/token`,
      {
        method: "GET",
        headers: {
          cookie,
        },
        cache: "no-store",
      }
    );

    if (!tokenResponse.ok) {
      throw new Error(
        "Unable to generate JWT. Please login again."
      );
    }

    const tokenData: { token?: string } =
      await tokenResponse.json();

    if (!tokenData.token) {
      throw new Error("Authentication token not found.");
    }

    // Fetch book details using JWT
    const res = await fetch(`${API_URL}/books/${slug}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${tokenData.token}`,
        Accept: "application/json",
      },
    });

    responseStatus = res.status;

    if (!res.ok) {
      responseError = await res.text();

      console.error("BOOK API ERROR:", {
        status: res.status,
        slug,
        response: responseError,
      });
    } else {
      result = await res.json();
    }
  } catch (error) {
    console.error("Book Details Fetch Error:", error);

    throw new Error(
      error instanceof Error
        ? error.message
        : "Unable to connect to the backend server."
    );
  }

  if (responseStatus === 404) {
    notFound();
  }

  if (responseStatus !== 200 || !result) {
    throw new Error(
      `Unable to load book details. Status: ${responseStatus}. ${responseError}`
    );
  }

  if (!result.success || !result.book?._id) {
    notFound();
  }

  const book = result.book;

  // Stable image cache version
  const imageVersion =
    book.updatedAt || book.createdAt || book._id;

  // Backend redirects new ImgBB images and serves legacy images
  const imageUrl =
    `${API_URL}/book-image/${book._id}?v=${encodeURIComponent(imageVersion)}`;

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

        <div className="overflow-hidden rounded-2xl border border-[#173F35]/10 bg-white shadow-sm md:rounded-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.15fr)]">

            {/* Book Cover */}
            <div className="flex items-center justify-center bg-[#173F35] p-5 sm:p-8 md:p-10">
              <div className="relative aspect-[3/4] w-full max-w-[min(82vw,22rem)] overflow-hidden rounded-xl shadow-2xl">
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
            <div className="flex min-w-0 flex-col justify-center p-5 sm:p-8 md:p-10 lg:p-12">

              {/* Category */}
              <div className="mb-5">
                <span className="inline-flex rounded-full bg-[#D8B76A]/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#92702F]">
                  {book.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="break-words text-[clamp(1.875rem,4vw,3rem)] font-bold leading-tight text-[#173F35]">
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
              <BookActions
                bookId={book._id}
                ownerId={book.userId}
              />

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
