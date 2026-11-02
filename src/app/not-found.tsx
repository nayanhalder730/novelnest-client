import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F6EF] px-4 py-16">
      <section className="w-full max-w-xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#173F35]/10 text-[#173F35]">
          <BookOpen size={40} aria-hidden="true" />
        </div>
        <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-[#B18B43]">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#173F35] sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-gray-600">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#173F35] px-6 py-3 font-semibold text-white transition hover:bg-[#245747]"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Back to Home
        </Link>
      </section>
    </main>
  );
}
