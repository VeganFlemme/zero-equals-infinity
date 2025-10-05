// ============================================
// MAIN SCRIPT v3.0 - FIXED
// ============================================

import { CONFIG } from './config.js';
import { 
    debounce, 
    safeLocalStorageGet, 
    safeLocalStorageSet,
    FEATURES,
    isMobile
} from './utils.js';
import { animationManager } from './animation-manager.js';

// ============================================
// THEME TOGGLE
// ============================================

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const currentTheme = safeLocalStorageGet(CONFIG.STORAGE.THEME, 'light');
html.setAttribute('data-theme', currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const theme = html.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        safeLocalStorageSet(CONFIG.STORAGE.THEME, newTheme);
        
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.nav-bar')?.offsetHeight || 0;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

const navbar = document.querySelector('.nav-bar');

if (navbar) {
    const handleScroll = debounce(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    }, CONFIG.DEBOUNCE.SCROLL);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// ============================================
// INTERSECTION OBSERVER
// ============================================

if (FEATURES.intersectionObserver) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.viz-card, .experiment-card, .axiom-compact, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// SCROLL PROGRESS
// ============================================

const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '3px';
    progressBar.style.background = 'var(--accent-gradient)';
    progressBar.style.width = '0%';
    progressBar.style.zIndex = '10000';
    progressBar.style.transition = 'width 0.1s ease';
    
    document.body.appendChild(progressBar);
    
    const updateProgress = debounce(() => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }, 50);
    
    window.addEventListener('scroll', updateProgress, { passive: true });
};

createScrollProgress();

// ============================================
// KONAMI CODE (Original Easter Egg)
// ============================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateQuantumMode();
    }
});

function activateQuantumMode() {
    document.body.style.animation = 'quantumPulse 0.5s ease-in-out 5';
    
    const message = document.createElement('div');
    message.textContent = '∅ = ∞ | QUANTUM MODE v3.0 ACTIVATED';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 2rem 4rem;
        border-radius: 16px;
        font-size: 2rem;
        z-index: 10000;
        animation: fadeInOut 3s ease-in-out;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
    
    if (!document.querySelector('#quantum-animations')) {
        const style = document.createElement('style');
        style.id = 'quantum-animations';
        style.textContent = `
            @keyframes quantumPulse {
                0%, 100% { filter: hue-rotate(0deg); }
                50% { filter: hue-rotate(180deg); }
            }
            @keyframes fadeInOut {
                0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// RANDOM QUOTE
// ============================================

const quantumQuotes = [
    "L'information ne se perd jamais. Elle se transforme infiniment.",
    "Dans le multivers, toutes vos décisions se produisent quelque part.",
    "La conscience est peut-être l'univers s'observant lui-même.",
    "It from bit, every it from bit. - John Wheeler",
    "Le contraire d'une vérité profonde est une autre vérité profonde. - Niels Bohr",
    "Nous sommes de l'information complexifiée qui contemple sa propre complexité.",
    "∅ = ∞ : Le vide contient toutes les possibilités.",
    "L'observateur et l'observé sont inséparables.",
    "La réalité est ce qui persiste quand on cesse d'y croire. - Philip K. Dick",
    "L'univers n'est pas seulement plus étrange que nous le supposons, il est plus étrange que nous pouvons le supposer. - J.B.S. Haldane"
];

function displayRandomQuote() {
    const quote = quantumQuotes[Math.floor(Math.random() * quantumQuotes.length)];
    console.log(`%c${quote}`, 'color: #6366f1; font-size: 16px; font-style: italic;');
}

displayRandomQuote();

// ============================================
// ACCESSIBILITY
// ============================================

const skipLink = document.createElement('a');
skipLink.href = '#experiences';
skipLink.textContent = 'Aller aux expériences';
skipLink.className = 'skip-link';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--accent-primary);
    color: white;
    padding: 8px;
    z-index: 10001;
    transition: top 0.2s;
`;

skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});

skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});

document.body.insertBefore(skipLink, document.body.firstChild);

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c∅ = ∞ v3.0 FIXED', 'color: #6366f1; font-size: 48px; font-weight: bold;');
    console.log('%cExpériences Mentales Interactives', 'color: #8b5cf6; font-size: 16px;');
    console.log('%cOptimized & Bug-Free Edition', 'color: #10b981; font-size: 14px; font-weight: bold;');
    
    // Log feature support
    console.log('%cFeature Support:', 'color: #6c757d; font-weight: bold;');
    console.log('- IntersectionObserver:', FEATURES.intersectionObserver);
    console.log('- Visibility API:', FEATURES.visibilityAPI);
    console.log('- LocalStorage:', FEATURES.localStorage);
    console.log('- WebGL:', FEATURES.webGL);
    console.log('- Web Workers:', FEATURES.webWorkers);
    console.log('- Mobile:', isMobile());
});

console.log('%c✓ Main script loaded', 'color: #10b981; font-weight: bold;');
