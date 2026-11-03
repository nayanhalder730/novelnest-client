
import Link from "next/link";
import {
  Search,
  BookOpen,
  BookmarkCheck,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Discover a Book",
    description:
      "Explore our collection and find the perfect book that matches your interests and reading preferences.",
    icon: Search,
  },
  {
    id: 2,
    title: "Request to Borrow",
    description:
      "Found something interesting? Simply request to borrow your favorite book with just a few clicks.",
    icon: BookmarkCheck,
  },
  {
    id: 3,
    title: "Enjoy Reading",
    description:
      "Get your book and enjoy your reading journey. Return it when you're finished so others can enjoy it too.",
    icon: BookOpen,
  },
];

export default function HowBorrowingWorks() {
  return (
    <section className="bg-[#F8F6EF] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-[#173F35]/10 px-5 py-2 text-sm font-semibold tracking-wide text-[#173F35]">
            Simple & Easy Process
          </span>

          <h2 className="text-3xl font-bold leading-tight text-[#173F35] sm:text-4xl lg:text-5xl">
            How Borrowing Works
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
            Borrowing your next favorite book has never been easier.
            Follow these simple steps and start your reading journey.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="group relative rounded-2xl border border-[#173F35]/10 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#D8B76A] hover:shadow-xl"
              >
                {/* Step Number */}
                <div className="absolute right-6 top-6 text-5xl font-bold text-[#173F35]/5">
                  0{step.id}
                </div>

                {/* Icon */}
                <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#173F35]/10 text-[#173F35] transition-all duration-300 group-hover:bg-[#173F35] group-hover:text-white">
                  <Icon size={36} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <h3 className="mb-4 text-xl font-bold text-[#173F35] transition-colors group-hover:text-[#B18B43]">
                  {step.title}
                </h3>

                <p className="text-sm leading-7 text-gray-500 sm:text-base">
                  {step.description}
                </p>
              </div>
            );
          })}

        </div>

        {/* Explore Books Button */}
        <div className="mt-14 text-center">
          <Link
            href="/all-books"
            className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#173F35] px-8 py-4 font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#B18B43] hover:text-[#173F35]"
          >
            Find Your Next Book
            <ArrowRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

      </div>
    </section>
  );
}
