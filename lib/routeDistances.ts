/**
 * Zambales Corridor — full barangay-level bus-stop distances.
 *
 * Source: SANTA_CRUZ_TO_OLONGAPO.docx (per-barangay "X to Olongapo" survey
 * provided by the team, Sep 2026). Distances are as given in that document,
 * converted from "distance TO Olongapo" into ascending distance FROM
 * Olongapo, and legKm is the gap between consecutive stops.
 *
 * NOTE: an earlier version of this file deliberately used a coarser,
 * 14-stop per-municipality list and left this exact barangay chain out,
 * on the reasoning that it was a road-survey dataset rather than a
 * fare-relevant stop list. That decision has been superseded per an
 * explicit request to use the full barangay list for the fare
 * calculator — this file now reflects that.
 *
 * Corridor total per this source: 142.0 km (Olongapo -> Santa Cruz).
 * This differs from the 144.4 km previously hard-coded here, and from an
 * earlier ~149.7 km / Google-Maps-148.4 km reference used to sanity-check
 * an even earlier draft. Worth a gut-check against Google Maps again if
 * the exact total matters for anything downstream.
 *
 * A few stops share the same cumulative distance (legKm: 0) because the
 * source document lists them at the same "X km to Olongapo" figure —
 * kept as-is rather than guessed apart.
 */

