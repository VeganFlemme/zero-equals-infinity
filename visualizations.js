// ============================================
// HERO CANVAS ANIMATION
// ============================================

function initHeroCanvas() {
    const canvasData = getCanvasContext('heroCanvas');
    if (!canvasData) return;
    
    const { ctx, width, height } = canvasData;
    const particles = [];
    const particleCount = isMobile() ? 25 : 50;
    
    class Particle {
        constructor() {
            this.reset();
        }
        
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
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        if (!isMobile()) {
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ============================================
// SUPERPOSITION VISUALIZATION
// ============================================

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
            requestAnimationFrame(draw);
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
    
    draw();
    
    document.getElementById('measureBtn').addEventListener('click', () => {
        state = Math.random() > 0.5 ? 'zero' : 'one';
        document.getElementById('superpositionState').textContent = `État: ${state === 'zero' ? '0' : '1'}`;
        draw();
    });
    
    document.getElementById('resetSuperposition').addEventListener('click', () => {
        state = 'superposition';
        document.getElementById('superpositionState').textContent = 'État: Superposition pure';
        draw();
    });
}

// ============================================
// MULTIVERSE BRANCHING
// ============================================

function initMultiverse() {
    const canvasData = getCanvasContext('multiverseCanvas');
    if (!canvasData) return;
    
    const { ctx, width, height } = canvasData;
    
    class TreeNode {
        constructor(x, y, level) {
            this.x = x;
            this.y = y;
            this.level = level;
            this.children = [];
        }
        
        split() {
            if (this.level >= (isMobile() ? 3 : 4)) return;
            
            const spread = isMobile() ? 60 / (this.level + 1) : 100 / (this.level + 1);
            const yOffset = isMobile() ? 60 : 80;
            
            this.children.push(new TreeNode(this.x - spread, this.y + yOffset, this.level + 1));
            this.children.push(new TreeNode(this.x + spread, this.y + yOffset, this.level + 1));
        }
        
        draw(ctx, colors) {
            this.children.forEach(child => {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(child.x, child.y);
                ctx.strokeStyle = colors.primary + '88';
                ctx.lineWidth = isMobile() ? 1.5 : 2;
                ctx.stroke();
                
                child.draw(ctx, colors);
            });
            
            ctx.beginPath();
            const nodeSize = isMobile() ? 4 : 6;
            ctx.arc(this.x, this.y, nodeSize, 0, Math.PI * 2);
            ctx.fillStyle = this.children.length > 0 ? colors.secondary : colors.primary;
            ctx.fill();
        }
    }
    
    let root = new TreeNode(width / 2, isMobile() ? 40 : 50, 0);
    let universeCount = 1;
    
    function drawTree() {
        const colors = getThemeColors();
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, width, height);
        
        root.draw(ctx, colors);
    }
    
    function countUniverses(node) {
        if (node.children.length === 0) return 1;
        return node.children.reduce((sum, child) => sum + countUniverses(child), 0);
    }
    
    function getAllLeaves(node) {
        if (node.children.length === 0) return [node];
        return node.children.flatMap(child => getAllLeaves(child));
    }
    
    document.getElementById('addChoice').addEventListener('click', () => {
        const leaves = getAllLeaves(root);
        leaves.forEach(leaf => leaf.split());
        universeCount = countUniverses(root);
        document.getElementById('universeCount').textContent = `Univers: ${universeCount}`;
        drawTree();
    });
    
    document.getElementById('resetMultiverse').addEventListener('click', () => {
        root = new TreeNode(width / 2, isMobile() ? 40 : 50, 0);
        universeCount = 1;
        document.getElementById('universeCount').textContent = 'Univers: 1';
        drawTree();
    });
    
    drawTree();
}

// ============================================
// ENTROPY VISUALIZATION
// ============================================

function initEntropy() {
    const canvasData = getCanvasContext('entropyCanvas');
    if (!canvasData) return;
    
    const { ctx, width, height } = canvasData;
    const slider = document.getElementById('probSlider');
    const probValue = document.getElementById('probValue');
    const entropyValue = document.getElementById('entropyValue');
    
    function calculateEntropy(p) {
        if (p === 0 || p === 1) return 0;
        return -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
    }
    
    function draw() {
        const colors = getThemeColors();
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, width, height);
        
        const p = parseFloat(slider.value) / 100;
        const entropy = calculateEntropy(p);
        
        const barWidth = isMobile() ? 80 : 150;
        const barX = width / 2 - barWidth - (isMobile() ? 10 : 20);
        const maxHeight = height - (isMobile() ? 80 : 100);
        
        // p(0) bar
        ctx.fillStyle = colors.primary + 'AA';
        const barY = height - (isMobile() ? 40 : 50) - p * maxHeight;
        ctx.fillRect(barX, barY, barWidth, p * maxHeight);
        ctx.fillStyle = colors.text;
        ctx.font = `${getFontSize(14)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('p(0)', barX + barWidth / 2, height - (isMobile() ? 25 : 30));
        
        // p(1) bar
        ctx.fillStyle = colors.secondary + 'AA';
        const bar2X = barX + barWidth + (isMobile() ? 20 : 40);
        const bar2Y = height - (isMobile() ? 40 : 50) - (1-p) * maxHeight;
        ctx.fillRect(bar2X, bar2Y, barWidth, (1-p) * maxHeight);
        ctx.fillStyle = colors.text;
        ctx.fillText('p(1)', bar2X + barWidth / 2, height - (isMobile() ? 25 : 30));
        
        probValue.textContent = p.toFixed(2);
        entropyValue.textContent = `Entropie: ${entropy.toFixed(3)} bits`;
    }
    
    slider.addEventListener('input', draw);
    draw();
}

// ============================================
// PARADOX OUROBOROS
// ============================================

function initParadox() {
    const canvasData = getCanvasContext('paradoxCanvas');
    if (!canvasData) return;
    
    const { ctx, width, height } = canvasData;
    let rotation = 0;
    
    function draw() {
        ctx.fillStyle = 'rgba(26, 26, 26, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = isMobile() ? 100 : 150;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        
        const points = isMobile() ? 18 : 36;
        for (let i = 0; i < 360; i += 360 / points) {
            const angle = (i * Math.PI) / 180;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const size = (isMobile() ? 6 : 8) + Math.sin(rotation * 5 + angle) * (isMobile() ? 2 : 3);
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, '#818cf8');
            gradient.addColorStop(1, '#a78bfa');
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        
        ctx.restore();
        
        rotation += 0.005;
        requestAnimationFrame(draw);
    }
    
    draw();
}

// ============================================
// INITIALIZE ALL
// ============================================

window.addEventListener('load', () => {
    initHeroCanvas();
    initSuperposition();
    initMultiverse();
    initEntropy();
    initParadox();
    
    console.log('%cVisualizations v2.0 loaded!', 'color: #10b981; font-weight: bold;');
});
