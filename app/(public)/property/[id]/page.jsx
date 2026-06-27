import { notFound } from "next/navigation";
import { cache } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { PropertyImageSlider } from "@/components/sections/PropertyImageSlider";
import { PropertyInquiryForm } from "@/components/sections/PropertyInquiryForm";
import { getPropertyById, getRelatedProperties } from "@/lib/properties";
import dbConnect from "@/lib/db/connect";
import Property from "@/lib/db/models/Property";
import Contact from "@/lib/db/models/Contact";
import { mapDbPropertyToPublic } from "@/lib/db/utils";

const AMENITY_ICONS = {
  "Infinity Pool": (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6c.6.5 1.2 1 2.5 1C6 7 7 6 8.5 6c1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 1.9-.5 2.5-1M2 12c.6.5 1.2 1 2.5 1 1.5 0 2.5-1 4-1s2.5 1 4 1 2.5-1 4-1 2.5 1 4 1 1.9-.5 2.5-1M2 18c.6.5 1.2 1 2.5 1 1.5 0 2.5-1 4-1s2.5 1 4 1 2.5-1 4-1 2.5 1 4 1 1.9-.5 2.5-1"/></svg>
  ),
  "Private Gym": (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6.5 6.5 11 11M3 21l3-3M21 3l-3 3M3 14l5-5M16 21l5-5M6.5 6.5l-3 3M17.5 17.5l3-3M6.5 6.5 10 3M17.5 17.5 14 21M3 14l3 3M18 7l3 3"/></svg>
  ),
  "24/7 Concierge": (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  "Wine Cellar": (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 22H2M6 22V9c0-1.7 1.3-3 3-3V2h6v4c1.7 0 3 1.3 3 3v13"/></svg>
  ),
  "Smart Automation": (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  ),
  "Green Terrace": (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 2 2 7a7 7 0 0 1-10 11z"/><path d="M9 22v-4"/></svg>
  ),
  "CCTV Security": (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
  ),
  "Kids Play Area": (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>
  ),
  "Clubhouse": (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  "Jogging Track": (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M18 8a8 8 0 0 0-8 8v1"/></svg>
  ),
  "Power Backup": (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
  "High-Speed Elevators": (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="9 10 12 7 15 10"/><polyline points="15 14 12 17 9 14"/></svg>
  )
};

const DEFAULT_AMENITY_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
);

const fetchPropertyData = cache(async (id) => {
  let property = null;
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  if (isValidObjectId) {
    try {
      await dbConnect();
      const dbProp = await Property.findById(id).populate("category", "name slug").lean();
      if (dbProp) {
        property = mapDbPropertyToPublic(dbProp);
      }
    } catch (e) {
      console.error("Error fetching property from DB by ID:", e);
    }
  }

  if (!property) {
    property = getPropertyById(id);
  }
  return property;
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  const property = await fetchPropertyData(id);
  if (!property) return { title: "Property Not Found" };

  return {
    title: property.name,
    description: property.description,
  };
}

export default async function PropertyDetailPage({ params }) {
  const { id } = await params;
  const property = await fetchPropertyData(id);

  if (!property) {
    notFound();
  }

  let whatsappNumber = "919876543210";
  let phoneNumber = "+919876543210";
  try {
    await dbConnect();
    const contactInfo = await Contact.findOne().sort({ createdAt: -1 }).lean();
    if (contactInfo && contactInfo.phone && contactInfo.phone.length > 0) {
      phoneNumber = contactInfo.phone[0];
      whatsappNumber = phoneNumber.replace(/\D/g, "");
    }
  } catch (error) {
    console.error("Error loading contact for property detail:", error);
  }

  let relatedProperties = [];
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  if (isValidObjectId) {
    try {
      await dbConnect();
      const dbRelated = await Property.find({
        _id: { $ne: id },
        status: "active"
      })
      .populate("category", "name slug")
      .limit(3)
      .lean();
      relatedProperties = dbRelated.map(mapDbPropertyToPublic);
    } catch (e) {
      console.error("Error fetching related properties from DB:", e);
    }
  }

  if (relatedProperties.length === 0) {
    relatedProperties = getRelatedProperties(id, 3);
  }

  // Fallback rating and specs for mock look
  const isAmberHeights = property.name?.toLowerCase().includes("amber");
  const bedroomsCount = property.features?.bedrooms !== undefined ? property.features.bedrooms : (isAmberHeights ? 5 : 3);
  const bathroomsCount = property.features?.bathrooms !== undefined ? property.features.bathrooms : (isAmberHeights ? 6 : bedroomsCount + 1);
  const parkingCount = property.features?.parking !== undefined ? property.features.parking : (isAmberHeights ? 3 : 2);
  const areaVal = property.area || (isAmberHeights ? 4200 : 1200);

  const rawAmenities = property.amenities !== undefined
    ? property.amenities
    : ["Infinity Pool", "Private Gym", "24/7 Concierge", "Wine Cellar", "Smart Automation", "Green Terrace"];
  const displayAmenities = Array.from(new Set(rawAmenities));

  return (
    <>
      <main className="max-w-[1440px] mx-auto px-6 pt-28 pb-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Icon name="chevron_right" size={12} className="text-primary" />
          <Link href="/properties" className="hover:text-primary transition-colors">
            Properties
          </Link>
          <Icon name="chevron_right" size={12} className="text-primary" />
          <span className="text-primary-container">{property.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Image Slider & Details */}
          <div className="lg:col-span-8 space-y-10">
            {/* Property Image Slider */}
            <PropertyImageSlider images={property.images} />

            {/* Title, Badge & Price section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-4 border-b border-outline/10 pb-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-headline text-3xl md:text-4xl text-white font-semibold leading-tight">
                    {property.name}
                  </h1>
                  <span className="text-[10px] font-bold tracking-widest text-primary border border-primary/40 bg-primary/5 px-2.5 py-1.5 rounded-md uppercase shrink-0">
                    NEGOTIABLE
                  </span>
                </div>
                <p className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <Icon name="location_on" size={16} className="text-primary" />
                  <span>{property.location?.full || property.location || "Ambernath, MH"}</span>
                </p>
              </div>
              <div className="shrink-0 text-left md:text-right">
                <p className="text-primary font-bold text-3xl md:text-4xl">
                  {property.priceDisplay}
                </p>
              </div>
            </div>

            {/* Key Specs Pills Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#181a1b] p-4 rounded-xl border border-outline/10 flex items-center gap-3.5 shadow-md">
                <Icon name="bed" size={22} className="text-primary" />
                <div>
                  <p className="text-white font-bold text-sm leading-none mb-0.5">{bedroomsCount} Bedrooms</p>
                  <p className="text-[9px] font-bold tracking-widest text-on-surface-variant uppercase">Bedrooms</p>
                </div>
              </div>
              <div className="bg-[#181a1b] p-4 rounded-xl border border-outline/10 flex items-center gap-3.5 shadow-md">
                <Icon name="bathroom" size={22} className="text-primary" />
                <div>
                  <p className="text-white font-bold text-sm leading-none mb-0.5">{bathroomsCount} Bathrooms</p>
                  <p className="text-[9px] font-bold tracking-widest text-on-surface-variant uppercase">Bathrooms</p>
                </div>
              </div>
              <div className="bg-[#181a1b] p-4 rounded-xl border border-outline/10 flex items-center gap-3.5 shadow-md">
                <Icon name="straighten" size={22} className="text-primary" />
                <div>
                  <p className="text-white font-bold text-sm leading-none mb-0.5">{areaVal.toLocaleString()} {property.areaUnit || "sq.ft"}</p>
                  <p className="text-[9px] font-bold tracking-widest text-on-surface-variant uppercase">Area</p>
                </div>
              </div>
              <div className="bg-[#181a1b] p-4 rounded-xl border border-outline/10 flex items-center gap-3.5 shadow-md">
                <Icon name="parking" size={22} className="text-primary" />
                <div>
                  <p className="text-white font-bold text-sm leading-none mb-0.5">{parkingCount} Parking</p>
                  <p className="text-[9px] font-bold tracking-widest text-on-surface-variant uppercase">Parking</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <section className="space-y-4">
              <h2 className="font-headline text-2xl text-white font-semibold">
                Description
              </h2>
              <p className="text-on-surface-variant text-base leading-relaxed">
                {property.description}
              </p>
              {isAmberHeights && (
                <p className="text-on-surface-variant text-base leading-relaxed mt-2">
                  Designed for the discerning entertainer, the property features a private rooftop terrace with a temperature-controlled infinity pool, a state-of-the-art cinema room, and a professional-grade kitchen.
                </p>
              )}
            </section>

            {/* World-Class Amenities Grid */}
            {displayAmenities.length > 0 && (
              <section className="space-y-6">
                <h2 className="font-headline text-2xl text-white font-semibold">
                  World-Class Amenities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {displayAmenities.map((amenity, idx) => {
                    const icon = AMENITY_ICONS[amenity] || DEFAULT_AMENITY_ICON;
                    return (
                      <div key={idx} className="bg-[#181a1b] border border-outline/10 rounded-xl p-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          {icon}
                        </span>
                        <span className="text-sm font-semibold text-white">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Agent Profile & Forms */}
          <div className="lg:col-span-4 space-y-6">
            {/* Agent Info Card */}
            <div className="bg-[#181a1b] border border-outline/10 p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-outline/20 bg-surface-container">
                  <Image
                    src="/Contact.jpg"
                    alt="Ayub Khan"
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-base">Ayub Khan</h4>
                  <p className="text-on-surface-variant text-xs mb-1">Exclusive Listing Agent</p>
                  {/* 5 Gold Stars */}
                  <div className="flex gap-0.5 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z"/></svg>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call and WhatsApp CTA buttons */}
              <div className="space-y-3">
                <a
                  href={`tel:${phoneNumber}`}
                  className="w-full bg-primary hover:brightness-110 text-on-primary font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-primary/10"
                >
                  <Icon name="phone" size={14} />
                  Call Now
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Hi,%20I%20am%20interested%20in%20${encodeURIComponent(
                    property.name
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-transparent hover:bg-emerald-500/5 text-[#10b981] hover:text-[#10b981] border border-[#10b981]/40 hover:border-[#10b981] font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Icon name="chat" size={14} className="text-[#10b981]" />
                  WhatsApp Inquiry
                </a>
              </div>
            </div>

            {/* Express Interest Card */}
            <div className="bg-[#181a1b] border border-outline/10 p-6 rounded-2xl shadow-2xl">
              <h4 className="text-[11px] font-bold tracking-widest text-on-surface-variant uppercase mb-4">
                Express Interest
              </h4>
              <PropertyInquiryForm propertyName={property.name} />
            </div>

            {/* Listing Insights Card */}
            <div className="bg-[#181a1b] border border-outline/10 p-6 rounded-2xl shadow-2xl space-y-4">
              <h4 className="text-[11px] font-bold tracking-widest text-on-surface-variant uppercase border-b border-outline/5 pb-2">
                Listing Insights
              </h4>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">Days on Market</span>
                <span className="text-white font-semibold">12 Days</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">Views this week</span>
                <span className="text-white font-semibold">1,420</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">Neighborhood Rating</span>
                <span className="text-primary font-bold">9.8/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties / Suggestions Section */}
        {relatedProperties.length > 0 && (
          <section className="mt-20 border-t border-outline/10 pt-16">
            <h2
              className="font-headline text-on-surface mb-8 text-center text-3xl font-bold"
              style={{
                fontFamily: "var(--font-playfair)",
              }}
            >
              Similar Properties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProperties.map((prop, index) => (
                <PropertyCard key={prop.id} property={prop} index={index} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
