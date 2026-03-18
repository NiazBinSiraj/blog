/**
 * Post management and rendering — Reader-first design
 */

class PostManager {
    constructor() {
        this.posts = [];
        this.categories = new Set();
        this.tags = new Set();
        this.postsLoaded = false;
    }

    async loadAllPosts() {
        if (this.postsLoaded) return this.posts;

        try {
            showLoading();

            const response = await fetch('static/posts/index.json');
            let postSlugs = [];

            if (response.ok) {
                const index = await response.json();
                postSlugs = index.posts || [];
            } else {
                postSlugs = await this.discoverPosts();
            }

            const postPromises = postSlugs.map(slug => this.loadPost(slug));
            const posts = await Promise.all(postPromises);

            this.posts = posts.filter(post => post !== null);
            this.extractCategoriesAndTags();
            this.postsLoaded = true;

            hideLoading();
            return this.posts;
        } catch (error) {
            console.error('Error loading posts:', error);
            hideLoading();
            throw error;
        }
    }

    async discoverPosts() {
        const commonSlugs = [
            'welcome-to-my-blog',
            'getting-started-with-web-development',
            'javascript-best-practices',
            'css-tips-and-tricks',
            'my-development-setup'
        ];

        const existingSlugs = [];
        for (const slug of commonSlugs) {
            try {
                const response = await fetch(`static/posts/${slug}.json`);
                if (response.ok) existingSlugs.push(slug);
            } catch (e) {}
        }
        return existingSlugs;
    }

    async loadPost(slug) {
        try {
            const response = await fetch(`static/posts/${slug}.json`);
            if (!response.ok) throw new Error(`Post not found: ${slug}`);

            const post = await response.json();
            if (!this.validatePost(post)) throw new Error(`Invalid post: ${slug}`);

            post.processedContent = replacePhotoPlaceholders(post.contents, post.photos || []);
            post.excerpt = generateExcerpt(post.contents);
            post.readingTime = calculateReadingTime(extractTextFromHTML(post.contents));
            post.formattedDate = formatDate(post.date);

            // Short date for list items
            post.shortDate = new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            if (typeof post.tags === 'string') {
                post.tagArray = post.tags.split(',').map(t => t.trim()).filter(t => t);
            } else if (Array.isArray(post.tags)) {
                post.tagArray = post.tags;
            } else {
                post.tagArray = [];
            }

            return post;
        } catch (error) {
            console.error(`Error loading post ${slug}:`, error);
            return null;
        }
    }

    validatePost(post) {
        return ['slug', 'title', 'author', 'date', 'contents'].every(f => post.hasOwnProperty(f) && post[f]);
    }

    extractCategoriesAndTags() {
        this.categories.clear();
        this.tags.clear();
        this.posts.forEach(post => {
            if (post.category) this.categories.add(post.category);
            if (post.tagArray) post.tagArray.forEach(tag => this.tags.add(tag));
        });
    }

