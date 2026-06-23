"use client";

import { useEffect, useState } from "react";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchEnquiries() {
      try {
        const res = await fetch(`/api/admin/enquiries?page=${pagination.page}&status=${statusFilter}`);
        const data = await res.json();
        if (!mounted) return;
        setEnquiries(data.data || []);
        if (data.meta) {
          setPagination({
            page: data.meta.page,
            total_pages: data.meta.total_pages,
            total: data.meta.total,
          });
        }
      } catch (error) {
        console.error("Failed to fetch enquiries:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchEnquiries();
    return () => { mounted = false; };
  }, [pagination.page, statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setEnquiries(enquiries.map((e) =>
          e._id === id ? { ...e, status } : e
        ));
        if (selectedEnquiry?._id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status });
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;

    try {
      await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      setEnquiries(enquiries.filter((e) => e._id !== id));
      if (selectedEnquiry?._id === id) {
        setSelectedEnquiry(null);
      }
    } catch (error) {
      console.error("Failed to delete enquiry:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Enquiries</h2>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPagination({ ...pagination, page: 1 }); }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none text-sm"
        >
          <option value="">All</option>
          <option value="new">New</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : enquiries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No enquiries found</div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-[60vh] lg:max-h-[70vh] overflow-y-auto">
              {enquiries.map((enquiry) => (
                <div
                  key={enquiry._id}
                  onClick={() => setSelectedEnquiry(enquiry)}
                  className={`p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedEnquiry?._id === enquiry._id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">{enquiry.name}</h3>
                        <span
                          className={`px-1.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${
                            enquiry.status === "new"
                              ? "bg-orange-100 text-orange-700"
                              : enquiry.status === "replied"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {enquiry.status}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{enquiry.email}</p>
                      {enquiry.propertyTitle && (
                        <p className="text-xs sm:text-sm text-gray-400 truncate">
                          Re: {enquiry.propertyTitle}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{formatDate(enquiry.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pagination.total_pages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs sm:text-sm text-gray-500">
                Page {pagination.page} of {pagination.total_pages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-2 sm:px-3 py-1 border border-gray-300 rounded-lg text-xs sm:text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.total_pages}
                  className="px-2 sm:px-3 py-1 border border-gray-300 rounded-lg text-xs sm:text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {selectedEnquiry ? (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">{selectedEnquiry.name}</h3>
                  <p className="text-sm text-gray-500">{selectedEnquiry.email}</p>
                  {selectedEnquiry.phone && (
                    <p className="text-sm text-gray-500">{selectedEnquiry.phone}</p>
                  )}
                </div>
                <span
                  className={`px-2 sm:px-3 py-1 text-sm font-medium rounded-full ${
                    selectedEnquiry.status === "new"
                      ? "bg-orange-100 text-orange-700"
                      : selectedEnquiry.status === "replied"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {selectedEnquiry.status}
                </span>
              </div>

              {selectedEnquiry.propertyTitle && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Property</p>
                  <p className="text-sm font-medium text-gray-900">{selectedEnquiry.propertyTitle}</p>
                </div>
              )}

              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Message</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedEnquiry.message}</p>
              </div>

              <div className="mb-4 sm:mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Received</p>
                <p className="text-sm text-gray-700">{formatDate(selectedEnquiry.createdAt)}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateStatus(selectedEnquiry._id, "new")}
                    disabled={selectedEnquiry.status === "new"}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      selectedEnquiry.status === "new"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    New
                  </button>
                  <button
                    onClick={() => updateStatus(selectedEnquiry._id, "replied")}
                    disabled={selectedEnquiry.status === "replied"}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      selectedEnquiry.status === "replied"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Replied
                  </button>
                  <button
                    onClick={() => updateStatus(selectedEnquiry._id, "closed")}
                    disabled={selectedEnquiry.status === "closed"}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      selectedEnquiry.status === "closed"
                        ? "bg-gray-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Closed
                  </button>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleDelete(selectedEnquiry._id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete Enquiry
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Select an enquiry to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
