"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { SignedIn, UserButton } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const ThemeSwitcher = dynamic(
  () => import("./ThemeSwitcher").then((mod) => mod.ThemeSwitcher),
  {
    loading: () => (
      <Skeleton className="h-9 w-full min-w-[100px] rounded-md md:w-9" />
    ),
    ssr: false,
  }
);

export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 rounded-lg bg-white/70 backdrop-blur-md dark:bg-gray-900/70">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/static/logo.svg"
              alt="Revify Logo"
              width={32}
              height={32}
            />
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
