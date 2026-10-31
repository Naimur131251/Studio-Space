"use client";

import { useEffect, useState } from "react";

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
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Fetch bookings from MongoDB
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const customerEmail = "user@example.com";

        const response = await fetch(
          `${API_URL}/my-bookings?email=${encodeURIComponent(customerEmail)}`,
          { cache: "no-store" },
        );

        if (!response.ok) throw new Error("Failed to fetch bookings");

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Fetch bookings error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Cancel pending booking
  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      setCancellingId(id);

      const response = await fetch(`${API_URL}/bookings/${id}/cancel`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status: "Cancelled" } : booking,
        ),
      );

      alert("Booking cancelled successfully!");
    } catch (error) {
      console.error("Cancel booking error:", error);
      alert("Failed to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

  // Status badge
  const getStatusBadge = (status: Booking["status"]) => {
    const styles = {
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
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white">My Bookings</h1>
        <p className="text-slate-400 text-sm mt-1">
          Track and manage your studio reservations
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-slate-900 rounded-2xl">
          <p className="text-indigo-400 animate-pulse">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400">No studio bookings found.</p>
        </div>
      ) : (
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
