import type { LatLngTuple } from "leaflet";
import { olongapoToSantaCruzRoute } from "@/lib/routes";
import { haversineKm } from "@/lib/data";
import { findNearestRouteIndex } from "@/lib/routeProgress";

const route = olongapoToSantaCruzRoute as LatLngTuple[];

// Cumulative distance (km) from the start of the route (Olongapo City) to
// each point on the polyline. Computed once at module load, so a lookup
// is just an array read + subtraction instead of re-walking the route.
const cumulativeKm: number[] = (() => {
  const acc = [0];
  for (let i = 1; i < route.length; i++) {
    const [lat1, lng1] = route[i - 1];
    const [lat2, lng2] = route[i];
    acc.push(acc[i - 1] + haversineKm(lat1, lng1, lat2, lng2));
  }
  return acc;
})();

// Distance between two points, following the actual road corridor instead
// of a straight line. Plain haversine badly *underestimates* real
// distance on this route, since the highway hugs the Zambales coastline
// and mountains rather than cutting straight across — a rider a few
// kilometers away "as the crow flies" can easily be 2-3x that by road.
// The "Distance" and ETA shown to a rider need to reflect the road
// they're actually on.
//
// Each point is projected onto its nearest point on the known route
// polyline, and the distance between the two projected points is read
// off the precomputed cumulative distances. The small haversine "hop"
// from each raw point to its projection is added back in — this matters
// most for the rider's own location, which is rarely exactly on the road.
export function roadDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  if (route.length < 2) return haversineKm(lat1, lng1, lat2, lng2);

  const i1 = findNearestRouteIndex(lat1, lng1);
  const i2 = findNearestRouteIndex(lat2, lng2);

  const offRoute1 = haversineKm(lat1, lng1, route[i1][0], route[i1][1]);
  const offRoute2 = haversineKm(lat2, lng2, route[i2][0], route[i2][1]);
  const alongRoute = Math.abs(cumulativeKm[i2] - cumulativeKm[i1]);

  return alongRoute + offRoute1 + offRoute2;
}