"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useParams, useRouter } from "next/navigation";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { toast } from "../ui/toast";
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

// Types
interface Amenity {
  name: string;
  icon: string;
}

interface Host {
  name: string;
  email: string;
  avatar: string;
}

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  images: string[];
  imageUrl: string;
  amenities: Amenity[];
  overview: string;
  rating: number;
  host: Host;
}

interface BookingPayload {
  studioId: string;
  studioTitle: string;
  category: string;
  bookingDate: string;
  timeSlot: string;
  totalAmount: number;
}

interface UserBooking {
  _id: string;
  studioId: string;
  status: string;
}

const PENDING_BOOKING_KEY = "pending-studio-booking";

export function StudioDetailsContant() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // Studio states
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  // Booking states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [hours, setHours] = useState(2);

  // Carousel states
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Prevent duplicate automatic submission
  const bookingProcessed = useRef(false);

  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const confirmCancel = async () => {
    if (!existingBooking) return;
    try {
      setCancellingId(existingBooking._id);
      const token = await getTokenFromClient();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/bookings/${existingBooking._id}/cancel`,
        {
          method: "PATCH",
          headers: { authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        toast.add({
          title: "Booking Cancelled",
          description: "Your reservation has been cancelled successfully.",
          type: "success",
        });

        // স্টেট আপডেট করে বাটনটি সাথে সাথে "Book Workspace Now"-এ ফিরিয়ে আনা
        setUserBookings((prev) =>
          prev.map((b) =>
            b._id === existingBooking._id ? { ...b, status: "cancelled" } : b,
          ),
        );

        setIsCancelDialogOpen(false);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to cancel booking.");
      }
    } catch (error) {
      toast.add({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Could not cancel booking.",
        type: "error",
      });
    } finally {
      setCancellingId(null);
    }
  };

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const token = await getTokenFromClient();
        if (!token) return;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/my-bookings`,
          {
            headers: { authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setUserBookings(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserBookings();
  }, [id]);

  const existingBooking = userBookings.find(
    (b) =>
      String(b.studioId) === String(id) &&
      (String(b.status).toLowerCase() === "pending" ||
        String(b.status).toLowerCase() === "confirmed"),
  );

  // Fetch studio details
  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchStudio = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/${id}`,
          {
            cache: "no-store",
            signal: controller.signal,
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load studio");
        }

        const studioData =
          data.studio ?? data.data?.studio ?? data.data ?? data;

        if (!studioData?._id) {
          throw new Error("Invalid studio data received");
        }

        setStudio(studioData);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load studio details.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchStudio();

    return () => controller.abort();
  }, [id, retry]);

  // Submit booking to backend
  // Submit booking to backend
  const submitBooking = async (payload: BookingPayload, token: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

    if (response.status === 409) {
      toast.add({
        title: "Slot Already Booked!",
        description:
          data.message ||
          "Ei time-e already ekjon kore rekheche, porer time e booking korun.",
        type: "error",
      });
      throw new Error(data.message || "Slot already booked.");
    }

    if (!response.ok) {
      throw new Error(data.message || "Booking failed.");
    }

    return data;
  };

  // Automatic booking after login
  useEffect(() => {
    if (!id || bookingProcessed.current) return;

    const processPendingBooking = async () => {
      const pendingBooking = sessionStorage.getItem(PENDING_BOOKING_KEY);

      if (!pendingBooking) return;

      try {
        const payload: BookingPayload = JSON.parse(pendingBooking);

        // Do not submit a booking belonging to another studio.
        if (payload.studioId !== id) return;

        const token = await getTokenFromClient();

        // Login session is not ready yet.
        if (!token) return;

        bookingProcessed.current = true;
        setBookingLoading(true);

        await submitBooking(payload, token);

        // Remove pending data only after successful booking.
        sessionStorage.removeItem(PENDING_BOOKING_KEY);

        toast.add({
          title: "Reservation submitted successfully!",
          description: `Your pending booking for ${payload.studioTitle || "the studio"} has been completed.`,
          type: "success",
        });

        router.replace("/my-bookings");
      } catch (error) {
        bookingProcessed.current = false;

        console.error("Automatic booking error:", error);

        toast.add({
          title: "Booking Completion Failed",
          description:
            error instanceof Error
              ? error.message
              : "Failed to complete your pending booking. Please try again.",
          type: "error",
        });
      } finally {
        setBookingLoading(false);
      }
    };

    processPendingBooking();
  }, [id, router]);

  // Gallery fallback
  const galleryImages = studio?.images?.length
    ? studio.images
    : studio?.imageUrl
      ? [studio.imageUrl]
      : [];

  // Carousel auto slide
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    onSelect();
    api.on("select", onSelect);

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      api.off("select", onSelect);
    };
  }, [api]);

  // Booking submit
  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!studio) return;

    if (!bookingDate || !startTime || hours < 1 || hours > 12) {
      toast.add({
        title: "Missing Information",
        description:
          "Please fill in a valid date, start time, and duration (1-12 hours).",
        type: "info",
      });
      return;
    }

    const today = new Date();
    const localToday = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    if (bookingDate < localToday) {
      toast.add({
        title: "Invalid Booking Date",
        description:
          "You cannot book a studio for a past date. Please select today or a future date.",
        type: "info",
      });
      return;
    }

    try {
      setBookingLoading(true);

      const [hour, minute] = startTime.split(":").map(Number);
      const endMinutes = hour * 60 + minute + hours * 60;

      const endHour = Math.floor(endMinutes / 60);
      const endMinute = endMinutes % 60;

      const formatTime = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        const period = h >= 12 ? "PM" : "AM";
        const formattedHour = h % 12 || 12;
        return `${String(formattedHour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
      };

      const endTime =
        `${String(endHour).padStart(2, "0")}:` +
        `${String(endMinute).padStart(2, "0")}`;

      const timeSlot = `${formatTime(startTime)} - ${formatTime(endTime)}`;

      // StudioDetails.tsx এর ভেতরে handleBookingSubmit ফাংশনটি এভাবে আপডেট করুন:
      const bookingPayload = {
        studioId: studio._id,
        studioTitle: studio.title,
        category: studio.category,
        bookingDate,
        startTime,
        hours: Number(hours),
        timeSlot, // "10:00 AM - 12:00 PM"
        totalAmount: studio.hourlyRate * hours,
      };

      let token: string;

      try {
        token = await getTokenFromClient();
      } catch (error) {
        console.error("Authentication required:", error);

        toast.add({
          title: "Login Required",
          description: "Please log in to complete your studio booking.",
          type: "info",
        });

        router.push(
          `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
        );
        return;
      }

      if (!token) {
        sessionStorage.setItem(
          PENDING_BOOKING_KEY,
          JSON.stringify(bookingPayload),
        );

        const callbackUrl = `/studios/${id}`;

        toast.add({
          title: "Redirecting to Login",
          description:
            "Saving your booking details. Complete login to finish the process.",
          type: "info",
        });

        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }

      await submitBooking(bookingPayload, token);

      toast.add({
        title: "Reservation submitted successfully!",
        description: `Your slot for ${studio.title} has been booked. Check details in your dashboard.`,
        type: "success",
      });

      setIsModalOpen(false);
      setBookingDate("");
      setStartTime("");
      setHours(2);

      setUserBookings((prev) => [
        ...prev,
        { _id: "temp-id", studioId: id, status: "pending" },
      ]);

      router.push("/my-bookings");
    } catch (error) {
      console.error("Booking error:", error);

      toast.add({
        title: "Booking Failed",
        description:
          error instanceof Error
            ? error.message
            : "Could not create booking. Please try again.",
        type: "error",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="h-9 w-56 bg-slate-200 dark:bg-slate-800 rounded" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-95 md:h-112.5 bg-slate-200 dark:bg-slate-900 rounded-2xl" />
            <div className="h-24 bg-slate-200 dark:bg-slate-900 rounded-2xl" />
            <div className="h-32 bg-slate-200 dark:bg-slate-900 rounded-2xl" />
          </div>

          <div className="space-y-6">
            <div className="h-40 bg-slate-200 dark:bg-slate-900 rounded-2xl" />
            <div className="h-64 bg-slate-200 dark:bg-slate-900 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !studio) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center py-20 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {error || "Studio not found"}
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            We could not load this studio.
          </p>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setRetry((prev) => prev + 1)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-xl"
            >
              Try Again
            </button>

            <button
              onClick={() => router.push("/studios")}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm rounded-xl"
            >
              Explore Studios
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 text-slate-900 transition-colors sm:px-6 lg:px-8 dark:text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 md:text-3xl dark:text-white">
          Studio Details
        </h1>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Section */}
        <div className="space-y-6 lg:col-span-2">
          {/* Gallery */}
          <div className="space-y-4">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {galleryImages.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-95 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 md:h-112.5 dark:border-slate-800 dark:bg-slate-900">
                      <Image
                        src={img}
                        alt={`${studio.title} ${index + 1}`}
                        className="h-full w-full object-cover"
                        width={1000}
                        height={700}
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {galleryImages.length > 1 && (
                <>
                  <CarouselPrevious className="left-4 border-slate-200 bg-white/90 text-slate-900 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-white dark:hover:bg-slate-800" />

                  <CarouselNext className="right-4 border-slate-200 bg-white/90 text-slate-900 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-white dark:hover:bg-slate-800" />
                </>
              )}
            </Carousel>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Show studio image ${index + 1}`}
                    aria-pressed={currentIndex === index}
                    className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all mt-1 ml-1 ${
                      currentIndex === index
                        ? "scale-105 border-indigo-500 opacity-100"
                        : "border-slate-300 opacity-70 hover:opacity-100 dark:border-slate-700"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                      width={500}
                      height={300}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3 pt-4">
            <h3 className="text-xl font-bold uppercase text-slate-600 dark:text-slate-400">
              Description
            </h3>

            <h2 className="text-lg font-bold uppercase text-slate-900 dark:text-white">
              {studio.title}
            </h2>

            <p className="text-sm leading-relaxed text-slate-700 md:text-base dark:text-slate-300">
              {studio.overview}
            </p>
          </div>

          {/* Amenities */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Amenities
            </h3>

            <div className="space-y-3">
              {studio.amenities?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {item.icon}
                    </span>
                    {item.name}
                  </span>

                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Included
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Workspace Info */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Full Workspace
            </h4>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between gap-3">
                <span>Category:</span>
                <span className="text-right font-semibold text-slate-900 dark:text-white">
                  {studio.category}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Production:</span>
                <span className="text-right font-semibold text-slate-900 dark:text-white">
                  ${studio.hourlyRate}/hr
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Security Deposit:</span>
                <span className="text-right font-semibold text-slate-900 dark:text-white">
                  ${studio.securityDeposit}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Max Capacity:</span>
                <span className="text-right font-semibold text-slate-900 dark:text-white">
                  {studio.maxCapacity} People
                </span>
              </div>
            </div>
          </div>

          {/* Amenities Summary */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Amenities
            </h4>

            <div className="grid grid-cols-1 gap-2">
              {studio.amenities?.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 py-1 text-sm text-slate-700 dark:text-slate-200"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
                    {amenity.icon}
                  </span>

                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Host */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                Host Details
              </h4>

              <span className="rounded-full border border-indigo-500/30 bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-700 dark:bg-indigo-600/20 dark:text-indigo-400">
                Premier Studio
              </span>
            </div>

            <div className="flex items-center gap-4">
              {studio.host?.avatar && (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700">
                  <Image
                    src={studio.host.avatar}
                    alt={studio.host.name || "Studio Host"}
                    className="h-full w-full object-cover"
                    width={100}
                    height={100}
                  />
                </div>
              )}

              <div className="min-w-0">
                <h5 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {studio.host?.name || "Studio Host"}
                </h5>

                <p className="break-all text-xs text-slate-500 dark:text-slate-400">
                  {studio.host?.email || "No email available"}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Button or Cancel Button */}
          {existingBooking ? (
            <button
              type="button"
              onClick={() => setIsCancelDialogOpen(true)} // সরাসরি ক্যানসেল না করে ডায়ালগ ওপেন করবে
              className="w-full rounded-xl bg-red-600 py-4 text-sm font-bold text-white shadow-xl transition-all hover:bg-red-700 cursor-pointer"
            >
              Cancel This Booking
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-xl transition-all hover:bg-indigo-700 dark:hover:bg-indigo-500 cursor-pointer"
            >
              Book Workspace Now
            </button>
          )}

          {/* --- Cancel Confirmation AlertDialog --- */}
          <AlertDialog
            open={isCancelDialogOpen}
            onOpenChange={(open) => {
              if (!cancellingId) {
                setIsCancelDialogOpen(open);
              }
            }}
          >
            <AlertDialogContent className="border border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl">
                  Cancel Booking?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                  Are you sure you want to cancel this studio booking? This
                  action cannot be undone.
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
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6 backdrop-blur-sm dark:bg-slate-950/80">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            className="my-auto w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4">
              <h3
                id="booking-modal-title"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                Reserve Studio Slot
              </h3>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close booking modal"
                className="rounded-lg p-1 text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Booking Date */}
              <div>
                <label
                  htmlFor="bookingDate"
                  className="mb-1 block text-xs font-medium uppercase text-slate-600 dark:text-slate-300"
                >
                  Booking Date
                </label>

                <input
                  id="bookingDate"
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={(() => {
                    const d = new Date();

                    return [
                      d.getFullYear(),
                      String(d.getMonth() + 1).padStart(2, "0"),
                      String(d.getDate()).padStart(2, "0"),
                    ].join("-");
                  })()}
                  required
                  disabled={bookingLoading}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              {/* Start Time */}
              <div>
                <label
                  htmlFor="startTime"
                  className="mb-1 block text-xs font-medium uppercase text-slate-600 dark:text-slate-300"
                >
                  Start Time
                </label>

                <input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  disabled={bookingLoading}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              {/* Hours */}
              <div>
                <label
                  htmlFor="bookingHours"
                  className="mb-1 block text-xs font-medium uppercase text-slate-600 dark:text-slate-300"
                >
                  Total Hours ({hours} hrs)
                </label>

                <input
                  id="bookingHours"
                  type="number"
                  min={1}
                  max={12}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  required
                  disabled={bookingLoading}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              {/* Total Amount */}
              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="flex justify-between gap-3 text-slate-600 dark:text-slate-400">
                  <span>Hourly Rate:</span>

                  <span>
                    ${studio.hourlyRate} x {hours} hrs
                  </span>
                </div>

                <div className="flex justify-between gap-3 border-t border-slate-200 pt-2 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                  <span>Total Amount:</span>

                  <span className="text-indigo-600 dark:text-indigo-400">
                    ${studio.hourlyRate * hours}
                  </span>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);

                    toast.add({
                      title: "Booking cancelled",
                      description: "Your booking request has been discarded.",
                      type: "info",
                    });
                  }}
                  disabled={bookingLoading}
                  className="w-1/2 rounded-xl border border-slate-300 bg-slate-100 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-1/2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-indigo-500"
                >
                  {bookingLoading ? "Processing..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
