"use client";

import { useState } from "react";
import Image from "next/image";

export default function StudioDetailsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [hours, setHours] = useState(2);

  const studio = {
    _id: "1",
    title: "Cyc Wall Studio Pro",
    category: "Photo Studio",
    hourlyRate: 60,
    securityDeposit: 150,
    maxCapacity: 15,
    location: "Downtown LA, Creative District",
    imageUrl:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000",
    amenities: [
      "Cyc Wall",
      "Lighting Kit",
      "Soundproof",
      "Green Screen",
      "WiFi",
      "Makeup Station",
    ],
    overview:
      "Premium professional cyc wall studio designed for high-end fashion shoots, commercial video production, and music videos. Fully equipped with professional lighting grids, dressing rooms, and lightning-fast fiber WiFi.",
    rating: 4.9,
    hostName: "Anna Cordero",
    hostEmail: "host@studiospace.com",
    hostAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Booking request submitted successfully! Status: Pending.");
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Details Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold rounded-full uppercase">
              {studio.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-3">
              {studio.title}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {studio.location} • ⭐ {studio.rating} (48 Reviews)
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-800 h-100">
            <Image
              src={studio.imageUrl}
              alt={studio.title}
              className="w-full h-full object-cover"
              width={500}
              height={500}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Description</h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              {studio.overview}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">
              Amenities & Equipment
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {studio.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-sm text-slate-200 flex items-center gap-2"
                >
                  <span className="text-indigo-400">✓</span> {amenity}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Card Sidebar */}
        <div className="space-y-6">
          {/* Host Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Host Details
            </h4>
            <div className="flex items-center gap-4">
              <Image
                src={studio.hostAvatar}
                alt={studio.hostName}
                className="w-12 h-12 rounded-full object-cover"
                width={500}
                height={500}
              />
              <div>
                <h5 className="font-semibold text-white text-sm">
                  {studio.hostName}
                </h5>
                <p className="text-xs text-slate-400">{studio.hostEmail}</p>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 top-24 sticky">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-extrabold text-indigo-400">
                ${studio.hourlyRate}
              </span>
              <span className="text-xs text-slate-400">/ hour</span>
            </div>

            <div className="space-y-3 border-t border-slate-800 pt-4 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Security Deposit:</span>
                <span className="font-semibold text-white">
                  ${studio.securityDeposit}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Max Capacity:</span>
                <span className="font-semibold text-white">
                  {studio.maxCapacity} Creators
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/30 text-sm"
            >
              Book Workspace Now
            </button>
          </div>
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
