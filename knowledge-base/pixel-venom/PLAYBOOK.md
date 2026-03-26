# PIXEL VENOM — Frontend Developer Knowledge Base

## How the Best Frontend Engineers Build Production UIs

Source: Practices from Vercel/Next.js team, Linear, Stripe Dashboard, Tailwind UI, and Claude's design language.

---

## 1. Next.js App Router Structure

```
dashboard/
├── app/
│   ├── layout.tsx             # Root layout (shared nav, providers)
│   ├── page.tsx               # Landing / home page
│   ├── globals.css            # Global styles
│   ├── (auth)/
│   │   ├── login/page.tsx     # Login page
│   │   └── register/page.tsx  # Registration
│   ├── (ceo)/                 # CEO-only routes
│   │   ├── layout.tsx         # CEO layout with sidebar
│   │   ├── dashboard/page.tsx # CEO dashboard
│   │   ├── projects/page.tsx  # All projects
│   │   ├── projects/[id]/page.tsx
│   │   ├── teams/page.tsx     # Team overview
│   │   ├── costs/page.tsx     # Cost tracking
│   │   └── sentinel/page.tsx  # Chat with SENTINEL
│   └── (client)/              # Client routes
│       ├── layout.tsx         # Client layout
│       ├── portal/page.tsx    # Client dashboard
│       ├── chat/page.tsx      # Chat with AI
│       └── project/page.tsx   # Project progress
├── components/
│   ├── ui/                    # Base components (Button, Input, Card, etc.)
│   ├── layout/                # Header, Sidebar, Footer
│   ├── dashboard/             # Dashboard-specific components
│   ├── chat/                  # Chat interface components
│   └── shared/                # Reusable across views
├── lib/
│   ├── api.ts                 # API client
│   ├── supabase.ts            # Supabase client
│   ├── auth.ts                # Auth helpers
│   └── utils.ts               # Utility functions
└── styles/
    └── tailwind.config.ts     # Tailwind configuration
```

## 2. Design System (Claude-Inspired)

### Color Palette
```css
/* Warm, clean, professional */
--bg-primary: #FAFAF8;        /* Page background */
--bg-secondary: #F5F4F0;      /* Section background */
--bg-card: #FFFFFF;            /* Card background */
--border: #E8E5DE;             /* Borders */
--border-light: #F0EDE6;       /* Subtle borders */

--text-primary: #2D2B28;       /* Headings, body */
--text-secondary: #6B6560;     /* Secondary text */
--text-muted: #9B9590;         /* Muted text, labels */

--accent: #C4704B;             /* Primary action, links */
--accent-light: #F5EDE8;       /* Accent background */
--accent-hover: #B5623F;       /* Hover state */

--success: #4A8C6F;            /* Green - success, active */
--warning: #B8963E;            /* Yellow - warning, review */
--error: #C25B4E;              /* Red - error, blocked */
--info: #5B7FB5;               /* Blue - info */
```

### Typography
```css
font-family: 'Inter', -apple-system, system-ui, sans-serif;
font-mono: 'JetBrains Mono', monospace;

/* Scale */
--text-xs: 0.65rem;    /* Labels, badges */
--text-sm: 0.78rem;    /* Secondary text */
--text-base: 0.88rem;  /* Body text */
--text-lg: 1.05rem;    /* Section titles */
--text-xl: 1.25rem;    /* Page titles */
--text-2xl: 1.5rem;    /* Hero text */

/* Weights */
Regular: 400  — body text
Medium: 500   — emphasis
Semibold: 600 — headings
```

### Spacing & Layout
```css
/* 4px base grid */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;

/* Border radius */
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;

/* Shadows */
--shadow-sm: 0 1px 3px rgba(0,0,0,0.04);
--shadow-md: 0 4px 12px rgba(0,0,0,0.06);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.08);
```

## 3. Component Architecture

### Base Components (reusable primitives)
```
Button        — primary, secondary, ghost, danger variants
Input         — text, email, password, with labels and errors
Textarea      — auto-resize, character count
Select        — single, multi, searchable
Card          — with header, body, footer slots
Badge         — status indicators (active, idle, blocked)
Avatar        — initials or image, sizes sm/md/lg
Modal         — with backdrop, escape-to-close
Toast         — success, error, info notifications
Skeleton      — loading states
Spinner       — inline loading indicator
EmptyState    — when no data (illustration + message + action)
```

### Composition Rules
```
1. Components take ONLY the props they need
2. Use composition over configuration
3. No component does more than one thing
4. Style with Tailwind classes, not inline styles
5. Every component has a loading state
6. Every component has an empty state
7. Every component handles errors
```

## 4. State Management

