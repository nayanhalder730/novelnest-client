
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  BookOpen,
  ImagePlus,
  Loader2,
  Save,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_SERVER_SITE_URL;

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
}

interface BookResponse {
  success: boolean;
  book: Book;
  message?: string;
}

interface EditPageProps {
  params: Promise<{ slug: string }>;
}

export default function EditPage({ params }: EditPageProps) {
  const router = useRouter();

  const [bookId, setBookId] = useState("");
  const [book, setBook] = useState<Book | null>(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [description, setDescription] = useState("");
  const [totalCopies, setTotalCopies] = useState("1");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch existing book information
  useEffect(() => {
    let active = true;

    const fetchBook = async () => {
      if (!API_URL) {
        setError("Server URL is not configured.");
        setLoading(false);
        return;
      }

      try {
        const { slug } = await params;

        if (!active) return;

        setBookId(slug);

        const response = await fetch(`${API_URL}/books/${slug}`, {
          cache: "no-store",
          credentials: "include",
        });

        const result: BookResponse = await response.json();

        if (!response.ok || !result.book?._id) {
          throw new Error(result.message || "Book not found.");
        }

        if (!active) return;

        const data = result.book;

        setBook(data);
        setTitle(data.title);
        setAuthor(data.author);
        setCategory(data.category);
        setDescription(data.description);
        setTotalCopies(String(data.totalCopies ?? 1));

        setImagePreview(`${API_URL}/book-image/${data._id}`);
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load book."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchBook();

    return () => {
      active = false;
    };
  }, [params]);

  // Cleanup temporary image preview URL
  useEffect(() => {
    if (!imagePreview.startsWith("blob:")) return;

    return () => {
      URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // Handle image selection
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(
        selectedFile.type
      )
    ) {
      setError("Please select a JPG, PNG or WEBP image.");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setSuccess("");
    setImage(selectedFile);

    setImagePreview(URL.createObjectURL(selectedFile));
  };

  // Update book
  const handleUpdate = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!API_URL || !bookId || !book) {
      setError("Book information is not available.");
      return;
    }

    if (!title.trim() || !author.trim() || !description.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const newTotalCopies = Number(totalCopies);

    const borrowedCopies =
      book.totalCopies - book.availableCopies;
    const newAvailableCopies = newTotalCopies - borrowedCopies;

    if (
      !Number.isInteger(newTotalCopies) ||
      newTotalCopies < 1 ||
      newTotalCopies < borrowedCopies
    ) {
      setError(
        `Total copies cannot be less than ${borrowedCopies} borrowed copies.`
      );
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("author", author.trim());
      formData.append("category", category);
      formData.append("description", description.trim());
      formData.append("totalCopies", String(newTotalCopies));
      formData.append(
        "availableCopies",
        String(Math.max(0, newAvailableCopies))
      );

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();

      console.log("PATCH Status:", response.status);
      console.log("PATCH Response:", result);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update book."
        );
      }

      setSuccess("Book updated successfully!");

      router.refresh();
      router.push(`/all-books/${bookId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setUpdating(false);
    }
  };

  // Loading UI
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F6EF]">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className="animate-spin text-[#173F35]"
            size={40}
          />

          <p className="font-medium text-[#173F35]">
            Loading book information...
          </p>
        </div>
      </main>
    );
  }

  // Book not found
  if (!book) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8F6EF] px-4">
        <BookOpen size={48} className="text-[#B18B43]" />

        <h2 className="text-2xl font-bold text-[#173F35]">
          Book Not Found
        </h2>

        <p className="text-center text-red-600">
          {error || "Unable to load this book."}
        </p>

        <Link
          href="/all-books"
          className="rounded-xl bg-[#173F35] px-6 py-3 font-semibold text-white"
        >
          Back to All Books
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6EF] px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-4xl">

        {/* Back Button */}
        <Link
          href={`/all-books/${bookId}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#173F35] transition hover:text-[#B18B43]"
        >
          <ArrowLeft size={18} />
          Back to Book Details
        </Link>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-[#173F35]/10 bg-white shadow-sm">

          {/* Header */}
          <div className="bg-[#173F35] px-6 py-8 text-white md:px-10">
            <div className="mb-3 flex items-center gap-3">
              <BookOpen
                size={28}
                className="text-[#D8B76A]"
              />

              <span className="text-sm font-semibold uppercase tracking-widest text-[#D8B76A]">
                NovelNest Library
              </span>
            </div>

            <h1 className="text-3xl font-bold md:text-4xl">
              Update Book
            </h1>

            <p className="mt-2 text-sm text-white/70">
              Edit your book information and save the changes.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleUpdate}
            className="space-y-6 p-6 md:p-10"
          >

            {/* Book Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#173F35]">
                Book Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
              />
            </div>

            {/* Author and Category */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#173F35]">
                  Author Name
                </label>

                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter author name"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#173F35]">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Total Copies */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#173F35]">
                Total Copies
              </label>

              <input
                type="number"
                min={Math.max(
                  1,
                  book.totalCopies - book.availableCopies
                )}
                value={totalCopies}
                onChange={(e) => setTotalCopies(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
              />

              <p className="mt-2 text-xs text-gray-500">
                Currently borrowed:{" "}
                {book.totalCopies - book.availableCopies} copies.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#173F35]">
                Book Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write book description..."
                rows={5}
                required
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
              />
            </div>

            {/* Book Image */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-[#173F35]">
                Book Cover Image
              </label>

              {imagePreview && (
                <div className="relative mb-4 h-56 w-40 overflow-hidden rounded-xl border border-gray-200 bg-[#F8F6EF]">
                  <Image
                    src={imagePreview}
                    alt="Book cover preview"
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
              )}

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#173F35]/20 bg-[#F8F6EF] px-5 py-8 text-center transition hover:border-[#B18B43]">
                <ImagePlus
                  size={32}
                  className="mb-3 text-[#B18B43]"
                />

                <span className="font-semibold text-[#173F35]">
                  Choose New Book Image
                </span>

                <span className="mt-2 text-xs text-gray-500">
                  PNG, JPG or WEBP (Maximum 5 MB)
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {image && (
                <p className="mt-2 text-sm text-green-700">
                  Selected: {image.name}
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
                {success}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">

              <button
                type="submit"
                disabled={updating}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#173F35] px-6 py-4 font-semibold text-white transition hover:bg-[#245747] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updating ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Update Book
                  </>
                )}
              </button>

              <Link
                href={`/all-books/${bookId}`}
                className="flex items-center justify-center rounded-xl border border-[#173F35]/20 px-6 py-4 font-semibold text-[#173F35] transition hover:bg-[#F8F6EF]"
              >
                Cancel
              </Link>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}
