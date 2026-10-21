# Workplace Automation and Filipino Workers

MO-SS033 The Contemporary World, Terminal Assessment.
Vanessa Rose A. Salonoy, Section H1103, working individually. Mentor: Ms. Bella Joy Bardolas.

**Version 2.1 draft.** The same label appears in the site's hero and footer. The revision
history lives in the Submission Compliance Pack, not here.

An interactive academic website carrying the full research narrative: the issue, five solutions
evaluated and ranked, the selected solution adapted for the Philippines, SMART indicators,
stakeholders, risks and references.

**This site has not been deployed anywhere.** The build is ready and tested, waiting on
your authorisation.

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

A workflow is already committed at `.github/workflows/deploy.yml`. It is inert until
you push it and switch Pages on, so nothing publishes by accident.

**First time:**

1. Create a repository named `mo-ss033-terminal-assessment` under
   `github.com/vsalonoy`. Public is required for Pages on a free account.
2. Push this project to the `main` branch:
   ```
   git init
   git add .
   git commit -m "MO-SS033 Terminal Assessment website"
   git branch -M main
   git remote add origin https://github.com/vsalonoy/mo-ss033-terminal-assessment.git
   git push -u origin main
   ```
3. In the repository, go to **Settings > Pages** and set **Source** to
   **GitHub Actions**. This is the step that actually turns publishing on.
4. Watch the **Actions** tab. The run installs, builds and publishes. It takes
   two or three minutes. When it finishes, the URL above is live.

**Publishing a change later:** commit and push to `main`. The workflow runs again
and replaces the live site. You can also trigger it by hand from the Actions tab
without pushing anything, using **Run workflow**.

If the build fails, the workflow stops and the live site is left as it was, so a
broken build never replaces a working one.

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
  Charts.tsx             The two charts, loaded on demand so the opening stays light.
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
the particle field draws a single still frame. All text was measured against WCAG AA contrast,
lowest ratio 5.2:1. Every control is keyboard reachable with a visible focus outline. Fonts are
bundled rather than fetched from Google, so the site makes no outbound request.

If you change a colour, re-check contrast before submitting.
