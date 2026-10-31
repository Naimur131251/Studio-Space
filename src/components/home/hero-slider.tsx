"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1600",
    title: "HIGH-PERFORMANCE STUDIOS",
    subtitle: "BOOK. CREATE. PRODUCE.",
    description:
      "Discover professional cyc walls, cinema sound stages, and podcast rooms designed for creators.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=1600",
    title: "CINEMATIC SOUND STAGES",
    subtitle: "BRING YOUR VISION TO LIFE",
    description:
      "Fully equipped acoustic sound stages with professional lighting rigs and multi-cam setups.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?auto=format&fit=crop&q=80&w=1600",
    title: "CREATIVE PODCAST LOUNGES",
    subtitle: "RECORD IN PRISTINE QUALITY",
    description:
      "Acoustically treated podcast recording suites with top-tier mixing consoles and microphones.",
  },
];

export default function HeroSlider() {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Track current slide
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    onSelect();

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  // Auto play every 5 seconds
  useEffect(() => {
    if (!api) return;

    const timer = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [api]);

  return (
    <div className="relative w-full overflow-hidden bg-slate-950">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => (
            <CarouselItem
              key={index}
              className="relative h-137.5 md:h-162.5 basis-full pl-0"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>

              {/* Background Overlay */}
              <div className="absolute inset-0 z-10 bg-linear-to-r from-slate-950 via-slate-950/70 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="max-w-2xl space-y-6">
                    <span className="inline-block rounded-full border border-indigo-500/40 bg-indigo-600/30 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                      {slide.subtitle}
                    </span>

                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
                      {slide.title}
                    </h1>

                    <p className="text-base leading-relaxed text-slate-300 md:text-lg">
                      {slide.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 pt-2">
                      <Link
                        href="/studios"
                        className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500"
                      >
                        Explore Studios
                      </Link>

                      <Link
                        href="/add-studio"
                        className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 font-medium text-slate-200 transition-all hover:bg-slate-700"
                      >
                        Host Your Space
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Previous & Next Buttons */}
        <CarouselPrevious className="left-20 lg:left-4 lg:bottom-0 -bottom-122 z-30 border-white/10 bg-slate-900/20 text-white hover:bg-indigo-600 hover:text-white size-9 cursor-pointer" />

        <CarouselNext className="right-20 lg:right-4 lg:bottom-0 -bottom-122 z-30 border-white/10 bg-slate-900/20 text-white hover:bg-indigo-600 hover:text-white size-9 cursor-pointer" />
      </Carousel>

      {/* Slider Indicators */}
      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={currentSlide === index ? "true" : undefined}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-indigo-500"
                : "w-3 bg-slate-500 hover:bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