    getPostBySlug(slug) { return this.posts.find(p => p.slug === slug); }
    getPostsByCategory(cat) { return this.posts.filter(p => p.category === cat); }
    getPostsByTag(tag) { return this.posts.filter(p => p.tagArray && p.tagArray.includes(tag)); }
    getLatestPosts(limit = 5) { return this.posts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit); }
    getAllCategories() { return Array.from(this.categories).sort(); }
    getAllTags() { return Array.from(this.tags).sort(); }

    searchPosts(query) {
        const q = query.toLowerCase();
        return this.posts.filter(post => {
            return post.title.toLowerCase().includes(q) ||
                   extractTextFromHTML(post.contents).toLowerCase().includes(q) ||
                   (post.tagArray && post.tagArray.some(t => t.toLowerCase().includes(q))) ||
                   (post.category && post.category.toLowerCase().includes(q));
        });
    }

    // ---- Minimal post list item (homepage/all posts) ----
    renderPostListItem(post) {
        const labels = post.tagArray && post.tagArray.length > 0
            ? `<div class="post-list-labels">${post.tagArray.slice(0, 3).map(t => `<span class="label-pill" data-tag="${t}">${t}</span>`).join('')}</div>`
            : (post.category ? `<div class="post-list-labels"><span class="label-pill">${post.category}</span></div>` : '');

        const image = post.coverPhoto
            ? `<div class="post-list-image"><img src="${post.coverPhoto}" alt="${post.title}" loading="lazy"></div>`
            : '';

        return `
            <article class="post-list-item" data-slug="${post.slug}">
                ${image}
                ${labels}
                <h2 class="post-list-title">${post.title}</h2>
                <p class="post-list-excerpt">${post.excerpt}</p>
                <div class="post-list-meta">
                    <span>${post.shortDate}</span>
                    <span>${post.readingTime} min read</span>
                </div>
            </article>
        `;
    }

    // ---- Full post — pure reading mode ----
    renderFullPost(post) {
        if (!post) {
            return '<div style="text-align:center;padding:4rem 0"><p>Post not found.</p></div>';
        }

        const labels = post.tagArray && post.tagArray.length > 0
            ? `<div class="post-labels">${post.tagArray.map(t => `<span class="label-pill" data-tag="${t}">${t}</span>`).join('')}</div>`
            : (post.category ? `<div class="post-labels"><span class="label-pill">${post.category}</span></div>` : '');

        const coverImage = post.coverPhoto
            ? `<div class="post-list-image" style="margin-bottom:1.5rem"><img src="${post.coverPhoto}" alt="${post.title}" loading="lazy"></div>`
            : '';

        const navigation = this.renderPostNavigation(post);
        const shareLinks = this.renderShareLinks(post);

        return `
            <article>
                <header class="post-header">
                    <h1>${post.title}</h1>
                    ${labels}
                    <div class="post-meta">
                        <span>${post.author}</span>
                        <span>${post.formattedDate}</span>
                        <span>${post.readingTime} min read</span>
                    </div>
                    <hr class="post-divider">
                </header>

                ${coverImage}

                <div class="post-content">
                    ${post.processedContent || post.contents}
                </div>

                <footer>
                    <hr class="post-divider">
                    ${shareLinks}
                    <hr class="post-divider">
                    ${navigation}
                    <div class="author-bio">
                        <img src="static/images/profile.jpg" alt="${post.author}">
                        <div class="author-bio-text">
                            <strong>${post.author}</strong><br>
                            Software Engineer
                        </div>
                    </div>
                </footer>
            </article>
        `;
    }

    // ---- Post navigation (← Previous | Next →) ----
    renderPostNavigation(currentPost) {
        const sortedPosts = this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        const idx = sortedPosts.findIndex(p => p.slug === currentPost.slug);
        const prevPost = idx < sortedPosts.length - 1 ? sortedPosts[idx + 1] : null;
        const nextPost = idx > 0 ? sortedPosts[idx - 1] : null;

        return `
            <div class="post-nav">
                ${prevPost ? `<a href="#post/${prevPost.slug}">← ${prevPost.title}</a>` : '<span></span>'}
                ${nextPost ? `<a href="#post/${nextPost.slug}">${nextPost.title} →</a>` : '<span></span>'}
            </div>
        `;
    }

    // ---- Understated share links ----
    renderShareLinks(post) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(post.title);

        return `
            <div class="share-links">
                <span style="color:var(--color-text-muted);font-weight:500">Share:</span>
                <a href="https://twitter.com/intent/tweet?url=${url}&text=${title}" target="_blank" rel="noopener">Twitter</a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" rel="noopener">Facebook</a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${url}" target="_blank" rel="noopener">LinkedIn</a>
                <button onclick="navigator.clipboard.writeText(window.location.href).then(()=>showToast('Link copied!'))">Copy Link</button>
            </div>
        `;
    }

    updateMetaTags(post) {
        document.title = `${post.title} - Niaz Bin Siraj`;

        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = post.excerpt;

        // Clear previous article tags
        document.querySelectorAll('meta[property^="article:"]').forEach(t => t.remove());

        const baseURL = window.location.origin + getBaseURL();
        const postURL = `${baseURL}#/post/${post.slug}`;

        const ogTags = {
            'og:title': post.title,
            'og:description': post.excerpt,
            'og:url': postURL,
            'og:type': 'article',
            'og:site_name': 'Niaz Bin Siraj - Blog',
            'twitter:title': post.title,
            'twitter:description': post.excerpt,
            'twitter:card': 'summary_large_image',
            'twitter:site': '@niazbinsiraj'
        };

        if (post.coverPhoto) {
            const imageURL = `${baseURL}${post.coverPhoto}`;
            ogTags['og:image'] = imageURL;
            ogTags['og:image:alt'] = post.title;
            ogTags['twitter:image'] = imageURL;
            ogTags['twitter:image:alt'] = post.title;
        }

        ogTags['article:author'] = post.author;
        ogTags['article:published_time'] = new Date(post.date).toISOString();
        if (post.category) ogTags['article:section'] = post.category;

        if (post.tagArray && post.tagArray.length > 0) {
            post.tagArray.slice(0, 5).forEach(tag => {
                const m = document.createElement('meta');
                m.setAttribute('property', 'article:tag');
                m.content = tag;
                document.head.appendChild(m);
            });
        }

        Object.entries(ogTags).forEach(([prop, content]) => {
            let tag = document.querySelector(`meta[property="${prop}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('property', prop);
                document.head.appendChild(tag);
            }
            tag.content = content;
        });

        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.href = postURL;
    }
}

const postManager = new PostManager();
