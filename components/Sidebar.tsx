"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { primaryNav, infoNav } from "@/lib/nav";

function NavItem({ item, pathname }) {
  const active = pathname === item.href;
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-brand px-5 py-5">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/busahero-logo.jpg"
            alt="BUSahero"
            width={220}
            height={220}
            className="h-10 w-10 shrink-0 rounded-lg object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-white">
            BUS<span className="font-light">ahero</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {primaryNav.map((item) => (
            <NavItem key={item.href} item={item} pathname={pathname} />
          ))}
        </div>

        <div className="my-4 border-t border-slate-100" />

        <div className="space-y-1">
          {infoNav.map((item) => (
            <NavItem key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      </nav>

      <div className="space-y-3 border-t border-slate-100 p-4">
        <p className="text-center text-xs text-slate-400">BUSahero v1.0</p>
      </div>
    </aside>
  );
}