"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  UserRound,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_SERVER_SITE_URL;

export default function BookCard({ book }: { book: Book }) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = `${API_URL}/book-image/${book._id}`;

  return (
    <div className="group overflow-hidden rounded-2xl border border-[#e8e5da] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Book Image */}
      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#eeeee5]">
        {!imageError && API_URL ? (
          <Image
            src={imageUrl}
            alt={book.title}
            fill
            unoptimized
            onError={() => setImageError(true)}
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#173f35]">
            <BookOpen size={48} />
            <span className="text-sm">Image unavailable</span>
          </div>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-[#173f35] px-4 py-1.5 text-xs font-semibold text-white">
          {book.category}
        </span>
      </div>

      {/* Book Information */}
      <div className="p-5">
        <h3 className="mb-3 line-clamp-2 text-xl font-bold text-[#173f35]">
          {book.title}
        </h3>

        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
          <UserRound size={16} />
          <span>{book.author}</span>
        </div>

        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {book.description}
        </p>

        <Link
          href={`/all-books/${book._id}`}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#173f35] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#245c4d]"
        >
          View Details
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </div>
  );
}