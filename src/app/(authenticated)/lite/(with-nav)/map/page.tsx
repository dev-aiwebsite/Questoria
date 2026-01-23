"use client";

import { Checkpoint, checkpoints, currentUserId, user_checkpoints } from "@/lib/dummy";
import { ZoomIn, ZoomOut, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import MemoryMatchGame from "@/components/MemoryMatchGame";
import WordSearchGame from "@/components/WordSearchGame";
import JigsawPuzzleGame from "@/components/JigsawPuzzleGame";
import { useCurrentUserContext } from "@/app/contexts/currentUserContext";
import PageLoader from "@/components/pageLoader";
import { useAppData } from "@/app/contexts/appDataContext";

// Base map width - change this to adjust default zoom level
const BASE_MAP_WIDTH = 1000


// This is the scale factor at base zoom (1.0). Higher values = larger popup, lower values = smaller popup
const POPUP_BASE_SCALE = 0.6

// Content scale multiplier - adjust this to scale all text, buttons, and spacing inside the popup
// Increase this value (e.g., 1.5, 2.0) to make everything bigger, decrease (e.g., 0.8, 0.9) to make smaller
const CONTENT_SCALE = 1.8

// Game assignment configuration
const memoryMatchCheckpoints = [
  'cp_002',  // Ironbark Garden & Eucalypt Walk
  'cp_009',  // Weird and Wonderful Garden
  'cp_011',  // Kids Backyard
  'cp_012',  // Home Garden
  'cp_015',  // Diversity Garden
  'cp_017'   // Arid Garden
];

const jigsawPuzzleCheckpoints = [
  'cp_001',  // Red Sands Garden
  'cp_004',  // Stringybark Garden
  'cp_006',  // Dry River Bed
  'cp_014',  // Rockpool Waterway
  'cp_016'   // Research Garden
];

const wordSearchCheckpoints = [
  'cp_003',  // Box Garden
  'cp_005',  // Forest Garden
  'cp_007',  // Desert Discovery Camp
  'cp_008',  // Ian Potter Lakeside Precinct Lawn
  'cp_010',  // Serpentine Path
  'cp_013'   // Future Garden
];

// Helper function to check if a checkpoint has a game
function hasGame(checkpointId: string): boolean {
  return memoryMatchCheckpoints.includes(checkpointId) ||
         jigsawPuzzleCheckpoints.includes(checkpointId) ||
         wordSearchCheckpoints.includes(checkpointId);
}

// Helper function to get game type for a checkpoint
function getGameType(checkpointId: string): 'memory' | 'wordsearch' | 'jigsawpuzzle' | null {
  if (memoryMatchCheckpoints.includes(checkpointId)) {
    return 'memory';
  } else if (jigsawPuzzleCheckpoints.includes(checkpointId)) {
    return 'jigsawpuzzle';
  } else if (wordSearchCheckpoints.includes(checkpointId)) {
    return 'wordsearch';
  }
  return null;
}

export default function Page() {
  const { id:mapId } = useParams<{ id: string }>();
  const { currentUser, setCurrentUser, addGems, addCheckpointGems, markCheckpointVisited, checkpoints: userCheckpoints } = useCurrentUserContext();
  const [isMounted, setIsMounted] = useState(false)
  const {users} = useAppData()

  useEffect(()=>{
    setIsMounted(true)
  },[])
  // Initialize user if not set (for development/testing)
  useEffect(() => {
    if (!currentUser) {
      const userData = users.find(u => u.id === currentUserId);
      if (userData) {
        setCurrentUser(userData);
      }
    }
  }, [currentUser, setCurrentUser]);
  
  const [mapWidth, setMapWidth] = useState(BASE_MAP_WIDTH)
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<number | null>(0)
  const [checkpointDialogOpen, setCheckpointDialogOpen] = useState(false)
  const [isGameOpen, setIsGameOpen] = useState(false)
  const [gameType, setGameType] = useState<'memory' | 'wordsearch' | 'jigsawpuzzle'>('memory')
  const [showGemsAlreadyCollected, setShowGemsAlreadyCollected] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 })
  const [pinchStartDistance, setPinchStartDistance] = useState(0)
  const [pinchStartWidth, setPinchStartWidth] = useState(BASE_MAP_WIDTH)
  const [pinchCenter, setPinchCenter] = useState({ x: 0, y: 0 })
  const [animatingGems, setAnimatingGems] = useState<Array<{ id: number; x: number; y: number; targetX?: number; targetY?: number }>>([])
  
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const mapWidthRef = useRef(BASE_MAP_WIDTH)
  const imageRef = useRef<HTMLImageElement>(null)
  const gemCounterRef = useRef<HTMLDivElement>(null)
  const gemAnimationIdRef = useRef(0)
  const animatedGemIdsRef = useRef<Set<number>>(new Set())
  
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

  // Function to trigger gem animation
  const triggerGemAnimation = (count: number, sourceX: number, sourceY: number) => {
    if (!gemCounterRef.current) return;

    const newGems: Array<{ id: number; x: number; y: number; targetX: number; targetY: number }> = [];
    const counterRect = gemCounterRef.current.getBoundingClientRect();
    const targetX = counterRect.left + counterRect.width / 2;
    const targetY = counterRect.top + counterRect.height / 2;

    for (let i = 0; i < count; i++) {
      gemAnimationIdRef.current += 1;
      newGems.push({
        id: gemAnimationIdRef.current,
        x: sourceX,
        y: sourceY,
        targetX,
        targetY
      });
    }

    setAnimatingGems((prev) => [...prev, ...newGems]);
  };

  // Animate gems when they're added to the state
  useEffect(() => {
    if (animatingGems.length === 0) return;

    // Filter to only gems that haven't been animated yet
    const gemsToAnimate = animatingGems.filter(gem => 
      gem.targetX !== undefined && 
      gem.targetY !== undefined && 
      !animatedGemIdsRef.current.has(gem.id)
    );

    if (gemsToAnimate.length === 0) return;

    gemsToAnimate.forEach((gem, index) => {
      // Mark as animated
      animatedGemIdsRef.current.add(gem.id);

      // Wait for DOM to render
      setTimeout(() => {
        const gemElement = document.getElementById(`gem-${gem.id}`);
        if (!gemElement || gem.targetX === undefined || gem.targetY === undefined) return;

        const startX = gem.x;
        const startY = gem.y;
        const endX = gem.targetX;
        const endY = gem.targetY;
        const duration = 800;
        const delay = index * 50;

        setTimeout(() => {
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const currentX = startX + (endX - startX) * easeOut;
            const currentY = startY + (endY - startY) * easeOut;
            const scale = 1 - progress * 0.5; // Shrink as it moves

            gemElement.style.left = `${currentX}px`;
            gemElement.style.top = `${currentY}px`;
            gemElement.style.transform = `translate(-50%, -50%) scale(${scale})`;
            gemElement.style.opacity = `${1 - progress * 0.3}`;

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              // Remove gem from animation list and tracking
              animatedGemIdsRef.current.delete(gem.id);
              setAnimatingGems((prev) => prev.filter((g) => g.id !== gem.id));
            }
          };
          animate();
        }, delay);
      }, 10); // Small delay to ensure DOM is ready
    });
  }, [animatingGems]); // Trigger when animatingGems changes


  const mascot = {
    idle: "/images/mascot1.png",
    walking: "/images/mascot1.png",
    flying: "/images/mascotFlying.png"

  };

  const targetMascotPos = selectedCheckpoint !== null ? checkpoints[selectedCheckpoint].pos : checkpoints[0].pos
  const [mascotPos, setMascotPos] = useState(targetMascotPos)
  const [mascotAnimationPhase, setMascotAnimationPhase] = useState<'idle' | 'jumping-up' | 'flying' | 'jumping-down'>('idle')
  const mascotElementRef = useRef<HTMLDivElement>(null)

  // Update mascot position with animation sequence when target changes
  useEffect(() => {
    // Check if position actually changed
    if (mascotPos.x !== targetMascotPos.x || mascotPos.y !== targetMascotPos.y) {
      // Phase 1: Jump up (0.2s)
      setMascotAnimationPhase('jumping-up')
      
      setTimeout(() => {
        // Phase 2: Switch to flying and start moving (1.0s)
        setMascotAnimationPhase('flying')
        setMascotPos(targetMascotPos)
        
        setTimeout(() => {
          // Phase 3: Switch to idle and jump down (0.2s)
          setMascotAnimationPhase('jumping-down')
          
          setTimeout(() => {
            // Phase 4: Back to idle
            setMascotAnimationPhase('idle')
            
            // Open the popup after animation completes
            // Total animation time: 200ms + 1000ms + 200ms = 1400ms
            if (selectedCheckpoint !== null) {
              setCheckpointDialogOpen(true)
            }
          }, 200) // Jump down duration
        }, 1000) // Movement duration
      }, 200) // Jump up duration
    }
  }, [targetMascotPos.x, targetMascotPos.y, selectedCheckpoint])

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

  return (
  <>{!isMounted ? <PageLoader/> : 
  <>
    <div className="relative">
      {/* Worm Counter - Top Right */}
      <div 
        ref={gemCounterRef}
        className="fixed top-24 right-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm border-3 border-black rounded-xl px-4 py-2 shadow-lg"
      >
        <Image src="/images/worm.png" alt="Worm" width={32} height={32} className="object-contain" />
        <span className="font-bold text-lg">
          {currentUser?.gems || 0}
        </span>
      </div>
     
      <div 
        ref={scrollContainerRef}
        className={`block border-3 border-black w-screen overflow-auto height-with-nav flex ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
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
               const checkpointGems = userCheckpoints?.find(uc => uc.checkpoint_id === c.id)?.gems_collected || 0
               const isCheckpointVisited = userCheckpoints?.find(uc => uc.checkpoint_id === c.id)?.is_visited || false
               
              const isSelected = selectedCheckpoint === index && checkpointDialogOpen
              
              return <div key={c.id}>
                 {/* Gem Count Above Checkpoint */}
                 {/* {checkpointGems > 0 && (
                   <div
                     className="absolute z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm border-2 border-black rounded-lg px-2 py-1 -translate-x-1/2"
                     style={{ 
                       left: `${c.pos.x}%`, 
                       top: `${c.pos.y}%`,
                       transform: 'translate(-50%, calc(-100% - 25px))',
                       width: 'calc(60px + 1.5%)',
                       fontSize: 'calc(0.75rem + 0.5%)',
                       padding: 'calc(4px + 0.25%)',
                       gap: 'calc(4px + 0.25%)',
                       borderWidth: 'calc(2px + 0.1%)',
                       borderRadius: 'calc(8px + 0.5%)'
                     }}
                   >
                     <Sparkles className="fill-yellow-500 text-yellow-500" style={{ width: 'calc(16px + 0.5%)', height: 'calc(16px + 0.5%)' }} />
                     <span className="font-bold text-black">{checkpointGems}</span>
                   </div>
                 )} */}
                
                {/* Flag */}
                <div
                  data-checkpoint-flag
                  data-checkpoint-index={index}
                  onClick={()=>{
                    // Disable clicking during animation
                    if (mascotAnimationPhase !== 'idle') return;
                    
                    if (!isDragging) {
                      if (selectedCheckpoint === index && checkpointDialogOpen) {
                        // Close if clicking the same flag
                        setCheckpointDialogOpen(false)
                        setSelectedCheckpoint(null)
                      } else {
                        // Set checkpoint but don't open dialog yet - wait for animation
                        setCheckpointDialogOpen(false)
                        setSelectedCheckpoint(index)
                        // Dialog will open after animation completes in useEffect
                      }
                    }
                  }}
                  className={`isolate w-[calc(40px+1.5%)] aspect-square absolute -translate-x-1/2 -translate-y-full z-10 ${mascotAnimationPhase !== 'idle' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  style={{ left: c.pos.x + "%", top: c.pos.y + "%" }}
                >
                {!isCheckpointVisited && !c.is_visited &&  <Image
                  className="w-[22%] h-auto aspect-square absolute left-[48%] top-[28%]"
                  src="/images/IconLock.png"
                  width={100}
                  height={100}
                  alt="lock"
                />
                }
                {(isCheckpointVisited || c.is_visited) && finishedChallenges && finishedChallengesCount !== 0 && <div className="h-[22%] grid grid-cols-3 absolute left-[48%] top-[60%]">
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
                  style={(() => {
                    const hasGameForCheckpoint = hasGame(c.id);
                    if (isCheckpointVisited) {
                      return { 
                        filter: 'hue-rotate(120deg) saturate(1.5) brightness(1.1)',
                        transition: 'filter 0.5s ease-in-out'
                      };
                    } else if (!hasGameForCheckpoint) {
                      return {
                        filter: 'grayscale(100%) brightness(1.5)',
                        transition: 'filter 0.5s ease-in-out'
                      };
                    }
                    return { transition: 'filter 0.5s ease-in-out' };
                  })()}
                  src="/images/IconFlag.png"
                  width={100}
                  height={100}
                  alt={c.title}
                />
              </div>
              
              {/* Checkpoint Info Card - appears beside the flag */}
              {isSelected && (
                <CheckpointInfoCard 
                  mapId={mapId} 
                  checkpointData={c}
                  position={{ x: c.pos.x, y: c.pos.y }}
                  zoomLevel={mapWidthRef.current / BASE_MAP_WIDTH}
                  checkpointId={c.id}
                  onPlayGame={() => {
                    const gameType = getGameType(c.id);
                    if (gameType) {
                      setGameType(gameType);
                      setIsGameOpen(true);
                    }
                  }}
                  hasGame={hasGame(c.id)}
                  onClose={() => {
                    setCheckpointDialogOpen(false)
                    setSelectedCheckpoint(null)
                  }}
                />
              )}
            </div>
            })}

          <div
            ref={mascotElementRef}
            className="absolute pointer-events-none"
            style={{ 
              left: mascotPos.x + "%", 
              top: mascotPos.y + "%",
              transform: `translate(-100%, -25%) ${mascotAnimationPhase === 'jumping-up' ? 'translateY(-20px)' : mascotAnimationPhase === 'jumping-down' ? 'translateY(20px)' : 'translateY(0)'}`,
              transition: mascotAnimationPhase === 'flying' 
                ? 'left 1s ease-in-out, top 1s ease-in-out, width 0.5s ease-in-out, height 0.5s ease-in-out, transform 0.5s ease-in-out, aspect-ratio 0.5s ease-in-out'
                : 'transform 0.2s ease-in-out, width 0.2s ease-in-out, height 0.2s ease-in-out, aspect-ratio 0.2s ease-in-out',
              width: mascotAnimationPhase === 'flying' ? 'calc(50px+0.8%)' : 'calc(40px+0.6%)',
              height: mascotAnimationPhase === 'flying' ? 'auto' : 'calc(40px+0.6%)',
              aspectRatio: mascotAnimationPhase === 'flying' ? '433 / 733' : '1 / 1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              className={mascotAnimationPhase === 'flying' ? 'w-full h-auto' : 'w-full h-full'}
              src={mascotAnimationPhase === 'flying' ? mascot.flying : mascot.idle}
              width={mascotAnimationPhase === 'flying' ? 50 : 40}
              height={mascotAnimationPhase === 'flying' ? 50 : 40}
              alt="Mascot"
              style={mascotAnimationPhase === 'flying' ? { objectFit: 'contain' } : {}}
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
    
    {/* Game Modal - Randomly selected between Memory Match and Word Search */}
    {isGameOpen && selectedCheckpoint !== null && (() => {
      const checkpointId = checkpoints[selectedCheckpoint].id;
      const checkpointIndex = selectedCheckpoint;
      
      // Shared onWin handler for both games
      const handleGameWin = (gems: number) => {
        // Check if checkpoint is already visited - if so, show message and don't award gems
        const isCheckpointVisited = userCheckpoints?.find(uc => uc.checkpoint_id === checkpointId)?.is_visited || false;
        if (isCheckpointVisited) {
          setIsGameOpen(false);
          // Show message that gems are already collected
          setShowGemsAlreadyCollected(true);
          // Hide message after 3 seconds
          setTimeout(() => {
            setShowGemsAlreadyCollected(false);
          }, 3000);
          return;
        }
          
        // Update gems immediately so counter updates
        addGems(gems);
        addCheckpointGems(checkpointId, gems);
        
        // Close the game immediately
        setIsGameOpen(false);
        
        // Get checkpoint flag position for animation
        const checkpoint = checkpoints[checkpointIndex];
        let sourceX = window.innerWidth / 2;
        let sourceY = window.innerHeight / 2;
        
        // Use requestAnimationFrame to ensure state updates are processed
        requestAnimationFrame(() => {
          // Try to find the flag element by checkpoint index
          const flagElement = document.querySelector(`[data-checkpoint-index="${checkpointIndex}"]`);
          
          if (flagElement) {
            const rect = flagElement.getBoundingClientRect();
            sourceX = rect.left + rect.width / 2;
            sourceY = rect.top + rect.height / 2;
          } else if (checkpoint && scrollContainerRef.current && imageRef.current) {
            // Fallback: calculate from checkpoint position
            const containerRect = scrollContainerRef.current.getBoundingClientRect();
            const mapWidth = mapWidthRef.current;
            const mapHeight = mapWidth * 1.2;
            const scrollLeft = scrollContainerRef.current.scrollLeft;
            const scrollTop = scrollContainerRef.current.scrollTop;
            
            // Calculate flag position in viewport coordinates
            // Flag is positioned at checkpoint.pos.x% and checkpoint.pos.y% of the map
            const flagX = (checkpoint.pos.x / 100) * mapWidth;
            const flagY = (checkpoint.pos.y / 100) * mapHeight;
            
            sourceX = containerRect.left + scrollLeft + flagX;
            sourceY = containerRect.top + scrollTop + flagY;
          }
          
          // Trigger gem animation from checkpoint flag
          triggerGemAnimation(gems, sourceX, sourceY);
          
          // Calculate animation duration (800ms + delay for last gem)
          const animationDuration = 800 + (gems - 1) * 50;
          
          // Mark checkpoint as visited after animation completes
          setTimeout(() => {
            markCheckpointVisited(checkpointId);
          }, animationDuration);
        });
      };

      // Render the selected game
      if (gameType === 'memory') {
        return (
          <MemoryMatchGame
            onWin={handleGameWin}
            onClose={() => {
              setIsGameOpen(false);
            }}
            checkpointId={checkpointId}
            mapId={mapId}
          />
        );
      } else if (gameType === 'jigsawpuzzle') {
        return (
          <JigsawPuzzleGame
            onWin={handleGameWin}
            onClose={() => {
              setIsGameOpen(false);
            }}
            checkpointId={checkpointId}
            mapId={mapId}
            puzzleSize={4}
          />
        );
      } else {
        return (
          <WordSearchGame
            onWin={handleGameWin}
            onClose={() => {
              setIsGameOpen(false);
            }}
            checkpointId={checkpointId}
            mapId={mapId}
            gridSize={6}
          />
        );
      }
    })()}

    {/* Worms Already Collected Message */}
    {showGemsAlreadyCollected && (
      <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border-3 border-black p-6 max-w-md w-full text-center">
          <h3 className="text-2xl font-bold mb-4">Worms Already Collected</h3>
          <p className="text-lg mb-4">You have already collected worms for this checkpoint.</p>
          <button
            onClick={() => setShowGemsAlreadyCollected(false)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    )}

    {/* Animated Worms */}
    {animatingGems.map((gem) => (
      <div
        key={gem.id}
        id={`gem-${gem.id}`}
        className="fixed pointer-events-none z-[100]"
        style={{
          left: `${gem.x}px`,
          top: `${gem.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Image src="/images/worm.png" alt="Worm" width={40} height={40} className="object-contain" />
      </div>
    ))}
      </>
      }
  </>
  );
}


function CheckpointInfoCard({
  mapId, 
  checkpointData, 
  position,
  zoomLevel,
  checkpointId,
  onPlayGame,
  onClose,
  hasGame = true
}: {
  mapId: string;
  checkpointData: Checkpoint;
  position: { x: number; y: number };
  zoomLevel: number;
  checkpointId: string;
  onPlayGame: () => void;
  onClose?: () => void;
  hasGame?: boolean;
}) {
  const { checkpoints: userCheckpoints } = useCurrentUserContext();
  const checkpointGems = userCheckpoints?.find(uc => uc.checkpoint_id === checkpointId)?.gems_collected || 0;
  
  // Position the card to the right of the flag, or left if too close to right edge
  // Adjust Y_OFFSET to move popup up (negative) or down (positive) relative to flag
  const Y_OFFSET = -4 // Move popup up by 8% (negative = up, positive = down)
  const cardPosition = position.x > 70 
    ? { left: `${position.x - 25}%`, top: `${position.y + Y_OFFSET}%` } // Show on left if near right edge
    : { left: `${position.x + 3}%`, top: `${position.y + Y_OFFSET}%` } // Show on right normally

  // Scale factor based on zoom level (1.0 = base zoom, scales up/down from there)
  // Clamp zoom level to reasonable bounds for scaling
  const clampedZoom = Math.max(0.38, Math.min(5.0, zoomLevel))
  const scale = clampedZoom * POPUP_BASE_SCALE

  // Calculate scaled sizes
  // Calculate scaled sizes - all multiplied by CONTENT_SCALE for easy adjustment
  const headerFontSize = `${scale * CONTENT_SCALE * 1.5}rem` // Base: 1.5rem
  const bodyFontSize = `${scale * CONTENT_SCALE * 0.875}rem` // Base: 0.875rem (text-sm)
  const buttonFontSize = `${scale * CONTENT_SCALE * 0.875}rem` // Base: 0.875rem
  const cardWidth = `${scale * 550}px` // Base: ~550px (popup width, not affected by content scale)
  const headerPadding = `${scale * CONTENT_SCALE * 1}rem` // Base: 1rem
  const contentPaddingX = `${scale * CONTENT_SCALE * 2.5}rem` // Base: 2.5rem
  const contentPaddingY = `${scale * CONTENT_SCALE * 1.5}rem` // Base: 1.5rem
  const contentPaddingBottom = `${scale * CONTENT_SCALE * 2}rem` // Base: 5rem
  const buttonPadding = `${scale * CONTENT_SCALE * 0.375}rem ${scale * CONTENT_SCALE * 1}rem` // Base: py-1.5 px-4
  const backButtonPadding = `${scale * CONTENT_SCALE * 1}rem` // Base: 1rem
  const descriptionMarginBottom = `${scale * CONTENT_SCALE * 1.5}rem` // Base: 1.5rem
  const buttonWidth = `${scale * CONTENT_SCALE * 100}px` // Base: 100px
  // Scale the ribbon-end clip-path - the 2.6rem value needs to scale with zoom
  const ribbonClipPath = `polygon(0% 0%, 100% 0%, 100% 100%, 50% calc(100% - ${scale * 2.6}rem), 0% 100%)`

  return (
    <div 
      className="absolute z-20"
      style={cardPosition}
    >
      <div className="mx-auto" style={{ width: cardWidth, maxWidth: '90vw' }}>
        <p 
          className="font-serif whitespace-nowrap font-bold border-3 border-black bg-yellow-400 rounded-xl w-full text-center"
          style={{ 
            fontSize: headerFontSize,
            paddingTop: headerPadding,
            paddingBottom: headerPadding
          }}
        >
          {checkpointData.subtitle}
        </p>
        <div style={{ paddingLeft: `${scale * 0.75}rem`, paddingRight: `${scale * 0.75}rem` }}>
          <div 
            className="bg-white"
            style={{
              paddingLeft: contentPaddingX,
              paddingRight: contentPaddingX,
              paddingTop: contentPaddingY,
              paddingBottom: contentPaddingBottom,
              clipPath: ribbonClipPath
            }}
          >
            <p 
              style={{ 
                fontSize: bodyFontSize,
                marginBottom: descriptionMarginBottom
              }}
              dangerouslySetInnerHTML={{ __html: checkpointData.description }}
            ></p>
            {checkpointGems > 0 && (
              <div 
                className="flex items-center gap-2 mb-4 justify-center"
                style={{ fontSize: bodyFontSize }}
              >
                <Image src="/images/worm.png" alt="Worm" width={28} height={28} className="object-contain" />
                <span className="font-bold">Worms Collected: {checkpointGems}</span>
              </div>
            )}
            {hasGame && (
              <button
                className="block mx-auto text-center rounded-lg bg-app-blue-600 text-white"
                style={{ 
                  fontSize: buttonFontSize,
                  padding: buttonPadding,
                  width: buttonWidth
                }}
                onClick={onPlayGame}
              >Play the Game
              </button>
            )}
            <button
            onClick={() => {
              if(onClose){
                onClose()
              }
            }}
            className="underline mx-auto block"
            style={{ 
              fontSize: bodyFontSize,
              padding: backButtonPadding
            }}
            >Back</button>
          </div>
        </div>
      </div>
    </div>
  )
}