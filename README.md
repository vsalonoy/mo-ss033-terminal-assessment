# Workplace Automation and Filipino Workers

MO-SS033 The Contemporary World, Terminal Assessment.
Vanessa Rose A. Salonoy, Section H1103, working individually. Mentor: Ms. Bella Joy Bardolas.

**Version 2.3 draft.** The same label appears in the site's hero and footer, and in
`PROJECT.version` in `src/data/research.ts`. The revision history lives in the Submission
Compliance Pack, not here.

An interactive academic website carrying the full research narrative: the issue, five solutions
evaluated and ranked, the selected solution adapted for the Philippines, SMART indicators,
stakeholders, risks and references.

## Published version against this working copy

The site **is** published, at `https://vsalonoy.github.io/mo-ss033-terminal-assessment/`,
served by the workflow in `.github/workflows/deploy.yml` from the `main` branch.

What is live is **not** what is in this folder. The published build is the earlier v2.1
commit. This working copy is the **v2.3 release candidate**: it adds the seven approved
enhancements and the QA corrections that followed them, and it has not been pushed.

Pushing `main` is what replaces the live site. Until that happens the two differ, and a
mentor opening the public URL sees v2.1.

---

## Running it on your own machine

You need Node.js 20 or newer.

```
npm install        # once
npm run dev        # development server, prints a local address
npm run build      # production build into dist/
npm run preview    # serve the production build locally to check it
```

`npm run build` must finish without errors before you deploy anything.

---

## Deploying it to GitHub Pages

Target: `https://vsalonoy.github.io/mo-ss033-terminal-assessment/`

The repository exists, Pages is switched on, and the workflow at
`.github/workflows/deploy.yml` has already published once. The first-time setup is done.

**Publishing the v2.3 release candidate:**

1. Check what you are about to publish: `git log origin/main..main --oneline` lists the
   commits that are local only, and `git status` should be clean.
2. Build once more locally. `npm run build` must finish without errors.
3. `git push origin main`. The workflow runs on the push.
4. Watch the **Actions** tab. The run installs, builds and publishes, and takes two or
   three minutes. When it finishes, the public URL serves the new version.

You can also trigger the workflow by hand from the Actions tab with **Run workflow**,
without pushing anything, which republishes whatever is already on `main`.

If the build fails the workflow stops before publishing, so the live site is left as it
was and a broken build never replaces a working one.

### Other hosts

`dist/` after a build is the whole site: static, no server, no database. Asset
paths are relative, so it works from a domain root or from a subpath.

It will **not** work by double-clicking `dist/index.html`. The page loads as an ES
module and browsers block that over `file://`, so you get a blank page. It needs to
be served over http, even locally. The quickest way, if you have Node:

```
npx serve dist
```

That prints a local address you can open. `npm run preview` does the same thing after
a build.
Netlify and Vercel need build command `npm run build` and publish directory `dist`.

### Commenting

CAMU requires that anyone from MMDC can comment. A static site has no commenting of its own,
and a public URL does not satisfy that requirement by itself. This needs an arrangement agreed
with Ms. Bella. No public commenting system has been built, and the site collects no personal
information.

---

## How it is put together

```
src/data/research.ts     All research content, citations and the 17 references.
                         Both modes read from this one file. Edit content here.
src/hooks/               Reduced-motion detection, mode state, scroll tracking, keyboard nav.
src/components/
  primitives.tsx         Section shell, scroll reveal, animated counter, citation link, caveat box.
  ParticleField.tsx      Canvas node network in the opening. One still frame under reduced motion.
  Hero.tsx               Cinematic opening and the four headline figures.
  Chrome.tsx             Top bar, section rail, presentation controls, footer.
  SectionsAE.tsx         Sections A to E.
  SectionsFL.tsx         Sections F to L.
  Evidence.tsx           Evidence cards, and the implementation responsibility map in F.
  viz.tsx                The hand-built SVG charts. No charting library.
  Ambient.tsx            Background field, blooms and the scroll progress line.
src/App.tsx              Mode state, and the twelve sections both modes render.
```

### Editing the research

Everything substantive lives in `src/data/research.ts`. To change a figure, a citation or a
reference, edit it there once and it updates everywhere it appears. To add a reference, add an
entry to `REFERENCES` with a new key, then cite it with `<Cite keys={['yourkey']} />`.

**Do not copy research text into a component.** The two modes share this file deliberately, so
that nothing can drift out of step between them.

### The two modes

Explore Mode scrolls through all twelve sections. Presentation Mode shows one at a time with
Prev and Next. Both render the same twelve components from `App.tsx`; only the layout differs.

Keyboard: arrow keys or space to move, `Home` and `End` to jump, `P` to switch modes,
`Esc` to leave Presentation Mode.

### Accessibility

Reduced motion is honoured throughout: entrance animations and counters resolve immediately and
the particle field draws a single still frame. Contrast is computed with alpha compositing over
the actual background rather than eyeballed. Across 859 measured text nodes with every
disclosure open, none falls below its WCAG AA threshold; the lowest is 4.56:1, on the stage
ordinals in section F, and the de-emphasised column in the section D matrix sits at 4.64:1. Every control is keyboard reachable with a visible focus outline, and citations resolve to
their reference entry in both modes. Fonts are bundled rather than fetched from Google, so the
site makes no outbound request.

If you change a colour, re-check contrast before submitting.

---

## If the build or the linter will not start

On Apple Silicon, `npm install` sometimes creates the native binding folders for Rolldown
and Oxlint but leaves them **empty**, so `npm run build` and `npm run lint` both fail with
`Cannot find module '@rolldown/binding-darwin-arm64'` or the Oxlint equivalent. The source
code is fine; only the install is incomplete.

Check it:

```
ls node_modules/@rolldown/binding-darwin-arm64
ls node_modules/@oxlint/binding-darwin-arm64
```

Empty output means this is the problem. Reinstall just those binaries at the versions
`package-lock.json` already pins, without touching `package.json` or the lockfile:

```
npm install --no-save \
  @rolldown/binding-darwin-arm64@1.2.14 \
  @oxlint/binding-darwin-arm64@1.89.0 \
  lightningcss-darwin-arm64@1.33.0
```

Then `npm run build` works again. `--no-save` is what keeps `package.json` and
`package-lock.json` unchanged; confirm with `git status` afterwards. If the versions have
moved on, read them out of the lockfile rather than guessing.
