"use client";

import { Checkpoint, checkpoints, currentUserId, user_checkpoints } from "@/lib/dummy";
import { ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";

// Base map width - change this to adjust default zoom level
const BASE_MAP_WIDTH = 1000

export default function Page() {
  const { id:mapId } = useParams<{ id: string }>();
  
  const [mapWidth, setMapWidth] = useState(BASE_MAP_WIDTH)
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<number | null>(0)
  const [checkpointDialogOpen, setCheckpointDialogOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 })
  const [pinchStartDistance, setPinchStartDistance] = useState(0)
  const [pinchStartWidth, setPinchStartWidth] = useState(BASE_MAP_WIDTH)
  const [pinchCenter, setPinchCenter] = useState({ x: 0, y: 0 })
  
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const mapWidthRef = useRef(BASE_MAP_WIDTH)
  const imageRef = useRef<HTMLImageElement>(null)
  
  const zoomIn = () => {
    const newWidth = Math.min(mapWidthRef.current + (mapWidthRef.current * 0.5), BASE_MAP_WIDTH)
    mapWidthRef.current = newWidth
    setMapWidth(newWidth)
  };
  const zoomOut = () => {
    const newWidth = Math.max(mapWidthRef.current - (mapWidthRef.current * 0.5), 380)
    mapWidthRef.current = newWidth
    setMapWidth(newWidth)
  };
  
  const zoomTo = (newWidth: number, centerX?: number, centerY?: number) => {
    if (!scrollContainerRef.current) {
      const clamped = Math.max(380, Math.min(5000, newWidth))
      mapWidthRef.current = clamped
      setMapWidth(clamped)
      return
    }

    const container = scrollContainerRef.current
    const oldWidth = mapWidthRef.current
    const newWidthClamped = Math.max(380, Math.min(5000, newWidth))
    
    // If center point is provided, zoom towards that point
    if (centerX !== undefined && centerY !== undefined) {
      // Get container bounds
      const containerRect = container.getBoundingClientRect()
      
      // Calculate the point relative to the container viewport
      const pointX = centerX - containerRect.left
      const pointY = centerY - containerRect.top
      
      // Get current scroll position
      const scrollLeft = container.scrollLeft
      const scrollTop = container.scrollTop
      
      // Calculate the point's position in the map content (before zoom)
      // This is the absolute position of the point in the map coordinate system
      const mapX = scrollLeft + pointX
      const mapY = scrollTop + pointY
      
      // Calculate zoom ratio
      const zoomRatio = newWidthClamped / oldWidth
      
      // After zoom, the same map point will be at a different position
      // We need to adjust scroll so the point stays under the cursor
      const newMapX = mapX * zoomRatio
      const newMapY = mapY * zoomRatio
      
      // Calculate new scroll position to keep the point under the cursor
      const newScrollLeft = newMapX - pointX
      const newScrollTop = newMapY - pointY
      
      // Update ref first (this is what the style reads from)
      mapWidthRef.current = newWidthClamped
      
      // Update DOM directly - this happens immediately
      if (imageRef.current) {
        imageRef.current.style.width = `${newWidthClamped}px`
      }
      container.scrollLeft = newScrollLeft
      container.scrollTop = newScrollTop
      
      // Update state asynchronously - it's only for React's tracking
      // The actual width comes from the ref/DOM, so this won't cause flash
      setMapWidth(newWidthClamped)
    } else {
      // No center point, just zoom
      mapWidthRef.current = newWidthClamped
      setMapWidth(newWidthClamped)
    }
  }
  
  const currentUserCheckpoints = user_checkpoints.filter(c => c.user_id === currentUserId)


  const mascot = {
    idle: "/images/mascot1.png",
    walking: "/images/mascot1.png",
    flying: "/images/mascot1.png"

  };

  const mascotPos = selectedCheckpoint ? checkpoints[selectedCheckpoint].pos : checkpoints[0].pos

  // Handle mouse/touch drag to scroll
  const handleStart = (clientX: number, clientY: number) => {
    if (!scrollContainerRef.current) return
    
    setIsDragging(true)
    setStartPos({ x: clientX, y: clientY })
    setScrollStart({
      x: scrollContainerRef.current.scrollLeft,
      y: scrollContainerRef.current.scrollTop
    })
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !scrollContainerRef.current) return

    const deltaX = startPos.x - clientX
    const deltaY = startPos.y - clientY

    scrollContainerRef.current.scrollLeft = scrollStart.x + deltaX
    scrollContainerRef.current.scrollTop = scrollStart.y + deltaY
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if clicking on the map area, not on flags
    if ((e.target as HTMLElement).closest('[data-checkpoint-flag]')) {
      return
    }
    handleStart(e.clientX, e.clientY)
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  const handleMouseLeave = () => {
    handleEnd()
  }


  const handleTouchEnd = () => {
    handleEnd()
  }

  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const delta = e.deltaY
    const zoomFactor = 0.1 // 10% zoom per scroll step
    const currentWidth = mapWidth
    const newWidth = delta > 0 
      ? currentWidth * (1 - zoomFactor) // Zoom out
      : currentWidth * (1 + zoomFactor) // Zoom in
    
    // Zoom towards mouse cursor position
    zoomTo(newWidth, e.clientX, e.clientY)
    return false
  }

  // Calculate distance between two touch points
  const getTouchDistance = (touch1: React.Touch | Touch, touch2: React.Touch | Touch) => {
    const dx = touch2.clientX - touch1.clientX
    const dy = touch2.clientY - touch1.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Calculate center point between two touches
  const getTouchCenter = (touch1: React.Touch | Touch, touch2: React.Touch | Touch) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    }
  }

  // Handle pinch zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only start dragging if touching the map area, not on flags
    if ((e.target as HTMLElement).closest('[data-checkpoint-flag]')) {
      return
    }
    
    if (e.touches.length === 2) {
      // Pinch gesture
      const distance = getTouchDistance(e.touches[0], e.touches[1])
      const center = getTouchCenter(e.touches[0], e.touches[1])
      setPinchStartDistance(distance)
      setPinchStartWidth(mapWidthRef.current)
      setPinchCenter(center)
      setIsDragging(false) // Disable drag when pinching
    } else if (e.touches.length === 1) {
      // Single touch - start drag
      const touch = e.touches[0]
      handleStart(touch.clientX, touch.clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom
      e.preventDefault()
      const distance = getTouchDistance(e.touches[0], e.touches[1])
      const scale = distance / pinchStartDistance
      const newWidth = pinchStartWidth * scale
      
      // Get current center point between the two touches
      const currentCenter = getTouchCenter(e.touches[0], e.touches[1])
      
      // Zoom towards the center point of the pinch
      zoomTo(newWidth, currentCenter.x, currentCenter.y)
    } else if (e.touches.length === 1 && isDragging) {
      // Single touch drag
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
      e.preventDefault()
    }
  }

  // Add global mouse event listeners for smooth dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX, e.clientY)
      }

      const handleGlobalMouseUp = () => {
        handleEnd()
      }

      window.addEventListener('mousemove', handleGlobalMouseMove)
      window.addEventListener('mouseup', handleGlobalMouseUp)

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove)
        window.removeEventListener('mouseup', handleGlobalMouseUp)
      }
    }
  }, [isDragging, startPos, scrollStart])

  // Prevent page scroll when using wheel on map
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let rafId: number | null = null
    let pendingZoom: { width: number; x: number; y: number } | null = null
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      const delta = e.deltaY
      const zoomFactor = 0.08
      const currentWidth = mapWidthRef.current
      const newWidth = delta > 0 
        ? currentWidth * (1 - zoomFactor)
        : currentWidth * (1 + zoomFactor)
      
      // Store the latest zoom request
      pendingZoom = {
        width: newWidth,
        x: e.clientX,
        y: e.clientY
      }
      
      // Batch zoom updates using requestAnimationFrame
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          if (pendingZoom) {
            zoomTo(pendingZoom.width, pendingZoom.x, pendingZoom.y)
            pendingZoom = null
          }
          rafId = null
        })
      }
      
      return false
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (<>
   {checkpointDialogOpen && selectedCheckpoint != null &&
        <CheckpointDialog mapId={mapId} onClose={()=> setCheckpointDialogOpen(false) } checkpointData={checkpoints[selectedCheckpoint]} />
      }
    <div className="relative">
     
      <div 
        ref={scrollContainerRef}
        className={`block border-3 border-black w-screen overflow-auto height-no-header-nav flex ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
        style={{ 
          touchAction: 'none',
          willChange: 'scroll-position',
          contain: 'layout style paint'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-fit h-fit relative" style={{ willChange: 'contents', contain: 'layout style paint' }}>
          <Image
            ref={imageRef}
            className="pointer-events-none max-w-[unset] aspect-[5/6] h-auto"
            style={{ 
              width: `${mapWidthRef.current}px`,
              willChange: 'width',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              imageRendering: 'auto'
            }}
            width={mapWidth}
            height={BASE_MAP_WIDTH * 1.2}
            src="https://ucarecdn.com/8d9dea7b-e862-40dd-848b-260939817a62/01a73c8ba8186dbeabaf51fdab3c61e72c91a0af1.png"
            // src="/images/map.png"
            alt="Victoria Botanical Garden"
          />

          {checkpoints.length > 0 &&
            checkpoints.map((c,index) => {
               const userCheckPointChallengesData = currentUserCheckpoints.find(uc => uc.checkpoint_id === c.id)?.challenges
               const finishedChallenges = userCheckPointChallengesData && Object.values(userCheckPointChallengesData).filter(Boolean)
               const finishedChallengesCount = finishedChallenges?.length ?? 0
              
              return <div
                key={c.id}
                data-checkpoint-flag
                onClick={()=>{
                  if (!isDragging) {
                    setSelectedCheckpoint(index)
                    setCheckpointDialogOpen(true)
                  }
                }}
                className="isolate w-[calc(40px+1.5%)] aspect-square absolute cursor-pointer -translate-x-1/2 -translate-y-full z-10"
                style={{ left: c.pos.x + "%", top: c.pos.y + "%" }}
              >
                {!c.is_visited &&  <Image
                  className="w-[22%] h-auto aspect-square absolute left-[48%] top-[28%]"
                  src="/images/IconLock.png"
                  width={100}
                  height={100}
                  alt="lock"
                />
                }
                {c.is_visited && finishedChallenges && finishedChallengesCount !== 0 && <div className="h-[22%] grid grid-cols-3 absolute left-[48%] top-[60%]">
                  {finishedChallenges.map((uc,index) => {
                    return  <Image
                    key={c.id + "star" + index}
                  className="w-auto h-full aspect-square "
                  src="/images/IconStar.png"
                  width={100}
                  height={100}
                  alt={`${uc}`}
                />
                  }) }
                 
                </div>

                }
                <Image
                  className="w-full h-full"
                  src="/images/IconFlag.png"
                  width={100}
                  height={100}
                  alt={c.title}
                />
              </div>
            })}

          <div

            className="w-[calc(40px+0.6%)] aspect-square absolute pointer-events-none -translate-x-full -translate-y-1/4"
            style={{ left: mascotPos.x + "%", top: mascotPos.y + "%" }}
          >
            <Image
              className="w-full h-full"
              src={mascot.idle}
              width={40}
              height={40}
              alt="Mascot"

            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 p-2 flex flex-col gap-4 mt-4">
        <button
          className="px-4 py-2 bg-black/80 rounded hover:bg-accent/80 transition"
          onClick={zoomIn}
        >
          <ZoomIn color="white" strokeWidth={2} size={30} />
        </button>
        <button
          className="px-4 py-2 bg-black/80 rounded hover:bg-accent/80 transition"
          onClick={zoomOut}
        >
          <ZoomOut color="white" strokeWidth={2} size={30} />
        </button>

      </div>
    </div>
      </>
  );
}


function CheckpointDialog({mapId, checkpointData, onClose }: {mapId:string; checkpointData: Checkpoint; onClose?: ()=> void; }) {

  return <div className="flex p-mobile w-screen h-screen backdrop-blur-[2px] bg-black/10 absolute z-[999999] top-0 p-10 pt-30 left-0">
      <div className="w-100 mx-auto">
        <p className="whitespace-nowrap font-bold border-3 border-black bg-yellow-400 rounded-xl py-4 w-full text-center text-2xl">{checkpointData.subtitle}</p>
        <div className="px-3">
          <div className="ribbon-end bg-white px-10 pt-6 pb-14">
            <p className="text-sm mb-5" dangerouslySetInnerHTML={{ __html: checkpointData.description }}></p>
            <Link
              className="block mx-auto py-1.5 px-4 w-25 text-center rounded-lg bg-app-blue-600 text-white"
              href={`/maps/${mapId}/checkpoints/${checkpointData.id}`}
            >Enter
            </Link>
            <button
            onClick={() => {
              if(onClose){
                onClose()
              }
            }}
            className="underline text-sm mx-auto block p-4">Back</button>
          </div>
        </div>
      </div>
    
  </div>
}