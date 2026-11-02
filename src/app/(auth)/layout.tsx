import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NovelNest | Login",
};

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
