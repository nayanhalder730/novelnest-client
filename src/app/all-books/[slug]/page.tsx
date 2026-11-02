import BookDetails from "@/components/homePage/BooksDetails";
import { Suspense } from "react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  await params;
  return {
    title: "NovelNest | Book Details",
  };
}

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8F6EF]">
          <p className="text-lg font-medium text-[#173F35]">
            Loading book details...
          </p>
        </div>
      }
    >
      <BookDetails params={params} />
    </Suspense>
  );
}