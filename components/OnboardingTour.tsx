"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  IconMap,
  IconRoute,
  IconWallet,
  IconChevronLeft,
  IconChevronRight,
} from "@/components/Icons";

const slides = [
  {
    image: "/busahero-logo.jpg",
    title: "Welcome to BUSahero 😄",
    description: "Let's get to know what you can do with BUSahero.",
  },
  {
    icon: IconMap,
    title: "Live Bus Tracking",
    description:
      "See real-time bus positions on the map as they travel between Olongapo City and Zambales.",
  },
  {
    marker: true,
    title: "Tap a Bus for Details",
    description:
      "Tap any bus marker to see its speed, current status, and estimated time of arrival to your location.",
  },
  {
    icon: IconRoute,
    title: "Route",
    description:
      "Check which stops a bus has already passed and which ones are still ahead on its trip.",
  },
  {
    icon: IconWallet,
    title: "Calculate Your Fare",
    description: "Estimate your trip cost between any two municipalities before you go.",
  },
];

const STORAGE_KEY = "busahero_onboarding_seen";

export default function OnboardingTour() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    try {
      const seen = window.localStorage.getItem(STORAGE_KEY);
      if (!seen) setVisible(true);
    } catch {
      // localStorage unavailable (e.g. blocked) — just skip onboarding
    }
  }, []);

  const close = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  };

  if (!visible) return null;

  const slide = slides[index];
  const isLast = index === slides.length - 1;
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-slate-50 px-6 py-8">
      <div className="flex justify-end">
        <button
          onClick={close}
          className="text-sm font-medium text-slate-400 hover:text-slate-600"
        >
          Close
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {slide.image ? (
          <span className="mb-8 flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl bg-brand text-white shadow-xl">
            <Image
              src={slide.image}
              alt="BUSahero"
              width={128}
              height={128}
              className="h-full w-full object-cover"
            />
          </span>
        ) : slide.marker ? (
          <div className="relative mb-10 flex h-32 w-32 items-center justify-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border-[6px] border-white bg-brand text-5xl shadow-xl">
              🚌
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 border-l-[14px] border-r-[14px] border-t-[16px] border-l-transparent border-r-transparent border-t-white" />
            </div>
          </div>
        ) : (
          <span className="mb-8 flex h-32 w-32 items-center justify-center rounded-3xl bg-brand text-white shadow-xl">
            <Icon size={56} />
          </span>
        )}
        <h2 className="mb-3 text-2xl font-bold text-slate-800">{slide.title}</h2>
        <p className="max-w-xs text-sm leading-relaxed text-slate-500">{slide.description}</p>
      </div>

      <div className="flex items-center justify-between">
        {index > 0 ? (
          <button
            onClick={() => setIndex((i) => i - 1)}
            aria-label="Previous"
            className="flex h-11 w-11 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            <IconChevronLeft size={22} />
          </button>
        ) : (
          <span className="h-11 w-11" />
        )}

        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-brand" : "w-2 bg-slate-300"
              }`}
            />
          ))}
        </div>

        {isLast ? (
          <button
            onClick={close}
            className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-brand-dark"
          >
            Let's Go!
          </button>
        ) : (
          <button
            onClick={() => setIndex((i) => i + 1)}
            aria-label="Next"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white shadow-lg hover:bg-brand-dark"
          >
            <IconChevronRight size={22} />
          </button>
        )}
      </div>
    </div>
  );
}