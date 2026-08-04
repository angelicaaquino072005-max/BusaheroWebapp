import { getMunicipality, haversineKm } from "@/lib/data";

// Geographic order of the corridor, south (Olongapo) -> north (Santa Cruz).
// Used to figure out which stops a bus has already passed vs. still has
// ahead of it, based on nothing but its current lat/lng.
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

// Finds the corridor stop closest to the bus's current lat/lng.
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

// Reads whatever direction info the device/Firebase record provides.
// Falls back to "Unknown" rather than guessing wrong.
function resolveDirection(bus: any): "Northbound" | "Southbound" | "Unknown" {
  const raw = (bus.direction ?? "").toString().toLowerCase();
  if (raw.includes("north")) return "Northbound";
  if (raw.includes("south")) return "Southbound";
  return "Unknown";
}

export function buildRouteProgress(bus: any): BusRouteProgress | null {
  if (typeof bus.lat !== "number" || typeof bus.lng !== "number") return null;
  if (corridorStops.length === 0) return null;

  const nearestIndex = findNearestStopIndex(bus.lat, bus.lng);
  const direction = resolveDirection(bus);
  const southbound = direction === "Southbound";

  const stops: RouteStop[] = corridorStops.map((stop, i) => {
    let status: StopStatus;
    if (i === nearestIndex) {
      status = "ARRIVING";
    } else if (southbound) {
      status = i > nearestIndex ? "DEPARTED" : "UPCOMING";
    } else {
      // Northbound, or direction unknown — assume northbound progression.
      status = i < nearestIndex ? "DEPARTED" : "UPCOMING";
    }
    return { id: stop.id, name: stop.name, status };
  });

  const nextIndex = southbound ? nearestIndex - 1 : nearestIndex + 1;
  const nextStop = corridorStops[nextIndex] ?? null;

  return {
    busId: bus.id,
    label: bus.label,
    direction,
    origin: southbound ? "Santa Cruz" : "Olongapo City",
    destination: southbound ? "Olongapo City" : "Santa Cruz",
    currentMunicipality: corridorStops[nearestIndex].name,
    nextMunicipality: nextStop ? nextStop.name : null,
    stops,
  };
}