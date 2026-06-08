/* ============================================================
   Design Systems CLI — Prompt Flow
   ------------------------------------------------------------
   @clack/prompts for a beautiful ~5 question onboarding.
   Smart defaults — hit Enter on every question = great result.
   ============================================================ */

import * as p from "@clack/prompts";
import { MOOD_CHOICES, type MoodId } from "./moods.js";

export interface UserAnswers {
  projectName: string;
  mood: MoodId;
  description: string;
  pitch: string;
  confirmed: boolean;
}

export async function promptFlow(): Promise<UserAnswers | null> {
  p.intro("Design Systems — scaffold a complete, tokenized, AI-codeable design system");

  const projectName = await p.text({
    message: "What's the project called?",
    placeholder: "my-product",
    defaultValue: "",
    validate(value) {
      if (!value.trim()) return "Project name is required.";
      if (!/^[a-z0-9-_]+$/i.test(value)) return "Use letters, numbers, hyphens, or underscores.";
    },
  });
  if (p.isCancel(projectName)) return null;

  const mood = await p.select({
    message: "Pick a mood for your design system:",
    options: MOOD_CHOICES.map((c) => ({
      value: c.value,
      label: c.label,
      hint: c.hint,
    })),
  }) as string;
  if (p.isCancel(mood)) return null;

  const description = await p.text({
    message: "What does your product do? (one sentence)",
    placeholder: "Turns still images into cinematic video with real VFX.",
    defaultValue: "",
  });
  if (p.isCancel(description)) return null;

  const pitch = await p.text({
    message: "One-line pitch for the README:",
    placeholder: "Stills into video. Real VFX. Camera rig, not prompt box.",
    defaultValue: description as string,
  });
  if (p.isCancel(pitch)) return null;

  const confirmed = await p.confirm({
    message: `Generate design system for "${projectName}"?`,
    initialValue: true,
  });
  if (p.isCancel(confirmed) || !confirmed) {
    p.outro("Cancelled. Run again when you're ready.");
    return null;
  }

  return {
    projectName: projectName as string,
    mood: mood as MoodId,
    description: description as string,
    pitch: pitch as string,
    confirmed: true,
  };
}
