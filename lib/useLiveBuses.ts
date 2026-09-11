"use client";

import { useEffect, useRef, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { isOnSpecialTrip } from "@/lib/routeProgress";

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

// A bus counts as "stopped" if either its live speed reads 0 or the
// device/backend explicitly reports a "stopped" status. This is checked
// the same way everywhere a bus's stopped/moving state is shown (map
// marker, info card) so they can't disagree about the same bus.
export function isBusStopped(bus: { speedKph?: number | null; status?: string }): boolean {
  return bus.speedKph === 0 || String(bus.status ?? "").toLowerCase() === "stopped";
}

// A bus counts as "online" (actively tracking right now) once we've
// heard from its tracker within this many seconds. The hardware pushes
// GPS every few seconds while genuinely connected, so this stays tight
// on purpose — anything older almost certainly means the tracker was
// closed/turned off, not just a slow update cycle.
export const ONLINE_THRESHOLD_SECONDS = 45;

// Slightly shorter warning threshold — a bus crossing this (but still
// under ONLINE_THRESHOLD_SECONDS) is still shown, just flagged as
// "No Signal" rather than fully hidden yet.
export const NO_SIGNAL_THRESHOLD_SECONDS = 15;

// Single shared definition of "is this bus's tracker open right now" —
// used by both the Live Tracking map and the Route Planner, so the two
// pages can never disagree about which buses currently count as active.
export function isBusOnline(bus: { lastUpdateSecondsAgo?: number }): boolean {
  return (bus.lastUpdateSecondsAgo ?? Infinity) < ONLINE_THRESHOLD_SECONDS;
}

export type LiveBusBase = {
  id: string;
  label: string;
  lat: number | null;
  lng: number | null;
  speedKph: number | null;
  status?: string;
  direction?: string;
  // True once the bus's GPS position has drifted far enough from the
  // known Olongapo <-> Santa Cruz corridor that it's most likely
  // chartered for a special trip elsewhere, rather than just parked
  // slightly off the highway.
  isOnSpecialTrip?: boolean;
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
  // Seconds-level version of the same thing — the tracker pushes every
  // few seconds while genuinely connected, so "is this bus's tracker
  // open right now" needs to be judged in seconds, not minutes.
  lastUpdateSecondsAgo: number;
};

type LastSeenMap = Record<string, { signature: string; seenAt: number }>;

const LAST_SEEN_STORAGE_KEY = "busahero:lastSeenBuses";

// Reads the last-seen-change record from localStorage so it survives
// page refreshes — without this, a page refresh wipes the in-memory
// history and every bus currently sitting in Firebase (even one whose
// tracker has been off for hours) looks "just updated" again, since
// there's nothing to compare its signature against yet.
function loadPersistedLastSeen(): LastSeenMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LAST_SEEN_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function persistLastSeen(map: LastSeenMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_SEEN_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Ignore write failures (private browsing, storage full) — worst
    // case we just lose cross-refresh memory, not correctness.
  }
}

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
  const lastSeenRef = useRef<LastSeenMap | null>(null);
  if (lastSeenRef.current === null) {
    lastSeenRef.current = loadPersistedLastSeen();
  }

  // Re-render every couple of seconds so "online right now" status stays
  // accurate at second-level granularity — the tracker pushes every few
  // seconds while genuinely connected, so a 30-second-old re-check (the
  // old interval) was far too coarse to reflect that promptly.
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 2000);
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
              // The bus's own Firebase record can carry a stray/stale
              // "direction" field from earlier hardware setup — that
              // must NOT win over which folder (north/south) it's
              // actually grouped under right now, or the direction
              // chip gets stuck showing whatever was first configured
              // instead of following the bus. Group key goes last so
              // it always overrides.
              flatEntries.push([busId, { ...busValue, direction: groupKey }]);
            });
          }
        });

        const now = Date.now();

        const list: LiveBusBase[] = flatEntries.map(([id, value]: [string, any]): LiveBusBase => {
          const signature = JSON.stringify(value);
          const previous = lastSeenRef.current![id];
          const seenAt = previous && previous.signature === signature ? previous.seenAt : now;
          lastSeenRef.current![id] = { signature, seenAt };

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
            isOnSpecialTrip: lat != null && lng != null ? isOnSpecialTrip(lat, lng) : false,
          };
        });

        persistLastSeen(lastSeenRef.current!);

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
      lastUpdateSecondsAgo: Math.max(0, Math.round((Date.now() - bus.lastUpdateAt) / 1000)),
    })
  );

  // `tick` isn't read directly but its state change forces this hook to
  // re-run and recompute lastUpdateMinutesAgo/lastUpdateSecondsAgo
  // against the current clock.
  void tick;

  return { buses, loading };
}