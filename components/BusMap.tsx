"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L, { LatLngTuple } from "leaflet";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { busLines, municipalities, getMunicipality, haversineKm } from "@/lib/data";
import BusInfoCard from "@/components/BusInfoCard";

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
  html: `<div class="user-pin"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 19a6 6 0 0 1 11 0"/></svg></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

function ZoomControls() {
  const map = useMap();
  return (
    <div className="absolute bottom-24 right-4 z-[400] flex flex-col gap-2 lg:bottom-4">
      <button
        onClick={() => map.setView([14.98, 120.05], 9)}
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

// Subscribes to /buses in Firebase Realtime Database.
// Expected shape per bus (adjust field names to match your mobile app's writes):
// {
//   lineId: "genesis", from: "Iba", to: "Olongapo City",
//   lat: 15.298, lng: 119.965, speedKph: 45,
//   status: "moving" | "stopped", stoppedSeconds: 0,
//   lastUpdatedAt: <server timestamp in ms>
// }
function useLiveBuses() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const busesRef = ref(db, "buses");
    const unsubscribe = onValue(
      busesRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        const list = Object.entries(data).map(([id, value]: [string, any]) => {
          const lastUpdatedAt = value.lastUpdatedAt ?? Date.now();
          const lastUpdateMinutesAgo = Math.max(
            0,
            Math.round((Date.now() - lastUpdatedAt) / 60000)
          );
          return {
            id,
            label: value.label ?? id,
            ...value,
            lastUpdateMinutesAgo,
          };
        });
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
        center={[14.98, 120.05]}
        zoom={9}
        scrollWheelZoom
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noreferrer">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>'
          url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
        />

        {busLines.map((line) => {
          const positions: LatLngTuple[] = line.routeIds
            .map((id) => getMunicipality(id))
            .filter(Boolean)
            .map((m) => [m.lat, m.lng] as LatLngTuple);
          return (
            <Polyline
              key={line.id}
              positions={positions}
              pathOptions={{ color: line.color, weight: 4, opacity: 0.85 }}
            />
          );
        })}

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