"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export function PropertyInquiryForm({ propertyName }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          property: propertyName,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit inquiry.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to send inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <p className="text-primary font-semibold text-lg mb-2">Inquiry Sent!</p>
        <p className="text-on-surface-variant text-xs">
          Thank you for your interest. Ayub Khan will contact you shortly regarding <strong>{propertyName}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg text-xs font-medium">
          {error}
        </div>
      )}
      <input
        type="text"
        required
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full bg-[#121414] border border-outline/20 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-all text-sm"
      />
      <input
        type="email"
        required
        placeholder="Email Address"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full bg-[#121414] border border-outline/20 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-all text-sm"
      />
      <textarea
        required
        rows={4}
        placeholder="Message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className="w-full bg-[#121414] border border-outline/20 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-all text-sm resize-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#181a1b] hover:bg-primary text-primary hover:text-on-primary border border-primary/40 hover:border-primary py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {loading ? (
          <>
            <Icon name="hourglass_empty" size={14} className="animate-spin" />
            Sending...
          </>
        ) : (
          "Send Inquiry"
        )}
      </button>
    </form>
  );
}

