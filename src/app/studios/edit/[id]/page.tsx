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

  // Fetch logged-in user information
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const token = await getTokenFromClient();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("User API Error:", response.status, data);
          throw new Error(data.message || "Failed to fetch user information");
        }

        const user = data.user;

        setFormData((prev) => ({
          ...prev,
          hostName: user.name || "",
          hostEmail: user.email || "",
        }));
      } catch (error) {
        console.error("Fetch logged-in user error:", error);
      }
    };

    fetchLoggedInUser();
  }, []);

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

      const token = await getTokenFromClient();

      if (!token) {
        toast.add({
          title: "Authentication Required",
          description:
            "Unauthorized! Please login to check this page or perform this action.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/studios/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        },
      );

      if (response.status === 401 || response.status === 403) {
        toast.add({
          title: "Session Expired",
          description: "Unauthorized! Please login to check this page.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update studio");
      }

      toast.add({
        title: "Studio updated successfully!",
        description: "Your studio listing has been updated.",
        type: "success",
      });

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
    <div className="mx-auto max-w-3xl px-4 py-12 text-slate-900 dark:text-white">
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Update Studio Listing
          </h1>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Edit your existing studio information
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Host Information */}
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60 md:grid-cols-2">
            <div>
              <label
                htmlFor="hostName"
                className="mb-1 block text-xs font-medium uppercase text-slate-500 dark:text-slate-400"
              >
                Host Name (Read-Only)
              </label>

              <input
                id="hostName"
                type="text"
                name="hostName"
                value={formData.hostName}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
              />
            </div>

            <div>
              <label
                htmlFor="hostEmail"
                className="mb-1 block text-xs font-medium uppercase text-slate-500 dark:text-slate-400"
              >
                Host Email (Read-Only)
              </label>

              <input
                id="hostEmail"
                type="email"
                name="hostEmail"
                value={formData.hostEmail}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
              />
            </div>
          </div>

          {/* Studio Title & Category */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-xs font-medium uppercase text-slate-600 dark:text-slate-300"
              >
                Studio Title
              </label>

              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Studio Title"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-1 block text-xs font-medium uppercase text-slate-600 dark:text-slate-300"
              >
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <label
                htmlFor="hourlyRate"
                className="mb-1 block text-xs font-medium uppercase text-slate-600 dark:text-slate-300"
              >
                Hourly Rate ($)
              </label>

              <input
                id="hourlyRate"
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                min={1}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="securityDeposit"
                className="mb-1 block text-xs font-medium uppercase text-slate-600 dark:text-slate-300"
              >
                Security Deposit ($)
              </label>

              <input
                id="securityDeposit"
                type="number"
                name="securityDeposit"
                value={formData.securityDeposit}
                onChange={handleChange}
                min={0}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="maxCapacity"
                className="mb-1 block text-xs font-medium uppercase text-slate-600 dark:text-slate-300"
              >
                Max Capacity
              </label>

              <input
                id="maxCapacity"
                type="number"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleChange}
                min={1}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="mb-1 block text-xs font-medium uppercase text-slate-600 dark:text-slate-300"
            >
              Location / Address
            </label>

            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="imageUrl"
              className="mb-1 block text-xs font-medium uppercase text-slate-600 dark:text-slate-300"
            >
              Image URL
            </label>

            <input
              id="imageUrl"
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          {/* Amenities */}
          <div>
            <label
              htmlFor="amenities"
              className="mb-1 block text-xs font-medium uppercase text-slate-600 dark:text-slate-300"
            >
              Amenities (Comma Separated)
            </label>

            <input
              id="amenities"
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="Cyc Wall, Soundproof, Green Screen, WiFi"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Overview */}
          <div>
            <label
              htmlFor="overview"
              className="mb-1 block text-xs font-medium uppercase text-slate-600 dark:text-slate-300"
            >
              Detailed Overview
            </label>

            <textarea
              id="overview"
              name="overview"
              rows={4}
              value={formData.overview}
              onChange={handleChange}
              required
              className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-indigo-500 cursor-pointer"
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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Suspense
        fallback={
          <div className="py-12 text-center text-slate-600 dark:text-white">
            Loading Form...
          </div>
        }
      >
        <UpdateStudio params={params} />
      </Suspense>
    </div>
  );
}
