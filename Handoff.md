# Globitel PMP-WFM Mobile — Handoff Document

## Project Overview

A **demo mobile app** for **Globitel**, a telecom software company. Combines two products:
- **PMP** — Performance Management Platform (KPIs, evaluations, coaching, scoring, reports)
- **WFM** — Workforce Management (scheduling, shifts, attendance, adherence, requests)

Both products live in one app with role-based navigation. Current phase: **design/demo approval**. After boss approval the codebase moves to **Ionic** — so React code must be structured for easy migration (flag migration points with `// IONIC MIGRATION:` comments).

---

## Tech Stack

| Item | Detail |
|---|---|
| Framework | React 19.2 + Vite 7.2 |
| UI Library | MUI 7.3 (`@mui/material`, `@mui/icons-material`) |
| Styling | MUI `styled()` + `sx` prop (no Tailwind) |
| Date Pickers | `@mui/x-date-pickers` 8.27 |
| Target migration | Ionic (post-approval) |
| Platforms | iOS + Android |

---

## Repository

- **Repo:** `C:\Users\Sami.Awad\OneDrive - Globitel\Documents\GitHub\pmp-wfm-mobile`
- **Dev server reads from:** `src/` (main project)
- **Active worktree:** `.claude\worktrees\objective-noyce-196c1c\src\` — changes must always be applied to **both** locations
- **Run dev:** `npm run dev` from repo root

---

## Design System Rules (non-negotiable)

These rules have been established and must be followed on every new screen:

### Color palette
| Token | Hex | Usage |
|---|---|---|
| Primary blue | `#0056b3` | Buttons, accents, links, FABs, active states |
| Dark blue | `#003d82` | Hover states |
| Light blue tint bg | `#e3f2fd` | Chips, info boxes |
| Light blue tint border | `#bbdefb` | Borders on light blue boxes |
| Surface | `#ffffff` | Cards, sheets, nav bars |
| Background | `#f5f5f5` | Page background |
| Text primary | `#1a1a1a` | Headings |
| Text secondary | `#666` / `#888` | Subtitles, labels |

### No-gradient rule
**All gradients have been removed from the app.** Replace any `linear-gradient(...)` with:
- Solid `#0056b3` for buttons/FABs
- Light tinted backgrounds (`${color}12` or `${color}15`) for cards and icon boxes
- Left accent border (`borderLeft: 3.5px solid ${color}`) for timeline blocks

### Bottom sheet pattern (standard across all sheets)
```
SheetHandle (36×4px, #d0d0d0, centered)
Navigation header row: [back icon or spacer] [title + subtitle] [optional dots] [× close]
1px solid #f0f0f0 divider
Scrollable content
Fixed footer with solid #0056b3 button (if action needed)
```

### Card / icon box pattern
```jsx
<Box sx={{
  width: 42, height: 42, borderRadius: 2.5,
  backgroundColor: `${color}15`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: color,
}}>
  <SomeIcon />
</Box>
```

### Activity blocks (timeline)
Use `accentcolor` prop — NOT `bgcolor` or `gradient`:
```jsx
const ActivityBlock = styled(Box)(({ accentcolor }) => ({
  backgroundColor: accentcolor ? `${accentcolor}12` : '#f0f4f8',
  borderLeft: `3.5px solid ${accentcolor || '#ccc'}`,
  // ...
}));
```

---

## File Structure

```
src/
├── components/
│   ├── common/
│   │   ├── DisputeModal.jsx
│   │   ├── ShiftSwapRequestModal.jsx
│   │   └── VacationRequestModal.jsx
│   ├── features/
│   │   ├── ActivitiesPage.jsx
│   │   ├── CoachingPage.jsx
│   │   ├── DayTimelinePage.jsx          ← heavily worked on this session
│   │   ├── DisputesPage.jsx
│   │   ├── EvaluationsPage.jsx
│   │   ├── EventLogsPage.jsx
│   │   ├── EventsPage.jsx
│   │   ├── HomeDashboard.jsx            ← reference quality target
│   │   ├── KPIDetailView.jsx
│   │   ├── LogsPage.jsx
│   │   ├── PerformancePage.jsx
│   │   ├── RequestsPage.jsx
│   │   ├── RewardsPage.jsx
│   │   └── SchedulePage.jsx
│   ├── layout/
│   │   ├── AppLayout.jsx                ← worked on this session
│   │   ├── BottomNavBar.jsx
│   │   └── NavigationDrawer.jsx
│   ├── gamification/
│   └── shared/
```

---

## Work Completed This Session

### 1. `AppLayout.jsx` — Notification Drawer Redesign
- Replaced MUI `List/Avatar/Button` pattern with `Box`-based rows
- Unread notifications: left `3px solid #0056b3` border + `rgba(0,86,179,0.04)` background
- Header: title (left, `flexGrow: 1`) + "Mark all read" (right, blue text)
- Removed unused imports: `List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Close`

### 2. `DayTimelinePage.jsx` — Full Redesign

