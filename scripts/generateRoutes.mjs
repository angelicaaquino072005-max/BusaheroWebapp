const API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjUwNWNmM2YxZWNkZTQ3NzhiMjYyOTBhZGY5MDAyZjUzIiwiaCI6Im11cm11cjY0In0=";

// Ayon sa corridorOrder mo — Olongapo papuntang Santa Cruz
// Gamitin ang mga updated lat/lng mula sa lib/data.ts
const waypoints = [
  [14.8400, 120.2670], // olongapo
  [14.8961, 120.2533], // subic
  [14.9429, 120.1959], // castillejos
  [14.9472, 120.1728], // san-marcelino
  [14.9871, 120.0636], // san-antonio
  [15.0517, 120.0583], // san-narciso
  [15.0686, 120.0695], // san-felipe
  [15.1384, 120.0628], // cabangan
  [15.2063, 120.0667], // botolan
  [15.3286, 119.9893], // iba
  [15.4038, 120.0069], // palauig
  [15.5350, 119.9650], // masinloc
  [15.6125, 119.9375], // candelaria
  [15.6589, 119.9211], // santa-cruz
];

async function fetchRoute(coords) {
  const body = {
    coordinates: coords.map(([lat, lng]) => [lng, lat]),
    radiuses: coords.map(() => 5000), // 5km search radius kada waypoint
  };
  const res = await fetch(
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
    {
      method: "POST",
      headers: { Authorization: API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ORS error: ${err}`);
  }
  const data = await res.json();
  const feature = data.features[0];
  return {
    coordinates: feature.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    distanceKm: (feature.properties.summary.distance / 1000).toFixed(1),
    durationMin: (feature.properties.summary.duration / 60).toFixed(0),
  };
}

fetchRoute(waypoints).then((result) => {
  console.log(`\n// Distance: ${result.distanceKm} km, ~${result.durationMin} mins`);
  console.log(`\nexport const olongapoToSantaCruzRoute = ${JSON.stringify(result.coordinates)};`);
}).catch((err) => {
  console.error(err.message);
});

fetchRoute(waypoints).then((result) => {
  console.log(`\n// Distance: ${result.distanceKm} km, ~${result.durationMin} mins`);
  console.log(`\nexport const olongapoToSantaCruzRoute = ${JSON.stringify(result.coordinates)};`);
});