import { TrendingUp, CheckCircle, Clock, Zap } from 'lucide-react'

export default function QuickStats() {
  const stats = [
    { icon: CheckCircle, label: 'Tasks Done', value: '12', color: 'text-green-400', bgColor: 'bg-green-500/20' },
    { icon: Clock, label: 'Focus Time', value: '4.5h', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    { icon: TrendingUp, label: 'Productivity', value: '87%', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    { icon: Zap, label: 'Streak', value: '7 days', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4 animate-fade-in hover:bg-gray-800/50 transition-colors cursor-default group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            <stat.icon size={20} className={stat.color} />
          </div>
          <div className="text-2xl font-semibold mb-1">{stat.value}</div>
          <div className="text-xs text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

