"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import Image from "next/image"

interface SlidingPuzzleGameProps {
  onWin: (gems: number) => void
  onClose: () => void
  checkpointId: string
  mapId: string
  imageUrl?: string // Optional image URL, defaults to a checkpoint image
  puzzleSize?: 2 | 3 | 5 // 2x2 (4 pieces), 3x3 (9 pieces), or 5x5 (25 pieces)
}

type PuzzlePiece = {
  id: number
  correctPosition: number // The position this piece should be in when solved
  currentPosition: number // The current position in the grid
  imageData: string // Base64 or URL for the piece
}

export default function SlidingPuzzleGame({
  onWin,
  onClose,
  checkpointId,
  mapId,
  imageUrl,
  puzzleSize = 3
}: SlidingPuzzleGameProps) {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [emptyPosition, setEmptyPosition] = useState<number>(puzzleSize * puzzleSize - 1)
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  // Audio refs for sound effects
  const swooshSoundRef = useRef<HTMLAudioElement | null>(null)
  const winSoundRef = useRef<HTMLAudioElement | null>(null)

  // Default image if none provided
  const defaultImage = imageUrl || "/slidingPuzzle/duckling.png"

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
    for (let i = 0; i < totalPieces - 1; i++) {
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

    // Shuffle the pieces (but keep track of solvability)
    const shuffled = shufflePuzzle(newPieces, totalPieces - 1)
    
    // Validate: ensure no two pieces have the same position
    const positions = new Set(shuffled.map(p => p.currentPosition))
    if (positions.size !== shuffled.length) {
      // If there's a conflict, reset to initial positions
      const resetPieces = newPieces.map((p, idx) => ({ ...p, currentPosition: idx }))
      setPieces(resetPieces)
      setEmptyPosition(totalPieces - 1)
    } else {
      setPieces(shuffled)
      setEmptyPosition(totalPieces - 1)
    }
    
    setMoves(0)
    setGameWon(false)
  }

  // Shuffle puzzle ensuring it's solvable
  const shufflePuzzle = (pieces: PuzzlePiece[], emptyPos: number): PuzzlePiece[] => {
    const shuffled = pieces.map(p => ({ ...p })) // Deep copy
    const totalPieces = puzzleSize * puzzleSize
    
    // Perform random valid moves to shuffle
    const shuffleMoves = 100 + Math.floor(Math.random() * 100)
    let currentEmpty = emptyPos

    for (let i = 0; i < shuffleMoves; i++) {
      const validMoves = getValidMoves(currentEmpty)
      if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
        const pieceToMove = shuffled.find(p => p.currentPosition === randomMove)
        
        if (pieceToMove) {
          // Verify the move is valid: the target position should be empty
          const isTargetEmpty = !shuffled.some(p => 
            p.id !== pieceToMove.id && p.currentPosition === currentEmpty
          )
          
          if (isTargetEmpty) {
            pieceToMove.currentPosition = currentEmpty
            currentEmpty = randomMove
          }
        }
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

  const getValidMoves = (emptyPos: number): number[] => {
    const row = Math.floor(emptyPos / puzzleSize)
    const col = emptyPos % puzzleSize
    const moves: number[] = []

    // Check all four directions
    if (row > 0) moves.push(emptyPos - puzzleSize) // Up
    if (row < puzzleSize - 1) moves.push(emptyPos + puzzleSize) // Down
    if (col > 0) moves.push(emptyPos - 1) // Left
    if (col < puzzleSize - 1) moves.push(emptyPos + 1) // Right

    return moves
  }

  const handlePieceClick = (piece: PuzzlePiece) => {
    if (gameWon) return

    // Find the ACTUAL empty position by checking which position has no piece
    const allPositions = Array.from({ length: puzzleSize * puzzleSize }, (_, i) => i)
    const actualEmptyPosition = allPositions.find(pos => 
      !pieces.some(p => p.currentPosition === pos)
    )
    
    // Use the actual empty position, not the state
    const realEmptyPos = actualEmptyPosition !== undefined ? actualEmptyPosition : emptyPosition

    // Check if this piece is adjacent to the empty space
    const pieceRow = Math.floor(piece.currentPosition / puzzleSize)
    const pieceCol = piece.currentPosition % puzzleSize
    const emptyRow = Math.floor(realEmptyPos / puzzleSize)
    const emptyCol = realEmptyPos % puzzleSize

    // Check if piece is directly adjacent (not diagonal)
    const isAdjacent = 
      (Math.abs(pieceRow - emptyRow) === 1 && pieceCol === emptyCol) || // Up or Down
      (Math.abs(pieceCol - emptyCol) === 1 && pieceRow === emptyRow)    // Left or Right

    // Verify that the empty position is actually empty (no piece occupies it)
    const piecesAtEmpty = pieces.filter(p => p.currentPosition === realEmptyPos)
    const isPositionEmpty = piecesAtEmpty.length === 0

    if (isAdjacent && isPositionEmpty) {
      // Verify no other piece currently occupies the empty position
      const positionOccupied = pieces.some(p => 
        p.id !== piece.id && p.currentPosition === realEmptyPos
      )

      if (!positionOccupied) {
        // Move the piece to empty position
        const updatedPieces = pieces.map(p => {
          if (p.id === piece.id) {
            return { ...p, currentPosition: realEmptyPos }
          }
          return p
        })

        // Final validation: ensure no two pieces have the same position after move
        const positions = updatedPieces.map(p => p.currentPosition)
        const uniquePositions = new Set(positions)
        
        // All positions must be unique (no overlaps)
        if (uniquePositions.size === updatedPieces.length) {
          // Play swoosh sound when piece moves
          playSound(swooshSoundRef)
          
          setPieces(updatedPieces)
          setEmptyPosition(piece.currentPosition)
          setMoves(prev => prev + 1)

          // Check if puzzle is solved
          setTimeout(() => {
            checkWinCondition(updatedPieces)
          }, 100)
        }
      }
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
      const gemsAwarded = puzzleSize === 2 ? 3 : puzzleSize === 3 ? 5 : 8
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

  const isPieceMovable = (piece: PuzzlePiece): boolean => {
    const pieceRow = Math.floor(piece.currentPosition / puzzleSize)
    const pieceCol = piece.currentPosition % puzzleSize
    const emptyRow = Math.floor(emptyPosition / puzzleSize)
    const emptyCol = emptyPosition % puzzleSize

    // Check if piece is directly adjacent (not diagonal)
    return (
      (Math.abs(pieceRow - emptyRow) === 1 && pieceCol === emptyCol) || // Up or Down
      (Math.abs(pieceCol - emptyCol) === 1 && pieceRow === emptyRow)    // Left or Right
    )
  }

  const getPieceStyle = (piece: PuzzlePiece) => {
    const row = Math.floor(piece.currentPosition / puzzleSize)
    const col = piece.currentPosition % puzzleSize
    const percentage = 100 / puzzleSize
    const canMove = isPieceMovable(piece)

    // Ensure position is within valid bounds
    const validRow = Math.max(0, Math.min(row, puzzleSize - 1))
    const validCol = Math.max(0, Math.min(col, puzzleSize - 1))

    return {
      position: "absolute" as const,
      left: `${validCol * percentage}%`,
      top: `${validRow * percentage}%`,
      width: `${percentage}%`,
      height: `${percentage}%`,
      cursor: canMove ? "pointer" : "default",
      transition: "all 0.2s ease-in-out",
      zIndex: canMove ? 10 : 1
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
                Sliding Puzzle
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
                  <h3 className="text-2xl font-bold">🎉 Puzzle Solved! 🎉</h3>
                </div>
                <p className="text-lg font-bold mb-4">
                  You earned <span className="text-2xl inline-flex items-center gap-1">
                    <Image src="/images/worm.png" alt="Worm" width={32} height={32} className="object-contain" />
                    {puzzleSize === 2 ? 3 : puzzleSize === 3 ? 5 : 8} Worms
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
                  {/* Render pieces in order, ensuring movable ones are on top */}
                  {pieces.map((piece) => {
                    const canMove = isPieceMovable(piece)
                    return (
                      <div
                        key={piece.id}
                    onClick={() => handlePieceClick(piece)}
                        style={getPieceStyle(piece)}
                        className={`border border-black/30 ${canMove ? 'hover:opacity-90 cursor-pointer' : 'cursor-default opacity-90'}`}
                      >
                        <img
                          src={piece.imageData}
                          alt={`Piece ${piece.id + 1}`}
                          className="w-full h-full object-cover pointer-events-none select-none"
                          draggable={false}
                        />
                      </div>
                    )
                  })}
                  {/* Empty space indicator */}
                  <div
                    style={{
                      position: "absolute",
                      left: `${(emptyPosition % puzzleSize) * (100 / puzzleSize)}%`,
                      top: `${Math.floor(emptyPosition / puzzleSize) * (100 / puzzleSize)}%`,
                      width: `${100 / puzzleSize}%`,
                      height: `${100 / puzzleSize}%`,
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                      border: "2px dashed rgba(255, 255, 255, 0.3)",
                      pointerEvents: "none",
                      zIndex: 0
                    }}
                  />
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
                <li>Click on any piece adjacent to the empty space to slide it</li>
                <li>Pieces can only move into the empty space</li>
                <li>Continue sliding pieces until the image is complete</li>
                <li>Try to solve it in as few moves as possible!</li>
                <li>Difficulty: {puzzleSize === 2 ? "Easy (4 pieces)" : puzzleSize === 3 ? "Medium (9 pieces)" : "Hard (25 pieces)"}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
