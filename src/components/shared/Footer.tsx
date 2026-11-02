import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Logo from "@/app/icon.svg";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="
        border-t pt-12 pb-8 transition-colors duration-300
        bg-slate-50 text-slate-600 border-slate-200
        dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand & Mission */}
        <div className="space-y-4">
          <Link
            href="/"
            className="
              flex items-center gap-2 text-xl font-bold
              text-slate-900 dark:text-white
              transition-colors
            "
          >
            <Image
              src={Logo}
              alt="StudioSpace Logo"
              width={42}
              height={42}
              priority
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain mt-1 -ml-1.5"
            />
            <span>StudioSpace</span>
          </Link>

          <p className="text-sm leading-relaxed">
            A peer-to-peer production studio platform connecting creators with
            top-tier photo studios, sound stages, podcast rooms, and workshops.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-slate-900 dark:text-white font-semibold text-sm mb-4 tracking-wider uppercase">
            Quick Links
          </h3>

          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/"
                className="hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/studios"
                className="hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                Explore Studios
              </Link>
            </li>
            <li>
              <Link
                href="/#how-it-works"
                className="hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="/#about"
                className="hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-slate-900 dark:text-white font-semibold text-sm mb-4 tracking-wider uppercase">
            Categories
          </h3>

          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/studios?category=Photo+Studio"
                className="hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                Photo Studios
              </Link>
            </li>
            <li>
              <Link
                href="/studios?category=Film+Stage"
                className="hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                Cinema Sound Stages
              </Link>
            </li>
            <li>
              <Link
                href="/studios?category=Podcast+Lounge"
                className="hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                Podcast Rooms
              </Link>
            </li>
            <li>
              <Link
                href="/studios?category=Music+Suite"
                className="hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                Music Suites
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter & Socials */}
        <div className="space-y-4">
          <h3 className="text-slate-900 dark:text-white font-semibold text-sm tracking-wider uppercase">
            Newsletter
          </h3>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="
                w-full min-w-0 rounded-lg border px-3 py-2 text-sm
                outline-none transition-colors
                bg-white border-slate-300 text-slate-900
                placeholder:text-slate-400 focus:border-indigo-500
                dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200
                dark:placeholder:text-slate-500
              "
            />

            <button
              type="button"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Join
            </button>
          </div>

          {/* Social Links: X, Facebook, Instagram, YouTube */}
          <div className="flex items-center gap-4 pt-2">
            <Link
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              <FaXTwitter />
            </Link>

            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-blue-500 transition-colors"
            >
              <FaFacebookF />
            </Link>

            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-pink-500 transition-colors"
            >
              <FaInstagram />
            </Link>

            <Link
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="hover:text-red-500 transition-colors"
            >
              <FaYoutube />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright & Legal Links */}
      <div
        className="
          max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t
          pt-6 flex flex-col md:flex-row items-center justify-between
          text-xs gap-4
          border-slate-200 text-slate-500
          dark:border-slate-800/80 dark:text-slate-500
        "
      >
        <p>&copy; 2026 StudioSpace. All rights reserved.</p>

        <div className="flex gap-4">
          <Link
            href="#"
            className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
          >
            Privacy Policy
          </Link>

          <Link
            href="#"
            className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
