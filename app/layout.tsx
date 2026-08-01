import "leaflet/dist/leaflet.css";
import "./globals.css";
import { DiscountProvider } from "@/components/DiscountContext";
import AppShell from "@/components/AppShell";

export const metadata = {
  title: "BUSahero — Live Bus Tracking for Olongapo & Zambales",
  description:
    "Real-time bus tracking, route planning, seat availability and fare calculation for commuters travelling between Olongapo City and Zambales. No login required.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DiscountProvider>
          <AppShell>{children}</AppShell>
        </DiscountProvider>
      </body>
    </html>
  );
}
