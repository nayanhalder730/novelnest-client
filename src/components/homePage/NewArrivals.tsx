
import Link from "next/link";
import BookCard, { Book } from "../homePage/BookCard";

interface BooksResponse {
  success: boolean;
  data: Book[];
}

const API_URL = process.env.NEXT_PUBLIC_SERVER_SITE_URL;

const NewArrivals = async () => {
  if (!API_URL) {
    throw new Error("Server URL is not configured");
  }

  const res = await fetch(`${API_URL}/books`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch books: ${res.status}`);
  }

  const result: BooksResponse = await res.json();
  const cardData = result.data || [];

  return (
    <section className="bg-[#f8f6ef] px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-[#173f35] md:text-4xl">
            Recently Added Books
          </h2>

          <p className="mt-3 text-gray-600">
            Explore the latest books in our library.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {cardData.slice(0, 6).map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/all-books"
            className="rounded-xl bg-[#173f35] px-7 py-3 font-semibold text-white hover:bg-[#245c4d]"
          >
            See All Books
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
