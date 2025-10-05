// ============================================
// UTILITY FUNCTIONS
// ============================================

import { CONFIG } from './config.js';

/**
 * Debounce function calls to improve performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between calls
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Safe localStorage wrapper with quota handling
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} Success status
 */
export function safeLocalStorageSet(key, value) {
    if (!FEATURES.localStorage) {
        console.warn('LocalStorage not available');
        return false;
    }
    
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            console.warn('LocalStorage quota exceeded, clearing old data');
            try {
                // Clear old thoughts if quota exceeded
                localStorage.removeItem(CONFIG.STORAGE.THOUGHTS);
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e2) {
                console.error('Failed to save even after clearing:', e2);
                return false;
            }
        }
        console.error('LocalStorage error:', e);
        return false;
    }
}

/**
 * Safe localStorage get
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} Retrieved value or default
 */
export function safeLocalStorageGet(key, defaultValue = null) {
    if (!FEATURES.localStorage) {
        return defaultValue;
    }
    
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return defaultValue;
    }
}

/**
 * Feature detection utilities
 */
export const FEATURES = {
    intersectionObserver: typeof IntersectionObserver !== 'undefined',
    visibilityAPI: typeof document.hidden !== 'undefined',
    requestIdleCallback: typeof requestIdleCallback !== 'undefined',
    localStorage: (function() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    })(),
    webGL: (function() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch(e) {
            return false;
        }
    })(),
    webWorkers: typeof Worker !== 'undefined',
};

/**
 * Get canvas context with error handling and optimization
 * @param {string} canvasId - Canvas element ID
 * @returns {Object|null} Canvas context data or null
 */
export function getCanvasContext(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas ${canvasId} not found`);
        return null;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error(`Failed to get 2D context for ${canvasId}`);
        return null;
    }
    
    // Use cached DPR or limit to MAX_DPR for performance
    const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.CANVAS.MAX_DPR);
    const rect = canvas.getBoundingClientRect();
    
    const maxWidth = isMobile() 
        ? Math.min(rect.width, CONFIG.CANVAS.MOBILE_MAX_WIDTH) 
        : rect.width;
    const maxHeight = isMobile() 
        ? Math.min(rect.height, CONFIG.CANVAS.MOBILE_MAX_HEIGHT) 
        : rect.height;
    
    try {
        canvas.width = maxWidth * dpr;
        canvas.height = maxHeight * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = maxWidth + 'px';
        canvas.style.height = maxHeight + 'px';
    } catch (e) {
        console.error('Canvas resize failed:', e);
        return null;
    }
    
    return { canvas, ctx, width: maxWidth, height: maxHeight };
}

/**
 * Get theme colors based on current theme
 * @returns {Object} Color object
 */
export function getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        bg: isDark ? '#1a1a1a' : '#e9ecef',
        primary: isDark ? '#818cf8' : '#6366f1',
        secondary: isDark ? '#a78bfa' : '#8b5cf6',
        accent: isDark ? '#f472b6' : '#ec4899',
        text: isDark ? '#f0f0f0' : '#1a1a1a',
        textSecondary: isDark ? '#a0a0a0' : '#6c757d',
        danger: isDark ? '#f87171' : '#ef4444',
        success: isDark ? '#4ade80' : '#10b981',
    };
}

/**
 * Mobile detection
 * @returns {boolean} True if mobile device
 */
export function isMobile() {
    return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
}

/**
 * Small mobile detection
 * @returns {boolean} True if small mobile device
 */
export function isSmallMobile() {
    return window.innerWidth <= CONFIG.SMALL_MOBILE_BREAKPOINT;
}

/**
 * Get mobile-optimized font size
 * @param {number} base - Base font size
 * @returns {number} Adjusted font size
 */
export function getFontSize(base) {
    if (isSmallMobile()) return Math.max(base * 0.7, 10);
    if (isMobile()) return Math.max(base * 0.85, 12);
    return base;
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(start, end, t) {
    return start + (end - start) * t;
}

/**
 * Check if reduced motion is preferred
 * @returns {boolean} True if reduced motion preferred
 */
export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Request animation frame with fallback
 * @param {Function} callback - Animation callback
 * @returns {number} Request ID
 */
export function requestAnimFrame(callback) {
    return window.requestAnimationFrame(callback);
}

/**
 * Cancel animation frame
 * @param {number} id - Request ID
 */
export function cancelAnimFrame(id) {
    if (id) {
        window.cancelAnimationFrame(id);
    }
}

/**
 * Show error message to user
 * @param {string} message - Error message
 * @param {HTMLElement} container - Container element
 */
export function showError(message, container) {
    if (!container) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        padding: 1rem;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 8px;
        color: #c00;
        text-align: center;
        margin: 1rem;
    `;
    errorDiv.textContent = message;
    container.appendChild(errorDiv);
}

/**
 * Format time ago
 * @param {Date} date - Date to format
 * @returns {string} Formatted time ago string
 */
export function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
    return `Il y a ${Math.floor(seconds / 86400)}j`;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

console.log('%c✓ Utils loaded', 'color: #10b981; font-weight: bold;');
