"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { primaryNav, infoNav } from "@/lib/nav";
import { IconX } from "@/components/Icons";

function SectionLabel({ children }) {
  return (
    <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-blue-300/70">
      {children}
    </p>
  );
}

function NavItem({ item, pathname, onNavigate }) {
  const active = pathname === item.href;
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-white/10 text-white"
          : "text-blue-100/80 hover:bg-white/5 hover:text-white"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-emerald-400" />
      )}
      <Icon size={19} className={active ? "text-white" : "text-blue-200/60"} />
      <span className={`truncate ${active ? "font-semibold" : ""}`}>{item.label}</span>
    </Link>
  );
}

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile scrim */}
      {open && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-[1000] bg-slate-900/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[1010] flex w-72 flex-col bg-brand-dark transition-transform duration-200 lg:static lg:z-0 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between gap-2 border-b border-white/10 px-5">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <Image
              src="/busahero-logo.jpg"
              alt="BUSahero"
              width={220}
              height={220}
              className="h-10 w-10 shrink-0 rounded-lg object-contain"
            />
            <div className="leading-tight">
              <p className="text-lg font-bold tracking-tight text-white">
                BUS<span className="font-light">ahero</span>
              </p>
            </div>
          </Link>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-md p-1 text-white/70 hover:bg-white/10 lg:hidden"
          >
            <IconX size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {/* Primary nav — desktop only, mobile already has the bottom tab bar for these */}
          <div className="hidden lg:block">
            <SectionLabel>Main</SectionLabel>
            <div className="space-y-1">
              {primaryNav.map((item) => (
                <NavItem key={item.href} item={item} pathname={pathname} onNavigate={onClose} />
              ))}
            </div>
          </div>

          <div className="mt-6 hidden lg:block" />

          {/* Info nav — always shown, this is what mobile sees */}
          <SectionLabel>About BUSahero</SectionLabel>
          <div className="space-y-1">
            {infoNav.map((item) => (
              <NavItem key={item.href} item={item} pathname={pathname} onNavigate={onClose} />
            ))}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="text-center text-xs text-blue-300/50">BUSahero v1.0</p>
        </div>
      </aside>
    </>
  );
}