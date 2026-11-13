"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

import { Button } from "@/components/ui/button";
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
    title: "Find your next great read",
    text: "Browse the BookNook shelves and borrow a book for a few days. Return it when you are done and pick another.",
  },
  {
    title: "Add a book, share the story",
    text: "Finished a book that is just sitting on your shelf? Add it to BookNook so other readers can enjoy it too.",
  },
  {
    title: "Borrow today, track it easily",
    text: "Confirm your borrow in one step, then see every book you have borrowed and return it from My Borrows.",
  },
];

/* Open book + glowing moon, drawn in SVG so no image file is needed */
function BookIllustration() {
  return (
    <svg
      viewBox="0 0 800 260"
      className="mx-auto w-full max-w-3xl"
      role="img"
      aria-label="An open book with a glowing moon"
    >
      <defs>
        <linearGradient id="pageL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d9c9a8" />
          <stop offset="1" stopColor="#f3e9d2" />
        </linearGradient>
        <linearGradient id="pageR" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#d9c9a8" />
          <stop offset="1" stopColor="#f3e9d2" />
        </linearGradient>
        <radialGradient id="moon" cx="0.35" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#8fb0c4" />
          <stop offset="0.6" stopColor="#3b566b" />
          <stop offset="1" stopColor="#1d2c3b" />
        </radialGradient>
        <radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#7fb2d4" stopOpacity="0.35" />
          <stop offset="1" stopColor="#7fb2d4" stopOpacity="0" />
        </radialGradient>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* stars */}
      {[
        [90, 40],
        [160, 90],
        [250, 30],
        [330, 70],
        [520, 36],
        [720, 120],
        [60, 130],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#fff" opacity="0.45" />
      ))}

      {/* moon */}
      <circle cx="640" cy="78" r="90" fill="url(#moonGlow)" />
      <circle cx="640" cy="78" r="44" fill="url(#moon)" />

      {/* steam */}
      <path d="M360 150 C 345 120, 380 100, 362 70 C 350 48, 372 34, 366 14" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="6" strokeLinecap="round" filter="url(#soft)" />
      <path d="M430 150 C 445 118, 412 98, 432 68 C 444 46, 424 30, 432 10" fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="6" strokeLinecap="round" filter="url(#soft)" />

      {/* floor shadow + spine glow */}
      <ellipse cx="400" cy="238" rx="330" ry="12" fill="#000" opacity="0.45" />
      <ellipse cx="400" cy="214" rx="70" ry="12" fill="#f97316" opacity="0.35" filter="url(#soft)" />

      {/* pages */}
      <path d="M400 212 C 340 152 190 132 70 167 L 70 190 C 190 158 340 178 400 236 Z" fill="url(#pageL)" />
      <path d="M400 212 C 460 152 610 132 730 167 L 730 190 C 610 158 460 178 400 236 Z" fill="url(#pageR)" />

      {/* page edges */}
      {[0, 6, 12].map((o) => (
        <g key={o} fill="none" stroke="#b9a882" strokeOpacity="0.7" strokeWidth="1.2">
          <path d={`M400 ${226 + o * 0.8} C 340 ${168 + o} 190 ${148 + o} 72 ${180 + o * 0.5}`} />
          <path d={`M400 ${226 + o * 0.8} C 460 ${168 + o} 610 ${148 + o} 728 ${180 + o * 0.5}`} />
        </g>
      ))}

      {/* spine line */}
      <path d="M400 212 L 400 236" stroke="#8a7a58" strokeWidth="2" />
    </svg>
  );
}

export default function HeroBanner() {
  const autoplay = useRef(
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="relative overflow-hidden bg-[#1b1f2a]">
      {/* soft light behind the heading, like the reference */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(249,115,22,0.10),transparent_60%)]" />

      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplay.current]}
        className="relative mx-auto max-w-7xl"
      >
        <CarouselContent className="ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.title} className="pl-0">
              <div className="flex min-h-[560px] flex-col items-center justify-between px-6 pt-16 text-center sm:min-h-[620px] sm:pt-20 lg:min-h-[680px]">
                <div>
                  <h1 className="mx-auto max-w-2xl font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                    {slide.title}
                  </h1>
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                    {slide.text}
                  </p>
                  <Button
                    nativeButton={false}
                    render={<Link href="/books" />}
                    className="mt-7 h-auto rounded-lg border-transparent bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600"
                  >
                    Browse Books
                  </Button>
                </div>

                <div className="mt-10 w-full">
                  <BookIllustration />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* arrows (hidden on small screens, swipe works there) */}
        <CarouselPrevious className="left-4 top-1/2 hidden size-10 -translate-y-1/2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:inline-flex" />
        <CarouselNext className="right-4 top-1/2 hidden size-10 -translate-y-1/2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:inline-flex" />

        {/* dots */}
        <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={current === i}
              onClick={() => api?.scrollTo(i)}
              className={`h-2 rounded-full transition-all ${
                current === i ? "w-6 bg-orange-500" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
}