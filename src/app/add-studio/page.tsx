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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Add New Studio</h1>
          <p className="text-slate-400 text-sm mt-1">
            List your production workspace on StudioSpace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                Studio Title
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Cinema Sound Stage Alpha"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                Category
              </label>
              <select
                name="category"
                defaultValue="Photo Studio"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                name="hourlyRate"
                required
                min={1}
                placeholder="75"
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
                required
                min={0}
                placeholder="150"
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
                required
                min={1}
                placeholder="10"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
              Location / Address
            </label>
            <input
              type="text"
              name="location"
              required
              placeholder="e.g. Downtown LA, Creative District"
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              required
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
              Amenities (Comma Separated)
            </label>
            <input
              type="text"
              name="amenities"
              placeholder="Cyc Wall, Soundproof, Green Screen, WiFi"
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
              Detailed Overview
            </label>
            <textarea
              name="overview"
              rows={4}
              required
              placeholder="Describe your studio space, equipment, rules, and unique features..."
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Read-only User Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div>
              <label className="block text-[10px] font-medium text-slate-500 uppercase">
                Host Name (Read-Only)
              </label>
              <input
                type="text"
                readOnly
                value={"Naimur"}
                className="bg-transparent text-slate-300 text-sm font-medium focus:outline-none w-full"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-500 uppercase">
                Host Email (Read-Only)
              </label>
              <input
                type="email"
                readOnly
                value={"naimur@mail"}
                className="bg-transparent text-slate-300 text-sm font-medium focus:outline-none w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/30 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Publishing Listing..." : "Publish Studio Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}
