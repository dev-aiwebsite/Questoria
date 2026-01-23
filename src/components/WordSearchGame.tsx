"use client"

import { useState, useRef, useEffect } from "react"
import { X, Trophy } from "lucide-react"
import Image from "next/image"

interface WordSearchGameProps {
  onWin: (gems: number) => void
  onClose: () => void
  checkpointId: string
  mapId: string
  gridSize?: number // User controls this, default to 12
  customWords?: string[] // Optional custom word list for this checkpoint
}

// Nature-related words that can be used (fallback)
const NATURE_WORDS = [
  'PLANT', 'TREE', 'FLOWER', 'LEAF', 'ROOT', 'STEM', 'BARK', 'BRANCH',
  'GARDEN', 'FOREST', 'MEADOW', 'PARK', 'NATURE', 'WILDLIFE', 'BIRD', 'BEE',
  'BUTTERFLY', 'INSECT', 'SOIL', 'WATER', 'SUN', 'RAIN', 'WIND', 'CLOUD',
  'SEED', 'SPROUT', 'BLOOM', 'PETAL', 'POLLEN', 'NECTAR', 'HABITAT', 'ECOSYSTEM'
]

// Checkpoint-specific word lists (only for Word Search checkpoints)
// Words longer than 7 characters are excluded for 7x7 grid compatibility
const CHECKPOINT_WORDS: Record<string, string[]> = {
  // cp_003 - Box Garden: BOX(3✅), EUCALYPT(8❌), GRAMPIANS(9❌), UNDERSTOREY(11❌), WILDFLOWER(10❌), CANOPY(6✅), ROCKY(5✅), SHRUB(5✅)
  'cp_003': ['BOX', 'CANOPY', 'ROCKY', 'SHRUB'],
  
  // cp_005 - Forest Garden: FOREST(6✅), WOODLAND(8❌), EUCALYPT(8❌), CANOPY(6✅), SHADE(5✅), HABITAT(7✅)
  'cp_005': ['FOREST', 'CANOPY', 'SHADE', 'HABITAT'],
  
  // cp_007 - Desert Discovery Camp: DESERT(6✅), SAND(4✅), ROCK(4✅), SUN(3✅), HEAT(4✅), PLANT(5✅), SEED(4✅), LEAF(4✅), BUG(3✅), LIZARD(6✅), TOUGH(5✅), SURVIVE(7✅)
  'cp_007': ['DESERT', 'SAND', 'ROCK', 'SUN', 'HEAT', 'PLANT', 'SEED', 'LEAF', 'BUG', 'LIZARD', 'TOUGH', 'SURVIVE'],
  
  // cp_008 - Ian Potter Lakeside Precinct Lawn: LAKE(4✅), WATER(5✅), REFLECTION(10❌), LILYPAD(7✅), GRASS(5✅), SHORE(5✅), SKY(3✅), CLOUD(5✅), BREEZE(6✅), DUCK(4✅), PELICAN(7✅), PICNIC(6✅)
  'cp_008': ['LAKE', 'WATER', 'LILYPAD', 'GRASS', 'SHORE', 'SKY', 'CLOUD', 'BREEZE', 'DUCK', 'PELICAN', 'PICNIC'],
  
  // cp_010 - Serpentine Path: SERPENTINE(10❌), CURVE(5✅), PATH(4✅), WINDING(7✅), ARID(4✅), SAND(4✅), STONE(5✅), JOURNEY(7✅), FLOW(4✅), LINE(4✅), TRACK(5✅), TURN(4✅)
  'cp_010': ['CURVE', 'PATH', 'WINDING', 'ARID', 'SAND', 'STONE', 'JOURNEY', 'FLOW', 'LINE', 'TRACK', 'TURN'],
  
  // cp_013 - Future Garden: FUTURE(6✅), GROWTH(6✅), HEIGHT(6✅), SCALE(5✅), PLANNING(8❌), PATIENCE(8❌), AUSTRALIAN(9❌)
  'cp_013': ['FUTURE', 'GROWTH', 'HEIGHT', 'SCALE'],
}

