const API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjUwNWNmM2YxZWNkZTQ3NzhiMjYyOTBhZGY5MDAyZjUzIiwiaCI6Im11cm11cjY0In0=";

const waypoints = [
  [14.838879, 120.283440],
  [14.878507, 120.234398],
  [14.932290, 120.200586],
  [14.973710, 120.155868],
  [14.948246, 120.089720],
  [15.015925, 120.079307],
  [15.060799, 120.069908],
  [15.111030, 120.064008],
  [15.159232, 120.055168],
  [15.288350, 120.026484],
  [15.3203357, 119.9873523],
  [15.417190, 119.953236],
  [15.532287, 119.957898],
  [15.606962, 119.937914],
  [15.773003, 119.905279],
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