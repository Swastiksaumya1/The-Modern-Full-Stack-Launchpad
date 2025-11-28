import { useState, useEffect } from 'react'
import {
  LayoutGrid, CheckSquare, Clock, Settings, Wifi, Volume2, Battery, User,
  Timer, Play, Pause, RotateCcw, Plus, Check, Trash2, Maximize2, Flag
} from 'lucide-react'

export default function Dashboard() {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('focus-user-name') || 'Swastik'
  })
  const [time, setTime] = useState(new Date())
  const [showSettings, setShowSettings] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')

  // Focus Timer State
  const [focusDuration, setFocusDuration] = useState(25)
  const [focusTimeLeft, setFocusTimeLeft] = useState(25 * 60)
  const [focusRunning, setFocusRunning] = useState(false)

  // Stopwatch State
  const [stopwatchRunning, setStopwatchRunning] = useState(false)
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [laps, setLaps] = useState<number[]>([])

  // Tasks State
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('focus-tasks')
      return saved ? JSON.parse(saved) : [
        { id: '1', text: 'Welcome to FocusOS 1.0', completed: false },
        { id: '2', text: 'Add your first task below', completed: false },
      ]
    } catch { return [] }
  })
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    localStorage.setItem('focus-user-name', userName)
  }, [userName])

  useEffect(() => {
    localStorage.setItem('focus-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let interval: number
    if (focusRunning && focusTimeLeft > 0) {
      interval = window.setInterval(() => setFocusTimeLeft(t => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [focusRunning, focusTimeLeft])

  useEffect(() => {
    let interval: number
    if (stopwatchRunning) {
      interval = window.setInterval(() => setStopwatchTime(t => t + 10), 10)
    }
    return () => clearInterval(interval)
  }, [stopwatchRunning])

  const getGreeting = () => {
    const hour = time.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const formatTime12 = () => {
    const hours = time.getHours() % 12 || 12
    const mins = String(time.getMinutes()).padStart(2, '0')
    const ampm = time.getHours() >= 12 ? 'pm' : 'am'
    return `${hours}:${mins}${ampm}`
  }

  const formatDate = () => {
    return time.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase()
  }

  const pendingTasks = tasks.filter((t: { completed: boolean }) => !t.completed).length

  const addTask = () => {
    if (newTask.trim()) {
      setTasks((prev: { id: string; text: string; completed: boolean }[]) => [...prev, { id: Date.now().toString(), text: newTask.trim(), completed: false }])
      setNewTask('')
    }
  }

  const styles = {
    container: { minHeight: '100vh', background: '#0a0a14', color: 'white', fontFamily: 'Inter, system-ui, sans-serif', position: 'relative' as const, overflow: 'hidden' },
    stars: { position: 'fixed' as const, inset: 0, background: 'radial-gradient(ellipse at bottom, #1a1a3e 0%, #0a0a14 100%)', zIndex: 0 },
    menuBar: { position: 'fixed' as const, top: 0, left: 0, right: 0, height: 40, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 50 },
    menuLeft: { display: 'flex', alignItems: 'center', gap: 16 },
    menuRight: { display: 'flex', alignItems: 'center', gap: 16 },
    logo: { display: 'flex', alignItems: 'center', gap: 8, color: '#60a5fa', fontWeight: 600, fontSize: 14 },
    menuItem: { fontSize: 13, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '4px 8px', borderRadius: 4 },
    content: { position: 'relative' as const, zIndex: 10, padding: '60px 24px 100px', maxWidth: 1400, margin: '0 auto' },
    mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 },
    leftCol: { display: 'flex', flexDirection: 'column' as const, gap: 24 },
    clockWidget: { background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #2563eb)', borderRadius: 16, padding: 24, height: 180, position: 'relative' as const, overflow: 'hidden' },
    clockTime: { fontSize: 56, fontWeight: 300, letterSpacing: -2 },
    clockDate: { fontSize: 13, letterSpacing: 3, color: 'rgba(147,197,253,1)', marginTop: 8 },
    timerWidget: { background: 'rgba(20,20,30,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 20, flex: 1 },
    widgetHeader: { display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 16, letterSpacing: 1 },
    timerPresets: { display: 'flex', gap: 8, marginBottom: 20 },
    presetBtn: { flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' },
    timerDisplay: { fontSize: 48, fontWeight: 300, textAlign: 'center' as const, letterSpacing: 4, margin: '20px 0' },
    startBtn: { width: '100%', padding: '14px 0', borderRadius: 12, fontSize: 14, fontWeight: 600, letterSpacing: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
    taskWidget: { background: 'rgba(20,20,30,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, height: '100%', display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' },
    taskHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' },
    greeting: { fontSize: 28, fontWeight: 600, padding: '16px 20px 8px' },
    subGreeting: { fontSize: 14, color: 'rgba(255,255,255,0.5)', padding: '0 20px 16px' },
    taskInput: { display: 'flex', alignItems: 'center', gap: 12, margin: '0 16px 16px', padding: '12px 16px', background: 'rgba(30,30,40,0.8)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' },
    taskList: { flex: 1, overflow: 'auto', padding: '0 16px 16px' },
    taskItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, marginBottom: 8, transition: 'all 0.2s', cursor: 'pointer' },
    checkbox: { width: 22, height: 22, borderRadius: 6, border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' },
    dock: { position: 'fixed' as const, bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, padding: '12px 20px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', zIndex: 50 },
    dockItem: { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' },
    stopwatchWidget: { background: 'rgba(20,20,30,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 20 },
    settingsPanel: { position: 'fixed' as const, right: 0, top: 0, bottom: 0, width: 380, background: 'rgba(15,15,25,0.98)', borderLeft: '1px solid rgba(255,255,255,0.1)', zIndex: 100, padding: 24, overflow: 'auto' }
  }

  return (
    <div style={styles.container}>
      {/* Background */}
      <div style={styles.stars} />

      {/* Menu Bar */}
      <header style={styles.menuBar}>
        <div style={styles.menuLeft}>
          <div style={styles.logo}>
            <LayoutGrid size={18} />
            <span>FocusOS</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <span style={styles.menuItem}>File</span>
          <span style={styles.menuItem}>View</span>
          <span style={styles.menuItem}>Window</span>
        </div>
        <div style={styles.menuRight}>
          <Wifi size={14} style={{ opacity: 0.6 }} />
          <Volume2 size={14} style={{ opacity: 0.6 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: 0.6, fontSize: 12 }}>
            <Battery size={14} /> 100%
          </div>
          <span style={{ fontSize: 13 }}>{formatTime12().toUpperCase()}</span>
          <div
            onClick={() => setShowSettings(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 8px', borderRadius: 8 }}
          >
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={14} />
            </div>
            <span style={{ fontSize: 13 }}>{userName}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.content}>
        <div style={styles.mainGrid}>
          {/* Left Column */}
          <div style={styles.leftCol}>
            {/* Clock Widget */}
            <div style={styles.clockWidget}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
              <div style={styles.clockTime}>{formatTime12()}</div>
              <div style={styles.clockDate}>{formatDate()}</div>
            </div>

            {/* Focus Timer */}
            <div style={styles.timerWidget}>
              <div style={styles.widgetHeader}>
                <Timer size={14} />
                <span>FOCUS TIMER</span>
              </div>
              <div style={styles.timerPresets}>
                {[25, 5, 15].map(mins => (
                  <button
                    key={mins}
                    onClick={() => { setFocusDuration(mins); setFocusTimeLeft(mins * 60); setFocusRunning(false) }}
                    style={{
                      ...styles.presetBtn,
                      background: focusDuration === mins ? '#3b82f6' : 'rgba(40,40,60,0.8)',
                      color: focusDuration === mins ? 'white' : 'rgba(255,255,255,0.6)',
                      border: 'none'
                    }}
                  >
                    {mins}
                  </button>
                ))}
              </div>
              <div style={styles.timerDisplay}>
                {String(Math.floor(focusTimeLeft / 60)).padStart(2, '0')}:{String(focusTimeLeft % 60).padStart(2, '0')}
              </div>
              <button
                onClick={() => setFocusRunning(!focusRunning)}
                style={{
                  ...styles.startBtn,
                  background: focusRunning ? '#ea580c' : '#3b82f6',
                  border: 'none',
                  color: 'white'
                }}
              >
                {focusRunning ? <><Pause size={16} /> PAUSE</> : <><Play size={16} /> START FOCUS</>}
              </button>
            </div>

            {/* Stopwatch */}
            <div style={styles.stopwatchWidget}>
              <div style={styles.widgetHeader}>
                <Clock size={14} />
                <span>STOPWATCH</span>
              </div>
              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <span style={{ fontSize: 36, fontWeight: 300, letterSpacing: 2 }}>
                  {String(Math.floor(stopwatchTime / 60000)).padStart(2, '0')}:
                  {String(Math.floor((stopwatchTime % 60000) / 1000)).padStart(2, '0')}.
                  {String(Math.floor((stopwatchTime % 1000) / 10)).padStart(2, '0')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                <button onClick={() => { setStopwatchRunning(false); setStopwatchTime(0); setLaps([]) }} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(40,40,60,0.8)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RotateCcw size={16} />
                </button>
                <button onClick={() => setStopwatchRunning(!stopwatchRunning)} style={{ width: 56, height: 56, borderRadius: '50%', background: stopwatchRunning ? '#ea580c' : '#3b82f6', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stopwatchRunning ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}
                </button>
                <button onClick={() => stopwatchRunning && setLaps(prev => [stopwatchTime, ...prev])} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(40,40,60,0.8)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: stopwatchRunning ? 1 : 0.5 }}>
                  <Flag size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Task Manager */}
          <div style={styles.taskWidget}>
            <div style={styles.taskHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#60a5fa' }}>
                <CheckSquare size={18} />
                <span style={{ fontWeight: 500 }}>Task Manager Pro</span>
              </div>
              <Maximize2 size={14} style={{ opacity: 0.4, cursor: 'pointer' }} />
            </div>

            <div style={styles.greeting}>{getGreeting()}, {userName}.</div>
            <div style={styles.subGreeting}>You have {pendingTasks} pending task{pendingTasks !== 1 ? 's' : ''}. Stay focused.</div>

            <div style={styles.taskInput}>
              <Plus size={18} style={{ opacity: 0.4 }} />
              <input
                type="text"
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()}
                placeholder="What needs to be done?"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: 14 }}
              />
              <button onClick={addTask} style={{ padding: '6px 12px', background: 'rgba(60,60,80,0.8)', border: 'none', borderRadius: 6, color: 'rgba(255,255,255,0.6)', fontSize: 11, cursor: 'pointer' }}>ENTER</button>
            </div>

            <div style={styles.taskList}>
              {tasks.map((task: { id: string; text: string; completed: boolean }) => (
                <div
                  key={task.id}
                  style={{
                    ...styles.taskItem,
                    background: 'rgba(30,30,45,0.5)',
                    opacity: task.completed ? 0.5 : 1
                  }}
                >
                  <div
                    onClick={() => setTasks((prev: { id: string; text: string; completed: boolean }[]) => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))}
                    style={{
                      ...styles.checkbox,
                      background: task.completed ? '#3b82f6' : 'transparent',
                      borderColor: task.completed ? '#3b82f6' : 'rgba(255,255,255,0.3)'
                    }}
                  >
                    {task.completed && <Check size={14} />}
                  </div>
                  <span style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'rgba(255,255,255,0.4)' : 'white' }}>{task.text}</span>
                  <Trash2
                    size={14}
                    style={{ opacity: 0.3, cursor: 'pointer' }}
                    onClick={() => setTasks((prev: { id: string; text: string; completed: boolean }[]) => prev.filter(t => t.id !== task.id))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Dock */}
      <div style={styles.dock}>
        {[
          { id: 'dashboard', icon: LayoutGrid, color: '#3b82f6' },
          { id: 'tasks', icon: CheckSquare, color: '#22c55e' },
          { id: 'focus', icon: Clock, color: '#f97316' },
          { id: 'settings', icon: Settings, color: '#6b7280' },
        ].map(item => (
          <div
            key={item.id}
            onClick={() => item.id === 'settings' ? setShowSettings(true) : setActiveNav(item.id)}
            style={{
              ...styles.dockItem,
              background: activeNav === item.id ? item.color : 'rgba(255,255,255,0.1)',
              transform: activeNav === item.id ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <item.icon size={22} />
          </div>
        ))}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <>
          <div onClick={() => setShowSettings(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />
          <div style={styles.settingsPanel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <h2 style={{ fontSize: 22, fontWeight: 600 }}>Settings</h2>
              <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 24 }}>×</button>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 600 }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Your Name</div>
                  <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    style={{ background: 'rgba(30,30,45,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, width: 200, outline: 'none' }}
                  />
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 40 }}>FocusOS v2.0 • Made with ❤️</div>
          </div>
        </>
      )}
    </div>
  )
}

