"use client"

import { useState, useEffect, useRef } from "react"
import { X, Trophy, Sparkles } from "lucide-react"
import Image from "next/image"

interface JigsawPuzzleGameProps {
  onWin: (gems: number) => void
  onClose: () => void
  checkpointId: string
  mapId: string
  imageUrl?: string // Optional image URL
  puzzleSize?: number // Default 3x3 = 9 pieces
}

// Checkpoint-specific image configurations
// Maps checkpoint ID to image path
// Each folder contains exactly 1 image
const CHECKPOINT_IMAGES: Record<string, string> = {
  'cp_001': '/images/JigsawPuzzle/cp_001/1.png',  // Red Sands Garden
  'cp_006': '/images/JigsawPuzzle/cp_006/1.png',  // Stringybark Garden
  'cp_007': '/images/JigsawPuzzle/cp_007/1.png',  // Dry River Bed
  'cp_012': '/images/JigsawPuzzle/cp_012/1.png',  // Lilypad Bridge
  'cp_027': '/images/JigsawPuzzle/cp_027/1.png',  // Research Garden
  'cp_032': '/images/JigsawPuzzle/cp_032/1.png',  // Home Garden
  'cp_034': '/images/JigsawPuzzle/cp_034/1.png'   // Rockpool Waterway
};

// Helper function to get image URL for a checkpoint
function getCheckpointImage(checkpointId?: string, fallbackImageUrl?: string): string {
  if (checkpointId && CHECKPOINT_IMAGES[checkpointId]) {
    return CHECKPOINT_IMAGES[checkpointId];
  }
  // Use provided imageUrl or default
  return fallbackImageUrl || "/slidingPuzzle/duckling.png";
}

type PuzzlePiece = {
  id: number
  correctPosition: number // The position this piece should be in when solved
  currentPosition: number // The current position in the grid
  imageData: string // Base64 or URL for the piece
}

