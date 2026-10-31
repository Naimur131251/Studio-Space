import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Photo Studios",
    image:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=500",
    slug: "Photo Studio",
  },
  {
    name: "Sound Stages",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=500",
    slug: "Film Stage",
  },
  {
    name: "Podcast Rooms",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=500",
    slug: "Podcast Lounge",
  },
  {
    name: "Music Suites",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=500",
    slug: "Music Suite",
  },
  {
    name: "Art Workshops",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=500",
    slug: "Workshop",
  },
];

export default function StudioCategories() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Browse by Category
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Find the ideal creative workspace tailored for your project
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={`/studios?category=${encodeURIComponent(cat.slug)}`}
            className="group relative h-48 rounded-2xl overflow-hidden border border-slate-800 shadow-md bg-slate-900 block"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-70 group-hover:opacity-90"
              width={500}
              height={500}
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-4">
              <span className="text-white font-semibold text-sm md:text-base group-hover:text-indigo-400 transition-colors">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
