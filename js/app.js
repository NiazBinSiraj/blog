/**
 * Main application — Smart header, progress bar, mobile nav, search toggle
 */

class BlogApp {
    constructor() {
        this.initialized = false;
        this.lastScrollY = 0;
        this.scrollTicking = false;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        if (this.initialized) return;

        this.setupSmartHeader();
        this.setupScrollToTop();
        this.setupSearchToggle();
        this.setupMobileNav();
        this.setupAccessibility();
        this.setupErrorHandling();

        this.initialized = true;
    }

    // ---- Scroll to Top ----
    setupScrollToTop() {
        const btn = document.getElementById('scrollToTop');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // GA4: Track scroll to top
            if (typeof gaTrackEvent === 'function') {
                gaTrackEvent('scroll_to_top');
            }
        });
    }

    // ---- Smart Sticky Header ----
    setupSmartHeader() {
        const topBar = document.getElementById('top-bar');
        if (!topBar) return;

        let prevScrollY = 0;
        let headerHidden = false;

        const onScroll = () => {
            const currentY = window.pageYOffset;

            // Shrink after 60px
            if (currentY > 60) {
                topBar.classList.add('shrunk');
            } else {
                topBar.classList.remove('shrunk');
            }

            // Hide on scroll down, show on scroll up
            if (currentY > prevScrollY && currentY > 100) {
                // Scrolling down
                if (!headerHidden) {
                    topBar.classList.add('hidden-bar');
                    headerHidden = true;
                }
            } else {
                // Scrolling up
                if (headerHidden) {
                    topBar.classList.remove('hidden-bar');
                    headerHidden = false;
                }
            }

            prevScrollY = currentY;
            this.scrollTicking = false;
        };

        window.addEventListener('scroll', () => {
            if (!this.scrollTicking) {
                requestAnimationFrame(onScroll);
                this.scrollTicking = true;
            }
        }, { passive: true });
    }

    // ---- Reading Progress Bar ----
    setupProgressBar() {
        // Remove existing progress bar if any
        const existing = document.getElementById('reading-progress');
        if (existing) existing.remove();

        // Only add on post pages (check for .post-content)
        if (!document.querySelector('.post-content')) return;

        const bar = document.createElement('div');
        bar.id = 'reading-progress';
        document.body.prepend(bar);

        const updateProgress = () => {
            const doc = document.documentElement;
            const scrolled = doc.scrollTop || document.body.scrollTop;
            const total = doc.scrollHeight - doc.clientHeight;
            bar.style.width = (total > 0 ? (scrolled / total * 100) : 0) + '%';
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress(); // Initial
    }

    removeProgressBar() {
        const bar = document.getElementById('reading-progress');
        if (bar) bar.remove();
    }

    // ---- Search Toggle ----
    setupSearchToggle() {
        const searchToggleBtn = document.getElementById('searchToggle');
        const searchBar = document.getElementById('search-bar');
        const searchInput = document.getElementById('searchInput');

        if (searchToggleBtn && searchBar) {
            searchToggleBtn.addEventListener('click', () => {
                searchBar.classList.toggle('hidden');
                if (!searchBar.classList.contains('hidden') && searchInput) {
                    searchInput.focus();
                }
            });
        }

        // Ctrl/Cmd + K shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (searchBar) {
                    searchBar.classList.remove('hidden');
                    if (searchInput) searchInput.focus();
                }
            }
        });
    }

    // ---- Mobile Nav ----
    setupMobileNav() {
        const navToggle = document.getElementById('navToggle');
        const mobileNav = document.getElementById('mobile-nav');
        const navOverlay = document.getElementById('nav-overlay');

        if (navToggle && mobileNav) {
            navToggle.addEventListener('click', () => {
                mobileNav.classList.toggle('hidden');
                mobileNav.classList.toggle('visible');
                navOverlay?.classList.toggle('hidden');
                navOverlay?.classList.toggle('visible');
            });
        }

        if (navOverlay) {
            navOverlay.addEventListener('click', () => {
                mobileNav?.classList.add('hidden');
                mobileNav?.classList.remove('visible');
                navOverlay.classList.add('hidden');
                navOverlay.classList.remove('visible');
            });
        }

        // Close nav on link click
        mobileNav?.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.add('hidden');
                mobileNav.classList.remove('visible');
                navOverlay?.classList.add('hidden');
                navOverlay?.classList.remove('visible');
            });
        });
    }

    // ---- Accessibility ----
    setupAccessibility() {
        // Skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only';
        skipLink.style.cssText = 'position:absolute;top:-100px;left:0;z-index:9999;padding:0.5rem 1rem;background:var(--color-accent);color:#fff;';
        skipLink.addEventListener('focus', () => { skipLink.style.top = '0'; });
        skipLink.addEventListener('blur', () => { skipLink.style.top = '-100px'; });
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Keyboard nav indicator
        document.addEventListener('keydown', () => document.body.classList.add('keyboard-nav'));
        document.addEventListener('mousedown', () => document.body.classList.remove('keyboard-nav'));

        // Search input ARIA
        const searchInput = document.getElementById('searchInput');
        if (searchInput && !searchInput.getAttribute('aria-label')) {
            searchInput.setAttribute('aria-label', 'Search blog posts');
        }
    }

    // ---- Error Handling ----
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            event.preventDefault();
        });

        window.addEventListener('offline', () => {
            showToast('You are now offline. Some features may not work.', 'error', 5000);
        });

        window.addEventListener('online', () => {
            showToast('You are back online!', 'success');
        });
    }

    getAppInfo() {
        return {
            version: '2.0.0',
            initialized: this.initialized,
            currentRoute: typeof router !== 'undefined' ? router.currentRoute : null,
            theme: typeof readingPrefs !== 'undefined' ? readingPrefs.getCurrentTheme() : 'light'
        };
    }

    reset() {
        localStorage.clear();
        if (typeof readingPrefs !== 'undefined') {
            readingPrefs.prefs = { ...PREF_DEFAULTS };
            readingPrefs.apply();
            readingPrefs.save();
        }
        if (typeof router !== 'undefined') router.navigate('home');
        showToast('App state reset successfully');
    }
}

// Initialize
const blogApp = new BlogApp();
window.blogApp = blogApp;

window.debugBlog = {
    getAppInfo: () => blogApp.getAppInfo(),
    resetApp: () => blogApp.reset(),
    toggleTheme: () => themeManager && themeManager.toggleTheme(),
    searchPosts: (query) => typeof searchManager !== 'undefined' && searchManager.handleSearch(query),
    navigateTo: (route, params) => typeof router !== 'undefined' && router.navigate(route, params),
    getPosts: () => typeof postManager !== 'undefined' ? postManager.posts : [],
    getCategories: () => typeof postManager !== 'undefined' ? postManager.getAllCategories() : [],
    getTags: () => typeof postManager !== 'undefined' ? postManager.getAllTags() : []
};
