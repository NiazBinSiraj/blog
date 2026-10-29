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

#### Content Structure Pattern

Follow this structure for consistency with existing posts:

```
<p>Opening paragraph that hooks the reader and sets context.</p>
<hr>
<h2>First Major Section</h2>
<p>Explanation and context.</p>
<pre><code>// Code example with proper escaping
function example() {\n  return true;\n}</code></pre>
<p>Analysis of the code or concept.</p>
<h2>Second Major Section</h2>
<p>Content continues...</p>
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
