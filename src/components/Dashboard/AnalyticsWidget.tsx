import { BarChart3, TrendingUp, Clock, CheckCircle } from 'lucide-react'

export default function AnalyticsWidget() {
  const weeklyData = [
    { day: 'Mon', hours: 4.5, tasks: 8 },
    { day: 'Tue', hours: 6.2, tasks: 12 },
    { day: 'Wed', hours: 3.8, tasks: 6 },
    { day: 'Thu', hours: 5.5, tasks: 10 },
    { day: 'Fri', hours: 7.0, tasks: 15 },
    { day: 'Sat', hours: 2.0, tasks: 4 },
    { day: 'Sun', hours: 1.5, tasks: 3 },
  ]

  const maxHours = Math.max(...weeklyData.map(d => d.hours))

  const stats = [
    { label: 'Focus Hours', value: '30.5h', change: '+12%', icon: Clock, color: 'text-blue-400' },
    { label: 'Tasks Done', value: '58', change: '+8%', icon: CheckCircle, color: 'text-green-400' },
    { label: 'Productivity', value: '87%', change: '+5%', icon: TrendingUp, color: 'text-purple-400' },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-white/10 text-gray-400">
        <BarChart3 size={16} />
        <span className="text-sm font-medium">Weekly Analytics</span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 p-4 border-b border-white/10">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <stat.icon size={16} className={`mx-auto mb-1 ${stat.color}`} />
            <div className="text-lg font-semibold">{stat.value}</div>
            <div className="text-xs text-green-400">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 p-4">
        <div className="h-full flex items-end justify-between gap-2">
          {weeklyData.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-500 hover:to-blue-300"
                style={{ 
                  height: `${(day.hours / maxHours) * 100}%`,
                  animationDelay: `${i * 100}ms`
                }}
              />
              <span className="text-xs text-gray-500">{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 p-3 border-t border-white/10 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          Focus Hours
        </div>
      </div>
    </div>
  )
}

