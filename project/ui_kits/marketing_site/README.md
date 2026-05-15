# Marketing site — UI kit

A hi-fi React (Babel JSX in-browser) recreation of the public marketing site for **The PenScribe Hub**. The site converts visitors into discovery calls. Built directly on the visual DNA from the awarded-contracts portfolio PDF: paper canvas, brand-blue accents, hairlines, restrained motion.

## Components

| File | What it is |
|---|---|
| `Nav.jsx` | Top nav with wordmark + sticky scroll behavior + primary CTA |
| `Hero.jsx` | Above-the-fold: eyebrow, headline, lead, dual CTA, credentials row |
| `StatStrip.jsx` | The 90% / contracts / agencies bar |
| `Process.jsx` | Four-step "How I Work" with big numerals |
| `Contracts.jsx` | List of contract case-study cards with the "Contract Awarded" badge |
| `Services.jsx` | Two-column services list with thin Lucide icons |
| `Testimonial.jsx` | Brand-blue slab with quote + attribution |
| `CTA.jsx` | Closing call-to-action band |
| `Footer.jsx` | Slim footer: contact, social, certifications |
| `App.jsx` | Composes them all in order |
| `index.html` | Mounts `<App/>` |

Click-through: the nav links scroll-anchor, the primary CTAs open a placeholder "Book a consultation" modal, the contract cards expand inline. No real backend.

## Where this came from
The visual is extrapolated from `assets/source/penscribe-portfolio-source.pdf` and the wordmark. **No production marketing site code was provided** — treat this UI kit as a first interpretation and refine against feedback.
