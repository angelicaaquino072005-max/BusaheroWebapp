"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { titleForPath } from "@/lib/nav";
import { IconMenu, IconHelpCircle } from "@/components/Icons";

export default function Header({ onMenuClick }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-3 border-b border-slate-200 bg-brand px-4 text-white sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-label="Open menu"
          onClick={onMenuClick}
          className="rounded-md p-1.5 hover:bg-white/10 lg:hidden"
        >
          <IconMenu size={22} />
        </button>
        <h1 className="truncate text-base font-semibold sm:text-lg">
          {titleForPath(pathname)}
        </h1>
      </div>

      <Link
        href="/how-to-use"
        aria-label="How to use BUSahero"
        title="How to use BUSahero"
        className={`shrink-0 rounded-full p-1.5 transition-colors hover:bg-white/10 ${
          pathname === "/how-to-use" ? "bg-white/15" : ""
        }`}
      >
        <IconHelpCircle size={22} />
      </Link>
    </header>
  );
}