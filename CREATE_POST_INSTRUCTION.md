# 📝 Blog Post Creation Guide — For AI Agents

> **Purpose:** This document is the single source of truth for generating new blog posts on [niazbinsiraj.github.io/blog](https://niazbinsiraj.github.io/blog). Follow every section exactly so the output renders perfectly with zero manual fixing.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Step-by-Step Workflow](#2-step-by-step-workflow)
3. [Post JSON Schema](#3-post-json-schema)
4. [Content Writing Rules](#4-content-writing-rules)
5. [HTML Formatting Reference](#5-html-formatting-reference)
6. [Image & Photo Guidelines](#6-image--photo-guidelines)
7. [SEO & Metadata Checklist](#7-seo--metadata-checklist)
8. [Complete Example Post](#8-complete-example-post)
9. [Common Mistakes to Avoid](#9-common-mistakes-to-avoid)

---

## 1. Architecture Overview

This blog is a **static Single-Page Application** (SPA) hosted on GitHub Pages. There is no build step, no Markdown parser, and no backend. Posts are stored as **JSON files** containing raw HTML content.

```
blog/
├── static/
│   ├── posts/
│   │   ├── index.json          ← Master registry of all post slugs
│   │   ├── my-post-slug.json   ← Individual post files
│   │   └── ...
│   └── images/
│       ├── my-post-cover.jpg   ← Cover images
│       ├── my-post-photo1.jpg  ← Inline images
│       └── ...
├── js/
│   ├── post.js                 ← Loads & renders posts
│   └── utils.js                ← Excerpt, reading time, photo placeholders
├── css/
│   └── styles.css              ← All styling (including .post-content rules)
└── index.html                  ← The SPA shell
```

**Key rendering facts:**
- Post content is injected into a `<div class="post-content">` container.
- The CSS styles `h1`–`h6`, `p`, `ul`, `ol`, `li`, `blockquote`, `code`, `pre`, `a`, `img`, and `hr` inside `.post-content`.
- Photo placeholders like `{{photo1}}` are replaced with `<img>` tags at load time.
- The first ~150 characters of text content are auto-extracted as the **excerpt** for post cards.
- Reading time is calculated automatically (~200 words/minute).

---

## 2. Step-by-Step Workflow

Follow these steps **in order** every time you create a new post:

### Step 1 — Generate the slug

Create a URL-friendly slug from the post title:
- All lowercase
- Replace spaces with hyphens (`-`)
- Remove special characters (keep only `a-z`, `0-9`, `-`)
- Keep it descriptive but concise (3–8 words ideal)

Example: `"Why I Switched to Neovim"` → `why-i-switched-to-neovim`

### Step 2 — Prepare images

Place all images in `static/images/`:

| Image Type | File Name Convention | Dimensions | Max Size |
|---|---|---|---|
| Cover photo | `<slug>-cover.jpg` or `<slug>.png` | 1200×675 px (16:9) | < 200 KB |
| Inline photo | `<slug>-photo1.jpg`, `<slug>-photo2.jpg`, … | Max 1920 px wide | < 300 KB |

> **Note:** If you cannot provide actual images, still set the `coverPhoto` path and `photos` array — the blog gracefully handles missing images. If generating images, prefer `.jpg` for photos and `.png` for diagrams/screenshots.

### Step 3 — Create the JSON post file

Create `static/posts/<slug>.json` with the full post content (schema detailed in [Section 3](#3-post-json-schema)).

### Step 4 — Register the post in `index.json`

Open `static/posts/index.json` and **prepend** the new slug to the `posts` array (newest first):

```json
{
  "posts": [
    "your-new-post-slug",
    "existing-post-slug-1",
    "existing-post-slug-2"
  ]
}
```

### Step 5 — Commit & push

```bash
git add static/posts/<slug>.json static/posts/index.json static/images/<slug>*
git commit -m "Add: <Post Title>"
git push origin main
```

---

## 3. Post JSON Schema

Every post file is a single JSON object with these fields:

```json
{
  "slug": "string (required) — must match the filename without .json",
  "title": "string (required) — the display title",
  "author": "Niaz Bin Siraj",
  "date": "YYYY-MM-DD (required) — publication date",
  "category": "string (required) — single category",
  "tags": "string (required) — comma-separated, no spaces after commas",
  "coverPhoto": "string (required) — relative path from repo root",
  "photos": ["string array — paths to inline images, can be empty []"],
  "contents": "string (required) — the full post body in HTML"
}
```

### Field Rules

| Field | Type | Required | Details |
|---|---|---|---|
| `slug` | String | ✅ | Lowercase, hyphen-separated, no special chars. Must match filename. |
| `title` | String | ✅ | 50–80 characters. Title-cased. No trailing period. |
| `author` | String | ✅ | Always `"Niaz Bin Siraj"` |
| `date` | String | ✅ | `YYYY-MM-DD` format. Use the actual publication date. |
| `category` | String | ✅ | Use one of: `Technology`, `Software Development`, `Personal`, `Career`, `Web Development`, `DevOps`, `Tools`. Create new categories sparingly. |
| `tags` | String | ✅ | 4–8 tags, comma-separated, all lowercase, hyphenated multi-word tags. Example: `"git,best-practices,code-quality"` |
| `coverPhoto` | String | ✅ | Path like `"static/images/your-slug-cover.jpg"` |
| `photos` | Array | Optional | Array of image paths for inline placeholders. Empty `[]` if none. |
| `contents` | String | ✅ | Full HTML of the post body. **Must be a single-line string** (no literal newlines — use `\n` only if absolutely needed inside `<pre>` blocks). |

---

## 4. Content Writing Rules

### Voice & Tone

The blog author (Niaz Bin Siraj) writes with a specific voice. **Match these characteristics:**

- **First person singular** ("I", "my") — the author shares personal experience and opinions.
- **Conversational but professional** — not academic, not slang. Feels like a senior engineer explaining to a colleague.
- **Direct and practical** — get to the point. Avoid fluff, filler phrases, and excessive qualifiers.
- **Opinionated where appropriate** — the author takes clear stances (e.g., "good commits are for people, not Git").
- **Real examples** — illustrate points with concrete scenarios, code snippets, or real-world experiences.
- **Second person for the reader** ("you", "your") — engage the reader directly.

### Content Structure Pattern

Follow this structure for every post:

```
1. Opening Hook (1–2 paragraphs)
   → State the problem or context. Why does this matter?
   → Optionally include a meta-description paragraph at the very top.

2. Section Headings (3–6 main sections)
   → Use <h2> for major sections.
   → Use <h3> for subsections within a section.
   → Each section should be a self-contained idea.

3. Practical Examples / Code / Scenarios
   → Include at least one concrete example, code block, or step-by-step guide.

4. Conclusion / Final Thoughts (1–2 paragraphs)
   → Summarize the key takeaway.
   → End with a thought-provoking question or a strong closing statement.
```

### Writing Best Practices

- **First paragraph matters most.** It becomes the auto-generated excerpt (~150 chars). Make it compelling and descriptive.
- **Use horizontal rules (`<hr>`)** to visually separate major sections. Place one between each `<h2>` section.
- **Keep paragraphs short.** 2–4 sentences max. Long paragraphs are hard to read on screen.
- **Use bold (`<strong>`) strategically** to highlight key terms and phrases — not entire sentences.
- **Use italic (`<em>`)** for emphasis, introducing new terms, or thoughts.
- **Lists are your friend.** Use `<ul>` for unordered collections and `<ol>` for sequential steps.
- **Target 800–2000 words.** This gives a 4–10 min reading time, which is the sweet spot for blog posts.

---

## 5. HTML Formatting Reference

The `contents` field must be **valid HTML**. These are the supported and styled elements:

### Headings

```html
<h2>Main Section Title</h2>
<h3>Subsection Title</h3>
<h4>Minor Subsection</h4>
```

> ⚠️ **Do NOT use `<h1>` inside contents.** The post title is already rendered as `<h1>` by the template. Start with `<h2>`.

### Paragraphs

```html
<p>This is a paragraph. Keep it short and readable.</p>
<p>Start a new paragraph for a new thought.</p>
```

### Bold & Italic

```html
<p>Use <strong>bold text</strong> for key terms and <em>italic text</em> for emphasis.</p>
```

### Lists

```html
<!-- Unordered list -->
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>

<!-- Ordered list -->
<ol>
  <li>Step one</li>
  <li>Step two</li>
  <li>Step three</li>
</ol>
```

### Code

```html
<!-- Inline code -->
<p>Run the <code>git status</code> command to check.</p>

<!-- Code block -->
<pre><code>function greet(name) {
  return `Hello, ${name}!`;
}</code></pre>
```

> **Important for code blocks in JSON:** Since the `contents` value is a JSON string, you must:
> - Escape all double quotes inside code: `\"` 
> - Use `\n` for newlines inside `<pre><code>` blocks
> - Escape backslashes: `\\`
> - Use `&lt;` and `&gt;` for angle brackets in code if they could be interpreted as HTML

### Blockquotes

```html
<blockquote>This is a highlighted quote or callout. It renders with a left accent border.</blockquote>
```

### Links

```html
<a href="https://example.com" target="_blank">Link text</a>
```

> Always include `target="_blank"` for external links. Do NOT include `rel="noopener"` — it will be escaped in JSON and may cause issues.

### Horizontal Rules (Section Dividers)

```html
<hr>
```

Use `<hr>` between major sections to create visual breathing room.

### Images (Inline via Placeholder System)

```html
<!-- DO NOT use raw <img> tags in contents. Use the placeholder system instead. -->
{{photo1}}
{{photo2}}
```

The placeholders are replaced at render time with properly styled `<img>` tags. See [Section 6](#6-image--photo-guidelines) for details.

### Direct `<img>` Tags (Alternative)

If you must use a direct image tag (e.g., for external images):

```html
<img src="static/images/my-image.jpg" alt="Descriptive alt text" loading="lazy">
```

The CSS automatically styles images inside `.post-content` to be `max-width: 100%`, `border-radius: 4px`, with vertical margin.

---

## 6. Image & Photo Guidelines

### Cover Photo

Every post **must** have a cover photo:

| Property | Requirement |
|---|---|
| Path | `static/images/<slug>-cover.jpg` (or `.png`) |
| Dimensions | 1200 × 675 px (16:9 aspect ratio) |
| Max file size | 200 KB |
| Format | JPG (photos) or PNG (diagrams) |
| Composition | Keep critical content in center 60%; avoid text in bottom 20% |

The cover image is displayed:
- On post list cards: full-width, max-height 360px, cropped with `object-cover`
- On full post view: full-width below the header

### Inline Photos (Optional)

For images within the post body:

1. **Add paths to the `photos` array** in the post JSON:
   ```json
   "photos": [
     "static/images/my-slug-photo1.jpg",
     "static/images/my-slug-photo2.png"
   ]
   ```

2. **Insert placeholders** in the `contents` HTML where you want them to appear:
   ```html
   <p>Here's how the architecture looks:</p>{{photo1}}<p>And the deployment pipeline:</p>{{photo2}}
   ```

3. **Placeholder numbering** is 1-based and maps to the `photos` array index:
   - `{{photo1}}` → `photos[0]`
   - `{{photo2}}` → `photos[1]`
   - `{{photo3}}` → `photos[2]`

### Inline Photo Specs

| Property | Requirement |
|---|---|
| Max width | 1920 px |
| Max file size | 300 KB per image |
| Format | JPG for photographs, PNG for screenshots/diagrams |
| Auto-styling | `max-width: 100%`, rounded corners, vertical margin |
| Lazy loading | Applied automatically |

### Naming Convention

All image files related to a post should use the slug as prefix:

```
static/images/
├── my-post-slug-cover.jpg
├── my-post-slug-photo1.jpg
├── my-post-slug-photo2.png
└── my-post-slug-diagram.png
```

---

## 7. SEO & Metadata Checklist

These are handled automatically by the blog engine, but you should optimize for them:

- [x] **Title:** 50–80 characters, descriptive, includes primary keyword
- [x] **First paragraph:** Write a compelling opening — it auto-becomes the `og:description` and excerpt
- [x] **Slug:** Include primary keyword in the slug
- [x] **Category:** Use a consistent, existing category when possible
- [x] **Tags:** Include 4–8 relevant, specific tags (e.g., `javascript` not `js`)
- [x] **Cover photo:** Always provide one — it's used for `og:image` and `twitter:image`
- [x] **Headings:** Use `<h2>` and `<h3>` to create a clear hierarchy searchable by browsers
- [x] **Alt text:** Always include descriptive `alt` attributes on any direct `<img>` tags

---

## 8. Complete Example Post

Here is a full, working post file you can use as a template:

**File: `static/posts/understanding-javascript-closures.json`**

```json
{
  "slug": "understanding-javascript-closures",
  "title": "Understanding JavaScript Closures — A Practical Guide",
  "author": "Niaz Bin Siraj",
  "date": "2026-03-19",
  "category": "Technology",
  "tags": "javascript,closures,functions,web-development,programming",
  "coverPhoto": "static/images/understanding-javascript-closures-cover.jpg",
  "photos": [],
  "contents": "<p>Closures are one of the most powerful and often misunderstood concepts in JavaScript. If you've been writing JS for a while, you've already used closures — you just might not have realized it.</p><p>In this post, I'll break down what closures are, why they matter, and how to use them effectively in your everyday code.</p><hr><h2>What Is a Closure?</h2><p>A closure is created when a function <strong>remembers</strong> the variables from its outer scope, even after that outer function has finished executing. In simpler terms, a closure gives a function access to its parent's variables.</p><pre><code>function createCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2</code></pre><p>Here, the inner function <em>closes over</em> the <code>count</code> variable. Even though <code>createCounter()</code> has finished running, the returned function still has access to <code>count</code>.</p><hr><h2>Why Should You Care?</h2><p>Closures are everywhere in JavaScript. Understanding them helps you:</p><ul><li><strong>Write cleaner module patterns</strong> — encapsulate private state without classes.</li><li><strong>Handle async operations</strong> — callbacks and promises rely on closures to remember context.</li><li><strong>Create factory functions</strong> — generate customized functions on the fly.</li><li><strong>Avoid common bugs</strong> — like the classic loop-variable problem.</li></ul><hr><h2>A Real-World Scenario</h2><p>Let's say you're building a rate limiter for API calls:</p><pre><code>function createRateLimiter(maxCalls, windowMs) {\n  let calls = 0;\n  setInterval(() =&gt; { calls = 0; }, windowMs);\n\n  return function() {\n    if (calls &gt;= maxCalls) {\n      return false;\n    }\n    calls++;\n    return true;\n  };\n}\n\nconst limiter = createRateLimiter(5, 60000);\n// Allows 5 calls per minute</code></pre><p>The inner function has persistent access to <code>calls</code> and <code>maxCalls</code>. This is a closure in action — practical, clean, and no class boilerplate needed.</p><hr><h2>The Classic Pitfall</h2><p>Here's a bug that bites many developers:</p><pre><code>for (var i = 0; i &lt; 3; i++) {\n  setTimeout(function() {\n    console.log(i); // prints 3, 3, 3\n  }, 100);\n}</code></pre><p>Because <code>var</code> is function-scoped, all three callbacks share the <em>same</em> <code>i</code>. By the time they run, the loop is done and <code>i</code> is 3.</p><p>The fix? Use <code>let</code> (block-scoped) or create a closure:</p><pre><code>for (let i = 0; i &lt; 3; i++) {\n  setTimeout(function() {\n    console.log(i); // prints 0, 1, 2\n  }, 100);\n}</code></pre><hr><h2>Final Thoughts</h2><p>Closures aren't a trick or an advanced feature — they're a fundamental part of how JavaScript works. Once you internalize them, you'll start seeing opportunities to write simpler, more elegant code.</p><p>Next time you write a function inside a function, pause and ask yourself: <strong>what variables is this closing over?</strong> That awareness alone will make you a better developer.</p>"
}
```

**Then update `static/posts/index.json`:**

```json
{
  "posts": [
    "understanding-javascript-closures",
    "why-meaningful-commits-matter-in-software-development",
    "difflense-privacy-first-git-diff-viewer"
  ]
}
```

---

## 9. Common Mistakes to Avoid

| ❌ Mistake | ✅ Correct |
|---|---|
| Using `<h1>` inside contents | Start with `<h2>` — the title is already `<h1>` |
| Multi-line JSON string (literal newlines in `contents`) | Keep `contents` as a single-line string; use `\n` only inside `<pre>` blocks |
| Unescaped double quotes in contents | Escape as `\"` inside the JSON string |
| Forgetting to update `index.json` | Always prepend the new slug to the `posts` array |
| Using Markdown syntax | This blog uses **raw HTML**, not Markdown. No `## headings` or `**bold**` |
| Putting slug out of sync with filename | `"slug": "my-post"` must match file `my-post.json` |
| Skipping `<hr>` between sections | Use `<hr>` between `<h2>` sections for visual separation |
| Very long first paragraph | Keep it 1–2 sentences — it auto-becomes the excerpt |
| Using `<br>` instead of new `<p>` tags | Use separate `<p>` tags for paragraphs; `<br>` only for line breaks within a paragraph |
| Tags with spaces (e.g., `"web development"`) | Use hyphens: `"web-development"` |
| Missing `coverPhoto` field | Always provide a cover photo path, even if the image is pending |

---

## Quick Reference — Minimum Viable Post

```json
{
  "slug": "your-slug-here",
  "title": "Your Title Here",
  "author": "Niaz Bin Siraj",
  "date": "YYYY-MM-DD",
  "category": "Technology",
  "tags": "tag1,tag2,tag3,tag4",
  "coverPhoto": "static/images/your-slug-here-cover.jpg",
  "photos": [],
  "contents": "<p>Opening paragraph that hooks the reader and becomes the excerpt.</p><hr><h2>First Section</h2><p>Main content here.</p><hr><h2>Second Section</h2><p>More content.</p><hr><h2>Conclusion</h2><p>Closing thoughts.</p>"
}
```

---

*Last updated: 2026-03-19*
