"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileTabBar from "@/components/MobileTabBar";
import Footer from "@/components/Footer";

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isMapPage = pathname === "/";

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {children}
          {!isMapPage && <Footer />}
        </main>
        <MobileTabBar />
      </div>
    </div>
  );
}
