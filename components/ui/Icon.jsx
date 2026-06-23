"use client";

import {
  ChevronRight,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Clock,
  Share2,
  Globe,
  MessageCircle,
  Heart,
  BedDouble,
  Maximize2,
  Store,
  Building2,
  Menu,
  X,
  Loader2,
  User,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Map,
  ArrowRight,
  Car,
  Layers,
  Bath,
  Search,
  SearchX,
  Home,
  Fence,
  Check,
  Eye,
  EyeOff,
  Plus,
  Minus,
  ExternalLink,
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  Star,
  StarHalf,
  Calendar,
  DollarSign,
  Ruler,
  Package,
  Key,
  Handshake,
  Award,
  Users,
  TrendingUp,
  Building,
  Warehouse,
  Tractor,
  Factory,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  chevron_right: ChevronRight,
  chevron_down: ChevronDown,
  expand_more: ChevronDown,
  location_on: MapPin,
  map_pin: MapPin,
  "map-pin": MapPin,
  phone: Phone,
  mail: Mail,
  email: Mail,
  schedule: Clock,
  clock: Clock,
  share: Share2,
  language: Globe,
  globe: Globe,
  chat: MessageCircle,
  message_circle: MessageCircle,
  keyboard_arrow_down: ChevronDown,
  favorite_border: Heart,
  favorite: Heart,
  heart: Heart,
  bed: BedDouble,
  bed_double: BedDouble,
  straighten: Maximize2,
  maximize: Maximize2,
  storefront: Store,
  store: Store,
  domain: Building2,
  building: Building2,
  building_2: Building2,
  building2: Building2,
  menu: Menu,
  close: X,
  x: X,
  hourglass_empty: Loader2,
  loader: Loader2,
  loader_2: Loader2,
  person: User,
  user: User,
  verified_user: ShieldCheck,
  shield_check: ShieldCheck,
  verified: CheckCircle2,
  check_circle: CheckCircle2,
  sell: Tag,
  tag: Tag,
  map: Map,
  arrow_forward: ArrowRight,
  arrow_right: ArrowRight,
  arrow_right_alt: ArrowRight,
  local_parking: Car,
  car: Car,
  parking: Car,
  layers: Layers,
  balcony: Fence,
  fence: Fence,
  bathroom: Bath,
  bath: Bath,
  droplet: Bath,
  search: Search,
  search_off: SearchX,
  home: Home,
  check: Check,
  visibility: Eye,
  visibility_off: EyeOff,
  add: Plus,
  remove: Minus,
  minus: Minus,
  external_link: ExternalLink,
  link: ExternalLink,
  filter: Filter,
  sliders: SlidersHorizontal,
  grid: Grid3X3,
  list: List,
  star: Star,
  star_half: StarHalf,
  calendar: Calendar,
  dollar: DollarSign,
  price: DollarSign,
  ruler: Ruler,
  area: Ruler,
  box: Package,
  package: Package,
  key: Key,
  handshake: Handshake,
  award: Award,
  users: Users,
  trending: TrendingUp,
  building_1: Building,
  warehouse: Warehouse,
  tractor: Tractor,
  factory: Factory,
};

const socialIcons = {
  instagram: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  ),
  facebook: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  twitter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
    </svg>
  ),
  linkedin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  youtube: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
      <path d="m10 15 5-3-5-3z"/>
    </svg>
  ),
  whatsapp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
};

export function Icon({
  name,
  size = 24,
  className,
  strokeWidth = 1.5,
  ...props
}) {
  const normKey = name ? name.toLowerCase() : "";
  if (socialIcons[normKey]) {
    return (
      <span
        className={cn("shrink-0 inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        {socialIcons[normKey]()}
      </span>
    );
  }

  const IconComponent = iconMap[name] || ChevronRight;

  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}
