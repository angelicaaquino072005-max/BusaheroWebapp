"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { haversineKm } from "@/lib/data";
import { olongapoToSantaCruzRoute } from "@/lib/routes";
import type { LatLngTuple } from "leaflet";
import BusInfoCard from "@/components/BusInfoCard";
import { useLiveBuses } from "@/lib/useLiveBuses";

const routePositions = olongapoToSantaCruzRoute as LatLngTuple[];
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

// Layout constants shared by all marker states. The vehicle image's own
// CENTER must land exactly on the Leaflet anchor point, because CSS
// rotate() pivots around an element's center — anchoring at the bottom
// (like a non-rotated icon) makes the visible bus drift off the true
// GPS position as soon as it rotates to a non-north heading.
const VEHICLE_W = 36;
const VEHICLE_H = 70;
const ROTATOR_W = 70; // local wrapper the vehicle (+ beam) rotate inside
const ROTATOR_H = 100;
const PIVOT_X = ROTATOR_W / 2; // vehicle's center within the rotator, local coords
const PIVOT_Y = VEHICLE_H / 2;
const ANCHOR_X = 75; // where that pivot lands in the outer marker box
const ANCHOR_Y = 120;
const CONTAINER_W = 150;
const CONTAINER_H = 190;

function createBusIcon(label: string, isStopped: boolean, bearingDeg: number, isNoSignal?: boolean) {
  const pillClass = isNoSignal ? "no-signal" : isStopped ? "stopped" : "";
  const rotatorLeft = ANCHOR_X - PIVOT_X;
  const rotatorTop = ANCHOR_Y - PIVOT_Y;

  const beamHtml = isStopped || isNoSignal ? "" : `<div class="bus-live-beam"></div>`;

  const html = `
    <div class="bus-marker-root">
      <div class="bus-marker-pill ${pillClass}" style="left:${ANCHOR_X}px; top:${
    rotatorTop - 10
  }px;">${label}</div>
      <div class="bus-marker-rotator" style="left:${rotatorLeft}px; top:${rotatorTop}px; width:${ROTATOR_W}px; height:${ROTATOR_H}px; transform-origin: ${PIVOT_X}px ${PIVOT_Y}px; transform: rotate(${bearingDeg}deg);">
        ${beamHtml}
        <img src="/bus-icon.png" class="bus-marker-vehicle${
          isNoSignal ? " no-signal" : ""
        }" style="left:${PIVOT_X}px; top:${PIVOT_Y}px;" />
      </div>
    </div>
  `;

  return L.divIcon({
    className: "",
    html,
    iconSize: [CONTAINER_W, CONTAINER_H],
    iconAnchor: [ANCHOR_X, ANCHOR_Y],
    popupAnchor: [0, -ANCHOR_Y],
  });
}

// Standard compass bearing (0-360, clockwise from north) between two points.
function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  const brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
}

