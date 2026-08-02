// Mock / demo data for the BUSahero app.
// Coordinates are approximate town-center locations along the
// Zambales <-> Olongapo City corridor, for demo purposes only.

export const municipalities = [
  { id: "iba", name: "Iba", lat: 15.3286, lng: 119.9893 },
  { id: "botolan", name: "Botolan", lat: 15.2063, lng: 120.0667 },
  { id: "cabangan", name: "Cabangan", lat: 15.1384, lng: 120.0628 },
  { id: "san-felipe", name: "San Felipe", lat: 15.0686, lng: 120.0695 },
  { id: "san-narciso", name: "San Narciso", lat: 15.0517, lng: 120.0583 },
  { id: "san-antonio", name: "San Antonio", lat: 14.9871, lng: 120.0636 },
  { id: "san-marcelino", name: "San Marcelino", lat: 14.9472, lng: 120.1728 },
  { id: "castillejos", name: "Castillejos", lat: 14.9429, lng: 120.1959 },
  { id: "subic", name: "Subic", lat: 14.8961, lng: 120.2533 },
  { id: "olongapo", name: "Olongapo City", lat: 14.8400, lng: 120.2670 },
  { id: "palauig", name: "Palauig", lat: 15.4038, lng: 120.0069 },
  { id: "masinloc", name: "Masinloc", lat: 15.5350, lng: 119.9650 },
  { id: "candelaria", name: "Candelaria", lat: 15.6125, lng: 119.9375 },
  { id: "santa-cruz", name: "Santa Cruz", lat: 15.6589, lng: 119.9211 },
];
const byId = Object.fromEntries(municipalities.map((m) => [m.id, m]));
export const getMunicipality = (id) => byId[id];

export const busLines = [
  {
    id: "victory-liner",
    name: "Victory Liner",
    color: "#2563eb",
    routeIds: ["san-felipe", "san-antonio", "subic", "olongapo"],
  },
  {
    id: "five-star",
    name: "Five Star",
    color: "#f97316",
    routeIds: ["san-narciso", "san-antonio"],
  },
  {
    id: "genesis",
    name: "Genesis",
    color: "#16a34a",
    routeIds: ["iba", "botolan", "san-narciso"],
  },
  {
    id: "dagupan-bus",
    name: "Dagupan Bus",
    color: "#9333ea",
    routeIds: ["san-felipe", "san-marcelino"],
  },
  {
    id: "dimple-star",
    name: "Dimple Star",
    color: "#dc2626",
    routeIds: ["olongapo", "castillejos"],
  },
];

// Live bus positions shown on the tracking map.
export const liveBuses = [
  {
    id: "bus-102",
    label: "Bus 102",
    lineId: "genesis",
    from: "Iba",
    to: "Olongapo City",
    speedKph: 45,
    lat: 15.298,
    lng: 119.965,
  },
  {
    id: "bus-14",
    label: "Bus 14",
    lineId: "victory-liner",
    from: "San Felipe",
    to: "Olongapo City",
    speedKph: 52,
    lat: 15.06,
    lng: 119.93,
  },
  {
    id: "bus-08",
    label: "Bus 08",
    lineId: "five-star",
    from: "San Narciso",
    to: "San Antonio",
    speedKph: 38,
    lat: 15.0,
    lng: 119.94,
  },
  {
    id: "bus-27",
    label: "Bus 27",
    lineId: "dagupan-bus",
    from: "San Felipe",
    to: "San Marcelino",
    speedKph: 41,
    lat: 14.95,
    lng: 120.09,
  },
  {
    id: "bus-03",
    label: "Bus 03",
    lineId: "victory-liner",
    from: "Subic",
    to: "Olongapo City",
    speedKph: 33,
    lat: 14.86,
    lng: 120.25,
  },
  {
    id: "bus-19",
    label: "Bus 19",
    lineId: "dimple-star",
    from: "Olongapo City",
    to: "Castillejos",
    speedKph: 0,
    lat: 14.8294,
    lng: 120.2828,
  },
];

