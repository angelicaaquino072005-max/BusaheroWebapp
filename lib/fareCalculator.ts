//lib/fareCalculator.ts
import { FareSettings } from "@/types/fareSettings";

export interface FareBreakdown {
  distanceKm: number;
  regular: number;
  discounted: number;
}

function roundToNearestQuarter(value: number): number {
  return Math.round(value * 4) / 4;
}

export function calculateFare(
  distanceKm: number,
  settings: FareSettings,
  discounted: boolean = false
): number {
  const { baseFare, baseDistanceKm, perKmRate, discountPercent } = settings;

  if (!Number.isFinite(distanceKm) || distanceKm <= 0) return 0;

  let fare =
    distanceKm <= baseDistanceKm
      ? baseFare
      : baseFare + (distanceKm - baseDistanceKm) * perKmRate;

  if (discounted) {
    fare = fare * (1 - discountPercent / 100);
    fare = roundToNearestQuarter(fare);
  }

  return fare;
}

export function getFareBreakdown(
  distanceKm: number,
  settings: FareSettings
): FareBreakdown {
  return {
    distanceKm,
    regular: calculateFare(distanceKm, settings, false),
    discounted: calculateFare(distanceKm, settings, true),
  };
}

export function formatPeso(amount: number): string {
  return `₱${amount.toFixed(2)}`;
}
