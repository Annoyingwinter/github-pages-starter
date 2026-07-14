---
name: "Annoying Winter: Pressure Fold"
description: "A cinematic native WebGL2 material study shaped by pressure, rupture, and release."
colors:
  background: "oklch(10% 0.015 245)"
  background-deep: "oklch(6% 0.012 245)"
  ink: "oklch(95% 0.006 235)"
  ink-soft: "oklch(73% 0.018 235)"
  ink-faint: "oklch(64% 0.016 235)"
  line: "oklch(32% 0.022 235)"
  signal: "oklch(88% 0.205 116)"
  signal-ink: "oklch(16% 0.04 118)"
typography:
  display:
    fontFamily: "Anek Pressure, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "clamp(4rem, 8.5vw, 5.75rem)"
    fontWeight: 800
    lineHeight: 0.84
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Anek Pressure, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "clamp(3.5rem, 7vw, 5.75rem)"
    fontWeight: 800
    lineHeight: 0.84
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Anek Pressure, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "clamp(0.95rem, 1.25vw, 1.08rem)"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "normal"
  label:
    fontFamily: "Anek Pressure, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "0.68rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.07em"
spacing:
  page-gutter: "clamp(1rem, 3.5vw, 3.5rem)"
  copy-gap: "clamp(1.4rem, 3vw, 2.6rem)"
  section-gap: "2rem"
  touch-target: "3rem"
components:
  navigation-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    padding: "0"
    height: "2.75rem"
  navigation-link-active:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0"
    height: "2.75rem"
  action-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0"
    height: "3rem"
  action-link-hover:
    backgroundColor: "transparent"
    textColor: "{colors.signal}"
    typography: "{typography.label}"
    padding: "0"
    height: "3rem"
  material-mode:
    backgroundColor: "transparent"
    textColor: "{colors.ink-faint}"
    typography: "{typography.label}"
    padding: "0"
    height: "2.75rem"
  material-mode-selected:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0"
    height: "2.75rem"
  skip-link:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
    typography: "{typography.label}"
    padding: "0.75rem 1rem"
---

# Design System: Annoying Winter Pressure Fold

## Overview

**Creative North Star: "The Pressure Chamber"**

Annoying Winter behaves like a low-temperature material test filmed as a silent title sequence. A single black-chrome composite fold occupies the fixed stage while the page moves through Edge, Fold, Stress, Rupture, Anatomy, Release, and Rest. Each chapter changes the same object's silhouette, camera, material response, or structural state, so the full scroll reads as one authored experiment.

The interface is visceral, cinematic, and exact. Deep blue-black space, cold white type, and one sulfur signal color create controlled tension. Sticky copy, hard tonal inversion, pointer pressure, deterministic scroll states, and restrained labels support the object without competing with it. The visual system rejects interchangeable portfolio templates, decorative UI chrome, invented proof, and borrowed MDX identity.

**Key Characteristics:**

- One persistent Pressure Fold object across the entire narrative.
- One dark visual world with a single full-field sulfur impact.
- Condensed display typography capped at 5.75rem with tight, readable spacing.
- Open layouts built from sticky stages, ruled information, and controlled negative space.
- Native WebGL2 as progressive enhancement, backed by a composed static poster.
- Deterministic motion, keyboard-operable modes, reduced-motion cuts, and 320px support.

**The Escalation Rule.** Every fold must reveal a new property, increase tension, or resolve the previous state. A chapter that merely repeats the last composition is prohibited.

**The One Object Rule.** Pressure Fold carries the full experience. Additional spheres, blobs, or unrelated 3D toys are forbidden.

## Colors

The palette uses deep blue-black neutrals, cold white typography, and a sulfur yellow-green signal that appears rarely enough to feel physical.

### Primary

- **Sulfur Stress Signal** (`colors.signal`): Marks the stress seam, selected emphasis, text-link response, focus outline, and the single full-screen Impact reversal.
- **Compressed Signal Ink** (`colors.signal-ink`): Carries text and navigation over the sulfur Impact field.

### Neutral

- **Pressure Black** (`colors.background`): Default page and scene field.
- **Chamber Black** (`colors.background-deep`): Deepest navigation dock, supporting gradients, and legibility shadow.
- **Cold White** (`colors.ink`): Primary headings, active controls, and critical statements.
- **Graphite Copy** (`colors.ink-soft`): Long-form support copy with accessible contrast on the dark field.
- **Instrument Gray** (`colors.ink-faint`): Secondary status, metadata, and inactive controls.
- **Cut Line** (`colors.line`): One-pixel structural rules for specifications, method rows, mobile navigation, and the footer.

**The One Impact Rule.** The sulfur field may dominate one narrative interval only. Everywhere else it remains a seam, state, focus, or short emphasis.

**The Same-Hue Neutral Rule.** Supporting grays remain blue-tinted so they retain density on the dark field. Generic neutral gray is prohibited.

## Typography

**Display Font:** Anek Pressure 800 Condensed with PingFang SC, Microsoft YaHei, and sans-serif fallbacks

**Body Font:** Anek Pressure 400 with PingFang SC, Microsoft YaHei, and sans-serif fallbacks
**Label Font:** Anek Pressure 400

**Character:** A single self-hosted family creates mechanical continuity through width and weight contrast. Condensed uppercase display type acts like a compressed structural plate, while mixed-case body copy carries calm technical explanation in English and Chinese.

### Hierarchy

