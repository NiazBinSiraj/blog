/**
 * Theme management for dark/light mode
 */

class ThemeManager {
    constructor() {
        this.themeKey = 'blog-theme';
        this.init();
    }

    init() {
        // Check system preference first
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Get saved theme or use system preference or default to light
        const savedTheme = storage.get(this.themeKey);
        const defaultTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        
        console.log('Theme initialization:', { savedTheme, systemPrefersDark, defaultTheme });
        
        this.setTheme(defaultTheme);
        
        // Setup theme toggle button
        this.setupThemeToggle();
        
        // Listen for system theme changes
        this.setupSystemThemeListener();
    }

    setTheme(theme) {
        const html = document.documentElement;
        const themeIcon = document.getElementById('themeIcon');
        const themeText = document.getElementById('themeText');

        console.log('Setting theme to:', theme);

        if (theme === 'dark') {
            html.classList.add('dark');
            html.setAttribute('data-theme', 'dark');
            if (themeIcon) themeIcon.textContent = '☀️';
            if (themeText) themeText.textContent = 'Light Mode';
        } else {
            html.classList.remove('dark');
            html.setAttribute('data-theme', 'light');
            if (themeIcon) themeIcon.textContent = '🌙';
            if (themeText) themeText.textContent = 'Dark Mode';
        }

        // Verify the class was applied
        console.log('HTML classes after theme change:', html.className);
        console.log('Dark mode active:', html.classList.contains('dark'));

        // Save theme preference
        storage.set(this.themeKey, theme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
                
                // Add a subtle animation feedback
                themeToggle.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    themeToggle.style.transform = 'scale(1)';
                }, 150);
            });
        }
    }

    setupSystemThemeListener() {
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't set a preference
                const userPreference = localStorage.getItem(this.themeKey);
                if (!userPreference) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }

        const color = theme === 'dark' ? '#1f2937' : '#ffffff';
        metaThemeColor.content = color;
    }

    getCurrentTheme() {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }

    // Get appropriate colors for current theme
    getThemeColors() {
        const isDark = this.getCurrentTheme() === 'dark';
        
        return {
            background: isDark ? '#1f2937' : '#ffffff',
            text: isDark ? '#f9fafb' : '#111827',
            accent: '#0d9488',
            muted: isDark ? '#6b7280' : '#9ca3af'
        };
    }
}

// Initialize theme manager immediately when script loads
let themeManager;

// Early theme initialization to prevent flash
(function() {
    const savedTheme = localStorage.getItem('blog-theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ? JSON.parse(savedTheme) : (systemPrefersDark ? 'dark' : 'light');
    
    console.log('Early theme initialization:', { savedTheme, systemPrefersDark, initialTheme });
    
    if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
});

// Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        if (themeManager) {
            themeManager.toggleTheme();
            showToast('Theme switched!', 'info', 1500);
        }
    }
});
