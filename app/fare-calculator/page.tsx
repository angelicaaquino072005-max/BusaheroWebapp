"use client";

import { useEffect, useState } from "react";
import { municipalities, estimateDistanceKm } from "@/lib/data";
import { useDiscount } from "@/components/DiscountContext";
import { useFareSettings } from "@/hook/useFareSettings";
import DiscountCard from "@/components/DiscountCard";
import { IconBuilding, IconInfo } from "@/components/Icons";

function peso(n) {
  return `₱${n.toFixed(2)}`;
}

export default function FareCalculatorPage() {
  const [originId, setOriginId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [hasCalculated, setHasCalculated] = useState(false);
  const [result, setResult] = useState(null);
  const { discountApplied } = useDiscount();
  const { fareSettings, loading } = useFareSettings();

  const runCalculation = () => {
    if (!originId || !destinationId || originId === destinationId) {
      setResult(null);
      return;
    }
    const km = estimateDistanceKm(originId, destinationId);
    const { baseDistanceKm, baseFare, perKmRate, discountPercent } = fareSettings;

    const base =
      km <= baseDistanceKm
        ? baseFare
        : baseFare + (km - baseDistanceKm) * perKmRate;

    const discount = discountApplied ? base * (discountPercent / 100) : 0;
    setResult({ km, base, discount, total: base - discount, discountPercent });
  };

  const handleCalculateClick = () => {
    setHasCalculated(true);
    runCalculation();
  };

  // Auto-recompute whenever discount toggle, live fareSettings, or the
  // selected trip changes — but only after the user has calculated once.
  useEffect(() => {
    if (hasCalculated) {
      runCalculation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountApplied, fareSettings, originId, destinationId]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-800">Fare Calculator</h2>
        <p className="text-sm text-slate-500">Calculate the estimated fare for your trip.</p>
        {loading && (
          <p className="mt-1 text-xs text-slate-400">Loading current fare rates…</p>
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

        <div className="mt-4">
          <DiscountCard />
        </div>

        <button
          onClick={handleCalculateClick}
          className="mt-4 w-full rounded-xl bg-blue-50 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
        >
          Calculate Fare
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
        <h3 className="mb-4 text-base font-semibold text-brand">Fare Breakdown</h3>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="text-sm font-medium text-slate-700">Base Fare</p>
                <p className="text-xs text-slate-400">
                  {result ? `${result.km} km · Regular Fare` : "Regular Fare"}
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {peso(result?.base ?? 0)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Discount ({result?.discountPercent ?? fareSettings.discountPercent}%)
                </p>
                <p className="text-xs text-slate-400">Regular Passenger Discount</p>
              </div>
              <p className="text-sm font-semibold text-emerald-600">
                −{peso(result?.discount ?? 0)}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-xl bg-blue-50 px-6 py-5 text-center">
            <p className="text-sm text-brand">Total Fare</p>
            <p className="text-3xl font-bold text-brand">{peso(result?.total ?? 0)}</p>
            <p className="mt-1 text-xs text-brand/70">
              {discountApplied ? "Regular Passenger (discounted)" : "Regular Passenger"}
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

function MunicipalitySelect({ label, value, onChange, exclude }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-500">{label}</label>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-brand">
        <IconBuilding size={17} className="shrink-0 text-slate-400" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-700 outline-none"
        >
          <option value="">Select {label}</option>
          {municipalities
            .filter((m) => m.id !== exclude)
            .map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}