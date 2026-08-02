"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileTabBar from "@/components/MobileTabBar";
import Footer from "@/components/Footer";

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const isMapPage = pathname === "/";

  const hideSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={hideSidebar} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          {children}
          {!isMapPage && <Footer />}
        </main>
        <MobileTabBar />
      </div>
    </div>
  );
}