---
name: penscribe-design
description: Use this skill to generate well-branded interfaces and assets for The PenScribe Hub (Isaac PenScribe's government-contracting consultancy), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files. Key entry points:

- `README.md` — full system: company context, voice, visual foundations, iconography
- `colors_and_type.css` — the only file you need to import for tokens (color, type, space, radius, shadow)
- `assets/` — logos, source portfolio PDF
- `preview/` — small atomic specimens of every system element (good reference)
- `ui_kits/marketing_site/` — hi-fi marketing-site components
- `slides/` — oral-presentation deck templates (use `deck-stage.js`)

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out of `assets/` and create static HTML files for the user to view. If working on production code, copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design (capability statement? proposal cover? new section for the marketing site? oral-presentation deck for a specific RFP?), ask a few sharpening questions, and act as an expert designer who outputs HTML artifacts *or* production code, depending on the need.

## Quick voice reminders
- "I" for Isaac's work, "you" for the prospect — never invented corporate "we" unless warranted
- No emoji. Anywhere. Procurement-facing brand.
- Sell the destination (the contract won), not the plane (the proposal)
- Numbers do the boasting; adjectives stay sober
- Banned hype words: revolutionary, cutting-edge, world-class, synergy, leverage (v), game-changer, unlock, supercharge, next-level

## Quick visual reminders
- Brand blue is `#1226E6`. Paper canvas is `#FAFAF7`. Pure white is for cards only.
- Anton for display caps, Spectral for serif headlines/quotes, Manrope for sans body/UI
- Hairlines > shadows. Borders > cards-with-shadows.
- Radius is small: 8px default. Never above 14px.
- No gradients. No emoji. No background photography.
- Restrained motion: 150–240ms, ease-out, no bounce
