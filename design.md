---
name: Gilded Minimalist
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c463a'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e7669'
  outline-variant: '#cfc5b6'
  surface-tint: '#705c2a'
  primary: '#705c2a'
  on-primary: '#ffffff'
  primary-container: '#c2a86f'
  on-primary-container: '#4f3d0e'
  inverse-primary: '#dfc388'
  secondary: '#7a5900'
  on-secondary: '#ffffff'
  secondary-container: '#fdbc13'
  on-secondary-container: '#6b4d00'
  tertiary: '#5e5e5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#acabab'
  on-tertiary-container: '#3f3f40'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#fcdfa1'
  primary-fixed-dim: '#dfc388'
  on-primary-fixed: '#251a00'
  on-primary-fixed-variant: '#574415'
  secondary-fixed: '#ffdea3'
  secondary-fixed-dim: '#fdbc13'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4200'
  tertiary-fixed: '#e4e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  gutter: 16px
  card-gap: 20px
  section-margin: 40px
---

## Brand & Style

The design system is a sophisticated blend of **Minimalism** and **Modern Professionalism**, specifically tailored for high-end service management and fintech environments. It evokes a sense of prestige, clarity, and reliability through a "premium-utilitarian" lens.

The visual narrative centers on a pristine white canvas accented by a signature gold-tan primary color. This creates an atmosphere of "approachable luxury"—it feels exclusive yet highly functional. Key characteristics include:
- **Cleanliness:** Massive whitespace and clear boundaries to reduce cognitive load.
- **Sparkle:** Subtle use of star and dot motifs to add a touch of "magic" or excellence without cluttering the interface.
- **Structured Clarity:** Heavy reliance on card-based layouts and grid systems for complex data (like scheduling and billing).

## Colors

The palette is anchored in a muted **Gold-Tan** that conveys value and stability.

- **Primary (#C2A86F):** Used for primary actions, active navigation states, and key brand accents.
- **Secondary (#F4B400):** Reserved for "Golden Hour" highlights, small spark motifs, and specific pending status indicators.
- **Neutral Background (#F8F8F8):** A soft, off-white used for card backgrounds and container surfaces to differentiate from the pure white base.
- **Text & UI Chrome:** High-contrast black for headings and a deep grey for body text to ensure maximum readability against the light background.
- **Functional Colors:** A muted orange is utilized for "Pending" states, while standard greys manage disabled or secondary inputs.

## Typography

The system uses **Manrope** for its balanced, modern, and highly legible characteristics. It provides the "professional" weight required for finance and scheduling.

- **Headlines:** Set with tight tracking and bold weights to create a strong hierarchy.
- **Labels:** **Hanken Grotesk** is used for smaller UI labels and navigation items to provide a clean, technical contrast to the warmer Manrope body text. 
- **Navigation:** Main navigation items use uppercase styling with generous letter spacing to emphasize the brand's minimalist aesthetic.
- **Mobile scaling:** For devices under 768px, `display-lg` scales down to 32px and `headline-lg` to 24px to prevent horizontal overflow.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy for desktop interfaces to maintain the "card-on-canvas" look. 

- **Grid:** A 12-column layout with 16px gutters.
- **Zoning:** Layouts are divided into three clear vertical zones: Header, Main Content (3-column card grid), and Footer.
- **Rhythm:** An 8px linear scale is used for all internal component padding and spacing.
- **Responsive Behavior:** 
  - **Desktop:** Multi-column card layouts (3 columns).
  - **Tablet:** 2-column reflow with increased container margins.
  - **Mobile:** Single column stack. The main navigation converts to a simplified header menu, and card padding reduces to 16px.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows** rather than stark borders.

- **The Canvas:** Pure white (#FFFFFF).
- **Surface Containers:** Cards use a very light neutral gray (#F8F8F8) or white with a soft, highly diffused shadow (Blur: 15px, Opacity: 4%, Color: Black) to appear as if they are floating slightly above the background.
- **Interactive Elements:** Buttons and active input fields utilize a subtle inner glow or a stronger drop shadow (Blur: 8px, Opacity: 10%) on hover to provide tactile feedback.
- **Overlays:** Modals and dropdowns use a 10px backdrop blur to maintain the clean, airy feeling while isolating the user's focus.

## Shapes

The shape language is **Rounded**, favoring friendliness and approachability.

- **Standard Radius:** 0.5rem (8px) for inputs, smaller buttons, and inner card elements.
- **Large Radius (rounded-lg):** 1rem (16px) for main dashboard cards and container wrappers.
- **Extra Large Radius (rounded-xl):** 1.5rem (24px) for prominent "Call to Action" cards or profile image containers.
- **Circle:** Used exclusively for status indicators, avatar frames, and icon backdrops.

## Components

### Buttons
- **Primary:** Solid gold-tan background (#C2A86F) with white text. Slightly rounded corners (8px). 
- **Secondary:** White background with a 1px solid gray border. Text color matches the primary gold.
- **Ghost:** No background or border; used for secondary actions like "Cancel" or footer links.

### Inputs & Selects
- Fields feature a light gray background (#F2F2F2) with no border until focused.
- Labels are positioned outside the field for maximum clarity.
- Icons (like search or calendar) are placed on the left, set in a muted mid-gray.

### Schedule Grid
- **Slots:** Rounded squares (4px radius).
- **States:** 
  - *Available:* Light gray.
  - *Confirmed:* Dark gray with an 'X' icon.
  - *Pending:* Solid orange.
- **Active Selection:** Gold-tan border or fill.

### Payment & Service Cards
- Service cards include a fixed-width thumbnail on the left (rounded 8px) with title, description, and price on the right.
- Payment method cards use a "Tabbed" header style where the header is a solid color block (Gold for active, Gray for inactive) and the body is white.

### Form Containers
- Centered on the page with a generous 32px or 40px internal padding.
- Headings are centered above the form with a supporting sub-headline in a smaller font size.
