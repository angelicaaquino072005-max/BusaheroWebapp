import Image from "next/image";
import BusIllustration from "@/components/BusIllustration";
import { IconGraduation, IconBook, IconCalendar, IconUserCircle } from "@/components/Icons";

const developers = [
  { name: "Angelica Aquino", role: "Web Developer", photo: "/team/angelica.jpg" },
  { name: "Krizia Mae F. Funiestas", role: "Lead Developer", photo: "/team/krizia.jpg" },
  { name: "Daisy Ann M. Magno", role: "Documentation", photo: "/team/daisy_ann.jpg" },
  { name: "Rhonielyn Mhei B. Tolentino", role: "System Analyst", photo: "/team/rhonielyn.jpg" },
];

const adviser = { name: "Rowela Gongora, MCS", role: "Thesis Adviser", photo: "/team/rowela.jpg" };

function Avatar({ photo, name, bgClass, textClass }) {
  if (photo) {
    return (
      <div className="mx-auto h-24 w-24 overflow-hidden rounded-full">
        <Image
          src={photo}
          alt={name}
          width={96}
          height={96}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  return (
    <span className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${bgClass} ${textClass}`}>
      <IconUserCircle size={40} />
    </span>
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
        {developers.map((dev) => (
          <div
            key={dev.name}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-card"
          >
            <Avatar
              photo={dev.photo}
              name={dev.name}
              bgClass="bg-violet-100"
              textClass="text-violet-400"
            />
            <p className="mt-3 text-sm font-semibold text-slate-800">{dev.name}</p>
            <p className="mt-0.5 text-xs text-slate-500">{dev.role}</p>
          </div>
        ))}
      </div>

      <h3 className="mb-4 mt-8 text-base font-bold text-slate-800">Thesis Adviser</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-card">
          <Avatar
            photo={adviser.photo}
            name={adviser.name}
            bgClass="bg-blue-50"
            textClass="text-brand"
          />
          <p className="mt-3 text-sm font-semibold text-slate-800">{adviser.name}</p>
          <p className="mt-0.5 text-xs text-slate-500">{adviser.role}</p>
        </div>
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