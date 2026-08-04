//lib/routeDistances.ts

/**
 * Zambales Corridor — per-municipality bus-stop distances.
 *
 * Source: "per municipality bus stop" dataset (Zambales_Route_Distances.docx).
 * Palauig's town proper is not on the route, so Bulawen is used as its
 * substitute stop (per the source doc's note).
 *
 * This is deliberately NOT the full 86-stop barangay chain (149.69 km) —
 * that dataset is a road-length survey used to sanity-check the corridor
 * total, not a fare-relevant stop list. This file uses named,
 * boarding-relevant terminals/landmarks, which is what riders actually
 * board/alight at and what a fare matrix should be built on.
 *
 * Corridor total: 144.4 km (Olongapo -> Santa Cruz).
 */

export interface RouteStop {
  /** Stable identifier, used to reference a stop from fare/bus data. */
  id: string;
  /** Display name for the stop/terminal. */
  name: string;
  /** Municipality this stop belongs to. */
  municipality: string;
  /** Distance in km from the previous stop in the corridor. */
  legKm: number;
  /** Cumulative distance in km from the Olongapo origin. */
  cumulativeKm: number;
}

// Ordered Olongapo -> Santa Cruz. Do not reorder without recalculating
// cumulativeKm for every stop after the change.
export const ZAMBALES_CORRIDOR: RouteStop[] = buildCorridor([
  {
    id: "olongapo",
    name: "Olongapo (Terminal)",
    municipality: "Olongapo",
    legKm: 0,
  },
  {
    id: "subic",
    name: "Subic (Municipal Hall)",
    municipality: "Subic",
    legKm: 11.6,
  },
  {
    id: "castillejos",
    name: "Castillejos (Municipal Hall)",
    municipality: "Castillejos",
    legKm: 8.4,
  },
  {
    id: "san-marcelino",
    name: "San Marcelino (Municipal Hall)",
    municipality: "San Marcelino",
    legKm: 6.8,
  },
  {
    id: "san-antonio",
    name: "San Antonio (Municipal Hall)",
    municipality: "San Antonio",
    legKm: 7.8,
  },
  {
    id: "san-narciso",
    name: "San Narciso (Municipal Hall)",
    municipality: "San Narciso",
    legKm: 7.8,
  },
  {
    id: "san-felipe",
    name: "San Felipe (Municipal Hall)",
    municipality: "San Felipe",
    legKm: 5.0,
  },
  {
    id: "cabangan",
    name: "Cabangan (Municipal Hall)",
    municipality: "Cabangan",
    legKm: 11.4,
  },
  {
    id: "botolan",
    name: "Botolan (Agora)",
    municipality: "Botolan",
    legKm: 17.7,
  },
  { id: "iba", name: "Iba (Terminal)", municipality: "Iba", legKm: 5.7 },
  {
    id: "palauig",
    name: "Palauig (Bulawen)",
    municipality: "Palauig",
    legKm: 16.6,
  },
  {
    id: "masinloc",
    name: "Masinloc (Municipal Hall)",
    municipality: "Masinloc",
    legKm: 16.8,
  },
  {
    id: "candelaria",
    name: "Candelaria (Municipal Hall)",
    municipality: "Candelaria",
    legKm: 11.2,
  },
  {
    id: "santa-cruz",
    name: "Santa Cruz (Municipal Hall)",
    municipality: "Santa Cruz",
    legKm: 17.6,
  },
]);

function buildCorridor(
  stops: Array<Omit<RouteStop, "cumulativeKm">>
): RouteStop[] {
  let cumulative = 0;

  return stops.map((stop) => {
    cumulative += stop.legKm;

    return { ...stop, cumulativeKm: Number(cumulative.toFixed(2)) };
  });
}

export function getStopById(id: string): RouteStop | undefined {
  return ZAMBALES_CORRIDOR.find((stop) => stop.id === id);
}

export function getStopByMunicipality(
  municipality: string
): RouteStop | undefined {
  return ZAMBALES_CORRIDOR.find(
    (stop) => stop.municipality.toLowerCase() === municipality.toLowerCase()
  );
}

/**
 * Distance in km between two stops on the corridor, regardless of travel
 * direction. Throws if either stop id is unknown.
 */
export function distanceBetweenStops(fromId: string, toId: string): number {
  const from = getStopById(fromId);
  const to = getStopById(toId);

  if (!from || !to) {
    throw new Error(
      `distanceBetweenStops: unknown stop id "${!from ? fromId : toId}"`
    );
  }

  return Number(Math.abs(to.cumulativeKm - from.cumulativeKm).toFixed(2));
}

export const CORRIDOR_TOTAL_KM =
  ZAMBALES_CORRIDOR[ZAMBALES_CORRIDOR.length - 1].cumulativeKm;

// ---------------------------------------------------------------------
// Town-route selector helpers (used by FareCalculator.tsx)
// ---------------------------------------------------------------------

export interface TownRoute {
  id: string;
  town: string;
}

/**
 * Simplified one-entry-per-municipality list for "From / To" selectors.
 * Derived from ZAMBALES_CORRIDOR so it can never drift out of sync with
 * the underlying distance data.
 */
export const TOWN_ROUTES: TownRoute[] = ZAMBALES_CORRIDOR.map((stop) => ({
  id: stop.id,
  town: stop.name,
}));

/**
 * Distance in km between two stop ids. Alias of distanceBetweenStops,
 * named to match the town-route selector call sites.
 */
export function getDistanceBetween(fromId: string, toId: string): number {
  return distanceBetweenStops(fromId, toId);
}

/** Human-readable "From → To" label for a route between two town names. */
export function getRouteLabel(fromTown: string, toTown: string): string {
  return `${fromTown} → ${toTown}`;
}
