
import Link from "next/link";
import BookCard, {
  type Book,
} from "@/components/homePage/BookCard";

export const instant = false;

interface BooksResponse {
  success: boolean;
  count: number;
  data: Book[];
}

interface AllBooksPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

const API_URL = process.env.NEXT_PUBLIC_SERVER_SITE_URL;

const allowedCategories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export default async function AllBooksPage({
  searchParams,
}: AllBooksPageProps) {
  const { category } = await searchParams;

  if (!API_URL) {
    throw new Error("Server URL is not configured");
  }

  // Fetch all books
  const res = await fetch(`${API_URL}/books`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch books: ${res.status}`);
  }

  const result: BooksResponse = await res.json();

  const cardData = result.data || [];

  // Validate selected category
  const selectedCategory =
    category && allowedCategories.includes(category)
      ? category
      : "";

  // Filter books by category
  const filteredBooks = selectedCategory
    ? cardData.filter(
        (book) => book.category === selectedCategory
      )
    : cardData;

  return (
    <main className="min-h-screen bg-[#F8F6EF] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#B18B43]">
            Explore Our Collection
          </p>

          <h1 className="text-3xl font-bold text-[#173F35] md:text-4xl">
            {selectedCategory
              ? `${selectedCategory} Books`
              : "All Books"}
          </h1>

          <p className="mt-3 text-gray-600">
            {selectedCategory
              ? `Explore our ${selectedCategory} book collection.`
              : "Discover your next favorite book from our collection."}
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">

          <Link
            href="/all-books"
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
              !selectedCategory
                ? "border-[#173F35] bg-[#173F35] text-white"
                : "border-[#173F35]/20 bg-white text-[#173F35] hover:bg-[#173F35] hover:text-white"
            }`}
          >
            All
          </Link>

          {allowedCategories.map((item) => (
            <Link
              key={item}
              href={`/all-books?category=${encodeURIComponent(item)}`}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                selectedCategory === item
                  ? "border-[#173F35] bg-[#173F35] text-white"
                  : "border-[#173F35]/20 bg-white text-[#173F35] hover:bg-[#173F35] hover:text-white"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Book Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="font-medium text-gray-600">
            {filteredBooks.length}{" "}
            {filteredBooks.length === 1 ? "Book" : "Books"} Found
          </p>

          {selectedCategory && (
            <Link
              href="/all-books"
              className="text-sm font-semibold text-[#B18B43] transition hover:text-[#173F35]"
            >
              Clear Filter
            </Link>
          )}
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="rounded-2xl border border-[#173F35]/10 bg-white px-4 py-20 text-center">
            <h2 className="text-xl font-bold text-[#173F35]">
              No books found
            </h2>

            <p className="mt-2 text-gray-500">
              {selectedCategory
                ? `No books available in ${selectedCategory} category.`
                : "There are no books available right now."}
            </p>

            {selectedCategory && (
              <Link
                href="/all-books"
                className="mt-6 inline-block rounded-lg bg-[#173F35] px-6 py-3 font-semibold text-white transition hover:bg-[#B18B43]"
              >
                View All Books
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}