export default function WordSearchGame({
  onWin,
  onClose,
  checkpointId,
  mapId,
  gridSize: initialGridSize = 8,
  customWords
}: WordSearchGameProps) {
  const [currentGridSize, setCurrentGridSize] = useState(initialGridSize)
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [grid, setGrid] = useState<string[][]>([])
  const [words, setWords] = useState<string[]>([])
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set())
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())
  const [isSelecting, setIsSelecting] = useState(false)
  const [startCell, setStartCell] = useState<{ row: number; col: number } | null>(null)
  const [moves, setMoves] = useState(0)
  const [wordCellMap, setWordCellMap] = useState<Map<string, Set<string>>>(new Map())
  const [foundWordCells, setFoundWordCells] = useState<Set<string>>(new Set())
  const [lastActionTime, setLastActionTime] = useState<number>(Date.now())
  const [bouncingCells, setBouncingCells] = useState<Set<string>>(new Set())
  const gridRef = useRef<HTMLDivElement>(null)
  const hintTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hintStopTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Generate word search grid
  useEffect(() => {
    generateGrid()
  }, [currentGridSize])

  // Initialize CSS for bounce animation
  useEffect(() => {
    if (!document.getElementById('word-search-bounce-styles')) {
      const style = document.createElement('style')
      style.id = 'word-search-bounce-styles'
      style.textContent = `
        @keyframes wordSearchBounce {
          0%, 100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-8px);
          }
          50% {
            transform: translateY(0);
          }
          75% {
            transform: translateY(-4px);
          }
        }
        .word-search-bounce {
          animation: wordSearchBounce 0.6s ease-in-out infinite;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  // Hint timer: bounce letters of one random remaining word after 10 seconds of inactivity
  // Continues showing hints every 10 seconds if user hasn't interacted
  useEffect(() => {
    // Clear existing timers
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current)
      hintTimerRef.current = null
    }
    if (hintStopTimerRef.current) {
      clearTimeout(hintStopTimerRef.current)
      hintStopTimerRef.current = null
    }
    
    // Stop any current bouncing when user interacts
    setBouncingCells(new Set())

    // Don't show hints if game is won
    if (foundWords.size === words.length || words.length === 0) {
      return
    }

    // Function to show a hint
    const showHint = () => {
      // Get all remaining (not found) words - double check they're not found
      const remainingWords = words.filter(word => !foundWords.has(word))
      
      if (remainingWords.length === 0) {
        setBouncingCells(new Set())
        return
      }

      // Pick one random remaining word
      const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)]
      const wordCells = wordCellMap.get(randomWord)
      
      // Double check this word is still not found
      if (wordCells && !foundWords.has(randomWord)) {
        setBouncingCells(new Set(wordCells))

        // Stop bouncing after 3 seconds, then wait 10 seconds for next hint
        hintStopTimerRef.current = setTimeout(() => {
          setBouncingCells(new Set())
          
          // Check if user still hasn't interacted and game isn't won
          // Also verify there are still remaining words
          const stillRemainingWords = words.filter(word => !foundWords.has(word))
          if (stillRemainingWords.length > 0) {
            hintTimerRef.current = setTimeout(() => {
              showHint()
            }, 10000)
          }
        }, 3000)
      }
    }

    // Set up initial timer to show first hint after 10 seconds
    hintTimerRef.current = setTimeout(() => {
      showHint()
    }, 10000)

    return () => {
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current)
        hintTimerRef.current = null
      }
      if (hintStopTimerRef.current) {
        clearTimeout(hintStopTimerRef.current)
        hintStopTimerRef.current = null
      }
    }
  }, [lastActionTime, foundWords, words, wordCellMap])

  // Function to update last action time (resets the hint timer)
  const updateLastActionTime = () => {
    setLastActionTime(Date.now())
    setBouncingCells(new Set()) // Stop bouncing when user interacts
  }

  const generateGrid = () => {
    // Use custom words if provided, otherwise use checkpoint-specific words, otherwise fallback to nature words
    let wordPool: string[] = []
    if (customWords && customWords.length > 0) {
      wordPool = customWords
    } else if (CHECKPOINT_WORDS[checkpointId]) {
      wordPool = CHECKPOINT_WORDS[checkpointId]
    } else {
      wordPool = NATURE_WORDS
    }
    
    // Filter words to fit in grid (max length = gridSize)
    const maxLength = currentGridSize
    const filteredWords = wordPool
      .map(w => w.toUpperCase())
      .filter(w => w.length <= maxLength)
    
    // Select words (up to gridSize * 0.8, but at least 3)
    const selectedWords = [...filteredWords]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.max(3, Math.min(filteredWords.length, Math.floor(currentGridSize * 0.8))))

    setWords(selectedWords)
    setFoundWords(new Set())
    setSelectedCells(new Set())
    setFoundWordCells(new Set())
    setMoves(0)

    // Create empty grid
    const newGrid: string[][] = Array(currentGridSize)
      .fill(null)
      .map(() => Array(currentGridSize).fill(''))

    // Place words in grid
    const placedWords: string[] = []
    const newWordCellMap = new Map<string, Set<string>>()
    
    for (const word of selectedWords) {
      let placed = false
      let attempts = 0
      
      while (!placed && attempts < 100) {
        attempts++
        
        // Random direction: 0=horizontal, 1=vertical, 2=diagonal down-right, 3=diagonal down-left
        const direction = Math.floor(Math.random() * 4)
        // Random reverse: 50% chance
        const reverse = Math.random() > 0.5
        const wordToPlace = reverse ? word.split('').reverse().join('') : word
        
        // Random starting position
        let row = Math.floor(Math.random() * currentGridSize)
        let col = Math.floor(Math.random() * currentGridSize)
        
        // Check if word fits
        let fits = true
        const cells: { row: number; col: number }[] = []
        
        for (let i = 0; i < wordToPlace.length; i++) {
          let checkRow = row
          let checkCol = col
          
          if (direction === 0) {
            // Horizontal
            checkCol = col + i
          } else if (direction === 1) {
            // Vertical
            checkRow = row + i
          } else if (direction === 2) {
            // Diagonal down-right
            checkRow = row + i
            checkCol = col + i
          } else {
            // Diagonal down-left
            checkRow = row + i
            checkCol = col - i
          }
          
          if (checkRow < 0 || checkRow >= currentGridSize || checkCol < 0 || checkCol >= currentGridSize) {
            fits = false
            break
          }
          
          // Check if cell is already occupied by another word
          if (newGrid[checkRow][checkCol] !== '' && newGrid[checkRow][checkCol] !== wordToPlace[i]) {
            fits = false
            break
          }
          
          cells.push({ row: checkRow, col: checkCol })
        }
        
        if (fits) {
          // Place the word
          const wordCells = new Set<string>()
          for (let i = 0; i < wordToPlace.length; i++) {
            newGrid[cells[i].row][cells[i].col] = wordToPlace[i]
            wordCells.add(`${cells[i].row}-${cells[i].col}`)
          }
          newWordCellMap.set(word, wordCells)
          placedWords.push(word)
          placed = true
        }
      }
    }
    
    // Fill remaining cells with random letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (let row = 0; row < currentGridSize; row++) {
      for (let col = 0; col < currentGridSize; col++) {
        if (newGrid[row][col] === '') {
          newGrid[row][col] = letters[Math.floor(Math.random() * letters.length)]
        }
      }
    }
    
    setGrid(newGrid)
    setWords(placedWords)
    setWordCellMap(newWordCellMap)
  }

  const getCellKey = (row: number, col: number) => `${row}-${col}`

  const handleMouseDown = (row: number, col: number) => {
    updateLastActionTime()
    setIsSelecting(true)
    setStartCell({ row, col })
    setSelectedCells(new Set([getCellKey(row, col)]))
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !startCell) return
    
    updateLastActionTime()
    const cells = getCellsBetween(startCell, { row, col })
    setSelectedCells(new Set(cells.map(c => getCellKey(c.row, c.col))))
  }

  const handleMouseUp = () => {
    if (!isSelecting) return
    
    updateLastActionTime()
    setIsSelecting(false)
    checkSelectedWord()
    setStartCell(null)
  }

  const getCellsBetween = (
    start: { row: number; col: number },
    end: { row: number; col: number }
  ): { row: number; col: number }[] => {
    const cells: { row: number; col: number }[] = []
    const rowDiff = end.row - start.row
    const colDiff = end.col - start.col
    
    // Determine direction
    let rowStep = 0
    let colStep = 0
    
    if (rowDiff === 0) {
      // Horizontal
      colStep = colDiff > 0 ? 1 : -1
    } else if (colDiff === 0) {
      // Vertical
      rowStep = rowDiff > 0 ? 1 : -1
    } else if (Math.abs(rowDiff) === Math.abs(colDiff)) {
      // Diagonal
      rowStep = rowDiff > 0 ? 1 : -1
      colStep = colDiff > 0 ? 1 : -1
    } else {
      // Not a valid line, return empty
      return []
    }
    
    const length = Math.max(Math.abs(rowDiff), Math.abs(colDiff)) + 1
    
    for (let i = 0; i < length; i++) {
      cells.push({
        row: start.row + rowStep * i,
        col: start.col + colStep * i
      })
    }
    
    return cells
  }

  const checkSelectedWord = () => {
    if (selectedCells.size < 3) {
      setSelectedCells(new Set())
      return
    }
    
    // Get selected letters
    const selectedArray = Array.from(selectedCells)
      .map(key => {
        const [row, col] = key.split('-').map(Number)
        return { row, col, letter: grid[row][col] }
      })
      .sort((a, b) => {
        if (a.row !== b.row) return a.row - b.row
        return a.col - b.col
      })
    
    const word = selectedArray.map(c => c.letter).join('')
    const reversedWord = word.split('').reverse().join('')
    
    // Check if word matches any of the hidden words
    for (const hiddenWord of words) {
      if (word === hiddenWord || reversedWord === hiddenWord) {
        if (!foundWords.has(hiddenWord)) {
          updateLastActionTime() // Reset timer when word is found
          const newFoundWords = new Set([...foundWords, hiddenWord])
          setFoundWords(newFoundWords)
          
          // Add all cells of this word to foundWordCells
          const wordCells = wordCellMap.get(hiddenWord)
          if (wordCells) {
            setFoundWordCells(prev => new Set([...prev, ...wordCells]))
          }
          
          setMoves(m => m + 1)
          
          // Check if all words are found
          if (newFoundWords.size === words.length) {
            // All words found! Award gems
            const gemsAwarded = 1 // Always award 1 worm
            setTimeout(() => {
              onWin(gemsAwarded)
            }, 500)
          }
        }
        setSelectedCells(new Set())
        return
      }
    }
    
    // Word not found, clear selection
    setSelectedCells(new Set())
  }

  const handleTouchStart = (e: React.TouchEvent, row: number, col: number) => {
    e.preventDefault()
    updateLastActionTime()
    handleMouseDown(row, col)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    if (!isSelecting || !gridRef.current) return
    
    updateLastActionTime()
    const touch = e.touches[0]
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    if (!element) return
    
    const cell = element.closest('[data-cell]')
    if (!cell) return
    
    const row = parseInt(cell.getAttribute('data-row') || '0')
    const col = parseInt(cell.getAttribute('data-col') || '0')
    handleMouseEnter(row, col)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    handleMouseUp()
  }

  const resetGame = () => {
    updateLastActionTime()
    generateGrid()
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
              <h3 className="text-center !mb-6 font-serif font-bold !text-4xl">
                Nature Word Search
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
            {foundWords.size === words.length && words.length > 0 && (
              <div className="bg-white border-2 border-black p-4 mb-4 text-center" style={{ borderRadius: '23px' }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="fill-black" size={32} />
                  <h3 className="text-2xl font-bold">Congratulations! You Won!</h3>
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

            {/* Game Board Container */}
            <div className="bg-white border-2 border-black p-4 mb-4" style={{ borderRadius: '23px' }}>
              {/* Word Search Grid */}
              <div 
                ref={gridRef}
                className="grid gap-1 select-none"
                style={{ 
                  gridTemplateColumns: `repeat(${currentGridSize}, minmax(0, 1fr))`,
                  touchAction: 'none'
                }}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {grid.map((row, rowIndex) =>
                  row.map((letter, colIndex) => {
                    const cellKey = getCellKey(rowIndex, colIndex)
                    const isSelected = selectedCells.has(cellKey)
                    const isFound = foundWordCells.has(cellKey)
                    const isBouncing = bouncingCells.has(cellKey)
                    
                    return (
                      <div
                        key={cellKey}
                        data-cell
                        data-row={rowIndex}
                        data-col={colIndex}
                        className={`
                          aspect-square flex items-center justify-center
                          border-2 border-gray-300
                          font-bold text-lg
                          cursor-pointer
                          transition-colors
                          ${isSelected ? 'bg-yellow-300 border-yellow-500' : ''}
                          ${isFound ? 'bg-green-200' : 'bg-white hover:bg-gray-100'}
                          ${isBouncing ? 'word-search-bounce' : ''}
                        `}
                        style={{ borderRadius: '23px' }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          handleMouseDown(rowIndex, colIndex)
                        }}
                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                        onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                      >
                        {letter}
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Words to Find Container */}
            <div className="bg-white border-2 border-black p-4 mb-4" style={{ borderRadius: '23px' }}>
              <h3 className="font-bold mb-2">Words to find:</h3>
              <div className="flex flex-wrap gap-2">
                {words.map((word) => (
                  <span
                    key={word}
                    className={`
                      px-3 py-1 border-2
                      ${foundWords.has(word) 
                        ? 'bg-green-200 border-green-500 line-through' 
                        : 'bg-gray-100 border-gray-300'
                      }
                    `}
                    style={{ borderRadius: '5px' }}
                  >
                    {word}
                  </span>
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
                <li>Click and drag (or tap and swipe) to select letters and form words</li>
                <li>Words can be horizontal, vertical, diagonal, or backwards</li>
                <li>Find all the hidden words to win and earn worms</li>
                <li>Selected words will turn green when found</li>
                <li>Use the word list at the bottom to track your progress</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
