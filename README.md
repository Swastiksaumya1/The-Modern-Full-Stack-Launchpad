# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Focus Dashboard (Modular Todo)

This project now includes a small modular React + TypeScript component called **Focus Dashboard**.

- `src/components/TaskInput.tsx`: A dumb input component that accepts an `onAdd(text: string)` prop. Styled with a dark Tailwind look.
- `src/components/TaskItem.tsx`: A dumb display component for a single task. Accepts a `task` object and `onToggle`, `onDelete` callbacks.
- `src/App.tsx`: The Brain — manages `tasks` state and implements `addTask`, `toggleTask`, and `deleteTask`.

Run the dev server to try it out:

```powershell
npm install
npm run dev
```

Notes:
- The app uses simple Tailwind utility classes for a dark, minimalist UI.
- Types are defined in `src/App.tsx` via the `Task` type to demonstrate TypeScript interfaces and prop-drilling.

Enhanced dashboard features added:

- **Left widget panel**: `src/components/WidgetPanel.tsx` composes the `Clock`, `Stopwatch`, and `Timer` widgets.
- **Fullscreen task view**: Click `Open` on any task to expand it into a focused full-screen modal (`src/components/FullscreenTask.tsx`).
- **Persistence**: Tasks are saved in `localStorage` under the key `focus-dashboard-tasks`. This is a stepping stone for adding user login and server-side persistence later.

If you'd like, I can:

- Add authentication and server persistence (example with Firebase or a simple Express API).
- Add richer widgets: notes, pomodoro presets, analytics graphs.
- Improve styling, animations, and keyboard shortcuts.


You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
