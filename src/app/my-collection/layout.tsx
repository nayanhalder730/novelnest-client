import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NovelNest | My Books",
};

export default function MyCollectionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
