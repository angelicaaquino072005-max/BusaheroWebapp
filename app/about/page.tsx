import Image from "next/image";
import BusIllustration from "@/components/BusIllustration";
import { IconGraduation, IconBook, IconCalendar } from "@/components/Icons";

const developers = [
  { name: "Angelica Aquino", role: "UI/UX Designer", photo: "/team/angelica.jpg" },
  { name: "Krizia Mae F. Funiestas", role: "Lead Developer", photo: "/team/krizia.jpg" },
  { name: "Daisy Ann M. Magno", role: "Documentation", photo: "/team/daisy_ann.jpg" },
  { name: "Rhonielyn Mhei B. Tolentino", role: "System Analyst", photo: "/team/rhonielyn.jpg" },
];

const adviser = { name: "Rowela Gongora, MCS", role: "Thesis Adviser", photo: "/team/rowela.jpg" };

function ProfileCard({ number, name, role, photo }) {
  return (
    <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand shadow-card">
      <Image
        src={photo}
        alt={name}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
      />

      {/* Number badge */}
      <span className="absolute left-3 top-3 text-xs font-bold text-white/70">
        {number}
      </span>

      {/* Bottom gradient + text */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-dark via-brand-dark/90 to-transparent px-4 pb-4 pt-10">
        <p className="text-sm font-bold uppercase tracking-wide text-white">{name}</p>
        <p className="mt-0.5 text-xs font-medium text-blue-200">{role}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card md:grid-cols-2 md:items-center">
        <div>
          <h2 className="mb-3 text-lg font-bold text-slate-800">About the Application</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            BUSahero is a web-based real-time bus tracking and arrival estimation
            application developed to help commuters monitor bus locations,
            estimate arrival times, check seat availability, and calculate fares for trips
            between Olongapo City and Zambales.
          </p>
        </div>
        <BusIllustration className="w-full" />
      </div>

      <h3 className="mb-4 mt-8 text-base font-bold text-slate-800">Meet the Developers</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {developers.map((dev, i) => (
          <ProfileCard
            key={dev.name}
            number={String(i + 1).padStart(2, "0")}
            name={dev.name}
            role={dev.role}
            photo={dev.photo}
          />
        ))}
      </div>

      <h3 className="mb-4 mt-8 text-base font-bold text-slate-800">Thesis Adviser</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <ProfileCard number="01" name={adviser.name} role={adviser.role} photo={adviser.photo} />
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