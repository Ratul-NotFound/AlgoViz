---
name: responsive-design
description: >
  Professional responsive design system for AlgoFlowX. Covers the 8px grid
  rhythm, 5-breakpoint architecture, content-priority rules, overflow/scroll
  patterns, card sizing, and typographic scale used across the platform.
  Reference this skill before making ANY layout or CSS changes.
---

# Responsive Design Skill — AlgoFlowX

## Project Stack
- Framework: React + Vite
- Styling: Vanilla CSS (src/index.css)
- No Tailwind, no component library

---

## 1. Breakpoint Architecture (5 Layers)

| Breakpoint | Media Query | Responsibility |
|---|---|---|
| Large Tablet | <=1024px | Hero stacks 1-col, Learn C sidebar hides |
| Tablet | <=860px  | Flagship cards go 1-col |
| Mobile | <=768px  | Navbar slims, hero scales, buttons full-width, pillars 2-col |
| Small Mobile | <=540px | Pillars go 1-col, flagship action row stacks |
| Tiny Phone | <=375px | Minimum comfortable reading |

---

## 2. Typographic Scale

| Context | Desktop | <=768 | <=540 | <=375 |
|---|---|---|---|---|
| Hero H1 | 32px | 26px | 23px | 21px |
| Hero desc | 14px | 13.5px | 13px | 12.5px |
| Flagship title | 20px | 18px | 17px | — |
| Why card title | 15px | 13.5px | — | — |

---

## 3. Container Padding Scale (8px grid)

| Viewport | Padding | Gap |
|---|---|---|
| Desktop | 32px 24px | 32px |
| <=1024px | 24px 20px | 24px |
| <=768px | 20px 16px | 20px |
| <=540px | 16px 14px | 16px |
| <=375px | 12px 12px | 14px |

---

## 4. Grid Collapse Rules

| Section | Desktop | <=1024 | <=860 | <=768 | <=540 |
|---|---|---|---|---|---|
| Hero workbench | 57fr 43fr | 1fr | — | — | — |
| Flagship cards | 1fr 1fr | 1fr 1fr | 1fr | — | — |
| Why pillars | repeat(3,1fr) | same | — | 1fr 1fr | 1fr |
| Algo cards | auto-fill 280px | — | — | 1fr | — |
| Roadmap modules | 1fr 1fr | — | — | 1fr | — |

---

## 5. Critical Overflow and Scroll Rules

RULE: The app shell is position:fixed with overflow:hidden.
Scrolling happens inside .main (algo page) or .learn-c-main (Learn C).

Desktop Learn C:
  .learn-c-container: display:grid, overflow:hidden (children scroll internally)
  .learn-c-main: overflow-y:auto, height:100%

Mobile Learn C (<=1024px):
  .learn-c-container: display:block, height:auto, overflow:visible
  .learn-c-main: height:auto, overflow-y:visible, overflow-x:hidden
  .app-shell-learn .main: overflow-y:auto (outer .main scrolls the page)

Universal container fix:
  width:100%; max-width:100%; box-sizing:border-box; overflow-x:hidden; min-width:0

For children: apply max-width:100%; box-sizing:border-box to .content-area *
Override for code blocks: overflow-x:auto on pre, code, table

---

## 6. Touch Scrolling (Horizontal Pill Rows)

Always add to scrollable rows:
  overflow-x: auto
  -webkit-overflow-scrolling: touch
  scrollbar-width: none
  .row::-webkit-scrollbar { display: none }

Elements needing this:
  .header-mode-nav, .platform-nav-bar, .cat-filter-pills, .sandbox-tabs

---

## 7. Navbar Hidden Elements at Mobile

At <=768px hide: .header-logo-sub, .live-user-counter-pill, .header-breadcrumb, .badge-learn-chapters
At <=375px: .header-signin-btn span hidden, logo shrinks to 13px

---

## 8. No-Gradient Rule (User Preference)

NEVER use gradient colors. Use only solid flat colors:
  Green primary: #10b981 / hover #059669
  Blue secondary: #2563eb / hover #1d4ed8
  Link / info: #3b82f6
  Purple: #7c3aed
  Amber: #d97706

---

## 9. File Locations

| File | Purpose |
|---|---|
| src/index.css | All styles — global, components, responsive |
| src/pages/HomePage.jsx | Landing page layout |
| src/pages/LearnCPage.jsx | Learn C Academy layout + mobile drawer |
| src/App.jsx | App shell grid |

Responsive CSS section in index.css starts at comment:
  /* PROFESSIONAL RESPONSIVE SYSTEM — Content Priority Architecture */

---

## 10. Anti-Patterns

NEVER:
  - Use !important to fix cascade — fix specificity order instead
  - Set overflow:hidden on .app-shell-learn .main (breaks all scrolling)
  - Use fixed widths without box-sizing:border-box
  - Forget min-width:0 on flex/grid children

ALWAYS:
  - Apply box-sizing:border-box globally
  - Use width:100% not vw units inside containers
  - Test at 375px, 540px, 768px, 1024px before committing
