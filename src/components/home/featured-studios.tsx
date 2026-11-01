import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

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
  const featuredStudios = await getFeaturedStudios();

  if (featuredStudios.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No featured studios available right now.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredStudios.map((studio) => (
        <div
          key={studio._id}
          className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-slate-700 transition-all"
        >
          <div>
            <div className="relative h-48 overflow-hidden">
              <Image
                src={studio.imageUrl}
                alt={studio.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full border border-slate-700">
                {studio.category}
              </span>
            </div>
            <div className="p-5 space-y-2">
              <div className="flex justify-between items-center gap-2">
                <h3 className="font-semibold text-white text-base truncate">
                  {studio.title}
                </h3>
                <div className="flex items-center gap-1 text-amber-400 text-sm font-medium shrink-0">
                  <span>★</span>
                  <span>{studio.rating ?? "New"}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 truncate">
                {studio.location}
              </p>
              <p className="text-indigo-400 font-bold text-lg">
                ${studio.hourlyRate}{" "}
                <span className="text-xs font-normal text-slate-400">/ hr</span>
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
  );
}

export default function FeaturedStudios() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Featured Studios
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Top-rated creative production spaces ready for booking
          </p>
        </div>
        <Link
          href="/studios"
          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
        >
          View All Studios &rarr;
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="text-center py-12 text-slate-400">
            Loading studios...
          </div>
        }
      >
        <StudioList />
      </Suspense>
    </section>
  );
}
