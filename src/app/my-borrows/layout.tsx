import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NovelNest | My Borrows",
};

export default function MyBorrowsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
