import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Clock, Target, Flame, Award } from 'lucide-react'

type StatData = {
  date: string
  tasksCompleted: number
  focusTime: number
}

export default function Analytics() {
  const [stats, setStats] = useState<StatData[]>(() => {
    try {
      const raw = localStorage.getItem('focus-analytics')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('focus-analytics', JSON.stringify(stats))
  }, [stats])

  const total = stats.reduce((sum, s) => sum + s.tasksCompleted, 0)
  const totalFocus = stats.reduce((sum, s) => sum + s.focusTime, 0)
  const avgDaily = stats.length > 0 ? (total / stats.length).toFixed(1) : '0'
  const streak = calculateStreak(stats)
  const today = new Date().toLocaleDateString()
  const last7Days = stats.slice(-7)
  const maxTasks = Math.max(...last7Days.map(s => s.tasksCompleted), 1)

  function calculateStreak(data: StatData[]): number {
    let streak = 0
    const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    for (const stat of sorted) {
      if (stat.tasksCompleted > 0) streak++
      else break
    }
    return streak
  }

  const statCards = [
    { icon: Target, label: 'Total Tasks', value: total, color: 'from-blue-500 to-cyan-500', textColor: 'text-blue-400' },
    { icon: TrendingUp, label: 'Daily Avg', value: avgDaily, color: 'from-green-500 to-emerald-500', textColor: 'text-green-400' },
    { icon: Clock, label: 'Focus Hours', value: Math.floor(totalFocus / 60), color: 'from-purple-500 to-pink-500', textColor: 'text-purple-400' },
    { icon: Flame, label: 'Day Streak', value: streak, color: 'from-orange-500 to-red-500', textColor: 'text-orange-400' },
  ]

  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors animate-scale-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon size={16} />
              </div>
              <span className="text-xs text-gray-400">{card.label}</span>
            </div>
            <div className={`text-2xl font-bold ${card.textColor}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Weekly Chart */}
      <div className="bg-white/5 rounded-xl p-4 mb-4 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <BarChart3 size={16} /> Weekly Activity
          </h4>
          <span className="text-xs text-gray-500">Last 7 days</span>
        </div>

        <div className="flex items-end justify-between gap-2 h-32">
          {last7Days.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              No data yet
            </div>
          ) : (
            last7Days.map((stat, i) => {
              const height = (stat.tasksCompleted / maxTasks) * 100
              const dayName = new Date(stat.date).toLocaleDateString('default', { weekday: 'short' })
              return (
                <div key={stat.date} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center justify-end h-24">
                    <span className="text-xs text-gray-400 mb-1">{stat.tasksCompleted}</span>
                    <div
                      className="w-full max-w-8 bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all duration-500 animate-slide-up"
                      style={{ height: `${Math.max(height, 5)}%`, animationDelay: `${i * 100}ms` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500">{dayName}</span>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 rounded-xl p-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Award size={16} /> Recent Activity
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {stats.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-4">
              No activity logged yet
            </div>
          ) : (
            [...stats].reverse().slice(0, 5).map((s, i) => (
              <div
                key={s.date}
                className="flex items-center justify-between text-sm bg-white/5 rounded-lg px-3 py-2 animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="text-gray-400">{s.date}</span>
                <div className="flex items-center gap-3">
                  <span className="text-green-400">{s.tasksCompleted} tasks</span>
                  <span className="text-purple-400">{s.focusTime}m focus</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Log Button */}
      <button
        onClick={() => {
          const newStat: StatData = {
            date: today,
            tasksCompleted: Math.floor(Math.random() * 10) + 1,
            focusTime: Math.floor(Math.random() * 120) + 30
          }
          setStats((s) => [...s.filter((x) => x.date !== today), newStat])
        }}
        className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg animate-slide-up"
        style={{ animationDelay: '200ms' }}
      >
        📊 Log Today's Progress
      </button>
    </div>
  )
}
