import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NovelNest | All Books",
};

export default function AllBooksLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
