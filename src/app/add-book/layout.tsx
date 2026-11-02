import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NovelNest | Add Book",
};

export default function AddBookLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
