import Image from "next/image";

export default function ExtraHome() {
  return (
    <div className="space-y-20 py-12">
      {/* Section 1: How Booking Works */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        id="how-it-works"
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            How Booking Works
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Secure your ideal production workspace in 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Discover Spaces",
              desc: "Browse curated photo cyc walls, sound stages, and podcast lounges.",
            },
            {
              step: "02",
              title: "Select Shoot Hours",
              desc: "Pick your precise booking date, start time, and total hours.",
            },
            {
              step: "03",
              title: "Book Instantly",
              desc: "Secure your slot with transparent hourly rates and instant confirmation.",
            },
            {
              step: "04",
              title: "Create & Produce",
              desc: "Show up, unlock your creative potential, and bring your vision to life.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl relative"
            >
              <span className="text-4xl font-extrabold text-indigo-500/20 absolute top-4 right-4">
                {item.step}
              </span>
              <h3 className="font-semibold text-white text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Host Guarantee & Creator Support */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-linear-to-b from-slate-900/40 to-slate-900/90 border border-slate-800/80 rounded-3xl p-8 md:p-12"
        id="about"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-indigo-400 font-semibold text-xs tracking-widest uppercase">
              Platform Assurances
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Host Guarantee & Creator Support
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              We ensure complete peace of mind for both creators and studio
              hosts with robust liability protection, verified profiles,
              equipment safety standards, and dedicated 24/7 host support.
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                ✓ $1M Liability Protection Coverage
              </li>
              <li className="flex items-center gap-2">
                ✓ Verified Creator & Host Profiles
              </li>
              <li className="flex items-center gap-2">
                ✓ 24/7 Dedicated Production Support
              </li>
            </ul>
          </div>
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-slate-700">
            <Image
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800"
              alt="Support and Guarantee"
              className="w-full h-full object-cover"
              width={500}
              height={500}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
