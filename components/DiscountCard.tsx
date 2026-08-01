"use client";

import { IconTag } from "@/components/Icons";
import { useDiscount } from "@/components/DiscountContext";

export default function DiscountCard({ className = "" }) {
  const { discountApplied, setDiscountApplied } = useDiscount();

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 ${className}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
        <IconTag size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">
          Apply 20% Discount
        </p>
        <p className="truncate text-xs text-slate-500">Regular Passenger</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={discountApplied}
        onClick={() => setDiscountApplied((v) => !v)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          discountApplied ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            discountApplied ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
