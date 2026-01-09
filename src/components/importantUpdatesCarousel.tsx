"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/shadcn/ui/carousel";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/helper";
import ImageWithFallback from "./imageWithFallback";
import { motion } from "framer-motion";

const DURATION = 5000; // ms
const BAR_WIDTH = 40;
const CIRCLE_SIZE = 8;

const data = [
  {
    id: "dfsf23234",
    title: "Map 1",
    image: "/images/image.jpg",
    link: "#"
  },
  {
    id: "dfsf9f2kl",
    title: "Map @",
    image: "/images/image2.jpg",
    link: "#"
  }
]



export default function ImportantUpdatesCarousel({
  className,
  maxCount,
}: {
  className?: string;
  maxCount?: number;
}) {
  const isFetching = false
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Apply maxCount to the list of items
  const items = maxCount ? data.slice(0, maxCount) : data;
  const count = items.length ?? 5;
  

  useEffect(() => {
  if (!api) return;

  // Defer initial setState to avoid React warning
  const tick = setTimeout(() => {
    setCurrent(api.selectedScrollSnap() + 1);
  }, 0);

  // Subscribe to select events
  api.on("select", () => {
    setCurrent(api.selectedScrollSnap() + 1);
  });

  // Clear old interval if exists
  if (intervalRef.current) clearInterval(intervalRef.current);

  // Only autoplay if we have content
  if (items.length > 0) {
    intervalRef.current = setInterval(() => {
      if (!api) return;
      const nextIndex = (api.selectedScrollSnap() + 1) % count;
      api.scrollTo(nextIndex);
    }, DURATION);
  }

  // Cleanup
  return () => {
    clearTimeout(tick);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
}, [api, items]);


  const hasNoData = isFetching 
  return (
    <div>
      
      <Carousel
        setApi={setApi}
        className={cn("w-full p-1", className)}
      >
        <CarouselContent>
          {!hasNoData ?
          items.map((item, index) => (
              <CarouselItem key={item.id + index} className="basis-[90%]">
                <Link
                className="block rounded-md border-3 border-black overflow-hidden"
                href={item.link}>
                  <div className="overflow-hidden bg-secondary/50 rounded-sm w-full h-[167px] relative">
                    <div className="absolute bottom-0 w-full text-white font-semibold p-4 bg-black/20">
                      <p className="line-clamp-1 ">
                        {item.title}
                      </p>
                    </div>

                    <ImageWithFallback
                      className="img rounded-sm w-full h-[167px] object-cover object-top"
                      width={200}
                      height={167}
                      src={item.image}
                      alt={item.title || ""}
                      priority
                    />
                  </div>
                </Link>
              </CarouselItem>
            ))
            : Array.from({ length: count }).map((_, index) => (
              <CarouselItem key={index} className="basis-[90%]">
                 <div className="overflow-hidden bg-secondary/50 rounded-sm w-full h-[167px] relative">
                  {/* Skeleton for title */}
                  <div className="absolute bottom-0 w-full p-4">
                    <div className="h-4 w-3/4 bg-gray-300 rounded line-clamp-1 animate-pulse" />
                  </div>

                  {/* Skeleton for image */}
                  <div className="w-full h-[167px] bg-gray-300 animate-pulse rounded-sm" />
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>

      {/* Progress indicators */}
      <div className="mx-auto mt-4 flex w-full max-w-lg justify-center gap-3">
        {Array.from({ length: count }).map((_, index) => {
          const isActive = current === index + 1;
          return (
            <motion.span
              key={index}
              layout
              initial={false}
              animate={{
                width: isActive ? BAR_WIDTH : CIRCLE_SIZE,
                height: CIRCLE_SIZE,
                borderRadius: isActive ? 8 : 999,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              }}
              className="bg-background/50 relative block overflow-hidden"
              style={{
                minWidth: CIRCLE_SIZE,
                maxWidth: BAR_WIDTH,
                border: "none",
              }}
            >
              {items.length > 0 && isActive && (
                <motion.div
                  key={`progress-${index}-${current}`}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: DURATION / 1000, ease: "linear" }}
                  className="bg-foreground absolute top-0 left-0 h-full rounded-lg"
                />
              )}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
