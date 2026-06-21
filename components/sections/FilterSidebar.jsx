"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  // Fetch dynamic categories and locations on mount
  useEffect(() => {
    async function fetchFilters() {
      try {
        const [catRes, locRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/locations"),
        ]);
        const catData = await catRes.json();
        const locData = await locRes.json();
        setCategories(catData.data || []);
        setLocations(locData.data || []);
      } catch (err) {
        console.error("Failed to fetch filter data:", err);
      }
    }
    fetchFilters();
  }, []);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const currentCategory = searchParams.get("category") || "";
  const currentLocation = searchParams.get("location") || "";
  const currentBHK = searchParams.get("bhk") || "";
  const currentIntent = searchParams.get("intent") || "buy";

  const handleFilterChange = (name, value) => {
    router.push(`/properties?${createQueryString(name, value)}`);
  };

  const handleReset = () => {
    router.push("/properties");
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="sticky top-28 bg-[#181a1b] border border-outline/10 p-6 rounded-xl shadow-2xl">
        {/* Title and Reset Row */}
        <div className="flex items-center justify-between mb-6">
          <h3
            className="font-headline text-primary"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "1.6rem",
              fontWeight: 600,
            }}
          >
            Filters
          </h3>
          <button
            onClick={handleReset}
            className="text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold uppercase tracking-wider"
          >
            RESET
          </button>
        </div>

        {/* Buy/Rent Toggle */}
        <div className="flex p-1 bg-[#121414] rounded-lg mb-8 border border-outline/5">
          <button
            onClick={() => handleFilterChange("intent", "buy")}
            className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              currentIntent !== "rent"
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            BUY
          </button>
          <button
            onClick={() => handleFilterChange("intent", "rent")}
            className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              currentIntent === "rent"
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            RENT
          </button>
        </div>

        {/* Property Type Section — dynamic from DB categories */}
        <div className="mb-8 border-b border-outline/5 pb-6">
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-3">
            Property Type
          </label>
          <div className="relative">
            <select
              value={currentCategory}
              onChange={(e) => {
                const val = e.target.value;
                const params = new URLSearchParams(searchParams.toString());
                if (val) {
                  params.set("category", val);
                } else {
                  params.delete("category");
                }
                // Clear old type/subtype params if present
                params.delete("type");
                params.delete("subtype");
                router.push(`/properties?${params.toString()}`);
              }}
              className="w-full bg-[#121414] border border-outline-variant text-on-surface rounded-lg py-3 px-4 appearance-none focus:outline-none focus:border-primary transition-colors cursor-pointer text-sm"
            >
              <option value="" className="text-on-surface bg-[#181a1b]">
                All Types
              </option>
              {categories.map((cat) => (
                <option
                  key={cat._id}
                  value={cat.slug}
                  className="text-on-surface bg-[#181a1b]"
                >
                  {cat.name}
                </option>
              ))}
            </select>
            <Icon
              name="expand_more"
              size={18}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-primary"
            />
          </div>
        </div>

        {/* Location Section — dynamic from DB locations */}
        <div className="mb-8 border-b border-outline/5 pb-6">
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-3">
            Location
          </label>
          <div className="relative">
            <select
              value={currentLocation}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="w-full bg-[#121414] border border-outline-variant text-on-surface rounded-lg py-3 px-4 appearance-none focus:outline-none focus:border-primary transition-colors cursor-pointer text-sm"
            >
              <option value="" className="text-on-surface bg-[#181a1b]">
                All Locations
              </option>
              {locations.map((loc) => (
                <option
                  key={loc._id}
                  value={loc.name}
                  className="text-on-surface bg-[#181a1b]"
                >
                  {loc.name}
                </option>
              ))}
            </select>
            <Icon
              name="expand_more"
              size={18}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-primary"
            />
          </div>
        </div>

        {/* Configuration Section */}
        <div className="mb-8 border-b border-outline/5 pb-6">
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-4">
            Configuration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {["1", "2", "3", "4+"].map((bhk) => (
              <button
                key={bhk}
                onClick={() =>
                  handleFilterChange("bhk", currentBHK === bhk ? "" : bhk)
                }
                className={`py-2 border rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  currentBHK === bhk
                    ? "bg-primary text-on-primary border-primary"
                    : "border-outline-variant text-on-surface hover:border-primary"
                }`}
              >
                {bhk} BHK
              </button>
            ))}
          </div>
        </div>

        {/* Apply Filters Button */}
        <Button
          onClick={() => {
            const element = document.getElementById("properties-list");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
          variant="primary"
          className="w-full bg-primary text-on-primary hover:brightness-110 font-bold tracking-wider py-3.5 rounded-lg transition-all"
        >
          APPLY FILTERS
        </Button>
      </div>
    </motion.aside>
  );
}
