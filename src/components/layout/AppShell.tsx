import { useState, useEffect, useCallback } from 'react'
import { Sun, Cloud, CloudRain, CloudSun, Snowflake, CloudLightning } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import type { Task, Note, Habit, FullscreenWidget, Weather, AccentColor, Wallpaper } from '../../types/widgets'

import { StatusBar } from './StatusBar'
import { MetricBar } from './MetricBar'
import { Dock } from './Dock'
import { BottomSheet } from './BottomSheet'

import { FocusTimerWidget } from '../widgets/FocusTimerWidget'
import { TaskManagerWidget } from '../widgets/TaskManagerWidget'
import { StopwatchWidget } from '../widgets/StopwatchWidget'
import { MusicWidget } from '../widgets/MusicWidget'
import { WeatherWidget } from '../widgets/WeatherWidget'
import { HabitsWidget } from '../widgets/HabitsWidget'
import { NotesWidget } from '../widgets/NotesWidget'
import { CalendarWidget } from '../widgets/CalendarWidget'
import { QuotesWidget } from '../widgets/QuotesWidget'
import { CalculatorWidget } from '../widgets/CalculatorWidget'
import { AnalyticsWidget } from '../widgets/AnalyticsWidget'

// Constants
const WALLPAPERS: Wallpaper[] = [
  { id: 'dynamic', name: 'Dynamic Sky', preview: 'linear-gradient(to bottom, #1a1a3e, #0a0a14)' },
  { id: 'night', name: 'Night', preview: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
  { id: 'sunset', name: 'Sunset', preview: 'linear-gradient(135deg, #ee9ca7, #ffdde1, #c94b4b)' },
  { id: 'ocean', name: 'Ocean', preview: 'linear-gradient(135deg, #2193b0, #6dd5ed)' },
  { id: 'forest', name: 'Forest', preview: 'linear-gradient(135deg, #134e5e, #71b280)' },
  { id: 'aurora', name: 'Aurora', preview: 'linear-gradient(135deg, #43cea2, #185a9d)' },
  { id: 'cosmic', name: 'Cosmic', preview: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
  { id: 'lavender', name: 'Lavender', preview: 'linear-gradient(135deg, #667eea, #764ba2)' },
]

const ACCENT_COLORS: AccentColor[] = [
  { id: 'blue', primary: '#3b82f6', secondary: '#60a5fa', glow: 'rgba(59, 130, 246, 0.4)' },
  { id: 'purple', primary: '#8b5cf6', secondary: '#a78bfa', glow: 'rgba(139, 92, 246, 0.4)' },
  { id: 'pink', primary: '#ec4899', secondary: '#f472b6', glow: 'rgba(236, 72, 153, 0.4)' },
  { id: 'green', primary: '#22c55e', secondary: '#4ade80', glow: 'rgba(34, 197, 94, 0.4)' },
  { id: 'orange', primary: '#f97316', secondary: '#fb923c', glow: 'rgba(249, 115, 22, 0.4)' },
  { id: 'cyan', primary: '#06b6d4', secondary: '#22d3ee', glow: 'rgba(6, 182, 212, 0.4)' },
]

const DEFAULT_HABITS: Habit[] = [
  { id: '1', name: 'Morning Exercise', icon: '🏃', streak: 5, completedToday: false },
  { id: '2', name: 'Read 30 mins', icon: '📚', streak: 12, completedToday: false },
  { id: '3', name: 'Meditate', icon: '🧘', streak: 3, completedToday: false },
  { id: '4', name: 'Drink Water', icon: '💧', streak: 8, completedToday: true },
]

const getWeatherIcon = (condition: string) => {
  const c = condition.toLowerCase()
  if (c.includes('clear') || c.includes('sunny')) return Sun
  if (c.includes('cloud') && c.includes('sun')) return CloudSun
  if (c.includes('cloud')) return Cloud
  if (c.includes('rain') || c.includes('drizzle')) return CloudRain
  if (c.includes('thunder') || c.includes('storm')) return CloudLightning
  if (c.includes('snow')) return Snowflake
  return Sun
}

export function AppShell() {
  // Persisted State
  const [userName, setUserName] = useLocalStorage('focus-user-name', 'Swastik')
  const [city, setCity] = useLocalStorage('focus-city', 'New Delhi')
  const [wallpaper, setWallpaper] = useLocalStorage('focus-wallpaper', 'dynamic')
  const [accentColorId, setAccentColorId] = useLocalStorage('focus-accent', 'blue')
  const [tasks, setTasks] = useLocalStorage<Task[]>('focus-tasks', [])
  const [notes, setNotes] = useLocalStorage<Note[]>('focus-notes', [])
  const [habits, setHabits] = useLocalStorage<Habit[]>('focus-habits', DEFAULT_HABITS)
  const [focusSessions, setFocusSessions] = useLocalStorage('focus-sessions', 0)

  // UI State
  const [editMode, setEditMode] = useState(false)
  const [, setFullscreenWidget] = useState<FullscreenWidget>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [weather, setWeather] = useState<Weather>({
    temp: 24, condition: 'Loading...', icon: Sun, humidity: 45, wind: 12, feelsLike: 24, description: ''
  })

  const accentColor = ACCENT_COLORS.find(c => c.id === accentColorId) || ACCENT_COLORS[0]
  const currentWallpaper = WALLPAPERS.find(w => w.id === wallpaper) || WALLPAPERS[0]

  // Fetch Weather
  const fetchWeather = useCallback(async () => {
    try {
      setWeatherLoading(true)
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
      const geoData = await geoRes.json()
      if (geoData.results?.[0]) {
        const { latitude, longitude } = geoData.results[0]
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature`
        )
        const weatherData = await weatherRes.json()
        const current = weatherData.current
        const weatherCodes: Record<number, string> = {
          0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Cloudy',
          45: 'Foggy', 48: 'Foggy', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
          61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain', 71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
          95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Severe Thunderstorm'
        }
        const condition = weatherCodes[current.weather_code] || 'Clear'
        setWeather({
          temp: Math.round(current.temperature_2m),
          condition,
          icon: getWeatherIcon(condition),
          humidity: current.relative_humidity_2m,
          wind: Math.round(current.wind_speed_10m),
          feelsLike: Math.round(current.apparent_temperature),
          description: condition
        })
      }
    } catch (error) {
      console.error('Weather fetch error:', error)
    } finally {
      setWeatherLoading(false)
    }
  }, [city])

  useEffect(() => {
    fetchWeather()
    const interval = setInterval(fetchWeather, 600000) // 10 min
    return () => clearInterval(interval)
  }, [fetchWeather])

  // Computed values
  const tasksCompleted = tasks.filter(t => t.completed).length
  const habitsCompleted = habits.filter(h => h.completedToday).length
  const focusTime = Math.round((focusSessions * 25) / 60)

  const handleNavigate = (widget: string) => {
    if (widget === 'settings') {
      // Could open settings panel
    } else if (widget === 'dashboard') {
      setFullscreenWidget(null)
    } else {
      setFullscreenWidget(widget as FullscreenWidget)
    }
  }

  const handleSessionComplete = () => {
    setFocusSessions(s => s + 1)
  }

  // Dynamic background
  const getBackground = () => {
    if (wallpaper === 'dynamic') {
      const hour = new Date().getHours()
      if (hour >= 5 && hour < 8) return 'linear-gradient(to bottom, #1e3a5f, #f97316, #fcd34d)'
      if (hour >= 8 && hour < 17) return 'linear-gradient(to bottom, #0ea5e9, #38bdf8, #7dd3fc)'
      if (hour >= 17 && hour < 20) return 'linear-gradient(to bottom, #1e3a5f, #f97316, #ec4899)'
      return 'linear-gradient(to bottom, #0f172a, #1e1b4b, #312e81)'
    }
    return currentWallpaper.preview
  }

  return (
    <div 
      className="min-h-screen flex flex-col text-slate-100 overflow-hidden"
      style={{ background: getBackground() }}
    >
      {/* Status Bar */}
      <StatusBar city={city} temp={weather.temp} condition={weather.condition} />

      {/* Metric Bar */}
      <MetricBar
        tasksCompleted={tasksCompleted}
        totalTasks={tasks.length}
        focusTime={focusTime}
        focusSessions={focusSessions}
        habitsCompleted={habitsCompleted}
        totalHabits={habits.length}
      />

      {/* Main Workspace - Scrollable */}
      <main className="flex-1 overflow-y-auto px-4 pb-28 pt-4 custom-scrollbar">
        <div className="mx-auto max-w-7xl">
          {/* Quotes Banner */}
          <div className="mb-4">
            <QuotesWidget editMode={editMode} accentColor={accentColor.primary} />
          </div>

          {/* Main Grid */}
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1.8fr]">
            {/* Left Column - Focus Tools */}
            <div className="grid gap-4">
              <FocusTimerWidget 
                editMode={editMode} 
                onExpand={() => setFullscreenWidget('focus')}
                accentColor={accentColor.primary}
                onSessionComplete={handleSessionComplete}
              />
              <StopwatchWidget 
                editMode={editMode} 
                onExpand={() => setFullscreenWidget('stopwatch')}
                accentColor={accentColor.primary}
              />
              <MusicWidget 
                editMode={editMode} 
                onExpand={() => setFullscreenWidget('music')}
                accentColor={accentColor.primary}
              />
            </div>

            {/* Right Column - Task Manager */}
            <TaskManagerWidget
              editMode={editMode}
              onExpand={() => setFullscreenWidget('tasks')}
              userName={userName}
              tasks={tasks}
              onTasksChange={setTasks}
              accentColor={accentColor.primary}
            />
          </div>

          {/* Secondary Grid */}
          <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-4">
            <WeatherWidget
              editMode={editMode}
              onExpand={() => setFullscreenWidget('weather')}
              weather={weather}
              city={city}
              loading={weatherLoading}
            />
            <HabitsWidget
              editMode={editMode}
              onExpand={() => setFullscreenWidget('habits')}
              habits={habits}
              onHabitsChange={setHabits}
              accentColor={accentColor.primary}
            />
            <CalendarWidget
              editMode={editMode}
              onExpand={() => setFullscreenWidget('calendar')}
              accentColor={accentColor.primary}
            />
            <NotesWidget
              editMode={editMode}
              onExpand={() => setFullscreenWidget('notes')}
              notes={notes}
              onNotesChange={setNotes}
            />
          </div>

          {/* Third Row */}
          <div className="grid gap-4 mt-4 md:grid-cols-2">
            <CalculatorWidget
              editMode={editMode}
              onExpand={() => setFullscreenWidget('calculator')}
              accentColor={accentColor.primary}
            />
            <AnalyticsWidget
              editMode={editMode}
              onExpand={() => setFullscreenWidget('analytics')}
              tasksCompleted={tasksCompleted}
              focusSessions={focusSessions}
              focusTime={focusTime}
              accentColor={accentColor.primary}
            />
          </div>
        </div>
      </main>

      {/* Dock */}
      <Dock
        onNavigate={handleNavigate}
        editMode={editMode}
        onToggleEditMode={() => setEditMode(!editMode)}
        accentColor={accentColor.primary}
      />

      {/* Bottom Sheet */}
      <BottomSheet
        userName={userName}
        onUserNameChange={setUserName}
        city={city}
        onCityChange={setCity}
        accentColors={ACCENT_COLORS}
        selectedAccent={accentColorId}
        onAccentChange={setAccentColorId}
        wallpapers={WALLPAPERS}
        selectedWallpaper={wallpaper}
        onWallpaperChange={setWallpaper}
      />
    </div>
  )
}