export default function JigsawPuzzleGame({
  onWin,
  onClose,
  checkpointId,
  mapId,
  imageUrl,
  puzzleSize = 3
}: JigsawPuzzleGameProps) {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  // Audio refs for sound effects
  const swooshSoundRef = useRef<HTMLAudioElement | null>(null)
  const winSoundRef = useRef<HTMLAudioElement | null>(null)

  // Get checkpoint-specific image or use provided/fallback
  const defaultImage = getCheckpointImage(checkpointId, imageUrl)

  // Initialize audio elements
  useEffect(() => {
    swooshSoundRef.current = new Audio('/memoryMatch/sounds/swoosh.mp3')
    winSoundRef.current = new Audio('/memoryMatch/sounds/win.mp3')

    // Set volume levels (0.0 to 1.0)
    if (swooshSoundRef.current) swooshSoundRef.current.volume = 0.5
    if (winSoundRef.current) winSoundRef.current.volume = 0.7

    return () => {
      // Cleanup
      if (swooshSoundRef.current) swooshSoundRef.current = null
      if (winSoundRef.current) winSoundRef.current = null
    }
  }, [])

  // Helper function to play sound
  const playSound = (soundRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    try {
      if (soundRef.current) {
        soundRef.current.currentTime = 0 // Reset to start
        soundRef.current.play().catch(() => {
          // Handle autoplay restrictions - silently fail
        })
      }
    } catch (error) {
      // Silently handle errors (e.g., file not found)
    }
  }

  // Load and split image into pieces
  useEffect(() => {
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    
    img.onload = () => {
      imageRef.current = img
      splitImageIntoPieces(img)
      setIsImageLoaded(true)
    }
    
    img.onerror = () => {
      // Fallback to a default image if provided image fails
      const fallbackImg = new window.Image()
      fallbackImg.crossOrigin = "anonymous"
      fallbackImg.src = "/images/maps/map1.png"
      fallbackImg.onload = () => {
        imageRef.current = fallbackImg
        splitImageIntoPieces(fallbackImg)
        setIsImageLoaded(true)
      }
    }
    
    img.src = defaultImage
  }, [puzzleSize, defaultImage])

  const splitImageIntoPieces = (img: HTMLImageElement) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const pieceWidth = img.width / puzzleSize
    const pieceHeight = img.height / puzzleSize

    // Set canvas size to match piece size for extraction
    canvas.width = pieceWidth
    canvas.height = pieceHeight

    const newPieces: PuzzlePiece[] = []
    const totalPieces = puzzleSize * puzzleSize

    // Create pieces with their correct positions
    for (let i = 0; i < totalPieces; i++) {
      const row = Math.floor(i / puzzleSize)
      const col = i % puzzleSize
      
      // Clear canvas and draw only this piece
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(
        img,
        col * pieceWidth,
        row * pieceHeight,
        pieceWidth,
        pieceHeight,
        0,
        0,
        pieceWidth,
        pieceHeight
      )

      // Get image data as base64
      const imageData = canvas.toDataURL("image/png")

      newPieces.push({
        id: i,
        correctPosition: i,
        currentPosition: i,
        imageData
      })
    }

    // Shuffle the pieces
    const shuffled = shufflePuzzle(newPieces)
    
    // Validate: ensure no two pieces have the same position
    const positions = new Set(shuffled.map(p => p.currentPosition))
    if (positions.size !== shuffled.length) {
      // If there's a conflict, reset to initial positions
      const resetPieces = newPieces.map((p, idx) => ({ ...p, currentPosition: idx }))
      setPieces(resetPieces)
    } else {
      setPieces(shuffled)
    }
    
    setMoves(0)
    setGameWon(false)
    setSelectedPieceId(null)
  }

  // Shuffle puzzle by randomly swapping pieces
  const shufflePuzzle = (pieces: PuzzlePiece[]): PuzzlePiece[] => {
    const shuffled = pieces.map(p => ({ ...p })) // Deep copy
    const totalPieces = puzzleSize * puzzleSize
    
    // Perform random swaps to shuffle
    const shuffleSwaps = 200 + Math.floor(Math.random() * 100)

    for (let i = 0; i < shuffleSwaps; i++) {
      const index1 = Math.floor(Math.random() * totalPieces)
      const index2 = Math.floor(Math.random() * totalPieces)
      
      if (index1 !== index2) {
        // Swap positions
        const temp = shuffled[index1].currentPosition
        shuffled[index1].currentPosition = shuffled[index2].currentPosition
        shuffled[index2].currentPosition = temp
      }
    }

    // Final validation: ensure no duplicates
    const positions = shuffled.map(p => p.currentPosition)
    const uniquePositions = new Set(positions)
    if (uniquePositions.size !== positions.length) {
      // If there are duplicates, return pieces in their original positions
      return pieces.map((p, idx) => ({ ...p, currentPosition: idx }))
    }

    return shuffled
  }

  const handlePieceClick = (piece: PuzzlePiece) => {
    if (gameWon) return

    if (selectedPieceId === null) {
      // First click: select the piece
      setSelectedPieceId(piece.id)
    } else if (selectedPieceId === piece.id) {
      // Clicking the same piece: deselect it
      setSelectedPieceId(null)
    } else {
      // Second click: swap the two pieces
      const updatedPieces = pieces.map(p => {
        if (p.id === selectedPieceId) {
          // Find the other piece
          const otherPiece = pieces.find(pi => pi.id === piece.id)
          return { ...p, currentPosition: otherPiece?.currentPosition ?? p.currentPosition }
        } else if (p.id === piece.id) {
          // Find the selected piece
          const selectedPiece = pieces.find(pi => pi.id === selectedPieceId)
          return { ...p, currentPosition: selectedPiece?.currentPosition ?? p.currentPosition }
        }
        return p
      })

      // Play swoosh sound when pieces swap
      playSound(swooshSoundRef)
      
      setPieces(updatedPieces)
      setSelectedPieceId(null)
      setMoves(prev => prev + 1)

      // Check if puzzle is solved
      setTimeout(() => {
        checkWinCondition(updatedPieces)
      }, 100)
    }
  }

  const checkWinCondition = (currentPieces: PuzzlePiece[]) => {
    const isSolved = currentPieces.every(
      piece => piece.currentPosition === piece.correctPosition
    )

    if (isSolved) {
      setGameWon(true)
      // Play win sound
      playSound(winSoundRef)
      // Award gems based on puzzle size
      const gemsAwarded = 1 // Always award 1 worm
      setTimeout(() => {
        onWin(gemsAwarded)
        setTimeout(() => {
          onClose()
        }, 1500)
      }, 500)
    }
  }

  const resetGame = () => {
    if (imageRef.current) {
      splitImageIntoPieces(imageRef.current)
    }
  }

  const getPieceStyle = (piece: PuzzlePiece) => {
    const row = Math.floor(piece.currentPosition / puzzleSize)
    const col = piece.currentPosition % puzzleSize
    const percentage = 100 / puzzleSize
    const isSelected = selectedPieceId === piece.id

    // Ensure position is within valid bounds
    const validRow = Math.max(0, Math.min(row, puzzleSize - 1))
    const validCol = Math.max(0, Math.min(col, puzzleSize - 1))

    return {
      position: "absolute" as const,
      left: `${validCol * percentage}%`,
      top: `${validRow * percentage}%`,
      width: `${percentage}%`,
      height: `${percentage}%`,
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      zIndex: isSelected ? 10 : 1,
      border: isSelected ? "3px solid #f6ca4f" : "1px solid rgba(0, 0, 0, 0.3)",
      boxShadow: isSelected ? "0 0 10px rgba(246, 202, 79, 0.5)" : "none"
    }
  }

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
      `;
      document.head.appendChild(style);
    }
  }, []);

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
                Jigsaw Puzzle
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
                  <h3 className="text-2xl font-bold">🎉 Puzzle Solved! 🎉</h3>
                </div>
                <p className="text-lg font-bold mb-4">
                  You earned <span className="text-2xl inline-flex items-center gap-1">
                    <Image src="/images/worm.png" alt="Worm" width={32} height={32} className="object-contain" />
                    1 Worm
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
                  onClick={resetGame}
                  className="text-black font-bold px-4 py-2 border-2 border-black transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#f6ca4f', borderRadius: '23px' }}
                >
                  Reset game
                </button>
              </div>
            </div>

            {/* Puzzle Board Container */}
            <div className="bg-white border-2 border-black p-4 mb-4" style={{ borderRadius: '23px' }}>
              {/* Puzzle Board */}
              {isImageLoaded ? (
                <div className="relative bg-black/20 rounded-[23px] overflow-hidden" style={{ aspectRatio: "1/1" }}>
                  {pieces.map((piece) => (
                    <div
                      key={piece.id}
                      onClick={() => handlePieceClick(piece)}
                      style={getPieceStyle(piece)}
                    >
                      <img
                        src={piece.imageData}
                        alt={`Piece ${piece.id + 1}`}
                        className="w-full h-full object-cover pointer-events-none select-none"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="text-lg">Loading puzzle...</div>
                </div>
              )}
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

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

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
                <li>Click on a piece to select it (it will be highlighted)</li>
                <li>Click on another piece to swap their positions</li>
                <li>Continue swapping pieces until the image is complete</li>
                <li>Click the same piece again to deselect it</li>
                <li>Try to solve it in as few moves as possible!</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
