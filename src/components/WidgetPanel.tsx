import Clock from './Clock'
import Stopwatch from './Stopwatch'
import Timer from './Timer'

export default function WidgetPanel() {
  return (
    <aside className="w-80 p-4 flex flex-col gap-4">
      <div className="sticky top-4">
        <Clock />
      </div>
      <div>
        <Stopwatch />
      </div>
      <div>
        <Timer />
      </div>
      <div className="bg-gray-800 p-3 rounded text-center text-sm text-gray-300">Other widgets coming: Notes, Focus Graphs, Shortcuts</div>
    </aside>
  )
}
