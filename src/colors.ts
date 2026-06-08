/* ============================================================
   Design Systems CLI — Color Engine
   ------------------------------------------------------------
   Uses chroma.js to generate color scales from a single base
   hex. LCH interpolation for perceptual uniformity. Curation
   rules apply designer heuristics to pick the best steps.
   ============================================================ */

import chroma from "chroma-js";

export interface GeneratedScale {
  hex: string;
  rgb: string;
  hexRgb: string;     // hex without #, for rgba() construction
  scale: string[];    // light → dark hex values
}

/**
 * Generate a 5-step scale from a base accent color.
 * Uses LCH interpolation for perceptual uniformity.
 * Light end: higher lightness, lower chroma (hover/bright state).
 * Dark end: lower lightness, maintained chroma (pressed/deep state).
 */
export function generateAccentScale(baseHex: string, steps = 5): string[] {
  const base = chroma(baseHex);
  const [l, c, h] = base.lch();

  const scale: string[] = [];

  // Generate from light → dark
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    // Light end (t=0): +18 lightness, ×0.7 chroma
    // Base (t=0.5): exact base
    // Dark end (t=1): -12 lightness, ×0.9 chroma
    const lightOffset = 18 * (1 - t * 2);  // +18 at t=0, 0 at t=0.5, -18 at t=1 (but we cap)
    const chromaMult = 0.7 + t * 0.25;     // 0.7 at t=0, 0.825 at t=0.5, 0.95 at t=1

    const newL = Math.max(5, Math.min(95, l + lightOffset));
    const newC = Math.max(1, c * chromaMult);

    scale.push(chroma.lch(newL, newC, h).hex());
  }

  // Ensure the middle step IS the base color
  const mid = Math.floor(steps / 2);
  scale[mid] = baseHex;

  return scale;
}

/**
 * Generate a 4-step ground (background) scale from a base ground hex.
 * Grounds are near-black — small lightness increments.
 */
export function generateGroundScale(baseHex: string, steps = 4): string[] {
  const base = chroma(baseHex);
  const [l, c, h] = base.lch();

  const scale: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const newL = Math.min(25, l + t * 10); // surfaces get slightly lighter
    scale.push(chroma.lch(newL, Math.max(0.5, c * (1 - t * 0.6)), h).hex());
  }
  scale.reverse(); // darkest first (void), lightest last (surface)
  return scale;
}

/**
 * Generate a 4-step text scale from a base text hex.
 * Text scales: strong → muted → disabled (decreasing opacity/lightness).
 */
export function generateTextScale(baseHex: string, steps = 4): string[] {
  const base = chroma(baseHex);
  const [l, c, h] = base.lch();

  const scale: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const newL = Math.max(20, l - t * 20); // gets darker/more muted
    const newC = Math.max(0.5, c * (1 - t * 0.7));
    scale.push(chroma.lch(newL, newC, h).hex());
  }
  return scale;
}

/**
 * Convert a hex color to an RGB tuple string for rgba() usage.
 * e.g. "#dac497" → "218, 196, 151"
 */
export function hexToRgb(hex: string): string {
  const [r, g, b] = chroma(hex).rgb();
  return `${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}`;
}

/**
 * Strip # from hex for CSS variable construction.
 * e.g. "#dac497" → "dac497"
 */
export function hexToRgbString(hex: string): string {
  return hex.replace("#", "");
}
