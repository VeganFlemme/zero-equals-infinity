// ============================================
// THEME TOGGLE
// ============================================

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add a little animation to the button
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
});

// ============================================
// QUANTUM BACKGROUND ANIMATION
// ============================================

const quantumBg = document.getElementById('quantumBg');

if (quantumBg) {
    // Create particle effect
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(255, 255, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 10}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        quantumBg.appendChild(particle);
    }
}

// ============================================
// SMOOTH SCROLL FOR NAVIGATION LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.nav-bar').offsetHeight;
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
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScroll > 100) {
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

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

// Observe all cards and sections
document.querySelectorAll('.concept-card, .axiom, .practice-card, .warning-item, .method').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============================================
// GLITCH EFFECT ENHANCEMENT
// ============================================

const glitchElement = document.querySelector('.glitch');

if (glitchElement) {
    setInterval(() => {
        if (Math.random() > 0.95) {
            glitchElement.style.textShadow = `
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(255, 0, 0, 0.5),
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(0, 255, 0, 0.5),
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(0, 0, 255, 0.5)
            `;
            
            setTimeout(() => {
                glitchElement.style.textShadow = 'none';
            }, 100);
        }
    }, 100);
}

// ============================================
// EASTER EGG: KONAMI CODE
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
    // Add extreme quantum effects
    document.body.style.animation = 'quantumPulse 0.5s ease-in-out 5';
    
    // Create a temporary message
    const message = document.createElement('div');
    message.textContent = '∅ = ∞ | QUANTUM MODE ACTIVATED';
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.background = 'rgba(0, 0, 0, 0.9)';
    message.style.color = 'white';
    message.style.padding = '2rem 4rem';
    message.style.borderRadius = '16px';
    message.style.fontSize = '2rem';
    message.style.zIndex = '10000';
    message.style.animation = 'fadeInOut 3s ease-in-out';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
    
    // Add CSS animation if not exists
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
// PRACTICE CARD INTERACTIONS
// ============================================

document.querySelectorAll('.practice-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.borderColor = 'var(--accent-primary)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.borderColor = 'var(--border-color)';
    });
});

// ============================================
// COPY TO CLIPBOARD FUNCTIONALITY
// ============================================

// Add copy buttons to code-like sections if needed in the future
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre, code');
    
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.textContent = 'Copy';
        button.className = 'copy-button';
        button.onclick = () => {
            navigator.clipboard.writeText(block.textContent);
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        };
        
        if (block.parentElement) {
            block.parentElement.style.position = 'relative';
            block.parentElement.appendChild(button);
        }
    });
}

// ============================================
// SCROLL PROGRESS INDICATOR
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
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

createScrollProgress();

// ============================================
// RANDOM QUOTE GENERATOR (Optional)
// ============================================

const quantumQuotes = [
    "Avant la première distinction, 0 et 1 sont indiscernables.",
    "Le processus est Dieu. Le déploiement est sacré.",
    "Dans un univers, vous lisez ceci. Dans un autre, vous ne le lisez pas.",
    "L'information ne se perd jamais. Elle se transforme.",
    "La conscience n'est peut-être qu'une boucle étrange suffisamment complexe.",
    "Le libre arbitre est l'interface utilisateur de processus déterministes.",
    "Nous sommes l'univers se contemplant lui-même.",
    "∅ = ∞ : Le vide est plein de possibilités."
];

function displayRandomQuote() {
    const quote = quantumQuotes[Math.floor(Math.random() * quantumQuotes.length)];
    console.log(`%c${quote}`, 'color: #6366f1; font-size: 16px; font-style: italic;');
}

// Display a random quote in console on page load
displayRandomQuote();

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

// Add skip to main content link
const skipLink = document.createElement('a');
skipLink.href = '#axiomes';
skipLink.textContent = 'Skip to main content';
skipLink.className = 'skip-link';
skipLink.style.position = 'absolute';
skipLink.style.top = '-40px';
skipLink.style.left = '0';
skipLink.style.background = 'var(--accent-primary)';
skipLink.style.color = 'white';
skipLink.style.padding = '8px';
skipLink.style.zIndex = '10001';
skipLink.style.transition = 'top 0.2s';

skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});

skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});

document.body.insertBefore(skipLink, document.body.firstChild);

// ============================================
// PERFORMANCE MONITORING
// ============================================

if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log('Page Load Time:', entry.loadEventEnd - entry.fetchStart, 'ms');
            }
        }
    });
    
    perfObserver.observe({ entryTypes: ['navigation'] });
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c∅ = ∞', 'color: #6366f1; font-size: 48px; font-weight: bold;');
    console.log('%cBienvenue dans la Religion Quantique de l\'Information', 'color: #8b5cf6; font-size: 16px;');
    console.log('%cCe site est open source. Fork it, modify it, make it yours.', 'color: #6c757d; font-size: 14px;');
    
    // Add any initialization code here
});
