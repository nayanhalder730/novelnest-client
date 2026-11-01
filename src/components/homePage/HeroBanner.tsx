
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import {
  ArrowRight,
  BookOpen,
  Library,
  Sparkles,
} from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    subtitle: "WELCOME TO NOVELNEST",
    title: "Discover Stories That Inspire You",
    description:
      "Explore a world of knowledge, imagination and endless possibilities. Your next favorite book is waiting.",
    icon: BookOpen,
    button: "Browse Books",
  },
  {
    subtitle: "EXPLORE YOUR NEXT ADVENTURE",
    title: "Every Book Opens a New World",
    description:
      "From fascinating fiction to inspiring biographies, discover stories worth remembering.",
    icon: Sparkles,
    button: "Explore Collection",
  },
  {
    subtitle: "READ. LEARN. GROW.",
    title: "Make Reading Part of Your Journey",
    description:
      "Build your personal collection, discover new authors and enjoy the wonderful world of books.",
    icon: Library,
    button: "Start Exploring",
  },
];

export default function HeroBanner() {
  const [mounted, setMounted] = useState(false);

  // Render Swiper only after browser mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="bg-[#F8F6EF] px-4 pb-12 pt-8 md:px-8 md:pb-16">
      <div className="mx-auto max-w-7xl">

        {mounted ? (
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            slidesPerView={1}
            loop
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation
            className="novelnest-hero overflow-hidden rounded-3xl"
          >
            {slides.map((slide, index) => {
              const Icon = slide.icon;

              return (
                <SwiperSlide key={index}>
                  <div className="relative flex min-h-[420px] items-center overflow-hidden bg-[#173F35] px-7 py-14 text-white md:min-h-[470px] md:px-16">

                    {/* Decorative circles */}
                    <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border border-[#D8B76A]/20" />

                    <div className="absolute -bottom-40 right-20 h-96 w-96 rounded-full border border-[#D8B76A]/20" />

                    {/* Content */}
                    <div className="relative z-10 max-w-2xl">

                      <div className="mb-5 flex items-center gap-2 text-sm font-semibold tracking-[0.2em] text-[#D8B76A]">
                        <Icon size={19} />
                        {slide.subtitle}
                      </div>

                      <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
                        {slide.title}
                      </h1>

                      <p className="mt-6 max-w-xl text-sm leading-7 text-[#E5E8E1] md:text-base">
                        {slide.description}
                      </p>

                      <Link
                        href="/all-books"
                        className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#D8B76A] px-7 py-3.5 font-semibold text-[#173F35] transition hover:bg-[#E8C982]"
                      >
                        {slide.button}
                        <ArrowRight size={18} />
                      </Link>
                    </div>

                    {/* Decorative Book Illustration */}
                    <div className="absolute bottom-8 right-10 hidden h-64 w-64 items-center justify-center rounded-full border border-[#D8B76A]/30 bg-white/5 md:flex lg:right-24">

                      <div className="flex h-44 w-36 -rotate-6 flex-col items-center justify-center rounded-r-xl border-l-8 border-[#B18B43] bg-[#F8F6EF] p-4 text-center shadow-2xl">

                        <BookOpen
                          className="mb-4 text-[#173F35]"
                          size={42}
                        />

                        <span className="text-xl font-bold text-[#173F35]">
                          NovelNest
                        </span>

                        <span className="mt-2 text-xs text-[#876B36]">
                          A world of stories
                        </span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          // Initial static placeholder during prerendering
          <div className="flex min-h-[420px] items-center overflow-hidden rounded-3xl bg-[#173F35] px-7 py-14 text-white md:min-h-[470px] md:px-16">

            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-2 text-sm font-semibold tracking-[0.2em] text-[#D8B76A]">
                <BookOpen size={19} />
                {slides[0].subtitle}
              </div>

              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                {slides[0].title}
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-[#E5E8E1] md:text-base">
                {slides[0].description}
              </p>

              <Link
                href="/all-books"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#D8B76A] px-7 py-3.5 font-semibold text-[#173F35]"
              >
                Browse Books
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .novelnest-hero .swiper-pagination-bullet {
          background: #f8f6ef;
          opacity: 0.6;
        }

        .novelnest-hero .swiper-pagination-bullet-active {
          background: #d8b76a;
          opacity: 1;
        }

        .novelnest-hero .swiper-button-next,
        .novelnest-hero .swiper-button-prev {
          color: #d8b76a;
        }

        .novelnest-hero .swiper-button-next::after,
        .novelnest-hero .swiper-button-prev::after {
          font-size: 22px;
          font-weight: bold;
        }
      `}</style>
    </section>
  );
}
