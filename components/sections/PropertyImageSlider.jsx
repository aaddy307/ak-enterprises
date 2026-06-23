"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function PropertyImageSlider({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeIndex = images.length > 0 ? Math.min(activeIndex, images.length - 1) : 0;

  if (!images || images.length === 0) {
    return (
      <div className="relative h-[480px] w-full rounded-2xl bg-surface-container flex items-center justify-center border border-outline/10 text-on-surface-variant">
        No Images Available
      </div>
    );
  }

  // Determine what thumbnails to show
  // We show up to 4 regular thumbnails and 1 "More" thumbnail if there are more than 4 images
  const showMoreThumbnail = images.length > 4;
  const visibleThumbnails = showMoreThumbnail ? images.slice(0, 4) : images;

  return (
    <div className="space-y-4">
      {/* Big Main Image */}
      <div className="relative h-[480px] w-full rounded-2xl overflow-hidden border border-outline/10 bg-surface-container">
        <Image
          src={images[safeIndex]}
          alt="Property Main Image"
          fill
          className="object-cover transition-transform duration-700 hover:scale-102"
          sizes="(max-width: 1200px) 100vw, 80vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Thumbnail Carousel Row */}
      <div className="grid grid-cols-5 gap-3.5">
        {visibleThumbnails.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "relative h-20 md:h-24 w-full rounded-lg overflow-hidden border-2 transition-all cursor-pointer",
              safeIndex === idx
                ? "border-primary"
                : "border-transparent hover:border-primary/50"
            )}
          >
            <Image
              src={img}
              alt={`Property thumbnail ${idx + 1}`}
              fill
              className="object-cover"
              sizes="15vw"
            />
          </button>
        ))}

        {/* "+More" Thumbnail if images exceed 4 */}
        {showMoreThumbnail && (
          <button
            onClick={() => setActiveIndex(safeIndex === images.length - 1 ? 4 : safeIndex + 1)}
            className={cn(
              "relative h-20 md:h-24 w-full rounded-lg overflow-hidden border-2 transition-all cursor-pointer",
              safeIndex >= 4
                ? "border-primary"
                : "border-transparent hover:border-primary/50"
            )}
          >
            <Image
              src={images[4]}
              alt="More images thumbnail"
              fill
              className="object-cover blur-[1px]"
              sizes="15vw"
            />
            <div className="absolute inset-0 bg-[#0d0d0d]/75 flex flex-col justify-center items-center gap-1 text-white select-none">
              {/* Camera Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
              <span className="text-[11px] font-bold tracking-widest text-primary uppercase mt-0.5">
                +{images.length - 4} More
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
