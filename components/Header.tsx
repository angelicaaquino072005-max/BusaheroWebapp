"use client";

import { usePathname } from "next/navigation";
import { titleForPath } from "@/lib/nav";
import { IconMenu } from "@/components/Icons";

export default function Header({ onMenuClick }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-brand px-4 py-3.5 text-white sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-label="Toggle menu"
          onClick={onMenuClick}
          className="rounded-md p-1.5 hover:bg-white/10"
        >
          <IconMenu size={22} />
        </button>
        <h1 className="truncate text-base font-semibold sm:text-lg">
          {titleForPath(pathname)}
        </h1>
      </div>
    </header>
  );
}