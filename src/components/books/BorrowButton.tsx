
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

interface BorrowButtonProps {
  bookId: string;
  availableCopies: number;
}

const API_URL = process.env.NEXT_PUBLIC_SERVER_SITE_URL;

export default function BorrowButton({
  bookId,
  availableCopies,
}: BorrowButtonProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [borrowing, setBorrowing] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleBorrow = async () => {
    if (isPending || borrowing) return;

    if (!session?.user) {
      router.push("/sign-in");
      return;
    }

    if (availableCopies <= 0) {
      setMessage("This book is currently unavailable.");
      setIsError(true);
      return;
    }

    if (!API_URL) {
      setMessage("Server URL is not configured.");
      setIsError(true);
      return;
    }

    try {
      setBorrowing(true);
      setMessage("");
      setIsError(false);

      const response = await fetch(`${API_URL}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          bookId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || `Borrow failed: ${response.status}`
        );
      }

      setMessage("Book borrowed successfully!");
      setIsError(false);

      // Refresh book details and available copies
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      setIsError(true);
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <div className="flex-1">
      <button
        onClick={handleBorrow}
        disabled={
          borrowing ||
          availableCopies <= 0 ||
          isPending
        }
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173F35] px-6 py-4 font-semibold text-white transition hover:bg-[#245B4C] disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {borrowing ? (
          <>
            <Loader2 size={19} className="animate-spin" />
            Borrowing...
          </>
        ) : (
          <>
            Borrow This Book
            <ArrowUpRight size={19} />
          </>
        )}
      </button>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`mt-3 text-sm font-medium ${
            isError ? "text-red-600" : "text-green-700"
          }`}
        >
          {message}
        </p>
      )}

      {!session?.user && !isPending && (
        <Link
          href="/sign-in"
          className="mt-2 block text-center text-xs text-gray-500 underline"
        >
          Login required to borrow
        </Link>
      )}
    </div>
  );
}
