"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/utils";

export function Categories() {
  return (
    <section className="py-24 px-6 max-w-[1440px] mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-headline text-on-surface text-center mb-16"
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(1.75rem, 4vw, 3rem)",
          lineHeight: 1.2,
          fontWeight: 600,
        }}
      >
        Browse by Category
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: index * 0.15,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <Link
              href={category.href}
              className="relative group block h-[500px] rounded-2xl overflow-hidden cursor-pointer"
            >
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-10 left-10">
                <h3
                  className="font-headline text-white mb-2"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "clamp(1.25rem, 2vw, 2rem)",
                    lineHeight: 1.3,
                    fontWeight: 600,
                  }}
                >
                  {category.title}
                </h3>
                <p className="text-primary-fixed-dim">{category.subtitle}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
