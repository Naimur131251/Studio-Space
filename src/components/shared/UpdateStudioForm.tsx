"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
// import toast, { Toaster } from "react-hot-toast";
 
interface StudioFormData {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  imageUrl: string;
  overview: string;
  hostName: string;
  hostEmail: string;
}

export default function UpdateStudioForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  
  // Suspense এর ভেতরে থাকায় এখানে 'use' হুক ব্যবহার করলেও আর কোনো বিল্ড ইরর আসবে না
  const resolvedParams = use(params);
  const studioId = resolvedParams?.id;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<StudioFormData>({
    title: "Cyc Wall Studio Pro",
    category: "Photo Studio",
    hourlyRate: "60",
    securityDeposit: "150",
    maxCapacity: "15",
    location: "Downtown LA, Creative District",
    imageUrl: "https://unsplash.com",
    overview: "Premium professional cyc wall studio designed for high-end fashion shoots and commercial videos.",
    hostName: "John Doe",
    hostEmail: "john@studio.com",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/studios/${studioId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // toast.success("Studio details updated successfully!");
        setTimeout(() => {
          router.push("/my-listings");
        }, 1500);
      } else {
        // toast.error("Failed to update studio details.");
      }
    } catch (error) {
      console.error(error);
    //   toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* <Toaster position="top-center" reverseOrder={false} /> */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <h1 className="text-2xl font-extrabold text-white">
          Update Studio Listing
        </h1>

        <form onSubmit={handleUpdate} className="space-y-4">
          
          {/* Read-only Host Information Row */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Host Name (Read-Only)
              </label>
              <input
                type="text"
                value={formData.hostName}
                readOnly
                className="w-full bg-slate-900 border border-transparent text-slate-400 rounded-lg px-3 py-2 text-sm cursor-not-allowed outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Host Email (Read-Only)
              </label>
              <input
                type="email"
                value={formData.hostEmail}
                readOnly
                className="w-full bg-slate-900 border border-transparent text-slate-400 rounded-lg px-3 py-2 text-sm cursor-not-allowed outline-none"
              />
            </div>
          </div>

          {/* Title */}
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
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Hourly Rate & Location */}
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
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                required
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
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Security Deposit & Max Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase mb-1">
                Security Deposit ($)
              </label>
              <input
                type="number"
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
                value={formData.maxCapacity}
                onChange={(e) =>
                  setFormData({ ...formData, maxCapacity: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Overview */}
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
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all shadow-lg text-sm"
          >
            {isLoading ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </>
  );
}
