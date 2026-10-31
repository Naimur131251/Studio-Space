"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Mock explore studios data
const allStudios = [
  {
    _id: "1",
    title: "Cyc Wall Studio Pro",
    category: "Photo Studio",
    hourlyRate: 60,
    rating: 4.9,
    location: "Downtown LA, Creative District",
    imageUrl:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600",
  },
  {
    _id: "2",
    title: "Cinema Sound Stage Alpha",
    category: "Film Stage",
    hourlyRate: 120,
    rating: 4.8,
    location: "Brooklyn Arts Hub, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=600",
  },
  {
    _id: "3",
    title: "Podcast Lounge Deluxe",
    category: "Podcast Lounge",
    hourlyRate: 45,
    rating: 4.9,
    location: "SoHo Media Center, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600",
  },
  {
    _id: "4",
    title: "Acoustic Music Suite",
    category: "Music Suite",
    hourlyRate: 75,
    rating: 4.7,
    location: "Nashville Sound Row, TN",
    imageUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600",
  },
  {
    _id: "5",
    title: "Minimalist Natural Light Loft",
    category: "Photo Studio",
    hourlyRate: 50,
    rating: 4.6,
    location: "Silver Lake, CA",
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600",
  },
  {
    _id: "6",
    title: "Indie Band Jam & Recording Room",
    category: "Music Suite",
    hourlyRate: 65,
    rating: 4.9,
    location: "Austin Music District, TX",
    imageUrl:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=600",
  },
];

export default function ExploreStudiosPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudios = allStudios.filter((studio) => {
    const matchesCategory =
      selectedCategory === "All" || studio.category === selectedCategory;
    const matchesSearch =
      studio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studio.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Explore Studios
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Discover and filter professional creative spaces for your next
            project
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 w-full md:w-72 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filter */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit space-y-6">
          <h3 className="font-semibold text-white text-base">Categories</h3>
          <div className="space-y-2">
            {[
              "All",
              "Photo Studio",
              "Film Stage",
              "Podcast Lounge",
              "Music Suite",
              "Workshop",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white font-medium"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Studios Grid */}
        <div className="lg:col-span-3">
          {filteredStudios.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl">
              <p className="text-slate-400 text-base">
                No studios found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl font-medium"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudios.map((studio) => (
                <div
                  key={studio._id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={studio.imageUrl}
                        alt={studio.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        width={500}
                        height={500}
                      />
                      <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full border border-slate-700">
                        {studio.category}
                      </span>
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-white text-base truncate">
                          {studio.title}
                        </h3>
                        <div className="flex items-center gap-1 text-amber-400 text-sm font-medium">
                          <span>★</span>
                          <span>{studio.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {studio.location}
                      </p>
                      <p className="text-indigo-400 font-bold text-lg">
                        ${studio.hourlyRate}{" "}
                        <span className="text-xs font-normal text-slate-400">
                          / hr
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <Link
                      href={`/studios/${studio._id}`}
                      className="w-full block text-center py-2.5 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-xl text-sm font-medium transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
