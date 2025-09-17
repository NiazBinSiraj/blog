/**
 * Main application initialization and setup - Modern Tech Blog
 */

class BlogApp {
    constructor() {
        this.initialized = false;
        this.animationObserver = null;
        this.init();
    }

    init() {
        if (this.initialized) return;

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setup();
            });
        } else {
            this.setup();
        }
    }

    setup() {
        // Initialize modern animations
        this.initModernAnimations();
        
        // Initialize scroll to top functionality
        this.initScrollToTop();
        
        // Setup modern sidebar interactions
        this.setupModernSidebar();
        
        // Setup global error handling
        this.setupErrorHandling();
        
        // Setup PWA features
        this.setupPWA();
        
        // Initialize performance monitoring
        this.initPerformanceMonitoring();
        
        // Setup accessibility features
        this.setupAccessibility();
        
        // Setup modern scroll effects
        this.setupScrollEffects();
        
        // Setup analytics (if needed)
        this.setupAnalytics();
        
        this.initialized = true;
        console.log('Modern blog app initialized successfully');
    }

    initModernAnimations() {
        // Intersection Observer for entrance animations
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all cards and content elements
        document.querySelectorAll('.post-card, .modern-card, .category-badge').forEach(el => {
            this.animationObserver.observe(el);
        });
    }

    setupModernSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar?.classList.toggle('-translate-x-full');
                sidebarOverlay?.classList.toggle('hidden');
                
                // Add ripple effect
                this.addRippleEffect(sidebarToggle);
            });
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                sidebar?.classList.add('-translate-x-full');
                sidebarOverlay.classList.add('hidden');
            });
        }

        // Add hover effects to navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateX(4px)';
            });
            
            link.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateX(0)';
            });
        });
    }

    setupScrollEffects() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // Parallax effect for background elements
            document.querySelectorAll('[class*="animate-float"]').forEach((el, index) => {
                const speed = (index + 1) * 0.1;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }

    addRippleEffect(element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
        ripple.classList.add('ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    initScrollToTop() {
        // Create modern scroll to top button
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.id = 'scrollToTop';
        scrollToTopBtn.className = 'fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-accent-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 opacity-0 translate-y-4 z-50';
        scrollToTopBtn.innerHTML = `
            <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
        `;
        
        document.body.appendChild(scrollToTopBtn);
        
        if (scrollToTopBtn) {
            // Show/hide scroll to top button based on scroll position
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    scrollToTopBtn.classList.remove('opacity-0', 'invisible');
                    scrollToTopBtn.classList.add('opacity-100', 'visible');
                } else {
                    scrollToTopBtn.classList.add('opacity-0', 'invisible');
                    scrollToTopBtn.classList.remove('opacity-100', 'visible');
                }
            });

            // Scroll to top when clicked
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    setupErrorHandling() {
        // Global error handler for unhandled JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            
            // Don't show error toast for network errors or minor issues
            if (event.error && !event.error.toString().includes('Network')) {
                showToast('An unexpected error occurred. Please refresh the page.', 'error');
            }
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            
            // Prevent the default behavior (logging to console)
            event.preventDefault();
            
            showToast('Something went wrong. Please try again.', 'error');
        });

        // Handle network errors
        window.addEventListener('offline', () => {
            showToast('You are now offline. Some features may not work.', 'error', 5000);
        });

        window.addEventListener('online', () => {
            showToast('You are back online!', 'success');
        });
    }

    setupPWA() {
        // Check if service worker is supported
        if ('serviceWorker' in navigator) {
            // Register service worker for caching (optional)
            // navigator.serviceWorker.register('/sw.js');
        }

        // Handle install prompt for PWA
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button or banner (optional)
            this.showInstallPrompt(deferredPrompt);
        });
    }

    showInstallPrompt(deferredPrompt) {
        // Create install banner (optional feature)
        const installBanner = document.createElement('div');
        installBanner.className = 'fixed bottom-4 left-4 right-4 bg-teal-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between';
        installBanner.innerHTML = `
            <div>
                <div class="font-semibold">Install Blog App</div>
                <div class="text-sm opacity-90">Get quick access to the blog</div>
            </div>
            <div class="flex gap-2">
                <button id="installBtn" class="px-4 py-2 bg-white text-teal-600 rounded font-medium">Install</button>
                <button id="dismissBtn" class="px-4 py-2 border border-white rounded text-white">Dismiss</button>
            </div>
        `;
        
        document.body.appendChild(installBanner);
        
        document.getElementById('installBtn').addEventListener('click', async () => {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User ${outcome} the install prompt`);
            document.body.removeChild(installBanner);
        });
        
        document.getElementById('dismissBtn').addEventListener('click', () => {
            document.body.removeChild(installBanner);
        });
        
        // Auto dismiss after 10 seconds
        setTimeout(() => {
            if (document.body.contains(installBanner)) {
                document.body.removeChild(installBanner);
            }
        }, 10000);
    }

    initPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const navigation = performance.getEntriesByType('navigation')[0];
                const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
                
                console.log(`Page load time: ${loadTime}ms`);
                
                // Log performance metrics (optional)
                if (loadTime > 3000) {
                    console.warn('Page load time is slow:', loadTime);
                }
            }
        });

        // Monitor image loading performance
        this.monitorImageLoading();
    }

    monitorImageLoading() {
        // Use Intersection Observer for lazy loading feedback
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Add fade-in effect when image loads
                        img.addEventListener('load', () => {
                            img.classList.add('fade-in');
                        });
                        
                        imageObserver.unobserve(img);
                    }
                });
            });

            // Observe all images with loading="lazy"
            document.addEventListener('DOMContentLoaded', () => {
                document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                    imageObserver.observe(img);
                });
            });
        }
    }

    setupAccessibility() {
        // Add keyboard navigation support
        document.addEventListener('keydown', (e) => {
            // Skip to main content (Alt + S)
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                const mainContent = document.getElementById('content');
                if (mainContent) {
                    mainContent.focus();
                    mainContent.scrollIntoView({ behavior: 'smooth' });
                }
            }

            // Focus search (Ctrl/Cmd + K)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            // Navigate posts with arrow keys (when on post page)
            if (router.currentRoute === 'post') {
                if (e.key === 'ArrowLeft') {
                    const prevLink = document.querySelector('.prev-post');
                    if (prevLink) prevLink.click();
                } else if (e.key === 'ArrowRight') {
                    const nextLink = document.querySelector('.next-post');
                    if (nextLink) nextLink.click();
                }
            }
        });

        // Improve focus visibility
        document.addEventListener('keydown', () => {
            document.body.classList.add('keyboard-navigation');
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Add ARIA labels dynamically
        this.enhanceAccessibility();
    }

    enhanceAccessibility() {
        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-teal-600 text-white px-4 py-2 rounded z-50';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Enhance form labels and descriptions
        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput && !searchInput.getAttribute('aria-label')) {
                searchInput.setAttribute('aria-label', 'Search blog posts');
            }
        });
    }

    setupAnalytics() {
        // Basic analytics setup (replace with actual analytics service)
        // This is a placeholder for analytics tracking
        
        const trackPageView = (route) => {
            console.log(`Page view: ${route}`);
            // Example: gtag('config', 'GA_MEASUREMENT_ID', { page_path: route });
        };

        const trackEvent = (action, category, label) => {
            console.log(`Event: ${action} | ${category} | ${label}`);
            // Example: gtag('event', action, { event_category: category, event_label: label });
        };

        // Track route changes
        window.addEventListener('hashchange', () => {
            if (router.currentRoute) {
                trackPageView(router.currentRoute);
            }
        });

        // Track search usage
        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('input', debounce(() => {
                    if (searchInput.value.length > 2) {
                        trackEvent('search', 'blog', searchInput.value);
                    }
                }, 1000));
            }
        });

        // Track post reading time
        this.trackReadingTime();
    }

    trackReadingTime() {
        let startTime;
        let isReading = false;

        const startReading = () => {
            if (!isReading && router.currentRoute === 'post') {
                startTime = Date.now();
                isReading = true;
            }
        };

        const stopReading = () => {
            if (isReading) {
                const readTime = Date.now() - startTime;
                console.log(`Reading time: ${Math.round(readTime / 1000)}s`);
                isReading = false;
            }
        };

        // Start tracking when user focuses on post content
        document.addEventListener('focus', startReading);
        document.addEventListener('blur', stopReading);
        
        // Track scroll engagement
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            if (router.currentRoute === 'post') {
                const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                maxScroll = Math.max(maxScroll, scrollPercent);
            }
        });

        // Report scroll engagement when leaving page
        window.addEventListener('beforeunload', () => {
            if (router.currentRoute === 'post' && maxScroll > 0) {
                console.log(`Max scroll: ${maxScroll}%`);
            }
        });
    }

    // Utility method to get app info
    getAppInfo() {
        return {
            version: '1.0.0',
            buildDate: '2025-09-01',
            initialized: this.initialized,
            currentRoute: router.currentRoute,
            theme: themeManager ? themeManager.getCurrentTheme() : 'unknown'
        };
    }

    // Method to reset app state (useful for development)
    reset() {
        // Clear localStorage
        localStorage.clear();
        
        // Reset theme
        if (themeManager) {
            themeManager.setTheme('light');
        }
        
        // Clear search
        if (searchManager) {
            searchManager.clearSearch();
        }
        
        // Navigate to home
        router.navigate('home');
        
        showToast('App state reset successfully');
    }
}

// Initialize the app
const blogApp = new BlogApp();

// Make app instance available globally for debugging
window.blogApp = blogApp;

// Add some global utility functions for console debugging
window.debugBlog = {
    getAppInfo: () => blogApp.getAppInfo(),
    resetApp: () => blogApp.reset(),
    toggleTheme: () => themeManager && themeManager.toggleTheme(),
    searchPosts: (query) => searchManager && searchManager.handleSearch(query),
    navigateTo: (route, params) => router.navigate(route, params),
    getPosts: () => postManager.posts,
    getCategories: () => postManager.getAllCategories(),
    getTags: () => postManager.getAllTags()
};
