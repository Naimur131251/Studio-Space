import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { connection } from "next/server";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  rating: number;
  location: string;
  imageUrl: string;
}

interface StudiosResponse {
  success: boolean;
  total: number;
  studios: Studio[];
}

async function getFeaturedStudios(): Promise<Studio[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios?featured=true`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch featured studios");
    }

    const data: StudiosResponse = await response.json();

    return data.studios || [];
  } catch (error) {
    console.error("Featured Studios Error:", error);
    return [];
  }
}

async function StudioList() {
  // Force dynamic rendering for this section
  await connection();

  const featuredStudios = await getFeaturedStudios();

  if (featuredStudios.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 dark:text-slate-400">
        No featured studios available right now.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[300px_300px]">
      {featuredStudios.map((studio, index) => {
        const isWide = index === 0 || index === 5;

        return (
          <div
            key={studio._id}
            className={`group flex h-full min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50
            ${isWide ? "lg:col-span-2 lg:flex-row" : "lg:col-span-1 lg:flex-col"}`}
          >
            {/* Image */}
            <div
              className={`relative shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800
                ${
                  isWide
                    ? "h-48 sm:h-56 lg:h-full lg:w-[45%]"
                    : "h-44 sm:h-48 lg:h-35 lg:w-full"
                }`}
            >
              <Image
                src={studio.imageUrl}
                alt={studio.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

              <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-slate-950/80 px-3 py-1 text-[10px] font-semibold text-indigo-300 backdrop-blur-md">
                {studio.category}
              </span>
            </div>

            {/* Content */}
            <div
              className={`flex min-h-0 min-w-0 flex-1 flex-col justify-between overflow-hidden
                ${isWide ? "p-4 lg:p-5" : "p-3"}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className={`truncate font-semibold text-slate-900 dark:text-white
                      ${isWide ? "text-base lg:text-lg" : "text-sm"}`}
                  >
                    {studio.title}
                  </h3>

                  <span className="shrink-0 text-xs font-semibold text-amber-500">
                    ★ {studio.rating ?? "New"}
                  </span>
                </div>

                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {studio.location}
                </p>

                <p className="font-bold text-indigo-600 dark:text-indigo-400">
                  ${studio.hourlyRate}
                  <span className="ml-1 text-xs font-normal text-slate-500">
                    / hr
                  </span>
                </p>
              </div>

              <Link
                href={`/studios/${studio._id}`}
                className="mt-3 block w-full rounded-xl border border-slate-200 bg-slate-100 py-2 text-center text-xs font-semibold text-slate-700 transition-all hover:border-indigo-600 hover:bg-indigo-600 hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-600 dark:hover:bg-indigo-600 dark:hover:text-white"
              >
                View Details
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FeaturedStudios() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 text-slate-900 transition-colors sm:px-6 lg:px-8 dark:text-white">
      {/* Section Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">
            Featured Studios
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Top-rated creative production spaces ready for booking
          </p>
        </div>

        <Link
          href="/studios"
          className="shrink-0 text-sm font-medium text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          View All Studios &rarr;
        </Link>
      </div>

      {/* Studios List */}
      <Suspense
        fallback={
          <div className="py-12 text-center text-slate-500 dark:text-slate-400">
            Loading studios...
          </div>
        }
      >
        <StudioList />
      </Suspense>
    </section>
  );
}
