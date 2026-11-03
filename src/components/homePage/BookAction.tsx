
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface BookActionsProps {
  bookId: string;
  ownerId?: string;
}

export default function BookActions({
  bookId,
  ownerId,
}: BookActionsProps) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const isOwner =
    !isPending &&
    Boolean(ownerId && session?.user?.id) &&
    String(ownerId).trim() === String(session?.user?.id).trim();

  if (isPending || !isOwner) {
    return null;
  }

  const handleDelete = async () => {
    if (deleting) return;

    // Delete confirmation
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setMessage("");
      setIsError(false);

      const response = await fetch(
        `/api/backend/books/${encodeURIComponent(bookId)}`,
        {
          method: "DELETE",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      // Handle API errors without throwing
      if (!response.ok || !result.success) {
        setMessage(
          result.message || "Failed to delete book."
        );
        setIsError(true);
        return;
      }

      // Successful deletion
      setMessage("Book deleted successfully!");
      setIsError(false);

      router.replace("/all-books");
      router.refresh();

    } catch (error) {
      console.error("Delete request failed:", error);

      setMessage(
        "Something went wrong. Please try again."
      );
      setIsError(true);

    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Update Button */}
        <Link
          href={`/all-books/${bookId}/edit`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#173F35] px-6 py-4 font-semibold text-white transition hover:bg-[#245747]"
        >
          <Pencil size={19} />
          Update Book
        </Link>

        {/* Delete Button */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-4 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? (
            <>
              <Loader2
                size={19}
                className="animate-spin"
              />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 size={19} />
              Delete Book
            </>
          )}
        </button>
      </div>

      {/* Success / Error Message */}
      {message && (
        <p
          role="alert"
          aria-live="polite"
          className={`mt-3 text-sm font-medium ${
            isError
              ? "text-red-600"
              : "text-green-700"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