**Visual changes:**
- `Header` styled: white bg, `#e8ecf1` border, dark text — no gradient
- `ActivityBlock`: changed from `({ bgcolor, gradient })` to `({ accentcolor })` — light tinted bg + left accent border
- `SelectionHighlight`: purple → `rgba(0, 86, 179, 0.1)` blue
- `CALENDAR_BLUE = '#0056b3'`
- `REQUEST_TYPES`: personal_leave color `#667eea` → `#0056b3`
- `getActivityDetails`: colors updated to match palette
- Activities: `gradient` → `accentcolor` on all blocks
- Header duration `Chip`: light blue `#e3f2fd`/`#0056b3`
- Legend chips: gradient → light tinted with borders
- FAB: purple gradient → solid `#0056b3`

**Architecture change — Unified Request Sheet:**

Replaced 4 sequential `SwipeableDrawer` components (Type Picker → Request Form → Agent Picker → Swap Confirmation) with **one persistent drawer** using internal step navigation.

**How it works:**
```js
const STEP_ORDER = ['type', 'form', 'agents', 'confirm']; // module-level constant
const [requestStep, setRequestStep] = useState(null);     // null = closed
const stepIdx = requestStep ? STEP_ORDER.indexOf(requestStep) : 0;
```

Content is a `400%`-wide flex row. `transform: translateX(-${stepIdx * 25}%)` with CSS cubic-bezier slides between panels:

```
Panel 0: Type picker list
Panel 1: Request form (date, time, reason, expiry)
Panel 2: Agent picker list
Panel 3: Swap summary / confirmation
```

**Sheet structure:**
```
SheetHandle (fixed)
Nav header: [back | spacer] [title + step subtitle] [animated dots for swap] [×]
Divider (fixed)
Content area (flex: 1, overflow: hidden) — sliding 4-panel row
Footer button (fixed, shown only on 'form' and 'confirm' steps)
```

**Step progress dots** (swap flows only, steps form/agents/confirm):
- Active dot: pill-shaped (width 20), color `#0056b3`
- Completed dots: filled blue
- Pending dots: `#d8d8d8`
- CSS transition on width + color

**Footer button logic:**
```
requestStep === 'form' + non-swap  → "Submit Request" → calls submitRequest()
requestStep === 'form' + swap      → "Next: Select Agent →" → setRequestStep('agents')
requestStep === 'agents'           → no footer (tap row to advance)
requestStep === 'confirm'          → "Send Swap Request" → calls submitRequest()
```

**Back navigation:**
```js
const goBackStep = useCallback(() => {
  const idx = STEP_ORDER.indexOf(requestStep);
  if (idx <= 0) closeRequestForm();
  else setRequestStep(STEP_ORDER[idx - 1]);
}, [requestStep, closeRequestForm]);
```

---

## What Needs to Be Done Next

The overall project goal is: **bring ALL pages up to the quality of `HomeDashboard.jsx`** (the reference screen).

Pages that still need redesign (not touched yet):
- `ActivitiesPage.jsx`
- `CoachingPage.jsx`
- `DisputesPage.jsx`
- `EvaluationsPage.jsx`
- `EventLogsPage.jsx`
- `EventsPage.jsx`
- `KPIDetailView.jsx`
- `LogsPage.jsx`
- `PerformancePage.jsx`
- `RequestsPage.jsx`
- `RewardsPage.jsx`
- `SchedulePage.jsx`
- `BottomNavBar.jsx`
- `NavigationDrawer.jsx`
- `DisputeModal.jsx`, `ShiftSwapRequestModal.jsx`, `VacationRequestModal.jsx`

**Process for each page:**
1. Read the existing file fully before suggesting changes
2. Apply the design system rules above (no gradients, blue palette, tinted icon boxes, bottom sheet pattern)
3. Apply to BOTH `src/components/...` AND `.claude/worktrees/objective-noyce-196c1c/src/components/...`
4. Verify no old references remain after each edit

---

## UX Decisions Already Made

| Decision | Rationale |
|---|---|
| Unified single bottom sheet with internal slides | 4 sequential sheets caused disorientation; single sheet with `translateX` is industry standard |
| No gradients anywhere | Brand consistency; gradients were inconsistent and looked dated |
| Fixed footer button outside scroll area | Always visible, never hidden by keyboard or content |
| `accentcolor` prop on ActivityBlock | Cleaner API than dual `bgcolor`/`gradient` props |
| `height: 85vh` on unified request sheet | Fixed height required for flex layout to work with `flex: 1` content area |
| Step dots only for swap flows | Non-swap flows are 2 steps (type → form); no indicator needed |

---

## Skill to Load

At the start of a new session, load the custom skill:

```
/anthropic-skills:sami-mobile-dev
```

This activates the senior mobile developer persona with full project context, coding standards, and Ionic migration rules.

---

## Key Gotchas

1. **Always edit BOTH files** — dev server reads `src/`, but the worktree at `.claude/worktrees/objective-noyce-196c1c/src/` must stay in sync. Simplest approach: edit main, then `cp` to worktree.
2. **Never add gradients** — any `linear-gradient` must be replaced with solid color or tinted background.
3. **`Divider` import from MUI** is already imported in most files — check before adding.
4. **The `List, ListItemButton, ListItemIcon, ListItemText` imports** were cleaned out of `DayTimelinePage.jsx` — don't re-add them; use `Box`-based rows.
5. **`SheetBanner`** styled component still exists in `DayTimelinePage.jsx` (used for the Activity Detail sheet only) — do not remove it. The gradient there is intentional (it uses `accentcolor` as solid color, not a true gradient).
