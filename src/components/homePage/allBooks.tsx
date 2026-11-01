import BookCard, {
  type Book,
} from "@/components/homePage/BookCard";

interface BooksResponse {
  success: boolean;
  count: number;
  data: Book[];
}

export default async function AllBooks() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/allBooks`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  const result: BooksResponse = await res.json();
  const cardData = result.data;

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