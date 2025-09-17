/**
 * Modern Router for handling navigation and URL routing - Tech Blog
 */

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.currentParams = {};
        this.init();
    }

    init() {
        console.log('Router initialization started');
        
        // Define routes
        this.defineRoutes();
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            console.log('Hash change detected');
            this.handleRouteChange();
        });
        
        // Listen for popstate (back/forward buttons)
        window.addEventListener('popstate', (e) => {
            console.log('Popstate detected', e.state);
            if (e.state && e.state.path) {
                this.handleRouteChange(e.state.path);
            }
        });
        
        // Setup navigation listeners after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupNavigationListeners();
                this.handleRouteChange();
            });
        } else {
            this.setupNavigationListeners();
            this.handleRouteChange();
        }
        
        console.log('Router initialization completed');
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
        // Sidebar navigation with improved event handling
        document.addEventListener('click', (e) => {
            console.log('Click detected on:', e.target, 'Closest elements:', {
                route: e.target.closest('[data-route]'),
                postCard: e.target.closest('.post-card'),
                tag: e.target.closest('.tag')
            });
            
            // Check if the clicked element or its parent has data-route attribute
            const routeElement = e.target.closest('[data-route]');
            if (routeElement) {
                e.preventDefault();
                const route = routeElement.getAttribute('data-route');
                console.log('Navigating to route:', route);
                this.navigate(route);
                return;
            }
            
            // Post card navigation
            const postCard = e.target.closest('.post-card');
            if (postCard) {
                e.preventDefault();
                const slug = postCard.getAttribute('data-slug');
                console.log('Post card clicked, slug:', slug);
                if (slug) {
                    console.log('Navigating to post:', slug);
                    this.navigate('post', { slug });
                } else {
                    console.error('No slug found on post card');
                }
                return;
            }
            
            // Tag navigation
            const tagElement = e.target.closest('.tag');
            if (tagElement) {
                e.preventDefault();
                const tag = tagElement.getAttribute('data-tag');
                if (tag && window.searchManager) {
                    console.log('Searching by tag:', tag);
                    searchManager.searchByTag(tag);
                }
                return;
            }
        });

        // Mobile sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar?.classList.toggle('-translate-x-full');
                sidebarOverlay?.classList.toggle('hidden');
            });
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                sidebar?.classList.add('-translate-x-full');
                sidebarOverlay?.classList.add('hidden');
            });
        }
    }

    navigate(route, params = {}) {
        this.currentRoute = route;
        this.currentParams = params;
        
        // Update URL
        let url = `#${route}`;
        if (params.slug) {
            url += `/${params.slug}`;
        }
        if (params.category) {
            url += `?category=${encodeURIComponent(params.category)}`;
        }
        if (params.tag) {
            url += `?tag=${encodeURIComponent(params.tag)}`;
        }
        if (params.q) {
            url += `?q=${encodeURIComponent(params.q)}`;
        }
        
        window.location.hash = url;
        
        // Update navigation active states
        this.updateActiveNavigation(route);
        
        // Close mobile sidebar
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        sidebar?.classList.add('-translate-x-full');
        sidebarOverlay?.classList.add('hidden');
    }

    updateActiveNavigation(route) {
        console.log('Updating active navigation for route:', route);
        
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current route
        const activeLink = document.querySelector(`[data-route="${route}"]`);
        if (activeLink) {
            console.log('Found active link for route:', route);
            activeLink.classList.add('active');
        } else {
            console.log('No active link found for route:', route);
        }
    }

    handleRouteChange(path = null) {
        const hash = path || window.location.hash.slice(1);
        console.log('Route change triggered:', { hash, path });
        
        const [route, ...pathParts] = hash.split('/');
        const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
        
        let routeParams = {};
        
        // Extract parameters
        if (pathParts.length > 0) {
            routeParams.slug = pathParts[0];
        }
        
        params.forEach((value, key) => {
            routeParams[key] = decodeURIComponent(value);
        });
        
        // Default to home if no route
        const targetRoute = route || 'home';
        console.log('Target route:', targetRoute, 'Params:', routeParams);
        
        // Execute route handler
        if (this.routes[targetRoute]) {
            this.currentRoute = targetRoute;
            this.currentParams = routeParams;
            this.updateActiveNavigation(targetRoute);
            
            try {
                this.routes[targetRoute](routeParams);
            } catch (error) {
                console.error('Error executing route handler:', error);
                this.render404();
            }
        } else {
            console.log('Route not found:', targetRoute);
            this.routes['404']();
        }
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
                <div class="posts-page space-y-12">
                    <header class="text-center space-y-6">
                        <h1 class="text-4xl md:text-5xl font-bold font-space bg-gradient-to-r from-accent-600 to-blue-600 bg-clip-text text-transparent">
                            All Articles
                        </h1>
                        <p class="text-xl text-tech-600 dark:text-tech-300 max-w-2xl mx-auto">
                            Explore our collection of ${posts.length} articles covering technology, programming, and innovation.
                        </p>
                        <div class="w-24 h-1 bg-gradient-to-r from-accent-500 to-blue-500 mx-auto rounded-full"></div>
                    </header>
            `;

            if (posts.length > 0) {
                content += `
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        ${posts.map(post => postManager.renderPostCard(post)).join('')}
                    </div>
                `;
            } else {
                content += `
                    <div class="text-center py-16">
                        <div class="relative">
                            <div class="absolute inset-0 bg-gradient-to-r from-accent-500/10 to-blue-500/10 rounded-3xl blur-3xl"></div>
                            <div class="relative z-10 p-12">
                                <svg class="mx-auto h-32 w-32 text-tech-400 dark:text-tech-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                </svg>
                                <h3 class="text-2xl font-bold text-tech-800 dark:text-tech-100 mb-4">No posts available</h3>
                                <p class="text-lg text-tech-600 dark:text-tech-400">
                                    Check back later for new content.
                                </p>
                            </div>
                        </div>
                    </div>
                `;
            }

            content += '</div>';
            document.getElementById('main-content').innerHTML = content;
            
        } catch (error) {
            console.error('Error loading posts:', error);
            showError('Failed to load posts. Please try again later.');
        } finally {
            hideLoading();
        }
    }

    async renderPost(params) {
        console.log('renderPost called with params:', params);
        
        if (!params.slug) {
            console.error('No slug provided for post');
            this.render404();
            return;
        }

        showLoading();
        
        try {
            console.log('Loading all posts...');
            await postManager.loadAllPosts();
            console.log('Posts loaded, searching for slug:', params.slug);
            
            const post = postManager.getPostBySlug(params.slug);
            console.log('Found post:', post);
            
            if (!post) {
                console.error('Post not found for slug:', params.slug);
                this.render404();
                return;
            }

            console.log('Rendering full post...');
            const content = postManager.renderFullPost(post);
            console.log('Generated content length:', content.length);
            
            document.getElementById('main-content').innerHTML = content;
            console.log('Post content inserted into DOM');
            
        } catch (error) {
            console.error('Error loading post:', error);
            showError('Failed to load post. Please try again later.');
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
                <div class="categories-page space-y-12">
                    <header class="text-center space-y-6">
                        <h1 class="text-4xl md:text-5xl font-bold font-space bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Categories
                        </h1>
                        <p class="text-xl text-tech-600 dark:text-tech-300 max-w-2xl mx-auto">
                            Browse articles by category to find topics that interest you.
                        </p>
                        <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                    </header>
            `;

            if (categories.length > 0) {
                content += `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        ${categories.map(category => {
                            const postCount = postManager.posts.filter(post => post.category === category).length;
                            return `
                                <button onclick="searchManager.searchByCategory('${category}')" class="group modern-card p-6 text-left hover:scale-105 transition-all duration-300">
                                    <div class="flex items-center justify-between mb-4">
                                        <div class="text-3xl">📁</div>
                                        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">${postCount}</div>
                                    </div>
                                    <h3 class="text-xl font-bold font-space text-tech-800 dark:text-tech-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        ${category}
                                    </h3>
                                    <p class="text-tech-600 dark:text-tech-300">
                                        ${postCount} article${postCount !== 1 ? 's' : ''}
                                    </p>
                                </button>
                            `;
                        }).join('')}
                    </div>
                `;
            } else {
                content += `
                    <div class="text-center py-16">
                        <div class="text-tech-400 dark:text-tech-600 mb-4">
                            <svg class="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-medium text-tech-800 dark:text-tech-100 mb-2">No categories found</h3>
                        <p class="text-tech-600 dark:text-tech-400">
                            Categories will appear here once posts are added.
                        </p>
                    </div>
                `;
            }

            content += '</div>';
            document.getElementById('main-content').innerHTML = content;
            
        } catch (error) {
            console.error('Error loading categories:', error);
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
                <div class="tags-page space-y-12">
                    <header class="text-center space-y-6">
                        <h1 class="text-4xl md:text-5xl font-bold font-space bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Tags
                        </h1>
                        <p class="text-xl text-tech-600 dark:text-tech-300 max-w-2xl mx-auto">
                            Discover articles through tags and topics.
                        </p>
                        <div class="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                    </header>
            `;

            if (tags.length > 0) {
                content += `
                    <div class="flex flex-wrap justify-center gap-4">
                        ${tags.map(tag => {
                            const postCount = postManager.posts.filter(post => 
                                post.tagArray && post.tagArray.includes(tag)
                            ).length;
                            
                            return `
                                <button onclick="searchManager.searchByTag('${tag}')" class="group relative overflow-hidden px-6 py-3 bg-white/60 dark:bg-tech-800/60 backdrop-blur-sm border border-tech-200/50 dark:border-tech-700/50 rounded-full hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-300 hover:scale-105">
                                    <span class="relative z-10 font-medium text-tech-700 dark:text-tech-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">${tag}</span>
                                    <span class="relative z-10 ml-2 text-xs text-tech-500 dark:text-tech-400">${postCount}</span>
                                </button>
                            `;
                        }).join('')}
                    </div>
                `;
            } else {
                content += `
                    <div class="text-center py-16">
                        <div class="text-tech-400 dark:text-tech-600 mb-4">
                            <svg class="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-medium text-tech-800 dark:text-tech-100 mb-2">No tags found</h3>
                        <p class="text-tech-600 dark:text-tech-400">
                            Tags will appear here once posts are added.
                        </p>
                    </div>
                `;
            }

            content += '</div>';
            document.getElementById('main-content').innerHTML = content;
            
        } catch (error) {
            console.error('Error loading tags:', error);
            showError('Failed to load tags. Please try again later.');
        } finally {
            hideLoading();
        }
    }

    renderSearch(params) {
        const searchTerm = params.q || '';
        const category = params.category || '';
        const tag = params.tag || '';
        
        // This will be handled by SearchManager
        searchManager.performSearch(searchTerm, { category, tag });
    }

    renderAbout() {
        const content = `
            <div class="about-page space-y-12">
                <header class="text-center space-y-6">
                    <h1 class="text-4xl md:text-5xl font-bold font-space bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                        About Me
                    </h1>
                    <div class="w-24 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full"></div>
                </header>
                
                <div class="max-w-4xl mx-auto space-y-12">
                    <!-- Profile Section -->
                    <section class="modern-card p-8 md:p-12">
                        <div class="flex flex-col md:flex-row items-center gap-8">
                            <div class="relative">
                                <img src="static/images/profile.jpg" alt="Niaz Bin Siraj" class="w-48 h-48 rounded-2xl object-cover ring-4 ring-accent-500/30 shadow-xl">
                                <div class="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-accent-500 to-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <span class="text-2xl">👨‍💻</span>
                                </div>
                            </div>
                            <div class="flex-1 text-center md:text-left space-y-4">
                                <h2 class="text-3xl md:text-4xl font-bold font-space text-tech-800 dark:text-tech-100">
                                    Niaz Bin Siraj
                                </h2>
                                <p class="text-xl text-accent-600 dark:text-accent-400 font-medium">
                                    Software Engineer & Tech Enthusiast
                                </p>
                                <p class="text-lg text-tech-600 dark:text-tech-300 leading-relaxed">
                                    Passionate about building innovative solutions, exploring cutting-edge technologies, 
                                    and sharing knowledge with the developer community. I believe in the power of 
                                    technology to transform ideas into reality.
                                </p>
                            </div>
                        </div>
                    </section>

                    <!-- Skills Section -->
                    <section class="modern-card p-8">
                        <h3 class="text-2xl font-bold font-space text-tech-800 dark:text-tech-100 mb-6 text-center">
                            Technical Expertise
                        </h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            ${['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'Vue.js', 'Docker', 'AWS'].map(skill => `
                                <div class="text-center p-4 bg-white/60 dark:bg-tech-800/60 backdrop-blur-sm border border-tech-200/50 dark:border-tech-700/50 rounded-xl hover:scale-105 transition-all duration-300">
                                    <div class="font-medium text-tech-700 dark:text-tech-300">${skill}</div>
                                </div>
                            `).join('')}
                        </div>
                    </section>

                    <!-- Contact Section -->
                    <section class="modern-card p-8 text-center">
                        <h3 class="text-2xl font-bold font-space text-tech-800 dark:text-tech-100 mb-6">
                            Let's Connect
                        </h3>
                        <p class="text-lg text-tech-600 dark:text-tech-300 mb-8">
                            I'm always interested in discussing new opportunities, innovative projects, or just having a chat about technology.
                        </p>
                        <div class="flex flex-wrap justify-center gap-4">
                            <a href="mailto:niaz@example.com" class="modern-btn px-6 py-3 bg-gradient-to-r from-accent-600 to-blue-600 hover:from-accent-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                                📧 Email Me
                            </a>
                            <a href="https://linkedin.com/in/niazbinsiraj" target="_blank" class="modern-btn px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                                💼 LinkedIn
                            </a>
                            <a href="https://github.com/niazbinsiraj" target="_blank" class="modern-btn px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                                🐙 GitHub
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        `;
        
        document.getElementById('main-content').innerHTML = content;
    }

    render404() {
        const content = `
            <div class="error-page text-center py-16">
                <div class="relative">
                    <div class="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl blur-3xl"></div>
                    <div class="relative z-10 p-12">
                        <div class="text-8xl md:text-9xl font-bold font-space bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6">
                            404
                        </div>
                        <h1 class="text-3xl md:text-4xl font-bold text-tech-800 dark:text-tech-100 mb-4">
                            Page Not Found
                        </h1>
                        <p class="text-xl text-tech-600 dark:text-tech-300 mb-8 max-w-md mx-auto">
                            The page you're looking for doesn't exist or has been moved.
                        </p>
                        <button onclick="router.navigate('home')" class="modern-btn px-8 py-4 bg-gradient-to-r from-accent-600 to-blue-600 hover:from-accent-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                            🏠 Go Home
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('main-content').innerHTML = content;
    }
}

// Initialize router
const router = new Router();
