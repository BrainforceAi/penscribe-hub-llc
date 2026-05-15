# PenScribe Design System

The visual + verbal identity for **The PenScribe Hub** — Isaac Adetoyese's government-contracting consultancy. This system gives design agents everything they need to produce on-brand artifacts: capability statements, proposal covers, contract portfolios, oral-presentation decks, the client-facing marketing site, and any future product surfaces.

> The brand promise, in Isaac's own words: *"We sell the destination to clients, not the plane."*
> The audience filter: *"Top standard. We only work with people who are ready."*

---

## 1. Company Context

**The PenScribe Hub** (operating name of the practice run by **Isaac PenScribe / Isaac Adetoyese**) is a boutique government-contracting consultancy. The single offering is **winning federal, state, and municipal contracts** for small and mid-size service businesses that have never sold to government before.

| | |
|---|---|
| Practice lead | Isaac Adetoyese — *Proposal Strategist & GovCon Consultant* |
| Certifications | CPCM, FAC-C, Top Rated on Upwork |
| Headline metric | **90% proposal win rate** |
| Agencies served | Federal (DoD, USAF), State, Municipal |
| Deliverable scope | RFP analysis → strategy → proposal volumes → submission → debrief |
| Adjacent services | SAM.gov registration, UEI/CAGE/DUNS, SBA certifications (8(a), HUBZone, WOSB, EDWOSB, SDVOSB, VOSB), capability statements, sources-sought responses |

### Surfaces this design system supports
1. **Awarded-contracts portfolio PDF** — the existing flagship artifact (8-page document, 4 contract case studies, sample on file at `assets/source/penscribe-portfolio-source.pdf`).
2. **Marketing site** — the public-facing site that converts visitors into discovery calls. (No code exists yet; UI kit recreates the intended look using brand DNA from the portfolio + logo.)
3. **Oral-presentation slide deck** — used by clients in final-stage interviews after a written proposal.
4. **Capability statement / one-pagers** — single-page handouts left with contracting officers.

---

## 2. Source Material

These are the only assets we received. Everything in this system was derived from them.

