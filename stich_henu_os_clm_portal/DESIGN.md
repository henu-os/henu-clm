---
name: Scientific Clarity
colors:
  surface: '#fdf9f2'
  surface-dim: '#dddad3'
  surface-bright: '#fdf9f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3ec'
  surface-container: '#f1ede6'
  surface-container-high: '#ece8e1'
  surface-container-highest: '#e6e2db'
  on-surface: '#1c1c18'
  on-surface-variant: '#48454f'
  inverse-surface: '#31302c'
  inverse-on-surface: '#f4f0e9'
  outline: '#797580'
  outline-variant: '#c9c4d0'
  surface-tint: '#61578f'
  primary: '#5e548c'
  on-primary: '#ffffff'
  primary-container: '#776da6'
  on-primary-container: '#fffbff'
  inverse-primary: '#cbbefe'
  secondary: '#22676f'
  on-secondary: '#ffffff'
  secondary-container: '#acedf6'
  on-secondary-container: '#2a6d75'
  tertiary: '#7a5500'
  on-tertiary: '#ffffff'
  tertiary-container: '#996c04'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e6deff'
  primary-fixed-dim: '#cbbefe'
  on-primary-fixed: '#1d1147'
  on-primary-fixed-variant: '#493f75'
  secondary-fixed: '#acedf6'
  secondary-fixed-dim: '#91d1da'
  on-secondary-fixed: '#001f23'
  on-secondary-fixed-variant: '#004f56'
  tertiary-fixed: '#ffdeaa'
  tertiary-fixed-dim: '#f5bd58'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5f4100'
  background: '#fdf9f2'
  on-background: '#1c1c18'
  surface-variant: '#e6e2db'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
  metric-val:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  margin: 1.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.875rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system powers a desktop-first Client Lifecycle Management (CLM) operating system built on the philosophy of *Simple systems. Real progress.* The interface bridges scientific instrumentation with Notion-like editorial restraint: deliberate, structured, deeply legible, and free of gratuitous ornamentation.

The visual tone is intellectual, composed, and human. It resists the noisy, neon-infused tropes of generic enterprise dashboards, opting instead for architectural calm, measured proportions, and warm editorial neutrals. Information density is treated with mathematical rigor, giving complex client lifecycles room to breathe without sacrificing operational utility.

## Colors

The palette grounds high-stakes operational workflows in tactile, architectural tones:

- **Primary (`#887DB8` - Royal Iris):** Applied intentionally to focal actions, active lifecycle stages, focused selections, and signature interactive controls.
- **Secondary / Operations (`#236870` - Deep Teal):** Used for operational statuses, pipeline stages, system metrics, and structural navigation anchors.
- **Warning / Destructive (`#C96F61` - Terracotta Rose):** Natural earth-derived warning indicator for SLA breaches, contractual risks, and irreversible actions.
- **Finance / Premium (`#D9A441` - Saffron Gold):** Reserved for revenue events, high-tier tiering, financial milestones, and billing indicators.
- **Supporting (`#788F83` - Muted Sage):** Contextual health metrics, positive reconciliation states, and audit trails.
- **Surfaces & Boundaries:** Base canvas rests on Soft Porcelain (`#F5F1EA`), with active modules elevated on Pure White (`#FFFFFF`). Structural partitioning relies on Stone Grey (`#E0DAD1`) ghost borders.
- **Typography & Ink:** Primary Ink (`#20202B`) governs data cells and headings; Charcoal (`#2E2E37`) drives secondary operational text.

For the alternate dark mode, canvas shifts to `#11131A`, default container surfaces to `#181B24`, and elevated modules to `#202431`.

## Typography

Plus Jakarta Sans is calibrated across all interfaces to provide rhythmic legibility and structured hierarchy. 

Numerical integrity is non-negotiable: all tables, metric modules, pricing columns, and analytical values enforce tabular figures (`font-variant-numeric: tabular-nums lining-nums`) to prevent optical wobble during sorting and live polling. Uppercase tracking is applied sparingly to `label-md` and `label-sm` to serve as clean categorization stamps throughout document trees and lifecycle metadata.

## Layout & Spacing

The portal adopts a desktop-first fixed-sidebar fluid-workspace model. The layout logic separates operational structure into two primary horizontal divisions: a static 240px navigation spine (collapsible to 64px icon rail) and a dynamic analytical canvas configured with a fluid 12-column grid.

