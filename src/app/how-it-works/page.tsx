import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold rounded-full uppercase tracking-widest">
          Workflow Guide
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mt-7">
          How StudioSpace Works
        </h1>
        <p className="text-slate-400 text-base md:text-lg leading-relaxed">
          Whether you are a creator booking a workspace or a host sharing your
          studio, getting started is fast and secure.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            step: "01",
            title: "Discover Spaces",
            desc: "Search through hundreds of verified photo cyc walls, sound stages, and podcast rooms with advanced filters.",
          },
          {
            step: "02",
            title: "Select Shoot Hours",
            desc: "Choose your preferred date, precise start time, and total hours needed with instant transparent pricing.",
          },
          {
            step: "03",
            title: "Book Instantly",
            desc: "Secure your reservation securely with double-booking prevention and instant status tracking.",
          },
          {
            step: "04",
            title: "Create & Produce",
            desc: "Show up at the studio, unlock your creative potential, and bring your master production to life.",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 p-8 rounded-2xl relative space-y-3"
          >
            <span className="text-4xl font-extrabold text-indigo-500/20 absolute top-6 right-6">
              {item.step}
            </span>
            <h3 className="text-white font-semibold text-lg">{item.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link
          href="/studios"
          className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/30 text-sm inline-block"
        >
          Start Exploring Studios Now
        </Link>
      </div>
    </div>
  );
}
