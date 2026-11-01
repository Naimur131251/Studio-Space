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
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios?featured=true&limit=4`,
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {featuredStudios.map((studio) => (
        <div
          key={studio._id}
          className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 transition-all hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10 dark:hover:border-slate-700"
        >
          <div>
            {/* Studio Image */}
            <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <Image
                src={studio.imageUrl}
                alt={studio.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <span className="absolute left-3 top-3 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-950/80 dark:text-indigo-400">
                {studio.category}
              </span>
            </div>

            {/* Studio Information */}
            <div className="space-y-2 p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                  {studio.title}
                </h3>

                <div className="flex shrink-0 items-center gap-1 text-sm font-medium text-amber-500 dark:text-amber-400">
                  <span aria-hidden="true">★</span>
                  <span>{studio.rating ?? "New"}</span>
                </div>
              </div>

              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {studio.location}
              </p>

              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                ${studio.hourlyRate}{" "}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  / hr
                </span>
              </p>
            </div>
          </div>

          {/* Details Button */}
          <div className="p-5 pt-0">
            <Link
              href={`/studios/${studio._id}`}
              className="block w-full rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-center text-sm font-medium text-slate-700 transition-all hover:border-indigo-600 hover:bg-indigo-600 hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-600 dark:hover:bg-indigo-600 dark:hover:text-white"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
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
