"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TrendingBook = {
  id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  rating: number;
};

// sample data, only for the design
const books: TrendingBook[] = [
  { id: "1", title: "The Silent Garden", author: "Amina Rahman", category: "Fiction", image: "/books/book-1.jpg", rating: 5 },
  { id: "2", title: "Atoms and Curiosity", author: "Daniel Archer", category: "Science", image: "/books/book-2.jpg", rating: 4 },
  { id: "3", title: "Rivers of the Old World", author: "Sofia Marin", category: "History", image: "/books/book-3.jpg", rating: 5 },
  { id: "4", title: "The Little Lantern", author: "Tariq Hasan", category: "Kids", image: "/books/book-4.jpg", rating: 4 },
  { id: "5", title: "Letters from the Coast", author: "Nadia Karim", category: "Fiction", image: "/books/book-5.jpg", rating: 5 },
  { id: "6", title: "How Machines Think", author: "Oliver Grant", category: "Science", image: "/books/book-6.jpg", rating: 4 },
  { id: "7", title: "A Quiet Morning", author: "Lina Cruz", category: "Others", image: "/books/book-1.jpg", rating: 4 },
  { id: "8", title: "Stars Above the Village", author: "Imran Ali", category: "Kids", image: "/books/book-2.jpg", rating: 5 },
];

// each tab shows the same sample books in a different order
const tabs = [
  { value: "featured", label: "Featured", items: books },
  { value: "new", label: "New", items: [...books].reverse() },
  { value: "borrowed", label: "Most Borrowed", items: [...books.slice(3), ...books.slice(0, 3)] },
];

const arrowBtn =
  "size-10 rounded-full border-orange-500/60 bg-transparent text-orange-500 shadow-none transition hover:bg-orange-500 hover:text-white disabled:border-border disabled:text-muted-foreground disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-muted-foreground";

export default function TrendingBooks() {
  const [tab, setTab] = useState("featured");
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

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

  const items = (tabs.find((t) => t.value === tab) ?? tabs[0]).items;

  const handleTabChange = (value: unknown) => {
    setTab(String(value));
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
        <Carousel
          setApi={setApi}
          opts={{ align: "start" }}
          className="mt-10 w-full"
        >
          <CarouselContent className="-ml-4 sm:-ml-6">
            {items.map((book) => (
              <CarouselItem
                key={`${tab}-${book.id}`}
                className="basis-1/2 pl-4 sm:basis-1/3 sm:pl-6 lg:basis-1/5"
              >
                <Link href={`/books/${book.id}`} className="group block">
                  {/* cover */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted shadow-md ring-1 ring-border transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:shadow-orange-500/15">
                    <Image
                      src={book.image}
                      alt={`Cover of ${book.title}`}
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-0 top-3 rounded-r-md bg-black/80 px-2.5 py-1 text-[11px] font-medium text-white">
                      {book.category}
                    </span>
                  </div>

                  {/* info */}
                  <div className="mt-4 text-center">
                    <div
                      className="flex justify-center gap-0.5"
                      aria-label={`${book.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${
                            i < book.rating
                              ? "fill-orange-400 text-orange-400"
                              : "text-muted-foreground/40"
                          }`}
                        />
                      ))}
                    </div>
                    <h3 className="mt-2 line-clamp-1 font-serif text-base font-bold text-foreground transition-colors group-hover:text-orange-500">
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
      </div>
    </section>
  );
}