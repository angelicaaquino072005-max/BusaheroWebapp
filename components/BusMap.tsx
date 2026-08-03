"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { busLines, municipalities, haversineKm } from "@/lib/data";
import {  olongapoToSantaCruzRoute } from "@/lib/routes";
import type { LatLngTuple } from "leaflet";
import BusInfoCard from "@/components/BusInfoCard";

const routePositions = olongapoToSantaCruzRoute as LatLngTuple[];
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

function busIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div class="bus-pin" style="background:${color}">🚌</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
}

const userIcon = L.divIcon({
  className: "",
  html: `<div class="location-marker"><div class="location-marker-pulse"></div><div class="location-marker-dot"></div></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

function ZoomControls() {
  const map = useMap();
  return (
    <div className="absolute bottom-24 right-4 z-[400] flex flex-col gap-2 lg:bottom-4">
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

// Pulls a numeric lat/lng out of a bus record regardless of how the
// upstream device/app named or typed the fields (string vs number,
// lat/lng vs latitude/longitude, or nested under location/gps/coords).
function extractLatLng(value: any): { lat: number | null; lng: number | null } {
  const source =
    value?.location ?? value?.gps ?? value?.coords ?? value?.position ?? value;

  const rawLat = source?.lat ?? source?.latitude ?? source?.Lat ?? source?.Latitude;
  const rawLng =
    source?.lng ?? source?.lon ?? source?.long ?? source?.longitude ?? source?.Lng;

  const lat = rawLat !== undefined && rawLat !== null ? Number(rawLat) : NaN;
  const lng = rawLng !== undefined && rawLng !== null ? Number(rawLng) : NaN;

  return {
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
  };
}

// Formats a raw bus id like "bus1" or "Bus3" into a clean "Bus 1" style label.
function formatBusLabel(id: string): string {
  const match = id.match(/^([a-zA-Z]+)\s*(\d+)$/);
  if (match) {
    const word = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
    return `${word} ${match[2]}`;
  }
  return id;
}

// Pulls a numeric speed (km/h) out of a bus record regardless of the
// upstream field name (speedKph, speed, velocity, kph, etc.) or type
// (string vs number).
function extractSpeedKph(value: any): number | null {
  const raw =
    value?.speedKph ??
    value?.speedKmh ??
    value?.speed_kmh ??
    value?.speed ??
    value?.velocityKph ??
    value?.velocity ??
    value?.kph;

  const speed = raw !== undefined && raw !== null ? Number(raw) : NaN;
  return Number.isFinite(speed) ? speed : null;
}

// Subscribes to /buses in Firebase Realtime Database.
function useLiveBuses() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const busesRef = ref(db, "buses");
    const unsubscribe = onValue(
      busesRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        // Helpful while debugging — remove once buses are showing.
        console.log("Firebase /buses raw data:", data);

        // The data isn't a flat list of buses — it's grouped one level
        // deeper, e.g. { north: { bus1: {...} }, south: { bus2: {...} } }.
        // Flatten every group into a single array of bus records first.
        const flatEntries: [string, any][] = [];
        Object.entries(data).forEach(([groupKey, groupValue]: [string, any]) => {
          const looksLikeBus =
            groupValue && (groupValue.lat !== undefined || groupValue.latitude !== undefined);

          if (looksLikeBus) {
            // Already flat: /buses/busId
            flatEntries.push([groupKey, groupValue]);
          } else if (groupValue && typeof groupValue === "object") {
            // Nested: /buses/direction/busId
            Object.entries(groupValue).forEach(([busId, busValue]: [string, any]) => {
              flatEntries.push([busId, { direction: groupKey, ...busValue }]);
            });
          }
        });

        const list = flatEntries.map(([id, value]: [string, any]) => {
          const lastUpdatedAt = value.lastUpdatedAt ?? Date.now();
          const lastUpdateMinutesAgo = Math.max(
            0,
            Math.round((Date.now() - lastUpdatedAt) / 60000)
          );
          const { lat, lng } = extractLatLng(value);
          const speedKph = extractSpeedKph(value);
          return {
            id,
            label: value.label ?? formatBusLabel(id),
            ...value,
            lat,
            lng,
            speedKph,
            lastUpdateMinutesAgo,
          };
        });
        console.log("Parsed bus list:", list);
        setBuses(list);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsubscribe();
  }, []);

  return { buses, loading };
}

export default function BusMap() {
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const { buses: liveBuses, loading: busesLoading } = useLiveBuses();

  const icons = useMemo(() => {
    const map = {};
    busLines.forEach((line) => {
      map[line.id] = busIcon(line.color);
    });
    return map;
  }, []);

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
        center={[15.24, 120.1]}
        zoom={9}
        scrollWheelZoom
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noreferrer">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>'
          url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
        />

        {/* Actual road-based route, Olongapo City -> Santa Cruz */}
        <Polyline
          positions={routePositions}
          pathOptions={{ color: "#1e3a8a", weight: 4, opacity: 0.85 }}
        />

        {municipalities.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={L.divIcon({
              className: "",
              html: `<div style="width:8px;height:8px;border-radius:999px;background:#64748b;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,.4)"></div>`,
              iconSize: [8, 8],
              iconAnchor: [4, 4],
            })}
          >
            <Popup>
              <span className="text-sm font-medium">{m.name}</span>
            </Popup>
          </Marker>
        ))}

        {liveBuses
          .filter((bus) => typeof bus.lat === "number" && typeof bus.lng === "number")
          .map((bus) => {
            const line = busLines.find((l) => l.id === bus.lineId);
            const icon = icons[bus.lineId] ?? busIcon("#1e3a8a");
            return (
              <Marker
                key={bus.id}
                position={[bus.lat, bus.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => setSelectedBusId(bus.id),
                }}
              >
                <Popup>
                  <div className="min-w-[160px]">
                    <p className="text-sm font-semibold" style={{ color: line?.color ?? "#1e3a8a" }}>
                      {bus.label}
                    </p>
                    <p className="text-xs text-slate-600">
                      {bus.from} → {bus.to}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Speed: {bus.speedKph} km/h</p>
                    {line && <p className="text-xs text-slate-400">{line.name}</p>}
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <span className="text-sm font-medium">Your location</span>
            </Popup>
          </Marker>
        )}

        <ZoomControls />
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