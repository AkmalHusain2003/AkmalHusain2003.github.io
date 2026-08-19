# Portfolio — Muhammad Akmal Husain

Personal portfolio built with **pure HTML, CSS, and JavaScript** (no framework, no build process, no Jekyll). The layout design philosophy is adapted from the [Forty](https://github.com/andrewbanchich/forty-jekyll-theme) theme by Andrew Banchich, but the entire implementation has been rewritten from scratch using modern Web APIs (`IntersectionObserver`, native CSS custom properties) — no jQuery or Sass build dependency.

## Project Structure

```
portfolio/
├── index.html                  Main page (single-page: Hero, About, Projects,
│                                Experience, Volunteering, Publications,
│                                Activities, Awards, Contact)
├── pages/
│   └── project.html            GENERIC template for a single project's detail
│                                page. Content is rendered dynamically based on
│                                the ?id=<project-name> URL parameter, rather
│                                than a separate file per project.
├── assets/
│   ├── css/
│   │   └── main.css            All site styling, organized by section
│   │                            (see the numbered comments within it)
│   └── js/
│       ├── projects-data.js    SINGLE SOURCE OF TRUTH for all project data
│       ├── main.js             index.html logic: menu, scroll, reveal, grid render
│       └── project-page.js     pages/project.html logic: renders detail from data
└── README.md                   This file
```

## Running Locally

Because `project-page.js` reads URL parameters and loads data via `<script>` tags (not `fetch` against a separate file), this site **cannot** be opened directly by double-clicking `index.html` in some browsers due to `file://` protocol restrictions. Run a simple local server from the root folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html` in a browser.

## Project Data Architecture (Important for Editing)

All project information — title, description, tech stack, repo link, full content — is stored **once** in `assets/js/projects-data.js`, in the `PROJECTS` array. Both the homepage preview cards and the detail page (`pages/project.html?id=...`) read from this same array.

**To edit an existing project:** find the object with the matching `id` in `projects-data.js`, change the fields you need. The change automatically appears in both places (preview and detail).

**To add a new project:** duplicate one of the existing objects within the `PROJECTS` array, change all of its fields (especially `id` — must be unique and contain no spaces, as it's used as a URL parameter), and save the file. The new card automatically appears in the homepage grid without needing to touch `index.html` or `pages/project.html`.

Important fields per project:

| Field | Description |
|---|---|
| `id` | Unique, used in the URL (`?id=...`). No spaces. |
| `featured` | `true` makes the card span 2 grid columns (used for ENTRAP & GUMM). Purely a visual/width decision — see `tier` below for grouping. |
| `tier` | `'main'` or `'other'` — determines which grid (Main Projects / Other Projects) the card renders into. Independent of `featured`; see the architecture note at the top of `projects-data.js` for the full explanation. |
| `category` | Must be one of: `research`, `ml-tools`, `deep-learning` — this value is matched exactly against the filter buttons in `index.html`. Adding a new category also means adding a `<button data-filter="new-category">` in `index.html`. |
| `repoUrl` | Leave as `null` if the project is proprietary/closed-source — the "View Repository" button is automatically hidden and replaced with a "Proprietary Code" label. |
| `content` | An HTML string (not Markdown) for the detail page content. Tags like `<h2>`, `<p>`, `<ul>`, `<code>`, etc. are allowed. |
| `figures` | Array of captions for result plots/images. **See the "Replacing Image Placeholders" section below.** |

## Areas Still Left as Placeholders (Need Manual Input)

The following areas are intentionally left as explicit placeholders because I don't have the actual data or assets:

1. **Profile photo** — in the About section (`index.html`, search for the `about__visual` comment), currently shows a box reading "Profile Photo (Replace with Actual Photo)". Replace `<div class="project-card__media-placeholder">...</div>` with `<img src="assets/images/profile-photo.jpg" alt="Muhammad Akmal Husain" />`.

2. **Result plots / project figures** — in `pages/project.html`, each figure currently shows a gray placeholder box instead of an actual image (see the `renderBody` function in `project-page.js`, specifically the `figure-item` section). To replace:
   - Place the image file in `assets/images/projects/` (folder already exists)
   - In `project-page.js`, find the block:
     ```js
     <div class="project-card__media-placeholder" style="aspect-ratio: 16/10;">
       Figure Placeholder — Replace with Actual Image
     </div>
     ```
     Replace it with:
     ```js
     <img src="../assets/images/projects/${fig.filename}" alt="${escapeHtml(fig.caption)}" />
     ```
     then add a `filename` field to the corresponding object in the `figures` array in `projects-data.js`.

3. **Awards** — this section (`index.html`, id `#awards`) contains three placeholder cards with an explicit `⚠️` marker stating these are examples, not real data. This was intentionally left unfilled rather than fabricated, since I don't have your specific achievement records. Replace `[Year]`, `[Award / Achievement Name]`, and `[Short description...]` on each `<div class="award-card">` with your actual data, then remove the warning line in `section__subtitle`.

## Contact Form

The form in the Contact section is currently **not connected to any email delivery service** — submitting it only shows an alert. To activate it, the easiest option is [Formspree](https://formspree.io) (free for basic use, the same service the original Forty theme used) or [Web3Forms](https://web3forms.com). After signing up and getting an endpoint, change the attributes on the `<form>` tag in `index.html`:

```html
<form class="contact-form" action="https://formspree.io/f/xxxxxxx" method="POST">
```

and remove the `onsubmit="event.preventDefault(); alert(...)"` attribute that currently blocks form submission.

## Color Palette & Typography

All design values (colors, font sizes, spacing, animation durations) are centralized as CSS custom properties in `:root` near the top of `assets/css/main.css`. Changing the site's global visual character only requires changing values there — no need to hunt for hardcoded values elsewhere.

- **Body**: Source Sans 3 (Google Fonts)
- **Monospace/data**: JetBrains Mono (Google Fonts) — chosen because it's genuinely used in a computational science work environment, not purely for aesthetics.

## "Fade In/Out" Animation Mechanism

The repeating fade-in/fade-out effect on sections (not a one-time animation) is implemented via `IntersectionObserver` in `main.js` (the `initRevealObserver` function). Elements with the `.reveal` class gain the `.is-visible` class every time they enter the viewport AND lose that class every time they leave the viewport — so the animation repeats every time you scroll past it, whether scrolling down or up. Full details of the mechanism are documented as comments directly above that function.

## Browser Compatibility

This site uses `IntersectionObserver`, CSS custom properties, `clamp()`, and `aspect-ratio` — all standard features across modern browsers (Chrome, Firefox, Safari, Edge 2020 and later). No polyfills are included for older browsers (Internet Explorer is not supported).
