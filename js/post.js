/**
 * Modern Post management and rendering with enhanced UI
 */

class PostManager {
    constructor() {
        this.posts = [];
        this.categories = new Set();
        this.tags = new Set();
        this.postsLoaded = false;
        this.viewMode = 'grid'; // grid or list
    }

    async loadAllPosts() {
        if (this.postsLoaded) return this.posts;

        try {
            showLoading();
            
            // First, try to load a posts index file
            const response = await fetch('static/posts/index.json');
            let postSlugs = [];
            
            if (response.ok) {
                const index = await response.json();
                postSlugs = index.posts || [];
            } else {
                // Fallback: try to load common post slugs
                postSlugs = await this.discoverPosts();
            }

            // Load individual posts
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
        // This is a fallback method to discover posts
        // In a real scenario, you might have a posts index or use a build process
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
                if (response.ok) {
                    existingSlugs.push(slug);
                }
            } catch (error) {
                // Post doesn't exist, continue
            }
        }
        
        return existingSlugs;
    }

    async loadPost(slug) {
        try {
            const response = await fetch(`static/posts/${slug}.json`);
            
            if (!response.ok) {
                throw new Error(`Post not found: ${slug}`);
            }
            
            const post = await response.json();
            
            // Validate post structure
            if (!this.validatePost(post)) {
                throw new Error(`Invalid post structure: ${slug}`);
            }
            
            // Process post content
            post.processedContent = replacePhotoPlaceholders(post.contents, post.photos || []);
            post.excerpt = generateExcerpt(post.contents);
            post.readingTime = calculateReadingTime(extractTextFromHTML(post.contents));
            post.formattedDate = formatDate(post.date);
            
            // Process tags
            if (typeof post.tags === 'string') {
                post.tagArray = post.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
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
        const requiredFields = ['slug', 'title', 'author', 'date', 'contents'];
        return requiredFields.every(field => post.hasOwnProperty(field) && post[field]);
    }

    extractCategoriesAndTags() {
        this.categories.clear();
        this.tags.clear();
        
        this.posts.forEach(post => {
            if (post.category) {
                this.categories.add(post.category);
            }
            
            if (post.tagArray) {
                post.tagArray.forEach(tag => this.tags.add(tag));
            }
        });
    }

    getPostBySlug(slug) {
        return this.posts.find(post => post.slug === slug);
    }

    getPostsByCategory(category) {
        return this.posts.filter(post => post.category === category);
    }

    getPostsByTag(tag) {
        return this.posts.filter(post => post.tagArray && post.tagArray.includes(tag));
    }

    getLatestPosts(limit = 5) {
        return this.posts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }

    searchPosts(query) {
        const searchTerm = query.toLowerCase();
        
        return this.posts.filter(post => {
            const titleMatch = post.title.toLowerCase().includes(searchTerm);
            const contentMatch = extractTextFromHTML(post.contents).toLowerCase().includes(searchTerm);
            const tagMatch = post.tagArray && post.tagArray.some(tag => 
                tag.toLowerCase().includes(searchTerm)
            );
            const categoryMatch = post.category && post.category.toLowerCase().includes(searchTerm);
            
            return titleMatch || contentMatch || tagMatch || categoryMatch;
        });
    }

    renderPostCard(post) {
        const baseURL = getBaseURL();
        const coverImage = post.coverPhoto ? 
            `<div class="relative overflow-hidden rounded-t-2xl">
                <img src="${post.coverPhoto}" alt="${post.title}" class="w-full h-48 object-cover transition-transform duration-700 hover:scale-110" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>` :
            `<div class="w-full h-48 bg-gradient-to-br from-accent-500 via-blue-500 to-purple-600 rounded-t-2xl flex items-center justify-center relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-accent-500/80 to-blue-600/80"></div>
                <span class="text-white text-4xl font-bold font-space relative z-10">${post.title.charAt(0)}</span>
                <div class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <div class="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
            </div>`;

        const tags = post.tagArray ? post.tagArray.map(tag => 
            `<span class="tag px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full text-xs font-medium hover:bg-accent-200 dark:hover:bg-accent-800/50 transition-all duration-200 cursor-pointer" data-tag="${tag}">${tag}</span>`
        ).join('') : '';

        return `
            <article class="post-card group cursor-pointer" data-slug="${post.slug}">
                ${coverImage}
                <div class="p-6 space-y-4">
                    <!-- Meta Information -->
                    <div class="flex items-center justify-between text-sm">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center gap-1 text-accent-600 dark:text-accent-400">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                                </svg>
                                <span class="font-medium">${post.readingTime} min read</span>
                            </div>
                            <div class="text-tech-500 dark:text-tech-400">${post.formattedDate}</div>
                        </div>
                        ${post.category ? `<div class="category-badge text-xs">${post.category}</div>` : ''}
                    </div>
                    
                    <!-- Title -->
                    <h3 class="text-xl font-bold font-space text-tech-800 dark:text-tech-100 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-300 leading-tight">
                        ${post.title}
                    </h3>
                    
                    <!-- Excerpt -->
                    <p class="text-tech-600 dark:text-tech-300 line-clamp-3 leading-relaxed">
                        ${post.excerpt}
                    </p>
                    
                    <!-- Tags -->
                    ${tags ? `<div class="flex flex-wrap gap-2">${tags}</div>` : ''}
                    
                    <!-- Footer -->
                    <div class="flex items-center justify-between pt-2 border-t border-tech-200/50 dark:border-tech-700/50">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 bg-gradient-to-br from-accent-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                ${post.author ? post.author.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <span class="text-sm font-medium text-tech-700 dark:text-tech-300">By ${post.author}</span>
                        </div>
                        <div class="flex items-center gap-1 text-accent-600 dark:text-accent-400 group-hover:gap-2 transition-all duration-300">
                            <span class="text-sm font-medium">Read more</span>
                            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    renderFullPost(post) {
        if (!post) {
            showError('Post not found');
            return '<div class="text-center py-16"><h2 class="text-2xl font-bold text-red-600">Post not found</h2></div>';
        }

        const baseURL = getBaseURL();
        const coverImage = post.coverPhoto ? 
            `<div class="relative mb-8">
                <img src="${post.coverPhoto}" alt="${post.title}" class="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
            </div>` : '';

        const tags = post.tagArray ? post.tagArray.map(tag => 
            `<span class="tag px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full text-sm font-medium hover:bg-accent-200 dark:hover:bg-accent-800/50 transition-all duration-200 cursor-pointer" data-tag="${tag}">${tag}</span>`
        ).join('') : '';

        const shareButtons = this.generateSimpleShareButtons(post);
        const navigation = this.generateSimpleNavigation(post);

        const content = `
            <article class="max-w-4xl mx-auto space-y-8">
                ${coverImage}
                
                <header class="space-y-6">
                    <h1 class="text-3xl md:text-5xl font-bold font-space bg-gradient-to-r from-accent-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                        ${post.title}
                    </h1>
                    
                    <div class="flex flex-wrap items-center gap-6 text-tech-600 dark:text-tech-300">
                        <div class="flex items-center gap-2">
                            <div class="w-10 h-10 bg-gradient-to-br from-accent-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                ${post.author ? post.author.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <span class="font-medium">${post.author}</span>
                        </div>
                        
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-accent-600 dark:text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                            </svg>
                            <span>${post.formattedDate}</span>
                        </div>
                        
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-accent-600 dark:text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                            </svg>
                            <span>${post.readingTime} min read</span>
                        </div>
                    </div>
                    
                    ${post.category ? `
                        <div class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold">
                            📂 ${post.category}
                        </div>
                    ` : ''}
                    
                    ${tags ? `<div class="flex flex-wrap gap-3">${tags}</div>` : ''}
                </header>
                
                <div class="modern-card p-8 md:p-12">
                    <div class="post-content prose prose-lg max-w-none prose-headings:font-space prose-headings:text-tech-800 dark:prose-headings:text-tech-100 prose-p:text-tech-700 dark:prose-p:text-tech-300 prose-a:text-accent-600 dark:prose-a:text-accent-400 prose-strong:text-tech-800 dark:prose-strong:text-tech-100">
                        ${post.processedContent || post.contents}
                    </div>
                </div>
                
                <footer class="space-y-8 pt-8 border-t border-tech-200/50 dark:border-tech-700/50">
                    ${shareButtons}
                    ${navigation}
                </footer>
            </article>
        `;

        return content;
    }

    generateShareButtons(post) {
        const currentURL = window.location.href;
        const twitterURL = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentURL)}&text=${encodeURIComponent(post.title)}`;
        const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentURL)}`;
        const linkedinURL = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentURL)}`;

        return `
            <div class="share-buttons mb-8">
                <h3 class="text-lg font-semibold mb-4">Share this post</h3>
                <div class="flex flex-wrap gap-3">
                    <button class="share-btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center" data-platform="twitter" data-url="${twitterURL}">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter
                    </button>
                    
                    <button class="share-btn bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center" data-platform="facebook" data-url="${facebookURL}">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                    </button>
                    
                    <button class="share-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center" data-platform="linkedin" data-url="${linkedinURL}">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                    </button>
                    
                    <button class="share-btn bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center" id="copyLinkBtn">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                        Copy Link
                    </button>
                </div>
            </div>
        `;
    }

    generatePostNavigation(currentPost) {
        const currentIndex = this.posts.findIndex(post => post.slug === currentPost.slug);
        const prevPost = currentIndex > 0 ? this.posts[currentIndex - 1] : null;
        const nextPost = currentIndex < this.posts.length - 1 ? this.posts[currentIndex + 1] : null;

        let navHTML = '<div class="post-navigation flex flex-col md:flex-row justify-between gap-4">';

        if (prevPost) {
            navHTML += `
                <a href="#/post/${prevPost.slug}" class="nav-link prev-post flex-1 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">← Previous</div>
                    <div class="font-semibold">${prevPost.title}</div>
                </a>
            `;
        } else {
            navHTML += '<div class="flex-1"></div>';
        }

        if (nextPost) {
            navHTML += `
                <a href="#/post/${nextPost.slug}" class="nav-link next-post flex-1 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-right">
                    <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Next →</div>
                    <div class="font-semibold">${nextPost.title}</div>
                </a>
            `;
        }

        navHTML += '</div>';
        return navHTML;
    }

    setupShareButtons(post) {
        // Social media share buttons
        document.querySelectorAll('.share-btn[data-platform]').forEach(btn => {
            btn.addEventListener('click', () => {
                const url = btn.getAttribute('data-url');
                window.open(url, '_blank', 'width=600,height=400');
            });
        });

        // Copy link button
        const copyLinkBtn = document.getElementById('copyLinkBtn');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', async () => {
                const success = await copyToClipboard(window.location.href);
                if (success) {
                    showToast('Link copied to clipboard!');
                } else {
                    showToast('Failed to copy link', 'error');
                }
            });
        }
    }

    setupPostNavigation() {
        // Navigation is handled by the router, no additional setup needed
    }

    updateMetaTags(post) {
        // Update page title
        document.title = `${post.title} - Niaz Bin Siraj`;
        
        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = post.excerpt;

        // Clear previous article tags
        this.clearPreviousArticleTags();

        // Update Open Graph tags
        this.updateOpenGraphTags(post);
    }

    clearPreviousArticleTags() {
        // Remove existing article tags to avoid accumulation
        const existingArticleTags = document.querySelectorAll('meta[property^="article:"]');
        existingArticleTags.forEach(tag => tag.remove());
    }

    updateOpenGraphTags(post) {
        const baseURL = window.location.origin + getBaseURL();
        const postURL = `${baseURL}#/post/${post.slug}`;
        // Always use the post's cover photo if available, no fallback to profile.jpg
        const imageURL = post.coverPhoto ? `${baseURL}${post.coverPhoto}` : null;

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

        // Only set image if coverPhoto exists
        if (imageURL) {
            ogTags['og:image'] = imageURL;
            ogTags['og:image:alt'] = post.title;
            ogTags['og:image:width'] = '1200';
            ogTags['og:image:height'] = '630';
            ogTags['twitter:image'] = imageURL;
            ogTags['twitter:image:alt'] = post.title;
        }

        // Add article-specific tags
        ogTags['article:author'] = post.author;
        ogTags['article:published_time'] = new Date(post.date).toISOString();
        if (post.category) {
            ogTags['article:section'] = post.category;
        }
        if (post.tagArray && post.tagArray.length > 0) {
            // Add first few tags
            post.tagArray.slice(0, 5).forEach(tag => {
                const tagMeta = document.createElement('meta');
                tagMeta.setAttribute('property', 'article:tag');
                tagMeta.content = tag;
                document.head.appendChild(tagMeta);
            });
        }

        Object.entries(ogTags).forEach(([property, content]) => {
            let metaTag = document.querySelector(`meta[property="${property}"]`);
            if (!metaTag) {
                metaTag = document.createElement('meta');
                metaTag.setAttribute('property', property);
                document.head.appendChild(metaTag);
            }
            metaTag.content = content;
        });

        // Force social media platforms to refresh by adding timestamp
        const canonicalUrl = document.querySelector('link[rel="canonical"]');
        if (canonicalUrl) {
            canonicalUrl.href = postURL;
        } else {
            const canonical = document.createElement('link');
            canonical.rel = 'canonical';
            canonical.href = postURL;
            document.head.appendChild(canonical);
        }
    }

    getAllCategories() {
        return Array.from(this.categories).sort();
    }

    getAllTags() {
        return Array.from(this.tags).sort();
    }

    generateSimpleShareButtons(post) {
        const currentURL = window.location.href;
        const title = encodeURIComponent(post.title);
        
        return `
            <div class="modern-card p-6">
                <h3 class="text-xl font-bold font-space text-tech-800 dark:text-tech-100 mb-4">Share this post</h3>
                <div class="flex flex-wrap gap-3">
                    <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(currentURL)}&text=${title}" target="_blank" rel="noopener" class="modern-btn px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:scale-105 transition-all duration-300">
                        🐦 Twitter
                    </a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentURL)}" target="_blank" rel="noopener" class="modern-btn px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-800 text-white font-medium hover:scale-105 transition-all duration-300">
                        📘 Facebook
                    </a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentURL)}" target="_blank" rel="noopener" class="modern-btn px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:scale-105 transition-all duration-300">
                        💼 LinkedIn
                    </a>
                    <button onclick="navigator.clipboard.writeText('${currentURL}').then(() => alert('Link copied!'))" class="modern-btn px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium hover:scale-105 transition-all duration-300">
                        🔗 Copy Link
                    </button>
                </div>
            </div>
        `;
    }

    generateSimpleNavigation(post) {
        return `
            <div class="modern-card p-6">
                <div class="flex items-center justify-between">
                    <button onclick="router.navigate('home')" class="modern-btn px-6 py-3 bg-gradient-to-r from-accent-600 to-blue-600 text-white font-semibold hover:scale-105 transition-all duration-300">
                        🏠 Back to Home
                    </button>
                    <button onclick="router.navigate('posts')" class="modern-btn px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:scale-105 transition-all duration-300">
                        📚 All Posts
                    </button>
                </div>
            </div>
        `;
    }
}

// Create global instance
const postManager = new PostManager();
