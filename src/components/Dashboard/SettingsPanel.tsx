import { useState, useEffect } from 'react'
import { X, User, Bell, Volume2, Palette, Download, Trash2 } from 'lucide-react'

type Props = {
  isOpen: boolean
  onClose: () => void
  userName: string
  onChangeName: (name: string) => void
}

export default function SettingsPanel({ isOpen, onClose, userName, onChangeName }: Props) {
  const [name, setName] = useState(userName)
  const [notifications, setNotifications] = useState(true)
  const [sounds, setSounds] = useState(true)

  useEffect(() => {
    setName(userName)
  }, [userName])

  const handleSaveName = () => {
    if (name.trim()) {
      onChangeName(name.trim())
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-96 bg-gray-900/95 backdrop-blur-xl border-l border-white/10 z-50 animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile */}
          <section>
            <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
              <User size={16} /> Profile
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-400 block mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onBlur={handleSaveName}
                    onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                    className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section>
            <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
              <Bell size={16} /> Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                <span className="text-sm">Push Notifications</span>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Sound */}
          <section>
            <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
              <Volume2 size={16} /> Sound
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                <span className="text-sm">Sound Effects</span>
                <button
                  onClick={() => setSounds(!sounds)}
                  className={`w-12 h-6 rounded-full transition-colors ${sounds ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${sounds ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Theme */}
          <section>
            <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
              <Palette size={16} /> Accent Color
            </h3>
            <div className="flex gap-2">
              {['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-orange-500', 'bg-cyan-500'].map((color, i) => (
                <button
                  key={i}
                  className={`w-8 h-8 rounded-full ${color} ${i === 0 ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}`}
                />
              ))}
            </div>
          </section>

          {/* Data */}
          <section>
            <h3 className="text-sm font-medium text-gray-400 mb-4">Data Management</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors text-left">
                <Download size={18} className="text-blue-400" />
                <span className="text-sm">Export All Data</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors text-left text-red-400">
                <Trash2 size={18} />
                <span className="text-sm">Clear All Data</span>
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 text-center text-xs text-gray-500">
          FocusOS v2.0 • Made with ❤️
        </div>
      </div>
    </>
  )
}

