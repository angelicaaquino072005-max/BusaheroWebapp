import BusIllustration from "@/components/BusIllustration";
import { IconGraduation, IconBook, IconCalendar, IconUserCircle } from "@/components/Icons";

const developers = [
  { name: "Angelica Aquino", role: "UI/UX Designer" },
  { name: "Krizia Mae F. Funiestas", role: "Lead Developer" },
  { name: "Daisy Ann M. Magno", role: "Documentation" },
  { name: "Rhonielyn Mhei B. Tolentino", role: "System Analyst" },
  { name: "Rowela Gongora, MCS", role: "Thesis Adviser" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card md:grid-cols-2 md:items-center">
        <div>
          <h2 className="mb-3 text-lg font-bold text-slate-800">About the Application</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            BUSahero is a web-based real-time bus tracking and arrival estimation
            application developed to help commuters monitor bus locations, estimate
            arrival times, check seat availability, and calculate fares for trips
            between Olongapo City and Zambales.
          </p>
        </div>
        <BusIllustration className="w-full" />
      </div>

      <h3 className="mb-4 mt-8 text-base font-bold text-slate-800">Meet the Developers</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {developers.map((dev) => (
          <div
            key={dev.name}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-card"
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-400">
              <IconUserCircle size={30} />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-800">{dev.name}</p>
            <p className="mt-0.5 text-xs text-slate-500">{dev.role}</p>
          </div>
        ))}
      </div>

      <h3 className="mb-4 mt-8 text-base font-bold text-slate-800">Academic Information</h3>
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:grid-cols-3">
        <InfoRow icon={IconGraduation} title="University">
          President Ramon Magsaysay State University
          <br />
          Iba, Zambales, Philippines
        </InfoRow>
        <InfoRow icon={IconBook} title="Program">
          Bachelor of Science in Computer Science
          <br />
          College of Communication and Information Technology
        </InfoRow>
        <InfoRow icon={IconCalendar} title="Version">
          © 2026 BUSahero
          <br />
          All Rights Reserved. Version 1.0
        </InfoRow>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, title, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-brand">
        <Icon size={18} />
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{children}</p>
      </div>
    </div>
  );
}
