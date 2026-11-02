
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  BookOpen,
  Menu,
  Moon,
  Sun,
  Home,
  Library,
  BookPlus,
  Bookmark,
  UserRound,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const publicLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Explore Books", href: "/all-books", icon: BookOpen },
];

const privateLinks = [
  { name: "Add Book", href: "/add-book", icon: BookPlus },
  { name: "My Collection", href: "/my-collection", icon: Library },
  { name: "My Borrows", href: "/my-borrows", icon: Bookmark },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Load saved theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Toggle theme
  const toggleTheme = () => {
    const nextTheme = !darkMode;

    setDarkMode(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);

    localStorage.setItem("theme", nextTheme ? "dark" : "light");
  };

  // Active route
  const isActive = (href: string) => {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  };

  // Logout
  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      setMobileOpen(false);

      toast.success("Logged out successfully!");

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const links = [...publicLinks, ...(user ? privateLinks : [])];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-[#101b1b]/95">
      <nav className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:h-[82px] lg:px-10">

        {/* BRAND */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 sm:gap-3"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-sm transition duration-300 group-hover:scale-105 sm:h-12 sm:w-12">
            <Image
              src="/novelNestLogo.jpg"
              alt="NovelNest Logo"
              fill
              priority
              sizes="48px"
              className="object-cover"
            />
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#075b55] dark:text-white sm:text-[25px]">
              NovelNest<span className="text-[#d5b36a]">.</span>
            </h1>

            <p className="hidden text-[9px] font-bold uppercase tracking-[2px] text-slate-500 dark:text-slate-400 sm:block sm:tracking-[2.5px]">
              A World Between Pages
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-5 xl:flex 2xl:gap-7">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-2 text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? "text-[#087f75]"
                  : "text-slate-600 hover:text-[#087f75] dark:text-slate-300 dark:hover:text-teal-400"
              }`}
            >
              {link.name}

              {isActive(link.href) && (
                <span className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full bg-[#087f75]" />
              )}
            </Link>
          ))}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 xl:flex">

          {/* THEME BUTTON */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full border-slate-200 dark:border-slate-700"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-[#087f75]" />
            )}
          </Button>

          {/* AUTH LOADING */}
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          ) : !user ? (
            /* LOGGED OUT */
            <>
              <Link
                href="/sign-in"
                className="rounded-full px-4 py-2 font-semibold text-[#075b55] transition hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-slate-800"
              >
                Login
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full bg-[#087f75] px-6 py-2 font-semibold text-white shadow-md transition hover:bg-[#066a62]"
              >
                Get Started
              </Link>
            </>
          ) : (
            /* LOGGED IN */
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex max-w-[190px] items-center gap-2 rounded-full border border-slate-200 px-2 py-1.5 transition hover:border-[#087f75] hover:bg-teal-50 dark:border-slate-700 dark:hover:bg-slate-800"
                aria-label="View profile"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user.image || ""}
                    alt={user.name || "User"}
                  />
                  <AvatarFallback className="bg-teal-100 font-bold text-teal-800">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <span className="max-w-24 truncate text-sm font-semibold text-slate-700 dark:text-white">
                  {user.name || "Reader"}
                </span>

                <UserRound
                  size={16}
                  className="shrink-0 text-[#087f75]"
                />
              </Link>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* MOBILE AND TABLET ACTIONS */}
        <div className="flex items-center gap-2 xl:hidden">

          {/* MOBILE THEME BUTTON */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-9 w-9 rounded-xl sm:h-10 sm:w-10"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-[#087f75]" />
            )}
          </Button>

          {/* MOBILE MENU */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open navigation"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#087f75] text-white transition hover:bg-[#066a62] sm:h-10 sm:w-10"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[290px] overflow-y-auto sm:w-[350px]"
            >
              {/* MOBILE HEADER */}
              <SheetHeader className="border-b pb-5 text-left">
                <SheetTitle className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                    <Image
                      src="/novelNestLogo.jpg"
                      alt="NovelNest"
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>

                  <span className="text-xl font-extrabold text-[#087f75] dark:text-teal-400">
                    NovelNest.
                  </span>
                </SheetTitle>
              </SheetHeader>

              {/* MOBILE NAVIGATION LINKS */}
              <div className="mt-7 flex flex-col gap-2">
                <p className="mb-2 px-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Navigation
                </p>

                {links.map((link) => {
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        isActive(link.href)
                          ? "bg-teal-50 text-[#087f75] dark:bg-teal-950 dark:text-teal-300"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon size={19} />
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* MOBILE AUTH SECTION */}
              <div className="mt-8 border-t pt-5">

                {isPending ? (
                  <div className="h-12 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
                ) : !user ? (
                  /* LOGGED OUT */
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center rounded-full border border-slate-300 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                    >
                      Login
                    </Link>

                    <Link
                      href="/sign-up"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center rounded-full bg-[#087f75] px-3 py-3 text-sm font-semibold text-white transition hover:bg-[#066a62]"
                    >
                      Get Started
                    </Link>
                  </div>
                ) : (
                  /* LOGGED IN */
                  <div>
                    <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Your Account
                    </p>

                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-[#087f75] hover:bg-teal-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <Avatar className="h-11 w-11">
                        <AvatarImage
                          src={user.image || ""}
                          alt={user.name || "User"}
                        />
                        <AvatarFallback className="bg-teal-100 font-bold text-teal-800">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
                          {user.name || "Reader"}
                        </p>

                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[#087f75]">
                          View Profile
                        </p>
                      </div>
                    </Link>

                    <Button
                      variant="outline"
                      className="w-full justify-start rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>

              {/* MOBILE FOOTER */}
              <div className="mt-8 border-t pt-5">
                <p className="text-center text-xs text-muted-foreground">
                  Read. Discover. Imagine.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
