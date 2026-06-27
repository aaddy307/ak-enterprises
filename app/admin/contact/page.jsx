"use client";

import { useEffect, useState } from "react";

export default function AdminContactPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    phone: [],
    email: [],
    address: "",
    workingHours: "",
    mapUrl: "",
  });
  const [phoneInput, setPhoneInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    async function fetchContact() {
      try {
        const res = await fetch("/api/admin/contact");
        const data = await res.json();
        if (data.data) {
          setFormData({
            phone: data.data.phone || [],
            email: data.data.email || [],
            address: data.data.address || "",
            workingHours: data.data.workingHours || "",
            mapUrl: data.data.mapUrl || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch contact:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchContact();
  }, []);

  const addPhone = () => {
    if (phoneInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        phone: [...prev.phone, phoneInput.trim()],
      }));
      setPhoneInput("");
    }
  };

  const removePhone = (index) => {
    setFormData((prev) => ({
      ...prev,
      phone: prev.phone.filter((_, i) => i !== index),
    }));
  };

  const addEmail = () => {
    if (emailInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        email: [...prev.email, emailInput.trim()],
      }));
      setEmailInput("");
    }
  };

  const removeEmail = (index) => {
    setFormData((prev) => ({
      ...prev,
      email: prev.email.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Contact information saved successfully!");
      } else {
        alert("Failed to save contact information");
      }
    } catch (error) {
      console.error("Failed to save contact:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Contact Information</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone Numbers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Numbers</label>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPhone())}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none text-sm sm:text-base text-gray-900"
                placeholder="+91 98765 43210"
              />
              <button
                type="button"
                onClick={addPhone}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.phone.map((phone, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800"
                >
                  {phone}
                  <button
                    type="button"
                    onClick={() => removePhone(index)}
                    className="text-gray-500 hover:text-gray-700 text-lg leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Email Addresses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Addresses</label>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEmail())}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none text-sm sm:text-base text-gray-900"
                placeholder="info@example.com"
              />
              <button
                type="button"
                onClick={addEmail}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.email.map((email, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => removeEmail(index)}
                    className="text-gray-500 hover:text-gray-700 text-lg leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
            <input
              type="text"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none text-sm sm:text-base text-gray-900"
              placeholder="Mon-Sat: 9:00 AM - 6:00 PM"
            />
          </div>

          {/* Google Maps URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps URL</label>
            <input
              type="url"
              value={formData.mapUrl}
              onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none text-sm sm:text-base text-gray-900"
              placeholder="https://maps.google.com/..."
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none text-sm sm:text-base text-gray-900"
              placeholder="Full address"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="px-4 sm:px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm sm:text-base"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
