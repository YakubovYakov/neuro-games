import { useCallback, useState } from 'react'
import { useGameClock } from '../../hooks/useGameClock'
import { shuffle } from '../../utils/shuffle'

const GRID_SIZE = 5
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE
const CELL_COLORS = ['red', 'yellow', 'green', 'blue']

// Числа в случайном порядке + случайный цвет каждому (нужен только в цветном режиме)
function createCells() {
  const numbers = shuffle(Array.from({ length: TOTAL_CELLS }, (_, i) => i + 1))
  return numbers.map((number) => ({
    number,
    color: CELL_COLORS[Math.floor(Math.random() * CELL_COLORS.length)],
  }))
}

export function useSchulte(tableStyle) {
  const {
    status,
    elapsedMs,
    bestMs,
    start: startClock,
    reset: resetClock,
    finish,
  } = useGameClock(`schulte-best-time-5x5-${tableStyle}`)

  const [cells, setCells] = useState(createCells)
  const [nextNumber, setNextNumber] = useState(1)

  const start = useCallback(() => {
    setCells(createCells())
    setNextNumber(1)
    startClock()
  }, [startClock])

  const reset = useCallback(() => {
    setCells(createCells())
    setNextNumber(1)
    resetClock()
  }, [resetClock])

  const clickCell = useCallback(
    (number) => {
      if (status !== 'playing' || number !== nextNumber) return false

      if (number === TOTAL_CELLS) finish()
      else setNextNumber(number + 1)
      return true
    },
    [status, finish, nextNumber],
  )

  return {
    gridSize: GRID_SIZE,
    status,
    elapsedMs,
    bestMs,
    cells,
    nextNumber,
    start,
    reset,
    clickCell,
  }
}
