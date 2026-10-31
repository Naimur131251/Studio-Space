import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold rounded-full uppercase tracking-widest">
          About StudioSpace
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight my-7">
          Empowering Creators & Studio Hosts Worldwide
        </h1>
        <p className="text-slate-400 text-base md:text-lg leading-relaxed">
          StudioSpace is the premier peer-to-peer production platform designed to bridge the gap between creative visionaries and world-class studio owners.
        </p>
      </div>

      {/* Grid Stats / Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-3">
          <div className="text-3xl font-extrabold text-indigo-400">500+</div>
          <h3 className="text-white font-semibold text-lg">Verified Studios</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            From cyc photography walls and cinema sound stages to acoustic podcast suites and art workshops.
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-3">
          <div className="text-3xl font-extrabold text-indigo-400">10K+</div>
          <h3 className="text-white font-semibold text-lg">Active Creators</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Filmmakers, photographers, podcasters, and musicians finding professional spaces instantly.
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-3">
          <div className="text-3xl font-extrabold text-indigo-400">24/7</div>
          <h3 className="text-white font-semibold text-lg">Host Support</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Robust liability protection and dedicated round-the-clock support for hasslefree productions.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-linear-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            We believe that extraordinary creative projects shouldn&apos;t be limited by a lack of professional infrastructure. StudioSpace democratizes access to top-tier production spaces, enabling creators to focus entirely on storytelling.
          </p>
          <div className="pt-2">
            <Link
              href="/studios"
              className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg text-sm"
            >
              Explore Our Studios
            </Link>
          </div>
        </div>
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-slate-700">
          <Image
            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800"
            alt="StudioSpace Mission"
            className="w-full h-full object-cover"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}