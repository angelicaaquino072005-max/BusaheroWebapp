//app/fare-calculator/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useFareSettings } from "@/lib/useFareSettings";
import { getFareBreakdown, formatPeso } from "@/lib/fareCalculator";
import { TOWN_ROUTES, getDistanceBetween } from "@/lib/routeDistances";
import { IconBuilding, IconInfo } from "@/components/Icons";

// TOWN_ROUTES gives { id, town, municipality } — MunicipalitySelect below
// expects { id, name, municipality } so the dropdown can group stops under
// their municipality (matches the grouped selects on the Fares page).
const municipalities = TOWN_ROUTES.map((r) => ({
  id: r.id,
  name: r.town,
  municipality: r.municipality,
}));

function peso(n) {
  return formatPeso(n);
}

export default function FareCalculatorPage() {
  const [originId, setOriginId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const { settings: fareSettings, loading } = useFareSettings();

  const isSamePlace = originId && originId === destinationId;

  const km = useMemo(() => {
    if (!originId || !destinationId || isSamePlace) return null;

    try {
      return getDistanceBetween(originId, destinationId);
    } catch (err) {
      console.error("Fare calculator: unknown stop id", err);
      return null;
    }
  }, [originId, destinationId, isSamePlace]);

  const breakdown =
    km !== null && !loading ? getFareBreakdown(km, fareSettings) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Fare Calculator
        </h2>
        <p className="text-sm text-slate-500">
          Select your origin and destination to see the estimated fare.
        </p>
        {loading && (
          <p className="mt-1 text-xs text-slate-400">
            Loading current fare rates…
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <MunicipalitySelect
            label="Origin Municipality"
            value={originId}
            onChange={setOriginId}
            exclude={destinationId}
          />
          <MunicipalitySelect
            label="Destination Municipality"
            value={destinationId}
            onChange={setDestinationId}
            exclude={originId}
          />
        </div>

        {isSamePlace && (
          <p className="mt-4 text-xs text-slate-400">
            Select two different municipalities to calculate a fare.
          </p>
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
        <h3 className="mb-4 text-base font-semibold text-brand">
          Fare Breakdown
        </h3>

        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <p className="text-sm font-medium text-slate-700">Distance</p>
            <p className="text-xs text-slate-400">
              {breakdown ? "Estimated route distance" : "Select a trip above"}
            </p>
          </div>
          <p className="text-sm font-semibold text-slate-800">
            {breakdown ? `${breakdown.distanceKm} km` : "—"}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-blue-50 px-6 py-5 text-center">
            <p className="text-sm text-brand">Regular Fare</p>
            <p className="text-3xl font-bold text-brand">
              {breakdown ? peso(breakdown.regular) : "—"}
            </p>
          </div>

          <div className="rounded-xl bg-emerald-50 px-6 py-5 text-center">
            <p className="text-sm text-emerald-700">Student / Elderly / PWD</p>
            <p className="text-3xl font-bold text-emerald-600">
              {breakdown ? peso(breakdown.discounted) : "—"}
            </p>
            <p className="mt-1 text-xs text-emerald-700/70">
              {fareSettings.discountPercent}% discount applied
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
          <IconInfo size={16} className="mt-0.5 shrink-0 text-slate-400" />
          Fares are estimates only and may vary.
        </div>
      </div>
    </div>
  );
}

// municipalities is already ordered Olongapo -> Santa Cruz (from
// ZAMBALES_CORRIDOR), so grouping just needs to bucket consecutive stops
// that share a municipality — no separate sort/lookup needed.
function groupByMunicipality(stops) {
  const groups = [];

  for (const stop of stops) {
    const last = groups[groups.length - 1];

    if (last && last.municipality === stop.municipality) {
      last.stops.push(stop);
    } else {
      groups.push({ municipality: stop.municipality, stops: [stop] });
    }
  }

  return groups;
}

function MunicipalitySelect({ label, value, onChange, exclude }) {
  const groups = groupByMunicipality(
    municipalities.filter((m) => m.id !== exclude)
  );

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-500">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-brand">
        <IconBuilding size={17} className="shrink-0 text-slate-400" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-700 outline-none"
        >
          <option value="">Select {label}</option>
          {groups.map((group) => (
            <optgroup key={group.municipality} label={group.municipality}>
              {group.stops.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    </div>
  );
}
