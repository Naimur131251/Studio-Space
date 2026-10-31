import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
      <div className="space-y-2">
        <span className="text-6xl md:text-8xl font-black text-indigo-500 tracking-wider">
          404
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Studio Space Not Found
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto">
          The creative workspace or page you are looking for might have been
          removed, renamed, or is temporarily unavailable.
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/30 text-sm"
        >
          Return to Home
        </Link>
        <Link
          href="/studios"
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded-xl transition-all text-sm"
        >
          Explore Studios
        </Link>
      </div>
    </div>
  );
}
