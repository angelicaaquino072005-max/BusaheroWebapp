"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { titleForPath } from "@/lib/nav";
import { IconMenu, IconBell, IconChevronDown, IconUserCircle } from "@/components/Icons";

export default function Header({ onMenuClick }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-brand px-4 py-3.5 text-white sm:px-6">
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

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          aria-label="Notifications"
          className="relative rounded-full p-2 hover:bg-white/10"
        >
          <IconBell size={20} />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
            3
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-white/10"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand">
              <IconUserCircle size={20} />
            </span>
            <span className="hidden text-sm font-medium sm:inline">Hi, Commuter!</span>
            <IconChevronDown size={16} />
          </button>

          {menuOpen && (
            <>
              <button
                aria-hidden
                tabIndex={-1}
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-slate-100 bg-white p-2 text-slate-700 shadow-lg">
                <p className="px-3 py-2 text-xs text-slate-400">
                  You're browsing as a guest — no account needed.
                </p>
                <div className="my-1 border-t border-slate-100" />
                <a
                  href="/about"
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50"
                  onClick={() => setMenuOpen(false)}
                >
                  About BUSahero
                </a>
                <a
                  href="/privacy-policy"
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Privacy Policy
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
