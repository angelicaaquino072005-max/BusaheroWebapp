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
};

type RouteProgressMapProps = {
  stops: RouteStop[];
  bus: BusPosition | null;
};

function stopIcon(status: StopStatus) {
  if (status === "DEPARTED") {
    return L.divIcon({
      className: "",
      html: `<div class="route-stop-pin departed">✓</div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
  }
  if (status === "ARRIVING") {
    return L.divIcon({
      className: "",
      html: `<div class="route-stop-pin arriving"><span class="route-stop-pulse"></span></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  }
  return L.divIcon({
    className: "",
    html: `<div class="route-stop-pin upcoming"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

const busDotIcon = L.divIcon({
  className: "",
  html: `<div class="route-bus-dot">🚌</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Refits the map to the stops + bus position whenever the bus moves past
// a new municipality, so the view always frames what's currently relevant
// for this specific bus instead of the whole corridor.
function FitToProgress({ stops, bus }: RouteProgressMapProps) {
  const map = useMap();
  const statusKey = stops.map((s) => s.status).join(",");

  useEffect(() => {
    const points: LatLngTuple[] = stops.map((s) => [s.lat, s.lng]);
    if (bus?.lat != null && bus?.lng != null) points.push([bus.lat, bus.lng]);
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [30, 30] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusKey, bus?.lat, bus?.lng]);

  return null;
}

// A small, self-contained map scoped to a single bus. Every bus in the
// Route Planner gets its own instance of this component, so each one
// shows only that bus's own progress along the corridor — municipalities
// it has already passed are marked, the one it's near is highlighted, and
// the rest stay plain until it reaches them.
export default function RouteProgressMap({ stops, bus }: RouteProgressMapProps) {
  return (
    <div className="h-56 w-full overflow-hidden rounded-xl border border-slate-100 sm:h-64">
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
          pathOptions={{ color: "#94a3b8", weight: 3, opacity: 0.55 }}
        />

        {stops.map((stop) => (
          <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={stopIcon(stop.status)}>
            <Tooltip direction="top" offset={[0, -6]} opacity={1}>
              {stop.name}
            </Tooltip>
          </Marker>
        ))}

        {bus?.lat != null && bus?.lng != null && (
          <Marker position={[bus.lat, bus.lng]} icon={busDotIcon} zIndexOffset={1000}>
            {bus.label && (
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                {bus.label}
              </Tooltip>
            )}
          </Marker>
        )}

        <FitToProgress stops={stops} bus={bus} />
      </MapContainer>
    </div>
  );
}