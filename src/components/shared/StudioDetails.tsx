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
  const submitBooking = async (payload: BookingPayload, token: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

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

        alert("Reservation submitted successfully!");

        router.replace("/my-bookings");
      } catch (error) {
        bookingProcessed.current = false;

        console.error("Automatic booking error:", error);

        alert(
          error instanceof Error
            ? error.message
            : "Failed to complete booking.",
        );
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
      alert("Please fill in all booking information.");
      return;
    }

    // Prevent past dates
    const today = new Date();
    const localToday = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    if (bookingDate < localToday) {
      alert("Please select a valid booking date.");
      return;
    }

    try {
      setBookingLoading(true);

      const [hour, minute] = startTime.split(":").map(Number);

      const endMinutes = hour * 60 + minute + hours * 60;

      // if (endMinutes > 24 * 60) {
      //   throw new Error("Booking cannot extend beyond midnight.");
      // }

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

      const bookingPayload: BookingPayload = {
        studioId: studio._id,
        studioTitle: studio.title,
        category: studio.category,
        bookingDate,
        timeSlot,
        totalAmount: studio.hourlyRate * hours,
      };

      let token: string;

      try {
        token = await getTokenFromClient();
      } catch (error) {
        console.error("Authentication required:", error);

        router.push(
          `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
        );

        return;
      }

      // User is not logged in
      if (!token) {
        sessionStorage.setItem(
          PENDING_BOOKING_KEY,
          JSON.stringify(bookingPayload),
        );

        const callbackUrl = `/studios/${id}`;

        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);

        return;
      }

      // User is logged in
      await submitBooking(bookingPayload, token);

      alert("Reservation submitted successfully!");

      setIsModalOpen(false);
      setBookingDate("");
      setStartTime("");
      setHours(2);

      router.push("/my-bookings");
    } catch (error) {
      console.error("Booking error:", error);

      alert(
        error instanceof Error ? error.message : "Failed to create booking.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="h-9 w-56 bg-slate-800 rounded" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-95 md:h-112.5 bg-slate-900 rounded-2xl" />
            <div className="h-24 bg-slate-900 rounded-2xl" />
            <div className="h-32 bg-slate-900 rounded-2xl" />
          </div>

          <div className="space-y-6">
            <div className="h-40 bg-slate-900 rounded-2xl" />
            <div className="h-64 bg-slate-900 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !studio) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <h2 className="text-xl font-bold text-white">
            {error || "Studio not found"}
          </h2>

          <p className="text-slate-400 text-sm mt-2">
            We could not load this studio.
          </p>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setRetry((prev) => prev + 1)}
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm rounded-xl"
            >
              Try Again
            </button>

            <button
              onClick={() => router.push("/studios")}
              className="px-5 py-2.5 bg-slate-800 text-white text-sm rounded-xl"
            >
              Explore Studios
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Studio Details
        </h1>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <div className="space-y-4">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {galleryImages.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="rounded-2xl overflow-hidden border border-slate-800 h-95 md:h-112.5 relative">
                      <Image
                        src={img}
                        alt={`${studio.title} ${index + 1}`}
                        className="object-cover w-full h-full"
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
                  <CarouselPrevious className="left-4 bg-slate-900/80 border-slate-700 text-white" />
                  <CarouselNext className="right-4 bg-slate-900/80 border-slate-700 text-white" />
                </>
              )}
            </Carousel>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 ${
                      currentIndex === index
                        ? "border-indigo-500 scale-105"
                        : "border-slate-800 opacity-70"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
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
            <h3 className="text-xl font-bold uppercase text-slate-400">
              Description
            </h3>

            <h2 className="text-lg font-bold text-white uppercase">
              {studio.title}
            </h2>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              {studio.overview}
            </p>
          </div>

          {/* Amenities */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-bold text-white">Amenities</h3>

            <div className="space-y-3">
              {studio.amenities?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-sm text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-indigo-400">{item.icon}</span>
                    {item.name}
                  </span>

                  <span className="text-slate-400 text-xs">Included</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Workspace Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-base font-bold text-white">Full Workspace</h4>

            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="font-semibold text-white">
                  {studio.category}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Production:</span>
                <span className="font-semibold text-white">
                  ${studio.hourlyRate}/hr
                </span>
              </div>

              <div className="flex justify-between">
                <span>Security Deposit:</span>
                <span className="font-semibold text-white">
                  ${studio.securityDeposit}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Max Capacity:</span>
                <span className="font-semibold text-white">
                  {studio.maxCapacity} People
                </span>
              </div>
            </div>
          </div>

          {/* Amenities Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-base font-bold text-white">Amenities</h4>

            <div className="grid grid-cols-1 gap-2">
              {studio.amenities?.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-sm text-slate-200 py-1"
                >
                  <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400">
                    {amenity.icon}
                  </span>

                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Host */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Host Details
              </h4>

              <span className="text-[10px] bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                Premier Studio
              </span>
            </div>

            <div className="flex items-center gap-4">
              {studio.host?.avatar && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={studio.host.avatar}
                    alt={studio.host.name || "Studio Host"}
                    className="object-cover w-full h-full"
                    width={100}
                    height={100}
                  />
                </div>
              )}

              <div>
                <h5 className="font-semibold text-white text-sm">
                  {studio.host?.name || "Studio Host"}
                </h5>

                <p className="text-xs text-slate-400">
                  {studio.host?.email || "No email available"}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-4 bg-white hover:bg-slate-200 text-slate-950 font-bold rounded-xl transition-all shadow-xl text-sm"
          >
            Book Workspace Now
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">
                Reserve Studio Slot
              </h3>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Booking Date */}
              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                  Booking Date
                </label>

                <input
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
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                  Start Time
                </label>

                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Hours */}
              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                  Total Hours ({hours} hrs)
                </label>

                <input
                  type="number"
                  min={1}
                  max={12}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  required
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Total Amount */}
              <div className="bg-slate-950 p-4 rounded-xl space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Hourly Rate:</span>
                  <span>
                    ${studio.hourlyRate} x {hours} hrs
                  </span>
                </div>

                <div className="flex justify-between font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Amount:</span>

                  <span className="text-indigo-400">
                    ${studio.hourlyRate * hours}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={bookingLoading}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium disabled:opacity-50"
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
