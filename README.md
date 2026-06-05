# Apex Grid

A MotoGP-inspired motorsport command center built as a portfolio project. Dense, broadcast-style UI with real-time data simulation, race strategy tools, and premium sports aesthetics.

> "A high-performance motorsport interface exploring real-time data visualization, race strategy controls, and premium sports UI design."

---

## Screens

### Live Race Dashboard
Full-viewport broadcast layout — animated circuit map with 20 live rider positions, leaderboard with gap timing, sector splits with broadcast color coding (purple/green/yellow), SpeedGauge, and a fastest-lap ticker.

### Rider Profile
Hero section with oversized bike number backdrop, team color stripe, career statistics grid, championship points progression chart, and recent race results table with tire strategy badges.

### Race Calendar
18-round season schedule with country flag cards, weather badges, winner chips, round timeline strip, and filter tabs (All / Completed / Upcoming / Street Circuits).

### Team Garage
Full bike setup interface — suspension sliders (front/rear preload, compression, rebound), aerodynamics, brake balance, fuel load stepper, tire compound selector, and SVG bike schematic. Supports 10 fictional teams with 3 setup presets each.

### Track Preview
Circuit map with interactive braking, overtaking, and speed zone markers. Click any zone to open a corner detail panel (apex speed, braking distance, gear). Tire degradation chart and pit stop strategy recommendations per compound.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, static export) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| 3D | Three.js via `@react-three/fiber` + `@react-three/drei` |
| Charts | Recharts |
| Icons | Lucide React |
| Language | TypeScript (strict) |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Homepage — Three.js helmet + screen links
│   ├── dashboard/                # Live Race Dashboard
│   ├── riders/[id]/              # Rider Profile (20 static routes)
│   ├── calendar/                 # Race Calendar
│   ├── garage/                   # Team Garage
│   └── track/[id]/               # Track Preview (18 static routes)
├── components/
│   ├── RiderCard, StatTile       # Data display blocks
│   ├── LeaderboardRow            # Timing tower row
│   ├── TelemetryPanel            # Sector timing grid
│   ├── SectorBar, SpeedGauge     # Live data visualizations
│   ├── StatusBadge               # Tire compound + weather + flag badges
│   ├── TimelineCard              # GP calendar card
│   ├── TrackMarker               # SVG circuit zone overlay
│   ├── SetupSlider               # Motorsport-panel range input
│   ├── HelmScene                 # Three.js 3D centerpiece
│   ├── PageTransition            # Route entrance animation
│   └── Nav                      # Fixed top navigation
├── data/
│   ├── types.ts                  # All shared TypeScript interfaces
│   ├── riders.ts                 # 20 fictional riders
│   ├── teams.ts                  # 10 fictional teams
│   ├── circuits.ts               # 18 circuits with SVG paths + zone data
│   ├── calendar.ts               # 18-round season calendar
│   ├── raceResults.ts            # Race results for completed rounds
│   ├── telemetry.ts              # Live session state
│   └── garagePresets.ts          # 30 bike setup presets
└── lib/
    ├── designTokens.ts           # Color palette, compound styles, chart theme
    └── flags.ts                  # Country code → flag emoji utilities
```

---

## Design System

- **Background:** `#0A0A0F` carbon black
- **Text:** `#E8E8E0` off-white
- **Accent red:** `#E8001C` — positions, CTAs, Soft tire
- **Accent cyan:** `#00D2FF` — data highlights, overtaking zones
- **Warning yellow:** `#FFD000` — Medium tire, caution states
- **Sector purple:** `#CC00FF` — overall fastest lap
- **Font:** Barlow Condensed — condensed bold display type throughout
- **Panels:** Sharp `rounded-sm` edges, carbon fiber CSS texture, angled diagonal dividers
- All data is fictional — no real trademarks, teams, or rider names

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # Production build (45 static pages)
npm start       # Serve production build
```

---

## Notes

- All race data, riders, teams, and circuits are entirely fictional
- "Live" updates on the dashboard are simulated via `setInterval` cycling through pre-built telemetry snapshots
- Three.js scene uses `dynamic(() => import(...), { ssr: false })` — requires client-side WebGL
- All animations respect `prefers-reduced-motion` via Framer Motion's `useReducedMotion()`
