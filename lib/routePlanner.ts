import { getMunicipality, haversineKm } from "@/lib/data";

export const corridorOrder = [
  "olongapo",
  "subic",
  "castillejos",
  "san-marcelino",
  "san-antonio",
  "san-narciso",
  "san-felipe",
  "cabangan",
  "botolan",
  "iba",
  "palauig",
  "masinloc",
  "candelaria",
  "santa-cruz",
];

const corridorStops = corridorOrder.map((id) => getMunicipality(id)).filter(Boolean);

export type StopStatus = "DEPARTED" | "ARRIVING" | "UPCOMING";

export type RouteStop = {
  id: string;
  name: string;
  status: StopStatus;
};

export type BusRouteProgress = {
  busId: string;
  label: string;
  direction: "Northbound" | "Southbound" | "Unknown";
  origin: string;
  destination: string;
  currentMunicipality: string;
  nextMunicipality: string | null;
  stops: RouteStop[];
};

function findNearestStopIndex(lat: number, lng: number): number {
  let nearestIndex = 0;
  let nearestDist = Infinity;
  corridorStops.forEach((stop, i) => {
    const d = haversineKm(lat, lng, stop.lat, stop.lng);
    if (d < nearestDist) {
      nearestDist = d;
      nearestIndex = i;
    }
  });
  return nearestIndex;
}

const DIRECTION_STORAGE_PREFIX = "busahero:direction:";

type PersistedDirection = {
  index: number;
  direction: "Northbound" | "Southbound";
};

// Movement history lives in localStorage (per bus id), not just in a
// component ref, so the self-correction survives page refreshes, tab
// closes, and navigating away and back — not only re-renders within the
// same mount.
function readPersistedDirection(busId: string): PersistedDirection | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DIRECTION_STORAGE_PREFIX + busId);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.index === "number" &&
      (parsed.direction === "Northbound" || parsed.direction === "Southbound")
    ) {
      return parsed;
    }
  } catch {
    // Malformed or inaccessible storage (private browsing, quota, etc.) —
    // just behave as if nothing was persisted.
  }
  return null;
}

function writePersistedDirection(busId: string, value: PersistedDirection) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DIRECTION_STORAGE_PREFIX + busId, JSON.stringify(value));
  } catch {
    // Ignore write failures (private mode / storage full) — worst case we
    // just fall back to the Firebase guess again next time.
  }
}

// Determines direction by comparing the bus's current nearest-stop index
// against the last index we've ever observed it at. This is derived from
// actual movement, so it self-corrects even if the Firebase `direction`
// field is hardcoded, wrong, or never updated — it can't disagree with
// reality for long, and it can't "reset" back to the hardcoded value
// either, since the movement history is persisted (not just in-memory).
//
// `previousIndex` is whatever this same function returned earlier in this
// session (kept by the caller, e.g. a ref in the component) — it's just a
// fast path so we don't have to hit localStorage when we already know the
// answer. The Firebase `direction` field is only ever used once: the very
// first time this device has ever seen this specific bus, with no
// movement history anywhere yet. After that first guess, everything is
// derived from observed movement, permanently.
export function resolveDirection(
  bus: any,
  currentIndex: number,
  previousIndex: number | undefined
): "Northbound" | "Southbound" | "Unknown" {
  const persisted = readPersistedDirection(bus.id);
  const lastKnownIndex = previousIndex ?? persisted?.index;

  if (lastKnownIndex !== undefined && lastKnownIndex !== currentIndex) {
    const direction = currentIndex > lastKnownIndex ? "Northbound" : "Southbound";
    writePersistedDirection(bus.id, { index: currentIndex, direction });
    return direction;
  }

  if (persisted) {
    writePersistedDirection(bus.id, { index: currentIndex, direction: persisted.direction });
    return persisted.direction;
  }

  const raw = (bus.direction ?? "").toString().toLowerCase();
  const guess: "Northbound" | "Southbound" | null = raw.includes("north")
    ? "Northbound"
    : raw.includes("south")
    ? "Southbound"
    : null;

  if (guess) {
    writePersistedDirection(bus.id, { index: currentIndex, direction: guess });
    return guess;
  }

  return "Unknown";
}

export function buildRouteProgress(
  bus: any,
  previousIndex: number | undefined
): { progress: BusRouteProgress; nearestIndex: number } | null {
  if (typeof bus.lat !== "number" || typeof bus.lng !== "number") return null;
  if (corridorStops.length === 0) return null;

  const nearestIndex = findNearestStopIndex(bus.lat, bus.lng);
  const direction = resolveDirection(bus, nearestIndex, previousIndex);
  const southbound = direction === "Southbound";

  const stops: RouteStop[] = corridorStops.map((stop, i) => {
    let status: StopStatus;
    if (i === nearestIndex) {
      status = "ARRIVING";
    } else if (southbound) {
      status = i > nearestIndex ? "DEPARTED" : "UPCOMING";
    } else {
      status = i < nearestIndex ? "DEPARTED" : "UPCOMING";
    }
    return { id: stop.id, name: stop.name, status };
  });

  const nextIndex = southbound ? nearestIndex - 1 : nearestIndex + 1;
  const nextStop = corridorStops[nextIndex] ?? null;

  return {
    progress: {
      busId: bus.id,
      label: bus.label,
      direction,
      origin: southbound ? "Santa Cruz" : "Olongapo City",
      destination: southbound ? "Olongapo City" : "Santa Cruz",
      currentMunicipality: corridorStops[nearestIndex].name,
      nextMunicipality: nextStop ? nextStop.name : null,
      stops,
    },
    nearestIndex,
  };
}