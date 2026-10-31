"use client";

import { useState } from "react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([
    {
      _id: "b1",
      studioTitle: "Cyc Wall Studio Pro",
      category: "Photo Studio",
      bookingDate: "2026-11-15",
      timeSlot: "10:00 AM - 01:00 PM",
      totalAmount: 180,
      status: "Pending",
    },
    {
      _id: "b2",
      studioTitle: "Cinema Sound Stage Alpha",
      category: "Film Stage",
      bookingDate: "2026-11-20",
      timeSlot: "02:00 PM - 06:00 PM",
      totalAmount: 480,
      status: "Confirmed",
    },
  ]);

  const handleCancel = (id: string) => {
    setBookings(
      bookings.map((b) => (b._id === id ? { ...b, status: "Cancelled" } : b)),
    );
    alert("Booking cancelled successfully.");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return (
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold">
            Confirmed
          </span>
        );
      case "Pending":
        return (
          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-semibold">
            Pending
          </span>
        );
      case "Cancelled":
        return (
          <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full text-xs font-semibold">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white">My Bookings</h1>
        <p className="text-slate-400 text-sm mt-1">
          Track and manage your upcoming studio reservations
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400">No studio bookings found.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800">
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
              {bookings.map((b) => (
                <tr
                  key={b._id}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-white">
                    {b.studioTitle}
                  </td>
                  <td className="px-6 py-4">{b.category}</td>
                  <td className="px-6 py-4">
                    <div>{b.bookingDate}</div>
                    <div className="text-xs text-slate-500">{b.timeSlot}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-indigo-400">
                    ${b.totalAmount}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(b.status)}</td>
                  <td className="px-6 py-4 text-right">
                    {b.status === "Pending" && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        Cancel Booking
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
