
import Link from "next/link";
import {
  BookOpen,
  Baby,
  FlaskConical,
  Landmark,
  Layers,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    name: "Fiction",
    description: "Stories that spark imagination",
    icon: BookOpen,
  },
  {
    name: "Kids",
    description: "Wonderful stories for young readers",
    icon: Baby,
  },
  {
    name: "Science",
    description: "Discover how the world works",
    icon: FlaskConical,
  },
  {
    name: "History",
    description: "Explore stories from the past",
    icon: Landmark,
  },
  {
    name: "Others",
    description: "Discover books from other genres",
    icon: Layers,
  },
];

export default function TopCategories() {
  return (
    <section className="bg-[#F8F6EF] px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#B18B43]">
              Explore your interests
            </p>

            <h2 className="text-3xl font-bold text-[#173F35] md:text-4xl">
              Browse by Categories
            </h2>

            <p className="mt-3 text-gray-600">
              Find your next great read from our diverse book categories.
            </p>
          </div>

          <Link
            href="/all-books"
            className="group inline-flex items-center gap-2 font-semibold text-[#173F35] transition hover:text-[#B18B43]"
          >
            All Categories
            <ArrowUpRight
              size={18}
              className="transition group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/all-books?category=${encodeURIComponent(category.name)}`}
                className="group flex items-center gap-5 rounded-2xl border border-[#173F35]/10 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D8B76A] hover:shadow-lg"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#173F35] text-[#D8B76A] transition duration-300 group-hover:bg-[#D8B76A] group-hover:text-[#173F35]">
                  <Icon size={27} />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#173F35]">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {category.description}
                  </p>
                </div>

                <ArrowUpRight
                  className="text-[#B18B43] transition group-hover:-translate-y-1 group-hover:translate-x-1"
                  size={21}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}