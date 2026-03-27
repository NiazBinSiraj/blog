/**
 * Reading Preferences Engine
 * Self-contained IIFE that builds the preferences panel,
 * wires all controls, and persists to localStorage.
 */

// Defaults
const PREF_DEFAULTS = {
    theme: 'light',
    customBg: '#ffffff',
    customText: '#1a1a1a',
    fontFamily: 'system',
    customFont: '',
    fontSize: 18,
    fontWeight: 400,
    contentWidth: 680,
    lineHeight: 1.75,
    wordSpacing: 0,
    letterSpacing: 0,
    paragraphSpacing: 1.25,
    textAlign: 'left'
};

const PREF_KEY = 'blog_reading_prefs';

// Theme definitions
const THEME_COLORS = {
    light:  { bg: '#ffffff', text: '#1a1a1a', muted: '#6b6b6b', border: '#e5e5e5', surface: '#f7f7f7' },
    dark:   { bg: '#0f0f0f', text: '#e8e8e8', muted: '#999999', border: '#2a2a2a', surface: '#1a1a1a' },
    sepia:  { bg: '#f4efe6', text: '#3b2f1e', muted: '#7a6b5a', border: '#d9d0c3', surface: '#ebe4d8' }
};

const FONT_FAMILIES = {
    system:   'system-ui, -apple-system, sans-serif',
    serif:    "Georgia, 'Times New Roman', serif",
    humanist: "'Literata', 'Charter', serif",
    mono:     "'iA Writer Mono', 'Courier New', monospace"
};

class ReadingPreferences {
    constructor() {
        this.prefs = this.load();
        this.panel = null;
        this.overlay = null;
        this.isOpen = false;
        this.init();
    }

    load() {
        try {
            const saved = JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
            return { ...PREF_DEFAULTS, ...saved };
        } catch (e) {
            return { ...PREF_DEFAULTS };
        }
    }

    save() {
        try {
            localStorage.setItem(PREF_KEY, JSON.stringify(this.prefs));
        } catch (e) {}
    }

