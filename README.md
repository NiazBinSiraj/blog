# Personal Blog Website

A modern, lightweight, and fully responsive personal blog built with vanilla HTML, CSS, JavaScript, and Tailwind CSS. Designed for GitHub Pages hosting with dynamic content loading from JSON files.

![Blog Preview](https://img.shields.io/badge/Status-Ready%20for%20Production-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🎨 Design & UI
- **Modern, minimal design** with clean typography
- **Dark/Light mode** with smooth transitions
- **Fully responsive** - works on desktop, tablet, and mobile
- **Eye-friendly colors** and professional layout
- **Smooth animations** and transitions

### 📱 User Experience
- **Single Page Application** with client-side routing
- **Fast loading** with optimized performance
- **Search functionality** with keyword highlighting
- **Category and tag filtering**
- **Reading time estimation**
- **Share buttons** for social media

### 🔧 Technical Features
- **No backend required** - pure static site
- **JSON-based content** management
- **SEO optimized** with Open Graph support
- **Accessibility compliant** (WCAG guidelines)
- **PWA ready** (can be installed as app)
- **Print-friendly** styling

### 📝 Content Management
- **Dynamic post loading** from JSON files
- **Markdown-like HTML** support in posts
- **Image placeholders** system
- **Categories and tags** organization
- **Custom URL slugs** for posts

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
# Add your profile photo (recommended: 300x300px, square)
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
  "date": "2025-09-01",
  "category": "Personal",
  "tags": "introduction,blog,welcome",
  "coverPhoto": "static/images/my-first-post-cover.jpg",
  "photos": [],
  "contents": "<p>Welcome to my blog! This is my first post...</p>"
}
```

### 4. Update Posts Index
```bash
# Edit static/posts/index.json
{
  "posts": [
    "my-first-post",
    "welcome-to-my-blog"
  ]
}
```

### 5. Serve Locally
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have it)
npx serve .

# Using PHP
php -S localhost:8000
```

Visit `http://localhost:8000` to see your blog!

## 📁 Project Structure

```
blog/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Custom CSS styles
├── js/
│   ├── app.js             # Main application logic
│   ├── router.js          # Client-side routing
│   ├── post.js            # Post management
│   ├── search.js          # Search functionality
│   ├── theme.js           # Dark/light mode
│   └── utils.js           # Utility functions
├── static/
│   ├── images/            # Images and media
│   │   ├── profile.jpg    # Your profile photo
│   │   └── README.md      # Image guidelines
│   └── posts/             # Blog posts
│       ├── index.json     # Posts index
│       └── *.json         # Individual post files
├── README.md              # This file
├── prd.txt               # Product requirements
└── prompt.txt            # Development prompt
```

## 📝 Content Management

### Adding New Posts

1. **Create the JSON file** in `static/posts/`:
```json
{
  "slug": "unique-post-slug",
  "title": "Your Post Title",
  "author": "Your Name",
  "date": "2025-09-01",
  "category": "Technology",
  "tags": "javascript,tutorial,web-development",
  "coverPhoto": "static/images/post-cover.jpg",
  "photos": [
    "static/images/post-image-1.jpg",
    "static/images/post-image-2.jpg"
  ],
  "contents": "<p>Your post content with HTML...</p>"
}
```

2. **Update the index** in `static/posts/index.json`:
```json
{
  "posts": [
    "unique-post-slug",
    "existing-post-1",
    "existing-post-2"
  ]
}
```

### Content Features

#### HTML Content
Posts support full HTML formatting:
```html
<h2>Heading</h2>
<p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
<ul>
  <li>List item</li>
  <li>Another item</li>
</ul>
<blockquote>Important quote</blockquote>
<code>inline code</code>
<pre><code>code block</code></pre>
```

#### Image Placeholders
Use `{{photoN}}` in content to insert images:
```json
{
  "photos": [
    "static/images/photo1.jpg",
    "static/images/photo2.jpg"
  ],
  "contents": "<p>Here's an image: {{photo1}}</p><p>And another: {{photo2}}</p>"
}
```

#### Tags and Categories
- **Tags**: Comma-separated string or array
- **Categories**: Single category per post
- Both support search and filtering

