import BookCard, {
  type Book,
} from "@/components/homePage/BookCard";

export const instant = false;

interface BooksResponse {
  success: boolean;
  count: number;
  data: Book[];
}

export default async function AllBooksPage() {
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
    <main className="min-h-screen bg-[#F8F6EF] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 text-center text-4xl font-bold text-[#173F35]">
          All Books
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cardData.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </div>
    </main>
  );
}