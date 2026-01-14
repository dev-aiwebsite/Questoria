"use client";

import { ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
  const [mapWidth, setMapWidth] = useState(500)

//   const zoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3)); // max 3x
//   const zoomOut = () => setScale((prev) => Math.max(prev - 0.5, 0.5)); // min 0.5x

  const zoomIn = () => setMapWidth((prev) => Math.min(prev + (prev * 0.5), 3000)); // max 3x
  const zoomOut = () => setMapWidth((prev) => Math.max(prev - (prev * 0.5), 380)); // min 0.5x

  

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className=" border-3 border-black w-screen overflow-auto height-no-header-nav flex justify-center">
        <div
          className="w-full h-full"
        >
          <Image
            className="transition-all duration-200 max-w-[unset] aspect-[5/6] h-auto"
            width={mapWidth}
            height={1000}
            src="https://ucarecdn.com/751fb004-49ba-4f68-ace8-3ab51f505bf4/Group731.png"
            alt="Victoria Botanical Garden"
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 p-2 flex gap-4 mt-4">
        <button
          className="px-4 py-2 bg-black/80 rounded hover:bg-accent/80 transition"
          onClick={zoomOut}
        >
            <ZoomOut color="white" strokeWidth={2} size={30} />
        </button>
           <button
          className="px-4 py-2 bg-black/80 rounded hover:bg-accent/80 transition"
          onClick={zoomIn}
        >
            <ZoomIn color="white" strokeWidth={2} size={30} />
        </button>
      </div>
    </div>
  );
}
