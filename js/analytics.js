/**
 * Google Analytics 4 — Event tracking for SPA blog
 * Measurement ID: G-8JCF8MBEVT
 */

const GA_MEASUREMENT_ID = 'G-8JCF8MBEVT';

// ---- Load gtag.js asynchronously ----
(function () {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());

    // Disable automatic page_view since this is an SPA with hash routing
    gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false
    });
})();

/**
 * Track a virtual page view (called on every SPA route change)
 * @param {string} path  - e.g. "/", "/post/my-slug", "/categories"
 * @param {string} title - current document title
 */
function gaTrackPageView(path, title) {
    if (typeof gtag !== 'function') return;
    gtag('event', 'page_view', {
        page_title: title || document.title,
        page_location: window.location.href,
        page_path: path || window.location.hash || '/'
    });
}

/**
 * Track a custom event
 * @param {string} eventName  - GA4 event name (e.g. "post_view", "search")
 * @param {Object} [params]   - additional event parameters
 */
function gaTrackEvent(eventName, params) {
    if (typeof gtag !== 'function') return;
    gtag('event', eventName, params || {});
}
