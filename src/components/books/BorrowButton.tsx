
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface BorrowButtonProps {
  bookId: string;
  availableCopies: number;
}

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

    try {
      setBorrowing(true);
      setMessage("");
      setIsError(false);

      const response = await fetch("/api/backend/borrows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ bookId }),
      });

      const result = await response.json();

      // Handle existing active borrow
      if (response.status === 409) {
        setMessage(
          result.message || "You have already borrowed this book. Please return it first."
        );
        setIsError(true);
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || `Borrow failed: ${response.status}`
        );
      }

      setMessage("Book borrowed successfully!");
      setIsError(false);

      router.refresh();
    } catch (error) {
      console.error("Borrow book error:", error);

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
        type="button"
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
        ) : isPending ? (
          <>
            <Loader2 size={19} className="animate-spin" />
            Checking Login...
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
