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
            <div class="search-results">
                <div class="search-header">
                    <h1>Search Results</h1>
                    <p class="search-count">
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
        
        document.getElementById('main-content').innerHTML = content;
        this.setupSearchResultsListeners();
    }

    renderNoResults(query) {
        return `
            <div class="search-no-results">
                <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <h3>No posts found</h3>
                <p>
                    No posts match your search for "${escapeHTML(query)}". Try different keywords or browse all posts.
                </p>
                <div class="search-actions">
                    <button onclick="router.navigate('posts')" class="btn-primary">
                        Browse All Posts
                    </button>
                    <button onclick="document.getElementById('searchInput').value = ''; router.navigate('home')" class="btn-secondary">
                        Clear Search
                    </button>
                </div>
                
                <div class="search-tips">
                    <h4>Search tips:</h4>
                    <ul>
                        <li>Try using different keywords</li>
                        <li>Check your spelling</li>
                        <li>Use more general terms</li>
                        <li>Browse posts by category or tag</li>
                    </ul>
                </div>
            </div>
        `;
    }

    renderResultsList(results, query) {
        let content = '<div class="search-results-list">';
        
        results.forEach(post => {
            content += this.renderSearchResult(post, query);
        });
        
        content += '</div>';
        return content;
    }

    renderSearchResult(post, query) {
        const highlightedTitle = highlightSearchTerms(post.title, query);
        const highlightedExcerpt = highlightSearchTerms(post.excerpt, query);

        return `
            <article class="search-result-item" data-slug="${post.slug}">
                <h3 class="search-result-title">${highlightedTitle}</h3>
                <p class="search-result-excerpt">${highlightedExcerpt}</p>
                <div class="search-result-meta">
                    <span>${post.formattedDate || ''}</span>
                    ${post.category ? ` · <span>${post.category}</span>` : ''}
                    ${post.readingTime ? ` · <span>${post.readingTime} min read</span>` : ''}
                </div>
            </article>
        `;
    }

    setupSearchResultsListeners() {
        // Click handlers for search results
        document.querySelectorAll('.search-result-item').forEach(result => {
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

    // Perform search and render results (called by router)
    async performSearch(searchTerm, options = {}) {
        try {
            await postManager.loadAllPosts();
            
            if (searchTerm) {
                // Regular search by query
                this.currentQuery = searchTerm;
                this.searchResults = postManager.searchPosts(searchTerm);
                this.setSearchQuery(searchTerm);
            } else if (options.category) {
                // Search by category
                this.currentQuery = options.category;
                this.searchResults = postManager.getPostsByCategory(options.category);
                this.setSearchQuery(options.category);
            } else if (options.tag) {
                // Search by tag
                this.currentQuery = options.tag;
                this.searchResults = postManager.getPostsByTag(options.tag);
                this.setSearchQuery(options.tag);
            }
            
            // Render the results
            this.renderSearchResults();
        } catch (error) {
            console.error('Error performing search:', error);
            showError('An error occurred while searching. Please try again.');
        }
    }
}

// Create global instance
const searchManager = new SearchManager();
