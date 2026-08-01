---
name: SplitEasy
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#3b4a42'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#6b7b71'
  outline-variant: '#bacbbf'
  surface-tint: '#006c4b'
  primary: '#006c4b'
  on-primary: '#ffffff'
  primary-container: '#17e8a6'
  on-primary-container: '#006344'
  inverse-primary: '#00e2a0'
  secondary: '#006b5d'
  on-secondary: '#ffffff'
  secondary-container: '#80f7e0'
  on-secondary-container: '#007163'
  tertiary: '#825500'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffc16a'
  on-tertiary-container: '#784d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#45ffbb'
  primary-fixed-dim: '#00e2a0'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005138'
  secondary-fixed: '#80f7e0'
  secondary-fixed-dim: '#62dac4'
  on-secondary-fixed: '#00201b'
  on-secondary-fixed-variant: '#005046'
  tertiary-fixed: '#ffddb4'
  tertiary-fixed-dim: '#ffb952'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#633f00'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  currency-display:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style
The design system is built on a **Corporate / Modern** aesthetic with a fresh, fintech-inspired twist. It prioritizes clarity and efficiency, ensuring that the complex task of expense tracking feels effortless and reliable. The style utilizes heavy whitespace and a card-based architecture to organize financial data into digestible modules. 

The emotional response should be one of "effortless organization." By mixing a professional structural foundation with a vibrant, minty color palette, the UI feels both trustworthy for financial transactions and modern for social group dynamics.

## Colors
The palette is centered around high-energy greens and professional teals to evoke growth and balance. 

- **Primary (#17e8a6):** Used for main actions and positive balances.
- **Secondary (#41bea9):** Used for supporting UI elements and accents.
- **Accent (#ffaa00):** Reserved for "pending" states or warnings.
- **Neutral (#1a1a1a):** The exclusive color for text on all colored backgrounds to ensure maximum legibility and a punchy, modern contrast.

The background uses a subtle vertical linear gradient from `#eef6f1` at the top to `#e3ede6` at the bottom. To add depth, use large, soft-edged blobs of the primary and secondary colors at 10-20% opacity behind the main header area or in the bottom-right viewport corner.

## Typography
This design system utilizes **Inter** exclusively to maintain a systematic and utilitarian feel. 

- **Headlines:** Use Bold (700) weight for primary page titles to establish a strong hierarchy.
- **Body:** Use Regular (400) for general descriptions and list items.
- **Financial Data:** All currency amounts, balances, and tallies must use Medium (500) weight to distinguish numbers from supporting text.
- **Mobile Adjustments:** For `headline-lg`, reduce font size to 24px and line-height to 1.1 on devices smaller than 600px.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a maximum container width of 1200px. 

- **Grid:** Use a 12-column grid for desktop, 6-column for tablet, and a single-column stack for mobile.
- **Margins:** Desktop margins are set to 40px, while mobile margins shrink to 20px.
- **Rhythm:** Use an 8px base unit. Component internal padding should be generous (typically 24px) to emphasize the "clean" brand personality.
- **Cards:** Group related information into cards that span the full width of their container columns.

## Elevation & Depth
Depth is created through **Tonal Layers** combined with **Ambient Shadows**. 

- **The Base:** The gradient background sits at the lowest level.
- **The Cards:** All cards use a white background with a subtle, diffused shadow: `0px 4px 20px rgba(26, 26, 26, 0.06)`.
- **Interactions:** Upon hover, cards should lift slightly using a more pronounced shadow: `0px 8px 30px rgba(26, 26, 26, 0.1)`.
- **Overlays:** Modals and bottom sheets use a backdrop blur (10px) with a semi-transparent dark overlay to keep focus on the action.

## Shapes
The shape language is consistently **Rounded**. 

- **Base Corner Radius:** 16px (1rem) for all main cards, modal windows, and large containers.
- **Small Elements:** Buttons and input fields should use a 12px radius to feel integrated but distinct from the larger cards.
- **Avatars:** User icons should be perfectly circular (50% radius) to contrast against the rectangular card structure.

## Components

- **Buttons:** Large, 12px rounded corners. Primary buttons use the Mint-Emerald background with #1a1a1a text. Active states should involve a slight scale-down (98%).
- **Input Fields:** Use a solid white background with a 1px border of `#41bea9` at 20% opacity. On focus, the border becomes 100% opacity Secondary color with a subtle outer glow.
- **Group Cards:** The primary vessel for data. Features a white background, 16px corner radius, and the standard ambient shadow. Headers within cards should be Bold.
- **List Items:** Separated by thin, low-contrast horizontal lines (`#1a1a1a` at 5% opacity). Each item should have a 12px vertical padding.
- **Chips/Badges:** Small pills (32px radius) used for "Paid" or "Settled" statuses. Use Secondary color backgrounds with #1a1a1a text.
- **Expense Input:** A specialized component featuring a large `currency-display` typography level and a prominent "Add" button.