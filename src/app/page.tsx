
import { Suspense } from "react";

import HeroBanner from "@/components/homePage/HeroBanner";
import HowBorrowingWorks from "@/components/homePage/HowBorrowingWorks";
import NewArrivals from "@/components/homePage/NewArrivals";
import TopCategories from "@/components/homePage/TopCategories";

export default function Home() {
  return (
    <main>
      <HeroBanner />

      <Suspense
        fallback={
          <p className="py-20 text-center">Loading books...</p>
        }
      >
        <NewArrivals />
      </Suspense>

      <TopCategories />
      <HowBorrowingWorks />
    </main>
  );
}
