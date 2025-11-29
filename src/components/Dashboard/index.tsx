import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  LayoutGrid, CheckSquare, Clock, Settings, Wifi, Volume2, Battery,
  Timer, Play, Pause, RotateCcw, Plus, Check, Trash2, Maximize2, Flag,
  X, Cloud, Sun, Moon, Sunrise, Sunset, CloudRain, Wind, Music,
  Calendar, StickyNote, BarChart3, Thermometer, MapPin,
  Calculator, Link, Quote, Zap, Target, TrendingUp,
  CloudSun, Snowflake, CloudLightning, LogOut, CloudOff, RefreshCw, Lock
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { loadUserData, syncTasks, syncNotes, syncHabits, syncPreferences, syncFocusSessions, syncQuickLinks } from '../../lib/firestore'
import AdvancedLockScreen from '../AdvancedLockScreen'

// ============================================================================
// TYPES
// ============================================================================
type Task = { id: string; text: string; completed: boolean; priority?: 'low' | 'medium' | 'high' }
type Note = { id: string; text: string; color: string }
type Habit = { id: string; name: string; icon: string; streak: number; completedToday: boolean }
type QuickLink = { id: string; name: string; url: string; color: string }
type FullscreenWidget = 'clock' | 'tasks' | 'focus' | 'stopwatch' | 'weather' | 'notes' | 'calendar' | 'music' | 'analytics' | 'calculator' | 'habits' | 'links' | 'quotes' | null

// ============================================================================
// CONSTANTS & DESIGN SYSTEM
// ============================================================================

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

// Accent colors
const ACCENT_COLORS = [
  { id: 'blue', primary: '#3b82f6', secondary: '#60a5fa', glow: 'rgba(59, 130, 246, 0.4)' },
  { id: 'purple', primary: '#8b5cf6', secondary: '#a78bfa', glow: 'rgba(139, 92, 246, 0.4)' },
  { id: 'pink', primary: '#ec4899', secondary: '#f472b6', glow: 'rgba(236, 72, 153, 0.4)' },
  { id: 'green', primary: '#22c55e', secondary: '#4ade80', glow: 'rgba(34, 197, 94, 0.4)' },
  { id: 'orange', primary: '#f97316', secondary: '#fb923c', glow: 'rgba(249, 115, 22, 0.4)' },
  { id: 'cyan', primary: '#06b6d4', secondary: '#22d3ee', glow: 'rgba(6, 182, 212, 0.4)' },
]

// Motivational quotes
const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Your time is limited, don't waste it.", author: "Steve Jobs" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
]

// Weather icon mapping
const getWeatherIcon = (condition: string) => {
  const c = condition.toLowerCase()
  if (c.includes('clear') || c.includes('sunny')) return Sun
  if (c.includes('cloud') && c.includes('sun')) return CloudSun
  if (c.includes('cloud')) return Cloud
  if (c.includes('rain') || c.includes('drizzle')) return CloudRain
  if (c.includes('thunder') || c.includes('storm')) return CloudLightning
  if (c.includes('snow')) return Snowflake
  if (c.includes('mist') || c.includes('fog')) return Cloud
  return Sun
}

// Avatar options - 12 character avatars
const AVATARS = [
  { id: 'astronaut', emoji: '👨‍🚀', label: 'Astronaut' },
  { id: 'ninja', emoji: '🥷', label: 'Ninja' },
  { id: 'wizard', emoji: '🧙', label: 'Wizard' },
  { id: 'robot', emoji: '🤖', label: 'Robot' },
  { id: 'alien', emoji: '👽', label: 'Alien' },
  { id: 'superhero', emoji: '🦸', label: 'Superhero' },
  { id: 'detective', emoji: '🕵️', label: 'Detective' },
  { id: 'artist', emoji: '👨‍🎨', label: 'Artist' },
  { id: 'scientist', emoji: '👨‍🔬', label: 'Scientist' },
  { id: 'chef', emoji: '👨‍🍳', label: 'Chef' },
  { id: 'pilot', emoji: '👨‍✈️', label: 'Pilot' },
  { id: 'rockstar', emoji: '🎸', label: 'Rockstar' },
]

interface DashboardProps {
  editMode?: boolean;
}

