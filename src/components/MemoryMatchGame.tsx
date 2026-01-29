"use client"

import { useState, useEffect, useRef } from "react";
import { X, Trophy, Sparkles } from "lucide-react";
import Image from "@/components/optimizeImage";

interface MemoryMatchGameProps {
  onWin: (gems: number) => void;
  onClose: () => void;
  checkpointId?: string;
  mapId?: string;
  tileCount?: number; // Optional tile count, defaults to 8 if not provided
}

type Card = {
  id: number;
  value: string; // Changed to string for image paths
  isFlipped: boolean;
  isMatched: boolean;
};

// Plant images array (fallback)
const plantImages = [
  "/memoryMatch/plants/Layer 1.png",
  "/memoryMatch/plants/Layer 2.png",
  "/memoryMatch/plants/Layer 3.png",
  "/memoryMatch/plants/Layer 4.png",
  "/memoryMatch/plants/Layer 5.png",
  "/memoryMatch/plants/Layer 6.png",
  "/memoryMatch/plants/Layer 7.png",
  "/memoryMatch/plants/Layer 8.png",
];

// Checkpoint-specific image configurations
// Maps checkpoint ID to number of images and image paths
// Based on actual checkpoint IDs in dummy.ts
// All checkpoints use exactly 4 images
const CHECKPOINT_IMAGES: Record<string, { count: number; paths: string[] }> = {
  // cp_002: Ironbank Garden (Ironbark Garden & Eucalypt Walk) - 4 images
  'cp_002': {
    count: 4,
    paths: [
      '/images/MemoryMatch/cp_002/1.png',
      '/images/MemoryMatch/cp_002/2.png',
      '/images/MemoryMatch/cp_002/3.png',
      '/images/MemoryMatch/cp_002/4.png',
    ]
  },
  // cp_021: Weird and Wonderful Garden - using first 4 images
  'cp_021': {
    count: 4,
    paths: [
      '/images/MemoryMatch/cp_021/1.png',
      '/images/MemoryMatch/cp_021/2.png',
      '/images/MemoryMatch/cp_021/3.png',
      '/images/MemoryMatch/cp_021/4.png',
    ]
  },
  // cp_031: Kids Backyard - using first 4 images
  'cp_031': {
    count: 4,
    paths: [
      '/images/MemoryMatch/cp_031/1.png',
      '/images/MemoryMatch/cp_031/2.png',
      '/images/MemoryMatch/cp_031/3.png',
      '/images/MemoryMatch/cp_031/4.png',
    ]
  },
  // cp_032: Home Garden - using first 4 images
  'cp_032': {
    count: 4,
    paths: [
      '/images/MemoryMatch/cp_032/1.png',
      '/images/MemoryMatch/cp_032/2.png',
      '/images/MemoryMatch/cp_032/3.png',
      '/images/MemoryMatch/cp_032/4.png',
    ]
  },
  // cp_035: Diversity Garden - using first 4 images
  'cp_035': {
    count: 4,
    paths: [
      '/images/MemoryMatch/cp_035/1.png',
      '/images/MemoryMatch/cp_035/2.png',
      '/images/MemoryMatch/cp_035/3.png',
      '/images/MemoryMatch/cp_035/4.png',
    ]
  },
  // cp_017: Lifestyle Garden (Arid Garden) - needs image folder, using fallback for now
  // Note: User needs to add images to /images/MemoryMatch/cp_017/ folder
};

// Helper function to get images for a checkpoint
function getCheckpointImages(checkpointId?: string): { images: string[]; tileCount: number } {
  if (checkpointId && CHECKPOINT_IMAGES[checkpointId]) {
    const config = CHECKPOINT_IMAGES[checkpointId];
    return {
      images: config.paths,
      tileCount: config.count * 2 // Each image appears twice (pairs)
    };
  }
  // Fallback to plant images
  return {
    images: plantImages,
    tileCount: 8 // Default
  };
}

