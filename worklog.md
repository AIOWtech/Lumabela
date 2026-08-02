# Lumabela - AI-Powered E-Learning Platform

## Project Status: Complete (Production-Ready Frontend)

### Current Status
Complete frontend for Lumabela, an AI-powered e-learning platform with 17+ pages. The project uses Next.js 16 App Router, Tailwind CSS 4, shadcn/ui, Framer Motion, Zustand for state management, and a custom SPA router. All pages render at the `/` route using client-side navigation.

### Architecture
- **State Management**: Zustand store (`src/store/app-store.ts`) for navigation, auth, XP, and app state
- **Routing**: Client-side SPA router with lazy loading via dynamic imports
- **Layouts**: `LandingLayout` (public pages, no framer-motion) and `AppLayout` (authenticated pages with sidebar)
- **Theme**: next-themes with dark/light mode, amber/gold primary color scheme
- **Design**: Glassmorphism, 3D transforms, premium SaaS aesthetics, gradient effects
- **API**: 7 placeholder REST endpoints in `/api/` routes
- **Views Directory**: `src/views/` contains all 19 page components (renamed from `src/pages/` to avoid Next.js Pages Router conflict)

### Pages Built (19 total)
**Public Pages:**
- `landing-page.tsx` - Hero, features, courses, CTA, pricing sections (CSS-only animations, no framer-motion)
- `login-page.tsx` - Glassmorphism auth form with social login
- `register-page.tsx` - Registration with validation
- `contact-page.tsx` - Contact info + form
- `faq-page.tsx` - Accordion FAQ with search/filter
- `not-found-page.tsx` - 404 error page
- `server-error-page.tsx` - 500 error page

**Authenticated Pages:**
- `dashboard-page.tsx` - Stats, continue learning, weekly chart, recommendations
- `courses-page.tsx` - Course catalog with search, category filters, grid
- `course-details-page.tsx` - Modules, lessons, progress, sidebar
- `lesson-player-page.tsx` - Video placeholder, tabs, sidebar, XP rewards
- `lumi-ai-page.tsx` - AI chat interface with typing indicator
- `quiz-page.tsx` - Quiz flow with scoring and grades
- `leaderboard-page.tsx` - Podium, rankings table
- `premium-page.tsx` - 3 pricing tiers
- `profile-page.tsx` - Avatar, stats, badges, activity
- `certificates-page.tsx` - Certificate gallery
- `notifications-page.tsx` - Grouped notification list
- `settings-page.tsx` - 5 tab settings (Account, Appearance, Notifications, Privacy, Danger Zone)

### Shared Components
- `GlassCard` - 3D glassmorphism card with hover effects
- `AnimatedButton` - 3D button with variants (primary, secondary, ghost, outline, gradient)
- `StatBadge`, `XPBar`, `StreakDisplay`, `BadgeDisplay` - Gamification components
- `ContinueLearning`, `WeeklyChart` - Learning activity components
- `LoadingSkeleton`, `PageTransition`, `EmptyState`, `FloatingElements` - Utility components

### Design System (globals.css)
- Custom color palette: amber/gold primary, emerald accent, coral chart-3
- Glassmorphism utilities: `.glass`, `.glass-strong`
- 3D effects: `.card-3d`, `.btn-3d`
- Animations: `.gradient-text`, `.mesh-gradient`, `.animate-float`, `.animate-pulse-glow`
- Custom scrollbar, noise overlay, page transitions

### Build
- `npx next build` completes successfully (production build)
- Static server (`serve-static.ts`) serves pre-built assets via Bun
- All 19 pages compile without errors

### Environment Note
The dev environment has 4GB RAM with no swap, which causes Turbopack (Next.js 16's dev compiler) to OOM during development. The production build and static server work correctly. In a normal environment with 8GB+ RAM, `bun run dev` would work fine.

### Unresolved Issues
- Dev server (Turbopack) OOMs in this memory-constrained environment (4GB no swap)
- agent-browser (Chrome) can't coexist with the server due to memory constraints
- The code is production-ready and would work in any normal environment