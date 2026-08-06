"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { haversineKm } from "@/lib/data";
import { olongapoToSantaCruzRoute } from "@/lib/routes";
import type { LatLngTuple } from "leaflet";
import BusInfoCard from "@/components/BusInfoCard";
import { useLiveBuses } from "@/lib/useLiveBuses";

const routePositions = olongapoToSantaCruzRoute as LatLngTuple[];
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

const BUS_ICON = L.divIcon({
  className: "",
  html: `<div class="bus-marker">🚌</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 25],
  popupAnchor: [0, -25],
});

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
            const isStopped = bus.speedKph === 0 || String(bus.status ?? "").toLowerCase() === "stopped";
            return (
              <Marker
                key={bus.id}
                position={[bus.lat, bus.lng]}
                icon={BUS_ICON}
                eventHandlers={{
                  click: () => setSelectedBusId(bus.id),
                }}
              >
                <Tooltip
                  permanent
                  direction="top"
                  offset={[0, -32]}
                  className={`bus-status-pill ${isStopped ? "stopped" : ""}`}
                >
                  {isStopped ? "Stopped" : "On the way"}
                </Tooltip>
                <Popup>
                  <div className="min-w-[160px]">
                    <p className="text-sm font-semibold text-brand">{bus.label}</p>
                    {(bus.from || bus.to) && (
                      <p className="text-xs text-slate-600">
                        {bus.from} → {bus.to}
                      </p>
                    )}
                    {bus.speedKph != null && (
                      <p className="mt-1 text-xs text-slate-500">Speed: {bus.speedKph} km/h</p>
                    )}
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