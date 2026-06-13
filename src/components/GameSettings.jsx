import Modal from './Modal'
import SegmentedControl from './SegmentedControl'

const GAME_OPTIONS = [
  { value: 'schulte', label: 'Шульте' },
  { value: 'gorbova', label: 'Горбова' },
]

const STYLE_OPTIONS = [
  { value: 'classic', label: 'Классическая' },
  { value: 'color', label: 'Цветная' },
]

function GameSettings({ settings, onChange, onStart }) {
  return (
    <Modal label="Настройки игры" className="settings">
      <h3 className="modal__title">Настройки</h3>

      <SegmentedControl
        label="Тип таблицы"
        value={settings.gameType}
        options={GAME_OPTIONS}
        onChange={(val) => onChange({ ...settings, gameType: val })}
      />

      {settings.gameType === 'schulte' && (
        <SegmentedControl
          label="Стиль таблицы"
          value={settings.tableStyle}
          options={STYLE_OPTIONS}
          onChange={(val) => onChange({ ...settings, tableStyle: val })}
        />
      )}

      <button type="button" className="game__start" onClick={onStart}>
        Старт!
      </button>
    </Modal>
  )
}

export default GameSettings
