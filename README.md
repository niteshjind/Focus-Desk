# FocusDeck — Study Focus Dashboard

> A distraction-free study space following the **Neobrutalism** design aesthetic. The full viewport is an animated canvas/video live wallpaper, with high-contrast, tactile widgets floating on top: persistent sticky-note tasks, daily work calendar heatmap, consistency streak counter, and study aids.

---

## ✨ Features

- **🖼️ Procedural Live Wallpaper Engine**:
  - 10 procedural 2D canvas wallpapers: *Rainy Window, Starry Night (with shooting stars), Aurora Borealis, Lo-fi Sunset, Falling Sakura, Matrix of Code, Floating Bokeh, Ocean Waves, Cozy Fireplace, and Peaceful Snowfall*.
  - Dim overlay ($0-80\%$), blur ($0-20\text{px}$), and speed sliders with instant crossfade.
  - Custom media uploads (JPG, PNG, WebP, GIF, MP4, WebM up to 50MB) stored in browser **IndexedDB** via Dexie.js with auto thumbnail generation.
  - Auto-pauses on background tabs via Page Visibility API and respects `prefers-reduced-motion`.

- **📝 Tactile Sticky-Note Tasks**:
  - Freely draggable notes with rotation angles ($-2^\circ$ to $+2^\circ$), tactile 3px borders, and hard offset shadows.
  - Board view and compact List view.
  - Satisfying **"DONE!"** stamp animation upon completion.
  - 6-second **Undo** notification toast.
  - Local-first persistence across browser restarts and days until completed.
  - Overdue alerts, color palettes, priorities, and subject tags.

- **📅 Calendar Daily Work Log**:
  - Monthly work heatmap grid ($0$, $1-2$, $3-4$, $5+$ tasks completed).
  - Day Detail modal listing completed tasks with timestamps and pending due tasks.
  - Weekly summary highlighting total done and best study day.

- **🔥 Consistency Streak System**:
  - Pure calculation derived directly from task completion history.
  - Animated flame icon (flame dances when active today; warning state if at risk).
  - Milestones at 3, 7, 14, 30, 60, 100, 365 days with confetti burst celebrations (`canvas-confetti`).
  - Night owl setting ($4:00\text{ AM}$ day start boundary).

- **🎯 Focus Mode & Study Tools**:
  - Single-task isolation mode with live clock.
  - Pomodoro timer ($25\text{m} / 5\text{m} / 15\text{m}$) with Neobrutalist progress bar.
  - Ambient sound mixer (Rain & White Noise synthesized 100% offline via Web Audio API).
  - JSON backup export and import.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|:---:|:---|
| `N` | Create a new sticky note |
| `W` | Open live wallpaper picker |
| `F` | Toggle single-task Focus Mode |
| `C` | Jump to calendar work log |
| `/` | Quick search tasks |
| `Esc` | Close dialogs / exit Focus Mode |
| `?` | Show keyboard shortcuts cheat sheet |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24.11.0)
- npm 9+

### Installation & Development
```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Run Vitest unit tests
npm test

# Build for production
npm run build
```
