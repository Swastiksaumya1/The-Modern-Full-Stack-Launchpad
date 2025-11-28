import { CheckCircle, Clock, TrendingUp, Zap, Target } from 'lucide-react'

interface MetricBarProps {
  tasksCompleted: number
  totalTasks: number
  focusTime: number
  focusSessions: number
  habitsCompleted: number
  totalHabits: number
}

export function MetricBar({
  tasksCompleted,
  totalTasks,
  focusTime,
  focusSessions,
  habitsCompleted,
  totalHabits
}: MetricBarProps) {
  const productivity = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0
  const habitsProgress = totalHabits > 0 ? Math.round((habitsCompleted / totalHabits) * 100) : 0
  
  const metrics = [
    {
      icon: CheckCircle,
      label: 'Tasks Done',
      value: `${tasksCompleted}/${totalTasks}`,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    },
    {
      icon: Clock,
      label: 'Focus Time',
      value: `${focusTime}h`,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/30'
    },
    {
      icon: TrendingUp,
      label: 'Productivity',
      value: `${productivity}%`,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/30'
    },
    {
      icon: Zap,
      label: 'Focus Sessions',
      value: focusSessions.toString(),
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30'
    },
    {
      icon: Target,
      label: 'Habits',
      value: `${habitsProgress}%`,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/30'
    }
  ]

  return (
    <div className="px-6 py-3">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${metric.bgColor} border ${metric.borderColor} backdrop-blur-sm transition-all duration-200 hover:scale-105 cursor-default`}
          >
            <metric.icon size={14} className={metric.color} />
            <span className="text-xs text-slate-400">{metric.label}</span>
            <span className={`text-xs font-semibold ${metric.color}`}>{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

