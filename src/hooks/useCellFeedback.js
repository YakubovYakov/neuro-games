import { useCallback, useEffect, useRef, useState } from 'react'

const FLASH_DURATION_MS = 300
const SHAKE_DURATION_MS = 350

// Визуальный отклик на клик: зелёная вспышка (верно) и тряска (мимо).
// Ячейка адресуется строковым ключом, общим для всех игр.
export function useCellFeedback() {
  const [flashedKey, setFlashedKey] = useState(null)
  const [shakedKey, setShakedKey] = useState(null)
  const flashRef = useRef(null)
  const shakeRef = useRef(null)

  useEffect(() => () => {
    clearTimeout(flashRef.current)
    clearTimeout(shakeRef.current)
  }, [])

  const flash = useCallback((key) => {
    clearTimeout(flashRef.current)
    setFlashedKey(key)
    flashRef.current = setTimeout(() => setFlashedKey(null), FLASH_DURATION_MS)
  }, [])

  const shake = useCallback((key) => {
    clearTimeout(shakeRef.current)
    setShakedKey(key)
    shakeRef.current = setTimeout(() => setShakedKey(null), SHAKE_DURATION_MS)
  }, [])

  return { flashedKey, shakedKey, flash, shake }
}
