# BUSahero (TypeScript)

A real-time bus tracking, route planning, seat availability, and fare
calculator web app for commuters travelling between Olongapo City and
Zambales. Built with Next.js (App Router, TypeScript) and Tailwind CSS.
No login required — the app is fully open to any visitor.

## Getting started

Extract this project into its own empty folder (don't merge it into an
existing project folder), then:

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in your browser. Keep the `npm run dev`
terminal window open — that's what's serving the site.

## Pages

- `/` — Live Bus Tracking (interactive Leaflet map with live bus positions)
- `/route-planner` — Step-by-step route progress per bus line
- `/seat-availability` — Seat maps for upcoming trips
- `/fare-calculator` — Estimate fares between municipalities
- `/mission`, `/vision`, `/about` — About the app
- `/privacy-policy`, `/terms` — Legal pages

## Notes

- The map uses OpenStreetMap tiles via Leaflet/react-leaflet — no API key needed.
- All bus positions, seat maps, and fares are simulated/mock data for demo purposes.
- The "Apply 20% Discount" toggle is shared app-wide via React context and affects
  the Fare Calculator.
- TypeScript is configured with `strict: false` to keep things simple; tighten it
  in `tsconfig.json` any time you want stricter type checking.
