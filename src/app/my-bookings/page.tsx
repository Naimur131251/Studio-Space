"use client";

import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { useCallback, useEffect, useState } from "react";

interface Booking {
  _id: string;
  studioId?: string;
  studioTitle: string;
  category: string;
  bookingDate: string;
  timeSlot: string;
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

const API_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Fetch logged-in user's bookings
  const fetchMyBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      const token = await getTokenFromClient();

      const response = await fetch(`${API_URL}/my-bookings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bookings.");
      }

      if (!Array.isArray(data)) {
        throw new Error("Invalid booking data received from server.");
      }

      setBookings(data);
    } catch (error) {
      console.error("Fetch bookings error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while fetching bookings.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchMyBookings);
  }, [fetchMyBookings]);

  // Cancel pending booking
  const handleCancel = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) return;

    try {
      setCancellingId(id);

      const token = await getTokenFromClient();

      const response = await fetch(`${API_URL}/bookings/${id}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking.");
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status: "Cancelled" } : booking,
        ),
      );

      alert("Booking cancelled successfully!");
    } catch (error) {
      console.error("Cancel booking error:", error);

      alert(
        error instanceof Error ? error.message : "Failed to cancel booking.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  // Status badge
  const getStatusBadge = (status: Booking["status"]) => {
    const styles: Record<Booking["status"], string> = {
      Pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      Confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      Completed: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      Cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
    };

    return (
      <span
        className={`px-3 py-1 border rounded-full text-xs font-semibold ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white">My Bookings</h1>

        <p className="text-slate-400 text-sm mt-1">
          Track and manage your studio reservations
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-20 bg-slate-900 rounded-2xl">
          <p className="text-indigo-400 animate-pulse">Loading bookings...</p>
        </div>
      ) : error ? (
        /* Error */
        <div className="text-center py-20 bg-slate-900 border border-red-500/20 rounded-2xl space-y-4">
          <p className="text-red-400">{error}</p>

          <button
            onClick={fetchMyBookings}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold"
          >
            Try Again
          </button>
        </div>
      ) : bookings.length === 0 ? (
        /* Empty state */
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400">No studio bookings found.</p>
        </div>
      ) : (
        /* Bookings table */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Studio Workspace</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-semibold text-white">
                    {booking.studioTitle}
                  </td>

                  <td className="px-6 py-4">{booking.category}</td>

                  <td className="px-6 py-4">
                    <div>{booking.bookingDate}</div>

                    <div className="text-xs text-slate-500">
                      {booking.timeSlot}
                    </div>
                  </td>

                  <td className="px-6 py-4 font-bold text-indigo-400">
                    ${booking.totalAmount}
                  </td>

                  <td className="px-6 py-4">
                    {getStatusBadge(booking.status)}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {booking.status === "Pending" && (
                      <button
                        disabled={cancellingId === booking._id}
                        onClick={() => handleCancel(booking._id)}
                        className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-xs font-medium disabled:opacity-50"
                      >
                        {cancellingId === booking._id
                          ? "Cancelling..."
                          : "Cancel Booking"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
