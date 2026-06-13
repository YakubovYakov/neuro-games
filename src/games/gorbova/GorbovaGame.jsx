import { useEffect } from 'react'
import { useGorbova } from './useGorbova'
import { useCellFeedback } from '../../hooks/useCellFeedback'
import { formatTime } from '../../utils/formatTime'
import Modal from '../../components/Modal'
import './gorbova.css'

const cellKey = (number, color) => `${color}-${number}`

function GorbovaGame({ active, onOpenSettings }) {
  const {
    gridSize,
    status,
    cells,
    turn,
    nextBlack,
    nextRed,
    elapsedMs,
    bestMs,
    start,
    reset,
    clickCell,
    isCellDone,
  } = useGorbova()

  const { flashedKey, shakedKey, flash, shake } = useCellFeedback()

  // После закрытия настроек игра стартует сама
  useEffect(() => {
    if (active && status === 'idle') start()
  }, [active, status, start])

  const handleCellClick = (number, color) => {
    if (status !== 'playing') return
    const key = cellKey(number, color)
    if (clickCell(number, color)) flash(key)
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
        aria-label="Таблица Горбова"
      >
        {cells.map(({ number, color }) => {
          const key = cellKey(number, color)
          const done = isCellDone({ number, color })
          return (
            <button
              key={key}
              type="button"
              className={[
                'game__cell',
                `gorbova__cell--${color}`,
                done ? 'gorbova__cell--done' : '',
                key === flashedKey ? 'game__cell--flash' : '',
                key === shakedKey ? 'game__cell--shake' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleCellClick(number, color)}
              disabled={status !== 'playing' || done}
            >
              {number}
            </button>
          )
        })}
      </div>

      <aside className="game__panel">
        <h2 className="game__title">Таблица Горбова</h2>

        {status === 'playing' && (
          <div className="game__progress">
            <div className={`gorbova__target ${turn === 'black' ? 'gorbova__target--active' : 'gorbova__target--dim'}`}>
              <span className="gorbova__target-number gorbova__target-number--black">
                {nextBlack}
              </span>
              <span className="gorbova__target-hint">чёрное</span>
            </div>

            <div className="gorbova__turn-arrow">{turn === 'black' ? '←' : '→'}</div>

            <div className={`gorbova__target ${turn === 'red' ? 'gorbova__target--active' : 'gorbova__target--dim'}`}>
              <span className="gorbova__target-number gorbova__target-number--red">
                {nextRed}
              </span>
              <span className="gorbova__target-hint">красное</span>
            </div>

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

export default GorbovaGame
