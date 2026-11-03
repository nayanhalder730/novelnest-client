
import BookDetails from "@/components/homePage/BooksDetails";
import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "NovelNest | Book Details",
};

async function DynamicBookDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();

  return <BookDetails params={params} />;
}

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-500">
            Loading book details...
          </p>
        </div>
      }
    >
      <DynamicBookDetails params={params} />
    </Suspense>
  );
}
