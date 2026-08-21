---
name: component-design
description: >
  High-Legibility Developer UI Component System for AlgoFlowX. Covers button
  hierarchies, interactive visualizer widgets, code playgrounds, segmented tabs,
  metric pills, data tables, dialog modals, and micro-interaction states.
---

# Component Design System — AlgoFlowX

## 1. Design Principles
1. **Developer First**: Clean typography with JetBrains Mono for code & numbers, Inter for UI text.
2. **High Tactility**: Interactive elements must provide immediate visual feedback on hover, focus, and active states.
3. **Strict Box-Sizing**: Every component must have `box-sizing: border-box; max-width: 100%;` to prevent layout overflow.
4. **Solid Color Aesthetics**: Zero gradient backgrounds. High-contrast solid accents.

---

## 2. Button Hierarchy & Tokens

| Button Type | Background | Text Color | Border | Use Case |
|---|---|---|---|---|
| **Primary (Academy)** | `#10b981` | `#ffffff` | None | Main learning CTA, Chapter completions, Exam submit |
| **Secondary (Visualizer)** | `#2563eb` | `#ffffff` | None | Algo launch, Run Code, Primary actions |
| **Tertiary / Outline** | `var(--bg-card)` | `var(--text-main)` | `1px solid var(--border)` | Reset, Copy code, Secondary tools |
| **Ghost / Text** | `transparent` | `var(--primary)` | None | Table links, text actions |

### Button Sizes
- **Large (Hero)**: `padding: 12px 20px; font-size: 13.5px; border-radius: 8px;`
- **Medium (Standard)**: `padding: 8px 16px; font-size: 12.5px; border-radius: 6px;`
- **Small (Toolbar/Pills)**: `padding: 5px 10px; font-size: 11.5px; border-radius: 6px;`
- **Extra Small (Badges/Tags)**: `padding: 2px 7px; font-size: 10px; border-radius: 4px;`

---

## 3. Interactive Code Playground & Editor Specs
- **Outer Card**: `background: #011627; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; overflow: hidden;`
- **Header Toolbar**:
  - Desktop: Single flex row with `main.c` badge on left, action buttons on right.
  - Mobile (`<= 768px`): Stacked header with full-width 3-column action grid (`Copy Code`, `Reset`, `Run Code`).
- **Code Highlighting**: Night Owl dark theme with clean line numbers and horizontal touch scrolling.
- **Terminal Output**: `#000c18` background, monospace prompt `>` with exit code and execution runtime badge.

---

## 4. Visualizer Widgets & Decision Flowcharts
- **Card Container**: `background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 20px;`
- **Active Node State**: `border-color: #10b981; background: rgba(16, 185, 129, 0.12); box-shadow: 0 0 14px rgba(16,185,129,0.3);`
- **Inactive Node State**: `opacity: 0.5; border-color: var(--border);`
- **Slider Track**: Accent color thumb with custom radius, touch-friendly min 44px tap target height.

---

## 5. Segmented Navigation Tabs & Pill Filters
- **Container**: `background: var(--bg-hover); border: 1px solid var(--border); border-radius: 8px; padding: 4px; display: flex; gap: 4px;`
- **Active Tab**: `background: var(--bg-card); color: var(--text-main); font-weight: 700; box-shadow: 0 1px 4px rgba(0,0,0,0.1);`
- **Mobile Rule**: Always attach `-webkit-overflow-scrolling: touch; scrollbar-width: none; overflow-x: auto;` for swipeable pill strips.

---

## 6. Metric Badges & Stat Chips
- **Success/Verified**: `background: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.25);`
- **Info/Chapter**: `background: rgba(37, 99, 235, 0.12); color: #3b82f6; border: 1px solid rgba(37, 99, 235, 0.25);`
- **Warning/Soon**: `background: rgba(245, 158, 11, 0.12); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.25);`
