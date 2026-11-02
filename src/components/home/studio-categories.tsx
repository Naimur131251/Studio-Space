import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import {
  MoveRight,
  Camera,
  Music,
  Mic2,
  Palette,
  Clapperboard,
} from "lucide-react";
import { connection } from "next/server";

interface Category {
  name?: string;
  slug?: string;
  image?: string;
  category?: string;
  title?: string;
  imageUrl?: string;
  _id?: string;
}

interface Studio {
  _id: string;
  title?: string;
  name?: string;
  category?: string;
  categorySlug?: string;
  rating?: number;
  averageRating?: number;
  image?: string;
  imageUrl?: string;
  images?: string[];
}

interface CategoriesResponse {
  success: boolean;
  categories: Category[];
}

interface StudiosResponse {
  success: boolean;
  studios: Studio[];
}

const featuredCategories = [
  {
    name: "Photo Studios",
    slug: "photo-studios",
    keywords: ["photo studios", "photo studio", "photography"],
    icon: Camera,
    description: "Capture your creative vision",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800",
    color: "from-purple-500/20",
  },
  {
    name: "Sound Stages",
    slug: "sound-stages",
    keywords: ["sound stages", "sound stage"],
    icon: Clapperboard,
    description: "Professional spaces for production",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800",
    color: "from-blue-500/20",
  },
  {
    name: "Podcast Rooms",
    slug: "podcast-rooms",
    keywords: ["podcast rooms", "podcast room", "podcasting"],
    icon: Mic2,
    description: "Create your next great podcast",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800",
    color: "from-pink-500/20",
  },
  {
    name: "Music Suites",
    slug: "music-suites",
    keywords: ["music suites", "music suite", "music studio"],
    icon: Music,
    description: "Make music without limits",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800",
    color: "from-indigo-500/20",
  },
  {
    name: "Art Workshops",
    slug: "art-workshops",
    keywords: ["art workshops", "art workshop", "art studio"],
    icon: Palette,
    description: "Bring your artistic ideas to life",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
    color: "from-orange-500/20",
  },
];

