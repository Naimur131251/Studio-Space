"use client";

import { toast } from "@/components/ui/toast";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { useCallback, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface Booking {
  _id: string;
  studioId?: string;
  studioTitle: string;
  category: string;
  date: string;
  timeSlot: string;
  totalAmount: number;
  status: BookingStatus;
}

const API_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );

  // Fetch logged-in user's bookings
  const fetchMyBookings = useCallback(async () => {
    await Promise.resolve();

    try {
      setLoading(true);
      setError("");

      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      const token = await getTokenFromClient();

      // ১. টোকেন না থাকলে (Unauthenticated) টোস্ট দেখিয়ে আটকে দেওয়া
      if (!token) {
        toast.add({
          title: "Access Denied",
          description: "Unauthorized! Please login to check this page.",
          type: "error",
        });
        // এখানে চাইলে ইউজারকে লগইন পেজে রিডাইরেক্ট করতে পারেন:
        // router.push("/login?callbackUrl=" + encodeURIComponent(window.location.pathname));
        return;
      }

      const response = await fetch(`${API_URL}/my-bookings`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      // ২. সার্ভার লেভেলে টোকেন ইনভ্যালিড বা এক্সপায়ার্ড হলে (৪০১ বা ৪০৩ এরর)
      if (response.status === 401 || response.status === 403) {
        toast.add({
          title: "Session Expired",
          description: "Unauthorized! Please login to check this page.",
          type: "error",
        });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bookings.");
      }

      // Support both array and object API responses
      const bookingList = Array.isArray(data)
        ? data
        : (data.bookings ?? data.data?.bookings);

      if (!Array.isArray(bookingList)) {
        console.error("Unexpected booking response:", data);
        throw new Error("Invalid booking data received from server.");
      }

      // Normalize backend data
      const formattedBookings: Booking[] = bookingList.map((item) => ({
        _id: item._id,
        studioId: item.studioId,
        studioTitle: item.studioTitle,
        category: item.category,
        date: item.date || item.bookingDate || "",
        timeSlot: item.timeSlot,
        totalAmount: Number(item.totalAmount) || 0,
        status: String(item.status || "pending").toLowerCase() as BookingStatus,
      }));

      setBookings(formattedBookings);
    } catch (error: unknown) {
      console.error("Fetch bookings error:", error);
      setBookings([]);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while fetching your bookings.",
      );

      // ৩. নেটওয়ার্ক বা অন্য কোনো টেকনিক্যাল এররের জন্য টোস্ট
      toast.add({
        title: "Error Loading Bookings",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while fetching your bookings.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchMyBookings();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchMyBookings]);

  // Cancel booking
  // Open cancel confirmation dialog
  const handleCancel = (id: string) => {
    setSelectedBookingId(id);
    setIsCancelDialogOpen(true);
  };

  // Confirm cancellation
  const confirmCancel = async () => {
    if (!selectedBookingId) return;

    const id = selectedBookingId;

    try {
      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      setCancellingId(id);

      const token = await getTokenFromClient();

      if (!token) {
        toast.add({
          title: "Authentication Required",
          description:
            "Unauthorized! Please login to check this page or perform this action.",
          type: "error",
        });
        setIsCancelDialogOpen(false);
        setSelectedBookingId(null);
        return;
      }

      const response = await fetch(`${API_URL}/bookings/${id}/cancel`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        toast.add({
          title: "Session Expired",
          description: "Unauthorized! Please login to check this page.",
          type: "error",
        });
        setIsCancelDialogOpen(false);
        setSelectedBookingId(null);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking.");
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status: "cancelled" } : booking,
        ),
      );

      toast.add({
        title: "Booking cancelled successfully!",
        description: "Your studio reservation has been cancelled.",
        type: "success",
      });

      setIsCancelDialogOpen(false);
      setSelectedBookingId(null);
    } catch (error) {
      console.error("Cancel booking error:", error);

      toast.add({
        title: "Cancellation Failed",
        description:
          error instanceof Error
            ? error.message
            : "Could not cancel your booking. Please try again.",
        type: "error",
      });
    } finally {
      setCancellingId(null);
    }
  };

  // Status badge
  const getStatusBadge = (status: BookingStatus) => {
    const styles: Record<BookingStatus, string> = {
      pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      completed: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
    };

    const labels: Record<BookingStatus, string> = {
      pending: "Pending",
      confirmed: "Confirmed",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return (
      <span
        className={`px-3 py-1 border rounded-full text-xs font-semibold ${
          styles[status] || styles.pending
        }`}
      >
        {labels[status] || "Pending"}
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 text-slate-900 dark:text-white sm:px-6 lg:px-8">
      {/* Cancel Confirmation Dialog */}
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={(open) => {
          if (!cancellingId) {
            setIsCancelDialogOpen(open);

            if (!open) {
              setSelectedBookingId(null);
            }
          }
        }}
      >
        <AlertDialogContent className="border border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              Cancel Booking?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
              Are you sure you want to cancel this studio booking? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={!!cancellingId}
              className="border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 dark:hover:text-white"
            >
              Keep Booking
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void confirmCancel();
              }}
              disabled={!!cancellingId}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {cancellingId ? "Cancelling..." : "Yes, Cancel Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          My Bookings
        </h1>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Track and manage your studio reservations
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="animate-pulse text-indigo-600 dark:text-indigo-400">
            Loading bookings...
          </p>
        </div>
      ) : error ? (
        /* Error */
        <div className="space-y-4 rounded-2xl border border-red-200 bg-white py-20 text-center dark:border-red-500/20 dark:bg-slate-900">
          <p className="text-red-600 dark:text-red-400">{error}</p>

          <button
            type="button"
            onClick={fetchMyBookings}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      ) : bookings.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-400">
            No studio bookings found.
          </p>
        </div>
      ) : (
        /* Bookings Table */
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-600 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th className="whitespace-nowrap px-6 py-4">
                  Studio Workspace
                </th>
                <th className="px-6 py-4">Category</th>
                <th className="whitespace-nowrap px-6 py-4">Date &amp; Time</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                    {booking.studioTitle}
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {booking.category}
                  </td>

                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                    <div>{booking.date}</div>

                    <div className="text-xs text-slate-500 dark:text-slate-500">
                      {booking.timeSlot}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">
                    ${booking.totalAmount}
                  </td>

                  <td className="px-6 py-4">
                    {getStatusBadge(booking.status)}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    {(booking.status === "pending" ||
                      booking.status === "confirmed") && (
                      <button
                        type="button"
                        disabled={cancellingId === booking._id}
                        onClick={() => handleCancel(booking._id)}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600/20 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
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
