import { useCallback, useEffect, useRef, useState } from 'react'
import { readBestTime, saveBestTime } from '../utils/bestTime'

const TICK_MS = 250

// Общий «движок» игры: статус, таймер и лучшее время.
// Каждая игра поверх него хранит только своё игровое состояние.
export function useGameClock(bestTimeKey) {
  const [status, setStatus] = useState('idle') // idle | playing | finished
  const [elapsedMs, setElapsedMs] = useState(0)
  const [bestMs, setBestMs] = useState(() => readBestTime(bestTimeKey))
  const [trackedKey, setTrackedKey] = useState(bestTimeKey)
  const startTimeRef = useRef(null)

  // Ключ зависит от режима (напр. стиль таблицы) — перечитываем рекорд при смене.
  // Корректировка во время рендера, без эффекта и каскадных перерисовок.
  if (trackedKey !== bestTimeKey) {
    setTrackedKey(bestTimeKey)
    setBestMs(readBestTime(bestTimeKey))
  }

  useEffect(() => {
    if (status !== 'playing') return
    const id = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current)
    }, TICK_MS)
    return () => clearInterval(id)
  }, [status])

  const start = useCallback(() => {
    setElapsedMs(0)
    startTimeRef.current = Date.now()
    setStatus('playing')
  }, [])

  const reset = useCallback(() => {
    setElapsedMs(0)
    setStatus('idle')
  }, [])

  const finish = useCallback(() => {
    const finalMs = Date.now() - startTimeRef.current
    setElapsedMs(finalMs)
    setStatus('finished')
    setBestMs((prev) => {
      if (prev !== null && prev <= finalMs) return prev
      saveBestTime(bestTimeKey, finalMs)
      return finalMs
    })
  }, [bestTimeKey])

  return { status, elapsedMs, bestMs, start, reset, finish }
}
