"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/my-listings`,
          {
            cache: "no-store", // রি-ফ্রেশে সবসময় লেটেস্ট ডেটা পাওয়ার জন্য
          },
        );
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleDelete = async () => {
    if (deleteId) {
      try {
        setListings(listings.filter((item) => item._id !== deleteId));
        setDeleteId(null);
        alert("Listing deleted successfully!");
      } catch (error) {
        console.error("Error deleting listing:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            My Studio Listings
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage, edit, or delete your posted studio workspaces
          </p>
        </div>
        <Link
          href="/add-studio"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-md shadow-indigo-600/20"
        >
          + Add New Studio
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-indigo-400 font-medium animate-pulse">
            Loading listings...
          </p>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400">
            You haven&apos;t listed any studio workspaces yet.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Studio Workspace</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Rate</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {listings.map((studio) => (
                <tr
                  key={studio._id}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <Image
                      src={
                        // studio.imageUrl ||
                        "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=300"
                      }
                      alt={studio.title}
                      className="w-12 h-12 rounded-lg object-cover"
                      width={50}
                      height={50}
                    />
                    <span className="font-semibold text-white">
                      {studio.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">{studio.category}</td>
                  <td className="px-6 py-4 font-bold text-indigo-400">
                    ${studio.hourlyRate}/hr
                  </td>
                  <td className="px-6 py-4">{studio.location}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/studios/edit/${studio._id}`}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => setDeleteId(studio._id)}
                      className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            <h3 className="text-lg font-bold text-white">
              Delete Studio Listing?
            </h3>
            <p className="text-slate-400 text-sm">
              Are you sure you want to remove this listing? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="w-1/2 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-1/2 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium"
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
