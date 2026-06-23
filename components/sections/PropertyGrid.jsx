"use client";

import Link from "next/link";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Button } from "@/components/ui/Button";

export function PropertyGrid({ properties, title, subtitle, showViewAll = true }) {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-6">
        <div>
          {subtitle && (
            <span className="text-primary text-xs font-semibold uppercase tracking-[0.2em] block mb-4">
              {subtitle}
            </span>
          )}
          <h2
            className="font-headline text-on-surface"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              lineHeight: 1.2,
              fontWeight: 600,
            }}
          >
            {title}
          </h2>
        </div>
        {showViewAll && (
          <Link href="/properties">
            <Button variant="ghost" icon="arrow_forward" iconPosition="right">
              View All Properties
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property, index) => (
          <PropertyCard key={property.id} property={property} index={index} />
        ))}
      </div>
    </section>
  );
}
