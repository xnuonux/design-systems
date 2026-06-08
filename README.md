# Design Systems CLI

> Five questions. One command. Your complete, tokenized, AI-codeable design system.

```
npx create-design-system init
```

---

## What it does

Scaffolds a complete design system for any project in seconds. Answer ~5 questions about your product's mood, name, and purpose — get 7 files:

```
<project>/design-system/
  styles.css          ← one link, the whole system
  tokens/
    colors.css        ← ground, accent, text, status, semantic aliases
    typography.css    ← families, scale, tracking, text presets
    effects.css       ← glow, shadow, glass, motion
    base.css          ← reset, scrollbar, selection
  README.md           ← source of truth, voice guide, usage
  SKILL.md            ← AI-codeable — any Reasonix/Claude instance can read it
```

Every system is tokenized, documented, and AI-codeable. Every token is a CSS variable. Every voice guide says "no emoji, no hype."

---

## Install

```bash
npx create-design-system init
```

No global install needed. No dependencies outside the command.

---

## The 5 moods

| Mood | Ground | Light | Display Font | Vibe |
|---|---|---|---|---|
| **dark / cosmic** | void `#010309` | gold `#dac497` | Cinzel | Eternities family — night sky, glass, calm |
| **warm / intimate** | charcoal `#0d0c0a` | rose-gold `#d4a574` | Crimson Text | Personal, self-reflective, diary-like |
| **technical / precision** | darkroom `#0a0606` | signal amber `#d4894a` | Cinzel | Camera rig, instrument grade, mono readouts |
| **scholarly / reverent** | codex `#0a0907` | manuscript gold `#c4a24c` | Cinzel | Ancient texts, two registers, blur-rise |
| **minimal / mono** | pure void `#000` | none | EB Garamond | Canvas-first, mono HUD, no accent |

---

## Usage

```bash
# Interactive — answers 5 questions
npx create-design-system init

# Help
npx create-design-system --help

# Version
npx create-design-system --version
```

### Example session

```
◆ Design Systems — scaffold a complete, tokenized, AI-codeable design system

◆ What's the project called?
│  my-product

◆ Pick a mood for your design system:
│  ◼ dark / cosmic — void + gold, Cinzel display, glass surfaces
│  ◻ warm / intimate — charcoal + rose-gold, Crimson Text voice
│  ◻ technical / precision — darkroom + signal amber, mono readouts
│  ◻ scholarly / reverent — codex + manuscript gold, serif voices
│  ◻ minimal / mono — pure void, no accent, canvas-first

◆ What does your product do? (one sentence)
│  Turns still images into cinematic video with real VFX.

◆ One-line pitch for the README:
│  Stills into video. Real VFX. Camera rig, not prompt box.

◆ Generate design system for "my-product"? (Y/n)

◇  Created styles.css
◇  Created tokens/colors.css
◇  Created tokens/typography.css
◇  Created tokens/effects.css
◇  Created tokens/base.css
◇  Created README.md
◇  Created SKILL.md
◇  Done!

◆ Next:
  1. Link styles.css in your HTML
  2. Point your AI at SKILL.md for on-brand generation
  3. Customize tokens to your product's needs
```

---

## After scaffolding

1. **Link it:** `<link rel="stylesheet" href="design-system/styles.css">`
2. **Use tokens:** Every value is `var(--accent)`, `var(--text-body)`, `var(--surface-1)`, etc.
3. **Point AI at SKILL.md:** Any Reasonix or Claude instance can read it and generate on-brand output.
4. **Customize:** The generated system is a starting point. Tune colors, add product-specific tokens, extend presets.

---

## Architecture

```
cli/
  bin/design-systems.js     ← entry point
  src/
    index.ts                 ← arg parsing, routing
    prompts.ts               ← @clack/prompts question flow
    moods.ts                 ← 5 mood presets (colors, type, effects, voice)
    generate.ts              ← Handlebars template compiler + file writer
    colors.ts                ← chroma.js scale generation + helpers
    templates/               ← 7 .hbs template files
      styles.css.hbs
      tokens/colors.css.hbs
      tokens/typography.css.hbs
      tokens/effects.css.hbs
      tokens/base.css.hbs
      README.md.hbs
      SKILL.md.hbs
```

---

## Tech stack

- **@clack/prompts** — beautiful terminal UI, intro/outro, spinners
- **chroma.js** — LCH color interpolation for scale generation
- **Handlebars** — template engine for file scaffolding
- **TypeScript** — strict mode, ES modules

---

## Part of the eternities.ai portfolio

This CLI is the productization of the design system architecture used across all eternities.ai projects (Lunari, Umbrum, Echo, Tableau, Persona, Toolkit, Ship, Expansion Study). The master index lives at `Desktop/design-systems/README.md`.
