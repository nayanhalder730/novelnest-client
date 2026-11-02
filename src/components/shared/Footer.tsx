"use client";


import Link from "next/link";
import {
  ArrowUp,
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Books", href: "/all-books" },
  { name: "Add a Book", href: "/add-book" },
  { name: "My Books", href: "/my-collection" },
  { name: "My Borrows", href: "/my-borrows" },
];

const genreLinks = [
  { name: "Fiction", href: "/all-books?category=Fiction" },
  { name: "Science", href: "/all-books?category=Science" },
  { name: "Technology", href: "/all-books?category=Science" },
  { name: "History", href: "/all-books?category=History" },
  { name: "Mystery", href: "/all-books?category=Others" },
];

const socialLinks = [
  { name: "Facebook", label: "f", href: "https://facebook.com" },
  { name: "Instagram", label: "ig", href: "https://instagram.com" },
  { name: "LinkedIn", label: "in", href: "https://linkedin.com" },
];

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="relative overflow-hidden bg-[#102e2b] text-white">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#d5b36a]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        {/* Top section */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3">
             <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-sm transition duration-300 group-hover:scale-105 sm:h-12 sm:w-12">
                         <Image
                           src="/novelNestLogo.jpg"
                           alt="NovelNest Logo"
                           fill
                           priority
                           sizes="48px"
                           className="object-cover"
                         />
                       </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Novel<span className="text-[#d5b36a]">Nest</span>
                </h2>
                <p className="text-xs tracking-[0.2em] text-slate-400">
                  A WORLD BETWEEN PAGES
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-slate-300">
              Discover amazing books, explore new stories, and build your own
              reading collection with NovelNest.
            </p>

            {/* Social links */}
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-transparent text-sm font-bold text-slate-300 transition hover:-translate-y-1 hover:border-[#d5b36a] hover:bg-[#d5b36a] hover:text-[#102e2b]"
                >
                  {social.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-[#d5b36a]">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-[#d5b36a]"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-[#d5b36a]">
              Popular Genres
            </h3>

            <ul className="space-y-4">
              {genreLinks.map((genre) => (
                <li key={genre.name}>
                  <Link
                    href={genre.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-[#d5b36a]"
                  >
                    <span>{genre.name}</span>
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-[#d5b36a]">
              Get in Touch
            </h3>

            <p className="mb-6 text-sm leading-7 text-slate-300">
              Have questions or suggestions? We would love to hear from you.
            </p>

            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <Mail className="mt-1 shrink-0 text-[#d5b36a]" size={18} />
                <a
                  href="mailto:nayanh730@gmail.com"
                  className="text-sm text-slate-300 transition hover:text-[#d5b36a]"
                >
                  nayanh730@gmail.com
                </a>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="mt-1 shrink-0 text-[#d5b36a]" size={18} />
                <a
                  href="tel:+8801770780381"
                  className="text-sm text-slate-300 transition hover:text-[#d5b36a]"
                >
                  +880 1770-780381
                </a>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="mt-1 shrink-0 text-[#d5b36a]" size={18} />
                <span className="text-sm text-slate-300">
                  Dhaka, Bangladesh
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter banner */}
        <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.05] p-7 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#d5b36a]">
                Keep Reading
              </p>
              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
                Every book opens a new world.
              </h3>
              <p className="mt-3 text-sm text-slate-300">
                Find your next favorite story at NovelNest.
              </p>
            </div>

            <Link
              href="/all-books"
              className="inline-flex items-center rounded-full bg-[#d5b36a] px-7 py-3 font-semibold text-[#102e2b] transition hover:bg-[#e4c77f]"
            >
              Explore Books
              <ArrowUpRight className="ml-2" size={17} />
            </Link>
          </div>
        </div>

        {/* Bottom section */}
        <Separator className="my-8 bg-white/15" />

        <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-slate-400">
            © {currentYear} NovelNest. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/privacy" className="transition hover:text-[#d5b36a]">
              Privacy Policy
            </Link>

            <Link href="/terms" className="transition hover:text-[#d5b36a]">
              Terms
            </Link>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-slate-300 hover:bg-white/10 hover:text-[#d5b36a]"
          >
            Back to top
            <ArrowUp className="ml-2" size={16} />
          </Button>
        </div>
      </div>
    </footer>
  );
}
