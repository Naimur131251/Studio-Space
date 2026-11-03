"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

interface StudioListing {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  imageUrl: string;
}

export default function MyListingsPage() {
  const [listings, setListings] = useState<StudioListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = await getTokenFromClient();

        console.log("JWT received:", !!token);

        if (!token) {
          toast.add({
            title: "Access Denied",
            description: "Unauthorized! Please login to check this page.",
            type: "error",
          });
          router.push(
            "/login?callbackUrl=" +
              encodeURIComponent(window.location.pathname),
          );
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/my-listings`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          },
        );

        console.log("Response status:", response.status);

        if (response.status === 401 || response.status === 403) {
          toast.add({
            title: "Session Expired",
            description: "Unauthorized! Please login to check this page.",
            type: "error",
          });
          router.push(
            "/login?callbackUrl=" +
              encodeURIComponent(window.location.pathname),
          );
          return;
        }

        if (!response.ok) {
          console.log(`HTTP Error: ${response.status}`);
          throw new Error("Failed to fetch listings from server.");
        }

        const data = await response.json();

        console.log("API RESPONSE:", data);
        console.log("Is Array:", Array.isArray(data));

        if (!Array.isArray(data)) {
          throw new Error("API response is not an array");
        }

        setListings(data);
      } catch (error: unknown) {
        console.error("Error fetching listings:", error);
        setListings([]);

        toast.add({
          title: "Error fetching listings",
          description:
            error instanceof Error
              ? error.message
              : "Something went wrong while loading your listings.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [router]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const token = await getTokenFromClient();

      if (!token) {
        toast.add({
          title: "Authentication Required",
          description:
            "Unauthorized! Please login to check this page or perform this action.",
          type: "error",
        });
        setDeleteId(null);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401 || response.status === 403) {
        toast.add({
          title: "Session Expired",
          description: "Unauthorized! Please login to check this page.",
          type: "error",
        });
        setDeleteId(null);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete listing");
      }

      setListings((prev) => prev.filter((item) => item._id !== deleteId));
      setDeleteId(null);

      toast.add({
        title: "Listing deleted successfully!",
        description:
          "The studio has been permanently removed from StudioSpace.",
        type: "success",
      });
    } catch (error: unknown) {
      console.error("Error deleting listing:", error);
      setDeleteId(null);

      toast.add({
        title: "Failed to delete listing",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 text-slate-900 dark:text-white sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            My Studio Listings
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage, edit, or delete your posted studio workspaces
          </p>
        </div>
        <Link
          href="/add-studio"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-600/20 transition-colors hover:bg-indigo-700 dark:hover:bg-indigo-500 sm:w-auto w-full text-center"
        >
          + Add New Studio
        </Link>
      </div>

      {/* Loading / Content */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="animate-pulse font-medium text-indigo-600 dark:text-indigo-400">
            Loading listings...
          </p>
        </div>
      ) : listings.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-400">
            You haven&apos;t listed any studio workspaces yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 1. Mobile & Tablet Layout (Cards) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {listings.map((studio) => (
              <div
                key={studio._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4"
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={
                      studio.imageUrl ||
                      "https://images.unsplash.com/photo-1655831068474-00da7930d340?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                    }
                    alt={studio.title}
                    className="h-16 w-16 rounded-xl object-cover flex shrink-0"
                    width={64}
                    height={64}
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">
                      {studio.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {studio.category}
                    </p>
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      ${studio.hourlyRate}/hr
                    </p>
                  </div>
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 pt-3 dark:border-slate-800/60">
                  <span className="text-xs text-slate-400 block mb-0.5">
                    Location
                  </span>
                  {studio.location}
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <Link
                    href={`/studios/edit/${studio._id}`}
                    className="w-1/2 rounded-xl border border-slate-200 bg-slate-100 py-2 text-center text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    Update
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteId(studio._id)}
                    className="w-1/2 rounded-xl bg-red-50 py-2 text-center text-xs font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white dark:bg-red-600/20 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 2. Desktop Layout (Table) */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-100 text-xs uppercase text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th className="whitespace-nowrap px-6 py-4">
                    Studio Workspace
                  </th>
                  <th className="px-6 py-4">Category</th>
                  <th className="whitespace-nowrap px-6 py-4">Rate</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {listings.map((studio) => (
                  <tr
                    key={studio._id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={
                            studio.imageUrl ||
                            "https://images.unsplash.com/photo-1655831068474-00da7930d340?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                          }
                          alt={studio.title}
                          className="h-12 w-12 rounded-lg object-cover"
                          width={50}
                          height={50}
                        />
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {studio.title}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600 dark:text-slate-300">
                      {studio.category}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">
                      ${studio.hourlyRate}/hr
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {studio.location}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/studios/edit/${studio._id}`}
                          className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          Update
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteId(studio._id)}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white dark:bg-red-600/20 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 backdrop-blur-sm dark:bg-slate-950/80 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-studio-title"
            className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150"
          >
            <h3
              id="delete-studio-title"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              Delete Studio Listing?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to remove this listing?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="w-1/2 rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="w-1/2 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
