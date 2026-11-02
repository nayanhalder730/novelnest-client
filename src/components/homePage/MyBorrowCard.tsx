
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  BookOpen,
  RotateCcw,
  Loader2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_SERVER_SITE_URL;

export interface Borrow {
  _id: string;
  bookId: string;
  userEmail: string;
  borrowDate: string;
  returnDate?: string | null;
  returnedAt: string | null;
  status: "borrowed" | "returned";
  book: {
    _id: string;
    title: string;
    author: string;
    category: string;
    description: string;
    totalCopies: number;
    availableCopies: number;
    createdAt: string;
  };
}

interface MyBorrowCardProps {
  borrow: Borrow;
  onReturned: (borrowId: string) => void;
}

export default function MyBorrowCard({
  borrow,
  onReturned,
}: MyBorrowCardProps) {
  const [returning, setReturning] = useState(false);

  const book = borrow.book;

  // Return Book
  const handleReturn = async () => {
    if (returning) return;

    if (borrow.status === "returned") {
      toast.error("This book has already been returned.");
      return;
    }

    if (!API_URL) {
      toast.error("Server URL is missing.");
      return;
    }

    try {
      setReturning(true);

      const response = await fetch(
        `${API_URL}/borrows/${borrow._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to return book."
        );
      }

      toast.success(`"${book.title}" returned successfully!`);

      // Notify parent to remove the card
      onReturned(borrow._id);
    } catch (err) {
      console.error("Return Book Error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setReturning(false);
    }
  };

  // Format Date
  const formatDate = (date?: string | Date | null) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-[#173F35]/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* Book Image */}
      <div className="relative h-64 overflow-hidden bg-[#173F35]">
        {book?._id && API_URL ? (
          <Image
            src={`${API_URL}/book-image/${book._id}`}
            alt={book.title || "Book cover"}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white">
            <BookOpen size={55} />
          </div>
        )}

        {/* Status */}
        <div className="absolute right-4 top-4">
          <span className="rounded-full bg-yellow-100 px-4 py-2 text-xs font-bold capitalize text-yellow-800 shadow">
            {borrow.status}
          </span>
        </div>

        {/* Category */}
        <div className="absolute bottom-4 left-4">
          <span className="rounded-full bg-[#D8B76A] px-4 py-2 text-xs font-bold text-[#173F35]">
            {book?.category || "Others"}
          </span>
        </div>
      </div>

      {/* Book Information */}
      <div className="p-5">
        <Link href={`/all-books/${book?._id}`}>
          <h2 className="line-clamp-1 text-xl font-bold text-[#173F35] transition hover:text-[#B18B43]">
            {book?.title || "Book unavailable"}
          </h2>
        </Link>

        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <UserRound size={16} className="text-[#B18B43]" />
          <span>{book?.author || "Unknown Author"}</span>
        </div>

        {/* Dates */}
        <div className="my-5 space-y-3 rounded-xl bg-[#F8F6EF] p-4">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2 text-gray-500">
              <CalendarDays size={16} className="text-[#B18B43]" />
              Borrow Date
            </span>

            <span className="font-semibold text-[#173F35]">
              {formatDate(borrow.borrowDate)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2 text-gray-500">
              <CalendarDays size={16} className="text-[#B18B43]" />
              Return Date
            </span>

            <span className="font-semibold text-[#173F35]">
              {borrow.returnDate
                ? formatDate(borrow.returnDate)
                : formatDate(
                    new Date(
                      new Date(borrow.borrowDate).getTime() +
                        7 * 24 * 60 * 60 * 1000
                    )
                  )}
            </span>
          </div>
        </div>

        {/* Return Button */}
        <button
          type="button"
          onClick={handleReturn}
          disabled={
            returning ||
            !book?._id ||
            borrow.status === "returned"
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173F35] px-5 py-3 font-semibold text-white transition hover:bg-[#245B4C] disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {returning ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Returning...
            </>
          ) : (
            <>
              <RotateCcw size={18} />
              {borrow.status === "returned"
                ? "Already Returned"
                : "Return Book"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
