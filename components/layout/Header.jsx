"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { navigation } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-black/50 backdrop-blur-md border-b border-outline/10 py-3 shadow-lg"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span
            className="font-headline text-xl md:text-2xl font-bold tracking-[0.18em] uppercase text-primary transition-colors duration-300 hover:text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            AK Enterprises
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative font-medium transition-colors duration-300 py-1",
                pathname === item.href
                  ? "text-primary font-bold"
                  : "text-on-surface hover:text-primary"
              )}
            >
              {item.name}
              {pathname === item.href && (
                <motion.span
                  layoutId="underline"
                  className="absolute left-0 bottom-0 w-full h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/contact">
            <Button variant="primary" size="sm">
              Enquire Now
            </Button>
          </Link>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-on-surface"
        >
          <Icon name={mobileMenuOpen ? "close" : "menu"} size={24} />
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-t border-outline/10"
          >
            <nav className="flex flex-col p-6 gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "font-medium py-2",
                    pathname === item.href
                      ? "text-primary"
                      : "text-on-surface"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="mt-4">
                  Enquire Now
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