export default function MemoryMatchGame({ onWin, onClose, checkpointId, mapId, tileCount: initialTileCount }: MemoryMatchGameProps) {
  // Get checkpoint-specific images and tile count
  const { images: checkpointImages, tileCount: checkpointTileCount } = getCheckpointImages(checkpointId);
  // If checkpoint has specific images, use its tile count; otherwise use prop or default
  const defaultTileCount = checkpointId && CHECKPOINT_IMAGES[checkpointId] 
    ? checkpointTileCount 
    : (initialTileCount || 8);
  const [tileCount, setTileCount] = useState(defaultTileCount);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Audio refs for sound effects
  const flipSoundRef = useRef<HTMLAudioElement | null>(null);
  const matchSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements
  useEffect(() => {
    flipSoundRef.current = new Audio('/memoryMatch/sounds/flip.mp3');
    matchSoundRef.current = new Audio('/memoryMatch/sounds/match.mp3');
    wrongSoundRef.current = new Audio('/memoryMatch/sounds/wrong.mp3');
    winSoundRef.current = new Audio('/memoryMatch/sounds/win.mp3');

    // Set volume levels (0.0 to 1.0)
    if (flipSoundRef.current) flipSoundRef.current.volume = 0.5;
    if (matchSoundRef.current) matchSoundRef.current.volume = 0.6;
    if (wrongSoundRef.current) wrongSoundRef.current.volume = 0.5;
    if (winSoundRef.current) winSoundRef.current.volume = 0.7;

    return () => {
      // Cleanup
      if (flipSoundRef.current) flipSoundRef.current = null;
      if (matchSoundRef.current) matchSoundRef.current = null;
      if (wrongSoundRef.current) wrongSoundRef.current = null;
      if (winSoundRef.current) winSoundRef.current = null;
    };
  }, []);

  // Helper function to play sound
  const playSound = (soundRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    try {
      if (soundRef.current) {
        soundRef.current.currentTime = 0; // Reset to start
        soundRef.current.play().catch(() => {
          // Handle autoplay restrictions - silently fail
        });
      }
    } catch (error) {
      // Silently handle errors (e.g., file not found)
    }
  };

  // Update tileCount when prop or checkpoint changes
  useEffect(() => {
    const { tileCount: newTileCount } = getCheckpointImages(checkpointId);
    // If checkpoint has specific images, use its tile count; otherwise use prop or default
    if (checkpointId && CHECKPOINT_IMAGES[checkpointId]) {
      setTileCount(newTileCount);
    } else {
      setTileCount(initialTileCount || 8);
    }
  }, [initialTileCount, checkpointId]);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [tileCount]);

  // Animate clouds from right to left using CSS animations
  useEffect(() => {
    // Add CSS keyframes for cloud animation if not already present
    if (!document.getElementById('cloud-animation-styles')) {
      const style = document.createElement('style');
      style.id = 'cloud-animation-styles';
      style.textContent = `
        @keyframes cloudMove {
          0% {
            transform: translateX(calc(100vw + 500px));
          }
          100% {
            transform: translateX(calc(-100vw - 500px));
          }
        }
        .cloud-animation {
          animation: cloudMove 20s linear infinite;
        }
        .cloud-animation:nth-of-type(1) {
          animation-duration: 20s;
          animation-delay: 0s;
        }
        .cloud-animation:nth-of-type(2) {
          animation-duration: 25s;
          animation-delay: 5s;
        }
        .cloud-animation:nth-of-type(3) {
          animation-duration: 22s;
          animation-delay: 10s;
        }
        .cloud-animation:nth-of-type(4) {
          animation-duration: 20s;
          animation-delay: -10s;
        }
        .cloud-animation:nth-of-type(5) {
          animation-duration: 25s;
          animation-delay: -5s;
        }
        .cloud-animation:nth-of-type(6) {
          animation-duration: 22s;
          animation-delay: -15s;
        }
        .cloud-animation:nth-of-type(4) {
          animation-duration: 20s;
          animation-delay: -10s;
        }
        .cloud-animation:nth-of-type(5) {
          animation-duration: 25s;
          animation-delay: -5s;
        }
        .cloud-animation:nth-of-type(6) {
          animation-duration: 22s;
          animation-delay: -15s;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const initializeGame = () => {
    const pairs = tileCount / 2;
    const values: string[] = [];
    
    // Use checkpoint-specific images if available, otherwise use plant images
    const { images: availableImages } = getCheckpointImages(checkpointId);
    const imagesToUse = availableImages.slice(0, Math.min(pairs, availableImages.length));
    
    // Generate pairs
    for (let i = 0; i < imagesToUse.length; i++) {
      values.push(imagesToUse[i], imagesToUse[i]);
    }
    
    // If we need more pairs than available images, repeat some images
    if (pairs > imagesToUse.length) {
      const remainingPairs = pairs - imagesToUse.length;
      for (let i = 0; i < remainingPairs; i++) {
        const imageIndex = i % imagesToUse.length;
        values.push(imagesToUse[imageIndex], imagesToUse[imageIndex]);
      }
    }

    // Shuffle
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }

    const newCards: Card[] = values.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (cardId: number) => {
    if (isProcessing || gameWon) return;

    const card = cards[cardId];
    if (card.isFlipped || card.isMatched) return;

    if (flippedCards.length === 2) return;

    // Play flip sound
    playSound(flipSoundRef);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    const updatedCards = cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    if (newFlippedCards.length === 2) {
      setIsProcessing(true);
      setMoves((prev) => prev + 1);

      setTimeout(() => {
        checkMatch(newFlippedCards, updatedCards);
      }, 1000);
    }
  };

  const checkMatch = (flipped: number[], currentCards: Card[]) => {
    const [firstId, secondId] = flipped;
    const firstCard = currentCards[firstId];
    const secondCard = currentCards[secondId];

    if (firstCard.value === secondCard.value) {
      // Match found - play match sound
      playSound(matchSoundRef);

      const matchedCards = currentCards.map((c) =>
        c.id === firstId || c.id === secondId
          ? { ...c, isMatched: true, isFlipped: true }
          : c
      );
      setCards(matchedCards);
      setFlippedCards([]);

      // Check if all cards are matched
      const allMatched = matchedCards.every((c) => c.isMatched);
      if (allMatched) {
        setGameWon(true);
        const gemsAwarded = 2; // Games award 2 worms
        // Play win sound
        playSound(winSoundRef);
        // Call onWin immediately, then close after a short delay
        setTimeout(() => {
          onWin(gemsAwarded);
          // Close the game after showing win message briefly
          setTimeout(() => {
            onClose();
          }, 1500);
        }, 500);
      }
    } else {
      // No match - play wrong sound and flip back
      playSound(wrongSoundRef);
      const resetCards = currentCards.map((c) =>
        flipped.includes(c.id) ? { ...c, isFlipped: false } : c
      );
      setCards(resetCards);
      setFlippedCards([]);
    }

    setIsProcessing(false);
  };


  const gridCols = tileCount <= 8 ? 4 : tileCount <= 12 ? 4 : 5;

  return (
    <div className="fixed inset-0 z-[999999] bg-black/80 flex items-center justify-center p-4">
      <div data-game-modal className="border-3 border-black max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" style={{ backgroundColor: '#669f90', fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        {/* Blue Sky Header with Animated Clouds */}
        <div className="relative h-32 overflow-visible border-b-3 border-black" style={{ backgroundColor: '#5ab2e0' }}>
          {/* Animated Clouds - Multiple sets for continuous coverage */}
          {/* First set - starts from right */}
          <Image
            src="/memoryMatch/cloud 1.png"
            alt="Cloud 1"
            width={66}
            height={50}
            className="cloud-animation absolute opacity-90"
            style={{ top: '10px', right: '-140px' }}
          />
          <Image
            src="/memoryMatch/cloud 2.png"
            alt="Cloud 2"
            width={66}
            height={50}
            className="cloud-animation absolute opacity-90"
            style={{ top: '20px', right: '-130px' }}
          />
          <Image
            src="/memoryMatch/cloud 3.png"
            alt="Cloud 3"
            width={123}
            height={93}
            className="cloud-animation absolute opacity-90"
            style={{ top: '5px', right: '-150px' }}
          />
          {/* Second set - pre-positioned randomly across screen to be visible immediately */}
          <Image
            src="/memoryMatch/cloud 1.png"
            alt="Cloud 1"
            width={66}
            height={50}
            className="cloud-animation absolute opacity-90"
            style={{ top: '15px', left: '30%' }}
          />
          <Image
            src="/memoryMatch/cloud 2.png"
            alt="Cloud 2"
            width={66}
            height={50}
            className="cloud-animation absolute opacity-90"
            style={{ top: '25px', left: '70%' }}
          />
          <Image
            src="/memoryMatch/cloud 3.png"
            alt="Cloud 3"
            width={123}
            height={93}
            className="cloud-animation absolute opacity-90"
            style={{ top: '8px', left: '50%' }}
          />

          {/* Header Content */}
          <div className="relative z-10 flex items-center justify-between h-full px-2 sm:px-4 md:px-6" style={{ paddingTop: '20px' }}>
            {/* Left: Mascot */}
            <div className="flex items-end flex-shrink-0" style={{ height: 'calc(100%)', maxWidth: '30%' }}>
              <Image
                src="/images/mascot1.png"
                alt="Mascot"
                width={143}
                height={147}
                className="w-auto object-contain"
                style={{ maxHeight: 'calc(100% - 20px)', maxWidth: '100%' }}
              />
            </div>

            {/* Center: Title */}
            <div className="flex-1 flex items-center justify-center px-2 min-w-0">
              <h3 className="text-center !mb-6 font-bold !text-4xl" style={{ fontFamily: 'var(--font-bayon)' }}>
                Memory match game
              </h3>
            </div>

            {/* Right: Flag */}
            <div className="flex items-end flex-shrink-0" style={{ height: 'calc(100%)', maxWidth: '30%' }}>
              <Image
                src="/memoryMatch/finish.png"
                alt="Finish Flag"
                width={125}
                height={149}
                className="w-auto object-contain"
                style={{ maxHeight: 'calc(100% - 20px)', maxWidth: '100%' }}
              />
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 hover:bg-white/20 rounded-full transition z-20"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Game Content */}
        <div className="flex-1 overflow-auto">
          {/* Container */}
          <div className="p-4" style={{ backgroundColor: '#669f90' }}>
            {/* Game Won Message */}
            {gameWon && (
              <div className="bg-white border-2 border-black p-4 mb-4 text-center" style={{ borderRadius: '23px' }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="fill-black" size={32} />
                  <h3 className="text-2xl font-bold">Congratulations! You Won!</h3>
                </div>
                <p className="text-lg font-bold mb-4">
                  You earned <span className="text-2xl inline-flex items-center gap-1">
                    <Image src="/images/worm.png" alt="Worm" width={32} height={32} className="object-contain" />
                    2 Worms
                  </span>
                </p>
              </div>
            )}

             {/* Container for Controls */}
             <div className="border-2 border-black p-4 mb-4" style={{ backgroundColor: '#d9d9d9', borderRadius: '23px' }}>
               {/* Game Controls */}
               <div className="flex items-center justify-between gap-4">
                 <div>
                   <span className="font-bold">Moves : {moves}</span>
                 </div>
                 <button
                   onClick={initializeGame}
                   className="text-black font-bold px-4 py-2 border-2 border-black transition-colors hover:opacity-90"
                   style={{ backgroundColor: '#f6ca4f', borderRadius: '23px' }}
                 >
                   Reset game
                 </button>
               </div>
             </div>

             {/* Game Board Container */}
             <div className="bg-white border-2 border-black p-4 mb-4" style={{ borderRadius: '23px' }}>
               {/* Game Board */}
               <div
                 className={`grid gap-3`}
                 style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
               >
                 {cards.map((card) => (
                   <button
                     key={card.id}
                     onClick={() => handleCardClick(card.id)}
                     disabled={isProcessing || gameWon}
                     className={`
                       aspect-square border-2
                       transition-all duration-300 transform
                       ${card.isMatched
                         ? "border-green-500 cursor-default"
                         : "border-black"
                       }
                       ${card.isFlipped && !card.isMatched
                         ? "bg-blue-200 cursor-pointer hover:scale-105"
                         : !card.isMatched
                         ? "bg-white cursor-pointer hover:scale-105 hover:bg-gray-100"
                         : ""
                       }
                       ${isProcessing ? "pointer-events-none" : ""}
                       flex items-center justify-center overflow-hidden
                     `}
                     style={{ borderRadius: '23px' }}
                   >
                     {card.isFlipped || card.isMatched ? (
                       <Image
                         src={card.value}
                         alt="Plant"
                         width={100}
                         height={100}
                         className="w-full h-full object-cover"
                         style={{ borderRadius: '23px' }}
                       />
                     ) : (
                       <span className="text-gray-400 text-4xl">?</span>
                     )}
                   </button>
                 ))}
               </div>
             </div>

             {/* Footer: How to play */}
             <div className="bg-white border-2 border-black p-4 text-center" style={{ borderRadius: '23px' }}>
               <button
                 onClick={() => setShowHowToPlay(true)}
                 className="text-gray-700 font-semibold hover:text-gray-900 transition-colors cursor-pointer"
               >
                 How to play?
               </button>
             </div>
           </div>
         </div>
      </div>

      {/* How to Play Popup */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-[9999999] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border-3 border-black p-6 max-w-2xl w-full max-h-[80vh] overflow-auto" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <p className="whitespace-nowrap font-bold border-3 border-black bg-yellow-400 rounded-xl text-center py-4 text-2xl flex-1 mr-4">
                  How to Play
                </p>
                <button
                  onClick={() => setShowHowToPlay(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <ul className="list-disc list-inside space-y-1">
                <li>Click on cards to flip them and find matching pairs</li>
                <li>Match all pairs to win and earn worms</li>
                <li>Adjust the number of tiles before starting a new game</li>
                <li>More tiles = more worms, but harder difficulty!</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
