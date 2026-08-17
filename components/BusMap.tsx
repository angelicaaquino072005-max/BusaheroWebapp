"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { haversineKm } from "@/lib/data";
import { olongapoToSantaCruzRoute } from "@/lib/routes";
import type { LatLngTuple } from "leaflet";
import BusInfoCard from "@/components/BusInfoCard";
import { useLiveBuses } from "@/lib/useLiveBuses";

const routePositions = olongapoToSantaCruzRoute as LatLngTuple[];
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

function createBusIcon(label: string, isStopped: boolean, direction?: string, isNoSignal?: boolean) {
  const isFlipped = String(direction ?? "").toLowerCase() === "south";
  const vehicleClass = isFlipped ? "bus-marker-img flipped" : "bus-marker-img";
  const liveVehicleClass = isFlipped ? "bus-live-vehicle flipped" : "bus-live-vehicle";

  if (isNoSignal) {
    return L.divIcon({
      className: "",
      html: `
        <div class="bus-stopped-marker">
          <div class="bus-status-pill no-signal">${label}</div>
          <img src="/bus-icon.png" class="${vehicleClass} no-signal" />
        </div>
      `,
      iconSize: [150, 84],
      iconAnchor: [75, 84],
      popupAnchor: [0, -84],
    });
  }

  if (isStopped) {
    return L.divIcon({
      className: "",
      html: `
        <div class="bus-stopped-marker">
          <div class="bus-status-pill stopped">${label}</div>
          <img src="/bus-icon.png" class="${vehicleClass}" />
        </div>
      `,
      iconSize: [140, 84],
      iconAnchor: [70, 84],
      popupAnchor: [0, -84],
    });
  }

  return L.divIcon({
    className: "",
    html: `
      <div class="bus-live-marker">
        <div class="bus-live-badge">
          <div class="bus-live-pill">${label}</div>
        </div>
        <div class="bus-live-beam${isFlipped ? " flipped" : ""}"></div>
        <img src="/bus-icon.png" class="${liveVehicleClass}" />
      </div>
    `,
    iconSize: [150, 70],
    iconAnchor: [75, 70],
    popupAnchor: [0, -70],
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

export default function BusMap() {
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const { buses: liveBuses, loading: busesLoading } = useLiveBuses();

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
      minZoom={8}
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
       {liveBuses
          .filter((bus) => typeof bus.lat === "number" && typeof bus.lng === "number")
          .map((bus) => {
            const isNoSignal = (bus.lastUpdateMinutesAgo ?? 0) >= 2;
            const isStopped = bus.speedKph === 0 || String(bus.status ?? "").toLowerCase() === "stopped";
            const label = isNoSignal
              ? `${bus.label} · No Signal`
              : isStopped
              ? `${bus.label} · Stopped`
              : `${bus.label} · ${Math.round(bus.speedKph ?? 0)} km/h`;
            return (
              <Marker
                key={bus.id}
                position={[bus.lat, bus.lng]}
                icon={createBusIcon(label, isStopped, bus.direction, isNoSignal)}
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