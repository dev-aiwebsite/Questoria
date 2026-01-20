"use client";

import { Checkpoint, checkpoints, currentUserId, user_checkpoints, users } from "@/lib/dummy";
import { ZoomIn, ZoomOut, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import MemoryMatchGame from "@/components/MemoryMatchGame";
import WordSearchGame from "@/components/WordSearchGame";
import { useCurrentUserContext } from "@/app/contexts/currentUserContext";

const BASE_MAP_WIDTH = 1000;
const POPUP_BASE_SCALE = 0.25;

type MapProps = {
  mapId: string;
  className?: string;
};

export default function Map({ className, mapId }: MapProps) {
  const {
    currentUser,
    setCurrentUser,
    addGems,
    addCheckpointGems,
    markCheckpointVisited,
    checkpoints: userCheckpoints,
  } = useCurrentUserContext();

  useEffect(() => {
    if (!currentUser) {
      const userData = users.find((u) => u.id === currentUserId);
      if (userData) {
        setCurrentUser(userData);
      }
    }
  }, [currentUser, setCurrentUser]);

  const [mapWidth, setMapWidth] = useState(BASE_MAP_WIDTH);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<number | null>(0);
  const [checkpointDialogOpen, setCheckpointDialogOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [gameType, setGameType] = useState<"memory" | "wordsearch">("memory");
  const [showGemsAlreadyCollected, setShowGemsAlreadyCollected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });
  const [pinchStartDistance, setPinchStartDistance] = useState(0);
  const [pinchStartWidth, setPinchStartWidth] = useState(BASE_MAP_WIDTH);
  const [pinchCenter, setPinchCenter] = useState({ x: 0, y: 0 });
  const [animatingGems, setAnimatingGems] = useState<
    Array<{ id: number; x: number; y: number; targetX?: number; targetY?: number }>
  >([]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mapWidthRef = useRef(BASE_MAP_WIDTH);
  const imageRef = useRef<HTMLImageElement>(null);
  const gemCounterRef = useRef<HTMLDivElement>(null);
  const gemAnimationIdRef = useRef(0);
  const animatedGemIdsRef = useRef<Set<number>>(new Set());

  const zoomIn = () => {
    const newWidth = Math.min(mapWidthRef.current + mapWidthRef.current * 0.5, BASE_MAP_WIDTH);
    mapWidthRef.current = newWidth;
    setMapWidth(newWidth);
  };

  const zoomOut = () => {
    const newWidth = Math.max(mapWidthRef.current - mapWidthRef.current * 0.5, 380);
    mapWidthRef.current = newWidth;
    setMapWidth(newWidth);
  };

  const zoomTo = (newWidth: number, centerX?: number, centerY?: number) => {
    const clamped = Math.max(380, Math.min(5000, newWidth));

    if (!scrollContainerRef.current) {
      mapWidthRef.current = clamped;
      setMapWidth(clamped);
      return;
    }

    const container = scrollContainerRef.current;
    const oldWidth = mapWidthRef.current;
    const newWidthClamped = clamped;

    if (centerX !== undefined && centerY !== undefined) {
      const containerRect = container.getBoundingClientRect();
      const pointX = centerX - containerRect.left;
      const pointY = centerY - containerRect.top;

      const scrollLeft = container.scrollLeft;
      const scrollTop = container.scrollTop;

      const mapX = scrollLeft + pointX;
      const mapY = scrollTop + pointY;

      const zoomRatio = newWidthClamped / oldWidth;
      const newMapX = mapX * zoomRatio;
      const newMapY = mapY * zoomRatio;

      const newScrollLeft = newMapX - pointX;
      const newScrollTop = newMapY - pointY;

      mapWidthRef.current = newWidthClamped;

      if (imageRef.current) {
        imageRef.current.style.width = `${newWidthClamped}px`;
      }
      container.scrollLeft = newScrollLeft;
      container.scrollTop = newScrollTop;

      setMapWidth(newWidthClamped);
    } else {
      mapWidthRef.current = newWidthClamped;
      setMapWidth(newWidthClamped);
    }
  };

  const currentUserCheckpoints = user_checkpoints.filter((c) => c.user_id === currentUserId);

  const triggerGemAnimation = (count: number, sourceX: number, sourceY: number) => {
    if (!gemCounterRef.current) return;

    const newGems: Array<{ id: number; x: number; y: number; targetX: number; targetY: number }> =
      [];
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
        targetY,
      });
    }

    setAnimatingGems((prev) => [...prev, ...newGems]);
  };

  useEffect(() => {
    if (animatingGems.length === 0) return;

    const gemsToAnimate = animatingGems.filter(
      (gem) =>
        gem.targetX !== undefined &&
        gem.targetY !== undefined &&
        !animatedGemIdsRef.current.has(gem.id)
    );

    if (gemsToAnimate.length === 0) return;

    gemsToAnimate.forEach((gem, index) => {
      animatedGemIdsRef.current.add(gem.id);

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

            const easeOut = 1 - Math.pow(1 - progress, 3);

            const currentX = startX + (endX - startX) * easeOut;
            const currentY = startY + (endY - startY) * easeOut;
            const scale = 1 - progress * 0.5;

            gemElement.style.left = `${currentX}px`;
            gemElement.style.top = `${currentY}px`;
            gemElement.style.transform = `translate(-50%, -50%) scale(${scale})`;
            gemElement.style.opacity = `${1 - progress * 0.3}`;

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              animatedGemIdsRef.current.delete(gem.id);
              setAnimatingGems((prev) => prev.filter((g) => g.id !== gem.id));
            }
          };
          animate();
        }, delay);
      }, 10);
    });
  }, [animatingGems]);

  const mascot = {
    idle: "/images/mascot1.png",
    walking: "/images/mascot1.png",
    flying: "/images/mascotFlying.png",
  };

  const targetMascotPos =
    selectedCheckpoint !== null ? checkpoints[selectedCheckpoint].pos : checkpoints[0].pos;

  const [mascotPos, setMascotPos] = useState(targetMascotPos);
  const [mascotAnimationPhase, setMascotAnimationPhase] = useState<
    "idle" | "jumping-up" | "flying" | "jumping-down"
  >("idle");

  const mascotElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mascotPos.x !== targetMascotPos.x || mascotPos.y !== targetMascotPos.y) {
      setMascotAnimationPhase("jumping-up");

      setTimeout(() => {
        setMascotAnimationPhase("flying");
        setMascotPos(targetMascotPos);

        setTimeout(() => {
          setMascotAnimationPhase("jumping-down");

          setTimeout(() => {
            setMascotAnimationPhase("idle");

            if (selectedCheckpoint !== null) {
              setCheckpointDialogOpen(true);
            }
          }, 200);
        }, 1000);
      }, 200);
    }
  }, [targetMascotPos.x, targetMascotPos.y, selectedCheckpoint]);

  const handleStart = (clientX: number, clientY: number) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
    setScrollStart({
      x: scrollContainerRef.current.scrollLeft,
      y: scrollContainerRef.current.scrollTop,
    });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !scrollContainerRef.current) return;

    const deltaX = startPos.x - clientX;
    const deltaY = startPos.y - clientY;

    scrollContainerRef.current.scrollLeft = scrollStart.x + deltaX;
    scrollContainerRef.current.scrollTop = scrollStart.y + deltaY;
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-checkpoint-flag]")) {
      return;
    }
    handleStart(e.clientX, e.clientY);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    handleEnd();
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY;
    const zoomFactor = 0.1;
    const currentWidth = mapWidth;
    const newWidth = delta > 0 ? currentWidth * (1 - zoomFactor) : currentWidth * (1 + zoomFactor);

    zoomTo(newWidth, e.clientX, e.clientY);
    return false;
  };

  const getTouchDistance = (touch1: React.Touch | Touch, touch2: React.Touch | Touch) => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touch1: React.Touch | Touch, touch2: React.Touch | Touch) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest("[data-checkpoint-flag]")) {
      return;
    }

    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      const center = getTouchCenter(e.touches[0], e.touches[1]);
      setPinchStartDistance(distance);
      setPinchStartWidth(mapWidthRef.current);
      setPinchCenter(center);
      setIsDragging(false);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      const scale = distance / pinchStartDistance;
      const newWidth = pinchStartWidth * scale;

      const currentCenter = getTouchCenter(e.touches[0], e.touches[1]);
      zoomTo(newWidth, currentCenter.x, currentCenter.y);
    } else if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX, e.clientY);
      };

      const handleGlobalMouseUp = () => {
        handleEnd();
      };

      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging, startPos, scrollStart]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let rafId: number | null = null;
    let pendingZoom: { width: number; x: number; y: number } | null = null;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY;
      const zoomFactor = 0.08;
      const currentWidth = mapWidthRef.current;
      const newWidth = delta > 0 ? currentWidth * (1 - zoomFactor) : currentWidth * (1 + zoomFactor);

      pendingZoom = { width: newWidth, x: e.clientX, y: e.clientY };

      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          if (pendingZoom) {
            zoomTo(pendingZoom.width, pendingZoom.x, pendingZoom.y);
            pendingZoom = null;
          }
          rafId = null;
        });
      }

      return false;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <>
      <div className="relative">
        <div
          ref={gemCounterRef}
          className="fixed top-24 right-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm border-3 border-black rounded-xl px-4 py-2 shadow-lg"
        >
          <Sparkles className="fill-yellow-500 text-yellow-500" size={24} />
          <span className="font-bold text-lg">{currentUser?.gems || 0}</span>
        </div>

        <div
          ref={scrollContainerRef}
          className={`block border-3 border-black w-screen overflow-auto flex ${
            isDragging ? "cursor-grabbing select-none" : "cursor-grab"
          } ${className}`}
          style={{
            touchAction: "none",
            willChange: "scroll-position",
            contain: "layout style paint",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-fit h-fit relative" style={{ willChange: "contents", contain: "layout style paint" }}>
            <Image
              ref={imageRef}
              className="pointer-events-none max-w-[unset] aspect-[5/6] h-auto"
              style={{
                width: `${mapWidth}px`,
                willChange: "width",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "translateZ(0)",
                imageRendering: "auto",
              }}
              width={mapWidth}
              height={BASE_MAP_WIDTH * 1.2}
              src="https://ucarecdn.com/8d9dea7b-e862-40dd-848b-260939817a62/01a73c8ba8186dbeabaf51fdab3c61e72c91a0af1.png"
              alt="Victoria Botanical Garden"
            />

            {checkpoints.length > 0 &&
              checkpoints.map((c, index) => {
                const userCheckPointChallengesData = currentUserCheckpoints.find(
                  (uc) => uc.checkpoint_id === c.id
                )?.challenges;
                const finishedChallenges =
                  userCheckPointChallengesData && Object.values(userCheckPointChallengesData).filter(Boolean);
                const finishedChallengesCount = finishedChallenges?.length ?? 0;
                const checkpointGems =
                  userCheckpoints?.find((uc) => uc.checkpoint_id === c.id)?.gems_collected || 0;
                const isCheckpointVisited =
                  userCheckpoints?.find((uc) => uc.checkpoint_id === c.id)?.is_visited || false;

                const isSelected = selectedCheckpoint === index && checkpointDialogOpen;

                return (
                  <div key={c.id}>
                    <div
                      data-checkpoint-flag
                      data-checkpoint-index={index}
                      onClick={() => {
                        if (mascotAnimationPhase !== "idle") return;

                        if (!isDragging) {
                          if (selectedCheckpoint === index && checkpointDialogOpen) {
                            setCheckpointDialogOpen(false);
                            setSelectedCheckpoint(null);
                          } else {
                            setCheckpointDialogOpen(false);
                            setSelectedCheckpoint(index);
                          }
                        }
                      }}
                      className={`isolate w-[calc(40px+1.5%)] aspect-square absolute -translate-x-1/2 -translate-y-full z-10 ${
                        mascotAnimationPhase !== "idle" ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                      }`}
                      style={{ left: c.pos.x + "%", top: c.pos.y + "%" }}
                    >
                      <span className="bg-white text-sm whitespace-nowrap">{c.title}</span>

                      {!isCheckpointVisited && !c.is_visited && (
                        <Image
                          className="w-[22%] h-auto aspect-square absolute left-[48%] top-[28%]"
                          src="/images/IconLock.png"
                          width={100}
                          height={100}
                          alt="lock"
                        />
                      )}

                      {(isCheckpointVisited || c.is_visited) && finishedChallenges && finishedChallengesCount !== 0 && (
                        <div className="h-[22%] grid grid-cols-3 absolute left-[48%] top-[60%]">
                          {finishedChallenges.map((uc, idx) => (
                            <Image
                              key={c.id + "star" + idx}
                              className="w-auto h-full aspect-square "
                              src="/images/IconStar.png"
                              width={100}
                              height={100}
                              alt={`${uc}`}
                            />
                          ))}
                        </div>
                      )}

                      <Image
                        className="w-full h-full"
                        style={
                          isCheckpointVisited
                            ? {
                                filter: "hue-rotate(120deg) saturate(1.5) brightness(1.1)",
                                transition: "filter 0.5s ease-in-out",
                              }
                            : {}
                        }
                        src="/images/IconFlag.png"
                        width={100}
                        height={100}
                        alt={c.title}
                      />
                    </div>

                    {isSelected && (
                      <CheckpointInfoCard
                        mapId={mapId}
                        checkpointData={c}
                        position={{ x: c.pos.x, y: c.pos.y }}
                        zoomLevel={mapWidth / BASE_MAP_WIDTH}
                        checkpointId={c.id}
                        onPlayGame={() => {
                          const randomGame = Math.random() < 0.5 ? "memory" : "wordsearch";
                          setGameType(randomGame);
                          setIsGameOpen(true);
                        }}
                        onClose={() => {
                          setCheckpointDialogOpen(false);
                          setSelectedCheckpoint(null);
                        }}
                      />
                    )}
                  </div>
                );
              })}

            <div
              ref={mascotElementRef}
              className="absolute pointer-events-none"
              style={{
                left: mascotPos.x + "%",
                top: mascotPos.y + "%",
                transform: `translate(-100%, -25%) ${
                  mascotAnimationPhase === "jumping-up"
                    ? "translateY(-20px)"
                    : mascotAnimationPhase === "jumping-down"
                      ? "translateY(20px)"
                      : "translateY(0)"
                }`,
                transition:
                  mascotAnimationPhase === "flying"
                    ? "left 1s ease-in-out, top 1s ease-in-out, width 0.5s ease-in-out, height 0.5s ease-in-out, transform 0.5s ease-in-out, aspect-ratio 0.5s ease-in-out"
                    : "transform 0.2s ease-in-out, width 0.2s ease-in-out, height 0.2s ease-in-out, aspect-ratio 0.2s ease-in-out",
                width: mascotAnimationPhase === "flying" ? "calc(50px+0.8%)" : "calc(40px+0.6%)",
                height: mascotAnimationPhase === "flying" ? "auto" : "calc(40px+0.6%)",
                aspectRatio: mascotAnimationPhase === "flying" ? "433 / 733" : "1 / 1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                className={mascotAnimationPhase === "flying" ? "w-full h-auto" : "w-full h-full"}
                src={mascotAnimationPhase === "flying" ? mascot.flying : mascot.idle}
                width={mascotAnimationPhase === "flying" ? 50 : 40}
                height={mascotAnimationPhase === "flying" ? 50 : 40}
                alt="Mascot"
                style={mascotAnimationPhase === "flying" ? { objectFit: "contain" } : {}}
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 p-2 flex flex-col gap-4 mt-4">
          <button className="px-4 py-2 bg-black/80 rounded hover:bg-accent/80 transition" onClick={zoomIn}>
            <ZoomIn color="white" strokeWidth={2} size={30} />
          </button>
          <button className="px-4 py-2 bg-black/80 rounded hover:bg-accent/80 transition" onClick={zoomOut}>
            <ZoomOut color="white" strokeWidth={2} size={30} />
          </button>
        </div>
      </div>

      {isGameOpen && selectedCheckpoint !== null && (() => {
        const checkpointId = checkpoints[selectedCheckpoint].id;
        const checkpointIndex = selectedCheckpoint;

        const handleGameWin = (gems: number) => {
          const isCheckpointVisited =
            userCheckpoints?.find((uc) => uc.checkpoint_id === checkpointId)?.is_visited || false;

          if (isCheckpointVisited) {
            setIsGameOpen(false);
            setShowGemsAlreadyCollected(true);
            setTimeout(() => setShowGemsAlreadyCollected(false), 3000);
            return;
          }

          addGems(gems);
          addCheckpointGems(checkpointId, gems);
          setIsGameOpen(false);

          const checkpoint = checkpoints[checkpointIndex];
          let sourceX = window.innerWidth / 2;
          let sourceY = window.innerHeight / 2;

          requestAnimationFrame(() => {
            const flagElement = document.querySelector(`[data-checkpoint-index="${checkpointIndex}"]`);

            if (flagElement) {
              const rect = flagElement.getBoundingClientRect();
              sourceX = rect.left + rect.width / 2;
              sourceY = rect.top + rect.height / 2;
            } else if (checkpoint && scrollContainerRef.current && imageRef.current) {
              const containerRect = scrollContainerRef.current.getBoundingClientRect();
              const mapWidthValue = mapWidthRef.current;
              const mapHeight = mapWidthValue * 1.2;
              const scrollLeft = scrollContainerRef.current.scrollLeft;
              const scrollTop = scrollContainerRef.current.scrollTop;

              const flagX = (checkpoint.pos.x / 100) * mapWidthValue;
              const flagY = (checkpoint.pos.y / 100) * mapHeight;

              sourceX = containerRect.left + scrollLeft + flagX;
              sourceY = containerRect.top + scrollTop + flagY;
            }

            triggerGemAnimation(gems, sourceX, sourceY);

            const animationDuration = 800 + (gems - 1) * 50;

            setTimeout(() => {
              markCheckpointVisited(checkpointId);
            }, animationDuration);
          });
        };

        if (gameType === "memory") {
          return (
            <MemoryMatchGame
              onWin={handleGameWin}
              onClose={() => setIsGameOpen(false)}
              checkpointId={checkpointId}
              mapId={mapId}
            />
          );
        }

        return (
          <WordSearchGame
            onWin={handleGameWin}
            onClose={() => setIsGameOpen(false)}
            checkpointId={checkpointId}
            mapId={mapId}
            gridSize={6}
          />
        );
      })()}

      {showGemsAlreadyCollected && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border-3 border-black p-6 max-w-md w-full text-center">
            <h3 className="text-2xl font-bold mb-4">Gems Already Collected</h3>
            <p className="text-lg mb-4">You have already collected gems for this checkpoint.</p>
            <button
              onClick={() => setShowGemsAlreadyCollected(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {animatingGems.map((gem) => (
        <div
          key={gem.id}
          id={`gem-${gem.id}`}
          className="fixed pointer-events-none z-[100]"
          style={{
            left: `${gem.x}px`,
            top: `${gem.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Sparkles className="fill-yellow-500 text-yellow-500" size={32} />
        </div>
      ))}
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
}: {
  mapId: string;
  checkpointData: Checkpoint;
  position: { x: number; y: number };
  zoomLevel: number;
  checkpointId: string;
  onPlayGame: () => void;
  onClose?: () => void;
}) {
  const { checkpoints: userCheckpoints } = useCurrentUserContext();
  const checkpointGems = userCheckpoints?.find((uc) => uc.checkpoint_id === checkpointId)?.gems_collected || 0;

  const Y_OFFSET = -4;
  const cardPosition =
    position.x > 70
      ? { left: `${position.x - 25}%`, top: `${position.y + Y_OFFSET}%` }
      : { left: `${position.x + 3}%`, top: `${position.y + Y_OFFSET}%` };

  const clampedZoom = Math.max(0.38, Math.min(5.0, zoomLevel));
  const scale = clampedZoom * POPUP_BASE_SCALE;

  const headerFontSize = `${scale * 1.5}rem`;
  const bodyFontSize = `${scale * 0.875}rem`;
  const buttonFontSize = `${scale * 0.875}rem`;
  const cardWidth = `${scale * 400}px`;
  const headerPadding = `${scale * 1}rem`;
  const contentPaddingX = `${scale * 2.5}rem`;
  const contentPaddingY = `${scale * 1.5}rem`;
  const contentPaddingBottom = `${scale * 5}rem`;
  const buttonPadding = `${scale * 0.375}rem ${scale * 1}rem`;
  const backButtonPadding = `${scale * 1}rem`;
  const descriptionMarginBottom = `${scale * 1.5}rem`;
  const buttonWidth = `${scale * 100}px`;
  const ribbonClipPath = `polygon(0% 0%, 100% 0%, 100% 100%, 50% calc(100% - ${scale * 2.6}rem), 0% 100%)`;

  return (
    <div className="absolute z-20" style={cardPosition}>
      <div className="mx-auto" style={{ width: cardWidth, maxWidth: "90vw" }}>
        <p
          className="whitespace-nowrap font-bold border-3 border-black bg-yellow-400 rounded-xl w-full text-center"
          style={{
            fontSize: headerFontSize,
            paddingTop: headerPadding,
            paddingBottom: headerPadding,
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
              clipPath: ribbonClipPath,
            }}
          >
            <p style={{ fontSize: bodyFontSize, marginBottom: descriptionMarginBottom }} dangerouslySetInnerHTML={{ __html: checkpointData.description }} />

            {checkpointGems > 0 && (
              <div className="flex items-center gap-2 mb-4 justify-center" style={{ fontSize: bodyFontSize }}>
                <Sparkles className="fill-yellow-500 text-yellow-500" size={20} />
                <span className="font-bold">Gems Collected: {checkpointGems}</span>
              </div>
            )}

            <button
              className="block mx-auto text-center rounded-lg bg-app-blue-600 text-white"
              style={{ fontSize: buttonFontSize, padding: buttonPadding, width: buttonWidth }}
              onClick={onPlayGame}
            >
              Play the Game
            </button>

            <button
              onClick={() => onClose && onClose()}
              className="underline mx-auto block"
              style={{ fontSize: bodyFontSize, padding: backButtonPadding }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
