# Niaz Bin Siraj - Personal Blog

A modern, editorial-style personal blog built with vanilla HTML, CSS, and JavaScript. Designed for GitHub Pages hosting with JSON-based content management.

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

**Live:** [niazbinsiraj.github.io/blog](https://niazbinsiraj.github.io/blog/)

---

## Features

- **Single Page Application** with hash-based client-side routing
- **Dark/Light/Sepia themes** with custom color support and FOUC-free loading
- **Real-time search** with debouncing and keyword highlighting
- **Category and tag filtering** with dedicated browse pages
- **Code syntax highlighting** via Highlight.js with copy-to-clipboard buttons
- **Contact page** with Web3Forms integration
- **Newsletter subscription** via Buttondown
- **Reading time estimation** and word count
- **Social sharing** (Twitter, LinkedIn, link copy)
- **Responsive layout** with collapsible sidebars
- **SEO optimized** with Open Graph, Twitter Cards, and JSON-LD structured data
- **No build step** - pure static site, works directly on GitHub Pages

---

## Project Structure

```
blog/
  index.html                  # SPA shell with header, nav, footer
  AGENTS.md                   # AI agent instructions for creating posts
  css/
    styles.css                # All styling (design tokens, components, layout)
  js/
    app.js                    # App initialization, newsletter handler
    router.js                 # Client-side routing and page rendering
    post.js                   # Post loading, rendering, and management
    search.js                 # Search with debouncing and highlighting
    theme.js                  # Theme management and persistence
    utils.js                  # Utility functions
    analytics.js              # GA4 event tracking
  static/
    posts/
      index.json              # Registry of all post slugs (order = display order)
      <slug>.json             # Individual post files
    images/
      profile.jpg             # Author profile photo
      thumb-<name>.jpg        # Square thumbnails (1:1) for post cards
      cover-<name>.jpg        # Wide cover photos (16:9) for post pages
```

---

## Adding a New Post

Detailed instructions for creating posts are in [AGENTS.md](AGENTS.md). Quick summary:

1. Create `static/posts/<slug>.json` with post metadata and HTML content
2. Generate a square thumbnail (`thumb-*.jpg`) and wide cover photo (`cover-*.jpg`)
3. Place images in `static/images/`
4. Add the slug to `static/posts/index.json` (newest first)

### Post JSON Structure

```json
{
  "slug": "my-post-slug",
  "title": "Post Title Here",
  "author": "Niaz Bin Siraj",
  "date": "2026-10-25",
  "category": "System Design",
  "tags": ["distributed-systems", "caching", "redis"],
  "excerpt": "A brief 1-2 sentence summary.",
  "readingTimeMinutes": 12,
  "language": "en",
  "status": "published",
  "thumbnail": "static/images/thumb-my-post.jpg",
  "coverPhoto": "static/images/cover-my-post.jpg",
  "photos": [],
  "contents": "<p>HTML content as a single-line string...</p>"
}
```

---

## Pages and Routes

| Route | Page | Description |
|-------|------|-------------|
| `#home` | Home | Hero section + post list |
| `#posts` | All Posts | Filterable post archive |
| `#post/<slug>` | Post | Full post with cover, content, sharing |
| `#categories` | Categories | Browse by category |
| `#tags` | Tags | Browse by tag |
| `#search?q=` | Search | Full-text search results |
| `#contact` | Contact | Contact form (Web3Forms) + social links |

---

## Integrations

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **Web3Forms** | Contact form submissions | Access key in `js/router.js` |
| **Buttondown** | Newsletter subscriptions | Username in `js/app.js` |
| **Highlight.js** | Code syntax highlighting | CDN in `index.html` |
| **Google Fonts** | Typography (Inter, Source Serif, JetBrains Mono) | CDN in `index.html` |
| **Material Symbols** | Icons | CDN in `index.html` |

---

## Local Development

```bash
# Clone
git clone https://github.com/NiazBinSiraj/blog.git
cd blog

# Serve locally (pick one)
python -m http.server 5500
npx serve . -p 5500

# Visit http://localhost:5500
```

No dependencies to install. No build step required.

---

## Deployment

### GitHub Pages

1. Push to `main` branch
2. Go to Settings > Pages > Source: Deploy from `main` branch, `/ (root)`
3. Site available at `https://niazbinsiraj.github.io/blog/`

### Custom Domain

Update the `CNAME` file and configure DNS accordingly.

---

## Tech Stack

- **HTML5** - Semantic markup
- **Vanilla CSS** - Custom design system with CSS custom properties
- **Vanilla JavaScript** - No framework, no bundler
- **Highlight.js** - Syntax highlighting (CDN)
- **Material Symbols** - Iconography (CDN)
- **Google Fonts** - Typography (CDN)

---

## License

MIT License. Copyright (c) 2026 Niaz Bin Siraj.

---

Built by [Niaz Bin Siraj](https://github.com/NiazBinSiraj)