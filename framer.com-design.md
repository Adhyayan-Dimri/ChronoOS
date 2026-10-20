---
version: alpha
name: Framer Dark
description: A high-contrast, minimalist dark system with electric blue accents and crisp editorial typography.
colors:
  primary: "#0099FF"
  secondary: "#FFFFFF"
  tertiary: "#0B0B12"
  neutral: "#000000"
  surface: "#0E1020"
  on-surface: "#FFFFFF"
  error: "#FF4D4D"
  border: "#374151"
  muted-text: "#A1A1AA"
typography:
  headline-display:
    fontFamily: "GT Walsheim Medium"
    fontSize: "54px"
    fontWeight: 500
    lineHeight: "54px"
    letterSpacing: "-2.16px"
  headline-lg:
    fontFamily: "GT Walsheim Medium"
    fontSize: "40px"
    fontWeight: 500
    lineHeight: "48px"
    letterSpacing: "-1.76px"
  headline-md:
    fontFamily: "Inter Variable"
    fontSize: "29px"
    fontWeight: 400
    lineHeight: "35px"
    letterSpacing: "-0.2px"
  headline-sm:
    fontFamily: "GT Walsheim Medium"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: "35px"
    letterSpacing: "-2.16px"
  body-lg:
    fontFamily: "Inter Variable"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28px"
    letterSpacing: "-0.1px"
  body-md:
    fontFamily: "Inter Variable"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "-0.1px"
  body-sm:
    fontFamily: "Inter Variable"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "-0.08px"
  label-lg:
    fontFamily: "Inter Variable"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
    letterSpacing: "-0.08px"
  label-md:
    fontFamily: "Inter Variable"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
    letterSpacing: "-0.04px"
  label-sm:
    fontFamily: "Inter Variable"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: "14px"
    letterSpacing: "-0.02px"
rounded:
  none: "0px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "16px"
  md: "40px"
  lg: "60px"
  xl: "120px"
components:
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.neutral}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
    height: "40px"
  button-secondary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
    height: "40px"
  button-link:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: "0px"
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "16px"
  input:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  chip:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "6px 10px"
  panel-glow:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
---

## Overview
Framer’s visual language is dark, polished, and highly contrast-driven, with a strong product-led feel rather than decorative branding. It targets design and product teams that expect speed, clarity, and a premium technical aesthetic. The mood is confident and modern, with generous breathing room around key calls to action and a dense, information-rich product preview area below.

