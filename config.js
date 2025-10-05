// ============================================
// CENTRALIZED CONFIGURATION
// ============================================

export const CONFIG = {
    // Breakpoints
    MOBILE_BREAKPOINT: 768,
    SMALL_MOBILE_BREAKPOINT: 480,
    
    // Animation Settings
    ANIMATION: {
        TARGET_FPS: 60,
        PARTICLE_COUNT_DESKTOP: 50,
        PARTICLE_COUNT_MOBILE: 25,
        ROTATION_SPEED: 0.002,
        SLOW_ROTATION_SPEED: 0.005,
        BOUNCE_SPEED: 0.01,
    },
    
    // Canvas Settings
    CANVAS: {
        MAX_DPR: 2, // Limit device pixel ratio for performance
        MOBILE_MAX_WIDTH: 600,
        MOBILE_MAX_HEIGHT: 400,
        DESKTOP_PARTICLE_CONNECTION_DISTANCE: 100,
    },
    
    // LocalStorage Keys
    STORAGE: {
        THEME: 'theme',
        THOUGHTS: 'quantumThoughts',
        TEST_KEY: 'test',
    },
    
    // Debounce Delays (ms)
    DEBOUNCE: {
        SCROLL: 100,
        RESIZE: 250,
        INPUT: 300,
    },
    
    // Thought System
    THOUGHTS: {
        MAX_LENGTH: 280,
        MAX_STORED: 100,
        REDRAW_INTERVAL: 5000,
    },
    
    // Timeline
    TIMELINE: {
        MAX_DEPTH_MOBILE: 3,
        MAX_DEPTH_DESKTOP: 4,
        TREE_SPREAD_DIVISOR: 1,
        Y_OFFSET_MOBILE: 60,
        Y_OFFSET_DESKTOP: 80,
    },
    
    // Easter Eggs
    EASTER_EGGS: {
        CLICK_TIMEOUT: 2000,
        FIBONACCI_TOLERANCE: 1,
        BINARY_SAMPLE_SIZE: 5000,
    },
    
    // Three.js Settings
    THREE: {
        CAMERA_FOV: 75,
        CAMERA_NEAR: 0.1,
        CAMERA_FAR: 1000,
        CAMERA_Z: 50,
        CAMERA_Y: 10,
        NODE_SIZE: 1.5,
        NODE_SEGMENTS: 32,
        LIGHT_INTENSITY_AMBIENT: 0.6,
        LIGHT_INTENSITY_POINT: 0.8,
    },
    
    // Performance
    PERFORMANCE: {
        IDLE_TIMEOUT: 3000, // ms before considering idle
        MAX_ANIMATION_LOOPS: 20,
    }
};

// Feature flags for progressive enhancement
export const FEATURES = {
    ADVANCED_ANIMATIONS: true,
    THREE_D_GRAPHICS: true,
    WEB_WORKERS: true,
};
