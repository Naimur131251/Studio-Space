"use client";

import { Suspense, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface StudioFormData {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  imageUrl: string;
  amenities: string;
  overview: string;
  hostName: string;
  hostEmail: string;
}

export function UpdateStudio({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<StudioFormData>({
    title: "",
    category: "Photo Studio",
    hourlyRate: "",
    securityDeposit: "",
    maxCapacity: "",
    location: "",
    imageUrl: "",
    amenities: "",
    overview: "",
    hostName: "",
    hostEmail: "",
  });

  // Reusable input change handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 1. Fetch existing studio data
  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/${id}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch studio details");
        }

        const data = await response.json();

        // Supports both direct object and { studio: {...} }
        const studio = data.studio ?? data;

        setFormData({
          title: studio.title ?? "",
          category: studio.category ?? "Photo Studio",
          hourlyRate: String(studio.hourlyRate ?? ""),
          securityDeposit: String(studio.securityDeposit ?? ""),
          maxCapacity: String(studio.maxCapacity ?? ""),
          location: studio.location ?? "",
          imageUrl: studio.imageUrl ?? "",
          amenities: Array.isArray(studio.amenities)
            ? studio.amenities.join(", ")
            : (studio.amenities ?? ""),
          overview: studio.overview ?? "",
          hostName: studio.hostName ?? "",
          hostEmail: studio.hostEmail ?? "",
        });
      } catch (error) {
        console.error("Fetch studio error:", error);

        toast.add({
          title: "Failed to load studio",
          description: "Could not load the existing studio information.",
          type: "error",
        });
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchStudio();
    }
  }, [id]);

  // 2. Update studio data
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedData = {
        ...formData,
        hourlyRate: Number(formData.hourlyRate),
        securityDeposit: Number(formData.securityDeposit),
        maxCapacity: Number(formData.maxCapacity),
        amenities: formData.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const token = await getTokenFromClient()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updatedData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update studio");
      }

      toast.add({
        title: "Studio updated successfully!",
        description: "Your studio listing has been updated.",
        type: "success",
      });

      // Redirect after showing success toast
      setTimeout(() => {
        router.push("/my-listings");
      }, 1000);
    } catch (error) {
      console.error("Update studio error:", error);

      toast.add({
        title: "Update failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        type: "error",
      });

      setLoading(false);
    }
  };

  // 3. Loading state
  if (fetching) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-indigo-400 font-medium animate-pulse">
          Fetching current studio details...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">
            Update Studio Listing
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Edit your existing studio information
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Host Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-1">
                Host Name (Read-Only)
              </label>

              <input
                type="text"
                name="hostName"
                value={formData.hostName}
                readOnly
                className="w-full bg-transparent text-slate-400 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-1">
                Host Email (Read-Only)
              </label>

              <input
                type="email"
                name="hostEmail"
                value={formData.hostEmail}
                readOnly
                className="w-full bg-transparent text-slate-400 text-sm outline-none"
              />
            </div>
          </div>

          {/* Studio Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                Studio Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Studio Title"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="Photo Studio">Photo Studio</option>
                <option value="Film Stage">Film Stage</option>
                <option value="Podcast Lounge">Podcast Lounge</option>
                <option value="Music Suite">Music Suite</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>
          </div>

          {/* Rate, Deposit & Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                Hourly Rate ($)
              </label>

              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                min={1}
                required
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                Security Deposit ($)
              </label>

              <input
                type="number"
                name="securityDeposit"
                value={formData.securityDeposit}
                onChange={handleChange}
                min={0}
                required
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                Max Capacity
              </label>

              <input
                type="number"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleChange}
                min={1}
                required
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
              Location / Address
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
              Image URL
            </label>

            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
              Amenities (Comma Separated)
            </label>

            <input
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="Cyc Wall, Soundproof, Green Screen, WiFi"
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Overview */}
          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
              Detailed Overview
            </label>

            <textarea
              name="overview"
              rows={4}
              value={formData.overview}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/30 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function UpdateStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* নেক্সট জেএস এর বিল্ড ইরর এড়াতে এখানে Suspense ব্যবহার করা হয়েছে */}
      <Suspense
        fallback={
          <div className="text-center text-white py-12">Loading Form...</div>
        }
      >
        <UpdateStudio params={params} />
      </Suspense>
    </div>
  );
}
