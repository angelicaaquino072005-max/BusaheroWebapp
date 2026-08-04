"use client";

import { usePathname } from "next/navigation";
import { titleForPath } from "@/lib/nav";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-brand px-4 py-3.5 text-white sm:px-6">
      <h1 className="truncate text-base font-semibold sm:text-lg">
        {titleForPath(pathname)}
      </h1>
    </header>
  );
}