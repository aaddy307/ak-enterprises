"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { whyChooseUs } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function WhyChooseUs() {
  return (
    <section className="py-24 px-6 bg-surface-container-lowest">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2
            className="font-headline text-on-surface mb-6"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              lineHeight: 1.2,
              fontWeight: 600,
            }}
          >
            Why Choose AK Enterprises
          </h2>
          <p className="text-on-surface-variant text-lg">
            Defining excellence in Ambernath's real estate market through
            unwavering integrity and bespoke property solutions.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {whyChooseUs.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="text-center p-8 border border-outline/10 rounded-2xl hover:border-primary/40 transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Icon name={item.icon} size={28} className="text-primary" />
              </motion.div>
              <h4 className="font-bold text-xl mb-3 text-on-surface">{item.title}</h4>
              <p className="text-on-surface-variant text-sm">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
