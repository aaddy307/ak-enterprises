"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./Badge";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

export function PropertyCard({ property, className, index = 0 }) {


  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  // Determine display status based on name and possession
  let displayStatus = "New";
  let statusColor = "text-primary"; // gold/primary for New and Pre-Launch
  if (property.name?.toLowerCase().includes("azure")) {
    displayStatus = "Resale";
    statusColor = "text-on-surface-variant";
  } else if (
    property.name?.toLowerCase().includes("business") ||
    property.status === "new-launch"
  ) {
    displayStatus = "Pre-Launch";
  } else if (property.possession === "Ready to Move") {
    displayStatus = "New";
  } else {
    displayStatus = "Pre-Launch";
  }

  // Parse BHK or Units
  const isCommercial = property.type === "commercial";
  const firstColLabel = isCommercial ? "UNITS" : "BHK";
  const firstColVal = isCommercial
    ? property.subtype === "retail"
      ? "Shops"
      : "Office"
    : property.configuration?.replace("BHK", "").trim() || "1 & 2";

  // Format Area
  const formattedArea = Number(property.area || 1000).toLocaleString();
  const areaDisplay = isCommercial ? `${formattedArea}+` : formattedArea;

  // Custom Badges matching the photo
  const showBadge = property.tag?.toLowerCase() !== "premium" && property.tag?.toLowerCase() !== "luxury";

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -6 }}
      className={cn(
        "group bg-[#181a1b] rounded-2xl overflow-hidden border border-outline/10",
        "transition-all duration-500 hover:border-primary/30",
        "property-card-hover",
        className
      )}
    >
      <div className="relative h-72 overflow-hidden">
        <Link href={`/property/${property.id}`} className="block w-full h-full">
          <motion.div
            className="relative w-full h-full"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Image
              src={property.images[0]}
              alt={property.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
        </Link>

        {/* Badge (Featured, Commercial) */}
        {showBadge && (
          <div className="absolute top-4 left-4 z-10">
            <span
              className={cn(
                "text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-md uppercase",
                isCommercial
                  ? "bg-[#333535] text-white"
                  : "bg-primary text-on-primary"
              )}
            >
              {property.tag}
            </span>
          </div>
        )}


      </div>

      <div className="p-6">
        {/* Title and Price inline row */}
        <div className="flex justify-between items-baseline mb-2 gap-4">
          <h3 className="font-headline text-[1.35rem] text-white font-semibold group-hover:text-primary transition-colors leading-tight truncate flex-1">
            <Link href={`/property/${property.id}`}>{property.name}</Link>
          </h3>
          <p className="text-primary font-bold text-lg shrink-0">
            {property.priceDisplay}
          </p>
        </div>

        {/* Location Row */}
        <p className="flex items-center gap-2 text-on-surface-variant text-sm mb-5">
          <Icon name="location_on" size={16} className="text-primary" />
          <span>{property.location.area}</span>
        </p>

        {/* 3-Column Specifications Grid */}
        <div className="grid grid-cols-3 gap-2 border-t border-outline/10 pt-4 pb-6">
          <div className="text-center border-r border-outline/10">
            <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">
              {firstColLabel}
            </p>
            <p className="text-white text-sm font-semibold">{firstColVal}</p>
          </div>
          <div className="text-center border-r border-outline/10">
            <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">
              SQ. FT.
            </p>
            <p className="text-white text-sm font-semibold">{areaDisplay}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">
              STATUS
            </p>
            <p className={cn("text-sm font-semibold", statusColor)}>
              {displayStatus}
            </p>
          </div>
        </div>

        {/* Footer buttons row */}
        <div className="flex gap-3">
          <Link
            href={`/property/${property.id}`}
            className="flex-1 py-3 px-4 border border-primary/40 text-primary hover:bg-primary/5 active:scale-[0.98] rounded-lg font-bold text-xs uppercase tracking-wider text-center transition-all"
          >
            VIEW DETAILS
          </Link>
          <a
            href={`https://wa.me/919876543210?text=Hi, I am interested in ${encodeURIComponent(
              property.name
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 border border-primary/40 text-primary hover:bg-primary/5 active:scale-[0.98] rounded-lg flex items-center justify-center transition-all cursor-pointer"
            title="WhatsApp Inquiry"
          >
            <Icon name="chat" size={18} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

