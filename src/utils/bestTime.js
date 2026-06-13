// Хранение лучшего времени в localStorage по ключу режима

export function readBestTime(key) {
  const stored = Number(localStorage.getItem(key))
  return stored > 0 ? stored : null
}

export function saveBestTime(key, ms) {
  localStorage.setItem(key, String(ms))
}
