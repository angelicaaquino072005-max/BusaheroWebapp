"use client";

import {
  IconClock,
  IconAlertTriangle,
  IconLocate,
  IconRefresh,
  IconX,
} from "@/components/Icons";

function Row({ icon: Icon, iconBg, iconColor, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg} ${iconColor}`}
      >
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="truncate text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function BusInfoCard({ bus, distanceKm, etaMinutes, onClose }) {
  const isFar = distanceKm != null && distanceKm > 5;
  const statusLabel =
    bus.status === "stopped"
      ? `${Math.floor(bus.stoppedSeconds / 60)}m ${bus.stoppedSeconds % 60}s stopped`
      : "Moving";

  return (
    <div className="absolute inset-x-0 bottom-0 z-[500] rounded-t-2xl border-t border-slate-200 bg-white p-5 shadow-[0_-8px_24px_rgba(15,23,42,0.15)] lg:inset-x-auto lg:bottom-4 lg:left-4 lg:w-80 lg:rounded-2xl lg:border">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-base font-bold text-slate-800">{bus.label}</h3>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
        >
          <IconX size={18} />
        </button>
      </div>

      <div className="space-y-3.5">
        <Row
          icon={IconClock}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          label="ETA"
          value={etaMinutes == null ? "Infinity mins" : `${etaMinutes} mins`}
        />
        <Row
          icon={IconAlertTriangle}
          iconBg={bus.status === "stopped" ? "bg-red-50" : "bg-emerald-50"}
          iconColor={bus.status === "stopped" ? "text-red-500" : "text-emerald-500"}
          label="Status"
          value={statusLabel}
        />
        <Row
          icon={IconLocate}
          iconBg={isFar ? "bg-slate-100" : "bg-emerald-50"}
          iconColor={isFar ? "text-slate-500" : "text-emerald-500"}
          label="Distance"
          value={
            distanceKm == null
              ? "Enable location to see distance"
              : isFar
              ? `Too far (${distanceKm.toFixed(1)} km away)`
              : `${distanceKm.toFixed(1)} km away`
          }
        />
        <Row
          icon={IconRefresh}
          iconBg="bg-blue-50"
          iconColor="text-brand"
          label="Speed"
          value={`${bus.speedKph} km/h`}
        />
        <Row
          icon={IconClock}
          iconBg="bg-slate-100"
          iconColor="text-slate-500"
          label="Last Update"
          value={
            bus.lastUpdateMinutesAgo === 0
              ? "Just now"
              : `${bus.lastUpdateMinutesAgo}m ago`
          }
        />
      </div>
    </div>
  );
}