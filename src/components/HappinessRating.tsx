"use client";

import { cn } from "@/lib/helper";
import Image from "next/image";
import { useState } from "react";

export default function HappinessRating() {
  const [value, setValue] = useState<number>(0);

  const choices = [1, 2, 3, 4, 5];

  return (
    <div className="grid grid-cols-5">
      {choices.map((choice, index) => (
        <label
          key={choice}
          htmlFor={`happiness_${choice}`}
          className="aspect-square transparent block cursor-pointer"
        >
          <input
            id={`happiness_${choice}`}
            type="radio"
            name="happiness_rating"
            value={choice}
            checked={value === choice}
            onChange={() => setValue(choice)}
            className="sr-only"
          />

          <Image
            src="/images/smileys.png"
            width={1400}
            height={280}
            alt={`Happiness rating ${choice}`}
            className={cn("object-cover h-auto aspect-square transition-all duration-200",
              value !== choice && "grayscale brightness-90 contrast-90 opacity-70"
            )}
            style={{
              objectPosition: `${(4 - index) * 25}% 0%`,
            }}
          />
        </label>
      ))}
    </div>
  );
}
