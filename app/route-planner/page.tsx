"use client";

import { useState } from "react";
import { plannerRoutes } from "@/lib/data";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconBuilding,
  IconMap,
  IconFlag,
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

export default function RoutePlannerPage() {
  const [index, setIndex] = useState(0);
  const [openStop, setOpenStop] = useState(null);
  const route = plannerRoutes[index];

  const go = (delta) => {
    setIndex((prev) => (prev + delta + plannerRoutes.length) % plannerRoutes.length);
    setOpenStop(null);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => go(-1)}
            aria-label="Previous route"
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
          >
            <IconChevronLeft size={22} />
          </button>

          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800">
              {index + 1} of {plannerRoutes.length} • {route.label}
            </p>
            <div className="mt-2 flex items-center justify-center gap-2 rounded-full bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-700">
              {route.origin}
              <span className="text-brand">→</span>
              {route.destination}
            </div>
            <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand">
              {route.direction}
            </span>
          </div>

          <button
            onClick={() => go(1)}
            aria-label="Next route"
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
          >
            <IconChevronRight size={22} />
          </button>
        </div>

        {/* Current / next leg detail */}
        <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-100">
          <LegRow icon={IconBuilding} label="Current Municipality" value={route.currentMunicipality} status="DEPARTED" />
          <LegRow icon={IconMap} label="Current Barangay" value={route.currentBarangay} status="DEPARTED" />
          <LegRow icon={IconChevronRight} label="Next Barangay" value={route.nextBarangay} status="DEPARTED" accent />
          <LegRow icon={IconFlag} label="Next Municipality" value={route.nextMunicipality} status="DEPARTED" />
        </div>

        {/* Full stop list */}
        <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-100">
          {route.stops.map((stop) => {
            const isOpen = openStop === stop.name;
            return (
              <div key={stop.name}>
                <button
                  onClick={() => setOpenStop(isOpen ? null : stop.name)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50"
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      stop.status === "UPCOMING" ? "bg-slate-300" : "bg-brand"
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
                    {stop.status === "DEPARTED" && "The bus has already left this stop."}
                    {stop.status === "ARRIVING" && "The bus is approaching this stop now."}
                    {stop.status === "UPCOMING" && "The bus has not reached this stop yet."}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LegRow({ icon: Icon, label, value, status, accent }) {
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
        <p className="truncate text-sm font-semibold text-slate-800">{value}</p>
      </div>
      <StatusBadge status={status} />
      <IconChevronDown size={16} className="hidden text-slate-300 sm:block" />
    </div>
  );
}