export interface RouteStop {
  /** Stable identifier, used to reference a stop from fare/bus data. */
  id: string;
  /** Display name for the stop/terminal (barangay or landmark). */
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
    id: "olongapo-terminal",
    name: "Olongapo (Terminal)",
    municipality: "Olongapo",
    legKm: 0.0,
  },
  {
    id: "olongapo-west-bajac-bajac",
    name: "West Bajac Bajac",
    municipality: "Olongapo",
    legKm: 0.4,
  },
  {
    id: "olongapo-mabayuan",
    name: "Mabayuan",
    municipality: "Olongapo",
    legKm: 1.6,
  },
  {
    id: "olongapo-kalaklan",
    name: "Kalaklan",
    municipality: "Olongapo",
    legKm: 3.3,
  },
  {
    id: "olongapo-barreto",
    name: "Barreto",
    municipality: "Olongapo",
    legKm: 1.2,
  },
  {
    id: "subic-sto-tomas",
    name: "Sto. Tomas",
    municipality: "Subic",
    legKm: 1.4,
  },
  { id: "subic-matain", name: "Matain", municipality: "Subic", legKm: 0.7 },
  {
    id: "subic-calapandayan",
    name: "Calapandayan",
    municipality: "Subic",
    legKm: 3.4,
  },
  { id: "subic-ilaw", name: "Ilaw", municipality: "Subic", legKm: 1.0 },
  {
    id: "subic-mangan-vaca",
    name: "Mangan - Vaca",
    municipality: "Subic",
    legKm: 2.0,
  },
  { id: "subic-aningway", name: "Aningway", municipality: "Subic", legKm: 2.0 },
  {
    id: "castillejos-panatawan",
    name: "Panatawan",
    municipality: "Castillejos",
    legKm: 1.0,
  },
  {
    id: "castillejos-del-pilar",
    name: "Del Pilar",
    municipality: "Castillejos",
    legKm: 1.0,
  },
  {
    id: "castillejos-san-agustin",
    name: "San Agustin",
    municipality: "Castillejos",
    legKm: 5.0,
  },
  {
    id: "san-marcelino-nagbunga",
    name: "Nagbunga",
    municipality: "San Marcelino",
    legKm: 1.0,
  },
  {
    id: "san-marcelino-central",
    name: "Central",
    municipality: "San Marcelino",
    legKm: 2.0,
  },
  {
    id: "san-marcelino-la-paz",
    name: "La Paz",
    municipality: "San Marcelino",
    legKm: 0.0,
  },
  {
    id: "san-marcelino-linusungan",
    name: "Linusungan",
    municipality: "San Marcelino",
    legKm: 0.0,
  },
  {
    id: "san-antonio-burgos",
    name: "Burgos",
    municipality: "San Antonio",
    legKm: 3.0,
  },
  {
    id: "san-antonio-linasin",
    name: "Linasin",
    municipality: "San Antonio",
    legKm: 0.0,
  },
  {
    id: "san-antonio-rizal",
    name: "Rizal",
    municipality: "San Antonio",
    legKm: 6.0,
  },
  {
    id: "san-antonio-antipolo",
    name: "Antipolo",
    municipality: "San Antonio",
    legKm: 1.0,
  },
  {
    id: "san-antonio-west-and-east-dirita",
    name: "West and East Dirita",
    municipality: "San Antonio",
    legKm: 0.0,
  },
  {
    id: "san-narciso-beddeng",
    name: "Beddeng",
    municipality: "San Narciso",
    legKm: 3.0,
  },

  {
    id: "san-narciso-san-pascual",
    name: "San Pascual",
    municipality: "San Narciso",
    legKm: 3.0,
  },
  {
    id: "san-narciso-libertad",
    name: "Libertad",
    municipality: "San Narciso",
    legKm: 0.0,
  },
  {
    id: "san-narciso-patrocinio-natividad",
    name: "Patrocinio/ natividad",
    municipality: "San Narciso",
    legKm: 0.0,
  },
  {
    id: "san-narciso-alusiis",
    name: "Alusiis",
    municipality: "San Narciso",
    legKm: 1.0,
  },
  {
    id: "san-felipe-rosete",
    name: "Rosete",
    municipality: "San Felipe",
    legKm: 4.0,
  },
  {
    id: "san-felipe-apostol",
    name: "Apostol",
    municipality: "San Felipe",
    legKm: 0.0,
  },
  {
    id: "san-felipe-manglicmot",
    name: "Manglicmot",
    municipality: "San Felipe",
    legKm: 0.0,
  },
  {
    id: "san-felipe-faranal",
    name: "Faranal",
    municipality: "San Felipe",
    legKm: 1.0,
  },
  {
    id: "san-felipe-sindol",
    name: "Sindol",
    municipality: "San Felipe",
    legKm: 1.0,
  },
  {
    id: "san-felipe-maloma",
    name: "Maloma",
    municipality: "San Felipe",
    legKm: 4.0,
  },
  {
    id: "cabangan-casabaan",
    name: "Casabaan",
    municipality: "Cabangan",
    legKm: 2.0,
  },
  {
    id: "cabangan-anonang",
    name: "Anonang",
    municipality: "Cabangan",
    legKm: 0.0,
  },
  {
    id: "cabangan-longos",
    name: "Longos",
    municipality: "Cabangan",
    legKm: 2.0,
  },
  {
    id: "cabangan-banuanbayo",
    name: "Banuanbayo",
    municipality: "Cabangan",
    legKm: 1.0,
  },
  {
    id: "cabangan-sto-nino",
    name: "Sto. Nino",
    municipality: "Cabangan",
    legKm: 0.0,
  },
  {
    id: "cabangan-san-antonio-dolores",
    name: "San Antonio/Dolores",
    municipality: "Cabangan",
    legKm: 1.0,
  },
  {
    id: "cabangan-apo-apo",
    name: "Apo-apo",
    municipality: "Cabangan",
    legKm: 2.0,
  },
  {
    id: "cabangan-sta-rita",
    name: "Sta. Rita",
    municipality: "Cabangan",
    legKm: 0.0,
  },
  {
    id: "cabangan-san-rafael",
    name: "San Rafael",
    municipality: "Cabangan",
    legKm: 2.0,
  },
  {
    id: "cabangan-mabanglit",
    name: "Mabanglit",
    municipality: "Cabangan",
    legKm: 1.0,
  },
  { id: "botolan-panan", name: "Panan", municipality: "Botolan", legKm: 2.0 },
  {
    id: "botolan-binoclutan",
    name: "Binoclutan",
    municipality: "Botolan",
    legKm: 2.0,
  },
  { id: "botolan-porac", name: "Porac", municipality: "Botolan", legKm: 2.0 },
  { id: "botolan-carael", name: "Carael", municipality: "Botolan", legKm: 4.0 },
  { id: "botolan-agora", name: "Agora", municipality: "Botolan", legKm: 2.0 },
  {
    id: "botolan-baton-lapoc",
    name: "Batonlapoc",
    municipality: "Botolan",
    legKm: 0.0,
  },
  { id: "botolan-tampo", name: "Tampo", municipality: "Botolan", legKm: 2.0 },
  {
    id: "botolan-santiago",
    name: "Santiago",
    municipality: "Botolan",
    legKm: 1.0,
  },
  { id: "botolan-bancal", name: "Bancal", municipality: "Botolan", legKm: 1.0 },
  { id: "iba-palamginan", name: "Palamginan", municipality: "Iba", legKm: 1.0 },
  {
    id: "iba-zone-1-libaba-itc",
    name: "Zone 1, Libaba/ ITC",
    municipality: "Iba",
    legKm: 2.0,
  },
  {
    id: "iba-santa-rosario",
    name: "Santa Rosario",
    municipality: "Iba",
    legKm: 2.0,
  },
  {
    id: "iba-bangantalinga",
    name: "Bangantalinga",
    municipality: "Iba",
    legKm: 1.0,
  },
  {
    id: "palauig-amungan",
    name: "Amungan",
    municipality: "Palauig",
    legKm: 2.0,
  },
  {
    id: "palauig-bulawen",
    name: "Bulawen",
    municipality: "Palauig",
    legKm: 6.0,
  },
  { id: "palauig-salaza", name: "Salaza", municipality: "Palauig", legKm: 6.0 },
  {
    id: "palauig-pangolingan",
    name: "Pangolingan",
    municipality: "Palauig",
    legKm: 3.0,
  },
  {
    id: "masinloc-san-lorenzo",
    name: "San Lorenzo",
    municipality: "Masinloc",
    legKm: 2.0,
  },
  {
    id: "masinloc-sto-rosario",
    name: "Sto. Rosario",
    municipality: "Masinloc",
    legKm: 1.0,
  },
  {
    id: "masinloc-bamban",
    name: "Bamban",
    municipality: "Masinloc",
    legKm: 2.0,
  },
  {
    id: "masinloc-inhobol",
    name: "Inhobol",
    municipality: "Masinloc",
    legKm: 3.0,
  },
  {
    id: "masinloc-collat",
    name: "Collat",
    municipality: "Masinloc",
    legKm: 2.0,
  },
  {
    id: "masinloc-baloganon",
    name: "Baloganon",
    municipality: "Masinloc",
    legKm: 1.0,
  },
  {
    id: "masinloc-taltal",
    name: "Taltal",
    municipality: "Masinloc",
    legKm: 3.0,
  },
  {
    id: "candelaria-lauis",
    name: "Lauis",
    municipality: "Candelaria",
    legKm: 2.0,
  },
  {
    id: "candelaria-yamot",
    name: "Yamot",
    municipality: "Candelaria",
    legKm: 1.0,
  },
  {
    id: "candelaria-malabon",
    name: "Malabon",
    municipality: "Candelaria",
    legKm: 4.0,
  },
  {
    id: "candelaria-malimanga",
    name: "Malimanga",
    municipality: "Candelaria",
    legKm: 1.0,
  },
  {
    id: "candelaria-sinabacan",
    name: "Sinabacan",
    municipality: "Candelaria",
    legKm: 2.0,
  },
  {
    id: "candelaria-uacon",
    name: "Uacon",
    municipality: "Candelaria",
    legKm: 2.0,
  },
  {
    id: "santa-cruz-lucapon-south",
    name: "Lucapon South",
    municipality: "Santa Cruz",
    legKm: 3.0,
  },
  {
    id: "santa-cruz-lucapon-north",
    name: "Lucapon North",
    municipality: "Santa Cruz",
    legKm: 1.0,
  },
  {
    id: "santa-cruz-bayto",
    name: "Bayto",
    municipality: "Santa Cruz",
    legKm: 2.0,
  },
  {
    id: "santa-cruz-biay",
    name: "Biay",
    municipality: "Santa Cruz",
    legKm: 2.0,
  },
  {
    id: "santa-cruz-lipay",
    name: "Lipay",
    municipality: "Santa Cruz",
    legKm: 1.0,
  },
  {
    id: "santa-cruz-poblacion",
    name: "Santa Cruz",
    municipality: "Santa Cruz",
    legKm: 3.0,
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
// Town-route selector helpers (used by FareMatrixCalculator.tsx)
// ---------------------------------------------------------------------

export interface TownRoute {
  id: string;
  town: string;
  municipality: string;
}

/**
 * Flat "From / To" selector list — one entry per barangay/landmark stop.
 * Derived from ZAMBALES_CORRIDOR so it can never drift out of sync with
 * the underlying distance data. `municipality` is included so selectors
 * can group the (now ~80-entry) list with <optgroup> instead of showing
 * one long flat list.
 */
export const TOWN_ROUTES: TownRoute[] = ZAMBALES_CORRIDOR.map((stop) => ({
  id: stop.id,
  town: stop.name,
  municipality: stop.municipality,
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
