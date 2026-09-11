"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconFileText } from "@/components/Icons";
import { termsClauses } from "@/lib/termsContent";

const STORAGE_KEY = "busahero_terms_accepted";

// A hard gate shown on first launch, before the onboarding tour —
// unlike OnboardingTour, this one can't be dismissed without agreeing.
// It shares the same localStorage-on-mount pattern as OnboardingTour,
// and since it renders with a higher z-index, it naturally sits in
// front of the tour until it's closed, giving a "Terms first, then
// walkthrough" first-launch sequence without any extra coordination
// between the two components.
export default function TermsGate() {
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    try {
      const accepted = window.localStorage.getItem(STORAGE_KEY);
      if (!accepted) setVisible(true);
    } catch {
      // localStorage unavailable — skip the gate rather than block
      // everyone from using the app.
    }
  }, []);

  if (!visible) return null;

  const agree = () => {
    if (!checked) {
      setShowNudge(true);
      return;
    }
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-[2100] flex flex-col bg-slate-50">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-brand">
          <IconFileText size={20} />
        </span>
        <div>
          <h2 className="text-base font-bold text-slate-800">Terms & Conditions</h2>
          <p className="text-xs text-slate-500">Please review before using BUSahero.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
        <p className="mb-5 text-sm leading-relaxed text-slate-600">
          By using the BUSahero application, you agree to comply with these Terms and
          Conditions. If you do not agree with any part of these terms, please
          discontinue use of the application.
        </p>

        <div className="space-y-3">
          {termsClauses.map((c, i) => (
            <div
              key={c.title}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-brand">
                <c.icon size={17} />
              </span>
              <div className="min-w-0">
                <h4 className="mb-1 text-sm font-semibold text-slate-800">
                  {i + 1}. {c.title}
                </h4>
                <p className="text-xs leading-relaxed text-slate-500">{c.body}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Read the full{" "}
          <Link href="/terms" className="font-medium text-brand underline">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="font-medium text-brand underline">
            Privacy Policy
          </Link>{" "}
          anytime from the sidebar.
        </p>
      </div>

      <div className="border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
        <label className="mb-3 flex cursor-pointer items-start gap-2.5 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
              if (e.target.checked) setShowNudge(false);
            }}
            className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
          />
          I have read and agree to the Terms & Conditions and Privacy Policy.
        </label>

        {showNudge && (
          <p className="mb-3 text-xs font-medium text-red-500">
            Please check the box above to continue — agreeing to the Terms is required to
            use BUSahero.
          </p>
        )}

        <button
          onClick={agree}
          className={`w-full rounded-full py-3 text-sm font-semibold text-white shadow-lg transition-colors ${
            checked ? "bg-brand hover:bg-brand-dark" : "bg-slate-300"
          }`}
        >
          I Agree & Continue
        </button>
      </div>
    </div>
  );
}