| File | Type | Notes |
|---|---|---|
| `assets/source/penscribe-portfolio-source.pdf` | PDF, 8 pages | The "Awarded Contracts Portfolio" — primary source of visual + verbal DNA. |
| `assets/penscribe-logo-on-blue.jpg` | Image | Logo, white quill on blue (#1226E6). |
| `assets/penscribe-logo-on-white.jpg` | Image | Logo, blue quill on white. |

**No codebase, Figma, or production UI was provided.** Where this system specifies UI components (marketing site, slide template), they are extrapolated from the brand DNA in the portfolio PDF and the logo — not recreated from an existing build. They should be treated as a *first interpretation* and refined with the user.

---

## 3. Index of Files

```
/
├── README.md                   ← you are here
├── SKILL.md                    ← Claude Code / Agent-Skill entry point
├── colors_and_type.css         ← all design tokens (color, type, space, radius, shadow)
│
├── assets/
│   ├── penscribe-logo-on-blue.jpg
│   ├── penscribe-logo-on-white.jpg
│   ├── penscribe-logo-mark.svg     ← redrawn vector mark
│   ├── penscribe-wordmark.svg      ← wordmark only
│   └── source/
│       └── penscribe-portfolio-source.pdf
│
├── fonts/                      ← (substitutes pulled from Google Fonts; see Type section)
│
├── preview/                    ← Design-System tab cards
│   ├── card-logo.html
│   ├── card-colors-brand.html
│   ├── card-colors-neutral.html
│   ├── card-colors-semantic.html
│   ├── card-type-scale.html
│   ├── card-type-display.html
│   ├── card-type-serif.html
│   ├── card-type-sans.html
│   ├── card-spacing.html
│   ├── card-radius.html
│   ├── card-shadow.html
│   ├── card-buttons.html
│   ├── card-badges.html
│   ├── card-form.html
│   ├── card-contract-card.html
│   ├── card-quote.html
│   ├── card-stat.html
│   └── card-iconography.html
│
├── ui_kits/
│   └── marketing_site/         ← public marketing site
│       ├── README.md
│       ├── index.html
│       ├── Nav.jsx
│       ├── Hero.jsx
│       ├── StatStrip.jsx
│       ├── ProcessSteps.jsx
│       ├── ContractsList.jsx
│       ├── ServicesGrid.jsx
│       ├── Testimonial.jsx
│       ├── CTASection.jsx
│       └── Footer.jsx
│
└── slides/                     ← oral-presentation deck templates
    ├── index.html              ← deck shell
    ├── TitleSlide.html
    ├── StatSlide.html
    ├── ProcessSlide.html
    ├── ContractCaseSlide.html
    ├── QuoteSlide.html
    └── ClosingSlide.html
```

---

## 4. Content Fundamentals

This is how PenScribe sounds. Match this voice in **every** generated artifact.

### Voice in one sentence
**Authoritative, instructional, plainspoken. A senior consultant briefing a client — never a vendor selling.**

### Casing & punctuation
- Sentence case for paragraphs and most headings.
- **Title Case** only for proper section labels: "Contract Awarded", "Scope of Work", "My Contribution", "Outcome".
- **UPPERCASE** is reserved for the wordmark and section dividers ("AWARDED CONTRACTS"). Use sparingly — it has weight precisely because it's rare.
- No exclamation points. No em-dash flourishes for drama (use a period). Oxford comma on.
- Numbers: spell out under ten in narrative copy, use numerals for figures, dollar amounts, percentages, dates, contract values. Always pair dollar amounts with a frame: *"$138,540 annual estimated"*, never bare.

### Pronouns
- **"I"** when referring to Isaac's work on a specific engagement (*"I managed the full proposal lifecycle..."*).
- **"You"** when addressing the prospect (*"You never waste money bidding on contracts you cannot win."*).
- **"We"** is acceptable on the marketing site when speaking as the practice, but Isaac's voice ("I") is the default and feels more credible.
- Do not invent corporate plural where it isn't warranted.

### Tone & vibe
- **Educative.** Explain *why*, not just *what*. (*"This is where the proposal is won before a single word is written."*)
- **Confident, not boastful.** Numbers do the boasting (90%, $124,800, four bases). Adjectives stay sober.
- **No hype words.** Banned: "revolutionary", "cutting-edge", "world-class", "synergy", "leverage" (as verb), "game-changer", "unlock", "supercharge", "next-level".
- **No emoji. Anywhere.** This is a serious procurement-facing brand. Emoji break trust with the contracting-officer audience.
- **Sell the destination.** Lead with the outcome (contract won, $X awarded, agency relationship secured), not the process artifact (a "great proposal"). The proposal is the plane; the contract is the destination.
- **Filter the audience.** Some copy should actively repel the wrong client: *"I only work with businesses ready to compete."*

### Concrete examples (lifted from the portfolio — use these as voice anchors)

> **Step 01 — Opportunity Analysis.** I review the full solicitation, evaluate fit against your capabilities, identify evaluation criteria and scoring weights, flag compliance risks, and give you a clear go or no-go recommendation before any writing begins. You never waste money bidding on contracts you cannot win.

> **Strategy & Research.** This is where the proposal is won before a single word is written.

> Tebebi LLC was awarded this contract to serve Shaw Air Force Base as the sole laundry and dry cleaning provider for the 23d Force Support Squadron. The proposal was accepted in full with no exceptions or requested clarifications.

> 3XG Enterprises LLC received the highest technical rating among all competing vendors at the written proposal stage.

Notice: short declarative sentences, named clients, named agencies, named outcomes. Specificity is the entire style.

### Microcopy patterns

| Slot | Pattern | Example |
|---|---|---|
| CTA primary | Verb + object, no fluff | "Book a consultation", "Request a debrief", "Send your RFP" |
| CTA secondary | Soft, informational | "See the contracts I have won", "Read the process" |
| Section eyebrow | 1–3 words, uppercase, brand blue | "AWARDED CONTRACTS", "HOW I WORK", "WHAT CLIENTS SAY" |
| Empty state | One sentence, declarative | "No contracts in this category yet." |
| Numbers in display | Bare numeral + caption | **90%** / Proposal win rate |
| Testimonial attribution | Name • Title, Company • Location | *Broderick Thomas — CEO, 3XG Enterprises LLC — Richmond, VA* |

---

## 5. Visual Foundations

### Color
A two-color identity. The blue is non-negotiable; the off-white paper is what makes it look like documentation rather than a tech startup.

- **PenScribe Blue `#1226E6`** — the logo blue. The brand owns it. Use it for: the mark, primary CTAs, links, the eyebrow label, key numbers, brand-bar fills. Should appear on every artifact, but never dominate — typically 10–20% of the ink budget on a page.
- **Paper `#FAFAF7`** — the canvas. Slightly warm off-white. Not pure white. This is what gives every document a printed-page feel.
- **Ink `#0B0E1A`** — body text. Near-black with the faintest blue undertone so it sits with the brand.
- **Slate `#5A6075`** — secondary copy, captions, dates, metadata.
- **Line `#E3E5EE`** — hairline dividers. Pervasive. The system uses thin rules instead of cards-with-shadows for most groupings.

Semantic green `#1F8A5B` exists *only* for the "Contract Awarded" badge — the single biggest signal in the entire portfolio. Don't expand its use to general success states; doing so dilutes the badge.

### Typography
Three families, hierarchical:

1. **Anton** (display, condensed bold caps) — matches the wordmark on the logo. Used for: numbers in stat blocks, the largest hero headlines, slide titles, the `THE PENSCRIBE` wordmark itself. Always uppercase. ⚠ Substituted from Google Fonts; we do not have the exact source file.
2. **Spectral** (editorial serif) — for headlines, pull quotes, long-form prose, contract narratives. Gives the system its educative, document-like authority.
3. **Manrope** (geometric sans) — UI, body, labels, tables, fine print. Where things need to be clearly read at small sizes.

See `colors_and_type.css` for the full scale.

### Spacing & layout
- 4-pt baseline. The canonical scale is `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`.
- Generous margins on long-form artifacts (portfolio PDF, deck slides). The brand looks confident because it is **not afraid of whitespace**.
- A 12-column grid for marketing pages with a max content width of `1180px`. Section vertical padding `96–128px`.
- Slide deck: fixed `1920×1080`, content area inset `96px`.

### Backgrounds & surfaces
- **Almost always paper (`#FAFAF7`).** This is the default canvas.
- One full-bleed brand-blue section per long page or deck — used as a punctuation mark (the testimonial slab, the closing CTA). Never two in a row; never gradient.
- **No imagery is used as background.** The portfolio is text + lines + the occasional badge. We hold that line: no stock photography, no big hero photos. If we ever introduce imagery, it is product (an actual proposal page, a contract excerpt), not lifestyle.
- **No gradients.** Flat fills only. Gradients read as tech-startup, which is the wrong association.
- **No textures, patterns, or hand-drawn illustration.** Stay clean.

### Borders, shadows, corners
- **Corner radius**: small. The system uses `8px` for cards/buttons, `4px` for inputs and chips, `2px` for badges, `999px` (pill) only for filter chips. Anything larger than `14px` is off-brand — we are documents, not consumer apps.
- **Shadows**: minimal. Two elevations only — a `1px` hairline shadow for raised cards (`--sh-1`) and a slightly larger one for floating elements (`--sh-2`). The brand prefers **rules and borders** over shadows for grouping.
- **Borders**: 1px hairlines (`--border-1`, `#E3E5EE`) are the workhorse. Tables, cards, sections — all separated by hairlines, not floating drop shadows.

### Motion
- **Restrained.** This is a procurement-facing brand. We move because something needs to draw attention, not for delight.
- Easing: `cubic-bezier(0.2, 0.6, 0.2, 1)` — a slight ease-out, no bounce, no overshoot.
- Durations: `150ms` for state changes (hover/press), `240ms` for entrances, `320ms` for section transitions. No animation should run longer than `400ms`.
- Page entrances: a `12px` rise + opacity fade. Never slide, never scale, never rotate.
- **No bounce. No spring. No parallax.**

### Hover & press states
- **Hover** on primary buttons: darken brand to `--ps-blue-600` (`#0F1FCC`). No translate.
- **Hover** on secondary links: underline appears with a 1px offset, brand color.
- **Hover** on cards: hairline darkens from `--border-1` to `--border-strong`. No lift, no shadow shift.
- **Press**: 2% scale-down on buttons (`transform: scale(0.985)`), not the whole element. Background drops one step (`--ps-blue-700`).
- **Focus**: 2px outer ring in `--ps-blue-300` at 2px offset. Always visible — government-facing means accessibility-conscious.

### Transparency & blur
- Used sparingly: a `12%` brand-blue overlay on the testimonial slab background image (when one exists). A `60%` ink overlay on dark-mode hero variants. **No frosted-glass / backdrop-filter blur** — that reads as iOS, wrong association.

### Card pattern
- White (`#FFFFFF`) on the paper canvas.
- Hairline border `1px solid --border-1`.
- Radius `8px`.
- Inner padding `24px` (`--s-5`) minimum, `32px` (`--s-6`) on long-form cards.
- Shadow: `--sh-1` (essentially flat) or none. Reserve `--sh-2` for floating overlays.
- Contracts/case-study cards always include a colored eyebrow ("Contract 01") and a green "Contract Awarded" badge at the bottom right.

### Vibe summary
**Quiet authority.** Heavy on whitespace, hairlines, and the occasional saturated blue accent. Reads more like a Treasury document than a SaaS marketing site. That is intentional — the audience is a contracting officer or a small-business owner who is about to write Isaac a five-figure check, and they need to see seriousness before they see polish.

---

## 6. Iconography

**This brand uses iconography sparingly.** The portfolio PDF has effectively zero icons — it relies on type hierarchy and rule lines. We hold that constraint where we can.

### Where icons are allowed
- Tiny inline glyphs in the marketing nav and footer (LinkedIn, Upwork, email).
- Service-list bullets on the "Services I Offer" section (one small icon per service line).
- Step numbers in the process section — but prefer the **numerals themselves** ("01", "02") set in Anton over an icon.

### Icon system
- **Library:** [Lucide](https://lucide.dev) — 1.5px stroke, square caps, geometric. Loaded from CDN via `lucide@latest`. This matches the brand's restraint: outlined, not filled, no color.
- **Color:** always `currentColor`. Default to `--fg-2` (graphite); become `--ps-brand` only on hover or to signal an interactive affordance.
- **Size:** `16 / 20 / 24 px` — these three only. `16` for inline-with-text, `20` for nav, `24` for service-list bullets.
- **Stroke weight:** keep Lucide's default (`1.5`). Do not thicken.

> ⚠ **Substitution flag:** No icon set was provided. Lucide is a sensible default for this aesthetic (thin, restrained, professional). If the brand later commits to a custom or paid icon set, swap it here.

### Emoji
**Never.** Even in casual contexts. The brand is procurement-facing.

### Unicode characters as glyphs
Allowed sparingly: the en-dash `–`, em-dash `—`, bullet `•`, section sign `§` where contextually appropriate. The arrow `→` is used in CTAs (`Book a consultation →`).

### Logos & marks
- `assets/penscribe-logo-on-white.jpg` — the wordmark + quill, blue on white. Default mark.
- `assets/penscribe-logo-on-blue.jpg` — the inverse, white on brand blue. Used on the brand-blue slabs.
- `assets/penscribe-logo-mark.svg` — vector quill-only mark for favicons, social avatars, and tight spaces.
- `assets/penscribe-wordmark.svg` — vector wordmark only, for the nav and footer.

The **quill-and-line mark** is the entire identity. Do not redraw or restyle it. Minimum size: `28px` for the mark alone, `120px` wide for the lockup with wordmark.

---

## 7. Caveats & Open Items

These are flagged for the user to review:

1. **Font files** were not provided. Anton, Spectral, and Manrope are Google Fonts substitutions chosen to match the visual character of the wordmark and the editorial feel of the portfolio. If there is a specific licensed font in use, please share the files and we will swap them in.
2. **Icon set** — Lucide is a substitution; flag if a different set is preferred.
3. **No codebase or Figma** was supplied, so the marketing-site UI kit and slide deck are an *interpretation* of the brand DNA, not a recreation of an existing design. They are a starting point for iteration.
4. **The brand-blue exact value** (`#1226E6`) was sampled from the logo JPEG; if there is an official Pantone or hex on file, please share so we can lock it.
