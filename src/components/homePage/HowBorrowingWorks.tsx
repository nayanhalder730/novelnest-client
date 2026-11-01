
import Link from "next/link";
import {
  Search,
  BookOpen,
  BookmarkCheck,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover a Book",
    description:
      "Explore our library and find books that match your interests.",
  },
  {
    number: "02",
    icon: BookmarkCheck,
    title: "Request to Borrow",
    description:
      "Choose your favorite book and submit a borrowing request.",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Enjoy Reading",
    description:
      "Get your book and enjoy a wonderful reading experience.",
  },
];

export default function HowBorrowingWorks() {
  return (
    <section className="bg-white px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#B18B43]">
            Simple and convenient
          </p>

          <h2 className="text-3xl font-bold text-[#173F35] md:text-4xl">
            How Borrowing Works
          </h2>

          <p className="mt-4 text-gray-600">
            Getting your next favorite book is easy. Follow these three
            simple steps and start your reading journey.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-2xl border border-[#173F35]/10 bg-[#F8F6EF] p-8 text-center transition duration-300 hover:-translate-y-2 hover:shadow-lg"
              >
                <span className="absolute right-6 top-5 text-3xl font-bold text-[#D8B76A]/60">
                  {step.number}
                </span>

                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#173F35] text-[#D8B76A]">
                  <Icon size={30} />
                </div>

                <h3 className="text-xl font-bold text-[#173F35]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/all-books"
            className="inline-flex items-center gap-2 font-semibold text-[#173F35] transition hover:text-[#B18B43]"
          >
            Find Your Next Book
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
