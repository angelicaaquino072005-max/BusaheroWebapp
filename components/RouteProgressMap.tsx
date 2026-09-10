"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import type { LatLngTuple } from "leaflet";
import { olongapoToSantaCruzRoute } from "@/lib/routes";
import type { RouteStop, StopStatus } from "@/lib/routePlanner";
const routePositions = olongapoToSantaCruzRoute as LatLngTuple[];
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

type BusPosition = {
  lat: number | null;
  lng: number | null;
  label?: string;
  direction?: string;
};

type RouteProgressMapProps = {
  stops: RouteStop[];
  bus: BusPosition | null;
};

function stopIcon(status: StopStatus, index: number) {
  const delay = `${(index % 5) * 0.12}s`;

  if (status === "DEPARTED") {
    return L.divIcon({
      className: "",
      html: `
        <div class="route-flag departed">
          <svg width="20" height="26" viewBox="0 0 20 26" xmlns="http://www.w3.org/2000/svg">
            <line x1="3" y1="25" x2="3" y2="2" stroke="#334155" stroke-width="2" stroke-linecap="round" />
            <path class="route-flag-cloth" style="animation-delay:${delay};" d="M3 3 L17 3 L12.5 8.5 L17 14 L3 14 Z" fill="#16a34a" stroke="#166534" stroke-width="0.8" stroke-linejoin="round" />
          </svg>
        </div>
      `,
      iconSize: [20, 26],
      iconAnchor: [3, 25],
    });
  }
  if (status === "ARRIVING") {
    return L.divIcon({
      className: "",
      html: `
        <div class="route-flag arriving">
          <span class="route-stop-pulse"></span>
          <svg width="22" height="28" viewBox="0 0 22 28" xmlns="http://www.w3.org/2000/svg">
            <line x1="3" y1="27" x2="3" y2="2" stroke="#334155" stroke-width="2.2" stroke-linecap="round" />
            <path class="route-flag-cloth" style="animation-delay:${delay};" d="M3 3 L19 3 L14 9 L19 15 L3 15 Z" fill="#f59e0b" stroke="#b45309" stroke-width="0.8" stroke-linejoin="round" />
          </svg>
        </div>
      `,
      iconSize: [22, 28],
      iconAnchor: [3, 27],
    });
  }
  return L.divIcon({
    className: "",
    html: `
      <div class="route-flag upcoming">
        <svg width="16" height="22" viewBox="0 0 16 22" xmlns="http://www.w3.org/2000/svg">
          <line x1="3" y1="21" x2="3" y2="3" stroke="#94a3b8" stroke-width="1.6" stroke-linecap="round" />
          <path class="route-flag-cloth" style="animation-delay:${delay};" d="M3 4 L13 4 L9.5 8.5 L13 13 L3 13 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.7" stroke-linejoin="round" />
        </svg>
      </div>
    `,
    iconSize: [16, 22],
    iconAnchor: [3, 21],
  });
}

// Same vehicle graphic used on the Live Tracking map, without the pill
// label — just the icon itself, facing the direction of travel: upright
// for Northbound, flipped for Southbound.
function busIcon(direction?: string) {
  const dir = String(direction ?? "").toLowerCase();
  const rotateDeg = dir.includes("south") ? 180 : 0;

  const html = `
    <img src="/bus-icon.png" class="route-bus-vehicle" style="left:15px; top:29px; transform:translate(-50%,-50%) rotate(${rotateDeg}deg);" />
  `;

  return L.divIcon({
    className: "",
    html,
    iconSize: [30, 58],
    iconAnchor: [15, 29],
  });
}

// Frames the entire Santa Cruz <-> Olongapo corridor once, using the
// full road route plus every municipality stop. Fits only on mount (not
// on every bus update) so the map always shows the whole corridor as a
// stable reference instead of snapping to a tight zoom around wherever
// the bus currently is.
function FitToRoute({ stops }: { stops: RouteStop[] }) {
  const map = useMap();

  useEffect(() => {
    const points: LatLngTuple[] = [
      ...routePositions,
      ...stops.map((s) => [s.lat, s.lng] as LatLngTuple),
    ];
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [16, 16] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

// Small +/- buttons so the map can be zoomed in and out without relying
// on scroll-wheel or pinch gestures, which stay disabled here so the map
// doesn't hijack page scrolling.
function ZoomControls() {
  const map = useMap();
  return (
    <div className="absolute bottom-3 right-3 z-[400] flex flex-col gap-1.5">
      <button
        type="button"
        onClick={() => map.zoomIn()}
        aria-label="Zoom in"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-base font-semibold text-slate-600 shadow-md hover:bg-slate-50"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        aria-label="Zoom out"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-base font-semibold text-slate-600 shadow-md hover:bg-slate-50"
      >
        −
      </button>
    </div>
  );
}

// A small, self-contained map scoped to a single bus. Every bus in the
// Route Planner gets its own instance of this component, so each one
// shows only that bus's own progress along the corridor — municipalities
// it has already passed are marked, the one it's near is highlighted, and
// the rest stay plain until it reaches them.
export default function RouteProgressMap({ stops, bus }: RouteProgressMapProps) {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-slate-100 sm:h-[560px]">
      <MapContainer
        center={[15.2, 120.0]}
        zoom={9}
        scrollWheelZoom={false}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noreferrer">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>'
          url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
        />

        <Polyline
          positions={routePositions}
          pathOptions={{ color: "#1e3a8a", weight: 4, opacity: 0.85 }}
        />

        {stops.map((stop, i) => (
          <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={stopIcon(stop.status, i)}>
            <Tooltip direction="top" offset={[0, -6]} opacity={1}>
              {stop.name}
            </Tooltip>
          </Marker>
        ))}

        {bus?.lat != null && bus?.lng != null && (
          <Marker
            position={[bus.lat, bus.lng]}
            icon={busIcon(bus.direction)}
            zIndexOffset={1000}
          >
            {bus.label && (
              <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                {bus.label}
              </Tooltip>
            )}
          </Marker>
        )}

        <FitToRoute stops={stops} />
        <ZoomControls />
      </MapContainer>

      {/* Small floating legend listing every town, so the full corridor
          list is visible at a glance without leaving the map. */}
      <div className="absolute right-3 top-3 z-[400] max-h-[85%] w-36 overflow-y-auto rounded-xl border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur sm:w-40">
        <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Towns
        </p>
        <div className="space-y-0.5">
          {stops.map((stop) => (
            <div key={stop.id} className="flex items-center gap-1.5 rounded-lg px-1 py-1">
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${
                  stop.status === "DEPARTED"
                    ? "bg-emerald-500"
                    : stop.status === "ARRIVING"
                    ? "bg-amber-500"
                    : "bg-slate-300"
                }`}
              >
                {stop.status === "DEPARTED" ? "✓" : ""}
              </span>
              <span
                className={`truncate text-xs ${
                  stop.status === "UPCOMING" ? "text-slate-400" : "font-medium text-slate-700"
                }`}
              >
                {stop.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}