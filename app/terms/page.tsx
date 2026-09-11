import { IconFileText } from "@/components/Icons";
import { termsClauses } from "@/lib/termsContent";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <h2 className="mb-4 text-xl font-bold text-slate-800">Terms & Conditions</h2>

      <div className="mb-6 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card md:grid-cols-[auto_1fr]">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-brand">
          <IconFileText size={26} />
        </span>
        <div>
          <h3 className="mb-1 text-base font-semibold text-slate-800">Acceptance of Terms</h3>
          <p className="text-sm leading-relaxed text-slate-600">
            By using the BUSahero application, you agree to comply with these Terms and
            Conditions. If you do not agree with any part of these terms, please
            discontinue use of the application.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {termsClauses.map((c, i) => (
          <div key={c.title} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-brand">
              <c.icon size={19} />
            </span>
            <h4 className="mb-1.5 pr-6 text-sm font-semibold text-slate-800">{c.title}</h4>
            <p className="text-xs leading-relaxed text-slate-500">{c.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm font-medium text-brand">Effective Date: July 2026</p>
    </div>
  );
}