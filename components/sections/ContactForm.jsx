"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Icon } from "@/components/ui/Icon";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to submit inquiry.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface-container p-10 rounded-xl border border-primary/20 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Icon name="check_circle" size={30} className="text-primary" />
        </motion.div>
        <h3 className="font-headline text-2xl mb-4 text-on-surface">
          Thank You!
        </h3>
        <p className="text-on-surface-variant mb-6">
          Your inquiry has been submitted successfully. Our team will get back
          to you within 24 hours.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outlined">
          Send Another Inquiry
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface-container p-10 rounded-xl border border-outline/10 gold-glow-hover"
    >
      <motion.h2
        variants={itemVariants}
        className="font-headline text-headline-lg text-primary-container mb-8"
      >
        Send an Inquiry
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-error/10 border border-error/20 text-error p-4 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}
        <motion.div variants={itemVariants}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            placeholder="+91 00000 00000"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Select
            label="Interested In"
            placeholder="Select property type"
            value={formData.interest}
            onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
            options={[
              { value: "residential", label: "Residential Property" },
              { value: "commercial", label: "Commercial Space" },
              { value: "plot", label: "Plot Investment" },
              { value: "rental", label: "Rental Services" },
            ]}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
            Message
          </label>
          <textarea
            placeholder="Tell us more about your requirements..."
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-surface-container-low border border-outline/20 rounded-lg px-4 py-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-all resize-none"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={loading}
          >
            Submit Inquiry
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
