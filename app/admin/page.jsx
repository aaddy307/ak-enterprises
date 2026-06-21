"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    properties: 0,
    categories: 0,
    enquiries: 0,
    newEnquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [propertiesRes, categoriesRes, enquiriesRes] = await Promise.all([
          fetch("/api/admin/properties?limit=1"),
          fetch("/api/admin/categories"),
          fetch("/api/admin/enquiries?limit=1"),
        ]);

        const propertiesData = await propertiesRes.json();
        const categoriesData = await categoriesRes.json();
        const enquiriesData = await enquiriesRes.json();

        const newEnquiries = enquiriesData.data?.filter((e) => e.status === "new").length || 0;

        setStats({
          properties: propertiesData.meta?.total || 0,
          categories: categoriesData.data?.length || 0,
          enquiries: enquiriesData.meta?.total || 0,
          newEnquiries,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      name: "Properties",
      value: stats.properties,
      href: "/admin/properties",
      color: "bg-blue-500",
    },
    {
      name: "Categories",
      value: stats.categories,
      href: "/admin/categories",
      color: "bg-green-500",
    },
    {
      name: "Total Enquiries",
      value: stats.enquiries,
      href: "/admin/enquiries",
      color: "bg-purple-500",
    },
    {
      name: "New Enquiries",
      value: stats.newEnquiries,
      href: "/admin/enquiries?status=new",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Welcome back! Here&apos;s your overview.</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base"
        >
          Add Property
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">{card.name}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {loading ? "..." : card.value}
                </p>
              </div>
              <div className={`${card.color} p-2 sm:p-3 rounded-lg text-white`}>
                <StatIcon name={card.name} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Link
              href="/admin/properties/new"
              className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="font-medium text-gray-700 text-xs sm:text-sm">Add Property</span>
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="font-medium text-gray-700 text-xs sm:text-sm">Add Category</span>
            </Link>
            <Link
              href="/admin/enquiries"
              className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="font-medium text-gray-700 text-xs sm:text-sm">View Enquiries</span>
            </Link>
            <Link
              href="/admin/contact"
              className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <span className="font-medium text-gray-700 text-xs sm:text-sm">Update Contact</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Database</span>
              <span className="flex items-center gap-2 text-green-600 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Cloudinary</span>
              <span className="flex items-center gap-2 text-green-600 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Ready
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Authentication</span>
              <span className="flex items-center gap-2 text-green-600 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Active
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 text-sm">Environment</span>
              <span className="text-gray-900 font-medium text-sm">Development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatIcon({ name }) {
  const icons = {
    Properties: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    Categories: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    "Total Enquiries": (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    "New Enquiries": (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
  };
  return icons[name] || null;
}
