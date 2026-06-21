import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price) {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)} L`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export function getPropertyTypeIcon(type) {
  const icons = {
    residential: "home",
    commercial: "domain",
    apartment: "apartment",
    villa: "villa",
    retail: "storefront",
    office: "business",
  };
  return icons[type] || "home";
}

export function getTagColor(type) {
  const colors = {
    primary: "bg-primary text-on-primary",
    secondary: "bg-secondary-container text-on-secondary-container",
    tertiary: "bg-tertiary-container text-on-tertiary-container",
  };
  return colors[type] || colors.primary;
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

export const categories = [
  {
    id: "flats",
    title: "Flats for Sale",
    subtitle: "Explore Premium Ownership",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDeJm3nuWdOfLGd4a3s0GZF4CDqTJvH_wihf1Vu_gQuonYxNeWfgzAf41WSN-XErXQmvYxjsD-0sRKUdCnheqzt1F8ump-q2DhsBdipJL45tA4Qz3rhw5NQBaM9Pprfc25hsRmqlnsHymqvv1COeMBW_PdOMbt9yJ47JO69TIt0_rocgSKcH07KX8ZgerMKPT5x3Noqfy6ivS2_jTxEMP4nPGHx37FZ9k2hJjOUhPelLtF2NS1e_PVcCzLCjD3EoQMKABH5Em1m9I6",
    href: "/properties?type=residential",
  },
  {
    id: "villas",
    title: "Luxury Villas",
    subtitle: "Exclusive Living",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBlCigYq6x0oOSHY4OjwMZ1wFwwBUir9-NcBOU2x62O1X9aCe4Ftn5Wi7Ys6gzYgxKnR-jWE9cgCrNe3dct7dYCO_tSL9_yKdiEurHtIvt22_FIFomyIm3B07841jTLPz4Nu8NLbr7WdTDbAir_Sf1kK8eF9lJLnX9BYJ_WxO7suJuFHjD3idxbCqRtUqjVWt9sz1mYDfTFjrLUXL-rtg3NF_9LRzWgIn0fujDWrlDRKFg8tN4SZOV_Rcd1M4FN23T001x_SoVWbjRN",
    href: "/properties?type=residential&subtype=villa",
  },
  {
    id: "commercial",
    title: "Commercial Spaces",
    subtitle: "Strategic Investments",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBySZgijgqsHPEwL1f4Yjcv2UlwMWVXi0P4Q6QbbLA4Ux_OxxrTqfb3KgBCIka6DBmDLnA82Y_Gj-FKDVUzndGb_PyI961eZeSlrGl4Rhsdq9MUOJF5rP6pkR8NSfHB-j5p7XS1hKYMjY4Lwl3xpwUmG8NPH1XOJfHwQSTfGJ_en2wgx9xnZrrFSilHSLl_F77hw-ZSYwLIEXnmfTNztY66Zjvecu0EpJxmOpeshhNr0oNWThJ-CXQlym9hV0Hl-eC4u1qhBloK_ZMn",
    href: "/properties?type=commercial",
  },
];
