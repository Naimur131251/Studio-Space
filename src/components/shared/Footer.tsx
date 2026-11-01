import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand & Mission */}
        <div className="space-y-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-white"
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
            <span>StudioSpace</span>
          </Link>
          <p className="text-sm leading-relaxed">
            A peer-to-peer production studio platform connecting creators with
            top-tier photo studios, sound stages, podcast rooms, and workshops.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/studios"
                className="hover:text-white transition-colors"
              >
                Explore Studios
              </Link>
            </li>
            <li>
              <Link
                href="/#how-it-works"
                className="hover:text-white transition-colors"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="/#about"
                className="hover:text-white transition-colors"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">
            Categories
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/studios?category=Photo+Studio"
                className="hover:text-white transition-colors"
              >
                Photo Studios
              </Link>
            </li>
            <li>
              <Link
                href="/studios?category=Film+Stage"
                className="hover:text-white transition-colors"
              >
                Cinema Sound Stages
              </Link>
            </li>
            <li>
              <Link
                href="/studios?category=Podcast+Lounge"
                className="hover:text-white transition-colors"
              >
                Podcast Rooms
              </Link>
            </li>
            <li>
              <Link
                href="/studios?category=Music+Suite"
                className="hover:text-white transition-colors"
              >
                Music Suites
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter & Socials */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase">
            Newsletter
          </h3>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 w-full focus:outline-none focus:border-indigo-500"
            />
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Join
            </button>
          </div>

          {/* Social Links featuring the new X logo */}
          <div className="flex items-center gap-4 pt-2">
            <Link
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              <FaXTwitter />
            </Link>
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-500 transition-colors"
            >
              <FaFacebookF />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-lime-500 transition-colors"
            >
              <FaInstagram />
            </Link>
            <Link
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-red-500 transition-colors"
            >
              <FaYoutube />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>
          &copy; 2026 StudioSpace. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-slate-400">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-slate-400">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
