"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

export default function AddStudioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const studioData = Object.fromEntries(formData.entries());

    try {
      const token = await getTokenFromClient();
      if (!token) {
        toast.add({
          title: "Authentication Required",
          description: "Please login to add a new studio.",
          type: "error",
        });
        return;
      }
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/add-studios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(studioData),
        },
      );

      const data = await result.json();

      if (data.acknowledged || result.ok) {
        toast.add({
          title: "Studio added successfully!",
          description: "Your studio has been listed on StudioSpace.",
          type: "success",
        });
        form.reset();
        router.push("/my-listings");
      } else {
        toast.add({
          title: "Failed to add studio",
          description:
            data.message || "Something went wrong. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.add({
        title: "Connection Error",
        description: "Could not connect to the server.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-slate-900 dark:text-white">
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Add New Studio
          </h1>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            List your production workspace on StudioSpace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                required
                placeholder="e.g. Cinema Sound Stage Alpha"
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
                defaultValue="Photo Studio"
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
                required
                min={1}
                placeholder="75"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
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
                required
                min={0}
                placeholder="150"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
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
                required
                min={1}
                placeholder="10"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
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
              required
              placeholder="e.g. Downtown LA, Creative District"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
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
              required
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
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
              required
              placeholder="Describe your studio space, equipment, rules, and unique features..."
              className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Read-only Host Information */}
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60 md:grid-cols-2">
            <div>
              <label
                htmlFor="hostName"
                className="mb-1 block text-[10px] font-medium uppercase text-slate-500"
              >
                Host Name (Read-Only)
              </label>

              <input
                id="hostName"
                type="text"
                readOnly
                value={"Naimur"}
                className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-500 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
              />
            </div>

            <div>
              <label
                htmlFor="hostEmail"
                className="mb-1 block text-[10px] font-medium uppercase text-slate-500"
              >
                Host Email (Read-Only)
              </label>

              <input
                id="hostEmail"
                type="email"
                readOnly
                value={"naimur@mail"}
                className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-500 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-indigo-500 cursor-pointer"
          >
            {loading ? "Publishing Listing..." : "Publish Studio Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}
