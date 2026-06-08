# Publishing to npm & GitHub

This folder IS the repo. Drag it into GitHub Desktop or run `git init` + push.

---

## Step 1: GitHub repo

```bash
cd design-systems-cli
git init
git add .
git commit -m "Initial commit: Design Systems CLI v0.1.0"
git branch -M main
git remote add origin https://github.com/eternities-ai/design-systems.git
git push -u origin main
```

The `.gitignore` already excludes `node_modules/`, `dist/`, and temp files.

---

## Step 2: npm login

```bash
npm login
```

If you haven't created the `@eternities` org on npm yet:

```bash
# Create the org (free for public packages)
npm org create eternities

# Or skip the scope and rename in package.json:
# "name": "create-design-system"
```

---

## Step 3: Publish

```bash
npm publish --access public
```

What happens:
1. `prepublishOnly` runs → `tsc` builds `dist/` from `src/`
2. `files` in package.json selects: `bin/`, `dist/`, `src/templates/` (+ package.json, README)
3. 30 files are packed into a tarball (18.7 kB)
4. Uploaded to npm under `@eternities/design-systems`

---

## Step 4: Verify

```bash
npx @eternities/design-systems init
```

First run downloads the package. Subsequent runs use the cached version.

---

## After publishing

Anyone can scaffold a design system in seconds:

```bash
npx @eternities/design-systems init
```

No install. No config. Five questions → seven files.

---

## Updating

```bash
npm version patch   # 0.1.0 → 0.1.1
npm publish
```

Or `minor` (0.1.0 → 0.2.0) for new moods/features, `major` (0.1.0 → 1.0.0) for breaking changes.

---

## Package contents (what gets published)

```
eternities-design-systems-0.1.0.tgz (18.7 kB)
  bin/design-systems.js              ← entry point
  dist/                              ← compiled TypeScript (14 files)
    index.js, prompts.js, moods.js,
    generate.js, colors.js + .d.ts + .map
  src/templates/                     ← 7 Handlebars templates
    styles.css.hbs
    tokens/colors.css.hbs
    tokens/typography.css.hbs
    tokens/effects.css.hbs
    tokens/base.css.hbs
    README.md.hbs
    SKILL.md.hbs
  package.json
  README.md
```

Source TypeScript (src/*.ts excluding templates) stays in git only — not shipped to npm.
