"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, infoNav } from "@/lib/nav";
import { IconSettings, IconX } from "@/components/Icons";

const shortLabel = {
  "Live Tracking": "Map",
  "Route Planner": "Route",
  "Fare Calculator": "Fare",
};

export default function MobileTabBar() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
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

        <button
          onClick={() => setSettingsOpen(true)}
          className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium ${
            settingsOpen ? "text-brand" : "text-slate-400"
          }`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full">
            <IconSettings size={19} />
          </span>
          Settings
        </button>
      </nav>

      {settingsOpen && (
        <>
          <button
            aria-label="Close settings"
            onClick={() => setSettingsOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          />
          <div className="fixed inset-x-0 bottom-0 z-40 rounded-t-2xl border-t border-slate-200 bg-white p-4 pb-6 shadow-2xl lg:hidden">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">Settings</p>
              <button
                aria-label="Close"
                onClick={() => setSettingsOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-50"
              >
                <IconX size={18} />
              </button>
            </div>
            <div className="space-y-1">
              {infoNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSettingsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Icon size={19} className="text-slate-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}