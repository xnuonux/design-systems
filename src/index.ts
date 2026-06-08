#!/usr/bin/env node
/* ============================================================
   Design Systems CLI — Entry Point
   ------------------------------------------------------------
   npx @eternities/design-systems init
   Five questions → complete, tokenized, AI-codeable design system.
   ============================================================ */

import * as p from "@clack/prompts";
import { promptFlow } from "./prompts.js";
import { generateDesignSystem } from "./generate.js";

const USAGE = `
  design-systems — scaffold an AI-codeable design system from 5 questions.

  Usage:
    npx @eternities/design-systems init    Scaffold a new design system
    design-systems --help                  Show this help
    design-systems --version               Show version
`;

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (cmd === "--help" || cmd === "-h") {
    console.log(USAGE);
    return;
  }

  if (cmd === "--version" || cmd === "-v") {
    // Read from package.json
    const pkgPath = new URL("../package.json", import.meta.url);
    try {
      const pkg = JSON.parse(await import("node:fs").then(fs => fs.readFileSync(pkgPath, "utf-8")));
      console.log(pkg.version);
    } catch {
      console.log("0.1.0");
    }
    return;
  }

  if (cmd === "init") {
    const answers = await promptFlow();
    if (!answers) return;

    const s = p.spinner();
    s.start("Generating design system");

    const targetDir = process.cwd();
    await generateDesignSystem(answers, targetDir);

    s.stop("Done!");

    const outDir = `${targetDir}/${answers.projectName}/design-system/`;
    p.outro(`
  ◆ Created 7 files in ${outDir}

  ◆ Next steps:
    1. Link styles.css in your HTML:  <link rel="stylesheet" href="design-system/styles.css">
    2. Point your AI at SKILL.md for on-brand generation.
    3. Customize tokens to your product's needs.

  ◆ Run again:  npx @eternities/design-systems init
    `);
    return;
  }

  // Default: show usage
  console.log(USAGE);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
