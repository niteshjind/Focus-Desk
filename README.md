# FocusDeck — Study Focus Dashboard 😊

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://niteshjind.github.io/Focus-Desk/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> A distraction-free study space following the **Neobrutalism** design aesthetic. The full viewport is an animated canvas/video live wallpaper, with high-contrast, tactile widgets floating on top: persistent sticky-note tasks, daily work calendar heatmap, consistency streak counter, study aids, and a zen liquid glass focus countdown.

🔗 **Website URL**: [https://niteshjind.github.io/Focus-Desk/](https://niteshjind.github.io/Focus-Desk/)

---

## 🌐 Live Website

Access the live dashboard anytime on PC, Tablet, or Mobile:  
👉 **[https://niteshjind.github.io/Focus-Desk/](https://niteshjind.github.io/Focus-Desk/)**

---

## ✨ Features

### 🖼️ Procedural Live Wallpaper Engine
- **10 Original 2D Canvas Wallpapers**: *Rainy Window, Starry Night (with shooting stars), Aurora Borealis, Lo-fi Sunset, Falling Sakura, Matrix of Code, Floating Bokeh, Ocean Waves, Cozy Fireplace, and Peaceful Snowfall*.
- Live controls for dim overlay ($0-80\%$), blur ($0-20\text{px}$), and speed sliders with instant crossfade.
- Custom media uploads (JPG, PNG, WebP, GIF, MP4, WebM up to 50MB) stored locally in browser **IndexedDB** via Dexie.js with automatic thumbnail generation.
- Battery and performance friendly: automatically suspends canvas animations on hidden tabs via the Page Visibility API, caps DPR at 2, and respects `prefers-reduced-motion`.

### ⏱️ Study Timer & Zen Liquid Glass Focus Mode
- **Flexible Study Timer**: Quick presets for $25\text{m}$, $5\text{m}$, $15\text{m}$ plus a manual custom minute setter ($1-360\text{m}$).
- **Zen Inactivity Auto-Hide**: After a configurable period of inactivity (configurable in Settings from $5\text{s}$ to $60\text{s}$, default $10\text{s}$), the entire interface (header, sticky notes board, sidebar) smoothly fades away.
- **Liquid Glass Center Clock**: Floating frosted glass countdown display with pure white typography, specular highlight glows, pulse status indicator, and quick pause/resume controls.
- Micro-jitter filter (<6px) prevents accidental mouse twitches from interrupting zen mode. Any deliberate mouse movement, touch, or click immediately restores the full dashboard.
- Live countdown ticker in the top navigation bar with pulsing focus session indicator.

### 📱 100% Mobile & Tablet Compatible
- **Mobile Bottom Navigation Bar**: Easy one-thumb access on smartphones to 5 dedicated tabs:
  - 📝 **Notes**: Freely draggable and list sticky notes.
  - ⏱️ **Timer**: Study Timer with preset and custom minutes.
  - 📅 **Log**: Calendar monthly completion heatmap.
  - 🔥 **Streak**: Consistency flame tracker and statistics.
  - ✨ **Themes**: Wallpaper picker and custom video/photo upload manager.
- **Quick Study Timer Banner**: Always accessible right above the notes board on mobile screens for instant 1-tap focus sessions without switching tabs.
- Dynamic mobile viewport height (`100dvh`) support to prevent mobile address bars (Safari iOS & Chrome Android) from cutting off buttons or navigation.
- Full touch and stylus support utilizing unified Pointer Events.

### 📝 Tactile Sticky-Note Tasks
- Freely draggable notes with organic rotation angles ($-2^\circ$ to $+2^\circ$), tactile 3px solid borders, and hard 6px offset shadows.
- Flexible view modes: spatial 2D Canvas Board view and structured List view.
- Satisfying **"DONE!"** stamp animation upon completion.
- 6-second **Undo** notification toast that restores the note and rolls back history.
- Local-first persistence across browser restarts and days until completed.
- Overdue alerts, color palettes (yellow, pink, blue, green, orange, purple), priority tags, and subject grouping.

### 📅 Calendar Daily Work Log & Heatmap
- Monthly work heatmap grid ($0$, $1-2$, $3-4$, $5+$ tasks completed) showing study consistency at a glance.
- Day Detail modal listing completed tasks with timestamps and pending due tasks for any date.
- Weekly productivity summary highlighting total completed tasks and your most productive study day.

### 🔥 Consistency Streak Engine & Celebrations
- Pure calculation derived directly from task completion history.
- Animated flame icon (flame dances when active today; warning state if at risk).
- Night owl setting ($4:00\text{ AM}$ day start boundary) to ensure late-night study sessions count towards the correct streak day.
- Milestone celebration confetti bursts (`canvas-confetti`) at 3, 7, 14, 30, 60, 100, and 365 days.

### 🔒 100% Private & Local-First Storage
- All tasks, streak logs, settings, and custom wallpapers remain completely private and stored directly in your browser's `localStorage` and `IndexedDB`.
- No login required, zero tracking, and no external databases.
- Includes a complete **Data Management** panel with JSON backup export and import to transfer data across devices.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|:---:|:---|
| `N` | Create a new sticky note |
| `W` | Open live wallpaper gallery |
| `F` | Toggle study focus timer session |
| `C` | Jump to calendar work log |
| `/` | Focus search bar across notes |
| `Esc` | Close dialogs / exit modals |
| `?` | Show keyboard shortcuts cheat sheet |

---

## 🛠️ Tech Stack

- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, CSS Tokens, Custom Neobrutalist design kit
- **State Management**: Zustand with persistent storage middleware
- **Local Database**: Dexie.js (IndexedDB)
- **Animations**: Framer Motion, HTML5 Canvas API
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Confetti**: canvas-confetti
- **Testing**: Vitest, React Testing Library, jsdom
- **Deployment**: GitHub Pages, GitHub Actions CI/CD

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20+ / v24+)
- npm 9+

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/niteshjind/Focus-Desk.git

# Navigate into project directory
cd Focus-Desk

# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Run Vitest unit tests
npm test

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## 📄 License

MIT License — Feel free to use and adapt this project for your own study routines!
