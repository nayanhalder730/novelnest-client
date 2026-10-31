"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  ChevronDown,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  user?: {
    name?: string;
    email?: string;
    image?: string;
  } | null;
  onLogout?: () => void;
}

const publicLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Explore Books", href: "/books", icon: BookOpen },
];

const privateLinks = [
  { name: "Add Book", href: "/add-book", icon: BookPlus },
  { name: "My Collection", href: "/my-books", icon: Library },
  { name: "My Borrows", href: "/my-borrows", icon: Bookmark },
];

export default function Navbar({ user = null, onLogout }: NavbarProps) {
  const pathname = usePathname();

  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";

    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

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

  const links = [...publicLinks, ...(user ? privateLinks : [])];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-[#101b1b]/90">
      <nav className="mx-auto flex h-[82px] max-w-[1400px] items-center justify-between px-5 lg:px-10">
        {/* BRAND */}
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl shadow-sm transition duration-300 group-hover:scale-105">
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
            <h1 className="text-[25px] font-extrabold tracking-tight text-[#075b55] dark:text-white">
              NovelNest<span className="text-[#d5b36a]">.</span>
            </h1>

            <p className="text-[9px] font-bold uppercase tracking-[2.5px] text-slate-500 dark:text-slate-400">
              A World Between Pages
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-7 xl:flex">
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

          {!user ? (
            <>
              <Button
                variant="ghost"
                
                className="rounded-full font-semibold text-[#075b55] hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-slate-800"
              >
                <Link href="/login">Login</Link>
              </Button>

              <Button
            
                className="rounded-full bg-[#087f75] px-6 font-semibold text-white shadow-md hover:bg-[#066a62]"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          ) : (
            /* PROFILE DROPDOWN */
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="outline"
                  className="gap-2 rounded-full border-slate-200 px-2 dark:border-slate-700"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.image || ""}
                      alt={user.name || "User"}
                    />
                    <AvatarFallback className="bg-teal-100 text-teal-800">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <span className="max-w-24 truncate text-sm font-semibold">
                    {user.name || "Reader"}
                  </span>

                  <ChevronDown size={15} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 rounded-xl p-2">
                <DropdownMenuLabel>
                  <p className="font-bold">{user.name || "Reader"}</p>
                  <p className="mt-1 truncate text-xs font-normal text-muted-foreground">
                    {user.email}
                  </p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <Link href="/profile" className="cursor-pointer">
                    <UserRound className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={onLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* MOBILE NAVIGATION */}
        <div className="flex items-center gap-2 xl:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-xl"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-[#087f75]" />
            )}
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger>
              <Button
                variant="default"
                size="icon"
                className="rounded-xl bg-[#087f75] text-white hover:bg-[#066a62]"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] overflow-y-auto sm:w-[350px]"
            >
              <SheetHeader className="border-b pb-5 text-left">
                <SheetTitle className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                    <Image
                      src="/novelnest-logo.jpg"
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

              {/* MOBILE LINKS */}
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

              {/* MOBILE AUTH */}
              {!user ? (
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <Button variant="outline" className="rounded-full">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      Login
                    </Link>
                  </Button>

                  <Button
                
                    className="rounded-full bg-[#087f75] hover:bg-[#066a62]"
                  >
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      Register
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="mt-8 border-t pt-5">
                  <div className="mb-4 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600"
                    onClick={() => {
                      setMobileOpen(false);
                      onLogout?.();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              )}

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
