
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_SERVER_SITE_URL;

interface BookActionsProps {
  bookId: string;
}

export default function BookActions({ bookId }: BookActionsProps) {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    if (deleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    if (!API_URL) {
      setMessage("Server URL is not configured.");
      return;
    }

    try {
      setDeleting(true);
      setMessage("");

      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete book."
        );
      }

      router.push("/all-books");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/all-books/${bookId}/edit`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#173F35] px-6 py-4 font-semibold text-white transition hover:bg-[#245747]"
        >
          <Pencil size={19} />
          Update Book
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-4 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 size={19} />
          {deleting ? "Deleting..." : "Delete Book"}
        </button>
      </div>

      {message && (
        <p
          role="alert"
          className="mt-3 text-sm font-medium text-red-600"
        >
          {message}
        </p>
      )}
    </div>
  );
}
