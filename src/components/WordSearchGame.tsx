"use client"

import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"

interface WordSearchGameProps {
  onWin: (gems: number) => void
  onClose: () => void
  checkpointId: string
  mapId: string
  gridSize?: number // User controls this, default to 12
}

// Nature-related words that can be used
const NATURE_WORDS = [
  'PLANT', 'TREE', 'FLOWER', 'LEAF', 'ROOT', 'STEM', 'BARK', 'BRANCH',
  'GARDEN', 'FOREST', 'MEADOW', 'PARK', 'NATURE', 'WILDLIFE', 'BIRD', 'BEE',
  'BUTTERFLY', 'INSECT', 'SOIL', 'WATER', 'SUN', 'RAIN', 'WIND', 'CLOUD',
  'SEED', 'SPROUT', 'BLOOM', 'PETAL', 'POLLEN', 'NECTAR', 'HABITAT', 'ECOSYSTEM'
]

export default function WordSearchGame({
  onWin,
  onClose,
  checkpointId,
  mapId,
  gridSize: initialGridSize = 8
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
  const gridRef = useRef<HTMLDivElement>(null)

  // Generate word search grid
  useEffect(() => {
    generateGrid()
  }, [currentGridSize])

  const generateGrid = () => {
    // Select 8-10 random nature words
    const selectedWords = [...NATURE_WORDS]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(10, Math.floor(currentGridSize * 0.8)))
      .map(w => w.toUpperCase())

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
    setIsSelecting(true)
    setStartCell({ row, col })
    setSelectedCells(new Set([getCellKey(row, col)]))
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !startCell) return
    
    const cells = getCellsBetween(startCell, { row, col })
    setSelectedCells(new Set(cells.map(c => getCellKey(c.row, c.col))))
  }

  const handleMouseUp = () => {
    if (!isSelecting) return
    
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
            const gemsAwarded = Math.max(5, words.length)
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
    handleMouseDown(row, col)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    if (!isSelecting || !gridRef.current) return
    
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
    generateGrid()
  }

  return (
    <div className="fixed inset-0 z-[999999] bg-black/80 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-xl border-3 border-black p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        data-game-modal
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Nature Word Search</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>


        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm">
            <p>Find {words.length} hidden words</p>
            <p>Found: {foundWords.size} / {words.length}</p>
            <p>Moves: {moves}</p>
          </div>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reset Game
          </button>
        </div>

        <div 
          ref={gridRef}
          className="grid gap-1 mb-4 select-none"
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
              
              return (
                <div
                  key={cellKey}
                  data-cell
                  data-row={rowIndex}
                  data-col={colIndex}
                  className={`
                    aspect-square flex items-center justify-center
                    border-2 border-gray-300 rounded
                    font-bold text-lg
                    cursor-pointer
                    transition-colors
                    ${isSelected ? 'bg-yellow-300 border-yellow-500' : ''}
                    ${isFound ? 'bg-green-200' : 'bg-white hover:bg-gray-100'}
                  `}
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

        <div className="mb-4">
          <h3 className="font-bold mb-2">Words to find:</h3>
          <div className="flex flex-wrap gap-2">
            {words.map((word) => (
              <span
                key={word}
                className={`
                  px-3 py-1 rounded-lg border-2
                  ${foundWords.has(word) 
                    ? 'bg-green-200 border-green-500 line-through' 
                    : 'bg-gray-100 border-gray-300'
                  }
                `}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {foundWords.size === words.length && (
          <div className="text-center p-4 bg-green-100 rounded-lg border-2 border-green-500">
            <p className="text-xl font-bold text-green-700 mb-2">Congratulations!</p>
            <p className="text-green-600">You found all the words!</p>
          </div>
        )}

        {/* Footer: How to play */}
        <div className="mt-4 pt-4 border-t-2 border-gray-300 text-center">
          <button
            onClick={() => setShowHowToPlay(true)}
            className="text-gray-700 font-semibold hover:text-gray-900 transition-colors cursor-pointer"
          >
            How to play?
          </button>
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
                <li>Click and drag (or tap and swipe) to select letters and form words</li>
                <li>Words can be horizontal, vertical, diagonal, or backwards</li>
                <li>Find all the hidden words to win and earn gems</li>
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
