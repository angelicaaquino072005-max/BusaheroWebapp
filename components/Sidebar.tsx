"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { primaryNav, infoNav } from "@/lib/nav";
import { IconX } from "@/components/Icons";

function NavItem({ item, pathname, onNavigate }) {
  const active = pathname === item.href;
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-blue-50 text-brand"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <Icon size={19} className={active ? "text-brand" : "text-slate-400"} />
      <span className="truncate">{item.label}</span>
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
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:z-0 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-brand px-5 py-5">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <Image
              src="/busahero-logo.jpg"
              alt="BUSahero"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="text-lg font-bold tracking-tight text-white">
              BUS<span className="font-light">ahero</span>
            </span>
          </Link>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-md p-1 text-white/80 hover:bg-white/10 lg:hidden"
          >
            <IconX size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {primaryNav.map((item) => (
              <NavItem key={item.href} item={item} pathname={pathname} onNavigate={onClose} />
            ))}
          </div>

          <div className="my-4 border-t border-slate-100" />

          <div className="space-y-1">
            {infoNav.map((item) => (
              <NavItem key={item.href} item={item} pathname={pathname} onNavigate={onClose} />
            ))}
          </div>
        </nav>

        <div className="space-y-3 border-t border-slate-100 p-4">
          <p className="text-center text-xs text-slate-400">BUSahero v1.0</p>
        </div>
      </aside>
    </>
  );
}