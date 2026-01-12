"use client";
import { useState } from "react";

export default function HappinessRatingSlider() {
  const [value, setValue] = useState(3);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Rate (1-5): {value}
      </label>
      <input
      
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full !p-0 border-none"
      />
    </div>
  );
}
