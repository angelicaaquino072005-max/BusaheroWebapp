import { IconFileText, IconSmartphone, IconClock, IconLocate, IconAlertTriangle, IconCheckShield, IconRefresh } from "@/components/Icons";

const clauses = [
  {
    icon: IconSmartphone,
    title: "Use of the Application",
    body: "BUSahero is intended to provide commuters with real-time bus tracking, estimated arrival times, seat availability, and fare computation. Users agree to use the application only for lawful and personal transportation purposes.",
  },
  {
    icon: IconClock,
    title: "Arrival Time Estimates",
    body: "Estimated arrival times (ETA) are calculated using GPS location and distance data. Actual arrival times may vary due to traffic conditions, road closures, weather, driver decisions, or network interruptions.",
  },
  {
    icon: IconLocate,
    title: "GPS Accuracy",
    body: "Bus location updates depend on GPS signals and internet connectivity. Temporary inaccuracies or delays in location updates may occur.",
  },
  {
    icon: IconAlertTriangle,
    title: "Limitation of Liability",
    body: "The developers are not responsible for any inconvenience, delays, missed trips, or losses resulting from inaccurate GPS data, ETA estimates, or temporary service interruptions.",
  },
  {
    icon: IconCheckShield,
    title: "User Responsibility",
    body: "Users are responsible for using the application appropriately and should not misuse, modify, attempt unauthorized access, or interfere with the application's operation.",
  },
  {
    icon: IconRefresh,
    title: "Changes to the Terms",
    body: "These Terms and Conditions may be updated as the application is improved. Continued use of BUSahero after updates indicates acceptance of the revised terms.",
  },
];

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
        {clauses.map((c, i) => (
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