async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios`,
      { cache: "no-store" },
    );

    if (!response.ok) return [];

    const data: CategoriesResponse = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error("Categories fetch error:", error);
    return [];
  }
}

async function getStudios(): Promise<Studio[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch studios:", response.status);
      return [];
    }

    const data: StudiosResponse = await response.json();

    return data.studios || [];
  } catch (error) {
    console.error("Studios fetch error:", error);
    return [];
  }
}

async function CategoryList() {
  await connection();

  const [allCategories, allStudios] = await Promise.all([
    getCategories(),
    getStudios(),
  ]);

  // console.log("===== ALL STUDIOS =====");
  // console.log("Total Studios:", allStudios.length);
  // console.log("First Studio:", allStudios[0]);
  // console.log("Studio Fields:", Object.keys(allStudios[0] || {}));

  // console.table(
  //   allStudios.map((studio) => ({
  //     id: studio._id,
  //     name: studio.title || studio.name,
  //     category: studio.category,
  //     categorySlug: studio.categorySlug,
  //     rating: studio.rating,
  //     averageRating: studio.averageRating,
  //     image: studio.image,
  //     imageUrl: studio.imageUrl,
  //   })),
  // );

  const categories = featuredCategories.map((featured) => {
    const matchedCategory = allCategories.find((cat) => {
      const name = (cat.name || cat.category || cat.title || "")
        .toLowerCase()
        .trim();

      const slug = (cat.slug || "").toLowerCase().trim();

      return (
        featured.keywords.includes(name) ||
        featured.keywords.some(
          (keyword) => keyword.replaceAll(" ", "-") === slug,
        ) ||
        featured.slug === slug
      );
    });

    // এই category-এর সব Studio খুঁজে বের করা
    const categoryStudios = allStudios.filter((studio) => {
      const studioCategory = (studio.categorySlug || studio.category || "")
        .toLowerCase()
        .trim();

      return (
        studioCategory === featured.slug ||
        featured.keywords.includes(studioCategory)
      );
    });

    // সবচেয়ে বেশি rating পাওয়া Studio
    const topStudio = [...categoryStudios].sort(
      (a, b) =>
        (b.averageRating ?? b.rating ?? 0) - (a.averageRating ?? a.rating ?? 0),
    )[0];

    return {
      ...featured,
      categorySlug: matchedCategory?.slug || featured.slug,
      image: featured.image,
      topRating: topStudio?.averageRating ?? topStudio?.rating ?? 0,
    };
  });

  if (categories.every((cat) => !cat.image)) {
    return (
      <p className="text-center text-slate-400 py-10">
        No categories available right now.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      {categories.map((cat) => {
        const Icon = cat.icon;

        return (
          <Link
            key={cat.slug}
            href={`/studios?category=${encodeURIComponent(cat.categorySlug)}`}
            className="
              group relative h-52 sm:h-60
              rounded-2xl overflow-hidden
              border border-slate-200 dark:border-slate-800
              bg-slate-100 dark:bg-slate-900
              shadow-md hover:shadow-xl
              transition-all duration-300
              hover:-translate-y-1
            "
          >
            {cat.image ? (
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                unoptimized
                className="
                  object-cover
                  transition-transform duration-700
                  group-hover:scale-110
                "
              />
            ) : (
              <div
                className={`
                  absolute inset-0 bg-linear-to-br
                  ${cat.color} to-slate-900
                  flex items-center justify-center
                `}
              >
                <Icon className="w-20 h-20 text-white/20" strokeWidth={1} />
              </div>
            )}

            <div
              className="
                absolute inset-0
                bg-linear-to-t
                from-slate-950 via-slate-950/40
                to-transparent
                opacity-90 group-hover:opacity-100
                transition-opacity duration-300
              "
            />

            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div
                className="
                  w-10 h-10 rounded-xl
                  bg-white/15 backdrop-blur-md
                  border border-white/20
                  flex items-center justify-center
                  mb-3
                  group-hover:bg-indigo-600
                  transition-colors duration-300
                "
              >
                <Icon className="w-5 h-5 text-white" />
              </div>

              <h3
                className="
                  text-white text-lg font-bold
                  group-hover:text-indigo-300
                  transition-colors
                "
              >
                {cat.name}
              </h3>

              <p className="text-slate-300 text-xs mt-1">{cat.description}</p>

              <div
                className="
                  flex items-center gap-2
                  text-indigo-300 text-sm font-medium
                  mt-4
                  opacity-0 translate-y-2
                  group-hover:opacity-100
                  group-hover:translate-y-0
                  transition-all duration-300
                "
              >
                Explore Studios
                <MoveRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function StudioCategories() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-2">
            Browse by Studio Categories
          </h2>

          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Find the perfect creative space for your next project.
          </p>
        </div>

        <Link
          href="/studios"
          className="
            hidden sm:inline-flex items-center gap-2
            text-sm font-semibold
            text-indigo-600 dark:text-indigo-400
            hover:gap-3 transition-all
            whitespace-nowrap
          "
        >
          See All Studios
          <MoveRight className="w-4 h-4" />
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {featuredCategories.map((cat) => (
              <div
                key={cat.slug}
                className="
                  h-52 sm:h-60 rounded-2xl
                  bg-slate-200 dark:bg-slate-800
                  animate-pulse
                "
              />
            ))}
          </div>
        }
      >
        <CategoryList />
      </Suspense>

      <div className="flex justify-center mt-8 sm:hidden">
        <Link
          href="/studios"
          className="
            inline-flex items-center gap-2
            px-5 py-3 rounded-xl
            border border-slate-300 dark:border-slate-700
            text-sm font-semibold
            hover:bg-slate-100 dark:hover:bg-slate-800
            transition-colors
          "
        >
          See All Studios
          <MoveRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
