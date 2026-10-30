# Blog Post Creation Guide for AI Agents

This document provides instructions for AI agents to create, edit, and manage blog posts on this site.

---

## Writing Style Rules

Follow these rules strictly in all post content:

- **DO NOT** use any emoji characters anywhere in the post content, titles, excerpts, or metadata.
- **DO NOT** use em dash (-). Use a regular dash (-) or comma (,) instead.
- **DO NOT** use en dash. Use a regular dash (-) instead.
- **DO NOT** use curly/smart quotes. Use straight quotes (' and ") only.
- **DO NOT** use ellipsis character. Use three periods (...) if needed.
- Use **justify-aligned text** throughout. The CSS handles this globally, no inline styles needed.
- All **headings** (h1-h6) must be **left-aligned**. The CSS handles this globally.
- Write in a professional, technical tone. First person is acceptable.
- Prefer active voice. Keep sentences clear and direct.

---

## Project Structure

```
static/
  posts/
    index.json                              # Registry of all post slugs
    designing-resilient-distributed-caches.json  # Individual post file
    ...
  images/
    thumb-<slug-suffix>.jpg                 # Square thumbnail (1:1) for post cards
    cover-<slug-suffix>.jpg                 # Wide cover photo (16:9) for post page
    profile.jpg                             # Author profile photo
```

---

## Step-by-Step: Creating a New Post

### Step 1: Choose a Slug

The slug is the URL-friendly identifier for the post. It must be:
- All lowercase
- Words separated by dashes (-)
- Descriptive of the post topic
- Example: `understanding-database-indexing-strategies`

### Step 2: Create the Post JSON File

Create a new file at `static/posts/<slug>.json` with this exact structure:

```json
{
  "slug": "<slug>",
  "title": "<Post Title>",
  "author": "Niaz Bin Siraj",
  "date": "YYYY-MM-DD",
  "category": "<Category Name>",
  "tags": ["tag-one", "tag-two", "tag-three"],
  "excerpt": "<A 1-2 sentence summary of the post. This appears on the post card and as the subtitle on the post page.>",
  "readingTimeMinutes": <number>,
  "language": "en",
  "status": "published",
  "thumbnail": "static/images/thumb-<slug-suffix>.jpg",
  "coverPhoto": "static/images/cover-<slug-suffix>.jpg",
  "photos": [],
  "contents": "<HTML content as a single-line escaped string>"
}
```

#### Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | Yes | URL-friendly identifier, must match filename |
| `title` | string | Yes | Full post title, no emoji |
| `author` | string | Yes | Always `"Niaz Bin Siraj"` |
| `date` | string | Yes | ISO date format `YYYY-MM-DD` |
| `category` | string | Yes | One of: `System Design`, `DevOps`, `Backend`, `Database`, `AI/ML`, or a new relevant category |
| `tags` | array | Yes | 3-8 lowercase kebab-case tags |
| `excerpt` | string | Yes | 1-2 sentence summary. No HTML. No emoji. No em dash. |
| `readingTimeMinutes` | number | Yes | Estimated reading time in minutes (roughly 200 words per minute) |
| `language` | string | Yes | `"en"` for English, `"bn"` for Bengali |
| `status` | string | Yes | `"published"` or `"draft"` |
| `thumbnail` | string | Yes | Path to square (1:1) image for post cards |
| `coverPhoto` | string | Yes | Path to wide (16:9) image for post page banner |
| `photos` | array | No | Array of additional photo URLs used in the content body |
| `contents` | string | Yes | Full post body as a single-line HTML string |

### Step 3: Generate Post Images

Every post requires **two images**:

#### Thumbnail Image (Square, for Post Cards)

- **Aspect ratio:** 1:1 (square)
- **Purpose:** Displayed on post list cards on the homepage and search results
- **File name:** `static/images/thumb-<slug-suffix>.jpg`
- **Style:** Minimalist, modern flat tech illustration. Dark background. Topic-relevant visual metaphor. No text in the image.
- **Slug suffix:** Use a short, descriptive suffix derived from the slug. For example, for `designing-resilient-distributed-caches`, use `distributed-caches`.

#### Cover Photo (Wide, for Post Page)

- **Aspect ratio:** 16:9 (wide rectangular)
- **Purpose:** Displayed as the hero banner at the top of the full post page
- **File name:** `static/images/cover-<slug-suffix>.jpg`
- **Style:** Same theme and color palette as the thumbnail but in wide panoramic format. No text in the image.

#### Image Generation Guidelines

When using the `generate_image` tool:
- Generate the thumbnail first with `AspectRatio: "1:1"`
- Generate the cover photo with `AspectRatio: "16:9"`, passing the thumbnail as a reference image to maintain visual consistency
- Use dark, rich color palettes (dark teal, navy, purple, slate)
- Use abstract/geometric representations of technical concepts
- Never include text, labels, or watermarks in the image
- Copy generated images from the artifacts directory to `static/images/`

### Step 4: Write the HTML Content

The `contents` field is a **single-line string** of HTML. All newlines within code blocks must be escaped as `\\n`.

#### Supported HTML Elements

| Element | Usage |
|---------|-------|
| `<p>` | Body paragraphs |
| `<h2>` | Major section headings |
| `<h3>` | Subsection headings |
| `<strong>` | Bold emphasis |
| `<em>` | Italic emphasis |
| `<code>` | Inline code |
| `<pre><code>` | Code blocks (syntax highlighted automatically via Highlight.js) |
| `<ul>`, `<ol>`, `<li>` | Lists |
| `<blockquote><p>` | Block quotes |
| `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` | Data tables |
| `<hr>` | Horizontal rule (use after the opening paragraph) |
| `<a href="...">` | Links |
| `<img src="..." alt="...">` | Inline images (rare, use only if needed) |

#### Rich Visual Elements

Posts must **not** be walls of text. Use the following visual components to break up content, highlight key numbers, and keep readers engaged. Aim for at least one visual element every 2-3 paragraphs. All styles are defined in `css/styles.css` under the `POST RICH VISUAL ELEMENTS` section.

##### Callout Boxes

Use for tips, warnings, and key insights. Three variants: `callout-info` (blue/primary), `callout-warning` (orange/secondary), `callout-key` (red/tertiary).

```html
<div class="callout-box callout-info">
  <span class="callout-icon material-symbols-outlined">lightbulb</span>
  <div class="callout-body">
    <div class="callout-title">Think of it this way</div>
    <p>Your explanatory text here.</p>
  </div>
</div>
```

Common icons: `lightbulb` (tips), `warning` (warnings), `key` (key points), `auto_awesome` (highlights), `gavel` (formal/legal), `info` (general info).

##### Definition Boxes

Use for formal definitions or hypothesis statements. Features a floating badge label.

```html
<div class="definition-box">
  <span class="def-badge">Definition</span>
  <div class="def-term">Term Being Defined</div>
  <p>The definition or explanation text.</p>
</div>
```

##### Stat Card Grids

Use to highlight key numbers in a grid. Great for showing how values scale or for impact summaries.

```html
<div class="stat-grid">
  <div class="stat-card">
    <span class="stat-number">1,024</span>
    <span class="stat-label">10 Variables</span>
    <span class="stat-detail">Still fast</span>
  </div>
  <!-- More stat-card items -->
</div>
```

##### Comparison Bars

Use to visually compare magnitudes. Bar fill classes: `bar-fast` (green), `bar-medium` (orange), `bar-slow` (red), `bar-primary` (theme primary).

```html
<div class="comparison-bars">
  <div class="bar-item">
    <div class="bar-label"><span>Label</span><span>Detail</span></div>
    <div class="bar-track"><div class="bar-fill bar-fast" style="width: 5%"></div></div>
  </div>
  <div class="bar-item">
    <div class="bar-label"><span>Label</span><span>Detail</span></div>
    <div class="bar-track"><div class="bar-fill bar-slow" style="width: 100%"></div></div>
  </div>
</div>
```

##### Flow Diagrams

Use for showing sequences, dependency chains, or processes. Node variants: default, `flow-node-primary`, `flow-node-accent`, `flow-node-danger`.

```html
<div class="diagram-container">
  <div class="diagram-title">Diagram Title Here</div>
  <div class="flow-diagram">
    <span class="flow-node flow-node-primary">Step 1</span>
    <span class="flow-arrow">&#8594;</span>
    <span class="flow-node">Step 2</span>
    <span class="flow-arrow">&#8594;</span>
    <span class="flow-node flow-node-danger">Step 3</span>
  </div>
  <div class="diagram-caption">Caption explaining the diagram.</div>
</div>
```

##### Equation / Formula Blocks

Use for mathematical formulas, comparisons, or any content that benefits from monospace centered display. Use `<sup>` for exponents and `<span class="eq-highlight">` for emphasis.

```html
<div class="equation-block">
  <div class="equation">Time(n) = <span class="eq-highlight">O(2<sup>n</sup>)</span></div>
  <div class="equation-caption">Caption explaining the formula.</div>
</div>
```

##### Scale Comparison Cards

Use for side-by-side comparisons (good vs bad, before vs after). Variants: `scale-good` (green), `scale-bad` (red).

```html
<div class="scale-compare">
  <div class="scale-card scale-good">
    <div class="scale-label">Fast</div>
    <div class="scale-value">n&#178;</div>
    <div class="scale-desc">Manageable growth.</div>
  </div>
  <div class="scale-card scale-bad">
    <div class="scale-label">Slow</div>
    <div class="scale-value">2&#8319;</div>
    <div class="scale-desc">Explosive growth.</div>
  </div>
</div>
```

##### Timelines

Use for ordered steps, impact sequences, or hierarchies. Each item gets a dot on a vertical line.

```html
<div class="visual-timeline">
  <div class="timeline-item">
    <div class="timeline-label">Step 1</div>
    <div class="timeline-title">Title Here</div>
    <div class="timeline-desc">Description text.</div>
  </div>
  <!-- More timeline-item entries -->
</div>
```

##### Inline Number Highlights

Use for making specific numbers stand out within body text.

```html
<span class="num-highlight">10,000</span>
```

##### Figures with Captions

Use `<figure>` and `<figcaption>` for images that need captions.

```html
<figure>
  <img src="path/to/image.jpg" alt="Description">
  <figcaption>Figure 1: Caption text here.</figcaption>
</figure>
```

#### Visual Density Rule

**Every post must include visual elements to avoid being text-heavy.** Follow this guideline:
- Insert at least one visual element (callout, diagram, stat grid, equation block, comparison, etc.) every 2-3 paragraphs.
- A post of 2000+ words should have at least 10 visual elements.
- Use stat cards for numbers, callout boxes for tips/warnings, and diagrams for processes or relationships.
- Never have more than 3 consecutive plain `<p>` tags without a visual break.

#### Content Structure Pattern

Follow this structure for consistency with existing posts:

```
<p>Opening paragraph that hooks the reader and sets context.</p>
<hr>
<h2>First Major Section</h2>
<p>Explanation and context.</p>
<div class="callout-box callout-info">...</div>
<p>More context.</p>
<div class="diagram-container">...</div>
<pre><code>// Code example with proper escaping
function example() {\n  return true;\n}</code></pre>
<p>Analysis of the code or concept.</p>
<h2>Second Major Section</h2>
<p>Content with <span class="num-highlight">key numbers</span> highlighted inline.</p>
<div class="stat-grid">...</div>
<p>Content continues...</p>
<div class="scale-compare">...</div>
...
<h2>Key Takeaways</h2>
<ol>
<li><strong>Takeaway one.</strong> Explanation.</li>
<li><strong>Takeaway two.</strong> Explanation.</li>
</ol>
<p>Closing paragraph that ties everything together.</p>
```

#### Code Block Formatting Rules

- Wrap code in `<pre><code>...</code></pre>`
- Escape all newlines as `\\n` (since the content is a single-line JSON string)
- Escape all double quotes as `\\"` inside the JSON string
- Escape angle brackets in generic types: `<` as `\u003c`, `>` as `\u003e` (or use HTML entities)
- The blog uses Highlight.js which auto-detects language, so no language class is needed
- Each code block automatically gets a copy-to-clipboard button

#### Escaping Rules for the JSON String

Since `contents` is a JSON string value, you must:
1. Escape all `"` as `\"`
2. Escape all newlines in code as `\\n`
3. Escape backslashes as `\\`
4. HTML angle brackets in code should use entities or unicode escapes

### Step 5: Register the Post

Add the new post's slug to `static/posts/index.json`:

```json
{
  "posts": [
    "new-post-slug",
    "designing-resilient-distributed-caches",
    "event-driven-architecture-patterns",
    "understanding-database-indexing-strategies",
    "pragmatic-guide-to-docker-in-production"
  ]
}
```

**Important:** The order matters. Posts listed first appear first on the homepage. Place new posts at the top of the array.

---

## Editing an Existing Post

To edit a post:
1. Open `static/posts/<slug>.json`
2. Modify the relevant fields
3. If updating images, generate new ones and replace the files in `static/images/`

---

## Checklist Before Finalizing

- [ ] Slug matches the JSON filename (without `.json`)
- [ ] Slug is registered in `static/posts/index.json`
- [ ] `thumbnail` image exists at the specified path (1:1 square)
- [ ] `coverPhoto` image exists at the specified path (16:9 wide)
- [ ] `contents` is a valid single-line HTML string (no raw newlines)
- [ ] No emoji anywhere in the post
- [ ] No em dash (-) or en dash anywhere, use dash (-) or comma (,)
- [ ] No smart/curly quotes, use straight quotes only
- [ ] `readingTimeMinutes` is accurate (word count / 200)
- [ ] `excerpt` is concise (1-2 sentences, no HTML)
- [ ] All code blocks use `<pre><code>` with newlines escaped as `\\n`
- [ ] `date` is in `YYYY-MM-DD` format
- [ ] `author` is `"Niaz Bin Siraj"`
- [ ] `status` is `"published"`
- [ ] Visual elements are used throughout (at least 1 every 2-3 paragraphs, minimum 10 for 2000+ word posts)
- [ ] No more than 3 consecutive `<p>` tags without a visual break (callout, diagram, stat grid, etc.)
