import type { LatLngTuple } from "leaflet";
import { olongapoToSantaCruzRoute } from "@/lib/routes";
import { municipalities, haversineKm } from "@/lib/data";

const route = olongapoToSantaCruzRoute as LatLngTuple[];

// How close (in km) a bus needs to be to a municipality's marker before
// we consider it "arriving" there, rather than just "departed"/"upcoming".
const ARRIVING_THRESHOLD_KM = 3;

// Finds the index of the closest point on the static road route to a
// given lat/lng. O(n) over ~1,300 points — cheap enough to run on every
// Firebase update for a handful of buses.
export function findNearestRouteIndex(lat: number, lng: number): number {
  let bestIndex = 0;
  let bestDistance = Infinity;
  for (let i = 0; i < route.length; i++) {
    const [rLat, rLng] = route[i];
    const d = haversineKm(lat, lng, rLat, rLng);
    if (d < bestDistance) {
      bestDistance = d;
      bestIndex = i;
    }
  }
  return bestIndex;
}

// Precompute each municipality's position along the route once, then
// sort Olongapo (index 0) -> Santa Cruz (last index). This gives us a
// single "corridor order" we can compare any bus's position against.
const orderedMunicipalities = municipalities
  .map((m) => ({ ...m, routeIndex: findNearestRouteIndex(m.lat, m.lng) }))
  .sort((a, b) => a.routeIndex - b.routeIndex);

export type StopStatus = "DEPARTED" | "ARRIVING" | "UPCOMING";

export type RouteStop = {
  id: string;
  name: string;
  status: StopStatus;
};

export type BusRouteProgress = {
  routeIndex: number;
  percent: number;
  origin: string;
  destination: string;
  directionLabel: "Northbound" | "Southbound";
  currentMunicipality: string | null;
  nextMunicipality: string | null;
  stops: RouteStop[];
};

// Projects a bus's live lat/lng onto the road route and derives
// municipality-level progress. `direction` should be "north" or "south"
// (matching the Firebase /buses/{direction}/{busId} grouping).
export function getBusRouteProgress(
  lat: number,
  lng: number,
  direction: string | undefined
): BusRouteProgress {
  const isSouth = (direction ?? "").toLowerCase() === "south";
  const busIndex = findNearestRouteIndex(lat, lng);
  const percent = Math.round((busIndex / (route.length - 1)) * 100);

  const origin = isSouth ? "Santa Cruz" : "Olongapo City";
  const destination = isSouth ? "Olongapo City" : "Santa Cruz";

  // Walk the corridor in travel order (reversed for southbound buses)
  // and classify each municipality relative to the bus's position.
  const travelOrder = isSouth
    ? [...orderedMunicipalities].reverse()
    : orderedMunicipalities;

  let currentMunicipality: string | null = null;
  let nextMunicipality: string | null = null;

  const stops: RouteStop[] = travelOrder.map((m) => {
    const distanceToBusKm = haversineKm(lat, lng, m.lat, m.lng);
    const passed = isSouth ? m.routeIndex > busIndex : m.routeIndex < busIndex;
    const isNear = distanceToBusKm <= ARRIVING_THRESHOLD_KM;

    let status: StopStatus;
    if (isNear) {
      status = "ARRIVING";
      currentMunicipality = m.name;
    } else if (passed) {
      status = "DEPARTED";
    } else {
      status = "UPCOMING";
      if (nextMunicipality === null) nextMunicipality = m.name;
    }

    return { id: m.id, name: m.name, status };
  });

  // If no stop was close enough to count as "arriving", fall back to the
  // nearest municipality overall so the UI still has something to show.
  if (!currentMunicipality) {
    let nearest = travelOrder[0];
    let nearestDist = Infinity;
    travelOrder.forEach((m) => {
      const d = haversineKm(lat, lng, m.lat, m.lng);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = m;
      }
    });
    currentMunicipality = nearest?.name ?? null;
  }

  if (!nextMunicipality) {
    const upcoming = stops.find((s) => s.status === "UPCOMING");
    nextMunicipality = upcoming?.name ?? null;
  }

  return {
    routeIndex: busIndex,
    percent: Math.min(100, Math.max(0, percent)),
    origin,
    destination,
    directionLabel: isSouth ? "Southbound" : "Northbound",
    currentMunicipality,
    nextMunicipality,
    stops,
  };
}