"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  Disc3,
  Headphones,
  Mic2,
  Music2,
  Radio,
  Speaker,
} from "lucide-react";

const floatingElements = [
  {
    Icon: Music2,
    top: "15%",
    left: "10%",
    delay: 0,
    size: 24,
  },
  {
    Icon: Headphones,
    top: "25%",
    right: "12%",
    delay: 0.5,
    size: 30,
  },
  {
    Icon: Disc3,
    top: "65%",
    left: "8%",
    delay: 1,
    size: 28,
  },
  {
    Icon: Radio,
    top: "70%",
    right: "10%",
    delay: 1.5,
    size: 26,
  },
  {
    Icon: Speaker,
    top: "45%",
    left: "5%",
    delay: 0.8,
    size: 22,
  },
  {
    Icon: AudioLines,
    top: "45%",
    right: "5%",
    delay: 1.2,
    size: 26,
  },
];

function Waveform() {
  const bars = Array.from({ length: 45 }).map((_, index) => ({
    heights: [
      10 + ((index * 17 + 13) % 11),
      15 + ((index * 13 + 7) % 31),
      10 + ((index * 19 + 3) % 11),
    ],
    duration: 0.8 + ((index * 7) % 10) / 10,
    delay: index * 0.03,
  }));

  return (
    <div className="flex items-center justify-center gap-0.75 h-12">
      {bars.map((bar, index) => (
        <motion.div
          key={index}
          animate={{
            height: bar.heights.map((height) => `${height}px`),
          }}
          transition={{
            duration: bar.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: bar.delay,
          }}
          className="w-0.75 rounded-full bg-linear-to-t from-indigo-500 to-purple-400"
        />
      ))}
    </div>
  );
}

function WaveformFallback() {
  return (
    <div
      className="flex h-12 items-center justify-center gap-0.75"
      aria-hidden="true"
    >
      {Array.from({ length: 45 }, (_, index) => (
        <div
          key={index}
          className="w-0.75 rounded-full bg-indigo-500/70 dark:bg-indigo-400/70"
          style={{
            height: `${10 + ((index * 17 + 13) % 35)}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function NotFound() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 py-16 text-slate-900 transition-colors duration-300 dark:bg-[#080B12] dark:text-white">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-linear(to right, currentColor 1px, transparent 1px), linear-linear(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/10 blur-[120px] dark:bg-indigo-600/15" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-75 w-75 rounded-full bg-purple-400/10 blur-[100px] dark:bg-purple-600/10" />

      {/* Floating music icons */}
      {floatingElements.map(
        ({ Icon, top, left, right, delay, size }, index) => (
          <motion.div
            key={index}
            className="pointer-events-none absolute hidden text-indigo-500/30 dark:text-indigo-300/20 sm:block"
            style={{
              top,
              left,
              right,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4 + delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
          >
            <Icon size={size} strokeWidth={1.5} />
          </motion.div>
        ),
      )}

      {/* Main content */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-300 -mt-7"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
          </span>
          Error 404 — Page Not Found
        </motion.div>

        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="relative mb-5"
        >
          {/* Microphone inside the zero */}
          {/* 404 with Microphone Inside 0 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center justify-center gap-1 sm:gap-3 mb-5"
          >
            {/* First 4 */}
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-[90px] sm:text-[130px] md:text-[150px] font-black
    leading-none text-transparent bg-clip-text
    bg-linear-to-b from-white via-indigo-200 to-indigo-500"
            >
              4
            </motion.span>

            {/* 0 with Microphone */}
            <div className="relative w-21.25 h-25 sm:w-31.25 sm:h-36.25 md:w-35 md:h-41.25 flex items-center justify-center">
              {/* Outer Glow */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-1 rounded-full bg-indigo-500/20 blur-2xl"
              />

              {/* Zero Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute inset-1 rounded-full border-[7px] sm:border-10
      border-indigo-400/70 border-t-purple-400
      shadow-[0_0_25px_rgba(99,102,241,0.45)]"
              />

              {/* Inner Ring */}
              <div className="absolute inset-3 rounded-full border border-purple-400/30" />

              {/* Microphone */}
              <motion.div
                animate={{ y: [0, -5, 0], rotate: [-3, 3, -3] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 flex items-center justify-center"
              >
                <Mic2
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16
        text-white drop-shadow-[0_0_15px_rgba(129,140,248,0.9)]"
                  strokeWidth={1.5}
                />
              </motion.div>

              {/* Sound Waves */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -left-2 top-1/2 -translate-y-1/2"
              >
                <AudioLines className="w-5 h-5 text-indigo-300" />
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                className="absolute -right-2 top-1/2 -translate-y-1/2"
              >
                <AudioLines className="w-5 h-5 text-purple-300" />
              </motion.div>
            </div>

            {/* Last 4 */}
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="text-[90px] sm:text-[130px] md:text-[150px] font-black
    leading-none text-transparent bg-clip-text
    bg-linear-to-b from-white via-indigo-200 to-indigo-500"
            >
              4
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Animated waveform */}
        <div className="mb-7 w-full max-w-md px-4 flex justify-center items-center">
          <div className="w-full max-w-xs mb-4">
            {prefersReducedMotion ? <WaveformFallback /> : <Waveform />}
          </div>
        </div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-white"
        >
          Oops! Lost in the{" "}
          <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
            Studio?
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-9 max-w-lg text-base leading-7 text-slate-600 sm:text-lg dark:text-gray-400"
        >
          Looks like this track doesn&apos;t exist. The page you&apos;re looking
          for may have been moved, deleted, or never recorded in our studio.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
        >
          {/* Back to Home */}
          <Link
            href="/"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-600/30 sm:w-auto dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to Home
          </Link>

          {/* Go Back */}
          <button
            type="button"
            onClick={() => window.history.back()}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 sm:w-auto dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-400/10 dark:hover:text-white"
          >
            Go Back
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </motion.div>

        {/* Footer branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
            <AudioLines
              size={20}
              className="text-indigo-600 dark:text-indigo-400"
            />
            <span className="text-sm font-bold tracking-[0.2em]">
              STUDIO SPACE
            </span>
          </div>

          <p className="text-xs tracking-widest text-slate-500 dark:text-gray-500">
            BOOK. CREATE. PRODUCE.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