## Colors
- **Primary (#0099FF):** A vivid electric blue used as the signature accent for focus states, glowing borders, and interactive highlights. It gives the interface its “AI and design tool” energy.
- **Secondary (#FFFFFF):** Pure white used for the main text, top-level buttons, and high-contrast UI on dark backgrounds. It is the core foreground color.
- **Tertiary (#0B0B12):** A near-black elevated panel color for secondary actions, controls, and dark UI surfaces that need to separate subtly from the page background.
- **Neutral (#000000):** The base page background and the deepest shadowless backdrop. It keeps the composition stark and cinematic.
- **Surface (#0E1020):** A deep blue-black surface tone for large embedded panels and canvas-like regions. It supports luminous blue outlines without competing with them.
- **On-surface (#FFFFFF):** Primary readable content color inside cards, panels, and controls set on dark surfaces.
- **Border (#374151):** A restrained cool gray used for card outlines and separators where a visible boundary is needed without adding weight.
- **Muted-text (#A1A1AA):** A softened gray for secondary labels, helper copy, and de-emphasized navigation text.
- **Error (#FF4D4D):** Reserved for warnings, destructive states, or validation. It should remain rare so the blue accent stays dominant.

## Typography
The system combines two voices: GT Walsheim Medium for the brand-defining headlines and Inter Variable for interface copy. Headlines are bold in presence but not heavy in weight, relying on tight negative letter-spacing and large sizes to feel editorial and modern. Body text stays compact and legible, with modest tracking and comfortable line heights for dense product messaging.

Use `headline-display` for the hero statement and other marquee moments. `headline-lg` and `headline-md` support section intros and feature messaging, while `headline-sm` can be used for smaller module headings. `body-md` is the default reading size, with `body-sm` for supporting descriptions and metadata. Labels (`label-lg`, `label-md`, `label-sm`) should stay medium-weight and concise, especially in navigation, buttons, and small utility surfaces.

The source uses sentence case and does not depend on uppercase treatment for emphasis. Tracking is slightly tightened throughout, which helps the interface feel precise and engineered rather than casual.

## Layout
The layout is centered and fixed-width on large screens, with a wide content column that leaves substantial outer margins against the black page background. The hierarchy is stacked vertically: top navigation, hero headline, CTAs, then a large feature preview card. Spacing is generous at the macro level, using a rhythm similar to 40px, 60px, and 120px to separate sections clearly.

Inside panels, spacing becomes tighter and more functional. Cards and control surfaces use 16px internal padding, while smaller controls keep compact horizontal padding for efficient toolbars. The overall feel is spacious at the page level but dense and productive inside the application preview.

## Elevation & Depth
Depth is achieved mostly through tonal layering and luminous contrast rather than heavy shadow. The page background is pure black, while panels step up slightly with near-black and deep blue-black surfaces. The large embedded workspace uses bright blue borders and glow to create a strong focal plane, replacing traditional elevation with light-based emphasis.

Shadows are minimal to absent in the observed UI, except for subtle soft separation in small floating controls. Borders and glow are the primary hierarchy tools, especially around interactive canvases and input-like elements. This keeps the system crisp and futuristic without becoming soft or material-heavy.

## Shapes
The shape language is restrained and consistent, with small to medium radii across most surfaces. Buttons and cards use `rounded.md` at 8px, which gives the interface a polished but still architectural feel. Larger containers may use `rounded.lg` for a slightly softer product shell, while pill-like chips and status elements can move to `rounded.full`.

Overall, the shapes feel controlled and pragmatic rather than playful. Corners are rounded enough to look modern, but not so soft that they dilute the technical tone.

## Components
Buttons should follow a clear hierarchy:
- `button-primary` is the highest-emphasis action. It uses a white background, dark text, 8px vertical/10px horizontal padding, and 40px height. It should feel compact, crisp, and highly readable.
- `button-secondary` is a dark filled button for supporting actions. It should visually recede behind the primary button while remaining clearly interactive.
- `button-link` is text-only and should be reserved for navigation, utility links, and low-emphasis actions.

Buttons should avoid oversized pill styling. Keep the radius at `rounded.md`, maintain tight label sizing (`label-md`), and use minimal visual noise. Hover states should brighten subtly or increase contrast rather than adding dramatic motion.

Cards use `card` styling: dark surface, 1px border in cool gray, 8px radius, and 16px padding. They should read as contained modules with clear separation from the background. For larger immersive panels, use the `panel-glow` treatment to imply a live workspace or active canvas.

Inputs should stay dark, bordered, and compact. They should look like utility controls rather than form-heavy fields, with subtle inner contrast and clear focus states. When focused, use the primary blue for outline or glow instead of changing the fill dramatically.

Chips and small pills should be low-profile and rounded to `rounded.full`. They work best for mode switches, tags, and tool status. Keep their typography small and medium-weight so they remain informative without overpowering surrounding content.

Navigation and utility text should remain understated, using `body-sm` or `label-md` sizing with muted text where appropriate. Icons are lightweight and should align closely with the text baseline for a tidy, software-centric feel.

## Do's and Don'ts
- Do keep the page background near-black and let electric blue provide the main accent.
- Do use tight, editorial headline spacing with large type and negative letter-spacing.
- Do prefer thin borders and subtle tonal differences over heavy shadows.
- Do keep primary buttons compact, white, and high-contrast.
- Don't introduce bright secondary accent colors that compete with the blue.
- Don't use large radii or pill shapes on core cards and panels unless the element is specifically a chip.
- Don't rely on drop shadows for hierarchy; use glow, borders, and contrast instead.
- Don't make body copy too loose or oversized; the interface should feel efficient and product-focused.
