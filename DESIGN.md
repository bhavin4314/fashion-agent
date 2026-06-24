---
name: Vistra
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#5c3f41'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#906f70'
  outline-variant: '#e5bdbe'
  surface-tint: '#be0038'
  primary: '#ba0036'
  on-primary: '#ffffff'
  primary-container: '#e21e4a'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb2b6'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#5c5c5c'
  on-tertiary: '#ffffff'
  tertiary-container: '#747474'
  on-tertiary-container: '#fefcfc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdada'
  primary-fixed-dim: '#ffb2b6'
  on-primary-fixed: '#40000d'
  on-primary-fixed-variant: '#920029'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  brand: '#ff385c'
  brand-hover: '#e02d4f'
  primary-dark: '#a0002e'
  success-green: '#008545'
  primary-light-bg: '#fff5f6'
  primary-light-badge: '#fff2f3'
  rating-yellow: '#FFB800'
  amber-light: '#fffbeb'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
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
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  margin-mobile: 24px
  margin-desktop: 80px
  gutter: 24px
---

# Design System: Vistra Fashion Concierge

## Brand & Style
The design system for this fashion concierge service is built on a foundation of "Warm Precision." It blends the high-end editorial feel of luxury fashion with the approachable, functional efficiency of a world-class travel platform. The UI must feel carefully selected, not cluttered—evoking the sensation of a personal stylist who is both highly organized and effortlessly stylish.

The design style is **Corporate Modern** with a **Minimalist** editorial edge. It prioritizes clarity, high-quality imagery, and generous whitespace to allow fashion photography to remain the focal point. The emotional response should be one of reliability, inspiration, and premium hospitality.

## Colors
The palette is dominated by a clean, neutral foundation to ensure the "Radical Coral" primary color functions as a high-intent signal.

- **Primary (Radical Coral):** Used exclusively for primary actions, active states, and critical brand highlights. It should be used sparingly to maintain its impact.
- **Surface & Background:** Pure White is the default surface for all cards and primary containers. Alabaster (#F7F7F7) is used for page-level backgrounds to create a subtle distinction between the canvas and the content modules.
- **Text Hierarchy:** Mine Shaft Charcoal provides deep contrast for headings, while Foggy Gray softens secondary information and metadata to maintain a clean visual hierarchy.

## Typography
The typography utilizes **Inter** to achieve a neutral, geometric, and friendly aesthetic. 

- **Headings:** Use tight letter-spacing and bold weights to mimic premium editorial layouts. 
- **Body:** Line heights are generous (1.5x) to ensure long-form fashion advice and product descriptions remain legible and inviting.
- **Labels:** Uppercase styling can be used for `label-sm` to denote category tags or overlines, but should be avoided for interactive elements like buttons to maintain a soft, approachable tone.

## Layout & Spacing
This design system employs a **Fixed Grid** model for desktop and a **Fluid Grid** for mobile, anchored by a strict 8px spacing rhythm.

- **Desktop Layout:** A 12-column grid with a maximum content width of 1280px. Standard margins are 80px, with 24px gutters.
- **Mobile Layout:** A 4-column fluid grid with 24px side margins. 
- **Rhythm:** Spacing between related elements (label and input) should use `sm` (8px). Spacing between sections should use `xxl` (48px) to reinforce the minimalist, airy brand feel.

## Elevation & Depth
Depth is created through **Tonal Layers** and **Ambient Shadows** rather than heavy borders.

- **Level 0 (Background):** Alabaster (#F7F7F7) is the base canvas.
- **Level 1 (Cards/Surface):** Pure White (#FFFFFF) surfaces with a subtle 1px border of Cloud Gray (#EBEBEB).
- **Level 2 (Interactive/Hover):** When an element is focused or hovered, apply a soft, diffused shadow: `0px 6px 16px rgba(0, 0, 0, 0.12)`.
- **Level 3 (Overlays/Modals):** Floating elements use a more pronounced shadow: `0px 12px 28px rgba(0, 0, 0, 0.15)`.

Avoid using shadows for static, non-interactive containers to keep the interface looking clean and "flat-but-layered."

## Shapes
The shape language is defined by a consistent and intentional **Rounded (12px)** corner radius.

- **Containers:** All cards, input fields, and modal containers must use the 12px radius (`rounded-xl` in the context of this scale).
- **Buttons:** Large buttons maintain the 12px radius. Do not use fully pill-shaped (rounded-full) buttons unless they are small utility chips or "back to top" actions.
- **Media:** Product imagery and user avatars should also follow the 12px radius to ensure a cohesive, soft visual flow across the page.

## Components
- **Buttons:** Primary buttons use a Radical Coral background with White text. Secondary buttons use a White background with a 1px Mine Shaft Charcoal border. All buttons have 12px rounded corners and 14px/600 (label-md) typography.
- **Input Fields:** Use a 1px Cloud Gray border. On focus, the border transitions to Mine Shaft Charcoal (not Coral, to keep the UI grounded).
- **Cards:** Fashion item cards should have no outer border but a subtle hover shadow. Labels within cards use `label-sm` in Foggy Gray.
- **Chips:** Used for sizing or category filters. These should have an 8px radius (slightly sharper than containers) and use Alabaster backgrounds with Mine Shaft Charcoal text.
- **AI Concierge Interface:** Use a distinctive background treatment for AI-generated suggestions, perhaps a very subtle gradient or a Radical Coral tinted border, to distinguish it from standard product listings.
