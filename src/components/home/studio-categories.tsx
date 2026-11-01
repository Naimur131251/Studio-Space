import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { MoveRight } from "lucide-react";
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

interface CategoriesResponse {
  success: boolean;
  categories: Category[];
}

async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studio-categories`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error(`Failed to fetch categories. Status: ${response.status}`);
      return [];
    }

    const data: CategoriesResponse = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error("Categories fetch error:", error);
    return [];
  }
}

async function CategoryList() {
  await connection();
  const allCategories = await getCategories();

  if (allCategories.length === 0) {
    return (
      <p className="text-center text-slate-400 py-10">
        No categories available right now.
      </p>
    );
  }

  const categories = allCategories.slice(0, 5);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((cat, index) => {
        const categoryName =
          cat.name || cat.category || cat.title || `Category ${index + 1}`;
        const categorySlug = cat.slug || cat.category || "unknown";
        const categoryImage =
          cat.image || cat.imageUrl || "https://unsplash.com";

        return (
          <Link
            key={cat._id || index}
            href={`/studios?category=${encodeURIComponent(categorySlug)}`}
            className="group relative h-40 sm:h-48 rounded-2xl overflow-hidden border border-slate-800 shadow-md bg-slate-900 block"
          >
            <Image
              src={categoryImage}
              alt={categoryName}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-70 group-hover:opacity-90"
              unoptimized
            />

            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-4">
              <span className="text-white font-semibold text-sm md:text-base group-hover:text-indigo-400 transition-colors">
                {categoryName}
              </span>
            </div>
          </Link>
        );
      })}
      <Link
        href="/studios"
        className="flex gap-2 items-center mt-3 hover:text-indigo-300"
      >
        See All Categories <MoveRight />
      </Link>
    </div>
  );
}

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

      <Suspense
        fallback={
          <div className="text-center py-12 text-slate-400">
            Loading categories...
          </div>
        }
      >
        <CategoryList />
      </Suspense>
    </section>
  );
}
