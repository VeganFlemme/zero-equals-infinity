// EXPERIMENTS.JS - FIXED & OPTIMIZED
import { animationManager } from './animation-manager.js';
import { getCanvasContext, getThemeColors, isMobile, getFontSize, clamp } from './utils.js';

// Schrödinger's Cat
function initSchrodingerCat() {
    const canvasData = getCanvasContext('schrodingerCanvas');
    if (!canvasData) return;
    
    const { ctx, width, height } = canvasData;
    let state = 'superposition';
    let trials = 0, aliveCount = 0, deadCount = 0;
    let animProgress = 0;
    
    function draw() {
        const colors = getThemeColors();
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const boxSize = isMobile() ? 120 : 180;
        
        if (state === 'superposition') {
            ctx.strokeStyle = colors.primary;
            ctx.lineWidth = 3;
            ctx.strokeRect(centerX - boxSize/2, centerY - boxSize/2, boxSize, boxSize);
            
            ctx.font = `bold ${getFontSize(48)}px sans-serif`;
            ctx.fillStyle = colors.primary + '88';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const offset = Math.sin(animProgress) * 10;
            ctx.fillText('?', centerX - 30 + offset, centerY - 20);
            ctx.fillText('?', centerX + 30 - offset, centerY + 20);
            
            ctx.font = `${getFontSize(16)}px sans-serif`;
            ctx.fillStyle = colors.text;
            ctx.fillText('État: |vivant⟩ + |mort⟩', centerX, height - 60);
            ctx.fillText('(Superposition)', centerX, height - 40);
            
            animProgress += 0.05;
        } else {
            ctx.strokeStyle = colors.primary;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(centerX - boxSize/2, centerY - boxSize/2);
            ctx.lineTo(centerX - boxSize/2 - 30, centerY - boxSize/2 - 30);
            ctx.lineTo(centerX + boxSize/2 - 30, centerY - boxSize/2 - 30);
            ctx.lineTo(centerX + boxSize/2, centerY - boxSize/2);
            ctx.moveTo(centerX - boxSize/2, centerY - boxSize/2);
            ctx.lineTo(centerX - boxSize/2, centerY + boxSize/2);
            ctx.lineTo(centerX + boxSize/2, centerY + boxSize/2);
            ctx.lineTo(centerX + boxSize/2, centerY - boxSize/2);
            ctx.moveTo(centerX - boxSize/2, centerY + boxSize/2);
            ctx.lineTo(centerX + boxSize/2, centerY + boxSize/2);
            ctx.stroke();
            
            ctx.font = `${getFontSize(80)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            if (state === 'alive') {
                ctx.fillText('😺', centerX, centerY);
                ctx.font = `bold ${getFontSize(24)}px sans-serif`;
                ctx.fillStyle = colors.primary;
                ctx.fillText('VIVANT', centerX, centerY + 70);
            } else {
                ctx.fillText('💀', centerX, centerY);
                ctx.font = `bold ${getFontSize(24)}px sans-serif`;
                ctx.fillStyle = colors.danger;
                ctx.fillText('MORT', centerX, centerY + 70);
            }
        }
    }
    
    function updateStats() {
        const stateEl = document.getElementById('catState');
        const trialsEl = document.getElementById('catTrials');
        const aliveEl = document.getElementById('catAlive');
        const deadEl = document.getElementById('catDead');
        
        if (stateEl) stateEl.textContent = 
            state === 'superposition' ? 'Superposition' : 
            state === 'alive' ? 'Vivant (mesuré)' : 'Mort (mesuré)';
        
        if (trialsEl) trialsEl.textContent = `${trials}/100`;
        if (aliveEl) aliveEl.textContent = 
            trials > 0 ? `${((aliveCount/trials)*100).toFixed(1)}%` : '0%';
        if (deadEl) deadEl.textContent = 
            trials > 0 ? `${((deadCount/trials)*100).toFixed(1)}%` : '0%';
    }
    
    const openBtn = document.getElementById('openBox');
    const resetBtn = document.getElementById('resetCat');
    
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            if (state === 'superposition') {
                state = Math.random() > 0.5 ? 'alive' : 'dead';
                trials = clamp(trials + 1, 0, 100);
                if (state === 'alive') aliveCount++;
                else deadCount++;
                updateStats();
                draw();
            }
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            state = 'superposition';
            updateStats();
        });
    }
    
    const cleanup = animationManager.register('schrodingerCat', draw, canvasData.canvas);
    
    return () => {
        cleanup();
    };
}

// Initialize experiments
window.addEventListener('load', () => {
    try {
        initSchrodingerCat();
        console.log('%c✓ Experiments loaded', 'color: #10b981; font-weight: bold;');
    } catch (e) {
        console.error('Experiments init error:', e);
    }
});
