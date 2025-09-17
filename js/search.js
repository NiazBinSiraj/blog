/**
 * Search functionality for the blog
 */

class SearchManager {
    constructor() {
        this.searchInput = null;
        this.searchBtn = null;
        this.currentQuery = '';
        this.searchResults = [];
        this.init();
    }

    init() {
        this.setupSearchElements();
        this.setupSearchListeners();
    }

    setupSearchElements() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
    }

    setupSearchListeners() {
        if (this.searchInput) {
            // Debounced search on input
            this.searchInput.addEventListener('input', debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));

            // Search on Enter key
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSearch(e.target.value);
                }
            });
        }

        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => {
                if (this.searchInput) {
                    this.handleSearch(this.searchInput.value);
                }
            });
        }
    }

    async handleSearch(query) {
        const trimmedQuery = query.trim();
        
        if (trimmedQuery.length === 0) {
            // If empty search, go back to home
            router.navigate('home');
            return;
        }

        if (trimmedQuery.length < 2) {
            // Don't search for very short queries
            return;
        }

        this.currentQuery = trimmedQuery;
        
        try {
            // Ensure posts are loaded
            await postManager.loadAllPosts();
            
            // Perform search
            this.searchResults = postManager.searchPosts(trimmedQuery);
            
            // Navigate to search results
            router.navigate('search', { query: trimmedQuery });
            
        } catch (error) {
            console.error('Search error:', error);
            showError('An error occurred while searching. Please try again.');
        }
    }

    renderSearchResults(query = this.currentQuery) {
        const results = this.searchResults;
        
        let content = `
            <div class="search-results fade-in">
                <div class="mb-8">
                    <h1 class="text-2xl md:text-3xl font-bold font-merriweather mb-4">
                        Search Results
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400">
                        ${results.length} result${results.length !== 1 ? 's' : ''} found for "${escapeHTML(query)}"
                    </p>
                </div>
        `;

        if (results.length === 0) {
            content += this.renderNoResults(query);
        } else {
            content += this.renderResultsList(results, query);
        }

        content += '</div>';
        
        document.getElementById('content').innerHTML = content;
        this.setupSearchResultsListeners();
    }

    renderNoResults(query) {
        return `
            <div class="text-center py-12">
                <svg class="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No posts found</h3>
                <p class="text-gray-500 dark:text-gray-400 mb-6">
                    No posts match your search for "${escapeHTML(query)}". Try different keywords or browse all posts.
                </p>
                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onclick="router.navigate('posts')" class="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors">
                        Browse All Posts
                    </button>
                    <button onclick="document.getElementById('searchInput').value = ''; router.navigate('home')" class="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        Clear Search
                    </button>
                </div>
                
                <div class="mt-8 text-left">
                    <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3">Search tips:</h4>
                    <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Try using different keywords</li>
                        <li>• Check your spelling</li>
                        <li>• Use more general terms</li>
                        <li>• Browse posts by category or tag</li>
                    </ul>
                </div>
            </div>
        `;
    }

    renderResultsList(results, query) {
        let content = '<div class="space-y-6">';
        
        results.forEach(post => {
            content += this.renderSearchResult(post, query);
        });
        
        content += '</div>';
        return content;
    }

    renderSearchResult(post, query) {
        const highlightedTitle = highlightSearchTerms(post.title, query);
        const highlightedExcerpt = highlightSearchTerms(post.excerpt, query);
        
        const coverImage = post.coverPhoto ? 
            `<img src="${post.coverPhoto}" alt="${post.title}" class="w-20 h-20 object-cover rounded-lg" loading="lazy">` :
            `<div class="w-20 h-20 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span class="text-white text-lg font-bold">${post.title.charAt(0)}</span>
            </div>`;

        const tags = post.tagArray ? post.tagArray
            .filter(tag => tag.toLowerCase().includes(query.toLowerCase()))
            .map(tag => `<span class="tag">${highlightSearchTerms(tag, query)}</span>`)
            .join('') : '';

        return `
            <article class="search-result bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" data-slug="${post.slug}">
                <div class="flex gap-4">
                    ${coverImage}
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-3 mb-2">
                            <span class="reading-time">${post.readingTime} min read</span>
                            <span class="text-sm text-gray-500 dark:text-gray-400">${post.formattedDate}</span>
                        </div>
                        
                        <h3 class="text-lg font-bold font-merriweather mb-2 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                            ${highlightedTitle}
                        </h3>
                        
                        <p class="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                            ${highlightedExcerpt}
                        </p>
                        
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                ${post.category ? `<span class="text-sm text-teal-600 dark:text-teal-400">📂 ${post.category}</span>` : ''}
                                ${tags ? `<div class="flex flex-wrap gap-1">${tags}</div>` : ''}
                            </div>
                            <span class="text-sm text-gray-500 dark:text-gray-400">By ${post.author}</span>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    setupSearchResultsListeners() {
        // Click handlers for search results
        document.querySelectorAll('.search-result').forEach(result => {
            result.addEventListener('click', () => {
                const slug = result.getAttribute('data-slug');
                router.navigate('post', { slug });
            });
        });

        // Tag click handlers
        document.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation();
                const tagName = tag.getAttribute('data-tag') || tag.textContent.trim();
                this.searchByTag(tagName);
            });
        });
    }

    async searchByTag(tagName) {
        try {
            await postManager.loadAllPosts();
            
            // Set search input
            if (this.searchInput) {
                this.searchInput.value = tagName;
            }
            
            // Filter posts by tag
            this.searchResults = postManager.getPostsByTag(tagName);
            this.currentQuery = tagName;
            
            // Update URL and render results
            updateURL(`#/search?query=${encodeURIComponent(tagName)}`);
            this.renderSearchResults(tagName);
            
        } catch (error) {
            console.error('Tag search error:', error);
            showError('An error occurred while searching by tag.');
        }
    }

    async searchByCategory(categoryName) {
        try {
            await postManager.loadAllPosts();
            
            // Set search input
            if (this.searchInput) {
                this.searchInput.value = categoryName;
            }
            
            // Filter posts by category
            this.searchResults = postManager.getPostsByCategory(categoryName);
            this.currentQuery = categoryName;
            
            // Update URL and render results
            updateURL(`#/search?query=${encodeURIComponent(categoryName)}`);
            this.renderSearchResults(categoryName);
            
        } catch (error) {
            console.error('Category search error:', error);
            showError('An error occurred while searching by category.');
        }
    }

    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.currentQuery = '';
        this.searchResults = [];
    }

    // Get the current search query
    getCurrentQuery() {
        return this.currentQuery;
    }

    // Get current search results
    getSearchResults() {
        return this.searchResults;
    }

    // Set search query programmatically
    setSearchQuery(query) {
        if (this.searchInput) {
            this.searchInput.value = query;
        }
        this.currentQuery = query;
    }
}

// Create global instance
const searchManager = new SearchManager();