## 🎨 Customization

### Changing Colors
Edit CSS custom properties in `css/styles.css`:
```css
:root {
  --primary-color: #0d9488;    /* Teal */
  --secondary-color: #06b6d4;  /* Cyan */
  --accent-color: #f59e0b;     /* Amber */
}
```

### Modifying Layout
- **Sidebar**: Edit the aside section in `index.html`
- **Main content**: Modify the main section
- **Footer**: Add footer content as needed

### Adding New Pages
1. Add route in `js/router.js`:
```javascript
this.routes = {
  'home': this.renderHome.bind(this),
  'your-page': this.renderYourPage.bind(this),
  // ...
};
```

2. Add navigation link in sidebar

3. Implement the render method

## 🌐 Deployment

### GitHub Pages
1. **Enable GitHub Pages** in repository settings
2. **Select source**: Deploy from branch `main`
3. **Custom domain** (optional): Add CNAME file

### Netlify
1. **Connect repository** to Netlify
2. **Build settings**: No build command needed
3. **Publish directory**: `.` (root)

### Vercel
1. **Import project** from GitHub
2. **Framework preset**: Other
3. **Build command**: None needed

### Custom Server
Upload all files to your web server's public directory.

## 🛠 Development

### Prerequisites
- Web browser
- Text editor (VS Code recommended)
- Local server (Python, Node.js, or PHP)

### Development Workflow
1. **Edit content** in JSON files
2. **Modify styles** in CSS files
3. **Update functionality** in JS files
4. **Test locally** with a development server
5. **Deploy** to your hosting platform

### Performance Optimization
- **Images**: Optimize and use WebP format
- **CSS**: Minimize unused Tailwind classes
- **JavaScript**: Keep modules small and focused
- **Caching**: Leverage browser caching headers

## 🔧 Configuration

### Site Settings
Update personal information in `index.html`:
```html
<!-- Profile section -->
<h1>Your Name</h1>
<p>Your Title/Description</p>

<!-- Meta tags -->
<meta property="og:title" content="Your Blog Title">
<meta property="og:description" content="Your blog description">
```

### SEO Configuration
- **Title tags**: Auto-generated from post titles
- **Meta descriptions**: Generated from post excerpts
- **Open Graph**: Automatic social media previews
- **Schema markup**: Consider adding structured data

## 🎯 Best Practices

### Content Guidelines
- **Write engaging titles** (50-60 characters)
- **Use descriptive excerpts** (150-160 characters)
- **Optimize images** (use alt text, compress files)
- **Choose relevant tags** (3-7 tags per post)
- **Maintain consistent categories**

### Technical Best Practices
- **Validate HTML/CSS** before deployment
- **Test on multiple devices** and browsers
- **Monitor page load speeds**
- **Keep dependencies updated**
- **Use semantic HTML** for accessibility

## 🐛 Troubleshooting

### Common Issues

**Posts not loading:**
- Check JSON syntax in post files
- Verify posts are listed in `index.json`
- Ensure file paths are correct

**Images not displaying:**
- Verify image file paths
- Check image file permissions
- Ensure images are uploaded to server

**Styling issues:**
- Clear browser cache
- Check for CSS syntax errors
- Verify Tailwind CDN is loading

**Search not working:**
- Check browser console for errors
- Ensure all JavaScript files are loading
- Verify search input element exists

### Debug Mode
Use browser console and these global functions:
```javascript
// Get app information
window.debugBlog.getAppInfo();

// Search posts
window.debugBlog.searchPosts('javascript');

// Navigate programmatically
window.debugBlog.navigateTo('post', { slug: 'my-post' });
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#-troubleshooting)
2. Search [existing issues](https://github.com/NiazBinSiraj/blog/issues)
3. Create a [new issue](https://github.com/NiazBinSiraj/blog/issues/new)

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **Font Awesome** for icons (if used)
- **Google Fonts** for typography
- **GitHub Pages** for free hosting

---

**Built with ❤️ by [Niaz Bin Siraj](https://github.com/NiazBinSiraj)**

*Happy blogging! 🚀*