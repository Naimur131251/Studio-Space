"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "../ui/toast";
import { useTheme } from "next-themes";

import { Menu, Moon, Sun, X, UserRound } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const isAuthenticated = !!user;

  const { theme, setTheme } = useTheme();

  const isActive = (path: string) => pathname === path;

  // Prevent hydration mismatch
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isDark = mounted && theme === "dark";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "About Us", href: "/#about" },
  ];

  const closeDropdown = () => {
    setUserDropdownOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await authClient.signOut();

      setUserDropdownOpen(false);
      setMobileMenuOpen(false);

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
    <header
      className="
        sticky top-0 z-50
        backdrop-blur-md border-b
        transition-colors duration-300
        bg-white/90 border-slate-200 text-slate-900
        dark:bg-slate-900/90 dark:border-slate-800 dark:text-white
      "
    >
      {/* Main Navbar */}
      <div
        className="
          relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
          h-16 flex items-center justify-between
        "
      >
        {/* Hamburger - Mobile Only */}
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
            setUserDropdownOpen(false);
          }}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          className="
            md:hidden inline-flex h-10 w-10 shrink-0
            items-center justify-center rounded-lg
            border border-slate-300
            text-slate-700 hover:bg-slate-100
            dark:border-slate-700 dark:text-white
            dark:hover:bg-slate-800
          "
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        {/* Brand Logo */}
        <Link
          href="/"
          onClick={() => {
            closeMobileMenu();
            closeDropdown();
          }}
          className="
            flex items-center gap-2
            text-xl font-bold tracking-tight
            absolute left-1/2 -translate-x-1/2
            md:static md:translate-x-0
          "
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

          <span
            className="
              bg-linear-to-r from-slate-900 to-slate-500
              bg-clip-text text-transparent
              dark:from-white dark:to-slate-400
            "
          >
            StudioSpace
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="
            hidden md:flex items-center gap-6
            text-sm font-medium
          "
        >
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors ${
                isActive(item.href)
                  ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={
              !mounted
                ? "Toggle theme"
                : isDark
                  ? "Switch to light mode"
                  : "Switch to dark mode"
            }
            title={
              !mounted ? "Toggle theme" : isDark ? "Light mode" : "Dark mode"
            }
            className="
              inline-flex h-7 w-7 shrink-0
              items-center justify-center
              rounded-full border
              transition-colors duration-300
              border-slate-300 bg-white text-slate-700
              hover:bg-slate-100
              dark:border-slate-700 dark:bg-slate-900
              dark:text-slate-200 dark:hover:bg-slate-800
            "
          >
            {!mounted ? (
              <span className="h-4 w-4" />
            ) : isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Authentication */}
          <div className="flex items-center">
            {isPending ? (
              <div
                className="
                  w-9 h-9 rounded-full
                  bg-slate-200 dark:bg-slate-800
                  animate-pulse
                "
              />
            ) : !isAuthenticated ? (
              <>
                {/* Desktop Login & Register */}
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    href="/login"
                    className="
                      px-4 py-2 text-sm font-medium
                      text-slate-700 hover:text-indigo-600
                      dark:text-slate-300 dark:hover:text-white
                    "
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="
                      px-4 py-2 text-sm font-medium
                      bg-indigo-600 hover:bg-indigo-500
                      text-white rounded-lg transition-all
                      shadow-md shadow-indigo-600/20
                    "
                  >
                    Register
                  </Link>
                </div>

                {/* Mobile Guest Avatar + Dropdown */}
                <div className="relative md:hidden">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    aria-label="Open login and register menu"
                    aria-expanded={userDropdownOpen}
                    className="
                      h-10 w-10 flex items-center
                      justify-center rounded-full
                      border border-slate-300
                      bg-white text-slate-700
                      hover:bg-slate-100
                      dark:border-slate-700
                      dark:bg-slate-900
                      dark:text-white
                      dark:hover:bg-slate-800
                      transition-colors
                    "
                  >
                    <UserRound className="w-5 h-5" />
                  </button>

                  {/* Guest Dropdown */}
                  {userDropdownOpen && (
                    <div
                      className="
                        absolute right-0 top-full mt-3
                        w-[min(60vw,28rem)]
                        rounded-2xl border shadow-2xl
                        py-2 text-base z-50 overflow-hidden
                        bg-white border-slate-200
                        text-slate-700
                        dark:bg-slate-800
                        dark:border-slate-700
                        dark:text-slate-200
                        text-center
                      "
                    >
                      <div
                        className="
                          px-5 py-5 border-b
                          border-slate-200
                          dark:border-slate-700
                        "
                      >
                        <p className="font-semibold text-lg text-slate-900 dark:text-white">
                          Welcome to StudioSpace
                        </p>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Sign in or create an account
                        </p>
                      </div>

                      <Link
                        href="/login"
                        onClick={closeDropdown}
                        className="
                          block px-5 py-4
                          hover:bg-slate-100
                          dark:hover:bg-slate-700
                          transition-colors
                        "
                      >
                        Login
                      </Link>

                      <Link
                        href="/register"
                        onClick={closeDropdown}
                        className="
                          block px-5 py-4
                          hover:bg-slate-100
                          dark:hover:bg-slate-700
                          transition-colors
                          border-t border-slate-200
                          dark:border-slate-700
                        "
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Authenticated User Profile */
              <div className="relative">
                {/* User Avatar */}
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-label="Open user menu"
                  aria-expanded={userDropdownOpen}
                  className="flex items-center gap-3 focus:outline-none"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={36}
                      height={36}
                      className="
                        w-9 h-9 rounded-full
                        object-cover ring-2 ring-indigo-500
                      "
                    />
                  ) : (
                    <div
                      className="
                        w-9 h-9 rounded-full
                        bg-indigo-600 text-white
                        flex items-center justify-center
                        font-bold ring-2 ring-indigo-500
                      "
                    >
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </button>

                {/* Authenticated User Dropdown */}
                {userDropdownOpen && (
                  <div
                    className="
                      absolute right-0 top-full mt-3
                      w-[min(88vw,28rem)]
                      rounded-2xl border shadow-2xl
                      py-2 text-base z-50 overflow-hidden
                      bg-white border-slate-200
                      text-slate-700
                      dark:bg-slate-800
                      dark:border-slate-700
                      dark:text-slate-200
                    "
                  >
                    <div
                      className="
                        px-5 py-5 border-b
                        border-slate-200
                        dark:border-slate-700
                      "
                    >
                      <p className="font-semibold text-lg text-slate-900 dark:text-white">
                        {user.name}
                      </p>

                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/add-studio"
                      onClick={closeDropdown}
                      className="
                        block px-5 py-4
                        hover:bg-slate-100
                        dark:hover:bg-slate-700
                        transition-colors
                      "
                    >
                      Add New Studio
                    </Link>

                    <Link
                      href="/my-listings"
                      onClick={closeDropdown}
                      className="
                        block px-5 py-4
                        hover:bg-slate-100
                        dark:hover:bg-slate-700
                        transition-colors
                      "
                    >
                      My Studio Listings
                    </Link>

                    <Link
                      href="/my-bookings"
                      onClick={closeDropdown}
                      className="
                        block px-5 py-4
                        hover:bg-slate-100
                        dark:hover:bg-slate-700
                        transition-colors
                      "
                    >
                      My Bookings
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="
                        w-full text-left px-5 py-4
                        text-red-600
                        hover:bg-red-50
                        dark:text-red-400
                        dark:hover:bg-slate-700
                        transition-colors
                        border-t border-slate-200
                        dark:border-slate-700
                        disabled:opacity-50
                      "
                    >
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div
          className="
            md:hidden
            absolute top-full left-0 right-0
            z-100
            border-t border-slate-200/50
            bg-white/75 backdrop-blur-xl
            shadow-2xl shadow-black/10
            dark:bg-slate-900/75
            dark:border-slate-700/50
          "
        >
          <nav
            className="
        max-w-7xl mx-auto px-4 py-4
        flex flex-col gap-1
      "
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`
            px-4 py-3 rounded-lg
            text-sm font-medium
            transition-colors
            ${
              isActive(item.href)
                ? "bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400"
                : "text-slate-700 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
            }
          `}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
