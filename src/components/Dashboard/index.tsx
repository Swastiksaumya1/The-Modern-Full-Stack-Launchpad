import { useState, useEffect, useCallback } from 'react'
import {
  LayoutGrid, CheckSquare, Clock, Settings, Wifi, Volume2, Battery, User,
  Timer, Play, Pause, RotateCcw, Plus, Check, Trash2, Maximize2, Flag,
  X, Cloud, Sun, Moon, Sunrise, Sunset, CloudRain, Wind, Image, Music,
  Calendar, StickyNote, BarChart3, Thermometer, MapPin, Minimize2
} from 'lucide-react'

// Types
type Task = { id: string; text: string; completed: boolean; priority?: 'low' | 'medium' | 'high' }
type Note = { id: string; text: string; color: string }
type FullscreenWidget = 'clock' | 'tasks' | 'focus' | 'stopwatch' | 'weather' | 'notes' | 'calendar' | 'music' | 'analytics' | null

// Wallpaper options
const WALLPAPERS = [
  { id: 'dynamic', name: 'Dynamic Sky', preview: 'linear-gradient(to bottom, #1a1a3e, #0a0a14)' },
  { id: 'night', name: 'Night', preview: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
  { id: 'sunset', name: 'Sunset', preview: 'linear-gradient(135deg, #ee9ca7, #ffdde1, #c94b4b)' },
  { id: 'ocean', name: 'Ocean', preview: 'linear-gradient(135deg, #2193b0, #6dd5ed)' },
  { id: 'forest', name: 'Forest', preview: 'linear-gradient(135deg, #134e5e, #71b280)' },
  { id: 'aurora', name: 'Aurora', preview: 'linear-gradient(135deg, #43cea2, #185a9d)' },
  { id: 'cosmic', name: 'Cosmic', preview: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
  { id: 'lavender', name: 'Lavender', preview: 'linear-gradient(135deg, #667eea, #764ba2)' },
]

// Weather simulation
const WEATHER_CONDITIONS = [
  { temp: 24, condition: 'Sunny', icon: Sun, humidity: 45, wind: 12 },
  { temp: 18, condition: 'Cloudy', icon: Cloud, humidity: 65, wind: 18 },
  { temp: 15, condition: 'Rainy', icon: CloudRain, humidity: 85, wind: 25 },
]

export default function Dashboard() {
  const [userName, setUserName] = useState(() => localStorage.getItem('focus-user-name') || 'Swastik')
  const [city, setCity] = useState(() => localStorage.getItem('focus-city') || 'New Delhi')
  const [time, setTime] = useState(new Date())
  const [showSettings, setShowSettings] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [fullscreenWidget, setFullscreenWidget] = useState<FullscreenWidget>(null)
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('focus-wallpaper') || 'dynamic')
  const [weather] = useState(WEATHER_CONDITIONS[0])

  // Focus Timer State
  const [focusDuration, setFocusDuration] = useState(25)
  const [focusTimeLeft, setFocusTimeLeft] = useState(25 * 60)
  const [focusRunning, setFocusRunning] = useState(false)
  const [focusSessions, setFocusSessions] = useState(() => {
    const saved = localStorage.getItem('focus-sessions')
    return saved ? parseInt(saved) : 0
  })

  // Stopwatch State
  const [stopwatchRunning, setStopwatchRunning] = useState(false)
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [laps, setLaps] = useState<number[]>([])

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('focus-tasks')
      return saved ? JSON.parse(saved) : [
        { id: '1', text: 'Welcome to FocusOS 2.0', completed: false, priority: 'high' },
        { id: '2', text: 'Try the Focus Timer', completed: false, priority: 'medium' },
        { id: '3', text: 'Customize your wallpaper', completed: false, priority: 'low' },
      ]
    } catch { return [] }
  })
  const [newTask, setNewTask] = useState('')

  // Notes State
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem('focus-notes')
      return saved ? JSON.parse(saved) : [
        { id: '1', text: 'Welcome to FocusOS!', color: '#fbbf24' },
        { id: '2', text: 'Click any widget to fullscreen', color: '#34d399' },
      ]
    } catch { return [] }
  })
  const [newNote, setNewNote] = useState('')

  // Music State
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const tracks = [
    { title: 'Lofi Beats', artist: 'ChillHop', duration: '3:45' },
    { title: 'Focus Flow', artist: 'Ambient', duration: '4:20' },
    { title: 'Deep Work', artist: 'Concentration', duration: '5:10' },
  ]

  // Analytics State
  const [stats] = useState({
    tasksCompleted: tasks.filter(t => t.completed).length,
    focusTime: Math.round(focusSessions * 25 / 60 * 10) / 10,
    productivity: Math.min(95, 60 + Math.random() * 35),
    streak: 7,
  })

  // Save states to localStorage
  useEffect(() => { localStorage.setItem('focus-user-name', userName) }, [userName])
  useEffect(() => { localStorage.setItem('focus-city', city) }, [city])
  useEffect(() => { localStorage.setItem('focus-tasks', JSON.stringify(tasks)) }, [tasks])
  useEffect(() => { localStorage.setItem('focus-notes', JSON.stringify(notes)) }, [notes])
  useEffect(() => { localStorage.setItem('focus-wallpaper', wallpaper) }, [wallpaper])
  useEffect(() => { localStorage.setItem('focus-sessions', String(focusSessions)) }, [focusSessions])

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let interval: number
    if (focusRunning && focusTimeLeft > 0) {
      interval = window.setInterval(() => setFocusTimeLeft(t => t - 1), 1000)
    } else if (focusRunning && focusTimeLeft === 0) {
      setFocusRunning(false)
      setFocusSessions(s => s + 1)
      setFocusTimeLeft(focusDuration * 60)
    }
    return () => clearInterval(interval)
  }, [focusRunning, focusTimeLeft, focusDuration])

  useEffect(() => {
    let interval: number
    if (stopwatchRunning) {
      interval = window.setInterval(() => setStopwatchTime(t => t + 10), 10)
    }
    return () => clearInterval(interval)
  }, [stopwatchRunning])

  // Helper functions
  const getGreeting = () => {
    const hour = time.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const formatTime12 = () => {
    const hours = time.getHours() % 12 || 12
    const mins = String(time.getMinutes()).padStart(2, '0')
    const ampm = time.getHours() >= 12 ? 'PM' : 'AM'
    return `${hours}:${mins} ${ampm}`
  }

  const formatDate = () => time.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase()

  const pendingTasks = tasks.filter(t => !t.completed).length

  const addTask = () => {
    if (newTask.trim()) {
      setTasks(prev => [...prev, { id: Date.now().toString(), text: newTask.trim(), completed: false, priority: 'medium' }])
      setNewTask('')
    }
  }

  const addNote = () => {
    if (newNote.trim()) {
      const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#a78bfa']
      setNotes(prev => [...prev, { id: Date.now().toString(), text: newNote.trim(), color: colors[Math.floor(Math.random() * colors.length)] }])
      setNewNote('')
    }
  }

  // Get dynamic background based on time
  const getDynamicBackground = useCallback(() => {
    const hour = time.getHours()
    if (hour >= 5 && hour < 7) return 'linear-gradient(to bottom, #1a1a2e, #16213e, #e94560, #ff6b6b)' // Sunrise
    if (hour >= 7 && hour < 12) return 'linear-gradient(to bottom, #74b9ff, #a29bfe, #dfe6e9)' // Morning
    if (hour >= 12 && hour < 17) return 'linear-gradient(to bottom, #0984e3, #74b9ff, #81ecec)' // Afternoon
    if (hour >= 17 && hour < 20) return 'linear-gradient(to bottom, #2d3436, #636e72, #fd79a8, #e17055)' // Sunset
    return 'linear-gradient(to bottom, #0a0a14, #1a1a3e, #2d1b69)' // Night
  }, [time])

  const getSunPosition = useCallback(() => {
    const hour = time.getHours() + time.getMinutes() / 60
    if (hour < 6 || hour > 20) return null // No sun at night
    const progress = (hour - 6) / 14 // 6AM to 8PM = 14 hours
    const x = 10 + progress * 80 // Move from 10% to 90%
    const y = 80 - Math.sin(progress * Math.PI) * 60 // Arc from bottom to top to bottom
    return { x, y, isRising: hour < 12 }
  }, [time])

  const getTimeIcon = () => {
    const hour = time.getHours()
    if (hour >= 5 && hour < 7) return Sunrise
    if (hour >= 17 && hour < 20) return Sunset
    if (hour >= 7 && hour < 19) return Sun
    return Moon
  }

  const TimeIcon = getTimeIcon()
  const sunPosition = getSunPosition()

  // Fullscreen Widget Renderer
  const renderFullscreenWidget = () => {
    if (!fullscreenWidget) return null
    const closeBtn = (
      <button onClick={() => setFullscreenWidget(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
        <Minimize2 size={20} />
      </button>
    )
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        {closeBtn}
        {fullscreenWidget === 'clock' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 160, fontWeight: 200, letterSpacing: -8, background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{formatTime12()}</div>
            <div style={{ fontSize: 32, letterSpacing: 8, color: 'rgba(255,255,255,0.5)', marginTop: 20 }}>{formatDate()}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 40 }}>
              <MapPin size={24} style={{ color: '#60a5fa' }} />
              <span style={{ fontSize: 24 }}>{city}</span>
              <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.3)' }}>|</span>
              <weather.icon size={24} style={{ color: '#fbbf24' }} />
              <span style={{ fontSize: 24 }}>{weather.temp}°C</span>
            </div>
          </div>
        )}
        {fullscreenWidget === 'tasks' && (
          <div style={{ width: '100%', maxWidth: 800, height: '80vh', background: 'rgba(20,20,30,0.9)', borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: 32, marginBottom: 24 }}>📋 Task Manager Pro</h2>
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="Add a new task..." style={{ flex: 1, padding: '16px 20px', background: 'rgba(40,40,60,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', fontSize: 16, outline: 'none' }} />
              <button onClick={addTask} style={{ padding: '16px 32px', background: '#3b82f6', border: 'none', borderRadius: 12, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Add</button>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              {tasks.map(task => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px', background: 'rgba(40,40,60,0.5)', borderRadius: 12, marginBottom: 12, opacity: task.completed ? 0.5 : 1 }}>
                  <div onClick={() => setTasks(prev => prev.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))} style={{ width: 28, height: 28, borderRadius: 8, border: '2px solid', borderColor: task.completed ? '#22c55e' : 'rgba(255,255,255,0.3)', background: task.completed ? '#22c55e' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    {task.completed && <Check size={16} />}
                  </div>
                  <span style={{ flex: 1, fontSize: 18, textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</span>
                  <Trash2 size={18} style={{ opacity: 0.4, cursor: 'pointer' }} onClick={() => setTasks(prev => prev.filter(t => t.id !== task.id))} />
                </div>
              ))}
            </div>
          </div>
        )}
        {fullscreenWidget === 'focus' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 400, height: 400, borderRadius: '50%', border: '8px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: `conic-gradient(#3b82f6 ${(1 - focusTimeLeft / (focusDuration * 60)) * 360}deg, transparent 0deg)` }}>
              <div style={{ position: 'absolute', inset: 16, borderRadius: '50%', background: '#0a0a14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 80, fontWeight: 200, letterSpacing: 4 }}>{String(Math.floor(focusTimeLeft / 60)).padStart(2, '0')}:{String(focusTimeLeft % 60).padStart(2, '0')}</div>
                <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>Focus Session {focusSessions + 1}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 40 }}>
              {[25, 5, 15].map(m => (
                <button key={m} onClick={() => { setFocusDuration(m); setFocusTimeLeft(m * 60); setFocusRunning(false) }} style={{ padding: '16px 32px', background: focusDuration === m ? '#3b82f6' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 12, color: 'white', fontSize: 18, cursor: 'pointer' }}>{m} min</button>
              ))}
            </div>
            <button onClick={() => setFocusRunning(!focusRunning)} style={{ marginTop: 24, padding: '20px 60px', background: focusRunning ? '#ea580c' : '#22c55e', border: 'none', borderRadius: 16, color: 'white', fontSize: 20, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 12 }}>
              {focusRunning ? <><Pause size={24} /> Pause</> : <><Play size={24} /> Start Focus</>}
            </button>
          </div>
        )}
        {fullscreenWidget === 'weather' && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <weather.icon size={120} style={{ color: '#fbbf24', marginBottom: 24 }} />
            <div style={{ fontSize: 100, fontWeight: 200 }}>{weather.temp}°C</div>
            <div style={{ fontSize: 36, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>{weather.condition}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
              <MapPin size={20} style={{ color: '#60a5fa' }} />
              <span style={{ fontSize: 24 }}>{city}</span>
            </div>
            <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 40 }}>
              <div><Thermometer size={24} style={{ color: '#f472b6' }} /><div style={{ fontSize: 24, marginTop: 8 }}>{weather.humidity}%</div><div style={{ color: 'rgba(255,255,255,0.5)' }}>Humidity</div></div>
              <div><Wind size={24} style={{ color: '#60a5fa' }} /><div style={{ fontSize: 24, marginTop: 8 }}>{weather.wind} km/h</div><div style={{ color: 'rgba(255,255,255,0.5)' }}>Wind</div></div>
            </div>
          </div>
        )}
        {fullscreenWidget === 'stopwatch' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 120, fontWeight: 200, letterSpacing: 4, fontFamily: 'monospace' }}>
              {String(Math.floor(stopwatchTime / 60000)).padStart(2, '0')}:{String(Math.floor((stopwatchTime % 60000) / 1000)).padStart(2, '0')}.{String(Math.floor((stopwatchTime % 1000) / 10)).padStart(2, '0')}
            </div>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 40 }}>
              <button onClick={() => { setStopwatchRunning(false); setStopwatchTime(0); setLaps([]) }} style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer' }}><RotateCcw size={24} /></button>
              <button onClick={() => setStopwatchRunning(!stopwatchRunning)} style={{ width: 80, height: 80, borderRadius: '50%', background: stopwatchRunning ? '#ea580c' : '#22c55e', border: 'none', color: 'white', cursor: 'pointer' }}>{stopwatchRunning ? <Pause size={32} /> : <Play size={32} style={{ marginLeft: 4 }} />}</button>
              <button onClick={() => stopwatchRunning && setLaps(prev => [stopwatchTime, ...prev])} style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', opacity: stopwatchRunning ? 1 : 0.5 }}><Flag size={24} /></button>
            </div>
            {laps.length > 0 && (
              <div style={{ marginTop: 40, maxHeight: 200, overflow: 'auto' }}>
                {laps.map((lap, i) => (
                  <div key={i} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Lap {laps.length - i}</span>
                    <span style={{ fontFamily: 'monospace' }}>{String(Math.floor(lap / 60000)).padStart(2, '0')}:{String(Math.floor((lap % 60000) / 1000)).padStart(2, '0')}.{String(Math.floor((lap % 1000) / 10)).padStart(2, '0')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {fullscreenWidget === 'notes' && (
          <div style={{ width: '100%', maxWidth: 1000, height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: 32, marginBottom: 24 }}>📝 Quick Notes</h2>
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <input value={newNote} onChange={e => setNewNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote()} placeholder="Add a quick note..." style={{ flex: 1, padding: '16px 20px', background: 'rgba(40,40,60,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', fontSize: 16, outline: 'none' }} />
              <button onClick={addNote} style={{ padding: '16px 32px', background: '#fbbf24', border: 'none', borderRadius: 12, color: 'black', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Add</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, flex: 1, overflow: 'auto' }}>
              {notes.map(note => (
                <div key={note.id} style={{ padding: 20, background: note.color, borderRadius: 12, color: '#1a1a2e', position: 'relative' }}>
                  <button onClick={() => setNotes(prev => prev.filter(n => n.id !== note.id))} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.2)', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} /></button>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {fullscreenWidget === 'music' && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ width: 200, height: 200, borderRadius: 24, background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: isPlaying ? 'spin 4s linear infinite' : 'none' }}>
              <Music size={80} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{tracks[currentTrack].title}</div>
            <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>{tracks[currentTrack].artist}</div>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 32 }}>
              <button onClick={() => setCurrentTrack(prev => prev === 0 ? tracks.length - 1 : prev - 1)} style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer' }}>⏮</button>
              <button onClick={() => setIsPlaying(!isPlaying)} style={{ width: 72, height: 72, borderRadius: '50%', background: '#ec4899', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{isPlaying ? <Pause size={32} /> : <Play size={32} style={{ marginLeft: 4 }} />}</button>
              <button onClick={() => setCurrentTrack(prev => prev === tracks.length - 1 ? 0 : prev + 1)} style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer' }}>⏭</button>
            </div>
          </div>
        )}
        {fullscreenWidget === 'analytics' && (
          <div style={{ width: '100%', maxWidth: 800, padding: 40 }}>
            <h2 style={{ fontSize: 32, marginBottom: 32 }}>📊 Your Analytics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
              <div style={{ background: 'rgba(34,197,94,0.2)', padding: 32, borderRadius: 16, textAlign: 'center' }}><div style={{ fontSize: 48, fontWeight: 600, color: '#22c55e' }}>{stats.tasksCompleted}</div><div style={{ color: 'rgba(255,255,255,0.6)' }}>Tasks Completed</div></div>
              <div style={{ background: 'rgba(59,130,246,0.2)', padding: 32, borderRadius: 16, textAlign: 'center' }}><div style={{ fontSize: 48, fontWeight: 600, color: '#3b82f6' }}>{stats.focusTime}h</div><div style={{ color: 'rgba(255,255,255,0.6)' }}>Focus Time</div></div>
              <div style={{ background: 'rgba(168,85,247,0.2)', padding: 32, borderRadius: 16, textAlign: 'center' }}><div style={{ fontSize: 48, fontWeight: 600, color: '#a855f7' }}>{Math.round(stats.productivity)}%</div><div style={{ color: 'rgba(255,255,255,0.6)' }}>Productivity</div></div>
              <div style={{ background: 'rgba(249,115,22,0.2)', padding: 32, borderRadius: 16, textAlign: 'center' }}><div style={{ fontSize: 48, fontWeight: 600, color: '#f97316' }}>{stats.streak}</div><div style={{ color: 'rgba(255,255,255,0.6)' }}>Day Streak</div></div>
            </div>
          </div>
        )}
        {fullscreenWidget === 'calendar' && (
          <div style={{ padding: 40 }}>
            <h2 style={{ fontSize: 32, marginBottom: 32, textAlign: 'center' }}>📅 {time.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, maxWidth: 600, margin: '0 auto' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: 8 }}>{d}</div>)}
              {Array.from({ length: new Date(time.getFullYear(), time.getMonth(), 1).getDay() }, (_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: new Date(time.getFullYear(), time.getMonth() + 1, 0).getDate() }, (_, i) => (
                <div key={i} style={{ textAlign: 'center', padding: 16, background: i + 1 === time.getDate() ? '#3b82f6' : 'rgba(255,255,255,0.05)', borderRadius: 12, fontWeight: i + 1 === time.getDate() ? 600 : 400 }}>{i + 1}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const widgetBase = { background: 'rgba(20,20,30,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, backdropFilter: 'blur(20px)', cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative' as const }
  const widgetHover = { boxShadow: '0 0 30px rgba(59,130,246,0.3)' }

  return (
    <div style={{ minHeight: '100vh', color: 'white', fontFamily: "'Inter', system-ui, sans-serif", position: 'relative', overflow: 'hidden' }}>
      {/* Dynamic Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: wallpaper === 'dynamic' ? getDynamicBackground() : WALLPAPERS.find(w => w.id === wallpaper)?.preview, transition: 'background 2s ease' }}>
        {/* Stars overlay for night */}
        <div style={{ position: 'absolute', inset: 0, opacity: time.getHours() >= 19 || time.getHours() < 6 ? 1 : 0, transition: 'opacity 2s', background: 'radial-gradient(2px 2px at 20px 30px, white, transparent), radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 90px 40px, white, transparent), radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.9), transparent)', backgroundSize: '200px 150px' }} />
        {/* Sun/Moon */}
        {wallpaper === 'dynamic' && sunPosition && (
          <div style={{ position: 'absolute', left: `${sunPosition.x}%`, top: `${sunPosition.y}%`, width: 60, height: 60, borderRadius: '50%', background: time.getHours() < 18 ? 'radial-gradient(circle, #fbbf24, #f97316)' : 'radial-gradient(circle, #e2e8f0, #94a3b8)', boxShadow: time.getHours() < 18 ? '0 0 60px #fbbf24' : '0 0 40px rgba(226,232,240,0.5)', transform: 'translate(-50%, -50%)', transition: 'all 60s linear' }} />
        )}
      </div>

      {/* Menu Bar */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 44, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#60a5fa', fontWeight: 600, fontSize: 15 }}>
            <LayoutGrid size={18} />
            <span>FocusOS</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          {['File', 'View', 'Window'].map(item => (
            <span key={item} style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '4px 8px', borderRadius: 4 }}>{item}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Wifi size={15} style={{ opacity: 0.6 }} />
          <Volume2 size={15} style={{ opacity: 0.6 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: 0.6, fontSize: 12 }}><Battery size={15} /> 100%</div>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{formatTime12()}</span>
          <div onClick={() => setShowSettings(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.1)' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={14} /></div>
            <span style={{ fontSize: 13 }}>{userName}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ position: 'relative', zIndex: 10, padding: '64px 32px 100px', maxWidth: 1500, margin: '0 auto' }}>
        {/* Quick Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Tasks Done', value: tasks.filter(t => t.completed).length, icon: CheckSquare, color: '#22c55e' },
            { label: 'Focus Time', value: `${(focusSessions * 25 / 60).toFixed(1)}h`, icon: Clock, color: '#3b82f6' },
            { label: 'Productivity', value: `${Math.round(stats.productivity)}%`, icon: BarChart3, color: '#a855f7' },
            { label: 'Day Streak', value: stats.streak, icon: Flag, color: '#f97316' },
          ].map((stat, i) => (
            <div key={i} style={{ ...widgetBase, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 600 }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Widget Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 24 }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Clock + Weather Widget */}
            <div onClick={() => setFullscreenWidget('clock')} style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%)', borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 52, fontWeight: 300, letterSpacing: -2, lineHeight: 1 }}>{formatTime12()}</div>
                  <div style={{ fontSize: 13, letterSpacing: 2, color: 'rgba(191,219,254,1)', marginTop: 8 }}>{formatDate()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <MapPin size={14} style={{ color: 'rgba(191,219,254,0.8)' }} />
                    <span style={{ fontSize: 13, color: 'rgba(191,219,254,0.9)' }}>{city}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <weather.icon size={22} style={{ color: '#fbbf24' }} />
                    <span style={{ fontSize: 20, fontWeight: 500 }}>{weather.temp}°C</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(191,219,254,0.7)', marginTop: 2 }}>{weather.condition}</div>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 12, right: 16 }}><Maximize2 size={14} style={{ opacity: 0.5 }} /></div>
            </div>

            {/* Focus Timer Widget */}
            <div onClick={() => setFullscreenWidget('focus')} style={{ ...widgetBase, padding: 20, flex: 1 }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 12, letterSpacing: 1 }}><Timer size={14} /> FOCUS TIMER</div>
                <Maximize2 size={14} style={{ opacity: 0.4 }} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[25, 5, 15].map(mins => (
                  <button key={mins} onClick={e => { e.stopPropagation(); setFocusDuration(mins); setFocusTimeLeft(mins * 60); setFocusRunning(false) }} style={{ flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', background: focusDuration === mins ? '#3b82f6' : 'rgba(40,40,60,0.8)', color: focusDuration === mins ? 'white' : 'rgba(255,255,255,0.6)', border: 'none', transition: 'all 0.2s' }}>{mins}</button>
                ))}
              </div>
              <div style={{ fontSize: 48, fontWeight: 300, textAlign: 'center', letterSpacing: 4, margin: '16px 0' }}>{String(Math.floor(focusTimeLeft / 60)).padStart(2, '0')}:{String(focusTimeLeft % 60).padStart(2, '0')}</div>
              <button onClick={e => { e.stopPropagation(); setFocusRunning(!focusRunning) }} style={{ width: '100%', padding: '14px 0', borderRadius: 12, fontSize: 14, fontWeight: 600, letterSpacing: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: focusRunning ? '#ea580c' : '#3b82f6', border: 'none', color: 'white' }}>
                {focusRunning ? <><Pause size={16} /> PAUSE</> : <><Play size={16} /> START FOCUS</>}
              </button>
              {focusSessions > 0 && <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Sessions completed: {focusSessions}</div>}
            </div>

            {/* Stopwatch */}
            <div onClick={() => setFullscreenWidget('stopwatch')} style={{ ...widgetBase, padding: 20 }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 12, letterSpacing: 1 }}><Clock size={14} /> STOPWATCH</div>
                <Maximize2 size={14} style={{ opacity: 0.4 }} />
              </div>
              <div style={{ textAlign: 'center', margin: '16px 0' }}>
                <span style={{ fontSize: 36, fontWeight: 300, letterSpacing: 2, fontFamily: 'monospace' }}>{String(Math.floor(stopwatchTime / 60000)).padStart(2, '0')}:{String(Math.floor((stopwatchTime % 60000) / 1000)).padStart(2, '0')}.{String(Math.floor((stopwatchTime % 1000) / 10)).padStart(2, '0')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                <button onClick={e => { e.stopPropagation(); setStopwatchRunning(false); setStopwatchTime(0); setLaps([]) }} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(40,40,60,0.8)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RotateCcw size={16} /></button>
                <button onClick={e => { e.stopPropagation(); setStopwatchRunning(!stopwatchRunning) }} style={{ width: 52, height: 52, borderRadius: '50%', background: stopwatchRunning ? '#ea580c' : '#3b82f6', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{stopwatchRunning ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}</button>
                <button onClick={e => { e.stopPropagation(); if (stopwatchRunning) setLaps(prev => [stopwatchTime, ...prev]) }} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(40,40,60,0.8)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: stopwatchRunning ? 1 : 0.5 }}><Flag size={16} /></button>
              </div>
            </div>
          </div>

          {/* Right Column - Task Manager */}
          <div onClick={() => setFullscreenWidget('tasks')} style={{ ...widgetBase, height: 'fit-content', minHeight: 500, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#60a5fa' }}><CheckSquare size={18} /><span style={{ fontWeight: 600 }}>Task Manager Pro</span></div>
              <Maximize2 size={14} style={{ opacity: 0.4 }} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, padding: '20px 24px 8px' }}>{getGreeting()}, {userName}.</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', padding: '0 24px 20px' }}>You have {pendingTasks} pending task{pendingTasks !== 1 ? 's' : ''}. Let's crush it!</div>
            <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 20px 16px', padding: '12px 16px', background: 'rgba(30,30,40,0.8)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
              <Plus size={18} style={{ opacity: 0.4 }} />
              <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="What needs to be done?" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: 14 }} />
              <button onClick={addTask} style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: 8, color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>ADD</button>
            </div>
            <div onClick={e => e.stopPropagation()} style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
              {tasks.map(task => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, marginBottom: 8, background: 'rgba(30,30,45,0.5)', opacity: task.completed ? 0.5 : 1, transition: 'all 0.2s' }}>
                  <div onClick={() => setTasks(prev => prev.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))} style={{ width: 24, height: 24, borderRadius: 8, border: '2px solid', borderColor: task.completed ? '#22c55e' : 'rgba(255,255,255,0.3)', background: task.completed ? '#22c55e' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>{task.completed && <Check size={14} />}</div>
                  <span style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'rgba(255,255,255,0.4)' : 'white' }}>{task.text}</span>
                  <Trash2 size={14} style={{ opacity: 0.3, cursor: 'pointer' }} onClick={() => setTasks(prev => prev.filter(t => t.id !== task.id))} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Widgets Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 24 }}>
          {/* Weather Widget */}
          <div onClick={() => setFullscreenWidget('weather')} style={{ ...widgetBase, padding: 20, background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(99,102,241,0.2))' }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>WEATHER</span>
              <Maximize2 size={14} style={{ opacity: 0.4 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <weather.icon size={40} style={{ color: '#fbbf24' }} />
              <div>
                <div style={{ fontSize: 32, fontWeight: 600 }}>{weather.temp}°</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{weather.condition}</div>
              </div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              <span>💧 {weather.humidity}%</span>
              <span>💨 {weather.wind}km/h</span>
            </div>
          </div>

          {/* Notes Widget */}
          <div onClick={() => setFullscreenWidget('notes')} style={{ ...widgetBase, padding: 20 }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>NOTES</span>
              <Maximize2 size={14} style={{ opacity: 0.4 }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {notes.slice(0, 3).map(note => (
                <div key={note.id} style={{ padding: '8px 12px', background: note.color, borderRadius: 8, color: '#1a1a2e', fontSize: 11, fontWeight: 500, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.text}</div>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{notes.length} notes</div>
          </div>

          {/* Music Widget */}
          <div onClick={() => setFullscreenWidget('music')} style={{ ...widgetBase, padding: 20 }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>MUSIC</span>
              <Maximize2 size={14} style={{ opacity: 0.4 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Music size={20} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{tracks[currentTrack].title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{tracks[currentTrack].artist}</div>
              </div>
            </div>
            <div onClick={e => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
              <button onClick={() => setCurrentTrack(p => p === 0 ? tracks.length - 1 : p - 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.6 }}>⏮</button>
              <button onClick={() => setIsPlaying(!isPlaying)} style={{ width: 36, height: 36, borderRadius: '50%', background: '#ec4899', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: 2 }} />}</button>
              <button onClick={() => setCurrentTrack(p => p === tracks.length - 1 ? 0 : p + 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.6 }}>⏭</button>
            </div>
          </div>

          {/* Calendar Widget */}
          <div onClick={() => setFullscreenWidget('calendar')} style={{ ...widgetBase, padding: 20 }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>CALENDAR</span>
              <Maximize2 size={14} style={{ opacity: 0.4 }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{time.toLocaleDateString('en-US', { month: 'long' })}</div>
              <div style={{ fontSize: 48, fontWeight: 600, lineHeight: 1 }}>{time.getDate()}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{time.toLocaleDateString('en-US', { weekday: 'long' })}</div>
            </div>
          </div>
        </div>
      </main>

      {/* Dock */}
      <div style={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, padding: '12px 24px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', zIndex: 50 }}>
        {[
          { id: 'dashboard', icon: LayoutGrid, color: '#3b82f6', label: 'Dashboard' },
          { id: 'tasks', icon: CheckSquare, color: '#22c55e', label: 'Tasks' },
          { id: 'focus', icon: Timer, color: '#f97316', label: 'Focus' },
          { id: 'music', icon: Music, color: '#ec4899', label: 'Music' },
          { id: 'calendar', icon: Calendar, color: '#8b5cf6', label: 'Calendar' },
          { id: 'notes', icon: StickyNote, color: '#fbbf24', label: 'Notes' },
          { id: 'analytics', icon: BarChart3, color: '#06b6d4', label: 'Analytics' },
          { id: 'wallpaper', icon: Image, color: '#6366f1', label: 'Wallpaper' },
          { id: 'settings', icon: Settings, color: '#6b7280', label: 'Settings' },
        ].map(item => (
          <div key={item.id} onClick={() => item.id === 'settings' ? setShowSettings(true) : item.id === 'wallpaper' ? setShowSettings(true) : setFullscreenWidget(item.id as FullscreenWidget)} title={item.label} style={{ width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: activeNav === item.id ? item.color : 'rgba(255,255,255,0.08)', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15) translateY(-8px)'; e.currentTarget.style.background = item.color }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = activeNav === item.id ? item.color : 'rgba(255,255,255,0.08)' }}>
            <item.icon size={22} />
          </div>
        ))}
      </div>

      {/* Fullscreen Widget */}
      {renderFullscreenWidget()}

      {/* Settings Panel */}
      {showSettings && (
        <>
          <div onClick={() => setShowSettings(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 400, background: 'rgba(15,15,25,0.98)', borderLeft: '1px solid rgba(255,255,255,0.1)', zIndex: 100, padding: 28, overflow: 'auto', backdropFilter: 'blur(20px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <h2 style={{ fontSize: 24, fontWeight: 600 }}>⚙️ Settings</h2>
              <button onClick={() => setShowSettings(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
            </div>

            {/* Profile Section */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 16 }}>PROFILE</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 600 }}>{userName.charAt(0).toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Your Name</div>
                  <input type="text" value={userName} onChange={e => setUserName(e.target.value)} style={{ width: '100%', background: 'rgba(30,30,45,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' }} />
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>City</div>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', background: 'rgba(30,30,45,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' }} placeholder="Enter your city" />
              </div>
            </div>

            {/* Wallpaper Section */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 16 }}>WALLPAPER</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {WALLPAPERS.map(wp => (
                  <div key={wp.id} onClick={() => setWallpaper(wp.id)} style={{ padding: 4, borderRadius: 14, border: wallpaper === wp.id ? '2px solid #3b82f6' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ height: 60, borderRadius: 10, background: wp.preview, marginBottom: 8 }} />
                    <div style={{ fontSize: 12, textAlign: 'center', color: wallpaper === wp.id ? '#3b82f6' : 'rgba(255,255,255,0.6)' }}>{wp.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Icon Display */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 16 }}>CURRENT TIME OF DAY</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'rgba(30,30,45,0.8)', borderRadius: 12 }}>
                <TimeIcon size={32} style={{ color: time.getHours() >= 6 && time.getHours() < 19 ? '#fbbf24' : '#94a3b8' }} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{time.getHours() >= 6 && time.getHours() < 19 ? 'Daytime' : 'Nighttime'}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Dynamic background {wallpaper === 'dynamic' ? 'active' : 'inactive'}</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 40 }}>FocusOS v2.0 • Built with ❤️ for {userName}</div>
          </div>
        </>
      )}
    </div>
  )
}

