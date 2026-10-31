"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateStudioPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "Cyc Wall Studio Pro",
    category: "Photo Studio",
    hourlyRate: "60",
    securityDeposit: "150",
    maxCapacity: "15",
    location: "Downtown LA, Creative District",
    imageUrl:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600",
    overview:
      "Premium professional cyc wall studio designed for high-end fashion shoots and commercial videos.",
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Studio details updated successfully!");
    router.push("/my-listings");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <h1 className="text-2xl font-extrabold text-white">
          Update Studio Listing
        </h1>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) =>
                  setFormData({ ...formData, hourlyRate: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
              Overview
            </label>
            <textarea
              rows={4}
              value={formData.overview}
              onChange={(e) =>
                setFormData({ ...formData, overview: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg text-sm"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
