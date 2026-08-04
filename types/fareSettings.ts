//types/fareSettings.ts

export interface FareSettings {
  baseFare: number; // e.g. 12.00 for the first baseDistanceKm
  baseDistanceKm: number; // e.g. 5
  perKmRate: number; // e.g. 2.20 per km after baseDistanceKm
  discountPercent: number; // e.g. 20 (Student/Elderly/PWD)
  updatedAt: number;
}
