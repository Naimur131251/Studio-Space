"use client";

import { useCallback, useEffect, useState } from "react";
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
  const [retry, setRetry] = useState(0);

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
  }, [selectedCategory, searchQuery, retry]);

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
  };

  // Retry fetching studios
  const handleRetry = useCallback(() => {
    setRetry((prev) => prev + 1);
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore Studios
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
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
              aria-label="Search studios by title or location"
              className="
                w-full md:w-72 rounded-xl border px-4 py-2.5 text-sm
                outline-none transition-colors
                bg-white border-slate-300 text-slate-900
                placeholder:text-slate-400 focus:border-indigo-500
                dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200
                dark:placeholder:text-slate-500
              "
            />
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter */}
          <aside className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-fit space-y-6 transition-colors">
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              Categories
            </h3>

            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white font-medium"
                      : "text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          {/* Studios Grid */}
          <section className="lg:col-span-3">
            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-slate-200 dark:bg-slate-800" />

                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                    </div>

                    <div className="p-5 pt-0">
                      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              /* Error State */
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-red-500 dark:text-red-400 text-base">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={handleRetry}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-xl font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : studios.length === 0 ? (
              /* Empty State */
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  No studios found
                </h3>

                <p className="text-slate-600 dark:text-slate-400 text-base mt-2">
                  No studios found matching your criteria.
                </p>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-xl font-medium transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              /* Studio Cards */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {studios.map((studio) => (
                  <article
                    key={studio._id}
                    className="
                      bg-white dark:bg-slate-900
                      border border-slate-200 dark:border-slate-800
                      rounded-2xl overflow-hidden shadow-lg
                      flex flex-col justify-between group
                      hover:border-indigo-300 dark:hover:border-slate-700
                      hover:shadow-xl transition-all duration-300
                    "
                  >
                    <div>
                      {/* Studio Image */}
                      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={studio.imageUrl}
                          alt={studio.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          width={500}
                          height={500}
                        />

                        <span className="absolute top-3 left-3 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                          {studio.category}
                        </span>
                      </div>

                      {/* Studio Information */}
                      <div className="p-5 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-base truncate">
                            {studio.title}
                          </h3>

                          <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 text-sm font-medium shrink-0">
                            <span>★</span>
                            <span>{studio.rating}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          {studio.location}
                        </p>

                        <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                          ${studio.hourlyRate}{" "}
                          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                            / hr
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* View Details */}
                    <div className="p-5 pt-0">
                      <Link
                        href={`/studios/${studio._id}`}
                        className="
                          w-full block text-center py-2.5 rounded-xl
                          bg-slate-100 hover:bg-indigo-600
                          text-slate-800 hover:text-white
                          dark:bg-slate-800 dark:hover:bg-indigo-600
                          dark:text-slate-200
                          transition-all text-sm font-medium
                        "
                      >
                        View Details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
