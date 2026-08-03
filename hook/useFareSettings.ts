"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

export type FareSettings = {
  baseDistanceKm: number;
  baseFare: number;
  discountPercent: number;
  perKmRate: number;
  updatedAt: number;
};

// Fallback values in case Firebase hasn't loaded yet or is unreachable.
const DEFAULT_FARE_SETTINGS: FareSettings = {
  baseDistanceKm: 5,
  baseFare: 12,
  discountPercent: 20,
  perKmRate: 2.2,
  updatedAt: 0,
};

export function useFareSettings() {
  const [fareSettings, setFareSettings] = useState<FareSettings>(DEFAULT_FARE_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fareRef = ref(db, "fareSettings");

    const unsubscribe = onValue(fareRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFareSettings({
          baseDistanceKm: Number(data.baseDistanceKm) || DEFAULT_FARE_SETTINGS.baseDistanceKm,
          baseFare: Number(data.baseFare) || DEFAULT_FARE_SETTINGS.baseFare,
          discountPercent: Number(data.discountPercent) || DEFAULT_FARE_SETTINGS.discountPercent,
          perKmRate: Number(data.perKmRate) || DEFAULT_FARE_SETTINGS.perKmRate,
          updatedAt: Number(data.updatedAt) || 0,
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { fareSettings, loading };
}