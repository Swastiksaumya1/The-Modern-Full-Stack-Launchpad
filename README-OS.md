# Focus Dashboard OS 🚀

A full-featured **OS-like web application** built with React + TypeScript + Tailwind CSS. This is NOT just a todo app—it's a complete productivity OS in your browser!

## What You Can Do:

### Core Features:
- 📋 **Task Management** - Add, check off, delete tasks with localStorage persistence
- 📝 **Notes Widget** - Create sticky notes with colors, full CRUD
- 🧮 **Calculator** - Full calculator with history
- 📅 **Calendar** - Monthly view with task markers
- 📊 **Analytics** - Track completed tasks, daily stats
- 🎵 **Music Player** - Play, pause, skip tracks with volume control
- 🍅 **Pomodoro Timer** - 25-5 work/break sessions, track completed sessions
- 🕐 **Clock** - Live time and date display
- ⏱️ **Stopwatch** - Start/stop/reset with millisecond precision
- ⏲️ **Timer** - Preset 5/10/15 minute timers

### OS-Like Features:
- 🪟 **Draggable Windows** - Move windows around like a desktop OS
- 🔻 **Minimize/Maximize** - Full window management
- 📌 **Taskbar** - Launch apps from the bottom bar
- 💾 **Persistent Storage** - All data saved to localStorage
- 🎨 **Dark Theme** - Modern dark gradient UI with purple/blue accents

## How to Run:

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## File Structure:

```
src/
├── components/
│   ├── TaskInput.tsx        # Input component for tasks
│   ├── TaskItem.tsx         # Task display with checkbox & delete
│   ├── Notes.tsx            # Sticky notes widget
│   ├── Calculator.tsx       # Calculator app
│   ├── Calendar.tsx         # Calendar view
│   ├── Analytics.tsx        # Stats & analytics
│   ├── MusicPlayer.tsx      # Music player widget
│   ├── Pomodoro.tsx         # Pomodoro timer
│   ├── Clock.tsx            # Live clock
│   ├── Stopwatch.tsx        # Stopwatch timer
│   ├── Timer.tsx            # Countdown timer
│   ├── Window.tsx           # Draggable window container
│   ├── Taskbar.tsx          # OS taskbar with app launcher
│   ├── WidgetPanel.tsx      # Legacy left widget panel (optional)
│   └── FullscreenTask.tsx   # Fullscreen task modal (optional)
├── App.tsx                  # Main OS shell
├── App.css                  # Styles
└── main.tsx                 # Entry point
```

## Architecture:

1. **App.tsx (The Brain)** - Manages tasks state, window system, routing
2. **Window.tsx** - Draggable window manager with title bar, min/max/close
3. **Taskbar.tsx** - OS-style taskbar with app launcher buttons
4. **Individual Widgets** - Notes, Calculator, Music, Pomodoro, etc.

## How to Use:

### Opening Apps:
Click any app button in the taskbar at the bottom to open a new window.

### Managing Windows:
- **Drag** the blue title bar to move windows
- **Minimize** button (−) to hide window but keep it open
- **Maximize** button (⊞) to toggle fullscreen
- **Close** button (×) to shut down the app

### Tasks:
1. Type in the input and press Enter or click +
2. Check the checkbox to mark complete
3. Click "Delete" to remove

### Notes:
1. Click "New Note" to create a sticky note
2. Click the note to edit title and content
3. Each note has a random color
4. Hover to delete

### Calculator:
- Basic operations: +, -, *, /
- History shows last 10 calculations
- Click "Clear" to reset

### Pomodoro:
- Click "Start" to begin a 25-minute work session
- Automatically switches to 5-minute break
- Track sessions completed
- Quick buttons for 5m, 10m, 15m breaks

### Timer & Stopwatch:
- Timer: Set preset minutes (5/10/15) and countdown
- Stopwatch: Precise timing with milliseconds
- Both have Start/Stop and Reset controls

## Next Steps (Future Enhancements):

- 🔐 **Authentication** - Login/signup with cloud sync
- ☁️ **Cloud Backup** - Sync data across devices
- 👥 **Collaboration** - Share tasks with team
- 📱 **Mobile Responsive** - Optimize for phones/tablets
- ⌨️ **Keyboard Shortcuts** - Quick actions (Cmd+N for new, etc.)
- 📦 **Task Templates** - Pre-made task lists
- 🎨 **Themes** - Light/dark mode toggle
- 🔔 **Notifications** - Browser notifications for timers/reminders
- 🎨 **Customizable Widgets** - Resize, reposition, hide
- 📈 **Advanced Analytics** - Charts, trends, insights

## Technologies Used:

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide-React** - Icons
- **Vite** - Build tool
- **localStorage** - Data persistence

## Tips & Tricks:

- Open multiple task windows to organize different projects
- Use Notes + Tasks together for detailed planning
- Use Pomodoro while keeping a Stopwatch open for flexibility
- Export your analytics to plan better
- All data persists in browser—nothing is lost on refresh!

---

**Enjoy your new Focus Dashboard OS!** 🎉 Open multiple windows, run multiple apps, and manage your entire workflow in one place.
