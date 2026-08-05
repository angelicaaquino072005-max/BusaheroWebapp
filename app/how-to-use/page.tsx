import { IconMap, IconRoute, IconWallet, IconLocate, IconBus, IconClock } from "@/components/Icons";

const features = [
  {
    icon: IconMap,
    title: "Live Bus Tracking",
    summary: "See real-time bus positions on the map as they travel the Olongapo–Zambales corridor.",
    steps: [
      "Open the Live Tracking page (the map icon in your navigation).",
      "Allow location access when prompted, so you can see your own position on the map.",
      "Tap any bus marker to see its current speed, status, and estimated time of arrival to your location.",
      "The status pill above each bus shows if it's currently \"On the way\" or \"Stopped.\"",
    ],
  },
  {
    icon: IconRoute,
    title: "Route Planner",
    summary: "Check which stops a specific bus has already passed and which ones are still ahead.",
    steps: [
      "Open the Route Planner page.",
      "Use the left/right arrows to switch between different active buses.",
      "The top of the card shows the bus's origin, destination, and direction of travel.",
      "Tap any stop in the list to see more detail about its status — Departed, Arriving, or Upcoming.",
    ],
  },
  {
    icon: IconWallet,
    title: "Fare Calculator",
    summary: "Estimate how much your trip will cost between any two municipalities.",
    steps: [
      "Open the Fare Calculator page.",
      "Select your Origin Municipality and Destination Municipality.",
      "Toggle the discount switch if you qualify for a fare discount.",
      "Tap \"Calculate Fare\" to see the estimated base fare, discount, and total.",
    ],
  },
];

export default function HowToUsePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="mb-2 text-lg font-bold text-slate-800">How to Use BUSahero</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          BUSahero has three main tools to help you plan your trip between Olongapo City
          and Zambales. No account or login is needed — everything is available as soon
          as you open the app.
        </p>
      </div>

      <div className="space-y-5">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-brand">
                <feature.icon size={20} />
              </span>
              <div>
                <h3 className="text-base font-semibold text-slate-800">{feature.title}</h3>
                <p className="text-xs text-slate-500">{feature.summary}</p>
              </div>
            </div>

            <ol className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
              {feature.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-brand">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
          <IconClock size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold text-amber-800">A quick note on accuracy</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-700">
            Bus locations and arrival estimates depend on GPS signal and internet
            connectivity. Actual arrival times may vary due to traffic, road conditions,
            or temporary signal loss.
          </p>
        </div>
      </div>
    </div>
  );
}