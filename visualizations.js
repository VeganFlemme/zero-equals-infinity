// VISUALIZATIONS.JS - FIXED & OPTIMIZED
import { animationManager } from './animation-manager.js';
import { getCanvasContext, getThemeColors, isMobile, getFontSize } from './utils.js';
import { CONFIG } from './config.js';

// Hero Canvas Animation
function initHeroCanvas() {
    const canvasData = getCanvasContext('heroCanvas');
    if (!canvasData) return;
    
    const { ctx, width, height, canvas } = canvasData;
    const particles = [];
    const particleCount = isMobile() ? CONFIG.ANIMATION.PARTICLE_COUNT_MOBILE : CONFIG.ANIMATION.PARTICLE_COUNT_DESKTOP;
    
    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
    }
    
    return animationManager.register('heroCanvas', animate, canvas, { autoStart: true });
}

// Superposition Visualization
function initSuperposition() {
    const canvasData = getCanvasContext('superpositionCanvas');
    if (!canvasData) return;
    
    const { ctx, width, height } = canvasData;
    let state = 'superposition';
    let animProgress = 0;
    
    function draw() {
        const colors = getThemeColors();
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = isMobile() ? 50 : 80;
        
        if (state === 'superposition') {
            const points = isMobile() ? 15 : 30;
            for (let i = 0; i < points; i++) {
                const angle = (animProgress + i / points) * Math.PI * 2;
                const offset = isMobile() ? 15 : 20;
                const x = centerX + Math.cos(angle) * (radius + Math.sin(Date.now() / 500 + i) * offset);
                const y = centerY + Math.sin(angle) * (radius + Math.cos(Date.now() / 500 + i) * offset);
                
                ctx.beginPath();
                ctx.arc(x, y, isMobile() ? 3 : 5, 0, Math.PI * 2);
                ctx.fillStyle = `${colors.primary}66`;
                ctx.fill();
            }
            
            ctx.font = `bold ${getFontSize(24)}px sans-serif`;
            ctx.fillStyle = colors.text;
            ctx.textAlign = 'center';
            ctx.fillText('|ψ⟩ = α|0⟩ + β|1⟩', centerX, height - (isMobile() ? 30 : 50));
            
            animProgress += 0.01;
        } else {
            const label = state === 'zero' ? '|0⟩' : '|1⟩';
            const color = state === 'zero' ? colors.primary : colors.secondary;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = color + '44';
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
            
            ctx.font = `bold ${getFontSize(48)}px sans-serif`;
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, centerX, centerY);
        }
    }
    
    const measureBtn = document.getElementById('measureBtn');
    const resetBtn = document.getElementById('resetSuperposition');
    const stateSpan = document.getElementById('superpositionState');
    
    if (measureBtn) {
        measureBtn.addEventListener('click', () => {
            state = Math.random() > 0.5 ? 'zero' : 'one';
            if (stateSpan) stateSpan.textContent = `État: ${state === 'zero' ? '0' : '1'}`;
            draw();
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            state = 'superposition';
            if (stateSpan) stateSpan.textContent = 'État: Superposition pure';
        });
    }
    
    const cleanup = animationManager.register('superposition', draw, canvasData.canvas);
    
    return cleanup;
}

// Initialize all
window.addEventListener('load', () => {
    try {
        initHeroCanvas();
        initSuperposition();
        console.log('%c✓ Visualizations loaded', 'color: #10b981; font-weight: bold;');
    } catch (e) {
        console.error('Visualization init error:', e);
    }
});
