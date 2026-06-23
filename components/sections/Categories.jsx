"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const CATEGORY_ICONS = {
  residential: "home",
  commercial: "building2",
  industrial: "factory",
  agricultural: "tractor",
  "plot-land": "map-pin",
};

export function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .catch(() => {});
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 max-w-[1440px] mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-headline text-on-surface text-center mb-10 md:mb-16"
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(1.75rem, 4vw, 3rem)",
          lineHeight: 1.2,
          fontWeight: 600,
        }}
      >
        Browse by Category
      </motion.h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
        {categories.map((cat, index) => (
          <motion.div
            key={cat._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              delay: index * 0.08,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <Link
              href={`/properties?type=${cat.slug}`}
              className="flex flex-col items-center justify-center gap-3 p-6 sm:p-8 rounded-2xl border border-outline/10 bg-surface-container-low hover:border-primary/40 hover:bg-surface-container-high transition-all duration-300 group text-center h-full"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon name={CATEGORY_ICONS[cat.slug] || "home"} size={24} className="text-primary" />
              </div>
              <h3
                className="font-headline text-on-surface font-semibold"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)",
                  lineHeight: 1.3,
                }}
              >
                {cat.name}
              </h3>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
