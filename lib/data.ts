// Municipality coordinates below use verified town-center reference
// points (parish church / municipal hall / PhilAtlas town-center
// figures) instead of the earlier hand-typed values. Several of the
// old entries were displaced from their real-world location — most
// notably Santa Cruz, which was off by roughly 12.7 km south of the
// actual town, and Botolan/Cabangan/San Felipe/San Narciso, which
// were 12-17 km too far inland/east. That's why bus and stop markers
// on the map looked wrong.
export const municipalities = [
  { id: "iba", name: "Iba", lat: 15.3259, lng: 119.9798 },
  { id: "botolan", name: "Botolan", lat: 15.2896, lng: 120.0245 },
  { id: "cabangan", name: "Cabangan", lat: 15.1581, lng: 120.0553 },
  { id: "san-felipe", name: "San Felipe", lat: 15.0611, lng: 120.0703 },
  { id: "san-narciso", name: "San Narciso", lat: 15.0167, lng: 120.0833 },
  { id: "san-antonio", name: "San Antonio", lat: 14.9486, lng: 120.0864 },
  { id: "san-marcelino", name: "San Marcelino", lat: 14.9742, lng: 120.1573 },
  { id: "castillejos", name: "Castillejos", lat: 14.9333, lng: 120.2000 },
  { id: "subic", name: "Subic", lat: 14.8769, lng: 120.2328 },
  { id: "olongapo", name: "Olongapo City", lat: 14.8389, lng: 120.2834 },
  { id: "palauig", name: "Palauig", lat: 15.4336, lng: 119.9083 },
  { id: "masinloc", name: "Masinloc", lat: 15.5377, lng: 119.9489 },
  { id: "candelaria", name: "Candelaria", lat: 15.6300, lng: 119.9300 },
  { id: "santa-cruz", name: "Santa Cruz", lat: 15.7728, lng: 119.9053 },
];
const byId = Object.fromEntries(municipalities.map((m) => [m.id, m]));
export const getMunicipality = (id) => byId[id];






// ---------------------------------------------------------------------
// Distance calculation, used by the fare calculator.
//
// FIX (previously): distance was looked up from a hand-typed
// `corridorOrder` array that only listed 10 of the 14 municipalities
// above. Any trip involving the 4 missing towns — including
// "santa-cruz", the actual endpoint of the Olongapo <-> Santa Cruz
// corridor this app is built around — silently fell through to
// `oi === -1 || di === -1` and returned 0 km, which made the fare
// calculator quietly charge the flat base fare for those trips.
//
// Fix: derive distance from the lat/lng already stored on every
// municipality via the haversine formula (below), scaled up slightly
// to approximate road distance vs. straight-line distance. This works
// for any pair of municipalities automatically, so it can't silently
// go stale again when new towns are added to the list.
// ---------------------------------------------------------------------

// Straight-line (haversine) distance underestimates actual road
// distance because the highway follows the coast/terrain rather than
// a straight line. 1.15x is a reasonable approximation for this
// corridor; tune if you get real road-distance data later.
const ROAD_DISTANCE_FACTOR = 1.15;

export function estimateDistanceKm(originId, destinationId) {
  const origin = getMunicipality(originId);
  const destination = getMunicipality(destinationId);
  if (!origin || !destination || originId === destinationId) return 0;

  const straightLineKm = haversineKm(
    origin.lat,
    origin.lng,
    destination.lat,
    destination.lng
  );

  return Math.round(straightLineKm * ROAD_DISTANCE_FACTOR * 10) / 10;
}

// Haversine distance in km between two lat/lng points.
export function haversineKm(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}