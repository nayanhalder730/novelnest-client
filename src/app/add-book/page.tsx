"use client";

import { useState } from "react";
import {
  BookOpen,
  Upload,
  ImagePlus,
  UserRound,
  Mail,
  BookText,
  Hash,
  AlignLeft,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const categories = [
  "Fiction",
  "Science",
  "Technology",
  "History",
  "Mystery",
  "Fantasy",
  "Biography",
  "Romance",
  "Education",
  "Other",
];

export default function AddBookPage() {
  const [imageName, setImageName] = useState("");

  return (
    <main className="min-h-screen bg-[#f5f5ed] px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-3xl">

        {/* Form Header */}
        <div className="mb-9 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#153b32] text-[#e0bd75] shadow-lg shadow-[#153b32]/15">
            <BookOpen size={28} />
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

          <form className="space-y-7 p-6 sm:p-9">

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
                  className="h-12 rounded-xl border-[#dce5de] bg-[#fafbf8] px-4 text-[#153b32] placeholder:text-gray-400 focus-visible:border-[#153b32] focus-visible:ring-[#153b32]/20"
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
                  className="h-12 rounded-xl border-[#dce5de] bg-[#fafbf8] px-4 text-[#153b32] placeholder:text-gray-400 focus-visible:border-[#153b32] focus-visible:ring-[#153b32]/20"
                />
              </div>

            </div>

            {/* Category & Copies */}
            <div className="grid gap-6 sm:grid-cols-2">

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
                  className="h-12 w-full rounded-xl border border-[#dce5de] bg-[#fafbf8] px-4 text-sm text-[#153b32] outline-none transition focus:border-[#153b32] focus:ring-2 focus:ring-[#153b32]/10"
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

              <div className="space-y-2.5">
                <Label
                  htmlFor="totalCopies"
                  className="flex items-center gap-2 font-semibold text-[#153b32]"
                >
                  <Hash size={16} className="text-[#b18b43]" />
                  Total Copies
                </Label>

                <Input
                  id="totalCopies"
                  name="totalCopies"
                  type="number"
                  min="1"
                  defaultValue="1"
                  required
                  placeholder="Number of copies"
                  className="h-12 rounded-xl border-[#dce5de] bg-[#fafbf8] px-4 text-[#153b32] focus-visible:border-[#153b32] focus-visible:ring-[#153b32]/20"
                />
              </div>

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
                className="resize-none rounded-xl border-[#dce5de] bg-[#fafbf8] px-4 py-3 text-[#153b32] placeholder:text-gray-400 focus-visible:border-[#153b32] focus-visible:ring-[#153b32]/20"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-[#e8eee8]" />

            {/* User Information */}
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
                    placeholder="Your name"
                    required
                    className="h-12 rounded-xl border-[#dce5de] bg-[#fafbf8] px-4 text-[#153b32] focus-visible:border-[#153b32] focus-visible:ring-[#153b32]/20"
                  />
                </div>

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
                    placeholder="Your email address"
                    required
                    className="h-12 rounded-xl border-[#dce5de] bg-[#fafbf8] px-4 text-[#153b32] focus-visible:border-[#153b32] focus-visible:ring-[#153b32]/20"
                  />
                </div>

              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="h-13 w-full rounded-xl bg-[#153b32] text-base font-semibold text-white shadow-lg shadow-[#153b32]/15 transition hover:bg-[#205344]"
            >
              <BookOpen size={19} className="mr-2" />
              Add Book to Library
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