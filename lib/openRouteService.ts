// lib/openRouteService.ts
export async function fetchRoute(coordinates, apiKey) {
  // coordinates: array ng [lat, lng], e.g. [[15.33, 119.97], [14.83, 120.28]]
  // ORS ay [lng, lat] ang inaasahan
  const body = {
    coordinates: coordinates.map(([lat, lng]) => [lng, lat]),
  };

  const res = await fetch(
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
    {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) throw new Error("OpenRouteService request failed");

  const data = await res.json();
  const feature = data.features[0];

  // GeoJSON: [lng, lat] -> ibalik natin sa [lat, lng] para sa Leaflet
  const routeCoords = feature.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

  return {
    coordinates: routeCoords,
    distanceMeters: feature.properties.summary.distance,
    durationSeconds: feature.properties.summary.duration,
  };
}