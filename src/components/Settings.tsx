import { useState, useEffect } from 'react'
import { Moon, Sun, Volume2, VolumeX, Bell, BellOff, Palette, Monitor, Download, Trash2 } from 'lucide-react'

type SettingsData = {
  theme: 'dark' | 'light'
  soundEnabled: boolean
  notificationsEnabled: boolean
  accentColor: string
}

const accentColors = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Orange', value: '#f97316' },
]

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>(() => {
    try {
      const raw = localStorage.getItem('focus-settings')
      return raw ? JSON.parse(raw) : { theme: 'dark', soundEnabled: true, notificationsEnabled: true, accentColor: '#6366f1' }
    } catch {
      return { theme: 'dark', soundEnabled: true, notificationsEnabled: true, accentColor: '#6366f1' }
    }
  })

  useEffect(() => {
    localStorage.setItem('focus-settings', JSON.stringify(settings))
  }, [settings])

  const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings(s => ({ ...s, [key]: value }))
  }

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const exportData = () => {
    const data = {
      tasks: localStorage.getItem('focus-dashboard-tasks'),
      notes: localStorage.getItem('focus-notes'),
      analytics: localStorage.getItem('focus-analytics'),
      settings: localStorage.getItem('focus-settings'),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'focus-dashboard-backup.json'
    a.click()
  }

  return (
    <div className="p-6 h-full overflow-y-auto space-y-6">
      {/* Appearance */}
      <section className="animate-slide-up">
        <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
          <Palette size={16} /> Appearance
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              {settings.theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              <span>Theme</span>
            </div>
            <button
              onClick={() => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark')}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.theme === 'dark' ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-sm mb-3">Accent Color</p>
            <div className="flex gap-2 flex-wrap">
              {accentColors.map(color => (
                <button
                  key={color.value}
                  onClick={() => updateSetting('accentColor', color.value)}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${settings.accentColor === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sound & Notifications */}
      <section className="animate-slide-up" style={{ animationDelay: '100ms' }}>
        <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
          <Bell size={16} /> Notifications & Sound
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              <span>Sound Effects</span>
            </div>
            <button
              onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.soundEnabled ? 'bg-green-600' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.soundEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              {settings.notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
              <span>Notifications</span>
            </div>
            <button
              onClick={() => updateSetting('notificationsEnabled', !settings.notificationsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.notificationsEnabled ? 'bg-green-600' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.notificationsEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Data */}
      <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
          <Monitor size={16} /> Data Management
        </h3>
        <div className="space-y-2">
          <button onClick={exportData} className="w-full flex items-center gap-3 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors text-left">
            <Download size={20} className="text-blue-400" />
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-xs text-gray-400">Download all your data as JSON</p>
            </div>
          </button>
          <button onClick={clearAllData} className="w-full flex items-center gap-3 bg-red-500/10 rounded-lg p-4 hover:bg-red-500/20 transition-colors text-left">
            <Trash2 size={20} className="text-red-400" />
            <div>
              <p className="font-medium text-red-400">Clear All Data</p>
              <p className="text-xs text-gray-400">Permanently delete all stored data</p>
            </div>
          </button>
        </div>
      </section>
    </div>
  )
}

