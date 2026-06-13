import { useCallback, useState } from 'react'
import { useGameClock } from '../../hooks/useGameClock'
import { shuffle } from '../../utils/shuffle'

const GRID_SIZE = 5
const BLACK_COUNT = 13 // 1–13, идут вверх
const RED_COUNT = 12   // 1–12, идут вниз (12→1)

function createCells() {
  return shuffle([
    ...Array.from({ length: BLACK_COUNT }, (_, i) => ({ number: i + 1, color: 'black' })),
    ...Array.from({ length: RED_COUNT }, (_, i) => ({ number: i + 1, color: 'red' })),
  ])
}

export function useGorbova() {
  const {
    status,
    elapsedMs,
    bestMs,
    start: startClock,
    reset: resetClock,
    finish,
  } = useGameClock('gorbova-best-time-5x5')

  const [cells, setCells] = useState(createCells)
  const [turn, setTurn] = useState('black') // чья очередь
  const [nextBlack, setNextBlack] = useState(1)
  const [nextRed, setNextRed] = useState(RED_COUNT)

  const start = useCallback(() => {
    setCells(createCells())
    setTurn('black')
    setNextBlack(1)
    setNextRed(RED_COUNT)
    startClock()
  }, [startClock])

  const reset = useCallback(() => {
    setCells(createCells())
    setTurn('black')
    setNextBlack(1)
    setNextRed(RED_COUNT)
    resetClock()
  }, [resetClock])

  // Возвращает true при верном клике
  const clickCell = useCallback(
    (number, color) => {
      if (status !== 'playing') return false
      if (color !== turn) return false
      if (color === 'black' && number !== nextBlack) return false
      if (color === 'red' && number !== nextRed) return false

      // Последний клик — чёрная 13 (все красные уже кончились)
      if (color === 'black' && number === BLACK_COUNT) {
        finish()
        return true
      }

      if (color === 'black') {
        setNextBlack((n) => n + 1)
        setTurn('red')
      } else {
        setNextRed((n) => n - 1)
        setTurn('black')
      }
      return true
    },
    [status, finish, turn, nextBlack, nextRed],
  )

  // Ячейка «найдена» — становится серой
  const isCellDone = useCallback(
    ({ number, color }) => {
      if (status === 'idle') return false
      if (color === 'black') return number < nextBlack
      if (color === 'red') return number > nextRed
      return false
    },
    [status, nextBlack, nextRed],
  )

  return {
    gridSize: GRID_SIZE,
    status,
    elapsedMs,
    bestMs,
    cells,
    turn,
    nextBlack,
    nextRed,
    start,
    reset,
    clickCell,
    isCellDone,
  }
}