- **Display** (`typography.display`): Hero, Impact, and Contact statements. Desktop scale stops at 5.75rem, with mobile-specific clamps to protect 320px layouts.
- **Headline** (`typography.headline`): Chapter and anatomy titles. Keep lines short enough to preserve hard silhouette and deliberate breaks.
- **Body** (`typography.body`): Explanatory copy. Maintain a practical maximum of 55 to 65 characters per line and preserve generous leading on dark backgrounds.
- **Label** (`typography.label`): Navigation, material modes, state readouts, and compact metadata. Uppercase is reserved for short instrumentation language.

**The Compression Rule.** Display letter spacing stops at -0.03em. Tighter settings and oversized 96px-plus headlines are prohibited.

**The Unequal Languages Rule.** English and Chinese carry complementary information. Literal line-by-line duplication is prohibited.

## Elevation

The system is flat at the DOM surface. It uses no card shadow vocabulary and no floating glass panels. Depth comes from WebGL lighting, material Fresnel response, layer separation, camera parallax, sticky overlap, a radial contact shadow, and a controlled vignette. The Contact support line alone uses a soft legibility shadow against the animated field.

### Shadow Vocabulary

- **Contact Legibility** (`text-shadow: 0 1px 16px var(--bg-deep)`): Use only when live material can cross behind the final support sentence.
- **Material Contact Field** (layered radial gradients): Anchors Pressure Fold to the chamber and follows the camera target horizontally.

**The Structural Depth Rule.** Geometry, occlusion, light, and camera position create depth. Decorative box shadows and default glass blur are forbidden.

## Components

Components feel cut, open, and instrument-like. Their states rely on color, one-pixel rules, spacing, and clear movement rather than filled cards or rounded containers.

### Navigation

- **Wordmark:** Two-line lockup with an 800-weight name and a faint tracked descriptor. The descriptor disappears below 48rem.
- **Desktop Navigation:** Transparent three-link row centered in the fixed header. A one-pixel underline draws from right to left on hover, focus, and current location.
- **Docked Navigation:** Below 64rem, navigation becomes a bottom dock with a deep field and one top rule. At 30rem and below, links distribute across the available width.
- **Source Link:** Mirrors the navigation state language and remains aligned to the right edge.

### Action Links

- **Shape:** Open text control with a one-pixel bottom rule and a minimum 3rem touch height.
- **Default:** Cold white text with a wide directional gap.
- **Hover / Focus:** The gap expands and the text shifts to the sulfur signal using the standard ease-out curve.
- **Focus:** A two-pixel sulfur outline with a five-pixel offset remains visible on every interactive element.

### Material Modes

- **Style:** Surface, Stress, and Structure are transparent buttons with no container fill.
- **Default:** Instrument gray label and hidden sulfur underline.
- **Selected:** Cold white label with the underline scaled to full width. `aria-pressed` carries the state.
- **Mobile:** The selector spans the viewport below the fixed header with a deep background and one bottom rule.

### Material Specification

- **Structure:** A definition list with two columns, one top rule, and one bottom rule per row.
- **Hierarchy:** Faint uppercase terms pair with compact bold values.
- **Container:** Open on the stage with no card fill, radius, or drop shadow.

### Stage Status

- **Structure:** Fixed three-part instrumentation line with current state, scroll progress, and the Pressure Fold activity label.
- **Behavior:** The center line scales from the left using page progress. The right label hides below 48rem.
- **Impact State:** All status colors invert to compressed signal ink while preserving hierarchy.

### Pressure Fold

- **Geometry:** A procedural, directional folded sheet with layered shells, visible seams, sealed boundary meshes, controlled torsion, compression, pointer pressure, and a shader-driven cross-section cut.
- **Material:** Black metal and translucent resin responses share a sulfur stress line and subtle spectral edge reflection.
- **Narrative States:** Edge, Fold, Stress, Rupture, Anatomy, Release, and Rest are deterministic and reversible through scroll. Anatomy removes the outer span, exposes five rendered cut faces, and hard-cuts to a macro inspection camera.
- **Fallback:** Five clipped static layers reproduce the silhouette when WebGL2 is unavailable or its context is lost.

## Do's and Don'ts

### Do:

- **Do** preserve one persistent Pressure Fold and make every state change readable in silhouette.
- **Do** reserve the sulfur signal for stress, focus, selected states, decisive words, and one full-field Impact interval.
- **Do** keep display type at or below 5.75rem with letter spacing no tighter than -0.03em.
- **Do** use sticky stages, asymmetric placement, open ruled lists, and varied vertical pacing.
- **Do** keep native HTML, CSS, JavaScript, WebGL2, self-hosted fonts, and relative GitHub Pages assets free of third-party runtime dependencies.
- **Do** maintain visible focus, 44px or larger touch targets, semantic landmarks, reduced-motion behavior, static WebGL fallback, and legibility at 320px.
- **Do** label speculative work honestly and keep client, award, testimonial, and performance claims verifiable.

### Don't:

- **Don't** recreate generic AI portfolios built from a large grotesque headline, one particle sphere, orange-on-black, and repeated bordered panels.
- **Don't** use repeated tiny uppercase section kickers, decorative 01/02/03 scaffolding, orbit diagrams, grid-paper backgrounds, or typography used as filler.
- **Don't** ship a dark studio site that relies on glow, blur, or a single WebGL object while the rest of the page becomes static.
- **Don't** invent clients, awards, testimonials, performance claims, or case-study metrics.
- **Don't** fall back to safe editorial restraint, beige or cream themes, SaaS card grammar, stock-template transitions, or any composition that could be reproduced by changing only the logo.
- **Don't** copy MDX layouts, wording, assets, models, brand identity, or HorizonX premium prompt text.
- **Don't** add gradient text, decorative glassmorphism, identical card grids, wide soft card shadows, oversized corner radii, or universal fade-up reveals.
- **Don't** hide essential content behind JavaScript, pointer precision, color alone, or successful WebGL initialization.
