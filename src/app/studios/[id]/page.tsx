"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export default function StudioDetailsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [hours, setHours] = useState(2);

  // Carousel API ebong current index track korar jonno state
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const studio = {
    _id: "1",
    title: "Cyc Wall Studio Pro",
    category: "Photo Studio",
    hourlyRate: 60,
    securityDeposit: 150,
    maxCapacity: 15,
    location: "Downtown LA, Creative District",
    images: [
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1527011046414-478ddf501aaf?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000",
    ],
    amenities: [
      { name: "Cyc Wall", icon: "◻" },
      { name: "Lighting Kit", icon: "💡" },
      { name: "Soundproof", icon: "🔊" },
      { name: "Green Screen", icon: "🟩" },
      { name: "WiFi", icon: "📶" },
    ],
    overview:
      "Premium professional cyc wall studio designed for high-end fashion shoots, commercial video production, and music videos. Fully equipped with professional lighting grids, dressing rooms, and lightning-fast fiber WiFi.",
    rating: 4.9,
    hostName: "Anna Cordero",
    hostEmail: "host@studiospace.com",
    hostAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  };

  // Carousel event listener ebong Auto Slider setup
  useEffect(() => {
    if (!api) return;

    // Slide change hole index update hobe
    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });

    // Auto Slide Interval (Protibar 4 সেকেন্ড por por slide poriborton hobe)
    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0); // Sesh slide a gele abar prothom theke shuru hobe
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Booking request submitted successfully! Status: Pending.");
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Studio Details
        </h1>
      </div>

      {/* Main Grid: Left Details & Gallery, Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shadcn Carousel Gallery with Auto-Slide & Sync */}
          <div className="space-y-4">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {studio.images.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="rounded-2xl overflow-hidden border border-slate-800 h-95 md:h-112.5 relative">
                      <Image
                        src={img}
                        alt={`${studio.title} ${index + 1}`}
                        className="object-cover"
                        fill
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-slate-900/80 border-slate-700 text-white hover:bg-slate-800" />
              <CarouselNext className="right-4 bg-slate-900/80 border-slate-700 text-white hover:bg-slate-800" />
            </Carousel>

            {/* Thumbnail Row with Active Highlight */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {studio.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    currentIndex === index
                      ? "border-indigo-500 scale-105 shadow-lg shadow-indigo-500/20"
                      : "border-slate-800 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt="Thumbnail"
                    className="object-cover"
                    fill
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3 pt-4">
            <h3 className="text-xl font-bold uppercase tracking-wide text-slate-400">
              Description
            </h3>
            <h2 className="text-lg font-bold text-white uppercase">
              {studio.title}
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              {studio.overview}
            </p>
          </div>

          {/* Amenities List */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-bold text-white">Amenities</h3>
            <div className="space-y-3">
              {studio.amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-sm text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-indigo-400">{item.icon}</span>{" "}
                    {item.name}
                  </span>
                  <span className="text-slate-400 text-xs">
                    {idx === 0 ? "$260/hr" : idx === 1 ? "$80/hr" : "$16/hr"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Workspace Info Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-base font-bold text-white">Full Workspace</h4>
            <div className="space-y-1 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Specification:</span>
                <span className="font-semibold text-white">$120/hr</span>
              </div>
              <div className="flex justify-between">
                <span>Production:</span>
                <span className="font-semibold text-white">
                  ${studio.hourlyRate}/hr
                </span>
              </div>
            </div>
          </div>

          {/* Amenities Summary Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-base font-bold text-white">Amenities</h4>
            <div className="grid grid-cols-1 gap-2">
              {studio.amenities.map((amenity, idx) => (
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

          {/* Host Card */}
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
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                <Image
                  src={studio.hostAvatar}
                  alt={studio.hostName}
                  className="object-cover"
                  fill
                />
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm">
                  {studio.hostName}
                </h5>
                <p className="text-xs text-slate-400">{studio.hostEmail}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
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
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                  Booking Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
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

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-600/30"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