    init() {
        // Apply preferences immediately (backup for head loader)
        this.apply();

        // Build panel once DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.buildPanel());
        } else {
            this.buildPanel();
        }
    }

    apply() {
        const r = document.documentElement.style;
        const p = this.prefs;

        // Theme colors
        if (p.theme === 'custom') {
            r.setProperty('--color-bg', p.customBg);
            r.setProperty('--color-text', p.customText);
            r.setProperty('--color-text-muted', '#6b6b6b');
            r.setProperty('--color-border', '#e5e5e5');
            r.setProperty('--color-surface', '#f7f7f7');
        } else {
            const colors = THEME_COLORS[p.theme] || THEME_COLORS.light;
            r.setProperty('--color-bg', colors.bg);
            r.setProperty('--color-text', colors.text);
            r.setProperty('--color-text-muted', colors.muted);
            r.setProperty('--color-border', colors.border);
            r.setProperty('--color-surface', colors.surface);
        }

        // Font family
        const fontValue = p.fontFamily === 'custom' 
            ? (p.customFont || FONT_FAMILIES.system) 
            : (FONT_FAMILIES[p.fontFamily] || FONT_FAMILIES.system);
        r.setProperty('--font-body', fontValue);

        // Other properties
        r.setProperty('--font-size-base', p.fontSize + 'px');
        r.setProperty('--font-weight-body', p.fontWeight);
        r.setProperty('--content-width', p.contentWidth + 'px');
        r.setProperty('--line-height-body', p.lineHeight);
        r.setProperty('--word-spacing-body', p.wordSpacing + 'px');
        r.setProperty('--letter-spacing-body', p.letterSpacing + 'px');
        r.setProperty('--paragraph-spacing', p.paragraphSpacing + 'em');
        r.setProperty('--text-align-body', p.textAlign);

        document.documentElement.setAttribute('data-theme', p.theme === 'custom' ? 'custom' : p.theme);
    }

    buildPanel() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'prefs-overlay';
        document.body.appendChild(this.overlay);

        // Create panel
        this.panel = document.createElement('div');
        this.panel.id = 'prefs-panel';
        this.panel.innerHTML = this.getPanelHTML();
        document.body.appendChild(this.panel);

        // Wire toggle button
        const toggleBtn = document.getElementById('prefsToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }

        // Wire close button
        this.panel.querySelector('.prefs-close').addEventListener('click', () => this.close());

        // Wire overlay click
        this.overlay.addEventListener('click', () => this.close());

        // Wire Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });

        // Wire all controls
        this.wireThemeToggles();
        this.wireFontSelector();
        this.wireSliders();
        this.wireWeightSelector();
        this.wireAlignmentSelector();
        this.wireResetButton();
    }

    getPanelHTML() {
        const p = this.prefs;
        return `
            <div class="prefs-header">
                <h2>Reading Preferences</h2>
                <button class="prefs-close" aria-label="Close preferences">&times;</button>
            </div>
            <div class="prefs-body">
                <!-- Theme -->
                <div class="pref-group">
                    <div class="pref-label">Theme</div>
                    <div class="theme-toggles">
                        <button class="theme-toggle-btn${p.theme==='light' ? ' active' : ''}" data-theme="light">
                            <div class="theme-swatch" style="background:#fff"></div>
                            Light
                        </button>
                        <button class="theme-toggle-btn${p.theme==='dark' ? ' active' : ''}" data-theme="dark">
                            <div class="theme-swatch" style="background:#0f0f0f"></div>
                            Dark
                        </button>
                        <button class="theme-toggle-btn${p.theme==='sepia' ? ' active' : ''}" data-theme="sepia">
                            <div class="theme-swatch" style="background:#f4efe6"></div>
                            Sepia
                        </button>
                        <button class="theme-toggle-btn${p.theme==='custom' ? ' active' : ''}" data-theme="custom">
                            <div class="theme-swatch" style="background:linear-gradient(135deg,${p.customBg},${p.customText})"></div>
                            Custom
                        </button>
                    </div>
                    <div class="custom-colors" id="customColors" style="display:${p.theme==='custom' ? 'flex' : 'none'}">
                        <div class="color-picker-group">
                            <label>Bg</label>
                            <input type="color" id="customBgPicker" value="${p.customBg}">
                        </div>
                        <div class="color-picker-group">
                            <label>Text</label>
                            <input type="color" id="customTextPicker" value="${p.customText}">
                        </div>
                    </div>
                </div>

                <!-- Font Family -->
                <div class="pref-group">
                    <div class="pref-label">Font Family</div>
                    <div class="font-selector">
                        <button class="font-option${p.fontFamily==='system' ? ' active' : ''}" data-font="system" style="font-family:system-ui,sans-serif">System</button>
                        <button class="font-option${p.fontFamily==='serif' ? ' active' : ''}" data-font="serif" style="font-family:Georgia,serif">Serif</button>
                        <button class="font-option${p.fontFamily==='humanist' ? ' active' : ''}" data-font="humanist" style="font-family:'Literata',serif">Humanist</button>
                        <button class="font-option${p.fontFamily==='mono' ? ' active' : ''}" data-font="mono" style="font-family:'Courier New',monospace">Mono</button>
                        <button class="font-option full-width${p.fontFamily==='custom' ? ' active' : ''}" data-font="custom">Custom…</button>
                    </div>
                    <input type="text" class="custom-font-input" id="customFontInput" value="${p.customFont}" placeholder="e.g. 'Roboto', sans-serif" style="display:${p.fontFamily==='custom' ? 'block' : 'none'}">
                </div>

                <!-- Font Size -->
                <div class="pref-group">
                    <div class="pref-label">Font Size <span class="pref-value" id="fontSizeVal">${p.fontSize}px</span></div>
                    <input type="range" class="pref-slider" id="fontSizeSlider" min="14" max="26" step="1" value="${p.fontSize}">
                </div>

                <!-- Font Weight -->
                <div class="pref-group">
                    <div class="pref-label">Font Weight</div>
                    <div class="segmented-control">
                        <button class="segment-btn${p.fontWeight===300 ? ' active' : ''}" data-weight="300">Light</button>
                        <button class="segment-btn${p.fontWeight===400 ? ' active' : ''}" data-weight="400">Regular</button>
                        <button class="segment-btn${p.fontWeight===500 ? ' active' : ''}" data-weight="500">Medium</button>
                        <button class="segment-btn${p.fontWeight===600 ? ' active' : ''}" data-weight="600">Semi</button>
                    </div>
                </div>

                <!-- Content Width -->
                <div class="pref-group">
                    <div class="pref-label">Content Width <span class="pref-value" id="contentWidthVal">${p.contentWidth}px</span></div>
                    <input type="range" class="pref-slider" id="contentWidthSlider" min="480" max="900" step="10" value="${p.contentWidth}">
                </div>

                <!-- Line Height -->
                <div class="pref-group">
                    <div class="pref-label">Line Height <span class="pref-value" id="lineHeightVal">${p.lineHeight}</span></div>
                    <input type="range" class="pref-slider" id="lineHeightSlider" min="1.3" max="2.2" step="0.1" value="${p.lineHeight}">
                </div>

                <!-- Word Spacing -->
                <div class="pref-group">
                    <div class="pref-label">Word Spacing <span class="pref-value" id="wordSpacingVal">${p.wordSpacing}px</span></div>
                    <input type="range" class="pref-slider" id="wordSpacingSlider" min="-2" max="6" step="1" value="${p.wordSpacing}">
                </div>

                <!-- Letter Spacing -->
                <div class="pref-group">
                    <div class="pref-label">Letter Spacing <span class="pref-value" id="letterSpacingVal">${p.letterSpacing}px</span></div>
                    <input type="range" class="pref-slider" id="letterSpacingSlider" min="-1" max="4" step="0.5" value="${p.letterSpacing}">
                </div>

                <!-- Paragraph Spacing -->
                <div class="pref-group">
                    <div class="pref-label">Paragraph Spacing <span class="pref-value" id="paraSpacingVal">${p.paragraphSpacing}em</span></div>
                    <input type="range" class="pref-slider" id="paraSpacingSlider" min="0.5" max="2.5" step="0.25" value="${p.paragraphSpacing}">
                </div>

                <!-- Text Alignment -->
                <div class="pref-group">
                    <div class="pref-label">Text Alignment</div>
                    <div class="segmented-control">
                        <button class="segment-btn align-btn${p.textAlign==='left' ? ' active' : ''}" data-align="left">Left</button>
                        <button class="segment-btn align-btn${p.textAlign==='center' ? ' active' : ''}" data-align="center">Center</button>
                        <button class="segment-btn align-btn${p.textAlign==='right' ? ' active' : ''}" data-align="right">Right</button>
                        <button class="segment-btn align-btn${p.textAlign==='justify' ? ' active' : ''}" data-align="justify">Justify</button>
                    </div>
                </div>

                <!-- Reset -->
                <button class="prefs-reset" id="prefsReset">Reset to Defaults</button>
            </div>
        `;
    }

    wireThemeToggles() {
        this.panel.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.panel.querySelectorAll('.theme-toggle-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.prefs.theme = btn.dataset.theme;

                const customColors = document.getElementById('customColors');
                customColors.style.display = this.prefs.theme === 'custom' ? 'flex' : 'none';

                this.apply();
                this.save();

                // GA4: Track theme change
                if (typeof gaTrackEvent === 'function') {
                    gaTrackEvent('theme_change', { theme_name: this.prefs.theme });
                }
            });
        });

        // Custom color pickers
        const bgPicker = document.getElementById('customBgPicker');
        const textPicker = document.getElementById('customTextPicker');

        if (bgPicker) {
            bgPicker.addEventListener('input', (e) => {
                this.prefs.customBg = e.target.value;
                if (this.prefs.theme === 'custom') this.apply();
                this.save();
            });
        }

        if (textPicker) {
            textPicker.addEventListener('input', (e) => {
                this.prefs.customText = e.target.value;
                if (this.prefs.theme === 'custom') this.apply();
                this.save();
            });
        }
    }

    wireFontSelector() {
        this.panel.querySelectorAll('.font-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.panel.querySelectorAll('.font-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.prefs.fontFamily = btn.dataset.font;

                const customInput = document.getElementById('customFontInput');
                customInput.style.display = this.prefs.fontFamily === 'custom' ? 'block' : 'none';

                this.apply();
                this.save();

                // GA4: Track font change
                if (typeof gaTrackEvent === 'function') {
                    gaTrackEvent('font_change', { font_family: this.prefs.fontFamily });
                }
            });
        });

        const customFontInput = document.getElementById('customFontInput');
        if (customFontInput) {
            customFontInput.addEventListener('input', (e) => {
                this.prefs.customFont = e.target.value;
                if (this.prefs.fontFamily === 'custom') this.apply();
                this.save();
            });
        }
    }

    wireSliders() {
        const sliders = [
            { id: 'fontSizeSlider',     pref: 'fontSize',         valId: 'fontSizeVal',     unit: 'px',  prop: '--font-size-base', unitSuffix: 'px' },
            { id: 'contentWidthSlider', pref: 'contentWidth',     valId: 'contentWidthVal', unit: 'px',  prop: '--content-width',  unitSuffix: 'px' },
            { id: 'lineHeightSlider',   pref: 'lineHeight',       valId: 'lineHeightVal',   unit: '',    prop: '--line-height-body', unitSuffix: '' },
            { id: 'wordSpacingSlider',  pref: 'wordSpacing',      valId: 'wordSpacingVal',  unit: 'px',  prop: '--word-spacing-body', unitSuffix: 'px' },
            { id: 'letterSpacingSlider',pref: 'letterSpacing',    valId: 'letterSpacingVal',unit: 'px',  prop: '--letter-spacing-body', unitSuffix: 'px' },
            { id: 'paraSpacingSlider',  pref: 'paragraphSpacing', valId: 'paraSpacingVal',  unit: 'em',  prop: '--paragraph-spacing', unitSuffix: 'em' }
        ];

        sliders.forEach(s => {
            const slider = document.getElementById(s.id);
            const valLabel = document.getElementById(s.valId);

            if (slider) {
                slider.addEventListener('input', (e) => {
                    const val = parseFloat(e.target.value);
                    this.prefs[s.pref] = val;
                    if (valLabel) valLabel.textContent = val + s.unit;
                    document.documentElement.style.setProperty(s.prop, val + s.unitSuffix);
                    this.save();
                });
            }
        });
    }

    wireWeightSelector() {
        this.panel.querySelectorAll('.segment-btn:not(.align-btn)').forEach(btn => {
            btn.addEventListener('click', () => {
                this.panel.querySelectorAll('.segment-btn:not(.align-btn)').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.prefs.fontWeight = parseInt(btn.dataset.weight);
                this.apply();
                this.save();
            });
        });
    }

    wireAlignmentSelector() {
        this.panel.querySelectorAll('.align-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.panel.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.prefs.textAlign = btn.dataset.align;
                this.apply();
                this.save();
            });
        });
    }

    wireResetButton() {
        const resetBtn = document.getElementById('prefsReset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.prefs = { ...PREF_DEFAULTS };
                this.save();
                this.apply();
                // Re-render panel content
                this.panel.innerHTML = this.getPanelHTML();
                // Re-wire everything
                this.panel.querySelector('.prefs-close').addEventListener('click', () => this.close());
                this.wireThemeToggles();
                this.wireFontSelector();
                this.wireSliders();
                this.wireWeightSelector();
                this.wireAlignmentSelector();
                this.wireResetButton();
            });
        }
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.panel.classList.add('visible');
        this.overlay.classList.add('visible');
    }

    close() {
        this.isOpen = false;
        this.panel.classList.remove('visible');
        this.overlay.classList.remove('visible');
    }

    getCurrentTheme() {
        return this.prefs.theme;
    }
}

// Initialize
let readingPrefs;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        readingPrefs = new ReadingPreferences();
    });
} else {
    readingPrefs = new ReadingPreferences();
}

// Keep backward compatibility
let themeManager = {
    getCurrentTheme() { return readingPrefs ? readingPrefs.getCurrentTheme() : 'light'; },
    toggleTheme() {
        if (!readingPrefs) return;
        const themes = ['light', 'dark', 'sepia'];
        const idx = themes.indexOf(readingPrefs.prefs.theme);
        readingPrefs.prefs.theme = themes[(idx + 1) % themes.length];
        readingPrefs.apply();
        readingPrefs.save();
    },
    setTheme(t) {
        if (!readingPrefs) return;
        readingPrefs.prefs.theme = t;
        readingPrefs.apply();
        readingPrefs.save();
    }
};
