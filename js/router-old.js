/**
 * Router for handling navigation and URL routing
 */

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.currentParams = {};
        this.init();
    }

    init() {
        // Define routes
        this.defineRoutes();
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });
        
        // Listen for popstate (back/forward buttons)
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.path) {
                this.handleRouteChange(e.state.path);
            }
        });
        
        // Setup navigation listeners
        this.setupNavigationListeners();
        
        // Handle initial route
        this.handleRouteChange();
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
        // Sidebar navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                if (route) {
                    this.navigate(route);
                }
            });
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        if (mobileMenuBtn && sidebar && sidebarOverlay) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            sidebarOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Post card click handlers (will be setup dynamically)
        this.setupDynamicListeners();
    }

    setupDynamicListeners() {
        // This will be called after rendering content with post cards
        document.addEventListener('click', (e) => {
            const postCard = e.target.closest('.post-card');
            if (postCard) {
                const slug = postCard.getAttribute('data-slug');
                if (slug) {
                    this.navigate('post', { slug });
                }
                return;
            }

            // Handle tag clicks
            const tag = e.target.closest('.tag');
            if (tag) {
                e.stopPropagation();
                const tagName = tag.getAttribute('data-tag') || tag.textContent.trim();
                searchManager.searchByTag(tagName);
                return;
            }

            // Handle category clicks
            const categoryLink = e.target.closest('[data-category]');
            if (categoryLink) {
                e.preventDefault();
                const categoryName = categoryLink.getAttribute('data-category');
                searchManager.searchByCategory(categoryName);
                return;
            }
        });
    }

    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        if (sidebar && sidebarOverlay) {
            sidebar.classList.toggle('-translate-x-full');
            sidebarOverlay.classList.toggle('hidden');
        }
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        if (sidebar && sidebarOverlay) {
            sidebar.classList.add('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
        }
    }

    handleRouteChange(customPath = null) {
        const path = customPath || window.location.hash || '#/';
        const { route, params } = this.parseRoute(path);
        
        this.currentRoute = route;
        this.currentParams = params;
        
        // Update active navigation
        this.updateActiveNavigation(route);
        
        // Close mobile menu if open
        this.closeMobileMenu();
        
        // Execute route handler
        if (this.routes[route]) {
            this.routes[route](params);
        } else {
            this.routes['404']();
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
    }

    parseRoute(path) {
        // Remove leading hash and slash
        const cleanPath = path.replace(/^#\/?/, '');
        
        if (!cleanPath) {
            return { route: 'home', params: {} };
        }

        // Split path and query string
        const [routePart, queryPart] = cleanPath.split('?');
        const pathSegments = routePart.split('/').filter(segment => segment);
        
        if (pathSegments.length === 0) {
            return { route: 'home', params: {} };
        }

        const route = pathSegments[0];
        const params = {};

        // Parse path parameters
        if (pathSegments.length > 1) {
            if (route === 'post') {
                params.slug = pathSegments[1];
            }
        }

        // Parse query parameters
        if (queryPart) {
            const urlParams = new URLSearchParams(queryPart);
            for (const [key, value] of urlParams) {
                params[key] = value;
            }
        }

        return { route, params };
    }

    updateActiveNavigation(route) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current route
        const activeLink = document.querySelector(`[data-route="${route}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    navigate(route, params = {}) {
        let path = `#/${route}`;
        
        // Add path parameters
        if (route === 'post' && params.slug) {
            path += `/${params.slug}`;
        }
        
        // Add query parameters
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (key !== 'slug') { // slug is handled as path parameter
                queryParams.append(key, value);
            }
        });
        
        if (queryParams.toString()) {
            path += `?${queryParams.toString()}`;
        }
        
        // Update URL and handle route
        window.location.hash = path;
    }

    // Route handlers
    async renderHome() {
        showLoading();
        
        try {
            await postManager.loadAllPosts();
            const latestPosts = postManager.getLatestPosts(6);
            const categories = postManager.getAllCategories();
            const tags = postManager.getAllTags();
            
            let content = `
                <div class="home-page space-y-16">
                    <!-- Welcome Section -->
                    <section class="text-center space-y-8">
                        <div class="relative">
                            <h1 class="text-4xl md:text-6xl font-bold font-space bg-gradient-to-r from-accent-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                                Welcome to the Future
                            </h1>
                            <p class="text-xl md:text-2xl text-tech-600 dark:text-tech-300 mt-4 max-w-3xl mx-auto leading-relaxed">
                                Hi, I'm <span class="font-semibold text-accent-600 dark:text-accent-400">Niaz Bin Siraj</span>, a Software Engineer passionate about cutting-edge technology, 
                                innovative solutions, and sharing knowledge that shapes tomorrow.
                            </p>
                        </div>
                        
                        <!-- Quick Stats -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <div class="modern-card text-center p-6">
                                <div class="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">${latestPosts.length}</div>
                                <div class="text-tech-600 dark:text-tech-300 font-medium">Latest Articles</div>
                            </div>
                            <div class="modern-card text-center p-6">
                                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">${categories.length}</div>
                                <div class="text-tech-600 dark:text-tech-300 font-medium">Tech Categories</div>
                            </div>
                            <div class="modern-card text-center p-6">
                                <div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">${tags.length}</div>
                                <div class="text-tech-600 dark:text-tech-300 font-medium">Topics Covered</div>
                            </div>
                        </div>
                    </section>
            `;

            if (latestPosts.length > 0) {
                content += `
                    <!-- Latest Posts Section -->
                    <section class="space-y-8">
                        <div class="text-center">
                            <h2 class="text-3xl md:text-4xl font-bold font-space text-tech-800 dark:text-tech-100 mb-4">
                                Latest Insights
                            </h2>
                            <div class="w-24 h-1 bg-gradient-to-r from-accent-500 to-blue-500 mx-auto rounded-full"></div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            ${latestPosts.map(post => postManager.renderPostCard(post)).join('')}
                        </div>
                        
                        <div class="text-center">
                            <button onclick="router.navigate('posts')" class="modern-btn group px-8 py-4 bg-gradient-to-r from-accent-600 to-blue-600 hover:from-accent-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                                <span class="flex items-center gap-2">
                                    Explore All Articles
                                    <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </section>
                `;

                // Featured categories
                if (categories.length > 0) {
                    content += `
                        <!-- Categories Section -->
                        <section class="space-y-8">
                            <div class="text-center">
                                <h2 class="text-3xl md:text-4xl font-bold font-space text-tech-800 dark:text-tech-100 mb-4">
                                    Tech Categories
                                </h2>
                                <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                            </div>
                            
                            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                ${categories.slice(0, 10).map(category => 
                                    `<button onclick="searchManager.searchByCategory('${category}')" class="group p-4 bg-white/60 dark:bg-tech-800/60 backdrop-blur-sm border border-tech-200/50 dark:border-tech-700/50 rounded-xl hover:bg-gradient-to-r hover:from-accent-500/10 hover:to-blue-500/10 transition-all duration-300 hover:scale-105">
                                        <div class="text-center">
                                            <div class="text-2xl mb-2">📁</div>
                                            <div class="font-medium text-tech-700 dark:text-tech-300 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">${category}</div>
                                        </div>
                                    </button>`
                                ).join('')}
                            </div>
                        </section>
                    `;
                }
                }

                // Popular tags
                if (tags.length > 0) {
                    content += `
                        <section>
                            <h2 class="text-2xl font-bold font-merriweather mb-6">Popular Tags</h2>
                            <div class="flex flex-wrap gap-2">
                                ${tags.slice(0, 15).map(tag => 
                                    `<button onclick="searchManager.searchByTag('${tag}')" class="tag">${tag}</button>`
                                ).join('')}
                            </div>
                        </section>
                    `;
                }

                // Popular tags
                if (tags.length > 0) {
                    content += `
                        <!-- Popular Tags Section -->
                        <section class="space-y-8">
                            <div class="text-center">
                                <h2 class="text-3xl md:text-4xl font-bold font-space text-tech-800 dark:text-tech-100 mb-4">
                                    Popular Topics
                                </h2>
                                <div class="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                            </div>
                            
                            <div class="flex flex-wrap justify-center gap-3">
                                ${tags.slice(0, 15).map(tag => 
                                    `<button onclick="searchManager.searchByTag('${tag}')" class="tag">${tag}</button>`
                                ).join('')}
                            </div>
                        </section>
                    `;
                }
            } else {
                content += `
                    <div class="text-center py-16">
                        <div class="relative">
                            <div class="absolute inset-0 bg-gradient-to-r from-accent-500/10 to-blue-500/10 rounded-3xl blur-3xl"></div>
                            <div class="relative z-10 p-12">
                                <svg class="mx-auto h-32 w-32 text-tech-400 dark:text-tech-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                </svg>
                                <h3 class="text-2xl font-bold text-tech-800 dark:text-tech-100 mb-4">No posts yet</h3>
                                <p class="text-lg text-tech-600 dark:text-tech-400">
                                    Posts will appear here once they're added to the blog.
                                </p>
                            </div>
                        </div>
                    </div>
                `;
            }

            content += '</div>';
            document.getElementById('main-content').innerHTML = content;
            
        } catch (error) {
            console.error('Error loading home page:', error);
            showError('Failed to load blog posts. Please try again later.');
        } finally {
            hideLoading();
        }
    }

    async renderAllPosts() {
        showLoading();
        
        try {
            await postManager.loadAllPosts();
            const posts = postManager.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            let content = `
                <div class="posts-page fade-in">
                    <header class="mb-8">
                        <h1 class="text-2xl md:text-3xl font-bold font-merriweather mb-4">All Posts</h1>
                        <p class="text-gray-600 dark:text-gray-400">
                            ${posts.length} post${posts.length !== 1 ? 's' : ''} published
                        </p>
                    </header>
            `;

            if (posts.length > 0) {
                content += `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${posts.map(post => postManager.renderPostCard(post)).join('')}
                    </div>
                `;
            } else {
                content += `
                    <div class="text-center py-12">
                        <svg class="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No posts found</h3>
                        <p class="text-gray-500 dark:text-gray-400">
                            There are no blog posts available at the moment.
                        </p>
                    </div>
                `;
            }

            content += '</div>';
            document.getElementById('content').innerHTML = content;
            
        } catch (error) {
            console.error('Error loading posts page:', error);
            showError('Failed to load blog posts. Please try again later.');
        } finally {
            hideLoading();
        }
    }

    async renderPost(params) {
        if (!params.slug) {
            this.navigate('404');
            return;
        }

        showLoading();
        
        try {
            await postManager.loadAllPosts();
            const post = postManager.getPostBySlug(params.slug);
            
            if (!post) {
                this.navigate('404');
                return;
            }
            
            postManager.renderFullPost(post);
            
        } catch (error) {
            console.error('Error loading post:', error);
            showError('Failed to load the blog post. Please try again later.');
        } finally {
            hideLoading();
        }
    }

    async renderCategories() {
        showLoading();
        
        try {
            await postManager.loadAllPosts();
            const categories = postManager.getAllCategories();
            
            let content = `
                <div class="categories-page fade-in">
                    <header class="mb-8">
                        <h1 class="text-2xl md:text-3xl font-bold font-merriweather mb-4">Categories</h1>
                        <p class="text-gray-600 dark:text-gray-400">
                            Browse posts by category
                        </p>
                    </header>
            `;

            if (categories.length > 0) {
                content += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`;
                
                categories.forEach(category => {
                    const categoryPosts = postManager.getPostsByCategory(category);
                    content += `
                        <div class="category-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" data-category="${category}">
                            <h3 class="text-lg font-bold font-merriweather mb-2">${category}</h3>
                            <p class="text-gray-600 dark:text-gray-400 mb-4">
                                ${categoryPosts.length} post${categoryPosts.length !== 1 ? 's' : ''}
                            </p>
                            <div class="text-teal-600 dark:text-teal-400 font-medium">View posts →</div>
                        </div>
                    `;
                });
                
                content += `</div>`;
            } else {
                content += `
                    <div class="text-center py-12">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No categories found</h3>
                        <p class="text-gray-500 dark:text-gray-400">
                            Categories will appear here once posts are added.
                        </p>
                    </div>
                `;
            }

            content += '</div>';
            document.getElementById('content').innerHTML = content;
            
        } catch (error) {
            console.error('Error loading categories page:', error);
            showError('Failed to load categories. Please try again later.');
        } finally {
            hideLoading();
        }
    }

    async renderTags() {
        showLoading();
        
        try {
            await postManager.loadAllPosts();
            const tags = postManager.getAllTags();
            
            let content = `
                <div class="tags-page fade-in">
                    <header class="mb-8">
                        <h1 class="text-2xl md:text-3xl font-bold font-merriweather mb-4">Tags</h1>
                        <p class="text-gray-600 dark:text-gray-400">
                            Browse posts by tag
                        </p>
                    </header>
            `;

            if (tags.length > 0) {
                content += `
                    <div class="flex flex-wrap gap-3">
                        ${tags.map(tag => {
                            const tagPosts = postManager.getPostsByTag(tag);
                            return `<button onclick="searchManager.searchByTag('${tag}')" class="tag-large bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-400 px-4 py-3 rounded-lg transition-colors">
                                <div class="font-medium">${tag}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">${tagPosts.length} post${tagPosts.length !== 1 ? 's' : ''}</div>
                            </button>`;
                        }).join('')}
                    </div>
                `;
            } else {
                content += `
                    <div class="text-center py-12">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No tags found</h3>
                        <p class="text-gray-500 dark:text-gray-400">
                            Tags will appear here once posts are added.
                        </p>
                    </div>
                `;
            }

            content += '</div>';
            document.getElementById('content').innerHTML = content;
            
        } catch (error) {
            console.error('Error loading tags page:', error);
            showError('Failed to load tags. Please try again later.');
        } finally {
            hideLoading();
        }
    }

    renderSearch(params) {
        if (params.query) {
            searchManager.setSearchQuery(params.query);
            searchManager.renderSearchResults(params.query);
        } else {
            this.navigate('home');
        }
    }

    renderAbout() {
        const content = `
            <div class="about-page fade-in">
                <header class="text-center mb-12">
                    <img src="static/images/profile.jpg" alt="Niaz Bin Siraj" class="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-teal-500">
                    <h1 class="text-3xl md:text-4xl font-bold font-merriweather mb-4">About Me</h1>
                </header>
                
                <div class="max-w-3xl mx-auto prose prose-lg">
                    <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
                        Hello! I'm Niaz Bin Siraj, a passionate Software Engineer with a love for creating 
                        efficient, scalable, and user-friendly applications. Welcome to my personal blog 
                        where I share my thoughts, experiences, and knowledge in the world of technology.
                    </p>
                    
                    <h2 class="text-2xl font-bold font-merriweather mb-4">What I Do</h2>
                    <p class="mb-6">
                        As a software engineer, I work with various technologies to build robust applications. 
                        My expertise spans across web development, with a particular focus on modern JavaScript 
                        frameworks, backend development, and creating seamless user experiences.
                    </p>
                    
                    <h2 class="text-2xl font-bold font-merriweather mb-4">Why I Blog</h2>
                    <p class="mb-6">
                        I believe in sharing knowledge and helping others grow in their tech journey. Through 
                        this blog, I aim to document my learning experiences, share useful tutorials, discuss 
                        industry trends, and connect with fellow developers and tech enthusiasts.
                    </p>
                    
                    <h2 class="text-2xl font-bold font-merriweather mb-4">Topics I Cover</h2>
                    <ul class="list-disc list-inside mb-6 space-y-2">
                        <li>Web Development (HTML, CSS, JavaScript)</li>
                        <li>Frontend Frameworks (React, Vue, Angular)</li>
                        <li>Backend Development (Node.js, Python, APIs)</li>
                        <li>DevOps and Deployment</li>
                        <li>Best Practices and Code Quality</li>
                        <li>Career Advice and Personal Growth</li>
                    </ul>
                    
                    <h2 class="text-2xl font-bold font-merriweather mb-4">Let's Connect</h2>
                    <p class="mb-6">
                        I'm always excited to connect with fellow developers and discuss technology, 
                        projects, or just chat about the latest trends in software development. 
                        Feel free to reach out to me through any of the following platforms:
                    </p>
                    
                    <div class="flex flex-wrap gap-4 justify-center">
                        <a href="mailto:niaz@example.com" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                            </svg>
                            Email
                        </a>
                        <a href="https://github.com/NiazBinSiraj" target="_blank" rel="noopener noreferrer" class="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>
                            </svg>
                            GitHub
                        </a>
                        <a href="https://linkedin.com/in/niazbinsiraj" target="_blank" rel="noopener noreferrer" class="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd"></path>
                            </svg>
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('content').innerHTML = content;
    }

    render404() {
        const content = `
            <div class="error-page text-center py-12 fade-in">
                <div class="max-w-md mx-auto">
                    <h1 class="text-6xl font-bold text-gray-400 dark:text-gray-600 mb-4">404</h1>
                    <h2 class="text-2xl font-bold font-merriweather mb-4">Page Not Found</h2>
                    <p class="text-gray-600 dark:text-gray-400 mb-8">
                        Sorry, the page you are looking for doesn't exist or has been moved.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-3 justify-center">
                        <button onclick="router.navigate('home')" class="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors">
                            Go Home
                        </button>
                        <button onclick="router.navigate('posts')" class="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            Browse Posts
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('content').innerHTML = content;
    }
}

// Create global router instance
const router = new Router();