export default function Dashboard({ editMode: _editMode = false }: DashboardProps) {
  // ============================================================================
  // AUTH
  // ============================================================================
  const { currentUser, logout } = useAuth()

  // ============================================================================
  // CORE STATE
  // ============================================================================
  // Lock Screen State
  const [isLocked, setIsLocked] = useState(false)
  
  // Use Firebase displayName as the primary source, fallback to localStorage
  const [userName] = useState(() => currentUser?.displayName || localStorage.getItem('focus-user-name') || 'User')
  const [city, setCity] = useState(() => localStorage.getItem('focus-city') || 'New Delhi')
  const [time, setTime] = useState(new Date())
  const [showSettings, setShowSettings] = useState(false)
  const [activeNav] = useState('dashboard')
  const [fullscreenWidget, setFullscreenWidget] = useState<FullscreenWidget>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('focus-wallpaper') || 'dynamic')
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('focus-accent') || 'blue')
  const [selectedAvatar, setSelectedAvatar] = useState(() => localStorage.getItem('focus-avatar') || 'astronaut')
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [clockStyle, setClockStyle] = useState(() => localStorage.getItem('focus-clock-style') || 'digital')
  const [clockFormat, setClockFormat] = useState(() => localStorage.getItem('focus-clock-format') || '12')
  const [citySuggestions, setCitySuggestions] = useState<{name: string, country: string, lat: number, lon: number}[]>([])
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)
  const [citySearchTimeout, setCitySearchTimeout] = useState<number | null>(null)

  // Cloud Sync State
  const [cloudSyncing, setCloudSyncing] = useState(false)
  const [cloudError, setCloudError] = useState(false)
  const dataLoadedRef = useRef(false)

  // Real Weather State (extended with sunrise/sunset and more)
  const [weather, setWeather] = useState({
    temp: 24, condition: 'Loading...', icon: Sun, humidity: 45, wind: 12, feelsLike: 24, description: '',
    sunrise: '', sunset: '', uvIndex: 0, visibility: 10, pressure: 1013, windDirection: 0, precipitation: 0,
    cityName: '', country: '', timezone: ''
  })
  const [weatherLoading, setWeatherLoading] = useState(true)

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

  // Timer State
  // @ts-ignore - will be used when timer functionality is implemented
  const [timerSeconds, setTimerSeconds] = useState(5 * 60)
  // @ts-ignore - will be used when timer functionality is implemented
  const [timerActive, setTimerActive] = useState(false)

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

  // Habits State
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem('focus-habits')
      return saved ? JSON.parse(saved) : [
        { id: '1', name: 'Morning Exercise', icon: '🏃', streak: 5, completedToday: false },
        { id: '2', name: 'Read 30 mins', icon: '📚', streak: 12, completedToday: false },
        { id: '3', name: 'Meditate', icon: '🧘', streak: 8, completedToday: false },
        { id: '4', name: 'Drink Water', icon: '💧', streak: 30, completedToday: false },
      ]
    } catch { return [] }
  })

  // Quick Links State
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(() => {
    try {
      const saved = localStorage.getItem('focus-links')
      return saved ? JSON.parse(saved) : [
        { id: '1', name: 'GitHub', url: 'https://github.com', color: '#333' },
        { id: '2', name: 'ChatGPT', url: 'https://chat.openai.com', color: '#10a37f' },
        { id: '3', name: 'YouTube', url: 'https://youtube.com', color: '#ff0000' },
        { id: '4', name: 'Google', url: 'https://google.com', color: '#4285f4' },
      ]
    } catch { return [] }
  })
  const [newLinkName, setNewLinkName] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')

  // Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0')
  const [calcPrevious, setCalcPrevious] = useState('')
  const [calcOperator, setCalcOperator] = useState('')

  // Quote State
  const [currentQuote, setCurrentQuote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)])

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  const accent = ACCENT_COLORS.find(c => c.id === accentColor) || ACCENT_COLORS[0]

  // Fetch real weather data with extended info
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeatherLoading(true)
        // Get city coordinates first
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
        const geoData = await geoRes.json()

        if (geoData.results && geoData.results.length > 0) {
          const { latitude, longitude, name, country, timezone } = geoData.results[0]

          // Fetch comprehensive weather data
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,precipitation&daily=sunrise,sunset,uv_index_max&timezone=auto`
          )
          const weatherData = await weatherRes.json()

          if (weatherData.current) {
            const weatherCode = weatherData.current.weather_code
            const condition = getWeatherCondition(weatherCode)

            // Format sunrise/sunset times
            const sunrise = weatherData.daily?.sunrise?.[0]
              ? new Date(weatherData.daily.sunrise[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
              : '6:00 AM'
            const sunset = weatherData.daily?.sunset?.[0]
              ? new Date(weatherData.daily.sunset[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
              : '6:00 PM'

            setWeather({
              temp: Math.round(weatherData.current.temperature_2m),
              condition,
              icon: getWeatherIcon(condition),
              humidity: weatherData.current.relative_humidity_2m,
              wind: Math.round(weatherData.current.wind_speed_10m),
              feelsLike: Math.round(weatherData.current.apparent_temperature),
              description: condition,
              sunrise,
              sunset,
              uvIndex: weatherData.daily?.uv_index_max?.[0] || 0,
              visibility: 10,
              pressure: Math.round(weatherData.current.surface_pressure || 1013),
              windDirection: weatherData.current.wind_direction_10m || 0,
              precipitation: weatherData.current.precipitation || 0,
              cityName: name,
              country: country,
              timezone: timezone || 'UTC'
            })
          }
        }
      } catch (error) {
        console.error('Weather fetch error:', error)
        setWeather({
          temp: 24, condition: 'Clear', icon: Sun, humidity: 45, wind: 12, feelsLike: 24, description: 'Clear sky',
          sunrise: '6:00 AM', sunset: '6:00 PM', uvIndex: 5, visibility: 10, pressure: 1013, windDirection: 0,
          precipitation: 0, cityName: city, country: '', timezone: 'UTC'
        })
      } finally {
        setWeatherLoading(false)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 300000) // Refresh every 5 minutes for real-time feel
    return () => clearInterval(interval)
  }, [city])

  // Weather code to condition
  const getWeatherCondition = (code: number): string => {
    if (code === 0) return 'Clear'
    if (code <= 3) return 'Partly Cloudy'
    if (code <= 48) return 'Foggy'
    if (code <= 57) return 'Drizzle'
    if (code <= 67) return 'Rain'
    if (code <= 77) return 'Snow'
    if (code <= 82) return 'Rain Showers'
    if (code <= 86) return 'Snow Showers'
    if (code >= 95) return 'Thunderstorm'
    return 'Clear'
  }

  // Save states to localStorage
  useEffect(() => { localStorage.setItem('focus-user-name', userName) }, [userName])
  useEffect(() => { localStorage.setItem('focus-city', city) }, [city])
  useEffect(() => { localStorage.setItem('focus-tasks', JSON.stringify(tasks)) }, [tasks])
  useEffect(() => { localStorage.setItem('focus-notes', JSON.stringify(notes)) }, [notes])
  useEffect(() => { localStorage.setItem('focus-wallpaper', wallpaper) }, [wallpaper])
  useEffect(() => { localStorage.setItem('focus-sessions', String(focusSessions)) }, [focusSessions])
  useEffect(() => { localStorage.setItem('focus-accent', accentColor) }, [accentColor])
  useEffect(() => { localStorage.setItem('focus-avatar', selectedAvatar) }, [selectedAvatar])
  useEffect(() => { localStorage.setItem('focus-clock-style', clockStyle) }, [clockStyle])
  useEffect(() => { localStorage.setItem('focus-clock-format', clockFormat) }, [clockFormat])
  useEffect(() => { localStorage.setItem('focus-habits', JSON.stringify(habits)) }, [habits])
  useEffect(() => { localStorage.setItem('focus-links', JSON.stringify(quickLinks)) }, [quickLinks])

  // Keyboard shortcut for lock screen (Cmd+L or Ctrl+L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault()
        setIsLocked(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // ============================================================================
  // CLOUD SYNC - Load data from Firestore on mount
  // ============================================================================
  useEffect(() => {
    const loadCloudData = async () => {
      if (!currentUser?.uid || dataLoadedRef.current) return

      try {
        setCloudError(false)
        const cloudData = await loadUserData(currentUser.uid)

        if (cloudData) {
          dataLoadedRef.current = true
          // Load tasks
          if (cloudData.tasks && cloudData.tasks.length > 0) {
            setTasks(cloudData.tasks.map(t => ({ ...t, priority: t.priority || 'medium' })))
          }
          // Load notes - handle both string and array formats
          if (cloudData.notes) {
            if (typeof cloudData.notes === 'string') {
              setNotes([{ id: '1', text: cloudData.notes, color: '#fbbf24' }])
            }
          }
          // Load habits
          if (cloudData.habits && cloudData.habits.length > 0) {
            setHabits(cloudData.habits.map(h => ({
              id: h.id,
              name: h.name,
              icon: '⭐',
              streak: 0,
              completedToday: h.completed
            })))
          }
          // Load quick links
          if (cloudData.quickLinks && cloudData.quickLinks.length > 0) {
            setQuickLinks(cloudData.quickLinks.map(l => ({ ...l, color: '#4285f4' })))
          }
          // Load preferences
          if (cloudData.preferences) {
            if (cloudData.preferences.wallpaper) setWallpaper(cloudData.preferences.wallpaper)
            if (cloudData.preferences.accentColor) setAccentColor(cloudData.preferences.accentColor)
            if (cloudData.preferences.avatar) setSelectedAvatar(cloudData.preferences.avatar)
            if (cloudData.preferences.city) setCity(cloudData.preferences.city)
          }
          // Load focus sessions
          if (cloudData.focusSessions) setFocusSessions(cloudData.focusSessions)
        }
      } catch (error) {
        console.error('Cloud load error:', error)
        setCloudError(true)
      }
    }

    loadCloudData()
  }, [currentUser?.uid])

  // ============================================================================
  // CLOUD SYNC - Sync data to Firestore when changed (debounced)
  // ============================================================================
  useEffect(() => {
    if (!currentUser?.uid || !dataLoadedRef.current) return
    const timer = setTimeout(() => {
      setCloudSyncing(true)
      syncTasks(currentUser.uid, tasks.map(t => ({ id: t.id, text: t.text, completed: t.completed, priority: t.priority || 'medium' })))
        .finally(() => setCloudSyncing(false))
    }, 1000)
    return () => clearTimeout(timer)
  }, [tasks, currentUser?.uid])

  useEffect(() => {
    if (!currentUser?.uid || !dataLoadedRef.current) return
    const timer = setTimeout(() => {
      syncNotes(currentUser.uid, notes.map(n => n.text).join('\n'))
    }, 1000)
    return () => clearTimeout(timer)
  }, [notes, currentUser?.uid])

  useEffect(() => {
    if (!currentUser?.uid || !dataLoadedRef.current) return
    const timer = setTimeout(() => {
      syncHabits(currentUser.uid, habits.map(h => ({ id: h.id, name: h.name, completed: h.completedToday })))
    }, 1000)
    return () => clearTimeout(timer)
  }, [habits, currentUser?.uid])

  useEffect(() => {
    if (!currentUser?.uid || !dataLoadedRef.current) return
    const timer = setTimeout(() => {
      syncQuickLinks(currentUser.uid, quickLinks.map(l => ({ id: l.id, name: l.name, url: l.url })))
    }, 1000)
    return () => clearTimeout(timer)
  }, [quickLinks, currentUser?.uid])

  useEffect(() => {
    if (!currentUser?.uid || !dataLoadedRef.current) return
    const timer = setTimeout(() => {
      syncPreferences(currentUser.uid, { wallpaper, accentColor, avatar: selectedAvatar, city })
    }, 1000)
    return () => clearTimeout(timer)
  }, [wallpaper, accentColor, selectedAvatar, city, currentUser?.uid])

  useEffect(() => {
    if (!currentUser?.uid || !dataLoadedRef.current) return
    syncFocusSessions(currentUser.uid, focusSessions)
  }, [focusSessions, currentUser?.uid])

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
    if (clockFormat === '24') {
      const hours = String(time.getHours()).padStart(2, '0')
      const mins = String(time.getMinutes()).padStart(2, '0')
      return `${hours}:${mins}`
    }
    const hours = time.getHours() % 12 || 12
    const mins = String(time.getMinutes()).padStart(2, '0')
    const ampm = time.getHours() >= 12 ? 'PM' : 'AM'
    return `${hours}:${mins} ${ampm}`
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatStopwatchTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const ms = Math.floor((seconds % 1) * 100);

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  const formatDate = () => time.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase()

  // Search cities for autocomplete
  const searchCities = async (query: string) => {
    if (query.length < 2) {
      setCitySuggestions([])
      return
    }
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en`)
      const data = await res.json()
      if (data.results) {
        setCitySuggestions(data.results.map((r: { name: string; country: string; latitude: number; longitude: number }) => ({
          name: r.name,
          country: r.country,
          lat: r.latitude,
          lon: r.longitude
        })))
        setShowCitySuggestions(true)
      }
    } catch (error) {
      console.error('City search error:', error)
    }
  }

  const handleCityInput = (value: string) => {
    setCity(value)
    if (citySearchTimeout) clearTimeout(citySearchTimeout)
    const timeout = window.setTimeout(() => searchCities(value), 300)
    setCitySearchTimeout(timeout)
  }

  const selectCity = (cityName: string, country: string) => {
    setCity(`${cityName}, ${country}`)
    setCitySuggestions([])
    setShowCitySuggestions(false)
  }

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

  // Calculator functions
  const calcInput = (val: string) => {
    if (calcDisplay === '0' || calcDisplay === 'Error') setCalcDisplay(val)
    else setCalcDisplay(calcDisplay + val)
  }
  const calcClear = () => { setCalcDisplay('0'); setCalcPrevious(''); setCalcOperator('') }
  const calcOperation = (op: string) => { setCalcPrevious(calcDisplay); setCalcOperator(op); setCalcDisplay('0') }
  const calcEquals = () => {
    if (!calcPrevious || !calcOperator) return
    const prev = parseFloat(calcPrevious), curr = parseFloat(calcDisplay)
    let result: number
    switch (calcOperator) {
      case '+': result = prev + curr; break
      case '-': result = prev - curr; break
      case '×': result = prev * curr; break
      case '÷': result = curr !== 0 ? prev / curr : NaN; break
      default: return
    }
    setCalcDisplay(isNaN(result) ? 'Error' : String(result))
    setCalcPrevious(''); setCalcOperator('')
  }

  // Toggle habit
  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completedToday: !h.completedToday, streak: !h.completedToday ? h.streak + 1 : Math.max(0, h.streak - 1) } : h))
  }

  // Add quick link
  const addQuickLink = () => {
    if (newLinkName.trim() && newLinkUrl.trim()) {
      const colors = ['#3b82f6', '#22c55e', '#f97316', '#ec4899', '#8b5cf6']
      setQuickLinks(prev => [...prev, { id: Date.now().toString(), name: newLinkName.trim(), url: newLinkUrl.startsWith('http') ? newLinkUrl : `https://${newLinkUrl}`, color: colors[Math.floor(Math.random() * colors.length)] }])
      setNewLinkName(''); setNewLinkUrl('')
    }
  }

  // Shuffle quote
  const shuffleQuote = () => setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])

  // Open fullscreen with animation
  const openFullscreen = (widget: FullscreenWidget) => {
    setIsAnimating(true)
    setFullscreenWidget(widget)
    setTimeout(() => setIsAnimating(false), 300)
  }

  // Close fullscreen with animation
  const closeFullscreen = () => {
    setIsAnimating(true)
    setTimeout(() => { setFullscreenWidget(null); setIsAnimating(false) }, 200)
  }

  // Analytics stats (computed)
  const stats = {
    tasksCompleted: tasks.filter(t => t.completed).length,
    totalTasks: tasks.length,
    focusTime: Math.round(focusSessions * 25 / 60 * 10) / 10,
    productivity: tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0,
    streak: Math.max(...habits.map(h => h.streak), 0),
    habitsCompleted: habits.filter(h => h.completedToday).length,
  }

  // Fullscreen Widget Renderer
  const renderFullscreenWidget = () => {
    if (!fullscreenWidget) return null
    const closeBtn = (
      <button onClick={closeFullscreen} style={{ position: 'absolute', top: 24, right: 24, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 16, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', transition: 'all 0.2s', zIndex: 10 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
        <X size={22} />
      </button>
    )
    const containerStyle = {
      position: 'fixed' as const, inset: 0, zIndex: 200,
      background: 'rgba(10,10,20,0.95)', backdropFilter: 'blur(30px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40,
      animation: isAnimating ? 'fadeIn 0.3s ease-out' : 'none',
      opacity: isAnimating && !fullscreenWidget ? 0 : 1,
      transition: 'opacity 0.2s ease-out'
    }
    const panelStyle = {
      background: 'linear-gradient(135deg, rgba(30,30,50,0.9), rgba(20,20,35,0.95))',
      borderRadius: 32, border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 100px rgba(59,130,246,0.1)',
      animation: isAnimating ? 'scaleIn 0.3s ease-out' : 'none',
      transform: isAnimating && !fullscreenWidget ? 'scale(0.95)' : 'scale(1)',
      transition: 'transform 0.2s ease-out'
    }
    return (
      <div style={containerStyle} onClick={closeFullscreen}>
        <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '95vw', maxHeight: '90vh' }}>
          {closeBtn}
          {fullscreenWidget === 'clock' && (
            <div style={{ ...panelStyle, padding: 50, textAlign: 'center', minWidth: 750, minHeight: 550, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {/* Clock Style Selector */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 40 }}>
                {['digital', 'analog', 'minimal', 'flip', 'binary'].map(style => (
                  <button key={style} onClick={() => setClockStyle(style)} style={{ padding: '10px 20px', background: clockStyle === style ? accent.primary : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 12, color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}>{style}</button>
                ))}
              </div>

              {/* Digital Clock */}
              {clockStyle === 'digital' && (
                <div>
                  <div style={{ fontSize: 160, fontWeight: 100, letterSpacing: -8, background: `linear-gradient(135deg, ${accent.primary}, ${accent.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, fontFamily: 'monospace' }}>{formatTime12()}</div>
                  <div style={{ fontSize: 32, letterSpacing: 8, color: 'rgba(255,255,255,0.4)', marginTop: 20, fontWeight: 300 }}>{formatDate()}</div>
                </div>
              )}

              {/* Analog Clock - Enhanced with hour numbers */}
              {clockStyle === 'analog' && (
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 340, height: 340, borderRadius: '50%', border: `4px solid ${accent.primary}`, margin: '0 auto', position: 'relative', background: 'radial-gradient(circle, rgba(30,30,50,0.9) 0%, rgba(10,10,20,0.95) 100%)', boxShadow: `0 0 60px ${accent.primary}30, inset 0 0 60px rgba(0,0,0,0.5)` }}>
                    {/* Hour Numbers */}
                    {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
                      const angle = (i * 30 - 90) * (Math.PI / 180)
                      const radius = 130
                      const x = Math.cos(angle) * radius
                      const y = Math.sin(angle) * radius
                      return (
                        <div key={num} style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`, fontSize: 22, fontWeight: 600, color: num % 3 === 0 ? accent.primary : 'rgba(255,255,255,0.8)' }}>{num}</div>
                      )
                    })}
                    {/* Minute markers */}
                    {[...Array(60)].map((_, i) => (
                      <div key={i} style={{ position: 'absolute', top: '50%', left: '50%', width: i % 5 === 0 ? 3 : 1, height: i % 5 === 0 ? 12 : 6, background: i % 5 === 0 ? 'white' : 'rgba(255,255,255,0.3)', borderRadius: 2, transformOrigin: '50% 0', transform: `translate(-50%, -165px) rotate(${i * 6}deg)` }} />
                    ))}
                    {/* Hour hand */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: 8, height: 85, background: 'linear-gradient(to top, white, rgba(255,255,255,0.8))', borderRadius: 6, transformOrigin: '50% 100%', transform: `translate(-50%, -100%) rotate(${(time.getHours() % 12) * 30 + time.getMinutes() * 0.5}deg)`, boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }} />
                    {/* Minute hand */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: 5, height: 120, background: `linear-gradient(to top, ${accent.primary}, ${accent.secondary})`, borderRadius: 4, transformOrigin: '50% 100%', transform: `translate(-50%, -100%) rotate(${time.getMinutes() * 6}deg)`, boxShadow: `0 2px 10px ${accent.primary}50` }} />
                    {/* Second hand */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: 2, height: 140, background: '#ef4444', borderRadius: 4, transformOrigin: '50% 100%', transform: `translate(-50%, -100%) rotate(${time.getSeconds() * 6}deg)` }} />
                    {/* Center dot */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: 20, height: 20, background: accent.primary, borderRadius: '50%', transform: 'translate(-50%, -50%)', boxShadow: `0 0 20px ${accent.primary}` }} />
                  </div>
                  {/* Digital time below analog */}
                  <div style={{ marginTop: 24, fontSize: 20, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{formatTime12()}</div>
                </div>
              )}

              {/* Minimal Clock */}
              {clockStyle === 'minimal' && (
                <div>
                  <div style={{ fontSize: 200, fontWeight: 100, color: 'white', lineHeight: 1, letterSpacing: -10 }}>{clockFormat === '24' ? String(time.getHours()).padStart(2, '0') : String(time.getHours() % 12 || 12).padStart(2, '0')}</div>
                  <div style={{ fontSize: 200, fontWeight: 100, color: accent.primary, lineHeight: 1, letterSpacing: -10, marginTop: -20 }}>{String(time.getMinutes()).padStart(2, '0')}</div>
                  {clockFormat === '12' && <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.4)', marginTop: 10 }}>{time.getHours() >= 12 ? 'PM' : 'AM'}</div>}
                </div>
              )}

              {/* Flip Clock */}
              {clockStyle === 'flip' && (
                <div style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'center' }}>
                  {[String(clockFormat === '24' ? time.getHours() : (time.getHours() % 12 || 12)).padStart(2, '0').split(''), String(time.getMinutes()).padStart(2, '0').split(''), String(time.getSeconds()).padStart(2, '0').split('')].flat().map((digit, i) => (
                    <div key={i} style={{ width: 80, height: 120, background: 'linear-gradient(180deg, #1a1a2e 0%, #1a1a2e 49%, #0a0a14 50%, #0a0a14 100%)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, fontWeight: 700, fontFamily: 'monospace', color: i >= 4 ? accent.primary : 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                      {digit}
                    </div>
                  ))}
                </div>
              )}

              {/* Binary Clock */}
              {clockStyle === 'binary' && (
                <div style={{ display: 'flex', gap: 30, justifyContent: 'center' }}>
                  {[clockFormat === '24' ? time.getHours() : (time.getHours() % 12 || 12), time.getMinutes(), time.getSeconds()].map((val, col) => (
                    <div key={col} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{['HRS', 'MIN', 'SEC'][col]}</div>
                      {[...Array(6)].map((_, row) => (
                        <div key={row} style={{ width: 40, height: 40, borderRadius: 8, background: (val >> (5 - row)) & 1 ? accent.primary : 'rgba(255,255,255,0.1)', boxShadow: (val >> (5 - row)) & 1 ? `0 0 20px ${accent.primary}` : 'none', transition: 'all 0.2s' }} />
                      ))}
                      <div style={{ fontSize: 24, fontWeight: 600, marginTop: 8 }}>{String(val).padStart(2, '0')}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Weather & Location Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 40, padding: '20px 32px', background: 'rgba(255,255,255,0.05)', borderRadius: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={22} style={{ color: accent.primary }} /><span style={{ fontSize: 20 }}>{weather.cityName || city}</span></div>
                <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.2)' }} />
                {weatherLoading ? <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>Loading...</span> : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><weather.icon size={26} style={{ color: '#fbbf24' }} /><span style={{ fontSize: 22, fontWeight: 500 }}>{weather.temp}°C</span></div>
                )}
              </div>
            </div>
          )}
          {fullscreenWidget === 'tasks' && (
            <div style={{ ...panelStyle, width: 700, height: '75vh', padding: 32, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}><CheckSquare size={28} style={{ color: accent.primary }} /><h2 style={{ fontSize: 28, fontWeight: 600 }}>Task Manager Pro</h2></div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="What needs to be done?" style={{ flex: 1, padding: '16px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, color: 'white', fontSize: 16, outline: 'none' }} />
                <button onClick={addTask} style={{ padding: '16px 28px', background: accent.primary, border: 'none', borderRadius: 16, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Add Task</button>
              </div>
              <div style={{ flex: 1, overflow: 'auto', paddingRight: 8 }}>
                {tasks.map((task, i) => (
                  <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, marginBottom: 10, opacity: task.completed ? 0.5 : 1, animation: `slideIn 0.3s ease-out ${i * 0.05}s both` }}>
                    <div onClick={() => setTasks(prev => prev.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))} style={{ width: 28, height: 28, borderRadius: 10, border: '2px solid', borderColor: task.completed ? '#22c55e' : 'rgba(255,255,255,0.3)', background: task.completed ? '#22c55e' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>{task.completed && <Check size={16} />}</div>
                    <span style={{ flex: 1, fontSize: 17, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'rgba(255,255,255,0.4)' : 'white' }}>{task.text}</span>
                    <Trash2 size={18} style={{ opacity: 0.3, cursor: 'pointer' }} onClick={() => setTasks(prev => prev.filter(t => t.id !== task.id))} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, display: 'flex', justifyContent: 'space-around' }}>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 600, color: '#22c55e' }}>{stats.tasksCompleted}</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Completed</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 600, color: '#f97316' }}>{pendingTasks}</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Pending</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 600, color: accent.primary }}>{stats.productivity}%</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Progress</div></div>
              </div>
            </div>
          )}
          {fullscreenWidget === 'focus' && (
            <div style={{ ...panelStyle, padding: 48, textAlign: 'center' }}>
              <div style={{ width: 320, height: 320, borderRadius: '50%', margin: '0 auto', position: 'relative', background: `conic-gradient(${accent.primary} ${(1 - focusTimeLeft / (focusDuration * 60)) * 360}deg, rgba(255,255,255,0.1) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', inset: 12, borderRadius: '50%', background: 'rgba(20,20,35,0.98)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 72, fontWeight: 200, letterSpacing: 4, fontFamily: 'monospace' }}>{String(Math.floor(focusTimeLeft / 60)).padStart(2, '0')}:{String(focusTimeLeft % 60).padStart(2, '0')}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 8, letterSpacing: 2 }}>SESSION {focusSessions + 1}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
                {[25, 5, 15, 45, 60].map(m => (
                  <button key={m} onClick={() => { setFocusDuration(m); setFocusTimeLeft(m * 60); setFocusRunning(false) }} style={{ padding: '14px 24px', background: focusDuration === m ? accent.primary : 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 14, color: 'white', fontSize: 16, cursor: 'pointer', transition: 'all 0.2s' }}>{m}m</button>
                ))}
              </div>
              <button onClick={() => setFocusRunning(!focusRunning)} style={{ marginTop: 24, padding: '18px 56px', background: focusRunning ? '#ea580c' : '#22c55e', border: 'none', borderRadius: 18, color: 'white', fontSize: 18, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 12, transition: 'all 0.2s' }}>
                {focusRunning ? <><Pause size={22} /> Pause</> : <><Play size={22} /> Start Focus</>}
              </button>
            </div>
          )}
          {fullscreenWidget === 'weather' && (
            <div style={{ ...panelStyle, padding: 0, minWidth: 800, maxWidth: 900, minHeight: 600, overflow: 'hidden' }}>
              {weatherLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 500 }}>
                  <RefreshCw size={48} style={{ color: accent.primary, animation: 'spin 1s linear infinite' }} />
                  <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', marginTop: 20 }}>Fetching weather data...</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Header with location */}
                  <div style={{ padding: '24px 32px', background: `linear-gradient(135deg, ${accent.primary}20, ${accent.secondary}20)`, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <MapPin size={24} style={{ color: accent.primary }} />
                        <div>
                          <div style={{ fontSize: 22, fontWeight: 600 }}>{weather.cityName || city.split(',')[0]}</div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{weather.country || city.split(',')[1] || ''}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                        <div>Last updated</div>
                        <div style={{ color: 'rgba(255,255,255,0.7)' }}>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  </div>

                  {/* Main weather display */}
                  <div style={{ padding: '40px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
                    <weather.icon size={120} style={{ color: '#fbbf24' }} />
                    <div>
                      <div style={{ fontSize: 96, fontWeight: 200, lineHeight: 1, background: `linear-gradient(135deg, white, ${accent.primary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{weather.temp}°</div>
                      <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{weather.condition}</div>
                      <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>Feels like {weather.feelsLike}°C</div>
                    </div>
                  </div>

                  {/* Sunrise & Sunset */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 60, padding: '20px 32px', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sunrise size={28} style={{ color: 'white' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>Sunrise</div>
                        <div style={{ fontSize: 22, fontWeight: 600 }}>{weather.sunrise}</div>
                      </div>
                    </div>
                    <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #f97316, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sunset size={28} style={{ color: 'white' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>Sunset</div>
                        <div style={{ fontSize: 22, fontWeight: 600 }}>{weather.sunset}</div>
                      </div>
                    </div>
                  </div>

                  {/* Weather details grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(255,255,255,0.05)', margin: '24px 32px', borderRadius: 20, overflow: 'hidden' }}>
                    <div style={{ padding: 24, background: 'rgba(20,20,35,0.8)', textAlign: 'center' }}>
                      <Cloud size={28} style={{ color: '#60a5fa', marginBottom: 12 }} />
                      <div style={{ fontSize: 24, fontWeight: 600 }}>{weather.humidity}%</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Humidity</div>
                    </div>
                    <div style={{ padding: 24, background: 'rgba(20,20,35,0.8)', textAlign: 'center' }}>
                      <Wind size={28} style={{ color: '#22d3ee', marginBottom: 12 }} />
                      <div style={{ fontSize: 24, fontWeight: 600 }}>{weather.wind} km/h</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Wind Speed</div>
                    </div>
                    <div style={{ padding: 24, background: 'rgba(20,20,35,0.8)', textAlign: 'center' }}>
                      <Thermometer size={28} style={{ color: '#f472b6', marginBottom: 12 }} />
                      <div style={{ fontSize: 24, fontWeight: 600 }}>{weather.pressure} hPa</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Pressure</div>
                    </div>
                    <div style={{ padding: 24, background: 'rgba(20,20,35,0.8)', textAlign: 'center' }}>
                      <Sun size={28} style={{ color: '#fbbf24', marginBottom: 12 }} />
                      <div style={{ fontSize: 24, fontWeight: 600 }}>{weather.uvIndex}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>UV Index</div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ padding: '16px 32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Weather data updates every 5 minutes</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Powered by Open-Meteo API</div>
                  </div>
                </div>
              )}
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
          <div style={{ ...panelStyle, padding: 48 }}>
            <h2 style={{ fontSize: 28, marginBottom: 32, textAlign: 'center' }}>📅 {time.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, maxWidth: 500, margin: '0 auto' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: 8, fontSize: 13 }}>{d}</div>)}
              {Array.from({ length: new Date(time.getFullYear(), time.getMonth(), 1).getDay() }, (_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: new Date(time.getFullYear(), time.getMonth() + 1, 0).getDate() }, (_, i) => (
                <div key={i} style={{ textAlign: 'center', padding: 14, background: i + 1 === time.getDate() ? accent.primary : 'rgba(255,255,255,0.05)', borderRadius: 12, fontWeight: i + 1 === time.getDate() ? 600 : 400, cursor: 'pointer', transition: 'all 0.2s' }}>{i + 1}</div>
              ))}
            </div>
          </div>
        )}
        {fullscreenWidget === 'calculator' && (
          <div style={{ ...panelStyle, padding: 32, width: 320 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}><Calculator size={24} style={{ color: accent.primary }} /><h2 style={{ fontSize: 22, fontWeight: 600 }}>Calculator</h2></div>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', minHeight: 20 }}>{calcPrevious} {calcOperator}</div>
              <div style={{ fontSize: 40, fontWeight: 300, textAlign: 'right', fontFamily: 'monospace' }}>{calcDisplay}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map(btn => (
                <button key={btn} onClick={() => {
                  if (btn === 'C') calcClear()
                  else if (btn === '=') calcEquals()
                  else if (['+', '-', '×', '÷'].includes(btn)) calcOperation(btn)
                  else if (btn === '±') setCalcDisplay(d => d.startsWith('-') ? d.slice(1) : '-' + d)
                  else if (btn === '%') setCalcDisplay(d => String(parseFloat(d) / 100))
                  else calcInput(btn)
                }} style={{ padding: btn === '0' ? '18px 24px' : 18, gridColumn: btn === '0' ? 'span 2' : 'span 1', background: ['÷', '×', '-', '+', '='].includes(btn) ? accent.primary : btn === 'C' ? '#ef4444' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 12, color: 'white', fontSize: 20, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}>{btn}</button>
              ))}
            </div>
          </div>
        )}
        {fullscreenWidget === 'habits' && (
          <div style={{ ...panelStyle, padding: 32, width: 500, maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}><Target size={24} style={{ color: accent.primary }} /><h2 style={{ fontSize: 24, fontWeight: 600 }}>Habit Tracker</h2></div>
            {habits.map(habit => (
              <div key={habit.id} onClick={() => toggleHabit(habit.id)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: habit.completedToday ? `${accent.primary}20` : 'rgba(255,255,255,0.03)', borderRadius: 16, marginBottom: 12, cursor: 'pointer', border: habit.completedToday ? `2px solid ${accent.primary}` : '2px solid transparent', transition: 'all 0.2s' }}>
                <span style={{ fontSize: 28 }}>{habit.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 500, textDecoration: habit.completedToday ? 'none' : 'none' }}>{habit.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}><Zap size={12} style={{ color: '#fbbf24' }} /> {habit.streak} day streak</div>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: 8, border: '2px solid', borderColor: habit.completedToday ? '#22c55e' : 'rgba(255,255,255,0.3)', background: habit.completedToday ? '#22c55e' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{habit.completedToday && <Check size={16} />}</div>
              </div>
            ))}
            <div style={{ marginTop: 20, padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 16, textAlign: 'center' }}><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Today's Progress</div><div style={{ fontSize: 28, fontWeight: 600, color: accent.primary, marginTop: 8 }}>{stats.habitsCompleted}/{habits.length}</div></div>
          </div>
        )}
        {fullscreenWidget === 'links' && (
          <div style={{ ...panelStyle, padding: 32, width: 500, maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}><Link size={24} style={{ color: accent.primary }} /><h2 style={{ fontSize: 24, fontWeight: 600 }}>Quick Links</h2></div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <input value={newLinkName} onChange={e => setNewLinkName(e.target.value)} placeholder="Name" style={{ flex: 1, padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', fontSize: 14, outline: 'none' }} />
              <input value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && addQuickLink()} placeholder="URL" style={{ flex: 2, padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', fontSize: 14, outline: 'none' }} />
              <button onClick={addQuickLink} style={{ padding: '14px 20px', background: accent.primary, border: 'none', borderRadius: 12, color: 'white', fontWeight: 600, cursor: 'pointer' }}>Add</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {quickLinks.map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: 14, textDecoration: 'none', color: 'white', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = link.color} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: link.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Link size={16} /></div>
                  <span style={{ fontWeight: 500 }}>{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        {fullscreenWidget === 'quotes' && (
          <div style={{ ...panelStyle, padding: 48, maxWidth: 600, textAlign: 'center' }}>
            <Quote size={48} style={{ color: accent.primary, marginBottom: 24, opacity: 0.5 }} />
            <div style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.6, fontStyle: 'italic', marginBottom: 24 }}>"{currentQuote.text}"</div>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>— {currentQuote.author}</div>
            <button onClick={shuffleQuote} style={{ marginTop: 32, padding: '14px 28px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 14, color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}><RotateCcw size={16} /> New Quote</button>
          </div>
        )}
        </div>
      </div>
    )
  }

  const widgetBase = { background: 'rgba(20,20,30,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, backdropFilter: 'blur(20px)', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative' as const }
  const widgetHover = { boxShadow: `0 0 40px ${accent.primary}40`, transform: 'translateY(-4px)', borderColor: `${accent.primary}50` }

  return (
    <div style={{ minHeight: '100vh', color: 'white', fontFamily: "'Inter', system-ui, sans-serif", position: 'relative' }}>
      {/* Lock Screen Overlay */}
      {isLocked && (
        <AdvancedLockScreen
          isLocked={isLocked}
          onUnlock={() => setIsLocked(false)}
          userName={userName}
          calendarEvents={[
            { id: '1', title: 'Daily Standup', time: '09:00 AM', color: '#3b82f6' },
            { id: '2', title: 'Lunch Break', time: '12:30 PM', color: '#10b981' },
            { id: '3', title: 'Team Sync', time: '03:00 PM', color: '#8b5cf6' },
          ]}
          notifications={tasks.filter(t => !t.completed).slice(0, 3).map((t: Task) => ({
            id: t.id,
            title: t.text,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          }))}
          pendingTasks={tasks.filter(t => !t.completed).slice(0, 6)}
          timerActive={timerActive}
          timerTime={formatTime(timerSeconds)}
          stopwatchActive={stopwatchRunning}
          stopwatchTime={formatStopwatchTime(stopwatchTime)}
        />
      )}

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
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 44, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          {['File', 'View', 'Window'].map(item => (
            <span key={item} style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '4px 8px', borderRadius: 4 }}>{item}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Cloud Sync Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: cloudError ? 1 : 0.6, fontSize: 12 }} title={cloudError ? 'Cloud sync error' : cloudSyncing ? 'Syncing...' : 'Cloud synced'}>
            {cloudError ? (
              <CloudOff size={15} style={{ color: '#ef4444' }} />
            ) : cloudSyncing ? (
              <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Cloud size={15} style={{ color: '#22c55e' }} />
            )}
          </div>
          <Wifi size={15} style={{ opacity: 0.6 }} />
          <Volume2 size={15} style={{ opacity: 0.6 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: 0.6, fontSize: 12 }}><Battery size={15} /> 100%</div>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{formatTime12()}</span>
          <button onClick={() => setIsLocked(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 12px', borderRadius: 6, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 0.2s', border: 'none', background: 'transparent' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }} title="Lock screen (Cmd+L)"><Lock size={16} style={{ marginRight: 4 }} /> Lock</button>
          <div onClick={() => setShowSettings(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${accent.primary}, ${accent.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
              {AVATARS.find(a => a.id === selectedAvatar)?.emoji || '👨‍🚀'}
            </div>
            <span style={{ fontSize: 13 }}>{userName}</span>
          </div>
        </div>
      </header>

      {/* Main Content with scroll */}
      <main style={{ position: 'relative', zIndex: 10, padding: '60px 28px 120px', maxWidth: 1500, margin: '0 auto', minHeight: '100vh' }}>
        {/* Motivational Quote Banner */}
        <div onClick={() => openFullscreen('quotes')} style={{ background: `linear-gradient(135deg, ${accent.primary}20, ${accent.secondary}10)`, border: `1px solid ${accent.primary}30`, borderRadius: 16, padding: '16px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.borderColor = accent.primary} onMouseLeave={e => e.currentTarget.style.borderColor = `${accent.primary}30`}>
          <Quote size={20} style={{ color: accent.primary, opacity: 0.6 }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.8)' }}>"{currentQuote.text}"</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginLeft: 8 }}>— {currentQuote.author}</span>
          </div>
          <RotateCcw size={16} style={{ opacity: 0.4 }} onClick={e => { e.stopPropagation(); shuffleQuote() }} />
        </div>

        {/* Quick Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
          {[
            { label: 'Tasks Done', value: stats.tasksCompleted, icon: CheckSquare, color: '#22c55e' },
            { label: 'Focus Time', value: `${stats.focusTime}h`, icon: Clock, color: accent.primary },
            { label: 'Productivity', value: `${stats.productivity}%`, icon: TrendingUp, color: '#a855f7' },
            { label: 'Habits', value: `${stats.habitsCompleted}/${habits.length}`, icon: Target, color: '#f97316' },
          ].map((stat, i) => (
            <div key={i} style={{ ...widgetBase, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }} onMouseEnter={e => Object.assign(e.currentTarget.style, { transform: 'translateY(-2px)', boxShadow: `0 8px 25px ${stat.color}30` })} onMouseLeave={e => Object.assign(e.currentTarget.style, { transform: 'translateY(0)', boxShadow: 'none' })}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 600 }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Widget Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 20 }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Clock + Weather Widget */}
            <div onClick={() => openFullscreen('clock')} style={{ background: `linear-gradient(135deg, ${accent.primary} 0%, ${accent.secondary} 50%, #2563eb 100%)`, borderRadius: 20, padding: 22, position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 50px ${accent.primary}50` }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 48, fontWeight: 300, letterSpacing: -2, lineHeight: 1 }}>{formatTime12()}</div>
                  <div style={{ fontSize: 12, letterSpacing: 2, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>{formatDate()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                    <MapPin size={13} style={{ color: 'rgba(255,255,255,0.7)' }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{city}</span>
                  </div>
                  {weatherLoading ? <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Loading...</span> : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <weather.icon size={20} style={{ color: '#fbbf24' }} />
                        <span style={{ fontSize: 18, fontWeight: 500 }}>{weather.temp}°C</span>
                      </div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{weather.condition}</div>
                    </>
                  )}
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 10, right: 14 }}><Maximize2 size={13} style={{ opacity: 0.4 }} /></div>
            </div>

            {/* Focus Timer Widget */}
            <div onClick={() => openFullscreen('focus')} style={{ ...widgetBase, padding: 18 }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => Object.assign(e.currentTarget.style, { boxShadow: 'none', transform: 'translateY(0)', borderColor: 'rgba(255,255,255,0.1)' })}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: 1 }}><Timer size={14} /> FOCUS TIMER</div>
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
            <div onClick={() => openFullscreen('stopwatch')} style={{ ...widgetBase, padding: 18 }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => Object.assign(e.currentTarget.style, { boxShadow: 'none', transform: 'translateY(0)', borderColor: 'rgba(255,255,255,0.1)' })}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: 1 }}><Clock size={14} /> STOPWATCH</div>
                <Maximize2 size={13} style={{ opacity: 0.4 }} />
              </div>
              <div style={{ textAlign: 'center', margin: '14px 0' }}>
                <span style={{ fontSize: 32, fontWeight: 300, letterSpacing: 2, fontFamily: 'monospace' }}>{String(Math.floor(stopwatchTime / 60000)).padStart(2, '0')}:{String(Math.floor((stopwatchTime % 60000) / 1000)).padStart(2, '0')}<span style={{ fontSize: 18, opacity: 0.6 }}>.{String(Math.floor((stopwatchTime % 1000) / 10)).padStart(2, '0')}</span></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                <button onClick={e => { e.stopPropagation(); setStopwatchRunning(false); setStopwatchTime(0); setLaps([]) }} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(40,40,60,0.8)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}><RotateCcw size={14} /></button>
                <button onClick={e => { e.stopPropagation(); setStopwatchRunning(!stopwatchRunning) }} style={{ width: 46, height: 46, borderRadius: '50%', background: stopwatchRunning ? '#ea580c' : accent.primary, border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>{stopwatchRunning ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: 2 }} />}</button>
                <button onClick={e => { e.stopPropagation(); if (stopwatchRunning) setLaps(prev => [stopwatchTime, ...prev]) }} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(40,40,60,0.8)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: stopwatchRunning ? 1 : 0.5, transition: 'all 0.2s' }}><Flag size={14} /></button>
              </div>
              {laps.length > 0 && <div style={{ marginTop: 10, fontSize: 10, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>{laps.length} lap{laps.length > 1 ? 's' : ''} recorded</div>}
            </div>
          </div>

          {/* Right Column - Task Manager */}
          <div onClick={() => openFullscreen('tasks')} style={{ ...widgetBase, height: 'fit-content', minHeight: 480, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => Object.assign(e.currentTarget.style, { boxShadow: 'none', transform: 'translateY(0)', borderColor: 'rgba(255,255,255,0.1)' })}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: accent.primary }}><CheckSquare size={18} /><span style={{ fontWeight: 600 }}>Task Manager Pro</span></div>
              <Maximize2 size={13} style={{ opacity: 0.4 }} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, padding: '18px 22px 6px' }}>{getGreeting()}, {userName}.</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', padding: '0 22px 16px' }}>You have {pendingTasks} pending task{pendingTasks !== 1 ? 's' : ''}. Let's crush it! 💪</div>
            <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 18px 14px', padding: '10px 14px', background: 'rgba(30,30,40,0.8)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
              <Plus size={16} style={{ opacity: 0.4 }} />
              <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="What needs to be done?" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: 13 }} />
              <button onClick={addTask} style={{ padding: '7px 14px', background: accent.primary, border: 'none', borderRadius: 8, color: 'white', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>ADD</button>
            </div>
            <div onClick={e => e.stopPropagation()} style={{ flex: 1, overflow: 'auto', padding: '0 18px 18px' }}>
              {tasks.length === 0 && <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: 24, fontSize: 13 }}>No tasks yet. Add one above! ✨</div>}
              {tasks.map(task => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 10, marginBottom: 6, background: 'rgba(30,30,45,0.5)', opacity: task.completed ? 0.5 : 1, transition: 'all 0.2s' }}>
                  <div onClick={() => setTasks(prev => prev.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))} style={{ width: 22, height: 22, borderRadius: 6, border: '2px solid', borderColor: task.completed ? '#22c55e' : 'rgba(255,255,255,0.3)', background: task.completed ? '#22c55e' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>{task.completed && <Check size={12} />}</div>
                  <span style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'rgba(255,255,255,0.4)' : 'white', fontSize: 13 }}>{task.text}</span>
                  <Trash2 size={13} style={{ opacity: 0.3, cursor: 'pointer', transition: 'opacity 0.2s' }} onClick={() => setTasks(prev => prev.filter(t => t.id !== task.id))} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '0.3'} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Widgets Row - First */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 20 }}>
          {/* Weather Widget */}
          <div onClick={() => openFullscreen('weather')} style={{ ...widgetBase, padding: 18, background: `linear-gradient(135deg, ${accent.primary}30, ${accent.secondary}20)` }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => Object.assign(e.currentTarget.style, { boxShadow: 'none', transform: 'translateY(0)', borderColor: 'rgba(255,255,255,0.1)' })}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>WEATHER</span>
              <Maximize2 size={13} style={{ opacity: 0.4 }} />
            </div>
            {weatherLoading ? <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Loading...</div> : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <weather.icon size={36} style={{ color: '#fbbf24' }} />
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 600 }}>{weather.temp}°</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{weather.condition}</div>
                  </div>
                </div>
                <div style={{ marginTop: 10, display: 'flex', gap: 14, fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
                  <span>💧 {weather.humidity}%</span>
                  <span>💨 {weather.wind}km/h</span>
                </div>
              </>
            )}
          </div>

          {/* Habits Widget */}
          <div onClick={() => openFullscreen('habits')} style={{ ...widgetBase, padding: 18 }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => Object.assign(e.currentTarget.style, { boxShadow: 'none', transform: 'translateY(0)', borderColor: 'rgba(255,255,255,0.1)' })}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>HABITS</span>
              <Maximize2 size={13} style={{ opacity: 0.4 }} />
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {habits.slice(0, 4).map(h => (
                <div key={h.id} onClick={e => { e.stopPropagation(); toggleHabit(h.id) }} style={{ width: 36, height: 36, borderRadius: 10, background: h.completedToday ? '#22c55e' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, cursor: 'pointer', transition: 'all 0.2s', border: h.completedToday ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>{h.icon}</div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{stats.habitsCompleted}/{habits.length} completed</div>
          </div>

          {/* Calculator Widget */}
          <div onClick={() => openFullscreen('calculator')} style={{ ...widgetBase, padding: 18 }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => Object.assign(e.currentTarget.style, { boxShadow: 'none', transform: 'translateY(0)', borderColor: 'rgba(255,255,255,0.1)' })}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>CALCULATOR</span>
              <Maximize2 size={13} style={{ opacity: 0.4 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${accent.primary}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calculator size={22} style={{ color: accent.primary }} /></div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 500, fontFamily: 'monospace' }}>{calcDisplay.slice(0, 8)}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Quick calc</div>
              </div>
            </div>
          </div>

          {/* Quick Links Widget */}
          <div onClick={() => openFullscreen('links')} style={{ ...widgetBase, padding: 18 }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => Object.assign(e.currentTarget.style, { boxShadow: 'none', transform: 'translateY(0)', borderColor: 'rgba(255,255,255,0.1)' })}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>QUICK LINKS</span>
              <Maximize2 size={13} style={{ opacity: 0.4 }} />
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {quickLinks.slice(0, 4).map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ width: 32, height: 32, borderRadius: 8, background: link.color, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}><Link size={14} style={{ color: 'white' }} /></a>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{quickLinks.length} links</div>
          </div>
        </div>

        {/* Bottom Widgets Row - Second */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 16, paddingBottom: 20 }}>
          {/* Notes Widget */}
          <div onClick={() => openFullscreen('notes')} style={{ ...widgetBase, padding: 18 }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => Object.assign(e.currentTarget.style, { boxShadow: 'none', transform: 'translateY(0)', borderColor: 'rgba(255,255,255,0.1)' })}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>NOTES</span>
              <Maximize2 size={13} style={{ opacity: 0.4 }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {notes.slice(0, 2).map(note => (
                <div key={note.id} style={{ padding: '6px 10px', background: note.color, borderRadius: 6, color: '#1a1a2e', fontSize: 10, fontWeight: 500, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.text.slice(0, 15)}...</div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{notes.length} notes</div>
          </div>

          {/* Music Widget */}
          <div onClick={() => openFullscreen('music')} style={{ ...widgetBase, padding: 18 }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => Object.assign(e.currentTarget.style, { boxShadow: 'none', transform: 'translateY(0)', borderColor: 'rgba(255,255,255,0.1)' })}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>MUSIC</span>
              <Maximize2 size={13} style={{ opacity: 0.4 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: isPlaying ? 'spin 4s linear infinite' : 'none' }}><Music size={18} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tracks[currentTrack].title}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{tracks[currentTrack].artist}</div>
              </div>
            </div>
            <div onClick={e => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 12 }}>
              <button onClick={() => setCurrentTrack(p => p === 0 ? tracks.length - 1 : p - 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.5, fontSize: 12 }}>⏮</button>
              <button onClick={() => setIsPlaying(!isPlaying)} style={{ width: 32, height: 32, borderRadius: '50%', background: '#ec4899', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: 2 }} />}</button>
              <button onClick={() => setCurrentTrack(p => p === tracks.length - 1 ? 0 : p + 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.5, fontSize: 12 }}>⏭</button>
            </div>
          </div>

          {/* Calendar Widget */}
          <div onClick={() => openFullscreen('calendar')} style={{ ...widgetBase, padding: 18 }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => Object.assign(e.currentTarget.style, { boxShadow: 'none', transform: 'translateY(0)', borderColor: 'rgba(255,255,255,0.1)' })}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>CALENDAR</span>
              <Maximize2 size={13} style={{ opacity: 0.4 }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>{time.toLocaleDateString('en-US', { month: 'long' })}</div>
              <div style={{ fontSize: 40, fontWeight: 600, lineHeight: 1, color: accent.primary }}>{time.getDate()}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{time.toLocaleDateString('en-US', { weekday: 'long' })}</div>
            </div>
          </div>

          {/* Analytics Widget */}
          <div onClick={() => openFullscreen('analytics')} style={{ ...widgetBase, padding: 18 }} onMouseEnter={e => Object.assign(e.currentTarget.style, widgetHover)} onMouseLeave={e => Object.assign(e.currentTarget.style, { boxShadow: 'none', transform: 'translateY(0)', borderColor: 'rgba(255,255,255,0.1)' })}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>ANALYTICS</span>
              <Maximize2 size={13} style={{ opacity: 0.4 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#06b6d420', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BarChart3 size={22} style={{ color: '#06b6d4' }} /></div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#06b6d4' }}>{stats.productivity}%</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Productivity</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Dock */}
      <div style={{ position: 'fixed', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, padding: '10px 20px', background: 'rgba(10,10,20,0.7)', backdropFilter: 'blur(25px)', borderRadius: 22, border: '1px solid rgba(255,255,255,0.1)', zIndex: 50, boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
        {[
          { id: 'dashboard', icon: LayoutGrid, color: accent.primary, label: 'Dashboard' },
          { id: 'tasks', icon: CheckSquare, color: '#22c55e', label: 'Tasks' },
          { id: 'focus', icon: Timer, color: '#f97316', label: 'Focus' },
          { id: 'habits', icon: Target, color: '#a855f7', label: 'Habits' },
          { id: 'calculator', icon: Calculator, color: '#06b6d4', label: 'Calculator' },
          { id: 'music', icon: Music, color: '#ec4899', label: 'Music' },
          { id: 'calendar', icon: Calendar, color: '#8b5cf6', label: 'Calendar' },
          { id: 'notes', icon: StickyNote, color: '#fbbf24', label: 'Notes' },
          { id: 'links', icon: Link, color: '#22d3ee', label: 'Links' },
          { id: 'analytics', icon: BarChart3, color: '#14b8a6', label: 'Analytics' },
          { id: 'quotes', icon: Quote, color: '#f472b6', label: 'Quotes' },
          { id: 'settings', icon: Settings, color: '#6b7280', label: 'Settings' },
        ].map(item => (
          <div key={item.id} onClick={() => item.id === 'settings' ? setShowSettings(true) : item.id === 'dashboard' ? null : openFullscreen(item.id as FullscreenWidget)} title={item.label} style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: activeNav === item.id ? item.color : 'rgba(255,255,255,0.06)', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative' }} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2) translateY(-10px)'; e.currentTarget.style.background = item.color; e.currentTarget.style.boxShadow = `0 8px 25px ${item.color}60` }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = activeNav === item.id ? item.color : 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none' }}>
            <item.icon size={20} />
          </div>
        ))}
      </div>

      {/* Fullscreen Widget */}
      {renderFullscreenWidget()}

      {/* Settings Panel */}
      {showSettings && (
        <>
          <div onClick={() => setShowSettings(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99, backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease-out' }} />
          <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 400, background: 'rgba(15,15,25,0.98)', borderLeft: `1px solid ${accent.primary}30`, zIndex: 100, padding: 24, overflow: 'auto', backdropFilter: 'blur(20px)', animation: 'slideIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontSize: 22, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}><Settings size={22} style={{ color: accent.primary }} /> Settings</h2>
              <button onClick={() => setShowSettings(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}><X size={16} /></button>
            </div>

            {/* Profile Section */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 14 }}>PROFILE</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                {/* Clickable Avatar */}
                <div style={{ position: 'relative' }}>
                  <div
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${accent.primary}, ${accent.secondary})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 28,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: showAvatarPicker ? '3px solid white' : '3px solid transparent',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    title="Click to change avatar"
                  >
                    {AVATARS.find(a => a.id === selectedAvatar)?.emoji || '👨‍🚀'}
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: accent.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    border: '2px solid rgba(15,15,25,0.98)',
                  }}>✏️</div>

                  {/* Avatar Picker Popup */}
                  {showAvatarPicker && (
                    <div style={{
                      position: 'absolute',
                      top: 65,
                      left: 0,
                      background: 'rgba(20,20,35,0.98)',
                      border: `1px solid ${accent.primary}40`,
                      borderRadius: 16,
                      padding: 12,
                      zIndex: 10,
                      boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 20px ${accent.primary}20`,
                      animation: 'scaleIn 0.2s ease-out',
                    }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 10, fontWeight: 500 }}>Choose Avatar</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, width: 200 }}>
                        {AVATARS.map(avatar => (
                          <div
                            key={avatar.id}
                            onClick={() => { setSelectedAvatar(avatar.id); setShowAvatarPicker(false); }}
                            style={{
                              width: 42,
                              height: 42,
                              borderRadius: 10,
                              background: selectedAvatar === avatar.id ? `linear-gradient(135deg, ${accent.primary}, ${accent.secondary})` : 'rgba(255,255,255,0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 20,
                              cursor: 'pointer',
                              border: selectedAvatar === avatar.id ? '2px solid white' : '2px solid transparent',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = selectedAvatar === avatar.id ? `linear-gradient(135deg, ${accent.primary}, ${accent.secondary})` : 'rgba(255,255,255,0.15)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = selectedAvatar === avatar.id ? `linear-gradient(135deg, ${accent.primary}, ${accent.secondary})` : 'rgba(255,255,255,0.08)'; }}
                            title={avatar.label}
                          >
                            {avatar.emoji}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>{userName}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{currentUser?.email}</div>
                </div>
              </div>

              {/* City Input with Autocomplete */}
              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>City (for weather)</div>
                <input
                  type="text"
                  value={city}
                  onChange={e => handleCityInput(e.target.value)}
                  onFocus={() => citySuggestions.length > 0 && setShowCitySuggestions(true)}
                  onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                  style={{ width: '100%', background: 'rgba(30,30,45,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 13, outline: 'none', transition: 'border-color 0.2s' }}
                  placeholder="Start typing city name..."
                />
                {/* City Suggestions Dropdown */}
                {showCitySuggestions && citySuggestions.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'rgba(20,20,35,0.98)',
                    border: `1px solid ${accent.primary}40`,
                    borderRadius: 12,
                    marginTop: 4,
                    overflow: 'hidden',
                    zIndex: 100,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                  }}>
                    {citySuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => selectCity(suggestion.name, suggestion.country)}
                        style={{
                          padding: '12px 14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          borderBottom: index < citySuggestions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <MapPin size={14} style={{ color: accent.primary }} />
                        <span style={{ fontSize: 13 }}>{suggestion.name}</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 'auto' }}>{suggestion.country}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Clock Format Section */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 14 }}>CLOCK FORMAT</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setClockFormat('12')} style={{ flex: 1, padding: '12px 16px', background: clockFormat === '12' ? accent.primary : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>12 Hour</button>
                <button onClick={() => setClockFormat('24')} style={{ flex: 1, padding: '12px 16px', background: clockFormat === '24' ? accent.primary : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>24 Hour</button>
              </div>
            </div>

            {/* Theme Color Section */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 14 }}>ACCENT COLOR</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {ACCENT_COLORS.map(ac => (
                  <div key={ac.id} onClick={() => setAccentColor(ac.id)} style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${ac.primary}, ${ac.secondary})`, cursor: 'pointer', transition: 'all 0.2s', border: accentColor === ac.id ? '3px solid white' : '3px solid transparent', boxShadow: accentColor === ac.id ? `0 0 20px ${ac.primary}80` : 'none' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                ))}
              </div>
            </div>

            {/* Wallpaper Section */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 14 }}>WALLPAPER</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {WALLPAPERS.map(wp => (
                  <div key={wp.id} onClick={() => setWallpaper(wp.id)} style={{ padding: 3, borderRadius: 12, border: wallpaper === wp.id ? `2px solid ${accent.primary}` : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ height: 50, borderRadius: 8, background: wp.preview, marginBottom: 6 }} />
                    <div style={{ fontSize: 11, textAlign: 'center', color: wallpaper === wp.id ? accent.primary : 'rgba(255,255,255,0.5)' }}>{wp.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time of Day */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 14 }}>TIME OF DAY</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: 'rgba(30,30,45,0.8)', borderRadius: 12 }}>
                {React.createElement(TimeIcon, { size: 28, style: { color: time.getHours() >= 6 && time.getHours() < 19 ? '#fbbf24' : '#94a3b8' } })}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{time.getHours() >= 6 && time.getHours() < 19 ? 'Daytime ☀️' : 'Nighttime 🌙'}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Dynamic background {wallpaper === 'dynamic' ? 'active' : 'inactive'}</div>
                </div>
              </div>
            </div>

            {/* Quick Stats in Settings */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 14 }}>TODAY'S STATS</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                <div style={{ padding: 14, background: 'rgba(30,30,45,0.8)', borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#22c55e' }}>{stats.tasksCompleted}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Tasks Done</div>
                </div>
                <div style={{ padding: 14, background: 'rgba(30,30,45,0.8)', borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: accent.primary }}>{stats.focusTime}h</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Focus Time</div>
                </div>
                <div style={{ padding: 14, background: 'rgba(30,30,45,0.8)', borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#a855f7' }}>{stats.productivity}%</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Productivity</div>
                </div>
                <div style={{ padding: 14, background: 'rgba(30,30,45,0.8)', borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#f97316' }}>{stats.streak}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Day Streak</div>
                </div>
              </div>
            </div>

            {/* Account Section */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 14 }}>ACCOUNT</h3>
              <div style={{ padding: 14, background: 'rgba(30,30,45,0.8)', borderRadius: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Signed in as</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: accent.primary }}>{currentUser?.email}</div>
              </div>
              <button
                onClick={() => { setShowSettings(false); logout(); }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 12,
                  color: '#f87171',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'; }}
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>


          </div>
        </>
      )}
    </div>
  )
}

