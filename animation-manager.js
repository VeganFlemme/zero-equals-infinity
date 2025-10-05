// ============================================
// ANIMATION LIFECYCLE MANAGER
// ============================================

import { FEATURES, prefersReducedMotion } from './utils.js';

/**
 * Centralized animation manager
 * Handles animation lifecycle, visibility control, and cleanup
 */
class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.isPageVisible = !document.hidden;
        this.reducedMotion = prefersReducedMotion();
        
        this.setupVisibilityListener();
        this.setupReducedMotionListener();
        
        console.log('%c✓ Animation Manager initialized', 'color: #10b981; font-weight: bold;');
    }
    
    /**
     * Setup page visibility listener
     */
    setupVisibilityListener() {
        if (!FEATURES.visibilityAPI) {
            console.warn('Visibility API not supported');
            return;
        }
        
        document.addEventListener('visibilitychange', () => {
            this.isPageVisible = !document.hidden;
            
            if (this.isPageVisible) {
                this.resumeAll();
            } else {
                this.pauseAll();
            }
        });
    }
    
    /**
     * Setup reduced motion preference listener
     */
    setupReducedMotionListener() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        mediaQuery.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            
            if (this.reducedMotion) {
                console.log('Reduced motion enabled');
                this.pauseAll();
            } else {
                console.log('Reduced motion disabled');
                this.resumeAll();
            }
        });
    }
    
    /**
     * Register an animation
     * @param {string} id - Unique animation ID
     * @param {Function} animateFn - Animation function to call
     * @param {HTMLElement} element - Optional element to observe for visibility
     * @param {Object} options - Additional options
     * @returns {Function} Cleanup function
     */
    register(id, animateFn, element = null, options = {}) {
        if (this.animations.has(id)) {
            console.warn(`Animation ${id} already registered`);
            return this.animations.get(id).cleanup;
        }
        
        const animation = {
            id,
            animateFn,
            element,
            rafId: null,
            isRunning: false,
            isVisible: true,
            options: {
                autoStart: true,
                ...options
            }
        };
        
        // Setup intersection observer if element provided
        if (element && FEATURES.intersectionObserver) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        animation.isVisible = entry.isIntersecting;
                        
                        if (entry.isIntersecting && !animation.isRunning && this.isPageVisible) {
                            this.start(id);
                        } else if (!entry.isIntersecting && animation.isRunning) {
                            this.pause(id);
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: '50px'
                }
            );
            
            observer.observe(element);
            this.observers.set(id, observer);
        }
        
        // Create cleanup function
        const cleanup = () => this.cleanup(id);
        animation.cleanup = cleanup;
        
        this.animations.set(id, animation);
        
        // Auto-start if configured
        if (animation.options.autoStart && !this.reducedMotion) {
            this.start(id);
        }
        
        return cleanup;
    }
    
    /**
     * Start a specific animation
     * @param {string} id - Animation ID
     */
    start(id) {
        const animation = this.animations.get(id);
        if (!animation) {
            console.warn(`Animation ${id} not found`);
            return;
        }
        
        if (animation.isRunning) {
            return;
        }
        
        if (this.reducedMotion) {
            console.log(`Skipping animation ${id} due to reduced motion preference`);
            return;
        }
        
        animation.isRunning = true;
        
        const animate = () => {
            if (!animation.isRunning) {
                return;
            }
            
            try {
                animation.animateFn();
            } catch (e) {
                console.error(`Error in animation ${id}:`, e);
                this.pause(id);
                return;
            }
            
            animation.rafId = requestAnimationFrame(animate);
        };
        
        animation.rafId = requestAnimationFrame(animate);
    }
    
    /**
     * Pause a specific animation
     * @param {string} id - Animation ID
     */
    pause(id) {
        const animation = this.animations.get(id);
        if (!animation) {
            return;
        }
        
        if (animation.rafId) {
            cancelAnimationFrame(animation.rafId);
            animation.rafId = null;
        }
        
        animation.isRunning = false;
    }
    
    /**
     * Resume a specific animation
     * @param {string} id - Animation ID
     */
    resume(id) {
        const animation = this.animations.get(id);
        if (!animation) {
            return;
        }
        
        if (!animation.isRunning && animation.isVisible && this.isPageVisible) {
            this.start(id);
        }
    }
    
    /**
     * Pause all animations
     */
    pauseAll() {
        this.animations.forEach((animation, id) => {
            this.pause(id);
        });
    }
    
    /**
     * Resume all animations
     */
    resumeAll() {
        if (this.reducedMotion) {
            return;
        }
        
        this.animations.forEach((animation, id) => {
            if (animation.isVisible) {
                this.resume(id);
            }
        });
    }
    
    /**
     * Cleanup a specific animation
     * @param {string} id - Animation ID
     */
    cleanup(id) {
        const animation = this.animations.get(id);
        if (!animation) {
            return;
        }
        
        // Cancel animation frame
        this.pause(id);
        
        // Disconnect observer
        const observer = this.observers.get(id);
        if (observer) {
            observer.disconnect();
            this.observers.delete(id);
        }
        
        // Remove from registry
        this.animations.delete(id);
        
        console.log(`Animation ${id} cleaned up`);
    }
    
    /**
     * Cleanup all animations
     */
    cleanupAll() {
        console.log('Cleaning up all animations...');
        
        this.animations.forEach((animation, id) => {
            this.cleanup(id);
        });
        
        this.animations.clear();
        this.observers.clear();
    }
    
    /**
     * Get animation status
     * @param {string} id - Animation ID
     * @returns {Object|null} Animation status
     */
    getStatus(id) {
        const animation = this.animations.get(id);
        if (!animation) {
            return null;
        }
        
        return {
            id: animation.id,
            isRunning: animation.isRunning,
            isVisible: animation.isVisible,
        };
    }
    
    /**
     * Get all animations status
     * @returns {Array} Array of animation statuses
     */
    getAllStatus() {
        const statuses = [];
        this.animations.forEach((animation, id) => {
            statuses.push(this.getStatus(id));
        });
        return statuses;
    }
}

// Create singleton instance
export const animationManager = new AnimationManager();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    animationManager.cleanupAll();
});

// Pause on page blur (mobile support)
window.addEventListener('blur', () => {
    animationManager.pauseAll();
});

// Resume on page focus (mobile support)
window.addEventListener('focus', () => {
    if (!document.hidden) {
        animationManager.resumeAll();
    }
});

// Export for debugging
window.__animationManager = animationManager;
