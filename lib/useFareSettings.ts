// lib/useFareSettings.ts
"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db, hasFirebaseConfig } from "@/lib/firebase";
import { FareSettings } from "@/types/fareSettings";

const DEFAULT_FARE_SETTINGS: FareSettings = {
  baseDistanceKm: 5,
  baseFare: 12,
  discountPercent: 20,
  perKmRate: 2.2,
  updatedAt: 0,
};

export function useFareSettings() {
  const [settings, setSettings] = useState<FareSettings>(DEFAULT_FARE_SETTINGS);
  const [loading, setLoading] = useState<boolean>(hasFirebaseConfig);

  useEffect(() => {
    if (!hasFirebaseConfig || !db) {
      setSettings(DEFAULT_FARE_SETTINGS);
      setLoading(false);
      return;
    }

    const fareRef = ref(db, "fareSettings");

    const unsubscribe = onValue(
      fareRef,
      (snapshot) => {
        const data = snapshot.val();

        if (data) {
          setSettings({
            baseDistanceKm:
              Number(data.baseDistanceKm) ||
              DEFAULT_FARE_SETTINGS.baseDistanceKm,
            baseFare: Number(data.baseFare) || DEFAULT_FARE_SETTINGS.baseFare,
            discountPercent:
              Number(data.discountPercent) ||
              DEFAULT_FARE_SETTINGS.discountPercent,
            perKmRate:
              Number(data.perKmRate) || DEFAULT_FARE_SETTINGS.perKmRate,
            updatedAt: Number(data.updatedAt) || 0,
          });
        } else {
          setSettings(DEFAULT_FARE_SETTINGS);
        }

        setLoading(false);
      },
      (error) => {
        console.error(
          "Firebase fareSettings read failed, falling back to defaults:",
          error
        );

        setSettings(DEFAULT_FARE_SETTINGS);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { settings, loading };
}