- **Workspace Margins:** 1.75rem canvas padding keeps wide views breathable without disconnecting controls from the edges.
- **Section Rhythm:** Metrics blocks and lifecycle stages utilize 1.25rem gutters. Internal grouping follows strict multiples of `space-xs` (4px) and `space-sm` (8px), preventing inconsistent visual density.
- **Adapting Breakpoints:**
  - `Desktop (>= 1280px)`: Full 12-column analytical canvas with contextual split-pane inspectors.
  - `Laptop (1024px - 1279px)`: Sidebar collapses to 64px rail automatically on detail views; right inspectors slide over as overlay sheets.
  - `Tablet (768px - 1023px)`: Fluid single-column reflow for transactional tables, transforming complex multi-column grids into horizontally scrollable matrices with pinned client ID columns.

## Elevation & Depth

Visual hierarchy is maintained through subtle tonal layering and crisp, low-contrast outlines rather than heavy skeuomorphic drop shadows.

1. **Base Layer:** `#F5F1EA` (Soft Porcelain) acts as the foundation stage.
2. **Surface Layer:** Cards, table containers, and form panels use `#FFFFFF` paired with a single 1px hairline border of `#E0DAD1` (Stone Grey).
3. **Floating & Overlays (Command Palette, Drawers, Modals):** Achieved via clean surface elevation accompanied by an ultra-diffused, ambient shadow (`0 12px 32px -4px rgba(32, 32, 43, 0.06), 0 4px 12px -2px rgba(32, 32, 43, 0.04)`) overlaid on a muted backdrop veil (`rgba(32, 32, 43, 0.2)`).
4. **Interactive States:** Hover effects never lift elements vertically; depth is indicated through tonal background shifts (e.g., `#FFFFFF` shifting to `#F5F1EA` at 50% opacity) or distinct border accents in `#887DB8`.

## Shapes

The design system employs a soft geometric contour (`roundedness: 1`). Interactive elements, table headers, and structural tiles embrace 4px (`0.25rem`) corner radiuses, yielding an architectural, precise silhouette that feels modern yet strictly business-grade.

- Inputs, buttons, segmented controls, and metric cells: 4px border-radius.
- Cards, modal containers, and overlay sheets: 8px (`rounded-lg`) border-radius.
- Status badges and pills: Retain a 4px corner to match the structured, document-oriented taxonomy, intentionally steering clear of playful capsule or full-pill shapes.

## Components

### Buttons
- **Primary:** Solid `#887DB8` background with `#FFFFFF` text. Subtle hover tint to `#776CA7`. No drop shadow. Height: 36px (compact desktop).
- **Secondary / Ghost:** Transparent background with a 1px `#E0DAD1` border and `#20202B` text. Hover transitions to `#F5F1EA`.
- **Destructive:** 1px `#C96F61` hairline border with `#C96F61` text, transitioning on hover to a `#C96F61` fill with `#FFFFFF` text.

### Inputs & Global Search
- Height: 36px with 8px horizontal padding.
- Crisp 1px `#E0DAD1` outline, shifting to a 1px focus ring in `#887DB8` with no glow spread.
- Global Search in the top header features an embedded shortcut badge (`⌘K`) aligned right in `label-sm` monospace styling.

### Status Badges & Chips
- Flat semantic tags with a tinted background (12% opacity of the semantic color) paired with a high-contrast text label (e.g., Deep Teal `#236870` for 'Active', Saffron Gold `#D9A441` for 'Under Review', Terracotta Rose `#C96F61` for 'Escalated').
- 4px radius, `label-md` uppercase weight, 2px vertical by 6px horizontal padding.

### Metric Cards & Restrained Charts
- White tile containers outlined in `#E0DAD1`.
- Display a micro-label (`label-md`) at the top, bold metric value (`metric-val`) using tabular numerals, and a subdued sparkline or delta indicator below. Sparklines render with a 1.5px stroke width, omitting fill gradients.

### Transactional Tables
- Flat zebra-less rows separated by 1px hairlines (`#E0DAD1`). Row height: 44px.
- Table headers set in `label-md` with Primary Ink at 60% opacity.
- Row hover triggers an immediate soft fill (`#F5F1EA` at 60% opacity) across all pinned and scrollable cells.

### Left Navigation Sidebar & Command Palette
- **Sidebar:** Houses the HENU OS emblem, organization switcher, categorized module links, and collapse toggle. Selected states use a 2px left border accent in `#887DB8` on a softened surface.
- **Command Palette:** Centered 560px modal activated via `⌘K`, surfacing quick actions, client records, and jump links with instant keyboard-driven navigation (`↑`, `↓`, `↵`).