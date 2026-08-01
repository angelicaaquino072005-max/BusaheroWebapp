"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { busLines, liveBuses, municipalities, getMunicipality } from "@/lib/data";

function busIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div class="bus-pin" style="background:${color}">🚌</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
}

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

export default function BusMap({ visibleLines }) {
  const icons = useMemo(() => {
    const map = {};
    busLines.forEach((line) => {
      map[line.id] = busIcon(line.color);
    });
    return map;
  }, []);

  return (
    <MapContainer
      center={[14.98, 120.05]}
      zoom={9}
      scrollWheelZoom
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {busLines
        .filter((line) => visibleLines.includes(line.id))
        .map((line) => {
          const positions = line.routeIds
            .map((id) => getMunicipality(id))
            .filter(Boolean)
            .map((m) => [m.lat, m.lng]);
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
        .filter((bus) => visibleLines.includes(bus.lineId))
        .map((bus) => {
          const line = busLines.find((l) => l.id === bus.lineId);
          return (
            <Marker key={bus.id} position={[bus.lat, bus.lng]} icon={icons[bus.lineId]}>
              <Popup>
                <div className="min-w-[160px]">
                  <p className="text-sm font-semibold" style={{ color: line.color }}>
                    {bus.label}
                  </p>
                  <p className="text-xs text-slate-600">
                    {bus.from} → {bus.to}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Speed: {bus.speedKph} km/h</p>
                  <p className="text-xs text-slate-400">{line.name}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

      <ZoomControls />
    </MapContainer>
  );
}