```typescript
// USE REACT SERVER COMPONENTS by default (no client state needed)
// Only use "use client" when you need:
//   - Event handlers (onClick, onChange)
//   - Browser APIs (localStorage, WebSocket)
//   - Hooks (useState, useEffect)

// DATA FETCHING PATTERNS:

// 1. Server Component (preferred) — data fetched at build/request time
async function ProjectsPage() {
  const projects = await getProjects()  // runs on server
  return <ProjectList projects={projects} />
}

// 2. Client-side with SWR (for real-time data)
"use client"
function ActivityFeed() {
  const { data, error, isLoading } = useSWR('/api/activity', fetcher, {
    refreshInterval: 3000  // poll every 3 seconds
  })
  if (isLoading) return <Skeleton />
  if (error) return <ErrorState />
  return <FeedList items={data} />
}

// 3. WebSocket (for live updates)
"use client"
function LiveDashboard() {
  const [events, setEvents] = useState([])
  useEffect(() => {
    const channel = supabase.channel('activity')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' },
        (payload) => setEvents(prev => [payload.new, ...prev])
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])
}
```

## 5. Real-Time Dashboard Patterns

### Live Activity Feed
```typescript
// Efficient real-time feed
function ActivityFeed() {
  // 1. Load initial batch from API
  // 2. Subscribe to Supabase Realtime for new entries
  // 3. Prepend new entries to top
  // 4. Virtualize list for performance (only render visible items)
  // 5. Show "X new items" badge for items added while scrolled down
}
```

### Live Status Indicators
```typescript
// Team status dots
function StatusDot({ status }) {
  const colors = {
    idle: 'bg-gray-300',
    active: 'bg-green-500 animate-pulse',
    blocked: 'bg-red-500',
    review: 'bg-yellow-500'
  }
  return <div className={`w-2 h-2 rounded-full ${colors[status]}`} />
}
```

### Charts and Metrics
```
Use: Recharts (lightweight, React-native)
Types needed:
  - Line chart (cost over time)
  - Bar chart (tasks by team)
  - Pie/donut chart (cost by LLM model)
  - Progress bar (project completion)
  - Sparkline (inline trend)
```

## 6. Chat Interface (Claude-style)

```
LAYOUT:
  ┌─────────────────────────────┐
  │ Chat Header (agent name)    │
  ├─────────────────────────────┤
  │                             │
  │  Agent message              │
  │  (left-aligned, subtle bg)  │
  │                             │
  │          User message       │
  │   (right-aligned, accent)   │
  │                             │
  │  Agent typing...            │
  │                             │
  ├─────────────────────────────┤
  │ [Input field]     [Send]    │
  └─────────────────────────────┘

FEATURES:
  - Auto-scroll to bottom on new message
  - Markdown rendering in messages
  - Code block highlighting
  - Typing indicator (animated dots)
  - Message timestamps (hover to see full)
  - File upload support
```

## 7. Performance Rules

```
NEXT.JS PERFORMANCE:
  [ ] Use Server Components by default
  [ ] Dynamic imports for heavy components: dynamic(() => import(...))
  [ ] Image optimization: next/image with proper sizes
  [ ] Font optimization: next/font
  [ ] Minimize "use client" boundary
  [ ] Prefetch links for instant navigation

RENDERING:
  [ ] Virtualize long lists (react-window or tanstack-virtual)
  [ ] Debounce search inputs (300ms)
  [ ] Throttle scroll handlers (100ms)
  [ ] Memoize expensive computations (useMemo)
  [ ] Avoid re-renders: stable references, proper keys

BUNDLE SIZE:
  [ ] Tree-shake imports: import { Button } from 'lib' not import * as lib
  [ ] No large libraries for simple tasks
  [ ] Analyze bundle: next/bundle-analyzer
  [ ] Target: < 200KB initial JS
```

## 8. Accessibility (WCAG 2.1 AA)

```
MINIMUM REQUIREMENTS:
  [ ] All interactive elements keyboard accessible
  [ ] Focus styles visible on all focusable elements
  [ ] Color contrast ratio >= 4.5:1 for text
  [ ] All images have alt text
  [ ] Form inputs have labels
  [ ] Error messages linked to inputs (aria-describedby)
  [ ] Page has proper heading hierarchy (h1 > h2 > h3)
  [ ] Skip-to-content link for keyboard users
  [ ] ARIA labels on icon-only buttons
  [ ] Modals trap focus
```

## 9. Responsive Design

```
BREAKPOINTS:
  sm: 640px   — mobile landscape
  md: 768px   — tablet
  lg: 1024px  — small desktop
  xl: 1280px  — desktop
  2xl: 1536px — large desktop

MOBILE-FIRST:
  - Design for mobile first, enhance for larger screens
  - Sidebar collapses to hamburger on mobile
  - Tables become card lists on mobile
  - Multi-column layouts stack on mobile
  - Touch targets minimum 44x44px
```

## 10. Handoff Checklist

```
BEFORE SHIPPING:
[ ] All pages render without errors
[ ] Loading states on all async operations
[ ] Error states handle all failure modes
[ ] Empty states when no data
[ ] Responsive at all breakpoints
[ ] Keyboard navigation works
[ ] Real-time updates working
[ ] Forms validate before submit
[ ] Auth redirects working (protected routes)
[ ] No console errors or warnings
[ ] Performance: LCP < 2.5s, FID < 100ms
```
