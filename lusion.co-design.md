---
version: alpha
name: Lusion Minimal
description: A stark, high-contrast editorial system built around oversized typography, black-on-white contrast, and restrained geometry.
colors:
  primary: "#000000"
  secondary: "#E5E7EB"
  tertiary: "#FFFFFF"
  neutral: "#FFFFFF"
  surface: "#FFFFFF"
  on-surface: "#000000"
  error: "#000000"
  primary-60: "#666666"
  primary-20: "#CCCCCC"
typography:
  headline-display:
    fontFamily: Aeonik
    fontSize: 192px
    fontWeight: 400
    lineHeight: 230px
    letterSpacing: 0px
  headline-lg:
    fontFamily: Aeonik
    fontSize: 103px
    fontWeight: 400
    lineHeight: 124px
    letterSpacing: 0px
  headline-md:
    fontFamily: Aeonik
    fontSize: 55px
    fontWeight: 400
    lineHeight: 66px
    letterSpacing: 0px
  headline-sm:
    fontFamily: Aeonik
    fontSize: 30px
    fontWeight: 400
    lineHeight: 66px
    letterSpacing: -3.84px
  body-lg:
    fontFamily: Aeonik
    fontSize: 19px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0px
  body-md:
    fontFamily: Aeonik
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body-sm:
    fontFamily: Aeonik
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  label-lg:
    fontFamily: Aeonik
    fontSize: 19px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0px
  label-md:
    fontFamily: Aeonik
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0px
  label-sm:
    fontFamily: Aeonik
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0px
  link:
    fontFamily: Aeonik
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 16px
  xl: 102px
  full: 9999px
spacing:
  xs: 6px
  sm: 18px
  md: 30px
  lg: 68px
  xl: 80px
  gutter: 30px
  margin: 68px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.tertiary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.xl}"
    padding: 19px 29px
    height: 65px
  button-primary-hover:
    backgroundColor: "{colors.primary-60}"
    textColor: "{colors.tertiary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.xl}"
    padding: 19px 29px
    height: 65px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.xl}"
    padding: 19px 29px
    height: 65px
  button-tertiary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.link}"
    rounded: "{rounded.none}"
    padding: 0px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 16px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 16px
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 6px 12px
---

# Lusion Minimal

## Overview
Lusion presents a spare, editorial, and almost museum-like interface style. The visual tone is highly restrained: large type, vast negative space, and minimal color create a calm but assertive presence. It feels designed for a premium audience that values clarity, confidence, and image-forward storytelling over decorative UI.

## Colors
- **Primary (#000000):** Deep black used for text, key UI chrome, and the strongest contrast moments. It gives the system its crisp, architectural feel.
- **Surface / Neutral / Tertiary (#FFFFFF):** Pure white serves as the dominant page and component background, keeping the layout bright and uncluttered.
- **Secondary (#E5E7EB):** A soft cool gray used for subtle borders and dividers, especially on cards, so surfaces stay separated without adding visual noise.
- **On-surface (#000000):** Black foreground color for readable content on white surfaces.
- **Error (#000000):** No distinct alert color is visible in the source; keep error states monochrome and rely on text, iconography, and structure rather than introducing a new hue.
- **Primary-60 (#666666) and Primary-20 (#CCCCCC):** Supporting monochrome ramps for disabled, hover, and subdued states when you need nuance without breaking the black/white system.

## Typography
Aeonik is the single voice of the system and should remain consistent across headings, body copy, labels, and links. Headings are extremely large, regular weight, and tightly controlled, with the display scale leaning toward cinematic editorial composition rather than compact marketing copy. Body text stays simple and unembellished, while labels and buttons use a slightly stronger 500 weight for readability and affordance.

The source uses no uppercase styling or aggressive tracking; instead, it relies on scale and whitespace for hierarchy. The largest heading style, `headline-display`, is intentionally oversized and expansive, while `headline-sm` introduces a dramatic negative letter-spacing to preserve visual cohesion at smaller display sizes. Links are plain and underlined, reinforcing clarity over stylistic flourish.

## Layout
The layout is spacious and centered around large negative space, with content often isolated so it can breathe. Spacing follows a loose but deliberate rhythm based on the observed increments in `spacing`: 6px, 18px, 30px, 68px, and 80px. Use these values to separate sections, pad containers, and preserve the minimal atmosphere.

Containers should favor wide margins and generous section padding rather than dense grids. Cards and smaller modules can sit within the whitespace as compact, bordered blocks, but the overall page should remain open and editorial. Avoid overcomplicated nesting; the system works best when a few elements are given room to dominate.

## Elevation & Depth
Depth is intentionally flat. There are no dramatic shadows, overlays, or layered surfaces; hierarchy comes from typography scale, whitespace, and subtle borders. Cards use a very light 1px border in `secondary` rather than shadow-based elevation, which keeps the interface feeling precise and unembellished.

Where depth is needed, prefer tonal separation and spacing over blur or shadow. The only meaningful visual relief is the contrast between black content and white surfaces, plus the occasional subtle outline around content blocks.

## Shapes
The shape language is restrained and mostly rectangular, with a few softened edges for functional elements. Cards use a modest `md` radius of 8px, giving them a slightly softened but still disciplined appearance. Interactive controls lean into a much more pill-like `xl` radius of 102px, especially primary and secondary buttons.

This contrast between square containers and rounded controls creates a clean editorial tension: structured content areas, friendly touch targets. Use `full` for chips and completely circular badges if needed, and reserve `none` for links or inline actions.

## Components
Buttons should be simple, large, and legible. `button-primary` is the strongest action: black background, white text, pill radius, and generous horizontal padding. `button-secondary` mirrors the size and radius but stays transparent/white with a black border, making it suitable for secondary actions without competing for attention. `button-tertiary` should read like a text action or link, with no container chrome and underlined text.

Maintain button sizing consistency: the observed pattern is a minimum height of 65px with substantial horizontal padding, making actions feel deliberate and easy to target. Hover states should stay monochrome; use slightly softer black/gray shifts rather than introducing accent colors or gradients.

Cards should use `card`: white background, 1px `secondary` border, 8px radius, and 16px padding. Keep card content sparse and align internal spacing to the global rhythm. Avoid heavy shadows, colored headers, or decorative separators unless absolutely necessary.

Inputs should follow the same understated logic as cards: white surface, black text, subtle border, and an 8px or smaller radius. Focus states should be crisp and functional, relying on border contrast and maybe a slight darkening rather than glow. Chips, if used, should be minimal pills with small text, rounded full corners, and modest horizontal padding.

Lists and inline navigation should remain unstyled or lightly separated, with black text and subtle spacing rather than boxed treatment. Tooltips, checkboxes, and radios should stay geometric and monochrome if added later, matching the rest of the system’s disciplined simplicity.

## Do's and Don'ts
- Do keep the interface monochrome and contrast-driven.
- Do use whitespace as the primary hierarchy tool.
- Do favor oversized, regular-weight typography for editorial emphasis.
- Do use pill buttons for primary and secondary actions.
- Don't introduce saturated accent colors or decorative gradients.
- Don't rely on shadows or layered elevation to separate surfaces.
- Don't crowd content into dense grids or tight card stacks.
- Don't mix in multiple font families or heavy font weights.