const userIcon = L.divIcon({
  className: "",
  html: `<div class="location-marker"><div class="location-marker-pulse"></div><div class="location-marker-dot"></div></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

function ZoomControls({
  mapStyle,
  onToggleStyle,
}: {
  mapStyle: "streets" | "satellite";
  onToggleStyle: () => void;
}) {
  const map = useMap();
  return (
    <div className="absolute bottom-24 right-4 z-[400] flex flex-col gap-2 lg:bottom-4">
      <button
        onClick={onToggleStyle}
        aria-label="Toggle satellite view"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg text-slate-600 shadow-md hover:bg-slate-50"
        title={mapStyle === "streets" ? "Switch to satellite" : "Switch to street map"}
      >
        {mapStyle === "streets" ? "🛰️" : "🗺️"}
      </button>
      <button
        onClick={() => map.setView([15.24, 120.1], 9)}
        aria-label="Recenter map"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-md hover:bg-slate-50"
      >
        ⦿
      </button>
      <button
        onClick={() => map.zoomIn()}
        aria-label="Zoom in"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg text-slate-600 shadow-md hover:bg-slate-50"
      >
        +
      </button>
      <button
        onClick={() => map.zoomOut()}
        aria-label="Zoom out"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg text-slate-600 shadow-md hover:bg-slate-50"
      >
        −
      </button>
    </div>
  );
}

export default function BusMap() {
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite">("streets");
  const { buses: liveBuses, loading: busesLoading } = useLiveBuses();
  const busHeadingRef = useRef({});

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocationError("Geolocation is not supported on this device.");
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocationError("Location permission denied.");
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const selectedBus = liveBuses.find((b) => b.id === selectedBusId) || null;

  const distanceKm =
    selectedBus && userLocation
      ? haversineKm(userLocation.lat, userLocation.lng, selectedBus.lat, selectedBus.lng)
      : null;

  const etaMinutes =
    selectedBus && distanceKm != null && selectedBus.speedKph > 0
      ? Math.round((distanceKm / selectedBus.speedKph) * 60)
      : null;

  return (
    <div className="relative h-full w-full">
      <MapContainer
      center={[14.98, 120.05]}
      zoom={9}
      minZoom={1}
      scrollWheelZoom
      zoomControl={false}
      className="h-full w-full"
    >
        <TileLayer
          key={mapStyle}
          attribution={
            mapStyle === "streets"
              ? '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noreferrer">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>'
              : '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noreferrer">MapTiler</a>'
          }
          url={
            mapStyle === "streets"
              ? `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`
              : `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${MAPTILER_KEY}`
          }
        />

        {/* Actual road-based route, Olongapo City -> Santa Cruz */}
        <Polyline
          positions={routePositions}
          pathOptions={{ color: "#1e3a8a", weight: 4, opacity: 0.85 }}
        />
       {liveBuses
          .filter((bus) => typeof bus.lat === "number" && typeof bus.lng === "number")
          .filter((bus) => !String(bus.status ?? "").toLowerCase().includes("garage"))
          .filter((bus) => (bus.lastUpdateMinutesAgo ?? 0) < 5)
          .map((bus) => {
            const isNoSignal = (bus.lastUpdateMinutesAgo ?? 0) >= 2;
            const isStopped = bus.speedKph === 0 || String(bus.status ?? "").toLowerCase() === "stopped";
            const label = isNoSignal
              ? `${bus.label} · No Signal`
              : isStopped
              ? `${bus.label} · Stopped`
              : `${bus.label} · ${Math.round(bus.speedKph ?? 0)} km/h`;

            const prevHeading = busHeadingRef.current[bus.id];
            let bearing = prevHeading ? prevHeading.bearing : 0;
            if (
              prevHeading &&
              typeof bus.lng === "number" &&
              typeof bus.lat === "number" &&
              typeof prevHeading.lastLng === "number" &&
              typeof prevHeading.lastLat === "number"
            ) {
              const deltaLng = bus.lng - prevHeading.lastLng;
              const deltaLat = bus.lat - prevHeading.lastLat;
              // Only recompute heading on a meaningful move, so GPS jitter
              // while idle/stopped doesn't spin the icon back and forth.
              if (Math.abs(deltaLng) > 0.00003 || Math.abs(deltaLat) > 0.00003) {
                bearing = calculateBearing(
                  prevHeading.lastLat,
                  prevHeading.lastLng,
                  bus.lat,
                  bus.lng
                );
              }
            }
            busHeadingRef.current[bus.id] = {
              lastLng: typeof bus.lng === "number" ? bus.lng : prevHeading?.lastLng,
              lastLat: typeof bus.lat === "number" ? bus.lat : prevHeading?.lastLat,
              bearing,
            };

            return (
              <Marker
                key={bus.id}
                position={[bus.lat, bus.lng]}
                icon={createBusIcon(label, isStopped, bearing, isNoSignal)}
                eventHandlers={{
                  click: () => setSelectedBusId(bus.id),
                }}
              />
            );
          })}

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <span className="text-sm font-medium">Your location</span>
            </Popup>
          </Marker>
        )}

        <ZoomControls
          mapStyle={mapStyle}
          onToggleStyle={() =>
            setMapStyle((prev) => (prev === "streets" ? "satellite" : "streets"))
          }
        />
      </MapContainer>

      {selectedBus && (
        <BusInfoCard
          bus={selectedBus}
          distanceKm={distanceKm}
          etaMinutes={etaMinutes}
          onClose={() => setSelectedBusId(null)}
        />
      )}

      {locationError && !userLocation && (
        <div className="absolute left-4 top-4 z-[400] max-w-xs rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-medium text-amber-700 shadow-lg">
          {locationError}
        </div>
      )}

      {busesLoading && (
        <div className="absolute left-1/2 top-4 z-[400] -translate-x-1/2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-500 shadow-lg">
          Connecting to live bus data…
        </div>
      )}
    </div>
  );
}