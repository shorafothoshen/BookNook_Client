"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const images = [
  { src: "/image-1.jpg", alt: "BookNook banner image 1" },
  { src: "/image-2.jpg", alt: "BookNook banner image 2" },
  { src: "/image-3.jpeg", alt: "BookNook banner image 3" },
  { src: "/image-4.jpg", alt: "BookNook banner image 4" },
  { src: "/image-5.jpg", alt: "BookNook banner image 5" },
];

export default function HeroBanner() {
  const [autoplay] = useState(() =>
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })
  );
const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);

  // a slide whose image cannot load is removed, so there is never an empty slide
  const slides = images.filter((img) => !failed.includes(img.src));

  useEffect(() => {
    if (!api) return;
    api.reInit();
  }, [api, slides.length]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <section className="relative bg-[#1b1f2a]">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplay]}
        className="relative w-full"
      >
        <CarouselContent className="ml-0">
          {slides.map((img, i) => (
            <CarouselItem
              key={img.src}
              className="relative h-135 overflow-hidden pl-0 sm:h-155 lg:h-175"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="100vw"
                priority={i === 0}
                loading="eager"
                onError={() =>
                  setFailed((f) => (f.includes(img.src) ? f : [...f, img.src]))
                }
                className={`object-cover transition-transform duration-[5000ms] ease-out ${
                  current === i ? "scale-110" : "scale-100"
                }`}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* ---------- Shadow layers (books stay visible, text stays readable) ---------- */}
        {/* soft overall tint */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[#1b1f2a]/40" />
        {/* darker pool of shadow behind the text, fading out to the sides */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_60%_55%_at_50%_48%,rgba(20,23,32,0.82)_0%,rgba(20,23,32,0.5)_55%,rgba(20,23,32,0)_100%)]" />
        {/* top + bottom fade so it blends with navbar and next section */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#1b1f2a]/70 via-transparent to-[#1b1f2a]" />

        {/* ---------- Fixed content ---------- */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6">
          <div className="max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-orange-300 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              Your small online library
            </span>

            <h1 className="mt-6 font-serif text-4xl font-bold leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-5xl lg:text-6xl">
              Find your next great read at{" "}
              <span className="text-orange-400">BookNook</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-slate-100 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)] sm:text-base lg:text-lg">
              Add a book, borrow a book, return a book. Browse our shelves and
              borrow your favourite stories for a few days.
            </p>

            <Button
              nativeButton={false}
              render={<Link href="/books" />}
              className="pointer-events-auto mt-8 h-auto rounded-lg border-transparent bg-orange-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600"
            >
              Browse Books
            </Button>
          </div>
        </div>

        {/* ---------- Dots ---------- */}
        <div className="absolute inset-x-0 bottom-6 z-30 flex justify-center gap-2">
          {slides.map((img, i) => (
            <button
              key={img.src}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={current === i}
              onClick={() => api?.scrollTo(i)}
              className={`h-2 rounded-full transition-all ${
                current === i
                  ? "w-7 bg-orange-500"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
}