// Route Planner mock data: several bus trips with a leg-by-leg
// progress breakdown, matching the "current / next" stepper UI.
export const plannerRoutes = [
  {
    id: "bus3",
    label: "Bus3",
    origin: "Olongapo City",
    destination: "Santa Cruz",
    direction: "Northbound",
    currentMunicipality: "San Felipe",
    currentBarangay: "Farañal",
    nextBarangay: "Sindol",
    nextMunicipality: "Cabangan",
    stops: [
      { name: "Olongapo", status: "DEPARTED" },
      { name: "Subic", status: "DEPARTED" },
      { name: "Castillejos", status: "DEPARTED" },
      { name: "San Marcelino", status: "DEPARTED" },
      { name: "San Antonio", status: "DEPARTED" },
      { name: "San Narciso", status: "DEPARTED" },
      { name: "San Felipe", status: "ARRIVING" },
      { name: "Cabangan", status: "UPCOMING" },
      { name: "Botolan", status: "UPCOMING" },
      { name: "Iba", status: "UPCOMING" },
      { name: "Santa Cruz", status: "UPCOMING" },
    ],
  },
  {
    id: "bus7",
    label: "Bus7",
    origin: "Iba",
    destination: "Olongapo City",
    direction: "Southbound",
    currentMunicipality: "San Narciso",
    currentBarangay: "San Isidro",
    nextBarangay: "Poblacion",
    nextMunicipality: "San Antonio",
    stops: [
      { name: "Iba", status: "DEPARTED" },
      { name: "Botolan", status: "DEPARTED" },
      { name: "Cabangan", status: "DEPARTED" },
      { name: "San Felipe", status: "DEPARTED" },
      { name: "San Narciso", status: "ARRIVING" },
      { name: "San Antonio", status: "UPCOMING" },
      { name: "San Marcelino", status: "UPCOMING" },
      { name: "Castillejos", status: "UPCOMING" },
      { name: "Subic", status: "UPCOMING" },
      { name: "Olongapo", status: "UPCOMING" },
    ],
  },
  {
    id: "bus12",
    label: "Bus12",
    origin: "Olongapo City",
    destination: "San Marcelino",
    direction: "Northbound",
    currentMunicipality: "Castillejos",
    currentBarangay: "San Roque",
    nextBarangay: "San Nicolas",
    nextMunicipality: "San Marcelino",
    stops: [
      { name: "Olongapo", status: "DEPARTED" },
      { name: "Subic", status: "DEPARTED" },
      { name: "Castillejos", status: "ARRIVING" },
      { name: "San Marcelino", status: "UPCOMING" },
    ],
  },
];

// Seat availability mock data.
export const seatTrips = [
  {
    id: "trip-1",
    line: "Victory Liner",
    color: "#2563eb",
    from: "Olongapo City",
    to: "Iba",
    departure: "9:00 AM",
    totalSeats: 45,
    occupied: [1, 2, 5, 6, 9, 10, 13, 14, 20, 21, 22, 30, 31, 40],
  },
  {
    id: "trip-2",
    line: "Five Star",
    color: "#f97316",
    from: "Olongapo City",
    to: "San Antonio",
    departure: "9:30 AM",
    totalSeats: 40,
    occupied: [3, 4, 7, 8, 11, 12, 15, 16, 17, 18, 19, 25, 26, 27, 28, 29, 33, 34, 35],
  },
  {
    id: "trip-3",
    line: "Genesis",
    color: "#16a34a",
    from: "Iba",
    to: "Olongapo City",
    departure: "10:15 AM",
    totalSeats: 45,
    occupied: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  },
  {
    id: "trip-4",
    line: "Dagupan Bus",
    color: "#9333ea",
    from: "San Felipe",
    to: "San Marcelino",
    departure: "11:00 AM",
    totalSeats: 32,
    occupied: [2, 3, 4, 10, 11, 12, 13, 20, 21, 22, 23, 24, 25, 26, 27, 28],
  },
];

// Approximate distance (km) between municipalities, used by the fare
// calculator. This is a simplified lookup along the main corridor,
// not a true road-distance matrix.
const corridorOrder = [
  "iba",
  "botolan",
  "cabangan",
  "san-felipe",
  "san-narciso",
  "san-antonio",
  "san-marcelino",
  "castillejos",
  "subic",
  "olongapo",
];

const segmentKm = [22, 18, 10, 8, 9, 16, 8, 10, 9]; // between consecutive corridor stops

export function estimateDistanceKm(originId, destinationId) {
  const oi = corridorOrder.indexOf(originId);
  const di = corridorOrder.indexOf(destinationId);
  if (oi === -1 || di === -1 || oi === di) return 0;
  const [start, end] = oi < di ? [oi, di] : [di, oi];
  return segmentKm.slice(start, end).reduce((a, b) => a + b, 0);
}

export const FARE_BASE = 15; // PHP, first 5 km
export const FARE_PER_KM = 2.25; // PHP per km beyond the base

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
