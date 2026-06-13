import { useState } from 'react'
import SchulteGame from './games/schulte/SchulteGame'
import GorbovaGame from './games/gorbova/GorbovaGame'
import GameSettings from './components/GameSettings'

const DEFAULT_SETTINGS = {
  gameType: 'schulte',
  tableStyle: 'classic',
}

function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [showSettings, setShowSettings] = useState(true)

  const handleStart = () => setShowSettings(false)
  const handleOpenSettings = () => setShowSettings(true)

  return (
    <>
      {showSettings && (
        <GameSettings
          settings={settings}
          onChange={setSettings}
          onStart={handleStart}
        />
      )}

      {settings.gameType === 'schulte' ? (
        <SchulteGame
          active={!showSettings}
          tableStyle={settings.tableStyle}
          onOpenSettings={handleOpenSettings}
        />
      ) : (
        <GorbovaGame active={!showSettings} onOpenSettings={handleOpenSettings} />
      )}
    </>
  )
}

export default App
