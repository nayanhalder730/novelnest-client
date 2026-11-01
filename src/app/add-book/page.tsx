
"use client";

import { useState } from "react";
import {
  BookOpen,
  Upload,
  ImagePlus,
  UserRound,
  Mail,
  BookText,
  AlignLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

const categories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export default function AddBookPage() {
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);

  // Logged-in user information
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user ?? null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first!");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/addBooks`,
        {
          method: "POST",
          body: formData,
        }
      );

     const data = await res.json();

if (!res.ok || !data.success) {
  console.log("Backend Error:", data);

  throw new Error(data.message || "Failed to add book");
}

toast.success("Book added successfully!");

      form.reset();
      setImageName("");

    } catch (error) {
      console.error("Add Book Error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong!"
      );

    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5ed]">
        <Loader2 className="animate-spin text-[#153b32]" size={35} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5ed]">
        <p className="text-lg font-semibold text-[#153b32]">
          Please login to add a book.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5ed] px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-3xl">

        {/* Form Header */}
        <div className="mb-9 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#153b32] text-[#e0bd75] shadow-lg shadow-[#153b32]/15">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-sm transition duration-300 group-hover:scale-105 sm:h-12 sm:w-12">
                        <Image
                          src="/novelNestLogo.jpg"
                          alt="NovelNest Logo"
                          fill
                          priority
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#153b32] sm:text-4xl">
            Add a New Book
          </h1>

          <p className="mt-3 text-sm text-[#64756c] sm:text-base">
            Share your favorite book with the NovelNest community.
          </p>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-3xl border border-[#153b32]/10 bg-white shadow-xl shadow-[#153b32]/5">

          {/* Card Heading */}
          <div className="border-b border-white/10 bg-[#153b32] px-6 py-6 sm:px-9">
            <h2 className="text-xl font-semibold text-white">
              Book Information
            </h2>

            <p className="mt-1 text-sm text-[#c1d2c8]">
              Fill in the details below to add your book.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-7 p-6 sm:p-9"
          >

            {/* Book Title & Author */}
            <div className="grid gap-6 sm:grid-cols-2">

              <div className="space-y-2.5">
                <Label
                  htmlFor="title"
                  className="flex items-center gap-2 font-semibold text-[#153b32]"
                >
                  <BookText size={16} className="text-[#b18b43]" />
                  Book Title
                </Label>

                <Input
                  id="title"
                  name="title"
                  placeholder="Enter book title"
                  required
                  className="h-12 rounded-xl border-[#dce5de] bg-[#fafbf8] px-4 text-[#153b32]"
                />
              </div>

              <div className="space-y-2.5">
                <Label
                  htmlFor="author"
                  className="flex items-center gap-2 font-semibold text-[#153b32]"
                >
                  <UserRound size={16} className="text-[#b18b43]" />
                  Author Name
                </Label>

                <Input
                  id="author"
                  name="author"
                  placeholder="Enter author name"
                  required
                  className="h-12 rounded-xl border-[#dce5de] bg-[#fafbf8] px-4 text-[#153b32]"
                />
              </div>

            </div>

            {/* Category */}
            <div className="space-y-2.5">
              <Label
                htmlFor="category"
                className="flex items-center gap-2 font-semibold text-[#153b32]"
              >
                <BookOpen size={16} className="text-[#b18b43]" />
                Book Category
              </Label>

              <select
                id="category"
                name="category"
                defaultValue=""
                required
                className="h-12 w-full rounded-xl border border-[#dce5de] bg-[#fafbf8] px-4 text-sm text-[#153b32] outline-none focus:border-[#153b32] focus:ring-2 focus:ring-[#153b32]/10"
              >
                <option value="" disabled>
                  Select a category
                </option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Book Image */}
            <div className="space-y-2.5">
              <Label
                htmlFor="image"
                className="flex items-center gap-2 font-semibold text-[#153b32]"
              >
                <ImagePlus size={16} className="text-[#b18b43]" />
                Book Cover Image
              </Label>

              <label
                htmlFor="image"
                className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#cbd9ce] bg-[#fafbf8] px-5 py-8 text-center transition hover:border-[#153b32] hover:bg-[#f1f6f1]"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#153b32]/10 text-[#153b32] transition group-hover:bg-[#153b32] group-hover:text-white">
                  <Upload size={22} />
                </div>

                <p className="text-sm font-semibold text-[#153b32]">
                  {imageName || "Click to upload book cover"}
                </p>

                <p className="mt-2 text-xs text-[#819087]">
                  PNG, JPG or WEBP
                </p>

                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  required
                  className="hidden"
                  onChange={(e) =>
                    setImageName(e.target.files?.[0]?.name || "")
                  }
                />
              </label>
            </div>

            {/* Description */}
            <div className="space-y-2.5">
              <Label
                htmlFor="description"
                className="flex items-center gap-2 font-semibold text-[#153b32]"
              >
                <AlignLeft size={16} className="text-[#b18b43]" />
                Short Description
              </Label>

              <Textarea
                id="description"
                name="description"
                placeholder="Write something interesting about this book..."
                required
                rows={4}
                className="resize-none rounded-xl border-[#dce5de] bg-[#fafbf8] px-4 py-3 text-[#153b32]"
              />
            </div>

            <div className="border-t border-[#e8eee8]" />

            {/* Owner Information */}
            <div>
              <div className="mb-5">
                <h3 className="text-lg font-bold text-[#153b32]">
                  Owner Information
                </h3>

                <p className="mt-1 text-sm text-[#819087]">
                  Your information as the book contributor.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">

                {/* User Name */}
                <div className="space-y-2.5">
                  <Label
                    htmlFor="userName"
                    className="flex items-center gap-2 font-semibold text-[#153b32]"
                  >
                    <UserRound size={16} className="text-[#b18b43]" />
                    User Name
                  </Label>

                  <Input
                    id="userName"
                    name="userName"
                    value={user.name || ""}
                    readOnly
                    className="h-12 rounded-xl border-[#dce5de] bg-gray-100 px-4 text-[#153b32]"
                  />
                </div>

                {/* User Email */}
                <div className="space-y-2.5">
                  <Label
                    htmlFor="userEmail"
                    className="flex items-center gap-2 font-semibold text-[#153b32]"
                  >
                    <Mail size={16} className="text-[#b18b43]" />
                    User Email
                  </Label>

                  <Input
                    id="userEmail"
                    name="userEmail"
                    type="email"
                    value={user.email || ""}
                    readOnly
                    className="h-12 rounded-xl border-[#dce5de] bg-gray-100 px-4 text-[#153b32]"
                  />
                </div>

              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="h-13 w-full rounded-xl bg-[#153b32] text-base font-semibold text-white shadow-lg shadow-[#153b32]/15 transition hover:bg-[#205344] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="mr-2 animate-spin" />
                  Adding Book...
                </>
              ) : (
                <>
                  <BookOpen size={19} className="mr-2" />
                  Add Book to Library
                </>
              )}
            </Button>

            <p className="flex items-center justify-center gap-2 text-center text-xs text-[#819087]">
              <CheckCircle2 size={14} className="text-[#b18b43]" />
              Share your knowledge with the NovelNest community.
            </p>

          </form>
        </div>
      </div>
    </main>
  );
}
