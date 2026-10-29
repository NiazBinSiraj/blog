/**
 * Router — handles navigation, URL routing, and page rendering
 * Reader-first design: minimal, clean HTML output
 */

const SITE_BASE_URL = 'https://blog.niazbinsiraj.com';
const SITE_NAME = 'Niaz Bin Siraj';
const SITE_DESCRIPTION = 'Niaz Bin Siraj writes about software engineering, system design, and technology. Long-form posts and technical deep dives.';

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.currentParams = {};
        this.init();
    }

    init() {
        this.defineRoutes();

        window.addEventListener('hashchange', () => this.handleRouteChange());
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.path) this.handleRouteChange(e.state.path);
        });

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupNavigationListeners();
                this.handleRouteChange();
            });
        } else {
            this.setupNavigationListeners();
            this.handleRouteChange();
        }
    }

    defineRoutes() {
        this.routes = {
            'home': this.renderHome.bind(this),
            'posts': this.renderAllPosts.bind(this),
            'post': this.renderPost.bind(this),
            'categories': this.renderCategories.bind(this),
            'tags': this.renderTags.bind(this),
            'search': this.renderSearch.bind(this),
            'contact': this.renderAbout.bind(this),
            '404': this.render404.bind(this)
        };
    }

    setupNavigationListeners() {
        document.addEventListener('click', (e) => {
            const routeEl = e.target.closest('[data-route]');
            if (routeEl) {
                e.preventDefault();
                this.navigate(routeEl.getAttribute('data-route'));
                return;
            }

            const postItem = e.target.closest('.post-list-item, .search-result-item');
            if (postItem) {
                e.preventDefault();
                const slug = postItem.getAttribute('data-slug');
                if (slug) this.navigate('post', { slug });
                return;
            }

            const tagEl = e.target.closest('.label-pill[data-tag], .tag-pill[data-tag]');
            if (tagEl) {
                e.preventDefault();
                const tag = tagEl.getAttribute('data-tag');
                if (tag && typeof searchManager !== 'undefined') searchManager.searchByTag(tag);
                return;
            }

            const catEl = e.target.closest('.category-card[data-category]');
            if (catEl) {
                e.preventDefault();
                const cat = catEl.getAttribute('data-category');
                if (cat && typeof searchManager !== 'undefined') searchManager.searchByCategory(cat);
                return;
            }
        });
    }

    navigate(route, params = {}) {
        this.currentRoute = route;
        this.currentParams = params;

        let url = `#${route}`;
        if (params.slug) url += `/${params.slug}`;
        if (params.category) url += `?category=${encodeURIComponent(params.category)}`;
        if (params.tag) url += `?tag=${encodeURIComponent(params.tag)}`;
        if (params.query) url += `?query=${encodeURIComponent(params.query)}`;

        window.location.hash = url;

        // Close mobile nav
        const mobileNav = document.getElementById('mobile-nav');
        const navOverlay = document.getElementById('nav-overlay');
        mobileNav?.classList.add('hidden');
        mobileNav?.classList.remove('visible');
        navOverlay?.classList.add('hidden');
        navOverlay?.classList.remove('visible');
    }

    handleRouteChange(path = null) {
        const hash = path || window.location.hash.slice(1);
        const [routePath, queryString] = hash.split('?');
        const pathParts = routePath.split('/').filter(p => p);
        const route = pathParts[0] || 'home';
        const slug = pathParts[1] || null;

        const params = new URLSearchParams(queryString || '');
        let routeParams = {};
        if (slug) routeParams.slug = slug;
        params.forEach((value, key) => { routeParams[key] = decodeURIComponent(value); });

        const targetRoute = route || 'home';

        if (this.routes[targetRoute]) {
            this.currentRoute = targetRoute;
            this.currentParams = routeParams;
            try {
                this.routes[targetRoute](routeParams);
            } catch (error) {
                console.error('Route error:', error);
                this.render404();
            }
        } else {
            this.routes['404']();
        }

        // Scroll to top on route change
        window.scrollTo(0, 0);

        // Update active nav link
        this.updateActiveNav(targetRoute);

        // Update sidebar visibility based on route
        this.updateSidebarVisibility(targetRoute);

        // GA4: Track virtual page view for SPA navigation
        if (typeof gaTrackPageView === 'function') {
            gaTrackPageView('/' + hash, document.title);
        }

        // Handle progress bar
        if (typeof blogApp !== 'undefined') {
            if (targetRoute === 'post') {
                setTimeout(() => blogApp.setupProgressBar(), 100);
            } else {
                blogApp.removeProgressBar();
            }
        }

        // Populate sidebars (after a tick to let posts load)
        setTimeout(() => {
            this.populateSidebar();
            this.populateTagCloud();
        }, 200);
    }

    populateSidebar() {
        const sidebarList = document.getElementById('sidebar-categories');
        if (!sidebarList) return;
        if (typeof postManager === 'undefined' || !postManager.postsLoaded) return;

        const categories = postManager.getAllCategories();
        if (categories.length === 0) {
            sidebarList.innerHTML = '<li style="font-size:0.8rem;color:var(--color-text-muted);padding:0.4rem 0.6rem">No categories yet</li>';
            return;
        }

        sidebarList.innerHTML = categories.map(cat => {
            const count = postManager.posts.filter(p => p.category === cat).length;
            return `
                <li>
                    <button data-category="${cat}">
                        <span>${cat}</span>
                        <span class="sidebar-count">${count}</span>
                    </button>
                </li>
            `;
        }).join('');

        // Wire click handlers
        sidebarList.querySelectorAll('button[data-category]').forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = btn.getAttribute('data-category');
                if (typeof searchManager !== 'undefined') {
                    searchManager.searchByCategory(cat);
                }
            });
        });
    }

    populateTagCloud() {
        const tagContainer = document.getElementById('sidebar-tags');
        if (!tagContainer) return;
        if (typeof postManager === 'undefined' || !postManager.postsLoaded) return;

        const tags = postManager.getAllTags();
        if (tags.length === 0) {
            tagContainer.innerHTML = '<span style="font-size:0.8rem;color:var(--color-text-muted)">No tags yet</span>';
            return;
        }

        tagContainer.innerHTML = tags.map(tag =>
            `<button class="tag-chip" data-tag="${tag}">${tag}</button>`
        ).join('');

        // Wire click handlers
        tagContainer.querySelectorAll('.tag-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                const tag = btn.getAttribute('data-tag');
                if (typeof searchManager !== 'undefined') {
                    searchManager.searchByTag(tag);
                }
            });
        });
    }

    // ---- Active Nav Highlighting ----
    updateActiveNav(route) {
        // Desktop nav
        document.querySelectorAll('.desktop-nav a[data-route]').forEach(link => {
            const linkRoute = link.getAttribute('data-route');
            if (linkRoute === route || (route === 'post' && linkRoute === 'posts') || (route === 'search' && linkRoute === 'posts')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Mobile nav
        document.querySelectorAll('.mobile-nav a[data-route]').forEach(link => {
            const linkRoute = link.getAttribute('data-route');
            if (linkRoute === route || (route === 'post' && linkRoute === 'posts') || (route === 'search' && linkRoute === 'posts')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ---- Sidebar Visibility ----
    updateSidebarVisibility(route) {
        const leftSidebar = document.getElementById('sidebar');
        const rightSidebar = document.getElementById('sidebar-right');

        // Pages where sidebars are redundant or distracting
        const hideSidebars = ['categories', 'tags', 'contact', 'post'];

        // Collapse left sidebar
        if (leftSidebar) {
            if (hideSidebars.includes(route)) {
                leftSidebar.classList.add('sidebar-collapsed');
            } else {
                leftSidebar.classList.remove('sidebar-collapsed');
            }
        }

        // Collapse right sidebar
        if (rightSidebar) {
            if (hideSidebars.includes(route)) {
                rightSidebar.classList.add('sidebar-collapsed');
            } else {
                rightSidebar.classList.remove('sidebar-collapsed');
            }
        }
    }

    // ---- SEO Helpers ----

    setRobotsMeta(content) {
        let tag = document.querySelector('meta[name="robots"]');
        if (!tag) {
            tag = document.createElement('meta');
            tag.name = 'robots';
            document.head.appendChild(tag);
        }
        tag.content = content;
    }

    setCanonical(url) {
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.href = url;
    }

    setMetaDescription(content) {
        let tag = document.querySelector('meta[name="description"]');
        if (!tag) {
            tag = document.createElement('meta');
            tag.name = 'description';
            document.head.appendChild(tag);
        }
        tag.content = content;
    }

    removeJsonLd() {
        document.querySelectorAll('script[data-seo-dynamic]').forEach(s => s.remove());
    }

    resetToDefaultMetaTags() {
        document.title = SITE_NAME + ' - Software Engineering, Systems & Technology';
        this.setMetaDescription(SITE_DESCRIPTION);
        this.setRobotsMeta('index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
        this.setCanonical(SITE_BASE_URL + '/');

        const defaultTags = {
            'og:title': SITE_NAME + ' - Software Engineering, Systems & Technology',
            'og:description': SITE_DESCRIPTION,
            'og:url': SITE_BASE_URL + '/',
            'og:type': 'website',
            'og:site_name': SITE_NAME,
            'twitter:title': SITE_NAME + ' - Software Engineering, Systems & Technology',
            'twitter:description': SITE_DESCRIPTION,
            'twitter:card': 'summary_large_image'
        };

        Object.entries(defaultTags).forEach(([prop, content]) => {
            let tag = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`);
            if (tag) tag.content = content;
        });

        document.querySelectorAll('meta[property^="article:"]').forEach(t => t.remove());
        this.removeJsonLd();
    }

    // =================== ROUTE HANDLERS ===================

    async renderHome() {
        showLoading();
        this.resetToDefaultMetaTags();

        try {
            await postManager.loadAllPosts();
            const posts = postManager.getLatestPosts(20);
            const featuredPost = posts[0];

            let content = `
                <div class="hero-section">
                    <div class="hero-layout">
                        <div class="hero-top">
                            <img src="static/images/profile.jpg" alt="Niaz Bin Siraj" class="hero-avatar">
                            <div>
                                <h1 class="hero-name"><span style="font-weight:400">Hi, I'm </span>Niaz Bin Siraj</h1>
                                <p class="hero-greeting">I'm a <strong>Software Engineer and AI Researcher</strong> passionate about building scalable, trustworthy AI systems and exploring new ideas and unsolved problems through research.</p>
                            </div>
                        </div>
                        <div class="hero-bio-rows">
                                <div class="hero-bio-row">
                                    <span class="hero-bio-label">Working at</span>
                                    <a href="https://www.therapservices.net/" target="_blank" rel="noopener" class="hero-bio-chip">Therap (BD) Ltd.</a>
                                </div>
                                <div class="hero-bio-row">
                                    <span class="hero-bio-label">Founder of</span>
                                    <a href="https://nbslabs.dev/" target="_blank" rel="noopener" class="hero-bio-chip">nbslabs</a>
                                </div>
                                <div class="hero-bio-row">
                                    <span class="hero-bio-label">Creator of</span>
                                    <a href="https://dotai.nbslabs.dev/" target="_blank" rel="noopener" class="hero-bio-chip">dotai</a>
                                    <a href="https://difflense.nbslabs.dev/" target="_blank" rel="noopener" class="hero-bio-chip">difflense</a>
                                    <a href="https://dhakaludo.nbslabs.dev/" target="_blank" rel="noopener" class="hero-bio-chip">dhakaludo</a>
                                </div>
                                <div class="hero-bio-row">
                                    <span class="hero-bio-label">Interested in</span>
                                    <span class="hero-bio-chip hero-bio-chip--plain">Reliable & Trustworthy AI Agents</span>
                                    <span class="hero-bio-chip hero-bio-chip--plain">NL Interfaces for Data Systems</span>
                                    <span class="hero-bio-chip hero-bio-chip--plain">AI-Native Software Engineering</span>
                                </div>
                        </div>
                        <div class="hero-socials">
                                <a href="https://x.com/niazbinsiraj" target="_blank" rel="noopener" class="hero-social-link">
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                    <span>X (Twitter)</span>
                                </a>
                                <a href="https://www.linkedin.com/in/niazbinsiraj/" target="_blank" rel="noopener" class="hero-social-link">
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                    <span>LinkedIn</span>
                                </a>
                                <a href="https://github.com/NiazBinSiraj" target="_blank" rel="noopener" class="hero-social-link">
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                                    <span>GitHub</span>
                                </a>
                        </div>
                    </div>
                </div>
            `;

            if (featuredPost) {
                const dateStr = new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
                const tags = (featuredPost.tagArray || []).slice(0, 2);
                content += '<section class="featured-card" onclick="window.location.hash=\'#post/' + featuredPost.slug + '\'" style="cursor:pointer">';
                content += '<div class="featured-badge">Featured Post</div>';
                content += '<div class="featured-grid"><div>';
                content += '<div class="featured-meta"><span class="meta-date">' + dateStr + '</span><span class="meta-separator">&bull;</span><span class="meta-reading"><span class="material-symbols-outlined">timer</span> ' + featuredPost.readingTime + ' min read</span>';
                content += tags.map(function (t) { return '<span class="meta-tag">#' + t + '</span>'; }).join('');
                content += '</div>';
                content += '<a href="#post/' + featuredPost.slug + '" style="text-decoration:none"><h2 class="featured-title">' + featuredPost.title + '</h2></a>';
                content += '<p class="featured-excerpt">' + featuredPost.excerpt + '</p>';
                content += '<div class="featured-actions"><a href="#post/' + featuredPost.slug + '" class="btn-read-essay"><span>Read Full Post</span><span class="material-symbols-outlined">arrow_forward</span></a></div>';
                content += '</div><div>';
                content += '<div class="featured-image-wrapper"><img src="' + featuredPost.thumbnail + '" alt="' + featuredPost.title + '" class="featured-image"></div>';

                content += '</div></div></section>';
            }

            const categories = [...new Set(posts.map(p => p.category).filter(Boolean))];
            content += '<div class="section-header"><div class="section-title-group"><span class="section-title">Posts & Inquiries</span><span class="section-count">' + posts.length + ' Total</span></div>';
            content += '<div class="filter-pills" id="filter-container"><button class="filter-pill active" data-category="all" type="button">All</button>';
            content += categories.map(function (c) { return '<button class="filter-pill" data-category="' + c + '" type="button">' + c + '</button>'; }).join('');
            content += '</div></div>';

            if (posts.length > 0) {
                content += '<div class="post-list" id="articles-list">';
                content += posts.map(post => postManager.renderPostListItem(post)).join('');
                content += '</div>';
            } else {
                content += '<div style="text-align:center;padding:4rem 0"><p style="color:var(--on-surface-variant)">No posts yet.</p></div>';
            }

            document.getElementById('main-content').innerHTML = content;

            const filterBtns = document.querySelectorAll('.filter-pill');
            const articleItems = document.querySelectorAll('.post-list-item');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const cat = btn.getAttribute('data-category');
                    articleItems.forEach(item => {
                        item.style.display = (cat === 'all' || item.getAttribute('data-category') === cat) ? '' : 'none';
                    });
                });
            });
        } catch (error) {
            console.error('Error loading home:', error);
            showError('Failed to load blog posts. Please try again later.');
        } finally {
            hideLoading();
        }
    }

    async renderAllPosts() {
        showLoading();
        this.resetToDefaultMetaTags();
        document.title = 'All Posts | ' + SITE_NAME;
        this.setCanonical(SITE_BASE_URL + '/#posts');

        try {
            await postManager.loadAllPosts();
            const posts = postManager.posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            let content = `
                <div class="page-header">
                    <h1>All Posts</h1>
                    <p>${posts.length} article${posts.length !== 1 ? 's' : ''}</p>
                </div>
            `;

            if (posts.length > 0) {
                content += `<div class="post-list">`;
                content += posts.map(post => postManager.renderPostListItem(post)).join('');
                content += `</div>`;
            } else {
                content += `<p style="color:var(--color-text-muted);padding:2rem 0">No posts available yet.</p>`;
            }

            document.getElementById('main-content').innerHTML = content;
        } catch (error) {
            console.error('Error loading posts:', error);
            showError('Failed to load posts.');
        } finally {
            hideLoading();
        }
    }

    async renderPost(params) {
        if (!params.slug) {
            this.render404();
            return;
        }

        showLoading();

        try {
            await postManager.loadAllPosts();
            const post = postManager.getPostBySlug(params.slug);

            if (!post) {
                this.render404();
                return;
            }

            postManager.updateMetaTags(post);
            document.getElementById('main-content').innerHTML = postManager.renderFullPost(post);

            // Apply syntax highlighting and copy buttons to code blocks
            if (typeof hljs !== 'undefined') {
                document.querySelectorAll('.post-content pre code').forEach(block => {
                    hljs.highlightElement(block);
                });
            }
            document.querySelectorAll('.post-content pre').forEach(pre => {
                pre.style.position = 'relative';
                const btn = document.createElement('button');
                btn.className = 'code-copy-btn';
                btn.type = 'button';
                btn.innerHTML = '<span class="material-symbols-outlined">content_copy</span>';
                btn.addEventListener('click', function () {
                    const code = pre.querySelector('code');
                    const text = code ? code.textContent : pre.textContent;
                    navigator.clipboard.writeText(text).then(() => {
                        btn.innerHTML = '<span class="material-symbols-outlined">check</span>';
                        btn.classList.add('copied');
                        setTimeout(() => {
                            btn.innerHTML = '<span class="material-symbols-outlined">content_copy</span>';
                            btn.classList.remove('copied');
                        }, 2000);
                    });
                });
                pre.appendChild(btn);
            });

            // GA4: Track post view
            if (typeof gaTrackEvent === 'function') {
                gaTrackEvent('post_view', {
                    post_title: post.title,
                    post_slug: post.slug,
                    post_category: post.category || '',
                    post_author: post.author
                });
            }
        } catch (error) {
            console.error('Error loading post:', error);
            showError('Failed to load post.');
        } finally {
            hideLoading();
        }
    }

    async renderCategories() {
        showLoading();
        this.resetToDefaultMetaTags();
        document.title = 'Categories | ' + SITE_NAME;
        this.setMetaDescription('Browse articles by topic on ' + SITE_NAME + '. Explore posts on software engineering, system design, and technology.');
        this.setCanonical(SITE_BASE_URL + '/#categories');

        try {
            await postManager.loadAllPosts();
            const categories = postManager.getAllCategories();

            let content = `
                <div class="page-header">
                    <h1>Categories</h1>
                    <p>Browse articles by topic.</p>
                </div>
            `;

            if (categories.length > 0) {
                content += `<div class="categories-grid">`;
                content += categories.map(cat => {
                    const count = postManager.posts.filter(p => p.category === cat).length;
                    return `
                        <button class="category-card" data-category="${cat}">
                            <div class="category-card-name">${cat}</div>
                            <div class="category-card-count">${count} article${count !== 1 ? 's' : ''}</div>
                        </button>
                    `;
                }).join('');
                content += `</div>`;
            } else {
                content += `<p style="color:var(--color-text-muted);padding:2rem 0">No categories yet.</p>`;
            }

            document.getElementById('main-content').innerHTML = content;
        } catch (error) {
            console.error('Error loading categories:', error);
            showError('Failed to load categories.');
        } finally {
            hideLoading();
        }
    }

    async renderTags() {
        showLoading();
        this.resetToDefaultMetaTags();
        document.title = 'Tags | ' + SITE_NAME;
        this.setMetaDescription('Discover articles by tag on ' + SITE_NAME + '. Topics include software engineering, system design, and technology.');
        this.setCanonical(SITE_BASE_URL + '/#tags');

        try {
            await postManager.loadAllPosts();
            const tags = postManager.getAllTags();

            let content = `
                <div class="page-header">
                    <h1>Tags</h1>
                    <p>Discover articles by tag.</p>
                </div>
            `;

            if (tags.length > 0) {
                content += `<div class="tags-cloud">`;
                content += tags.map(tag => {
                    const count = postManager.posts.filter(p => p.tagArray && p.tagArray.includes(tag)).length;
                    return `<button class="tag-pill" data-tag="${tag}">${tag}<span class="tag-pill-count">${count}</span></button>`;
                }).join('');
                content += `</div>`;
            } else {
                content += `<p style="color:var(--color-text-muted);padding:2rem 0">No tags yet.</p>`;
            }

            document.getElementById('main-content').innerHTML = content;
        } catch (error) {
            console.error('Error loading tags:', error);
            showError('Failed to load tags.');
        } finally {
            hideLoading();
        }
    }

    renderSearch(params) {
        const searchTerm = params.query || '';
        const category = params.category || '';
        const tag = params.tag || '';

        // SEO: noindex search results
        this.setRobotsMeta('noindex, follow');

        if (category) {
            document.title = category + ' Articles | ' + SITE_NAME;
            this.setMetaDescription('All articles about ' + category + ' on ' + SITE_NAME + '. Explore posts on competitive programming, math, and science.');
        } else if (tag) {
            document.title = tag + ' Articles | ' + SITE_NAME;
            this.setMetaDescription('All articles tagged ' + tag + ' on ' + SITE_NAME + '.');
        } else if (searchTerm) {
            document.title = 'Search: ' + searchTerm + ' | ' + SITE_NAME;
        }

        if (typeof searchManager !== 'undefined') {
            searchManager.performSearch(searchTerm, { category, tag });
        }
    }

    renderAbout() {
        this.resetToDefaultMetaTags();
        document.title = 'Contact | ' + SITE_NAME;
        this.setMetaDescription('Get in touch with Niaz Bin Siraj. Send a message or connect on social platforms.');
        this.setCanonical(SITE_BASE_URL + '/#contact');

        const content = `
            <div class="contact-page">
                <div class="page-header" style="text-align:center">
                    <h1>Get In Touch</h1>
                    <p class="contact-subtitle">Have a question, feedback, or just want to say hello? Feel free to reach out.</p>
                </div>

                <div class="contact-links">
                    <a href="mailto:niazbinsiraj@gmail.com" class="contact-link-card">
                        <span class="material-symbols-outlined">mail</span>
                        <span class="contact-link-label">Email</span>
                        <span class="contact-link-value">niazbinsiraj@gmail.com</span>
                    </a>
                    <a href="https://www.linkedin.com/in/niazbinsiraj/" target="_blank" rel="noopener" class="contact-link-card">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        <span class="contact-link-label">LinkedIn</span>
                        <span class="contact-link-value">niazbinsiraj</span>
                    </a>
                    <a href="https://github.com/NiazBinSiraj" target="_blank" rel="noopener" class="contact-link-card">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        <span class="contact-link-label">GitHub</span>
                        <span class="contact-link-value">NiazBinSiraj</span>
                    </a>
                    <a href="https://x.com/niazbinsiraj" target="_blank" rel="noopener" class="contact-link-card">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        <span class="contact-link-label">X (Twitter)</span>
                        <span class="contact-link-value">@niazbinsiraj</span>
                    </a>
                </div>

                <div class="contact-form-section">
                    <h2 class="contact-form-title">Send a Message</h2>
                    <form id="contact-form" class="contact-form">
                        <input type="hidden" name="access_key" value="d81a42d5-53ba-4da6-b945-16ba39809440">
                        <input type="hidden" name="from_name" value="Blog Contact Form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="contact-name">Name</label>
                                <input type="text" id="contact-name" name="name" placeholder="Your name" required>
                            </div>
                            <div class="form-group">
                                <label for="contact-email">Email</label>
                                <input type="email" id="contact-email" name="email" placeholder="your@email.com" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="contact-subject">Subject</label>
                            <input type="text" id="contact-subject" name="subject" placeholder="What is this about?">
                        </div>
                        <div class="form-group">
                            <label for="contact-message">Message</label>
                            <textarea id="contact-message" name="message" rows="6" placeholder="Write your message here..." required></textarea>
                        </div>
                        <button type="submit" class="contact-submit-btn">
                            <span class="material-symbols-outlined">send</span>
                            Send Message
                        </button>
                    </form>
                    <div id="contact-success" class="contact-success hidden">
                        <span class="material-symbols-outlined">check_circle</span>
                        <p>Thanks for reaching out! I'll get back to you soon.</p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = content;

        // Form submission handler (Web3Forms)
        const form = document.getElementById('contact-form');
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const btn = form.querySelector('.contact-submit-btn');
            const errorEl = document.getElementById('contact-error');
            if (errorEl) errorEl.classList.add('hidden');
            btn.disabled = true;
            btn.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> Sending...';

            try {
                const formData = new FormData(form);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (result.success) {
                    form.classList.add('hidden');
                    document.getElementById('contact-success').classList.remove('hidden');
                } else {
                    throw new Error(result.message || 'Something went wrong.');
                }
            } catch (err) {
                btn.disabled = false;
                btn.innerHTML = '<span class="material-symbols-outlined">send</span> Send Message';
                let errorDiv = document.getElementById('contact-error');
                if (!errorDiv) {
                    errorDiv = document.createElement('div');
                    errorDiv.id = 'contact-error';
                    errorDiv.className = 'contact-error';
                    form.appendChild(errorDiv);
                }
                errorDiv.textContent = err.message || 'Failed to send. Please try again.';
                errorDiv.classList.remove('hidden');
            }
        });
    }

    render404() {
        this.resetToDefaultMetaTags();
        document.title = 'Page Not Found | ' + SITE_NAME;
        this.setRobotsMeta('noindex, nofollow');

        document.getElementById('main-content').innerHTML = `
            <div class="error-page">
                <div class="error-code">404</div>
                <h1>Page Not Found</h1>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                <p><a href="#home" data-route="home">&larr; Back to Homepage</a></p>
                <div class="error-page-links">
                    <p>Or explore topics:</p>
                    <ul>
                        <li><a href="#" data-route="categories">Categories</a></li>
                        <li><a href="#" data-route="tags">Tags</a></li>
                        <li><a href="#" data-route="posts">All Posts</a></li>
                    </ul>
                </div>
            </div>
        `;
    }
}

const router = new Router();
