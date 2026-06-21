"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";

export function PropertyHero({ property }) {
  return (
    <section className="relative h-[500px] overflow-hidden">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
      >
        <Image
          src={property.images[0]}
          alt={property.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </motion.div>
      <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-surface/40" />
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-[1440px] mx-auto px-6 pb-12 w-full">
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-widest">
            <Link href="/" className="text-primary/80 hover:text-primary">
              Home
            </Link>
            <Icon name="chevron_right" size={12} />
            <Link href="/properties" className="text-primary/80 hover:text-primary">
              Properties
            </Link>
            <Icon name="chevron_right" size={12} />
            <span className="text-on-surface-variant">{property.name}</span>
          </div>
          <div className="flex items-end justify-between gap-6">
            <div>
              <Badge variant={property.tagType} className="mb-4">
                {property.tag}
              </Badge>
              <h1
                className="font-headline text-white mb-2"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  lineHeight: 1.2,
                  fontWeight: 600,
                }}
              >
                {property.name}
              </h1>
              <p className="flex items-center gap-2 text-on-surface-variant">
                <Icon name="location_on" size={20} />
                {property.location.full}
              </p>
            </div>
            <div className="text-right">
              <p className="text-primary font-bold text-3xl mb-1">
                {property.priceDisplay}
              </p>
              <p className="text-on-surface-variant text-sm">
                {property.area} {property.areaUnit}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
