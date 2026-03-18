/**
 * Router — handles navigation, URL routing, and page rendering
 * Reader-first design: minimal, clean HTML output
 */

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
            'about': this.renderAbout.bind(this),
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

    resetToDefaultMetaTags() {
        document.title = 'Niaz Bin Siraj - Personal Blog';
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = 'Personal blog by Niaz Bin Siraj - Software Engineer. Sharing insights on web development, technology, and more.';
        }

        const defaultTags = {
            'og:title': 'Niaz Bin Siraj - Personal Blog',
            'og:description': 'Personal blog by Niaz Bin Siraj - Software Engineer.',
            'og:url': 'https://niazbinsiraj.github.io/blog/',
            'og:type': 'website',
            'twitter:title': 'Niaz Bin Siraj - Personal Blog',
            'twitter:description': 'Personal blog by Niaz Bin Siraj - Software Engineer.',
            'twitter:card': 'summary_large_image'
        };

        Object.entries(defaultTags).forEach(([prop, content]) => {
            const tag = document.querySelector(`meta[property="${prop}"]`);
            if (tag) tag.content = content;
        });

        document.querySelectorAll('meta[property^="article:"]').forEach(t => t.remove());

        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.href = 'https://niazbinsiraj.github.io/blog/';
    }

    // =================== ROUTE HANDLERS ===================

    async renderHome() {
        showLoading();
        this.resetToDefaultMetaTags();

        try {
            await postManager.loadAllPosts();
            const posts = postManager.getLatestPosts(20);

            let content = `
                <div class="home-header">
                    <h1>Latest Posts</h1>
                    <p>Thoughts on software engineering, technology, and more.</p>
                </div>
            `;

            if (posts.length > 0) {
                content += `<div class="post-list">`;
                content += posts.map(post => postManager.renderPostListItem(post)).join('');
                content += `</div>`;
            } else {
                content += `
                    <div style="text-align:center;padding:4rem 0">
                        <p style="color:var(--color-text-muted)">No posts yet. Check back soon.</p>
                    </div>
                `;
            }

            document.getElementById('main-content').innerHTML = content;
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
        if (typeof searchManager !== 'undefined') {
            searchManager.performSearch(searchTerm, { category, tag });
        }
    }

    renderAbout() {
        this.resetToDefaultMetaTags();
        document.title = 'About - Niaz Bin Siraj';

        const content = `
            <div class="about-page">
                <div class="page-header">
                    <h1>About</h1>
                </div>

                <div class="about-profile">
                    <img src="static/images/profile.jpg" alt="Niaz Bin Siraj">
                    <div class="about-profile-info">
                        <h2>Niaz Bin Siraj</h2>
                        <div class="about-role">Software Engineer</div>
                        <p>
                            Passionate about building innovative solutions, exploring cutting-edge technologies,
                            and sharing knowledge with the developer community. I believe in the power of
                            technology to transform ideas into reality.
                        </p>
                    </div>
                </div>

                <div class="about-section">
                    <h3>Technical Expertise</h3>
                    <div class="skills-list">
                        ${['Java', 'Spring', 'Hibernate', 'SQL', 'React', 'Kafka', 'Docker', 'AWS'].map(s =>
                            `<span class="skill-badge">${s}</span>`
                        ).join('')}
                    </div>
                </div>

                <div class="about-section">
                    <h3>Connect</h3>
                    <div class="about-links">
                        <a href="mailto:niazbinsiraj@gmail.com">Email</a>
                        <a href="https://linkedin.com/in/niazbinsiraj" target="_blank" rel="noopener">LinkedIn</a>
                        <a href="https://github.com/NiazBinSiraj" target="_blank" rel="noopener">GitHub</a>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = content;
    }

    render404() {
        this.resetToDefaultMetaTags();
        document.title = '404 - Page Not Found';

        document.getElementById('main-content').innerHTML = `
            <div class="error-page">
                <div class="error-code">404</div>
                <h1>Page Not Found</h1>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                <button class="btn-primary" data-route="home">Go Home</button>
            </div>
        `;
    }
}

const router = new Router();
