"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "../ui/toast";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Better Auth Session
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const isAuthenticated = !!user;

  const isActive = (path: string) => pathname === path;

  // Logout
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await authClient.signOut();

      setUserDropdownOpen(false);

      toast.add({
        title: "Logged out successfully",
        description:
          "You have been securely signed out of your account. See you soon!",
        type: "success",
      });

      router.refresh();
      router.push("/");
    } catch (error: unknown) {
      console.error("Logout failed:", error);

      toast.add({
        title: "Logout Failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <svg
            className="w-7 h-7 text-indigo-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2a10 10 0 0 1 8.66 5M2 12a10 10 0 0 1 5-8.66M12 22a10 10 0 0 1-8.66-5M22 12a10 10 0 0 1-5 8.66" />
          </svg>

          <span className="bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
            StudioSpace
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {[
            { name: "Home", href: "/" },
            { name: "Explore Studios", href: "/studios" },
            { name: "How It Works", href: "/#how-it-works" },
            { name: "About Us", href: "/#about" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors ${
                isActive(item.href)
                  ? "text-indigo-400 font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Authentication */}
        <div className="flex items-center gap-4">
          {isPending ? (
            <div className="w-24 h-9 bg-slate-800 rounded-lg animate-pulse" />
          ) : !isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-md shadow-indigo-600/20"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative">
              {/* User Avatar */}
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 focus:outline-none"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold ring-2 ring-indigo-500">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 text-sm text-slate-200 z-50">
                  <div className="px-4 py-2 border-b border-slate-700">
                    <p className="font-semibold text-white">{user.name}</p>

                    <p className="text-xs text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/add-studio"
                    className="block px-4 py-2 hover:bg-slate-700 transition-colors"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Add New Studio
                  </Link>

                  <Link
                    href="/my-listings"
                    className="block px-4 py-2 hover:bg-slate-700 transition-colors"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    My Studio Listings
                  </Link>

                  <Link
                    href="/my-bookings"
                    className="block px-4 py-2 hover:bg-slate-700 transition-colors"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    My Bookings
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700 transition-colors border-t border-slate-700 mt-1 disabled:opacity-50"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
