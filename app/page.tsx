"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { busLines } from "@/lib/data";

const BusMap = dynamic(() => import("@/components/BusMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
      Loading live map…
    </div>
  ),
});

export default function LiveTrackingPage() {
  const [visibleLines, setVisibleLines] = useState(busLines.map((l) => l.id));

  const toggleLine = (id) => {
    setVisibleLines((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  return (
    <div className="relative h-[calc(100dvh-64px)] w-full lg:h-full">
      <BusMap visibleLines={visibleLines} />

      {/* Bus lines legend */}
      <div className="absolute right-4 top-4 z-[400] w-52 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
        <p className="mb-3 text-sm font-semibold text-slate-800">Bus Lines</p>
        <div className="space-y-2.5">
          {busLines.map((line) => (
            <label
              key={line.id}
              className="flex cursor-pointer items-center justify-between gap-2 text-sm text-slate-600"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: line.color }}
                />
                {line.name}
              </span>
              <input
                type="checkbox"
                checked={visibleLines.includes(line.id)}
                onChange={() => toggleLine(line.id)}
                className="h-4 w-4 accent-brand"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Live updates pill */}
      <div className="absolute bottom-4 left-4 z-[400] flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-lg">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        Live Updates: On
      </div>
    </div>
  );
}
