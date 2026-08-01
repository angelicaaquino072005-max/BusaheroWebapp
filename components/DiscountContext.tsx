"use client";

import { createContext, useContext, useState } from "react";

const DiscountContext = createContext(null);

export function DiscountProvider({ children }) {
  const [discountApplied, setDiscountApplied] = useState(false);
  return (
    <DiscountContext.Provider value={{ discountApplied, setDiscountApplied }}>
      {children}
    </DiscountContext.Provider>
  );
}

export function useDiscount() {
  const ctx = useContext(DiscountContext);
  if (!ctx) {
    throw new Error("useDiscount must be used within a DiscountProvider");
  }
  return ctx;
}
