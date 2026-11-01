import BookDetails from "@/components/homePage/BooksDetails";
import { Suspense } from "react";


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