"use client"

import { useAppData } from "@/contexts/appDataContext";

export default function PageLoaderResourcesProgress() {
  const {imagesLoaded, imagesProgress:progress} = useAppData()
    return <>
        {!imagesLoaded && <div>
              {/* Optional progress bar / percentage */}
          {typeof progress === "number" && <div className="w-70">
            <div className="w-full h-2 bg-black/20 rounded overflow-hidden mt-2">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs w-full flex flex-row flex-nowrap gap-20 text-sm text-black mt-1">
            <span className="whitespace-nowrap">Downloading Resources...</span>
            <span className="ml-auto">{progress}%</span>
            </div>  
          </div>
          }
        </div>}
    </>
}
