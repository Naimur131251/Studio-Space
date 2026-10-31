"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddStudioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Read-only user state
  const user = {
    name: "Harry Studio",
    email: "harry@studiospace.com",
  };

  const [formData, setFormData] = useState({
    title: "",
    category: "Photo Studio",
    hourlyRate: "",
    securityDeposit: "",
    maxCapacity: "",
    location: "",
    imageUrl: "",
    amenities: "",
    overview: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock MongoDB saving action
    setTimeout(() => {
      setLoading(false);
      alert("Studio added successfully!");
      router.push("/my-listings");
    }, 1000);
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
                required
                placeholder="e.g. Cinema Sound Stage Alpha"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
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
                required
                placeholder="75"
                value={formData.hourlyRate}
                onChange={(e) =>
                  setFormData({ ...formData, hourlyRate: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                Security Deposit ($)
              </label>
              <input
                type="number"
                required
                placeholder="150"
                value={formData.securityDeposit}
                onChange={(e) =>
                  setFormData({ ...formData, securityDeposit: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                Max Capacity
              </label>
              <input
                type="number"
                required
                placeholder="10"
                value={formData.maxCapacity}
                onChange={(e) =>
                  setFormData({ ...formData, maxCapacity: e.target.value })
                }
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
              required
              placeholder="e.g. Downtown LA, Creative District"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
              Image URL
            </label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
              Amenities (Comma Separated)
            </label>
            <input
              type="text"
              placeholder="Cyc Wall, Soundproof, Green Screen, WiFi"
              value={formData.amenities}
              onChange={(e) =>
                setFormData({ ...formData, amenities: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
              Detailed Overview
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe your studio space, equipment, rules, and unique features..."
              value={formData.overview}
              onChange={(e) =>
                setFormData({ ...formData, overview: e.target.value })
              }
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
                value={user.name}
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
                value={user.email}
                className="bg-transparent text-slate-300 text-sm font-medium focus:outline-none w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/30 text-sm mt-2"
          >
            {loading ? "Publishing Listing..." : "Publish Studio Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}
