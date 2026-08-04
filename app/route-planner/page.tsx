"use client";

import { useMemo, useState } from "react";
import { useLiveBuses } from "@/lib/useLiveBuses";
import { getBusRouteProgress } from "@/lib/routeProgress";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconBuilding,
  IconRefresh,
} from "@/components/Icons";

const statusStyles = {
  DEPARTED: "bg-emerald-50 text-emerald-600",
  ARRIVING: "bg-amber-50 text-amber-600",
  UPCOMING: "bg-slate-100 text-slate-500",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {status === "DEPARTED" && "✓ "}
      {status}
    </span>
  );
}

function LegRow({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          accent ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-brand"
        }`}
      >
        <Icon size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="truncate text-sm font-semibold text-slate-800">{value ?? "—"}</p>
      </div>
    </div>
  );
}

export default function RoutePlannerPage() {
  const { buses, loading } = useLiveBuses();
  const [index, setIndex] = useState(0);
  const [openStop, setOpenStop] = useState(null);
  const [showUpcoming, setShowUpcoming] = useState(false);

  // Only buses with a usable GPS fix can be projected onto the route.
  const trackedBuses = useMemo(
    () => buses.filter((b) => typeof b.lat === "number" && typeof b.lng === "number"),
    [buses]
  );

  const safeIndex = trackedBuses.length ? index % trackedBuses.length : 0;
  const bus = trackedBuses[safeIndex] ?? null;

  const progress = useMemo(() => {
    if (!bus) return null;
    return getBusRouteProgress(bus.lat, bus.lng, bus.direction);
  }, [bus]);

  const go = (delta) => {
    if (!trackedBuses.length) return;
    setIndex((prev) => (prev + delta + trackedBuses.length) % trackedBuses.length);
    setOpenStop(null);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6">
        <p className="text-sm text-slate-500">Connecting to live bus data…</p>
      </div>
    );
  }

  if (!bus || !progress) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6">
        <p className="text-sm text-slate-500">
          No buses are currently broadcasting a live location. Check back once a trip is
          underway.
        </p>
      </div>
    );
  }

  const isStopped = String(bus.status ?? "").toLowerCase() === "stopped";
  const hasSpeed = typeof bus.speedKph === "number" && Number.isFinite(bus.speedKph);

  // History = towns already passed or currently near. Everything further
  // ahead on the corridor is kept out of the main list — this page is a
  // trail of where the bus has been this trip, not a forward itinerary.
  const passedStops = progress.stops.filter((s) => s.status !== "UPCOMING");
  const upcomingStops = progress.stops.filter((s) => s.status === "UPCOMING");

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => go(-1)}
            aria-label="Previous bus"
            disabled={trackedBuses.length < 2}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-30"
          >
            <IconChevronLeft size={22} />
          </button>

          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800">
              {safeIndex + 1} of {trackedBuses.length} • {bus.label}
            </p>
            <div className="mt-2 flex items-center justify-center gap-2 rounded-full bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-700">
              {progress.origin}
              <span className="text-brand">→</span>
              {progress.destination}
            </div>
            <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand">
              {progress.directionLabel}
            </span>
          </div>

          <button
            onClick={() => go(1)}
            aria-label="Next bus"
            disabled={trackedBuses.length < 2}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-30"
          >
            <IconChevronRight size={22} />
          </button>
        </div>

        {/* Trip progress bar */}
        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
            <span>Trip progress</span>
            <span>{progress.percent}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100">
            <div
              className="h-1.5 rounded-full bg-brand transition-all"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>

        {/* Current position + speed, derived from live GPS */}
        <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-100">
          <LegRow
            icon={IconBuilding}
            label="Currently Near"
            value={progress.currentMunicipality}
            accent
          />
          <LegRow
            icon={IconRefresh}
            label="Speed"
            value={
              isStopped
                ? "Stopped"
                : hasSpeed
                ? `${bus.speedKph} km/h`
                : "Speed data unavailable"
            }
          />
        </div>

        {/* Trip history — towns already passed this trip, in order */}
        <h3 className="mb-2 mt-6 text-sm font-semibold text-slate-700">
          Towns Passed This Trip
        </h3>
        <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-100">
          {passedStops.length === 0 && (
            <p className="px-4 py-4 text-xs text-slate-400">
              {bus.label} hasn't reached its first tracked town yet.
            </p>
          )}
          {passedStops.map((stop) => {
            const isOpen = openStop === stop.id;
            return (
              <div key={stop.id}>
                <button
                  onClick={() => setOpenStop(isOpen ? null : stop.id)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50"
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      stop.status === "ARRIVING" ? "bg-amber-400" : "bg-brand"
                    }`}
                  />
                  <span className="flex-1 text-sm font-medium text-slate-800">
                    {stop.name}
                  </span>
                  <StatusBadge status={stop.status} />
                  <IconChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="bg-slate-50 px-11 pb-3 text-xs text-slate-500">
                    {stop.status === "DEPARTED" && "The bus has already passed this municipality."}
                    {stop.status === "ARRIVING" && "The bus is near this municipality right now."}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Not-yet-reached towns, tucked away since this page is about history */}
        {upcomingStops.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowUpcoming((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-left text-xs font-medium text-slate-400 hover:bg-slate-50"
            >
              <span>{upcomingStops.length} town(s) not yet reached</span>
              <IconChevronDown
                size={14}
                className={`transition-transform ${showUpcoming ? "rotate-180" : ""}`}
              />
            </button>
            {showUpcoming && (
              <div className="mt-2 space-y-1.5 px-1">
                {upcomingStops.map((stop) => (
                  <div
                    key={stop.id}
                    className="flex items-center gap-3 px-3 py-2 text-xs text-slate-400"
                  >
                    <span className="h-2 w-2 rounded-full bg-slate-200" />
                    {stop.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="mt-4 text-center text-xs text-slate-400">
          Last updated {bus.lastUpdateMinutesAgo === 0 ? "just now" : `${bus.lastUpdateMinutesAgo}m ago`}
        </p>
      </div>
    </div>
  );
}