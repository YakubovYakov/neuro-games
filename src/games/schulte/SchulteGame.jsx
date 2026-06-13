import { useEffect } from 'react'
import { useSchulte } from './useSchulte'
import { useCellFeedback } from '../../hooks/useCellFeedback'
import { formatTime } from '../../utils/formatTime'
import Modal from '../../components/Modal'
import './schulte.css'

function SchulteGame({ active, tableStyle, onOpenSettings }) {
  const {
    gridSize,
    status,
    cells,
    nextNumber,
    elapsedMs,
    bestMs,
    start,
    reset,
    clickCell,
  } = useSchulte(tableStyle)

  const { flashedKey, shakedKey, flash, shake } = useCellFeedback()

  // После закрытия настроек игра стартует сама
  useEffect(() => {
    if (active && status === 'idle') start()
  }, [active, status, start])

  const handleCellClick = (number) => {
    if (status !== 'playing') return
    const key = String(number)
    if (clickCell(number)) flash(key)
    else shake(key)
  }

  const handleOpenSettings = () => {
    reset()
    onOpenSettings()
  }

  return (
    <div className="game">
      {bestMs !== null && status !== 'playing' && (
        <div className="game__best-badge">Лучшее время: {formatTime(bestMs)}</div>
      )}

      <div
        className="game__grid"
        style={{ '--grid-size': gridSize }}
        role="grid"
        aria-label="Таблица Шульте"
      >
        {cells.map(({ number, color }) => {
          const key = String(number)
          return (
            <button
              key={number}
              type="button"
              className={[
                'game__cell',
                tableStyle === 'color' ? `schulte__cell--${color}` : '',
                key === flashedKey ? 'game__cell--flash' : '',
                key === shakedKey ? 'game__cell--shake' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleCellClick(number)}
              disabled={status !== 'playing'}
            >
              {number}
            </button>
          )
        })}
      </div>

      <aside className="game__panel">
        <h2 className="game__title">Таблица Шульте</h2>

        {status === 'playing' && (
          <div className="game__progress">
            <span className="schulte__next">{nextNumber}</span>
            <span className="schulte__hint">Найдите число</span>
            <span className="game__timer">{formatTime(elapsedMs)}</span>
          </div>
        )}
      </aside>

      {status === 'finished' && (
        <Modal label="Результат игры">
          <h3 className="modal__title">Готово!</h3>
          <p className="game__result">Ваше время: {formatTime(elapsedMs)}</p>
          {bestMs !== null && (
            <p className="game__result game__result--muted">
              Лучшее время: {formatTime(bestMs)}
            </p>
          )}
          <button type="button" className="game__start" onClick={start}>
            Играть снова
          </button>
          <button type="button" className="game__settings-link" onClick={handleOpenSettings}>
            Настройки
          </button>
        </Modal>
      )}
    </div>
  )
}

export default SchulteGame
