---
name: Porcelain Architectural CLM
colors:
  surface: '#fcf8ff'
  surface-dim: '#dbd8e8'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#efecfc'
  surface-container-high: '#e9e6f6'
  surface-container-highest: '#e3e1f0'
  on-surface: '#1b1b25'
  on-surface-variant: '#48454f'
  inverse-surface: '#302f3b'
  inverse-on-surface: '#f2efff'
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
  background: '#fcf8ff'
  on-background: '#1b1b25'
  surface-variant: '#e3e1f0'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.005em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
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
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.25rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system establishes an executive, calm, and intellectually rigorous operating environment tailored for premium Client Lifecycle Management (CLM). The visual philosophy bridges the systematic precision of scientific instruments with the warm, editorial clarity of high-craft workspace tools.

Designed for high-touch advisors, operational leads, and executive client partners, the interface prioritizes low cognitive friction, structured document-like hierarchy, and tactile confidence. Rather than feeling like a dense transactional CRM, interactions evoke an architectural folio: deliberate whitespace, crisp typographic rhythm, and restrained chromatic signaling that elevates high-stakes client relationships.

## Colors

The palette uses a high-warmth neutral substrate paired with domain-specific semantic accents:

- **Base Substrate**: Soft Porcelain (`#F5F1EA`) acts as the primary canvas, rejecting sterile digital whites in favor of an archival, tactile paper plane. Elevated surfaces leverage Pure White (`#FFFFFF`) to establish crisp contrast.
- **Primary Ink**: Ink (`#20202B`) delivers near-black contrast with optical softness for sustained reading, paired with muted secondary tints for metadata and structural lines.
- **Royal Iris (`#887DB8`)**: Primary action driver and executive accent. Designates interactive state shifts, active lifecycle phases, and key progression points.
- **Deep Teal (`#236870`)**: Grounded operational indicator used for pipeline staging, lifecycle milestone deliverables, and client governance modules.
- **Saffron Gold (`#D9A441`)**: High-value financial signifier dedicated strictly to fiscal telemetry, invoices, contracts, and revenue quotes.
- **Terracotta Rose (`#C96F61`)**: Humanized alert and friction indicator for SLA breaches, critical approvals, and overdue actions.
- **Muted Sage (`#788F83`)**: Equilibrated support tone applied to tags, secondary badges, and passive client health classifications.

## Typography

The type system is powered entirely by **Plus Jakarta Sans**, chosen for its crisp geometric construction, modern proportions, and legible ink-traps that retain clarity across dense tabular and mobile contexts.

- **Display & Headlines (20px - 32px)**: Feature tight tracking and deliberate weights to communicate authority across account summaries, health metrics, and lifecycle stage overviews.
- **Body Architecture (14px - 16px)**: Formulated for dense client interaction threads, proposal narratives, and task briefs, favoring neutral letter spacing and open line heights.
- **Labels & Captions (12px - 14px)**: Tuned for tabular data, metadata chips, and stage progressors, employing medium and semi-bold weights to maintain legibility against muted backgrounds.

## Layout & Spacing

The layout is built upon an 8pt base grid system adapted for native mobile ergonomics across iOS and Android. 

- **Canvas Boundaries**: Mobile views maintain a rigid 16px (`1rem`) outer margin, expanding to 20px (`1.25rem`) on larger devices and foldable viewports.
- **Rhythm & Padding**: Vertical spacing strictly adheres to 4px and 8px increments. Component interior spacing scales from `space-sm` (8px) for compact table rows to `space-xl` (24px) for parent card enclosures.
- **Grid Structure**: A 4-column layout is utilized for portrait mobile experiences, scaling to an 8-column layout for horizontal tablets and expanded split-view canvases.

## Elevation & Depth

Visual hierarchy uses architectural layering instead of heavy drop shadows, reinforcing the physical feel of premium paper stocks and archival folios:

- **Level 0 (Base Canvas)**: Soft Porcelain (`#F5F1EA`), strictly flat, serving as the foundational background.
- **Level 1 (Elevated Cards & Containers)**: Pure White (`#FFFFFF`) with a hairline border (`1px solid rgba(32, 32, 43, 0.06)`) and a diffused warm ambient shadow (`0 2px 8px rgba(32, 32, 43, 0.04)`).
- **Level 2 (Interactive Floating Elements & Modals)**: Pure White (`#FFFFFF`) elevated by dual-tier ambient shadows (`0 8px 24px rgba(32, 32, 43, 0.08), 0 2px 4px rgba(32, 32, 43, 0.02)`) with a refined border (`1px solid rgba(32, 32, 43, 0.08)`).
- **Level 3 (Toasts & Overlays)**: Inverted high-contrast Ink background (`#20202B`) with slight translucency (`rgba(32, 32, 43, 0.94)`) and backdrop blur (12px), creating distinct floating separation.

## Shapes

The geometric identity balances structured precision with ergonomic softness:

- **16px Corners (`rounded-lg`)**: Applied to primary content cards, summary sheets, modal dialogs, and drawer sheets.
- **12px Corners (`rounded-md`)**: Applied to input fields, contextual dropdown menus, and data cells.
- **9999px Pills (`rounded-full`)**: Strictly reserved for interaction chips, status tags, badges, and floating action triggers.
- **Stroke Weights**: All structural outlines remain fixed at 1px hairline thickness. Iconography features an unvarying 2px stroke profile with rounded joints to preserve clarity and human touch.

## Components

- **Buttons**:
  - *Primary*: Filled Royal Iris (`#887DB8`) with Pure White text, 12px vertical padding, 9999px pill corner radius, active scale transformation (`scale(0.98)`).
  - *Secondary*: Transparent background with a 1px border (`rgba(32, 32, 43, 0.15)`), Ink text, shifting to subtle Porcelain tint on press.
  - *Operational / Action*: Deep Teal (`#236870`) fill reserved for approval workflows and stage sign-offs.

- **Cards**:
  - Elevated Pure White (`#FFFFFF`) background, 16px corner radius, internal padding of 16px or 20px, and hairline separation lines (`rgba(32, 32, 43, 0.06)`). Financial figures embedded within cards leverage Saffron Gold (`#D9A441`) in high-contrast semi-bold weights.

- **Status Chips & Pills**:
  - 9999px pill shape with 6px vertical and 12px horizontal padding.
  - Composed of 12% opacity tinted backgrounds paired with full-strength foreground typography:
    - Operational: Deep Teal (`#236870`)
    - Financial: Saffron Gold (`#D9A441`)
    - Alert: Terracotta Rose (`#C96F61`)
    - Neutral / Staging: Muted Sage (`#788F83`)

- **Input Fields**:
  - Pure White surface, 12px corner radius, 1px border (`rgba(32, 32, 43, 0.12)`), 14px text size.
  - Focus state transitions to a 1.5px Royal Iris (`#887DB8`) border with a 3px soft focus ring (`rgba(136, 125, 184, 0.15)`).

- **Lists & Data Rows**:
  - Separated by minimal 1px rules (`rgba(32, 32, 43, 0.05)`) with an integrated 2px stroke icon system. Left-aligned typography hierarchy: title in semi-bold Ink, trailing metadata in Muted Sage or Saffron Gold (for transactional sums).

- **Checkboxes & Radios**:
  - 20px diameter/width, 1.5px border, filling with Royal Iris (`#887DB8`) on selection with an inner white check glyph.