export type Task = {
  id: string
  text: string
  completed: boolean
  priority?: 'low' | 'medium' | 'high'
}

export type Note = {
  id: string
  text: string
  color: string
}

export type Habit = {
  id: string
  name: string
  icon: string
  streak: number
  completedToday: boolean
}

export type QuickLink = {
  id: string
  name: string
  url: string
  color: string
}

export type WidgetType = 
  | 'clock' 
  | 'tasks' 
  | 'focus' 
  | 'stopwatch' 
  | 'weather' 
  | 'notes' 
  | 'calendar' 
  | 'music' 
  | 'analytics' 
  | 'calculator' 
  | 'habits' 
  | 'links' 
  | 'quotes'

export type FullscreenWidget = WidgetType | null

export type Weather = {
  temp: number
  condition: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  humidity: number
  wind: number
  feelsLike: number
  description: string
}

export interface WidgetProps {
  editMode?: boolean
  onExpand?: () => void
}

export type AccentColor = {
  id: string
  primary: string
  secondary: string
  glow: string
}

export type Wallpaper = {
  id: string
  name: string
  preview: string
}

