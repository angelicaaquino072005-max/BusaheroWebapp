"use client";

import { useState } from "react";
import { seatTrips } from "@/lib/data";
import { IconChevronDown, IconSeat, IconClock } from "@/components/Icons";

function SeatGrid({ trip }) {
  const [selected, setSelected] = useState([]);
  const seats = Array.from({ length: trip.totalSeats }, (_, i) => i + 1);

  const toggle = (seatNum) => {
    if (trip.occupied.includes(seatNum)) return;
    setSelected((prev) =>
      prev.includes(seatNum) ? prev.filter((s) => s !== seatNum) : [...prev, seatNum]
    );
  };

  return (
    <div className="border-t border-slate-100 bg-slate-50 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap gap-4 text-xs text-slate-500">
        <LegendDot color="bg-slate-200" label="Available" />
        <LegendDot color="bg-slate-400" label="Occupied" />
        <LegendDot color="bg-brand" label="Selected" />
      </div>

      <div className="mx-auto grid max-w-xs grid-cols-4 gap-2">
        {seats.map((num) => {
          const occupied = trip.occupied.includes(num);
          const isSelected = selected.includes(num);
          return (
            <button
              key={num}
              disabled={occupied}
              onClick={() => toggle(num)}
              className={`flex h-9 items-center justify-center rounded-md text-[11px] font-semibold transition-colors ${
                occupied
                  ? "cursor-not-allowed bg-slate-300 text-slate-500"
                  : isSelected
                  ? "bg-brand text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand"
              } ${num % 4 === 2 ? "mr-3" : ""}`}
            >
              {num}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        {selected.length > 0
          ? `${selected.length} seat${selected.length > 1 ? "s" : ""} selected`
          : "Tap an available seat to preview a selection"}
      </p>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded-sm ${color}`} />
      {label}
    </span>
  );
}

export default function SeatAvailabilityPage() {
  const [openTrip, setOpenTrip] = useState(seatTrips[0].id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <p className="mb-4 text-sm text-slate-500">
        Check estimated seat availability before your trip.
      </p>

      <div className="space-y-3">
        {seatTrips.map((trip) => {
          const available = trip.totalSeats - trip.occupied.length;
          const pct = Math.round((available / trip.totalSeats) * 100);
          const isOpen = openTrip === trip.id;

          return (
            <div
              key={trip.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
            >
              <button
                onClick={() => setOpenTrip(isOpen ? null : trip.id)}
                className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: trip.color }}
                >
                  <IconSeat size={20} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{trip.line}</p>
                  <p className="truncate text-xs text-slate-500">
                    {trip.from} → {trip.to}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <IconClock size={13} /> Departs {trip.departure}
                  </p>
                </div>

                <div className="hidden w-32 shrink-0 sm:block">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>{available} open</span>
                    <span>{trip.totalSeats}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100">
                    <div
                      className="h-1.5 rounded-full bg-emerald-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <IconChevronDown
                  size={18}
                  className={`shrink-0 text-slate-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div className="px-4 pb-2 sm:hidden">
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>{available} seats open</span>
                  <span>of {trip.totalSeats}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className="h-1.5 rounded-full bg-emerald-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {isOpen && <SeatGrid trip={trip} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
