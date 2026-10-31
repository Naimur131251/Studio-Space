import Link from "next/link";
import Image from "next/image";

// Mock featured data (Will be fetched via MongoDB .limit(6))
const featuredStudios = [
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
];

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
    </section>
  );
}
