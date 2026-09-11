"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useLiveBuses } from "@/lib/useLiveBuses";
import { buildRouteProgress } from "@/lib/routePlanner";
import { IconChevronLeft, IconChevronRight } from "@/components/Icons";

// Each bus renders its own map instance, so this is dynamically imported
// with ssr disabled the same way the Live Tracking map is — Leaflet needs
// direct access to `window`, which isn't available during server render.
const RouteProgressMap = dynamic(() => import("@/components/RouteProgressMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-xs text-slate-400 sm:h-[560px]">
      Loading map…
    </div>
  ),
});

export default function RoutePlannerPage() {
  const { buses, loading } = useLiveBuses();
  const [index, setIndex] = useState(0);

  // Remembers each bus's last known nearest-stop index across renders,
  // so direction can be inferred from real movement instead of trusting
  // a manually-set Firebase field.
  const lastIndexRef = useRef<Record<string, number>>({});

  const routes = buses
    .map((bus) => {
      const result = buildRouteProgress(bus, lastIndexRef.current[bus.id]);
      if (!result) return null;
      lastIndexRef.current[bus.id] = result.nearestIndex;
      return result.progress;
    })
    .filter(Boolean);

  // Looked up per render so each bus's card can pass its own live
  // lat/lng to its own map instance below.
  const busById = Object.fromEntries(buses.map((bus) => [bus.id, bus]));

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-sm text-slate-400 sm:px-6">
        Connecting to live bus data…
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-sm text-slate-400 sm:px-6">
        No buses are currently online.
      </div>
    );
  }

  const safeIndex = Math.min(index, routes.length - 1);
  const route = routes[safeIndex];

  const go = (delta) => {
    setIndex((prev) => (prev + delta + routes.length) % routes.length);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => go(-1)}
            aria-label="Previous route"
            disabled={routes.length <= 1}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-30"
          >
            <IconChevronLeft size={22} />
          </button>

          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800">
              {safeIndex + 1} of {routes.length} • {route.label}
            </p>
            {route.isSpecialTrip ? (
              <span className="mt-2 inline-block rounded-full bg-purple-50 px-4 py-1.5 text-sm font-semibold text-purple-700">
                🎫 On Special Trip
              </span>
            ) : (
              <>
                <div className="mt-2 flex items-center justify-center gap-2 rounded-full bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-700">
                  {route.origin}
                  <span className="text-brand">→</span>
                  {route.destination}
                </div>
                <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand">
                  {route.direction}
                </span>
              </>
            )}
          </div>

          <button
            onClick={() => go(1)}
            aria-label="Next route"
            disabled={routes.length <= 1}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-30"
          >
            <IconChevronRight size={22} />
          </button>
        </div>

        <div className="mt-5">
          <RouteProgressMap
            key={route.busId}
            stops={route.stops}
            isSpecialTrip={route.isSpecialTrip}
            bus={{
              lat: busById[route.busId]?.lat ?? null,
              lng: busById[route.busId]?.lng ?? null,
              label: route.label,
              direction: route.isSpecialTrip ? undefined : route.direction,
            }}
          />
        </div>
      </div>
    </div>
  );
}