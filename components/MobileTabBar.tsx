"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav } from "@/lib/nav";

const shortLabel = {
  "Live Tracking": "Map",
  "Route Planner": "Route",
  "Fare Calculator": "Fare",
};

export default function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 z-20 flex border-t border-slate-200 bg-white lg:hidden">
      {primaryNav.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium ${
              active ? "text-brand" : "text-slate-400"
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                active ? "bg-blue-50" : ""
              }`}
            >
              <Icon size={19} />
            </span>
            {shortLabel[item.label]}
          </Link>
        );
      })}
    </nav>
  );
}