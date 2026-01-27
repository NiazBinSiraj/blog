# Personal Blog Website

A modern, minimalist personal blog with a writer's notebook aesthetic built with vanilla HTML, CSS, JavaScript, and Tailwind CSS. Designed for GitHub Pages hosting with dynamic content loading from JSON files.

![Blog Preview](https://img.shields.io/badge/Status-Ready%20for%20Production-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## 📑 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Content Management](#-content-management)
- [Customization](#-customization)
- [Development](#-development)
- [Configuration](#-configuration)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)
- [Roadmap](#-roadmap)

## ✨ Features

### 🎨 Design & UI
- **Minimal black & white aesthetic** inspired by writer's notebooks
- **Dark/Light mode** with smooth transitions and persistent theme preference
- **Fully responsive** with mobile-first design and sidebar navigation
- **Clean typography** using Inter font with optimized letter spacing
- **Subtle animations** and smooth transitions throughout

### 📱 User Experience
- **Single Page Application** with hash-based client-side routing
- **Fast loading** with optimized performance and lazy image loading
- **Real-time search** with debouncing and keyword highlighting
- **Category and tag filtering** with dedicated browse pages
- **Reading time estimation** based on content length
- **Social sharing** buttons for Twitter, LinkedIn, Facebook, and link copying
- **Scroll to top** button for easy navigation

### 🔧 Technical Features
- **No backend required** - pure static site, perfect for GitHub Pages
- **JSON-based content** management with index system
- **SEO optimized** with comprehensive Open Graph and Twitter Card meta tags
- **Accessibility focused** with semantic HTML and ARIA attributes
- **Fixed sidebar** on desktop, collapsible on mobile
- **Custom Tailwind configuration** with extended color palette and animations

### 📝 Content Management
- **Dynamic post loading** from JSON files in `static/posts/`
- **Rich HTML content** support in posts
- **Cover photo support** with optimized aspect ratio (16:9)
- **Inline photo placeholders** with `{{photoN}}` syntax
- **Automatic metadata extraction** for categories and tags
- **Custom URL slugs** for posts with SEO-friendly structure

## 🚀 Quick Start

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/NiazBinSiraj/blog.git
cd blog

# Open in your preferred editor
code .
```

### 2. Add Your Profile Image
```bash
# Add your profile photo (recommended: 400x400px, square, optimized)
cp your-profile-photo.jpg static/images/profile.jpg
```

### 3. Create Your First Post
```bash
# Create a new post file
touch static/posts/my-first-post.json
```

Add your post content:
```json
{
  "slug": "my-first-post",
  "title": "My First Blog Post",
  "author": "Your Name",
  "date": "2026-01-28",
  "category": "Personal",
  "tags": "introduction,blog,welcome",
  "coverPhoto": "static/images/my-first-post-cover.jpg",
  "photos": [],
  "contents": "<p>Welcome to my blog! This is my first post where I share my thoughts about...</p><h2>Getting Started</h2><p>Here's what I'll be writing about...</p>"
}
```

### 4. Update Posts Index
Edit `static/posts/index.json` to include your new post:
```json
{
  "posts": [
    "my-first-post",
    "difflense-privacy-first-git-diff-viewer",
    "why-meaningful-commits-matter-in-software-development"
  ]
}
```

### 5. Serve Locally
```bash
# Using Python 3 (recommended)
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Visit `http://localhost:8000` to see your blog!

## 📁 Project Structure

```
blog/
├── index.html              # Main HTML file with sidebar and content area
├── CNAME                   # Custom domain configuration for GitHub Pages
├── css/
│   └── styles.css          # Custom CSS with black & white theme variables
├── js/
│   ├── app.js             # Main application initialization and setup
│   ├── router.js          # Client-side routing with hash-based navigation
│   ├── post.js            # Post management, loading, and rendering
│   ├── search.js          # Search functionality with debouncing
│   ├── theme.js           # Dark/light mode toggle and persistence
│   └── utils.js           # Utility functions (debounce, formatDate, etc.)
├── static/
│   ├── images/            # Images and media files
│   │   ├── profile.jpg    # Your profile photo (400x400px recommended)
│   │   ├── *-cover.jpg    # Blog post cover images (1200x675px, 16:9)
│   │   └── README.md      # Image guidelines and specifications
│   └── posts/             # Blog posts in JSON format
│       ├── index.json     # Master index listing all post slugs
│       ├── difflense-privacy-first-git-diff-viewer.json
│       └── why-meaningful-commits-matter-in-software-development.json
├── README.md              # This file - comprehensive documentation
└── prd.txt               # Product requirements document
```

## 📝 Content Management

### Adding New Posts

1. **Create the JSON file** in `static/posts/`:
```json
{
  "slug": "unique-post-slug",
  "title": "Your Post Title",
  "author": "Your Name",
  "date": "2026-01-28",
  "category": "Technology",
  "tags": "javascript,tutorial,web-development",
  "coverPhoto": "static/images/post-cover.jpg",
  "photos": [
    "static/images/post-image-1.jpg",
    "static/images/post-image-2.jpg"
  ],
  "contents": "<p>Your post content with HTML...</p><h2>Subheading</h2><p>More content...</p>"
}
```

2. **Update the index** in `static/posts/index.json`:
```json
{
  "posts": [
    "unique-post-slug",
    "difflense-privacy-first-git-diff-viewer",
    "why-meaningful-commits-matter-in-software-development"
  ]
}
```
**Important:** Add new posts at the beginning of the array to display them first.

### Post JSON Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | String | ✅ | Unique identifier for the post URL |
| `title` | String | ✅ | Post title displayed in cards and headers |
| `author` | String | ✅ | Author name |
| `date` | String | ✅ | Publication date (YYYY-MM-DD format) |
| `category` | String | ✅ | Single category (e.g., "Technology", "Personal") |
| `tags` | String | ✅ | Comma-separated tags (e.g., "javascript,tutorial") |
| `coverPhoto` | String | ✅ | Path to cover image (16:9 aspect ratio) |
| `photos` | Array | ⚪ | Additional images for inline use |
| `contents` | String | ✅ | Full post content in HTML format |

### Cover Photo Specifications

Based on the implementation, cover photos should follow these guidelines:

- **Aspect Ratio:** 16:9 (landscape)
- **Resolution:** 1200x675px (recommended) or 1920x1080px (high-res)
- **File Format:** JPG or WebP (optimized)
- **File Size:** < 200KB (compress for web)
- **Display:** 
  - Post cards: 192px height (h-48), full width, `object-cover`
  - Full post: 256px height on mobile (h-64), 320px on desktop (h-80)
- **Composition:** Keep important content in center 60%, avoid text in lower 20%

### Content Features

#### HTML Content Support
Posts support full HTML formatting:
```html
<h2>Section Heading</h2>
<p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>

<ul>
  <li>Unordered list item</li>
  <li>Another item</li>
</ul>

<ol>
  <li>Ordered list item</li>
  <li>Second item</li>
</ol>

<blockquote>Important quote or callout</blockquote>

<code>inline code snippet</code>

<pre><code>// Code block
function example() {
  return "Hello World";
}</code></pre>

<a href="https://example.com" target="_blank">External link</a>
```

#### Image Placeholders
Use `{{photoN}}` syntax to insert images from the `photos` array:
```json
{
  "photos": [
    "static/images/diagram-1.jpg",
    "static/images/screenshot-2.jpg"
  ],
  "contents": "<p>Here's a diagram:</p>{{photo1}}<p>And a screenshot:</p>{{photo2}}"
}
```
The system automatically converts placeholders to properly formatted `<img>` tags with lazy loading.

#### Tags and Categories
- **Tags**: Comma-separated string (e.g., `"git,diff,privacy,open-source"`)
- **Categories**: Single category per post (e.g., `"Technology"`, `"Personal"`)
- Both are automatically extracted and indexed for search and filtering
- Tags appear as clickable elements in post cards and full post views
- Categories have dedicated browse pages

## 🎨 Customization

### Theme Configuration

The blog uses a minimal black & white aesthetic with CSS custom properties. Edit `css/styles.css`:

```css
:root {
    /* Light theme */
    --bg-primary: #ffffff;
    --bg-secondary: #fafafa;
    --bg-tertiary: #f5f5f5;
    --text-primary: #171717;
    --text-secondary: #525252;
    --text-muted: #737373;
    --border-color: #e5e5e5;
    --link-color: #171717;
}

:root.dark {
    /* Dark theme */
    --bg-primary: #0a0a0a;
    --bg-secondary: #171717;
    --bg-tertiary: #262626;
    --text-primary: #fafafa;
    --text-secondary: #a3a3a3;
    --text-muted: #737373;
    --border-color: #262626;
    --link-color: #fafafa;
}
```

### Tailwind Configuration

Custom Tailwind colors are defined in `index.html`:
```javascript
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'ink': {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    // ... more shades
                    900: '#171717',
                    950: '#0a0a0a'
                }
            },
            fontFamily: {
                'serif': ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
                'sans': ['Inter', 'system-ui', 'sans-serif'],
                'mono': ['Menlo', 'Monaco', 'Consolas', 'monospace']
            }
        }
    }
};
```

### Personalizing Content

Update personal information in `index.html`:

```html
<!-- Profile section (around line 70) -->
<div class="p-6 border-b border-ink-200 dark:border-ink-800">
    <img src="static/images/profile.jpg" alt="Your Name" class="...">
    <h1 class="...">Your Name</h1>
    <p class="...">Your Title or Description</p>
</div>

<!-- Meta tags (in <head>) -->
<title>Your Name - Personal Blog</title>
<meta name="description" content="Your blog description">
<meta property="og:title" content="Your Blog Title">
<meta property="twitter:site" content="@yourusername">
```

### Modifying Layout

#### Sidebar Navigation
Edit the navigation links in `index.html` (around line 80-130):
```html
<nav class="space-y-1">
    <a href="#" data-route="home" class="nav-link ...">
        <!-- SVG icon -->
        <span>Home</span>
    </a>
    <!-- Add more navigation items -->
</nav>
```

#### Main Content Area
The content area automatically adjusts based on sidebar state:
- Desktop (lg breakpoint): `lg:ml-72` (288px left margin for fixed sidebar)
- Mobile: Full width with collapsible sidebar overlay

### Adding New Routes

1. **Define the route** in `js/router.js`:
```javascript
defineRoutes() {
    this.routes = {
        'home': this.renderHome.bind(this),
        'your-page': this.renderYourPage.bind(this),
        // ... other routes
    };
}
```

2. **Implement the render method**:
```javascript
renderYourPage() {
    const content = document.getElementById('main-content');
    content.innerHTML = `
        <div class="prose dark:prose-invert max-w-none">
            <h1>Your Page Title</h1>
            <p>Your content here...</p>
        </div>
    `;
    this.updateActiveNavigation('your-page');
}
```

3. **Add navigation link** in sidebar (`index.html`)

## 🌐 Deployment

### GitHub Pages (Recommended)

The blog is designed specifically for GitHub Pages hosting.

#### Initial Setup
1. **Create GitHub repository** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Personal blog"
   git branch -M main
   git remote add origin https://github.com/yourusername/blog.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to "Pages" section
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Click Save

3. **Custom Domain (Optional)**
   - Add `CNAME` file with your domain
   - Configure DNS settings with your domain provider
   - Add A records or CNAME record pointing to GitHub Pages

4. **Access Your Blog**
   - Default: `https://yourusername.github.io/blog/`
   - Custom domain: `https://yourdomain.com/`

#### Updating Content
```bash
# Make changes to posts or code
git add .
git commit -m "Add: New blog post about topic"
git push origin main

# GitHub Pages will automatically rebuild (1-2 minutes)
```

### Netlify

1. **Connect Repository**
   - Sign up at [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository

2. **Build Settings**
   - Build command: (leave empty)
   - Publish directory: `.` (root)
   - No build step needed

3. **Deploy**
   - Click "Deploy site"
   - Site will be live at `random-name.netlify.app`
   - Configure custom domain in Netlify settings

### Vercel

1. **Import Project**
   - Sign up at [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub

2. **Configure**
   - Framework Preset: Other
   - Build Command: (none)
   - Output Directory: `.` (root)

3. **Deploy**
   - Click "Deploy"
   - Site will be live at `project-name.vercel.app`

### Custom Server (Apache/Nginx)

#### Apache (.htaccess)
```apache
# Enable HTTPS redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle routing (all requests to index.html)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^.*$ index.html [L]

# Cache static assets
<FilesMatch "\.(jpg|jpeg|png|gif|webp|css|js)$">
    Header set Cache-Control "max-age=31536000, public"
</FilesMatch>
```

#### Nginx (nginx.conf)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/blog;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|webp|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

### Deployment Checklist

Before deploying to production:

- [ ] Test all pages and routes locally
- [ ] Validate all JSON files
- [ ] Optimize and compress images
- [ ] Update meta tags and URLs
- [ ] Test on multiple devices/browsers
- [ ] Check mobile responsiveness
- [ ] Verify dark mode works
- [ ] Test all navigation links
- [ ] Confirm search functionality
- [ ] Check social sharing buttons
- [ ] Update README with your information
- [ ] Add custom domain (if using)
- [ ] Enable HTTPS
- [ ] Set up analytics (optional)

## 🛠 Development

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code recommended)
- Local development server (Python, Node.js, or PHP)
- Git (for version control)

### Development Workflow
1. **Edit content** - Create or modify JSON files in `static/posts/`
2. **Update styles** - Modify CSS in `css/styles.css` or Tailwind config
3. **Update functionality** - Edit JavaScript modules in `js/`
4. **Test locally** - Run development server and test in browser
5. **Commit changes** - Use Git to track and version your changes
6. **Deploy** - Push to GitHub Pages or your hosting platform

### JavaScript Modules

#### `app.js` - Application Initialization
- Initializes all managers (post, search, theme, router)
- Sets up scroll behavior and animations
- Provides debug utilities via `window.debugBlog`

#### `router.js` - Client-Side Routing
- Hash-based navigation (`#/post/slug-name`)
- Route definitions for home, posts, post, categories, tags, search, about, 404
- Navigation event listeners
- Active navigation state management

#### `post.js` - Post Management
- Loads posts from `static/posts/index.json`
- Fetches individual post JSON files
- Renders post cards and full post views
- Manages categories and tags
- Handles social sharing buttons
- Processes photo placeholders (`{{photoN}}`)

#### `search.js` - Search Functionality
- Debounced real-time search (300ms delay)
- Searches across title, content, tags, and categories
- Keyword highlighting in results
- Category and tag filtering

#### `theme.js` - Theme Management
- Dark/light mode toggle
- Persists preference to `localStorage`
- System theme detection
- Smooth theme transitions

#### `utils.js` - Utility Functions
- `debounce()` - Rate-limiting for search
- `formatDate()` - Human-readable date formatting
- `calculateReadingTime()` - Reading time estimation
- `sanitizeHTML()` - Basic HTML sanitization
- `showLoading()` / `hideLoading()` - Loading state management
- `showError()` - User-friendly error messages

### Debug Mode

Open browser console and use these global debugging functions:

```javascript
// Get application information
window.debugBlog.getAppInfo();
// Returns: version, routes, theme, post count

// Get all loaded posts
window.debugBlog.getPosts();

// Search posts programmatically
window.debugBlog.searchPosts('javascript');

// Navigate to a route
window.debugBlog.navigateTo('posts');
window.debugBlog.navigateTo('post', { slug: 'my-post-slug' });

// Get current theme
window.debugBlog.getTheme();

// Force theme change
window.debugBlog.setTheme('dark'); // or 'light'
```

### Performance Optimization

#### Images
- Use WebP format for better compression
- Optimize before uploading (use tools like TinyPNG, Squoosh)
- Lazy loading is automatic (`loading="lazy"` attribute)
- Recommended sizes:
  - Profile photo: 400x400px
  - Cover photos: 1200x675px (16:9)
  - Inline images: Max 1920px width

#### JavaScript
- All modules are vanilla JS (no framework overhead)
- Debounced search reduces unnecessary computations
- Single index.json fetch for post discovery
- Individual posts loaded on-demand

#### CSS
- Tailwind loaded via CDN (consider self-hosting for production)
- Custom CSS is minimal and focused
- CSS custom properties for efficient theme switching

#### Caching
Set up proper cache headers on your server:
```apache
# .htaccess for Apache
<FilesMatch "\.(html|css|js|jpg|jpeg|png|gif|webp)$">
    Header set Cache-Control "max-age=31536000, public"
</FilesMatch>
```

## 🔧 Configuration

### Site Settings

Update site-wide settings in `index.html`:

```html
<!-- Basic metadata (lines 5-7) -->
<title>Your Name - Personal Blog</title>
<meta name="description" content="Your blog description">
<meta name="author" content="Your Name">

<!-- Open Graph / Facebook (lines 10-16) -->
<meta property="og:url" content="https://yourdomain.com/blog/">
<meta property="og:title" content="Your Blog Title">
<meta property="og:description" content="Your description">
<meta property="og:image" content="https://yourdomain.com/blog/static/images/profile.jpg">
<meta property="og:site_name" content="Your Blog Name">

<!-- Twitter Card (lines 18-25) -->
<meta property="twitter:site" content="@yourusername">
<meta property="twitter:title" content="Your Blog Title">
<meta property="twitter:description" content="Your description">
<meta property="twitter:image" content="https://yourdomain.com/blog/static/images/profile.jpg">

<!-- Canonical URL (line 27) -->
<link rel="canonical" href="https://yourdomain.com/blog/">
```

### Custom Domain (GitHub Pages)

If using a custom domain, create/update `CNAME` file:
```
yourdomain.com
```

### Router Configuration

Routes are defined in `js/router.js`:
```javascript
defineRoutes() {
    this.routes = {
        'home': this.renderHome.bind(this),      // #/ or #home
        'posts': this.renderAllPosts.bind(this), // #posts
        'post': this.renderPost.bind(this),      // #post/slug-name
        'categories': this.renderCategories.bind(this), // #categories
        'tags': this.renderTags.bind(this),      // #tags
        'search': this.renderSearch.bind(this),  // #search?q=query
        'about': this.renderAbout.bind(this),    // #about
        '404': this.render404.bind(this)         // Fallback
    };
}
```

### Search Configuration

Search debounce delay and behavior in `js/search.js`:
```javascript
constructor() {
    this.debounceDelay = 300; // milliseconds
    // Adjust for faster/slower response
}
```

### Theme Configuration

Default theme and persistence in `js/theme.js`:
```javascript
initTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    // Then check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply theme
    this.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
}
```

### SEO Configuration

#### Meta Tags
All pages automatically generate appropriate meta tags:
- Title tags: Post title + site name
- Meta descriptions: Auto-generated from post excerpts
- Open Graph tags: For social media previews
- Twitter Cards: Large image cards for Twitter

#### Structured Data
Consider adding JSON-LD structured data for better SEO:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Your Blog Name",
  "description": "Your blog description",
  "url": "https://yourdomain.com/blog/"
}
</script>
```

## 🎯 Best Practices

### Content Guidelines
- **Write engaging titles** (50-60 characters ideal for SEO)
- **Use descriptive slugs** (lowercase, hyphens, no special characters)
- **Create excerpts** in first paragraph (used for previews)
- **Optimize images** (use alt text, compress files, proper dimensions)
- **Choose relevant tags** (3-7 tags per post)
- **Use consistent categories** (create a category system and stick to it)
- **Format content well** (use headings, lists, code blocks appropriately)
- **Add internal links** (link between related posts)

### Image Best Practices

#### Cover Photos (16:9 ratio)
- **Resolution:** 1200x675px (standard) or 1920x1080px (high-res)
- **File size:** < 200KB (use compression)
- **Format:** JPG (photos), WebP (for better compression)
- **Composition:** Center important content, avoid text in lower 20%
- **Naming:** Use descriptive names (`react-hooks-guide-cover.jpg`)

#### Profile Photo
- **Resolution:** 400x400px (square)
- **File size:** < 100KB
- **Format:** JPG or WebP
- **Style:** Professional, clear face shot or logo

#### Inline Images
- **Max width:** 1920px
- **File size:** < 300KB each
- **Format:** JPG for photos, PNG for diagrams/screenshots
- **Loading:** Lazy loading is automatic

### Technical Best Practices

#### HTML/CSS
- **Validate markup** before deployment (use W3C validator)
- **Use semantic HTML** for accessibility
- **Test responsive design** on multiple devices
- **Check color contrast** (WCAG AA minimum)

#### JavaScript
- **Keep modules focused** (single responsibility)
- **Handle errors gracefully** (try-catch blocks)
- **Provide user feedback** (loading states, error messages)
- **Test all routes** and navigation paths

#### Performance
- **Minimize HTTP requests** (combine files where possible)
- **Optimize images** (compress, use appropriate formats)
- **Leverage browser caching** (set proper headers)
- **Monitor page load speed** (aim for < 3 seconds)

#### Security
- **Sanitize user input** (though this is a static site)
- **Use HTTPS** (GitHub Pages provides this)
- **Keep dependencies updated** (Tailwind CDN link)
- **Don't commit secrets** (API keys, passwords)

### Accessibility (a11y)

The blog includes several accessibility features:
- **Semantic HTML** structure
- **ARIA labels** on interactive elements
- **Keyboard navigation** support
- **Focus indicators** on interactive elements
- **Color contrast** meeting WCAG AA standards
- **Alt text** on images (remember to add this)
- **Skip links** for keyboard navigation

Test with:
- Screen readers (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation (Tab, Enter, Escape)
- Browser accessibility audits (Lighthouse)

### Git Workflow

Recommended branch strategy:
```bash
# Main branch for production
git checkout main

# Create feature branch for new posts
git checkout -b post/new-article-slug

# Make changes, commit
git add static/posts/new-article-slug.json
git commit -m "Add: New article about topic"

# Push and create PR
git push origin post/new-article-slug

# Merge to main after review
# Deploy automatically via GitHub Pages
```

## 🐛 Troubleshooting

### Common Issues

#### Posts Not Loading
**Symptoms:** Empty posts page, "No posts found" message

**Solutions:**
1. Check JSON syntax in post files (use JSONLint.com)
2. Verify post slugs are listed in `static/posts/index.json`
3. Ensure file paths are correct (case-sensitive on some servers)
4. Check browser console for specific error messages
5. Verify posts array is at the beginning of index.json

```json
// Correct format for index.json
{
  "posts": [
    "post-slug-1",
    "post-slug-2"
  ]
}
```

#### Images Not Displaying
**Symptoms:** Broken image icons, alt text showing

**Solutions:**
1. Verify image file paths are correct (relative to root)
2. Check image file names match exactly (case-sensitive)
3. Ensure images are uploaded to the repository
4. Check file permissions on server (should be readable)
5. Verify image format is supported (JPG, PNG, WebP, GIF)
6. Test image URL directly in browser

```json
// Correct path format
"coverPhoto": "static/images/my-post-cover.jpg"
// NOT: "/static/images/..." or "../static/images/..."
```

#### Styling Issues
**Symptoms:** Broken layout, missing styles, wrong colors

**Solutions:**
1. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
2. Check browser console for CSS load errors
3. Verify Tailwind CDN is loading (check network tab)
4. Check for CSS syntax errors in `css/styles.css`
5. Ensure dark mode class is applied correctly
6. Test in incognito/private browsing mode

#### Search Not Working
**Symptoms:** Search input does nothing, no results

**Solutions:**
1. Check browser console for JavaScript errors
2. Ensure all JavaScript files are loading in correct order
3. Verify `searchManager` is initialized
4. Check that posts are loaded before searching
5. Test search with known keywords from existing posts

```javascript
// Debug search in console
window.debugBlog.searchPosts('test query');
```

#### Navigation Not Working
**Symptoms:** Links don't navigate, hash doesn't change

**Solutions:**
1. Check that all `.js` files are loaded
2. Verify `router` is initialized in `app.js`
3. Check for JavaScript errors in console
4. Ensure navigation links have correct `data-route` attributes
5. Test direct hash URLs (e.g., `index.html#posts`)

```html
<!-- Correct navigation link format -->
<a href="#" data-route="posts" class="nav-link">All Posts</a>
```

#### Dark Mode Not Persisting
**Symptoms:** Theme resets on page reload

**Solutions:**
1. Check if localStorage is enabled in browser
2. Verify `theme.js` is loading
3. Check browser console for localStorage errors
4. Test in different browser
5. Clear site data and try again

```javascript
// Debug theme in console
window.debugBlog.getTheme();
window.debugBlog.setTheme('dark');
```

#### Mobile Sidebar Not Opening
**Symptoms:** Sidebar toggle button doesn't work

**Solutions:**
1. Check that sidebar toggle event listeners are set up
2. Verify JavaScript is loaded completely
3. Check for z-index conflicts in CSS
4. Test on different mobile browsers
5. Inspect element to see if classes are toggling

#### 404 Page Not Showing
**Symptoms:** Blank page on invalid routes

**Solutions:**
1. Verify `router.js` has `render404` method
2. Check that router initialization is complete
3. Test with a known invalid hash (e.g., `#invalid-route`)

### Debug Checklist

When encountering issues, work through this checklist:

- [ ] Check browser console for errors
- [ ] Verify all files are in correct locations
- [ ] Test in different browser
- [ ] Clear cache and reload
- [ ] Check network tab for failed requests
- [ ] Validate JSON syntax (posts and index)
- [ ] Use browser dev tools inspector
- [ ] Test with debug utilities (`window.debugBlog`)

### Browser Compatibility

Tested and working in:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

If you encounter issues in older browsers:
1. Check if JavaScript features are supported
2. Consider adding polyfills for older browsers
3. Test in the browser's latest version first

### Getting Help

If none of the above solutions work:

1. **Check existing issues:** [GitHub Issues](https://github.com/NiazBinSiraj/blog/issues)
2. **Search discussions:** Look for similar problems
3. **Create new issue:** Provide details (browser, OS, error messages, screenshots)
4. **Include debug info:** Use `window.debugBlog.getAppInfo()` output

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Whether it's bug fixes, new features, or documentation improvements.

### How to Contribute

1. **Fork the repository**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/blog.git
   cd blog
   ```

3. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-description
   ```

4. **Make your changes**
   - Follow existing code style
   - Test thoroughly
   - Update documentation if needed

5. **Commit changes**
   ```bash
   git add .
   git commit -m "Add: Brief description of changes"
   ```
   
   Commit message format:
   - `Add: New feature`
   - `Fix: Bug description`
   - `Update: Component or documentation`
   - `Remove: Deprecated feature`

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open Pull Request**
   - Go to original repository
   - Click "New Pull Request"
   - Describe your changes
   - Link related issues

### Contribution Guidelines

#### Code Style
- Use meaningful variable/function names
- Add comments for complex logic
- Follow existing formatting patterns
- Keep functions focused and small

#### Testing
- Test on multiple browsers
- Check mobile responsiveness
- Verify dark mode compatibility
- Test all affected routes

#### Documentation
- Update README if changing features
- Add inline comments for complex code
- Document new configuration options

### Types of Contributions

We welcome:
- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ♿ Accessibility improvements
- 🌐 Internationalization (i18n)
- 🚀 Performance optimizations

### Need Ideas?

Check out:
- [Open Issues](https://github.com/NiazBinSiraj/blog/issues)
- [Enhancement Requests](https://github.com/NiazBinSiraj/blog/labels/enhancement)
- [Good First Issues](https://github.com/NiazBinSiraj/blog/labels/good%20first%20issue)

## 📞 Support

### Getting Help

If you encounter issues or have questions:

1. **Check Documentation**
   - Read this README thoroughly
   - Review [Troubleshooting](#-troubleshooting) section
   - Check code comments in source files

2. **Search Existing Issues**
   - [Browse issues](https://github.com/NiazBinSiraj/blog/issues)
   - Use search to find similar problems
   - Check closed issues for solutions

3. **Create New Issue**
   - [Open an issue](https://github.com/NiazBinSiraj/blog/issues/new)
   - Use descriptive title
   - Provide details:
     - Browser and version
     - Operating system
     - Steps to reproduce
     - Error messages
     - Screenshots (if applicable)
     - Debug output from `window.debugBlog.getAppInfo()`

4. **Ask Questions**
   - Use GitHub Discussions (if enabled)
   - Tag appropriately (#question, #help-wanted)

### Response Times

- Critical bugs: 24-48 hours
- Feature requests: 3-7 days
- Documentation updates: 1-3 days
- General questions: 2-5 days

*Note: This is a personal project maintained in spare time. Response times may vary.*

## 🙏 Acknowledgments

This project wouldn't be possible without:

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Inter Font](https://rsms.me/inter/)** - Beautiful typeface by Rasmus Andersson
- **[GitHub Pages](https://pages.github.com/)** - Free static site hosting
- **Open Source Community** - For inspiration and best practices

### Inspiration

Design inspired by:
- Classic writer's notebooks and journals
- Medium's reading experience
- Modern minimalist web design
- Brutalist web design principles

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2026 Niaz Bin Siraj

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🔮 Roadmap

Potential future enhancements:

- [ ] RSS feed generation
- [ ] Newsletter subscription integration
- [ ] Comment system (via third-party service)
- [ ] Reading progress indicator
- [ ] Series/collection organization
- [ ] Advanced search filters (date range, author)
- [ ] Table of contents auto-generation
- [ ] Print stylesheet optimization
- [ ] Service worker for offline support
- [ ] Multi-language support (i18n)
- [ ] Code syntax highlighting themes
- [ ] Related posts suggestions
- [ ] View count tracking (privacy-friendly)
- [ ] Export post to PDF

Vote for features or suggest new ones in [GitHub Issues](https://github.com/NiazBinSiraj/blog/issues)!

## 📊 Project Stats

- **Version:** 2.0
- **Last Updated:** January 2026
- **Status:** Active Development
- **Language:** JavaScript (Vanilla)
- **Dependencies:** Tailwind CSS (CDN)
- **License:** MIT
- **Browser Support:** Modern browsers (ES6+)

---

**Built with ❤️ by [Niaz Bin Siraj](https://github.com/NiazBinSiraj)**

*Happy blogging! ✍️*

---

### Quick Links

- 🌐 [Live Demo](https://niazbinsiraj.github.io/blog/)
- � [GitHub Repository](https://github.com/NiazBinSiraj/blog)
- 🐛 [Report Bug](https://github.com/NiazBinSiraj/blog/issues/new?labels=bug)
- ✨ [Request Feature](https://github.com/NiazBinSiraj/blog/issues/new?labels=enhancement)
- 📖 [Documentation](https://github.com/NiazBinSiraj/blog#readme)

---

*If you find this project useful, please consider giving it a ⭐ on GitHub!*