"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {type TrendingBook} from "@/lib/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabKey = "featured" | "new" | "mostBorrowed";

type TrendingData = Record<TabKey, TrendingBook[]>;

const tabs: { value: TabKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "new", label: "New" },
  { value: "mostBorrowed", label: "Most Borrowed" },
];

const arrowBtn =
  "size-10 rounded-full border-orange-500/60 bg-transparent text-orange-500 shadow-none transition hover:bg-orange-500 hover:text-white disabled:border-border disabled:text-muted-foreground disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-muted-foreground";

export default function TrendingBooks() {
  const [data, setData] = useState<TrendingData>({
    featured: [],
    new: [],
    mostBorrowed: [],
  });
  const [tab, setTab] = useState<TabKey>("featured");
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // ekbar-ei 3ta tab er data fetch
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.BACK_END_SERVER_API_URL}/api/trending-books`
        );
        if (!res.ok) throw new Error("Failed to load books");
        setData(await res.json());
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);

  // keep the arrow buttons in sync with the carousel
  useEffect(() => {
    if (!api) return;
    const update = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  const items = data[tab] ?? [];

  const handleTabChange = (value: unknown) => {
    setTab(value as TabKey);
    api?.scrollTo(0, true); // jump back to the first book
  };

  return (
    <section className="bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---------- Heading ---------- */}
        <div className="text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">
            <TrendingUp className="size-5" />
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Trending Books
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-orange-500" />
        </div>

        {/* ---------- Tabs (center) + arrows (right), one row ---------- */}
        <div className="mt-8 flex flex-col items-center gap-5 sm:mt-10 sm:grid sm:grid-cols-[1fr_auto_1fr]">
          <div className="hidden sm:block" />

          <Tabs value={tab} onValueChange={handleTabChange}>
            <TabsList className="h-auto max-w-full gap-1 overflow-x-auto rounded-xl bg-card p-1.5 shadow-lg ring-1 ring-border">
              {tabs.map((t) => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground transition data-[active]:bg-orange-500 data-[active]:text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white sm:px-6"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex gap-2 sm:justify-self-end">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous books"
              onClick={() => api?.scrollPrev()}
              disabled={!canPrev}
              className={arrowBtn}
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next books"
              onClick={() => api?.scrollNext()}
              disabled={!canNext}
              className={arrowBtn}
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>

        {/* ---------- Books ---------- */}
        {items.length === 0 ? (
          /* ---------- Empty state ---------- */
          <div className="mx-auto mt-10 flex max-w-xl flex-col items-center justify-center rounded-2xl bg-card px-6 py-14 text-center shadow-sm ring-1 ring-border">
            <div className="flex size-14 items-center justify-center rounded-full bg-orange-500/10">
              <BookOpen className="size-7 text-orange-500" />
            </div>
            <h3 className="mt-4 font-serif text-xl font-bold text-foreground">
              No books found
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              There are no books in this list yet. Please check back soon.
            </p>
          </div>
        ) : (
          <Carousel
            setApi={setApi}
            opts={{ align: "start" }}
            className="mt-10 w-full"
          >
            <CarouselContent className="-ml-4 sm:-ml-6">
              {items.map((book) => (
                <CarouselItem
                  key={`${tab}-${book._id}`}
                  className="basis-1/2 pl-4 sm:basis-1/3 sm:pl-6 lg:basis-1/5"
                >
                  <Link href={`/books/${book._id}`} className="group block">
                    {/* cover */}
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted shadow-md ring-1 ring-border transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:shadow-orange-500/15">
                      {book.image && (
                        <Image
                          src={book.image}
                          alt={`Cover of ${book.title}`}
                          fill
                          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <span className="absolute left-0 top-3 rounded-r-md bg-black/80 px-2.5 py-1 text-[11px] font-medium text-white">
                        {book.category}
                      </span>
                    </div>

                    {/* info */}
                    <div className="mt-4 text-center">
                      <h3 className="line-clamp-1 font-serif text-base font-bold text-foreground transition-colors group-hover:text-orange-500">
                        {book.title}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-sm font-medium text-orange-500">
                        {book.author}
                      </p>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </section>
  );
}