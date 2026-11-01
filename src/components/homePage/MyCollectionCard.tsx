
import Image from "next/image";
import Link from "next/link";

import {
  CalendarDays,
  Copy,
  Eye,
  Layers,
  BookOpen,
} from "lucide-react";

import type { CollectionBook } from "../../types/books";

const API_URL = process.env.NEXT_PUBLIC_SERVER_SITE_URL;

interface MyCollectionCardProps {
  book: CollectionBook;
}

export default function MyCollectionCard({
  book,
}: MyCollectionCardProps) {
  const imageUrl = API_URL
    ? `${API_URL}/book-image/${book._id}`
    : "";

  const createdDate = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date unavailable";

  const totalCopies = Number(book.totalCopies ?? 0);
  const availableCopies = Number(book.availableCopies ?? 0);

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#173F35]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#D8B76A] hover:shadow-xl">

      {/* Book Image */}
      <div className="relative h-64 overflow-hidden bg-[#EAE8DD]">

        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={book.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen size={55} className="text-[#B18B43]" />
          </div>
        )}

        {/* Category */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full border border-white/40 bg-[#173F35]/90 px-4 py-1.5 text-xs font-bold tracking-wide text-[#F8F6EF] shadow-sm backdrop-blur">
            {book.category}
          </span>
        </div>

        {/* Availability */}
        <div className="absolute bottom-4 right-4">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold shadow-md ${
              availableCopies > 0
                ? "bg-[#E5F3E9] text-[#21633B]"
                : "bg-red-100 text-red-700"
            }`}
          >
            {availableCopies > 0
              ? "Available"
              : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">

        {/* Title and Author */}
        <div className="mb-5 min-h-[76px]">
          <h3 className="line-clamp-2 text-xl font-bold leading-snug text-[#173F35] transition-colors group-hover:text-[#B18B43]">
            {book.title}
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            By{" "}
            <span className="font-semibold text-gray-700">
              {book.author}
            </span>
          </p>
        </div>

        {/* Copies Information */}
        <div className="grid grid-cols-2 gap-3">

          <div className="rounded-xl bg-[#F8F6EF] p-3">
            <div className="mb-2 flex items-center gap-2 text-[#B18B43]">
              <Layers size={16} />

              <span className="text-xs font-semibold text-gray-500">
                Total Copies
              </span>
            </div>

            <p className="text-2xl font-bold text-[#173F35]">
              {totalCopies}
            </p>
          </div>

          <div className="rounded-xl bg-[#F8F6EF] p-3">
            <div className="mb-2 flex items-center gap-2 text-[#B18B43]">
              <Copy size={16} />

              <span className="text-xs font-semibold text-gray-500">
                Available
              </span>
            </div>

            <p className="text-2xl font-bold text-[#173F35]">
              {availableCopies}
            </p>
          </div>
        </div>

        {/* Added Date */}
        <div className="my-5 flex items-center gap-2 border-t border-[#173F35]/10 pt-4 text-sm text-gray-500">
          <CalendarDays size={16} className="text-[#B18B43]" />

          <span>Added on {createdDate}</span>
        </div>

        {/* Details Button */}
        <Link
          href={`/all-books/${book._id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173F35] px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-[#B18B43] hover:text-[#173F35]"
        >
          <Eye size={18} />
          View Book Details
        </Link>
      </div>

      {/* Bottom Accent */}
      <div className="h-1 w-0 bg-[#D8B76A] transition-all duration-500 group-hover:w-full" />
    </article>
  );
}