import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const navigation = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/properties" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const contactInfo = {
  phone: "+91 98765 43210",
  email: "info@akenterprises.in",
  address: "Office 101, Gold Crest Business Hub, Ambernath East, Maharashtra 421501",
  hours: "Mon - Sat: 9:00 AM - 7:00 PM",
};

export const whyChooseUs = [
  {
    icon: "verified_user",
    title: "Trusted",
    description: "Over 15 years of building trust through transparent dealings.",
  },
  {
    icon: "verified",
    title: "Verified",
    description: "Every property undergoes a rigorous 50-point legal verification.",
  },
  {
    icon: "sell",
    title: "Best Deals",
    description: "Exclusive inventory and competitive prices direct from builders.",
  },
  {
    icon: "map",
    title: "Local Expertise",
    description: "Deeply rooted in Ambernath with local market insights.",
  },
];

export const stats = [
  { value: "500+", label: "Properties Sold" },
  { value: "10+", label: "Years Experience" },
  { value: "1000+", label: "Happy Clients" },
  { value: "50+", label: "Localities" },
];
