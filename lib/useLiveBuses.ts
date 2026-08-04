"use client";

import { useEffect, useRef, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

// Formats a raw bus id like "bus1" or "Bus3" into a clean "Bus 1" style label.
export function formatBusLabel(id: string): string {
  const match = id.match(/^([a-zA-Z]+)\s*(\d+)$/);
  if (match) {
    const word = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
    return `${word} ${match[2]}`;
  }
  return id;
}

// Pulls a numeric lat/lng out of a bus record regardless of how the
// upstream device/app named or typed the fields (string vs number,
// lat/lng vs latitude/longitude, or nested under location/gps/coords).
export function extractLatLng(value: any): { lat: number | null; lng: number | null } {
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

// Pulls a numeric speed (km/h) out of a bus record regardless of the
// upstream field name (speedKph, speed, velocity, kph, etc.) or type
// (string vs number).
export function extractSpeedKph(value: any): number | null {
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

export type LiveBusBase = {
  id: string;
  label: string;
  lat: number | null;
  lng: number | null;
  speedKph: number | null;
  status?: string;
  direction?: string;
  // Client-side timestamp (ms) of when we last saw this bus's data change.
  lastUpdateAt: number;
  [key: string]: any;
};

// NOTE: intentionally NOT derived via `Omit<LiveBus, "lastUpdateMinutesAgo">`.
// Omit breaks down on types that include an index signature (it collapses
// back to just `{ [key: string]: any }` and drops the named properties),
// which caused "missing id, label, lat, lng..." errors even though the
// object literal clearly had them. Declaring the base type directly avoids
// that pitfall entirely.
export type LiveBus = LiveBusBase & {
  lastUpdateMinutesAgo: number;
};

// Subscribes to /buses in Firebase Realtime Database. The data isn't a
// flat list of buses — it's grouped one level deeper by direction, e.g.
// { north: { bus1: {...} }, south: { bus2: {...}, Bus3: {...} } }.
//
// NOTE on "last update": the device's own `updatedAt` field is not a
// reliable wall-clock timestamp (GPS trackers commonly send millis()
// uptime instead of a real Unix time), so we don't use it for display.
// Instead we watch each bus's raw payload for changes and stamp it with
// the client's own clock the moment a change is observed.
export function useLiveBuses() {
  const [rawBuses, setRawBuses] = useState<LiveBusBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const lastSeenRef = useRef<Record<string, { signature: string; seenAt: number }>>({});

  // Re-render periodically so "Xm ago" keeps advancing even when no new
  // Firebase update has arrived.
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const busesRef = ref(db, "buses");
    const unsubscribe = onValue(
      busesRef,
      (snapshot) => {
        const data = snapshot.val() || {};

        const flatEntries: [string, any][] = [];
        Object.entries(data).forEach(([groupKey, groupValue]: [string, any]) => {
          const looksLikeBus =
            groupValue && (groupValue.lat !== undefined || groupValue.latitude !== undefined);

          if (looksLikeBus) {
            flatEntries.push([groupKey, groupValue]);
          } else if (groupValue && typeof groupValue === "object") {
            Object.entries(groupValue).forEach(([busId, busValue]: [string, any]) => {
              flatEntries.push([busId, { direction: groupKey, ...busValue }]);
            });
          }
        });

        const now = Date.now();

        const list: LiveBusBase[] = flatEntries.map(([id, value]: [string, any]): LiveBusBase => {
          const signature = JSON.stringify(value);
          const previous = lastSeenRef.current[id];
          const seenAt = previous && previous.signature === signature ? previous.seenAt : now;
          lastSeenRef.current[id] = { signature, seenAt };

          const { lat, lng } = extractLatLng(value);
          const speedKph = extractSpeedKph(value);
          return {
            id,
            label: value.label ?? formatBusLabel(id),
            ...value,
            lat,
            lng,
            speedKph,
            lastUpdateAt: seenAt,
          };
        });

        setRawBuses(list);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsubscribe();
  }, []);

  const buses: LiveBus[] = rawBuses.map(
    (bus): LiveBus => ({
      ...bus,
      lastUpdateMinutesAgo: Math.max(0, Math.round((Date.now() - bus.lastUpdateAt) / 60000)),
    })
  );

  // `tick` isn't read directly but its state change forces this hook to
  // re-run and recompute lastUpdateMinutesAgo against the current clock.
  void tick;

  return { buses, loading };
}