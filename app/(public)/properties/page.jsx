"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { FilterSidebar } from "@/components/sections/FilterSidebar";
import { Icon } from "@/components/ui/Icon";

function PropertiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "";
  const location = searchParams.get("location") || "";
  const bhk = searchParams.get("bhk") || "";
  const intent = searchParams.get("intent") || "buy";
  const sort = searchParams.get("sort") || "price-desc";

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (category) queryParams.set("category", category);
        if (location) queryParams.set("location", location);
        if (bhk) queryParams.set("bhk", bhk);
        if (intent) queryParams.set("intent", intent);

        const res = await fetch(`/api/properties?${queryParams.toString()}`);
        const result = await res.json();
        setProperties(result.data || []);
        setCurrentPage(1);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, [category, location, bhk, intent]);

  // Sort properties
  const sortedProperties = [...properties];
  if (sort === "price-desc") {
    sortedProperties.sort((a, b) => b.price - a.price);
  } else if (sort === "price-asc") {
    sortedProperties.sort((a, b) => a.price - b.price);
  } else if (sort === "newest") {
    sortedProperties.sort((a, b) => {
      if (a.status === "new-launch" && b.status !== "new-launch") return -1;
      if (a.status !== "new-launch" && b.status === "new-launch") return 1;
      return 0;
    });
  } else if (sort === "popular") {
    sortedProperties.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

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

  const handleSortChange = (e) => {
    router.replace(`/properties?${createQueryString("sort", e.target.value)}`);
  };

  const PAGE_SIZE = 6;
  const totalProperties = sortedProperties.length;
  const totalPages = Math.ceil(totalProperties / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedProperties = sortedProperties.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page) => {
    if (page === "...") return;
    setCurrentPage(page);
    const element = document.getElementById("properties-list");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <>
      <section className="relative h-[409px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/PropertiesPage.avif"
            alt="Properties in Ambernath"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/40 to-surface" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-center px-6">
          <nav className="flex justify-center items-center gap-2 mb-6 text-xs font-semibold uppercase tracking-widest text-primary">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Icon name="chevron_right" size={12} className="text-primary" />
            <span className="text-white/60">Properties</span>
          </nav>
          <h1
            className="font-headline text-white mb-4"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              lineHeight: 1.1,
              fontWeight: 600,
              textShadow: "2px 4px 16px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4)"
            }}
          >
            Explore Properties in Ambernath
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Discover curated luxury living spaces where modern architecture meets
            suburban serenity.
          </p>
        </div>
      </section>

      <main className="max-w-[1440px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <FilterSidebar />

        <section className="lg:col-span-9" id="properties-list">
          {/* Header Row: Count & Sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-outline/5 pb-4">
            <h2 className="font-headline text-white text-2xl font-semibold">
              <span className="text-primary font-headline mr-2 text-3xl font-bold">
                {sortedProperties.length}
              </span>
              Properties Found
            </h2>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                SORT BY:
              </span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="bg-transparent border-none text-white font-semibold text-sm pr-8 py-2 focus:ring-0 appearance-none cursor-pointer hover:text-primary transition-colors"
                >
                  <option value="price-desc" className="bg-[#181a1b] text-white">Price: High to Low</option>
                  <option value="price-asc" className="bg-[#181a1b] text-white">Price: Low to High</option>
                  <option value="newest" className="bg-[#181a1b] text-white">Newest First</option>
                  <option value="popular" className="bg-[#181a1b] text-white">Most Popular</option>
                </select>
                <Icon
                  name="chevron_down"
                  size={16}
                  className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-primary"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-[#181a1b] rounded-2xl h-[420px] border border-outline/10" />
              ))}
            </div>
          ) : sortedProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProperties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>

              {/* Dynamic Pagination Section matching mockup */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-16">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-md border border-outline/10 flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Previous Page"
                  >
                    <Icon name="arrow_left" size={16} />
                  </button>
                  
                  {getPageNumbers().map((page, idx) => {
                    if (page === "...") {
                      return (
                        <span key={`dots-${idx}`} className="text-on-surface-variant px-1 select-none">
                          ...
                        </span>
                      );
                    }
                    
                    const isActive = currentPage === page;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-md font-bold flex items-center justify-center transition-colors cursor-pointer ${
                          isActive
                            ? "bg-primary text-on-primary"
                            : "text-on-surface hover:text-primary font-medium"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-md border border-outline/10 flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Next Page"
                  >
                    <Icon name="arrow_right" size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Icon
                name="search_off"
                size={64}
                className="text-on-surface-variant mx-auto mb-4"
              />
              <h3 className="font-headline text-xl text-on-surface mb-2">
                No Properties Found
              </h3>
              <p className="text-on-surface-variant">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PropertiesContent />
    </Suspense>
  );
}
