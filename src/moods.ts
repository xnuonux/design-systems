/* ============================================================
   Design Systems CLI — Mood Presets
   ------------------------------------------------------------
   Five starting points. Each mood is a complete preset that
   seeds color scales, type families, surface models, motion
   curves, and voice rules. Users pick one; the generator fills
   in project-specific details.
   ============================================================ */

export interface ColorScale {
  name: string;
  hex: string;
  scale: string[];        // light → dark (5–7 steps)
}

export interface MoodPreset {
  id: string;
  label: string;
  description: string;
  ground: ColorScale;
  accent: ColorScale;
  text: ColorScale;
  displayFont: string;
  bodyFont: string;
  monoFont: string;
  surfaceModel: "glass" | "solid" | "emitted";
  motion: "calm-settle" | "blur-rise" | "quick-technical";
  radiusStyle: "soft" | "sharp" | "near-sharp";
  voiceRules: string[];
  specialEffects: string[];
  derivedFrom: string[];
}

export const MOODS: Record<string, MoodPreset> = {
  "dark-cosmic": {
    id: "dark-cosmic",
    label: "dark / cosmic",
    description: "void + gold, Cinzel display, glass surfaces — the Eternities family",
    ground: {
      name: "void",
      hex: "#010309",
      scale: ["#060d1c", "#030711", "#020511", "#010309"],
    },
    accent: {
      name: "gold",
      hex: "#dac497",
      scale: ["#f3e6c8", "#e8d4a8", "#dac497", "#c9ad7a", "#a8895a"],
    },
    text: {
      name: "cream",
      hex: "#f7f3ea",
      scale: ["#f7f3ea", "#ece5d6", "#d8cdb8"],
    },
    displayFont: "Cinzel",
    bodyFont: "Inter",
    monoFont: "JetBrains Mono",
    surfaceModel: "glass",
    motion: "calm-settle",
    radiusStyle: "soft",
    voiceRules: [
      "lowercase, atmospheric, plainspoken",
      "no emoji, no exclamation marks, no marketing superlatives",
      "we build quiet software",
    ],
    specialEffects: ["film-grain", "glass-blur", "atmosphere-layers"],
    derivedFrom: ["Eternities"],
  },

  "warm-intimate": {
    id: "warm-intimate",
    label: "warm / intimate",
    description: "charcoal + rose-gold, Crimson Text voice — personal, self-reflective",
    ground: {
      name: "charcoal",
      hex: "#0d0c0a",
      scale: ["#1a1714", "#141210", "#0d0c0a", "#080706"],
    },
    accent: {
      name: "rose-gold",
      hex: "#d4a574",
      scale: ["#f0d4b8", "#e8c4a0", "#d4a574", "#b88454", "#8a6038"],
    },
    text: {
      name: "ivory",
      hex: "#ede4d8",
      scale: ["#f2ede4", "#ede4d8", "#d4c8b4"],
    },
    displayFont: "Crimson Text",
    bodyFont: "Inter",
    monoFont: "JetBrains Mono",
    surfaceModel: "solid",
    motion: "calm-settle",
    radiusStyle: "soft",
    voiceRules: [
      "intimate, observant, personal — like reading your own diary",
      "address the writer, not the user",
      "observations, not judgments",
      "no emoji, no exclamation marks",
    ],
    specialEffects: ["reading-room-wash", "voice-preview-border", "radar-background"],
    derivedFrom: ["Persona", "Lunari"],
  },

  "technical-precision": {
    id: "technical-precision",
    label: "technical / precision",
    description: "darkroom + signal amber, Cinzel lens labels, mono readouts — instrument grade",
    ground: {
      name: "darkroom",
      hex: "#0a0606",
      scale: ["#1a0e0e", "#0e0808", "#0a0606", "#060404"],
    },
    accent: {
      name: "signal-amber",
      hex: "#d4894a",
      scale: ["#f0c080", "#d4894a", "#b87030", "#8a5020"],
    },
    text: {
      name: "silver",
      hex: "#d4cfc8",
      scale: ["#e8e4dc", "#d4cfc8", "#b8b2a8"],
    },
    displayFont: "Cinzel",
    bodyFont: "Inter",
    monoFont: "JetBrains Mono",
    surfaceModel: "glass",
    motion: "calm-settle",
    radiusStyle: "near-sharp",
    voiceRules: [
      "camera manual by a craft lover — technical but warm",
      "address the operator, not the user",
      "verbs over nouns — dolly in, pull focus, render",
      "no emoji, no exclamation marks",
    ],
    specialEffects: ["aperture-ring", "signal-glow", "darkroom-vignette"],
    derivedFrom: ["Tableau"],
  },

  "scholarly-reverent": {
    id: "scholarly-reverent",
    label: "scholarly / reverent",
    description: "codex + manuscript gold, EB Garamond voices, ornament dividers — ancient texts",
    ground: {
      name: "codex",
      hex: "#0a0907",
      scale: ["#1c1a15", "#0f0e0b", "#0a0907", "#040403"],
    },
    accent: {
      name: "manuscript-gold",
      hex: "#c4a24c",
      scale: ["#e8d8a0", "#d4c480", "#c4a24c", "#a08030", "#7a5c20"],
    },
    text: {
      name: "parchment",
      hex: "#e8ddc4",
      scale: ["#f0ead8", "#e8ddc4", "#d4c8a8"],
    },
    displayFont: "Cinzel",
    bodyFont: "EB Garamond",
    monoFont: "IBM Plex Mono",
    surfaceModel: "emitted",
    motion: "blur-rise",
    radiusStyle: "near-sharp",
    voiceRules: [
      "reverent, scholarly — a library of dead tongues",
      "two registers: the voice (archaic serif) + the archive (terse mono)",
      "address the seeker or scholar",
      "no emoji, no exclamation marks, no 'AI' or 'prompt'",
    ],
    specialEffects: ["ornament-divider", "blur-rise-animation", "library-vignette", "tradition-accents"],
    derivedFrom: ["Echo", "Umbrum"],
  },

  "minimal-mono": {
    id: "minimal-mono",
    label: "minimal / mono",
    description: "pure void, no accent, EB Garamond italic + JetBrains Mono — canvas is the color",
    ground: {
      name: "void",
      hex: "#000000",
      scale: ["#0a0a0c", "#000000"],
    },
    accent: {
      name: "none",
      hex: "none",
      scale: [],
    },
    text: {
      name: "ink",
      hex: "#ebe6dc",
      scale: ["#ebe6dc", "rgba(235,230,220,0.38)"],
    },
    displayFont: "EB Garamond",
    bodyFont: "JetBrains Mono",
    monoFont: "JetBrains Mono",
    surfaceModel: "glass",
    motion: "quick-technical",
    radiusStyle: "sharp",
    voiceRules: [
      "minimal — the canvas speaks, the UI whispers",
      "lowercase HUD, italic attribution",
      "no marketing, no calls to action — this is a lab",
      "no emoji",
    ],
    specialEffects: ["glass-panel", "slide-panel", "custom-controls"],
    derivedFrom: ["Expansion Study"],
  },
};

export type MoodId = keyof typeof MOODS;

export const MOOD_CHOICES = Object.entries(MOODS).map(([id, mood]) => ({
  value: id,
  label: mood.label,
  hint: mood.description,
}));
