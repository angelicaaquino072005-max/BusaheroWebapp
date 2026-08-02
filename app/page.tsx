"use client";

import dynamic from "next/dynamic";

const BusMap = dynamic(() => import("@/components/BusMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
      Loading live map…
    </div>
  ),
});

export default function LiveTrackingPage() {
  return (
    <div className="relative h-[calc(100dvh-64px)] w-full lg:h-full">
      <BusMap />

      {/* Live updates pill */}
      <div className="absolute bottom-4 left-4 z-[400] flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-lg">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        Live Updates: On
      </div>
    </div>
  );
}