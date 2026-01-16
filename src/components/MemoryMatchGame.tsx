"use client"

import { useState, useEffect } from "react";
import { X, Trophy, Sparkles } from "lucide-react";

interface MemoryMatchGameProps {
  onWin: (gems: number) => void;
  onClose: () => void;
  checkpointId?: string;
  mapId?: string;
}

type Card = {
  id: number;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
};

export default function MemoryMatchGame({ onWin, onClose, checkpointId, mapId }: MemoryMatchGameProps) {
  const [tileCount, setTileCount] = useState(8); // Default 8 tiles (4 pairs)
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [tileCount]);

  const initializeGame = () => {
    const pairs = tileCount / 2;
    const values: number[] = [];
    
    // Generate pairs
    for (let i = 1; i <= pairs; i++) {
      values.push(i, i);
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
      // Match found
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
      // No match - flip back
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
      <div data-game-modal className="bg-white rounded-xl border-3 border-black p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="header2">Memory Match Game</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Game Controls */}
        <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-xl border-2 border-black">
          <button
            onClick={initializeGame}
            className="btn primary flex-1 text-sm px-4 py-2"
          >
            Reset Game
          </button>
          <div className="flex-1 text-center">
            <span className="font-bold">Moves: {moves}</span>
          </div>
        </div>

        {/* Game Won Message */}
        {gameWon && (
          <div className="mb-6 p-4 bg-yellow-400 rounded-xl border-2 border-black text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="fill-black" size={32} />
              <h3 className="header3 !mb-0">Congratulations! You Won!</h3>
            </div>
            <p className="text-lg font-bold mb-4">
              You earned <span className="text-2xl inline-flex items-center gap-1">
                <Sparkles className="fill-yellow-500" size={24} />
                {Math.max(1, Math.floor(tileCount / 2))} Gems
              </span>
            </p>
          </div>
        )}

        {/* Game Board */}
        <div
          className={`grid gap-3 mb-6`}
          style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
        >
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={isProcessing || gameWon}
              className={`
                aspect-square rounded-xl border-3 border-black font-bold text-2xl
                transition-all duration-300 transform
                ${card.isMatched
                  ? "bg-green-400 cursor-default"
                  : card.isFlipped
                  ? "bg-accent cursor-pointer hover:scale-105"
                  : "bg-gray-300 cursor-pointer hover:scale-105 hover:bg-gray-400"
                }
                ${isProcessing ? "pointer-events-none" : ""}
                flex items-center justify-center
              `}
            >
              {card.isFlipped || card.isMatched ? (
                <span className="text-4xl">{card.value}</span>
              ) : (
                <span className="text-gray-500 text-4xl">?</span>
              )}
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 space-y-2">
          <p className="font-bold">How to Play:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Click on cards to flip them and find matching pairs</li>
            <li>Match all pairs to win and earn gems</li>
            <li>Adjust the number of tiles before starting a new game</li>
            <li>More tiles = more gems, but harder difficulty!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
