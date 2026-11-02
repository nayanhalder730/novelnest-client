
import BookCard, {
  type Book,
} from "@/components/homePage/BookCard";

interface BooksResponse {
  success: boolean;
  count: number;
  books: Book[];
  message?: string;
}

export default async function AllBooks() {
  let cardData: Book[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/allBooks`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch books: ${res.status}`);
    }

    const result: BooksResponse = await res.json();

    if (!result.success || !Array.isArray(result.books)) {
      throw new Error(
        result.message || "Invalid books response from server."
      );
    }

    cardData = result.books.filter(
      (book) => book && book._id
    );
  } catch (error) {
    console.error("All Books Error:", error);

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to load books."
    );
  }

  return (
    <section className="min-h-screen bg-[#F8F6EF] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#B18B43]">
            Explore Our Collection
          </p>

          <h1 className="text-3xl font-bold text-[#173F35] md:text-5xl">
            All Books
          </h1>

          <p className="mt-3 text-gray-600">
            Discover your next favorite book from our library.
          </p>

          <p className="mt-2 text-sm font-medium text-[#173F35]">
            {cardData.length} Books Available
          </p>
        </div>

        {cardData.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cardData.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-semibold text-[#173F35]">
              No Books Found
            </h2>

            <p className="mt-2 text-gray-500">
              No books are available in the library yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}