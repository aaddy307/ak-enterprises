"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const categories = [
  { value: "apartment", label: "Flats / Apartments", type: "residential" },
  { value: "villa", label: "Villas / Houses", type: "residential" },
  { value: "retail", label: "Shops / Retail Spaces", type: "commercial" },
  { value: "office", label: "Offices / Commercial Suites", type: "commercial" },
];

export function Hero() {
  const [searchType, setSearchType] = useState("buy");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const router = useRouter();

  const filteredCategories = categories.filter((cat) => {
    if (searchType === "rent") {
      return cat.value === "apartment" || cat.value === "retail";
    }
    return true;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategoryId) {
      params.set("subtype", selectedCategoryId);
      const cat = categories.find((c) => c.value === selectedCategoryId);
      if (cat) {
        params.set("type", cat.type);
      }
    } else {
      if (searchType === "buy") {
        params.set("type", "residential");
      }
    }
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/HeroBanner.jpg"
          alt="Luxury villa at dusk in Ambernath"
          fill
          sizes="100vw"
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/55 to-surface" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        <motion.h1
          variants={itemVariants}
          className="font-headline text-5xl md:text-6xl lg:text-7xl text-white mb-8 text-glow"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2.5rem, 8vw, 4rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            fontWeight: 700,
            textShadow: "2px 4px 16px rgba(0, 0, 0, 0.7), 0 2px 4px rgba(0, 0, 0, 0.5)"
          }}
        >
          Find Your Dream Property in Ambernath
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="bg-surface/90 backdrop-blur-md p-3 rounded-xl border border-primary/30 max-w-3xl mx-auto shadow-2xl"
        >
          <div className="flex gap-2 p-1 bg-surface-container-low rounded-lg w-fit mx-auto mb-4">
            <button
              onClick={() => setSearchType("buy")}
              className={`px-6 py-2 rounded-md font-semibold text-sm transition-all ${
                searchType === "buy"
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface hover:bg-surface-variant"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setSearchType("rent")}
              className={`px-6 py-2 rounded-md font-semibold text-sm transition-all ${
                searchType === "rent"
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface hover:bg-surface-variant"
              }`}
            >
              Rent
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 p-2">
            <div className="flex-1 relative">
              <Icon
                name="home"
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
              />
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full bg-surface-container-low border border-outline/20 rounded-lg pl-12 pr-10 py-4 focus:outline-none focus:border-primary transition-all text-on-surface appearance-none cursor-pointer"
              >
                <option value="" className="bg-surface-container text-on-surface">
                  Select a Category...
                </option>
                {filteredCategories.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-surface-container text-on-surface">
                    {cat.label}
                  </option>
                ))}
              </select>
              <Icon
                name="expand_more"
                size={20}
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary"
              />
            </div>
            <Button type="submit" size="lg" icon="search">
              Search
            </Button>
          </form>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Icon name="keyboard_arrow_down" size={32} className="text-primary/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
