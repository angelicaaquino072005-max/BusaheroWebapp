import { IconLock, IconMap, IconBus, IconServer, IconShield, IconShare, IconRefresh } from "@/components/Icons";

const practices = [
  {
    icon: IconMap,
    title: "Location Information",
    body: "The application may access your device's location to display your current position on the map and provide navigation-related services. Your location is used only while the application is running.",
  },
  {
    icon: IconBus,
    title: "Real-Time Bus Tracking",
    body: "BUSahero displays the real-time location of buses using GPS data transmitted by the bus tracking device. This information is intended solely to help commuters monitor bus movements.",
  },
  {
    icon: IconServer,
    title: "Data Collection",
    body: "The application may store limited information such as user preferences, trip history, and system settings to improve the overall user experience.",
  },
  {
    icon: IconShield,
    title: "Data Protection",
    body: "Reasonable security measures are implemented to protect stored information from unauthorized access, misuse, or disclosure.",
  },
  {
    icon: IconShare,
    title: "Information Sharing",
    body: "BUSahero does not sell, rent, or intentionally share users' personal information with third parties unless required by law or with the user's consent.",
  },
  {
    icon: IconRefresh,
    title: "Policy Updates",
    body: "This Privacy Policy may be updated periodically to reflect improvements or changes in the application. Continued use of the application indicates acceptance of the updated policy.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <h2 className="mb-4 text-xl font-bold text-slate-800">Privacy Policy</h2>

      <div className="mb-6 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card md:grid-cols-[auto_1fr]">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-brand">
          <IconLock size={26} />
        </span>
        <div>
          <h3 className="mb-1 text-base font-semibold text-slate-800">Introduction</h3>
          <p className="text-sm leading-relaxed text-slate-600">
            BUSahero respects your privacy. This Privacy Policy explains how the
            application collects, uses, and protects your information while providing
            real-time bus tracking and related transportation services.
          </p>
        </div>
      </div>

      <h3 className="mb-4 text-base font-bold text-slate-800">Our Privacy Practices</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {practices.map((p) => (
          <div key={p.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-brand">
              <p.icon size={19} />
            </span>
            <h4 className="mb-1.5 text-sm font-semibold text-slate-800">{p.title}</h4>
            <p className="text-xs leading-relaxed text-slate-500">{p.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm font-medium text-brand">Last Updated: July 2026</p>
    </div>
  );
}
