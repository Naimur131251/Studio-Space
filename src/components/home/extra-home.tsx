import Image from "next/image";
import Link from "next/link";

export default function ExtraHome() {
  return (
    <div className="space-y-20 py-12 bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* Section 1: How Booking Works */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-25"
        id="how-it-works"
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            How Booking Works
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
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
          ].map((item) => (
            <div
              key={item.step}
              className="
                relative rounded-2xl border p-6
                bg-slate-50 border-slate-200
                hover:border-indigo-300 hover:shadow-lg
                dark:bg-slate-900/60 dark:border-slate-800/80
                dark:hover:border-slate-700
                transition-all duration-300
              "
            >
              <span className="absolute top-4 right-4 text-4xl font-extrabold text-indigo-500/20">
                {item.step}
              </span>

              <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-2 pr-8">
                {item.title}
              </h3>

              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <Link
            href="/studios"
            className="
              inline-block px-8 py-3.5 rounded-xl text-sm font-medium
              bg-indigo-600 hover:bg-indigo-500 text-white
              transition-all shadow-lg shadow-indigo-600/20
              dark:shadow-indigo-600/30
            "
          >
            Start Exploring Studios Now
          </Link>
        </div>
      </section>

      {/* Section 2: Host Guarantee & Creator Support */}
      <section
        className="
          max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-25
        "
        id="about"
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            About Us
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Innovating with passion to deliver exceptional digital experiences
            daily
          </p>
        </div>
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center
          border rounded-3xl p-8 md:p-12
          bg-linear-to-b from-slate-50 to-slate-100
          border-slate-200
          dark:from-slate-900/40 dark:to-slate-900/90
          dark:border-slate-800/80
          transition-colors duration-300"
        >
          {/* Content */}
          <div className="space-y-4">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-widest uppercase">
              Platform Assurances
            </span>

            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Host Guarantee & Creator Support
            </h2>

            <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              We ensure complete peace of mind for both creators and studio
              hosts with robust liability protection, verified profiles,
              equipment safety standards, and dedicated 24/7 host support.
            </p>

            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  ✓
                </span>
                <span>$1M Liability Protection Coverage</span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  ✓
                </span>
                <span>Verified Creator & Host Profiles</span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  ✓
                </span>
                <span>24/7 Dedicated Production Support</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/studios"
                className="
                  inline-flex items-center justify-center
                  px-6 py-3 rounded-xl text-sm font-medium
                  bg-indigo-600 hover:bg-indigo-500 text-white
                  transition-colors
                "
              >
                Explore Studios
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800"
              alt="Support and Guarantee"
              className="w-full h-full object-cover"
              width={800}
              height={500}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
