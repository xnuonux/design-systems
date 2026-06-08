/* ============================================================
   Design Systems CLI — File Generator
   ------------------------------------------------------------
   Takes a mood preset + user answers, compiles Handlebars
   templates with full context, writes files to the target
   project directory.
   ============================================================ */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import Handlebars from "handlebars";
import * as p from "@clack/prompts";
import { MOODS, type MoodPreset, type MoodId } from "./moods.js";
import { hexToRgb, hexToRgbString } from "./colors.js";
import type { UserAnswers } from "./prompts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// In dev: __dirname = src/ → templates at ./templates/
// In prod: __dirname = dist/ → templates at ../src/templates/
const TEMPLATES_DIR = fs.existsSync(path.resolve(__dirname, "templates"))
  ? path.resolve(__dirname, "templates")
  : path.resolve(__dirname, "..", "src", "templates");

function buildMoodContext(mood: MoodPreset) {
  const hasAccent = mood.accent.hex !== "none";

  return {
    id: mood.id,
    label: mood.label,
    moodDescription: mood.description,
    ground: {
      name: mood.ground.name,
      hex: mood.ground.hex,
      hexRgb: hexToRgbString(mood.ground.hex),
      void: mood.ground.scale[3] ?? mood.ground.scale[mood.ground.scale.length - 1],
      voidDeep: mood.ground.scale[2] ?? mood.ground.scale[Math.max(0, mood.ground.scale.length - 2)],
      voidRaised: mood.ground.scale[1] ?? "",
      surface: mood.ground.scale[0] ?? "",
      description: `Deep ${mood.ground.name} depth — warm, not cold void.`,
    },
    accent: {
      name: mood.accent.name,
      hex: mood.accent.hex,
      rgb: hasAccent ? hexToRgb(mood.accent.hex) : "",
      hexRgb: hasAccent ? hexToRgbString(mood.accent.hex) : "",
      bright: hasAccent ? (mood.accent.scale[0] ?? "") : "",
      hover: hasAccent ? (mood.accent.scale[1] ?? "") : "",
      base: hasAccent ? (mood.accent.scale[2] ?? "") : "",
      press: hasAccent ? (mood.accent.scale[3] ?? "") : "",
      deep: hasAccent ? (mood.accent.scale[4] ?? "") : "",
      description: `Warm, singular. Never competes with itself.`,
    },
    text: {
      name: mood.text.name,
      hex: mood.text.hex,
      hexRgb: hexToRgbString(mood.text.hex),
      strong: mood.text.scale[0] ?? "",
      body: mood.text.scale[1] ?? "",
      muted: mood.text.scale[2] ?? "",
      disabled: mood.text.scale[3] ?? "",
    },
    displayFont: mood.displayFont,
    bodyFont: mood.bodyFont,
    monoFont: mood.monoFont,
    surfaceModel: mood.surfaceModel,
    motion: mood.motion,
    radiusStyle: mood.radiusStyle,
    voiceRules: mood.voiceRules,
    specialEffects: mood.specialEffects,
    derivedFrom: mood.derivedFrom,

    // Boolean helpers for template conditionals
    hasAccent,
    hasSeparateBody: mood.bodyFont !== mood.monoFont,
    hasDisplayFont: true,  // all moods have a display face
    isCinzel: mood.displayFont === "Cinzel",
    isCrimson: mood.displayFont === "Crimson Text",
    isEBGaramond: mood.displayFont === "EB Garamond",
    isIBM: mood.monoFont === "IBM Plex Mono",
    isGlass: mood.surfaceModel === "glass",
    isSolid: mood.surfaceModel === "solid",
    isEmitted: mood.surfaceModel === "emitted",
    isCalmSettle: mood.motion === "calm-settle",
    isBlurRise: mood.motion === "blur-rise",
    isQuickTechnical: mood.motion === "quick-technical",
    isSharp: mood.radiusStyle === "sharp",
    isNearSharp: mood.radiusStyle === "near-sharp",
    isSoft: mood.radiusStyle === "soft",
    hasOrnament: mood.specialEffects.includes("ornament-divider"),
    hasBlurRise: mood.specialEffects.includes("blur-rise-animation"),
    hasAperture: mood.specialEffects.includes("aperture-ring"),

    displayRole: mood.bodyFont !== mood.monoFont
      ? "display headings, brand moments, engraved labels"
      : "titles — used sparingly",
    bodyRole: mood.bodyFont !== mood.monoFont
      ? "clean body, UI, controls"
      : "the entire interface (mono-forward)",
    monoRole: mood.bodyFont !== mood.monoFont
      ? "code, params, data, timestamps"
      : "labels, data, HUD elements",

    surfaceDescription: mood.surfaceModel === "glass"
      ? "Glass panels floating over the ground — semi-transparent fills with backdrop-filter blur, 1px hairlines, soft shadows."
      : mood.surfaceModel === "emitted"
        ? "Solid surfaces with emitted glow — light comes from within, not from cast shadows. Cut edges catch light."
        : "Solid, grounded surfaces — warm fills, soft edges, close shadows. Reading-room intimacy.",

    motionDescription: mood.motion === "calm-settle"
      ? "Calm and settled. 240ms transitions on a soft ease. Hover lifts 1px. Nothing bounces. Respects prefers-reduced-motion."
      : mood.motion === "blur-rise"
        ? "Slow, reverent, blur-led. Text enters from blur to clarity over 2.4s. 420ms base transitions. Nothing bounces."
        : "Quick and technical. 160ms micro-interactions, 320ms panel slides. Built for creative-coding responsiveness.",
  };
}

function compileTemplate(templatePath: string, context: Record<string, unknown>): string {
  const source = fs.readFileSync(templatePath, "utf-8");
  const template = Handlebars.compile(source, { noEscape: true });
  return template(context);
}

const TEMPLATE_MAP: Record<string, string> = {
  "styles.css": "styles.css.hbs",
  "tokens/colors.css": path.join("tokens", "colors.css.hbs"),
  "tokens/typography.css": path.join("tokens", "typography.css.hbs"),
  "tokens/effects.css": path.join("tokens", "effects.css.hbs"),
  "tokens/base.css": path.join("tokens", "base.css.hbs"),
  "README.md": "README.md.hbs",
  "SKILL.md": "SKILL.md.hbs",
};

export async function generateDesignSystem(answers: UserAnswers, targetDir: string): Promise<void> {
  const mood = MOODS[answers.mood];
  if (!mood) throw new Error(`Unknown mood: ${answers.mood}`);

  const moodCtx = buildMoodContext(mood);
  const context = {
    projectName: answers.projectName,
    pitch: answers.pitch,
    description: answers.description,
    // Flatten mood context so templates can use {{ground.name}}, {{accent.hex}}, etc.
    ...moodCtx,
  };

  const designDir = path.join(targetDir, "design-system");
  const s = p.spinner();

  for (const [outPath, templateFile] of Object.entries(TEMPLATE_MAP)) {
    const fullOutPath = path.join(designDir, outPath);
    const fullTemplatePath = path.join(TEMPLATES_DIR, templateFile);

    s.start(`Creating ${outPath}`);

    // Ensure directory exists
    fs.mkdirSync(path.dirname(fullOutPath), { recursive: true });

    // Compile and write
    const content = compileTemplate(fullTemplatePath, context);
    fs.writeFileSync(fullOutPath, content, "utf-8");

    s.stop(`Created ${outPath}`);
  }
}
