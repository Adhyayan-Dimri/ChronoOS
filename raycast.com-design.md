---
version: alpha
name: Raycast Dark
description: A high-contrast, minimal launch experience with neon red energy and precise utility.
colors:
  primary: "#FF5C7A"
  primary-strong: "#FF3D5C"
  secondary: "#9C9C9D"
  tertiary: "#ffffff"
  neutral: "#07080A"
  surface: "#0B0D10"
  on-surface: "#FFFFFF"
  outline: "#FFFFFF0F"
  muted-outline: "#9C9C9D33"
  error: "#FF4D4F"
typography:
  headline-display:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: 600
    lineHeight: 70.4px
    letterSpacing: 0px
  headline-lg:
    fontFamily: Inter
    fontSize: 47px
    fontWeight: 500
    lineHeight: 56px
    letterSpacing: 0.2px
  headline-md:
    fontFamily: Inter
    fontSize: 34px
    fontWeight: 500
    lineHeight: 41px
    letterSpacing: 0.2px
  headline-sm:
    fontFamily: Inter
    fontSize: 25px
    fontWeight: 500
    lineHeight: 38.4px
    letterSpacing: 0.2px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.2px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.2px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.2px
  label-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.2px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.2px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.2px
rounded:
  none: 0px
  sm: 4px
  md: 6px
  lg: 12px
  xl: 20px
  full: 9999px
spacing:
  xs: 6px
  sm: 16px
  md: 32px
  lg: 50px
  xl: 72px
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.secondary}"
    rounded: "{rounded.md}"
    padding: "12px 8px"
    size: "14px"
    height: "41px"
  button-primary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "12px 8px"
    size: "14px"
    height: "41px"
  button-secondary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
    size: "14px"
    height: "41px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.secondary}"
    rounded: "{rounded.none}"
    padding: "0px"
    size: "14px"
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
    height: "41px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.full}"
    padding: "6px 10px"
  nav-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.full}"
    padding: "10px 14px"
---

# Raycast Dark

## Overview
Raycast presents as a polished, developer-forward product brand: sharp, efficient, and quietly theatrical. The page uses a near-black canvas with a vivid pink-red focal glow, creating a sense of speed and intensity without feeling noisy. The overall tone is premium and technical, with a spacious composition that lets a few core messages and actions carry the full weight of the page.

## Colors
- **Primary (#FF5C7A):** The signature neon pink-red accent used for the energetic diagonal beam effects and for emphasizing key interactive moments.
- **Primary strong (#FF3D5C):** A hotter red variation for stronger emphasis, active states, or denser glow effects.
- **Secondary (#9C9C9D):** A muted graphite-gray used for navigation items, secondary button labels, and low-emphasis utility text.
- **Tertiary (#FFFFFF):** Clean white used for the most important actions, headline text, and high-contrast button surfaces.
- **Neutral (#07080A):** The near-black background that establishes the cinematic, minimal foundation.
- **Surface (#0B0D10):** A slightly lifted dark surface for cards, nav containers, and inset panels.
- **On-surface (#FFFFFF):** The default foreground color for text and iconography on dark surfaces.
- **Outline (#FFFFFF0F):** A faint translucent border tone used to define containers without breaking the dark atmosphere.
- **Muted outline (#9C9C9D33):** A soft gray border or divider color for subtle separation.
- **Error (#FF4D4F):** A bright alert red that aligns with the system’s vivid accent language.

## Typography
Inter is the defining typeface across the system, giving the UI a modern, highly legible, product-led feel. Headlines use medium to semibold weights, with large sizes and tight but not compressed line heights, which makes the hero feel confident and crisp rather than decorative. Body text stays regular and readable, while labels and controls use 500 weight for clarity in navigation and buttons.

Letter spacing is restrained but slightly open at 0.2px for headings, body, and labels, which helps text feel clean against the dark background. The visual style does not rely on all-caps treatment; instead, hierarchy comes from size, weight, and contrast.

## Layout
The layout is centered, hero-driven, and intentionally sparse, with large negative space around the main message and CTA stack. Horizontal structure is constrained to a fixed, content-first width rather than a busy responsive grid, which keeps the page feeling composed and premium. Spacing follows a loose but disciplined rhythm based on 6px, 16px, 32px, 50px, and 72px increments, with larger jumps reserved for section separation and hero breathing room.

Navigation and call-to-action containers use generous padding and rounded framing, while the hero keeps the central axis open so the diagonal graphic can dominate the background. Content blocks are aligned for quick scanning rather than dense comparison.

## Elevation & Depth
Depth is created mostly through contrast, glows, and subtle borders rather than heavy shadow stacking. The interface is fundamentally flat, but small inset highlights and faint outlines on cards and nav shells give surfaces enough definition to feel tactile. The branded diagonal artwork adds the strongest sense of depth, using blur, grain, and luminous color transitions to create a layered, atmospheric backdrop.

Shadows should remain understated and sparse; the system is not trying to feel skeuomorphic or materially heavy. When elevation is needed, prefer translucent borders and slight inner highlights over broad drop shadows.

## Shapes
The shape language is restrained and soft-edged, with small radii on most interactive elements. Buttons and compact controls use 6px corners for a practical, modern feel, while larger containers use 12px radii to keep panels approachable without looking playful. Full-pill shapes are reserved for small badges, chips, and the lower-importance navigation/utility pills.

Overall, the system feels architectural and precise rather than rounded or bubbly.

## Components
Buttons are the most visible component family and should stay compact, crisp, and text-forward. Use `button-primary` for understated navigation-style actions with transparent backgrounds and muted gray text, and reserve `button-secondary` for the standout white CTA treatment. `button-link` should be used for low-emphasis text links with no container chrome. Hover states should increase contrast and move text toward `colors.on-surface`, but avoid adding heavy fills or oversized shadows.

Cards should use the `card` token: dark surface, subtle outline, 12px radius, and comfortable internal padding. They should feel like quiet containers, not raised panels. Keep borders faint and avoid bright separation lines.

Inputs should mirror card styling: dark surface, clear white text, 6px or 12px radius depending on prominence, and compact vertical sizing around 41px tall. Placeholder and helper text should remain secondary gray, with focus states relying on border brightening or glow rather than dramatic fills.

Chips and nav pills should use rounded-full framing, muted surfaces, and restrained gray text. They should read as lightweight selectors or metadata rather than prominent buttons. Icons are small but important, often paired with labels in controls such as the Mac download button.

The page’s hero headline should use `headline-display`, with supporting copy in `body-lg`. Navigation items and button labels should use `label-md` or `body-sm` depending on emphasis, keeping the overall interface compact and efficient.

## Do's and Don'ts
- Do keep the canvas nearly black and let accent color appear as a focused highlight, not a full-page fill.
- Do use Inter consistently for all UI text, with medium weights for controls and headings.
- Do keep borders subtle and translucent so surfaces remain atmospheric.
- Do favor compact, precise controls with 6px to 12px radii.
- Do center major hero content and preserve generous negative space around it.
- Don't introduce bright neutrals, warm beige surfaces, or heavy chrome.
- Don't use oversized shadows or layered elevations that compete with the background glow.
- Don't make buttons loud or bulky; the system should feel fast, minimal, and utility-driven.