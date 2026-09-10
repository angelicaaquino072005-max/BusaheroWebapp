import {
  IconMap,
  IconRoute,
  IconWallet,
  IconFlag,
  IconEye,
  IconInfo,
  IconShield,
  IconFileText,
  IconCompass,
} from "@/components/Icons";

export const primaryNav = [
  { href: "/", label: "Live Tracking", title: "Live Bus Tracking", icon: IconMap },
  { href: "/route-planner", label: "Route", title: "Route", icon: IconRoute },
  { href: "/fare-calculator", label: "Fare Calculator", title: "Fare Calculator", icon: IconWallet },
];

export const infoNav = [
  { href: "/mission", label: "Mission", title: "Mission", icon: IconFlag },
  { href: "/vision", label: "Vision", title: "Vision", icon: IconEye },
  { href: "/about", label: "About Us", title: "About BUSahero", icon: IconInfo },
  { href: "/privacy-policy", label: "Privacy Policy", title: "Privacy Policy", icon: IconShield },
  { href: "/terms", label: "Terms & Conditions", title: "Terms & Conditions", icon: IconFileText },
];

// Not rendered in the sidebar anymore — How to Use now opens from the
// help icon in the header instead. Kept here only so titleForPath()
// still shows the right page title in the header when visiting it.
export const hiddenNav = [
  { href: "/how-to-use", label: "How to Use", title: "How to Use BUSahero", icon: IconCompass },
];

export const allNav = [...primaryNav, ...infoNav, ...hiddenNav];

export function titleForPath(pathname) {
  const match = allNav.find((item) => item.href === pathname);
  return match ? match.title : "BUSahero";
}