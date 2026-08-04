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

// Determines direction by comparing the bus's current nearest-stop index
// against the last index we saw it at. This is derived from actual
// movement, so it self-corrects even if the Firebase `direction` field
// is missing, wrong, or stale — it can't disagree with reality for long.
//
// `previousIndex` should be whatever this same function returned the
// last time this bus was checked (kept in memory by the caller, e.g. a
// ref in the component). On first sighting there's nothing to compare
// against yet, so we fall back to the Firebase `direction` field if
// present, then finally to "Unknown".
export function resolveDirection(
  bus: any,
  currentIndex: number,
  previousIndex: number | undefined
): "Northbound" | "Southbound" | "Unknown" {
  if (previousIndex !== undefined && previousIndex !== currentIndex) {
    return currentIndex > previousIndex ? "Northbound" : "Southbound";
  }

  // No movement detected yet (first sighting, or bus hasn't crossed to a
  // new nearest stop since last check) — fall back to whatever the
  // device/Firebase reports, purely as an initial guess.
  const raw = (bus.direction ?? "").toString().toLowerCase();
  if (raw.includes("north")) return "Northbound";
  if (raw.includes("south")) return "Southbound";
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