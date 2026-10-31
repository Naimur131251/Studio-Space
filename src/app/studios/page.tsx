"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Studio Type
interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  rating: number;
  location: string;
  imageUrl: string;
}

// Categories
const categories = [
  "All",
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

export default function ExploreStudiosPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch studios from Express API
  useEffect(() => {
    const controller = new AbortController();

    const fetchStudios = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (selectedCategory !== "All") {
          params.set("category", selectedCategory);
        }

        if (searchQuery.trim()) {
          params.set("search", searchQuery.trim());
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios?${params.toString()}`,
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch studios");
        }

        const data = await response.json();

        setStudios(data.studios || []);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Fetch studios error:", error);

        setError("Unable to load studios. Please try again.");
        setStudios([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchStudios();

    return () => {
      controller.abort();
    };
  }, [selectedCategory, searchQuery]);

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
  };

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
            {categories.map((cat) => (
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
          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-slate-800" />

                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                    <div className="h-5 bg-slate-800 rounded w-1/3" />
                  </div>

                  <div className="p-5 pt-0">
                    <div className="h-10 bg-slate-800 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            /* Error State */
            <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl">
              <p className="text-red-400 text-base">{error}</p>

              <button
                onClick={() => {
                  setSearchQuery((prev) => prev + " ");
                  setSearchQuery((prev) => prev.trim());
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl font-medium"
              >
                Try Again
              </button>
            </div>
          ) : studios.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl">
              <p className="text-slate-400 text-base">
                No studios found matching your criteria.
              </p>

              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl font-medium"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* Studio Cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {studios.map((studio) => (
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
