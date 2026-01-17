"use client"

import { useState, useEffect, useRef } from "react";
import { X, Trophy, Sparkles } from "lucide-react";
import Image from "next/image";

interface MemoryMatchGameProps {
  onWin: (gems: number) => void;
  onClose: () => void;
  checkpointId?: string;
  mapId?: string;
}

type Card = {
  id: number;
  value: string; // Changed to string for image paths
  isFlipped: boolean;
  isMatched: boolean;
};

// Plant images array
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

export default function MemoryMatchGame({ onWin, onClose, checkpointId, mapId }: MemoryMatchGameProps) {
  const [tileCount, setTileCount] = useState(8); // Default 8 tiles (4 pairs)
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
    
    // Generate pairs using plant images
    // Use available plant images (up to 8 pairs max)
    const availablePlants = plantImages.slice(0, Math.min(pairs, plantImages.length));
    
    // Generate pairs
    for (let i = 0; i < availablePlants.length; i++) {
      values.push(availablePlants[i], availablePlants[i]);
    }
    
    // If we need more pairs than available plants, repeat some plants
    if (pairs > availablePlants.length) {
      const remainingPairs = pairs - availablePlants.length;
      for (let i = 0; i < remainingPairs; i++) {
        const plantIndex = i % availablePlants.length;
        values.push(availablePlants[plantIndex], availablePlants[plantIndex]);
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
        const gemsAwarded = Math.max(1, Math.floor(tileCount / 2));
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
      <div data-game-modal className="border-3 border-black max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" style={{ backgroundColor: '#669f90' }}>
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
              <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-900 text-center" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Memory match game
              </h2>
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
                    <Sparkles className="fill-yellow-500" size={24} />
                    {Math.max(1, Math.floor(tileCount / 2))} Gems
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
                       aspect-square border-2 border-black
                       transition-all duration-300 transform
                       ${card.isMatched
                         ? "bg-green-400 cursor-default"
                         : card.isFlipped
                         ? "bg-blue-200 cursor-pointer hover:scale-105"
                         : "bg-white cursor-pointer hover:scale-105 hover:bg-gray-100"
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
                         className="w-full h-full object-contain p-2"
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
          <div className="bg-white rounded-xl border-3 border-black p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">How to Play</h3>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <ul className="list-disc list-inside space-y-1">
                <li>Click on cards to flip them and find matching pairs</li>
                <li>Match all pairs to win and earn gems</li>
                <li>Adjust the number of tiles before starting a new game</li>
                <li>More tiles = more gems, but harder difficulty!</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
