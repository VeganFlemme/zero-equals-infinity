// ============================================
// CANVAS UTILITIES
// ============================================

function getCanvasContext(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    
    // High DPI support
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    return { canvas, ctx, width: rect.width, height: rect.height };
}

function getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        bg: isDark ? '#1a1a1a' : '#e9ecef',
        primary: isDark ? '#818cf8' : '#6366f1',
        secondary: isDark ? '#a78bfa' : '#8b5cf6',
        text: isDark ? '#f0f0f0' : '#1a1a1a',
        textSecondary: isDark ? '#a0a0a0' : '#6c757d'
    };
}

// ============================================
// HERO CANVAS ANIMATION
// ============================================

function initHeroCanvas() {
    const canvasData = getCanvasContext('heroCanvas');
    if (!canvasData) return;
    
    const { ctx, width, height } = canvasData;
    const particles = [];
    
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
    
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
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
    let state = 'superposition'; // 'superposition', 'zero', 'one'
    let animProgress = 0;
    
    function draw() {
        const colors = getThemeColors();
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = 80;
        
        if (state === 'superposition') {
            // Draw fuzzy superposition
            for (let i = 0; i < 30; i++) {
                const angle = (animProgress + i / 30) * Math.PI * 2;
                const x = centerX + Math.cos(angle) * (radius + Math.sin(Date.now() / 500 + i) * 20);
                const y = centerY + Math.sin(angle) * (radius + Math.cos(Date.now() / 500 + i) * 20);
                
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fillStyle = `${colors.primary}66`;
                ctx.fill();
            }
            
            // Label
            ctx.font = 'bold 24px sans-serif';
            ctx.fillStyle = colors.text;
            ctx.textAlign = 'center';
            ctx.fillText('|ψ⟩ = α|0⟩ + β|1⟩', centerX, height - 50);
            
            animProgress += 0.01;
            requestAnimationFrame(draw);
        } else {
            // Draw collapsed state
            const label = state === 'zero' ? '|0⟩' : '|1⟩';
            const color = state === 'zero' ? colors.primary : colors.secondary;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = color + '44';
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
            
            ctx.font = 'bold 48px sans-serif';
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, centerX, centerY);
            
            ctx.font = 'bold 20px sans-serif';
            ctx.fillStyle = colors.text;
            ctx.textBaseline = 'alphabetic';
            ctx.fillText('État mesuré : ' + (state === 'zero' ? '0' : '1'), centerX, height - 50);
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
            if (this.level >= 4) return;
            
            const spread = 100 / (this.level + 1);
            const yOffset = 80;
            
            this.children.push(new TreeNode(this.x - spread, this.y + yOffset, this.level + 1));
            this.children.push(new TreeNode(this.x + spread, this.y + yOffset, this.level + 1));
        }
        
        draw(ctx, colors) {
            // Draw connections to children
            this.children.forEach(child => {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(child.x, child.y);
                ctx.strokeStyle = colors.primary + '88';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                child.draw(ctx, colors);
            });
            
            // Draw node
            ctx.beginPath();
            ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = this.children.length > 0 ? colors.secondary : colors.primary;
            ctx.fill();
        }
    }
    
    let root = new TreeNode(width / 2, 50, 0);
    let universeCount = 1;
    
    function drawTree() {
        const colors = getThemeColors();
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, width, height);
        
        root.draw(ctx, colors);
        
        ctx.font = '14px sans-serif';
        ctx.fillStyle = colors.text;
        ctx.textAlign = 'center';
        ctx.fillText('Choix quantique = Bifurcation réelle', width / 2, height - 20);
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
        root = new TreeNode(width / 2, 50, 0);
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
        
        // Draw bars
        const barWidth = 150;
        const barX = width / 2 - barWidth - 20;
        const maxHeight = height - 100;
        
        // p(0) bar
        ctx.fillStyle = colors.primary + 'AA';
        ctx.fillRect(barX, height - 50 - p * maxHeight, barWidth, p * maxHeight);
        ctx.fillStyle = colors.text;
        ctx.textAlign = 'center';
        ctx.fillText('p(0)', barX + barWidth / 2, height - 30);
        ctx.fillText(p.toFixed(2), barX + barWidth / 2, height - 60 - p * maxHeight);
        
        // p(1) bar
        ctx.fillStyle = colors.secondary + 'AA';
        ctx.fillRect(barX + barWidth + 40, height - 50 - (1-p) * maxHeight, barWidth, (1-p) * maxHeight);
        ctx.fillStyle = colors.text;
        ctx.fillText('p(1)', barX + barWidth + 40 + barWidth / 2, height - 30);
        ctx.fillText((1-p).toFixed(2), barX + barWidth + 40 + barWidth / 2, height - 60 - (1-p) * maxHeight);
        
        // Entropy curve
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
            const x = (i / 100) * (width - 100) + 50;
            const p_i = i / 100;
            const h = calculateEntropy(p_i);
            const y = height - 50 - (h * maxHeight);
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = colors.textSecondary;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Mark current point
        const currentX = p * (width - 100) + 50;
        const currentY = height - 50 - (entropy * maxHeight);
        ctx.beginPath();
        ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        
        probValue.textContent = p.toFixed(2);
        entropyValue.textContent = `Entropie: ${entropy.toFixed(3)} bits`;
    }
    
    slider.addEventListener('input', draw);
    draw();
}

// ============================================
// CONSCIOUSNESS EMERGENCE
// ============================================

function initConsciousness() {
    const canvasData = getCanvasContext('consciousnessCanvas');
    if (!canvasData) return;
    
    const { ctx, width, height } = canvasData;
    const slider = document.getElementById('complexitySlider');
    const complexityValue = document.getElementById('complexityValue');
    const consciousnessLevel = document.getElementById('consciousnessLevel');
    
    function draw() {
        const colors = getThemeColors();
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, width, height);
        
        const complexity = parseInt(slider.value);
        const nodeCount = complexity * 10;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Draw network
        const nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2;
            const radius = 50 + complexity * 15;
            nodes.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius
            });
        }
        
        // Draw connections (more connections = higher complexity)
        ctx.strokeStyle = colors.primary + '33';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < nodeCount; i++) {
            for (let j = i + 1; j < nodeCount; j++) {
                if (Math.random() < complexity / 20) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }
        
        // Draw nodes
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = colors.secondary;
            ctx.fill();
        });
        
        // Central glow (consciousness)
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100 + complexity * 20);
        gradient.addColorStop(0, colors.primary + Math.min(complexity * 15, 100).toString(16));
        gradient.addColorStop(1, colors.primary + '00');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        complexityValue.textContent = complexity;
        
        let levelText = '';
        if (complexity < 3) levelText = 'Niveau: Minimal (pierre?)';
        else if (complexity < 5) levelText = 'Niveau: Élémentaire (bactérie?)';
        else if (complexity < 7) levelText = 'Niveau: Émergent (insecte?)';
        else if (complexity < 9) levelText = 'Niveau: Développé (mammifère?)';
        else levelText = 'Niveau: Complexe (humain?)';
        
        consciousnessLevel.textContent = levelText;
    }
    
    slider.addEventListener('input', draw);
    draw();
}

// ============================================
// DETERMINISM NETWORK
// ============================================

function initDeterminism() {
    const canvasData = getCanvasContext('determinismCanvas');
    if (!canvasData) return;
    
    const { ctx, width, height } = canvasData;
    let depth = 0;
    
    class CausalNode {
        constructor(x, y, level, label) {
            this.x = x;
            this.y = y;
            this.level = level;
            this.label = label;
            this.causes = [];
        }
        
        addCauses() {
            if (this.level >= 4) return;
            
            const count = Math.floor(Math.random() * 2) + 2;
            const spread = 120;
            const yOffset = -80;
            
            for (let i = 0; i < count; i++) {
                const x = this.x + (i - (count - 1) / 2) * spread / count;
                const labels = ['Génétique', 'Environnement', 'Histoire', 'État neural', 'Culture', 'Hasard quantique'];
                const cause = new CausalNode(x, this.y + yOffset, this.level + 1, labels[Math.floor(Math.random() * labels.length)]);
                this.causes.push(cause);
            }
        }
        
        draw(ctx, colors, maxDepth) {
            // Draw connections
            this.causes.forEach(cause => {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(cause.x, cause.y);
                ctx.strokeStyle = colors.primary + '66';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                if (cause.level <= maxDepth) {
                    cause.draw(ctx, colors, maxDepth);
                }
            });
            
            // Draw node
            ctx.beginPath();
            ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = this.level === 0 ? colors.secondary : colors.primary;
            ctx.fill();
            
            // Label
            ctx.font = '11px sans-serif';
            ctx.fillStyle = colors.text;
            ctx.textAlign = 'center';
            ctx.fillText(this.label, this.x, this.y + 25);
        }
    }
    
    let root = new CausalNode(width / 2, height - 50, 0, 'Votre "Choix"');
    
    function redraw() {
        const colors = getThemeColors();
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, width, height);
        
        root.draw(ctx, colors, depth);
        
        ctx.font = '13px sans-serif';
        ctx.fillStyle = colors.text;
        ctx.textAlign = 'center';
        ctx.fillText('Chaque choix a des causes. Mais qui choisit les causes ?', width / 2, 25);
    }
    
    function expandTree(node) {
        if (node.causes.length === 0) {
            node.addCauses();
        }
        node.causes.forEach(cause => expandTree(cause));
    }
    
    document.getElementById('traceBack').addEventListener('click', () => {
        if (depth < 4) {
            expandTree(root);
            depth++;
            document.getElementById('causalDepth').textContent = `Profondeur causale: ${depth}`;
            redraw();
        }
    });
    
    document.getElementById('resetDeterminism').addEventListener('click', () => {
        root = new CausalNode(width / 2, height - 50, 0, 'Votre "Choix"');
        depth = 0;
        document.getElementById('causalDepth').textContent = 'Profondeur causale: 0';
        redraw();
    });
    
    redraw();
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
        const radius = 150;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        
        // Draw Ouroboros (snake eating its tail)
        for (let i = 0; i < 360; i += 10) {
            const angle = (i * Math.PI) / 180;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const size = 8 + Math.sin(rotation * 5 + angle) * 3;
            
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
// QUANTUM SIMULATOR
// ============================================

function initSimulator() {
    const canvas = document.getElementById('simulatorCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let isRunning = false;
    let animationId;
    let time = 0;
    let statesExplored = 0;
    
    const runBtn = document.getElementById('runSimulation');
    const stopBtn = document.getElementById('stopSimulation');
    const decoherenceSlider = document.getElementById('decoherence');
    const decoherenceValue = document.getElementById('decoherenceValue');
    
    decoherenceSlider.addEventListener('input', () => {
        decoherenceValue.textContent = decoherenceSlider.value + '%';
    });
    
    function simulate() {
        if (!isRunning) return;
        
        const colors = getThemeColors();
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, 600, 400);
        
        const numQubits = parseInt(document.getElementById('numQubits').value);
        const expType = document.getElementById('expType').value;
        const decoherence = parseInt(decoherenceSlider.value);
        
        // Simple visualization based on type
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = colors.text;
        ctx.textAlign = 'center';
        ctx.fillText(`Simulation: ${expType} (${numQubits} qubits)`, 300, 30);
        
        // Draw animated quantum states
        for (let i = 0; i < Math.pow(2, numQubits); i++) {
            const angle = (i / Math.pow(2, numQubits)) * Math.PI * 2 + time;
            const radius = 100 + Math.sin(time * 2) * 20;
            const x = 300 + Math.cos(angle) * radius;
            const y = 200 + Math.sin(angle) * radius;
            
            const coherence = 1 - (decoherence / 100);
            const size = 5 + Math.sin(time * 3 + i) * 2 * coherence;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `${colors.primary}${Math.floor(coherence * 255).toString(16).padStart(2, '0')}`;
            ctx.fill();
        }
        
        time += 0.02;
        statesExplored += Math.pow(2, numQubits);
        
        document.getElementById('statesExplored').textContent = statesExplored;
        document.getElementById('coherence').textContent = (100 - decoherence) + '%';
        document.getElementById('simTime').textContent = time.toFixed(1) + 's';
        
        animationId = requestAnimationFrame(simulate);
    }
    
    runBtn.addEventListener('click', () => {
        isRunning = true;
        simulate();
    });
    
    stopBtn.addEventListener('click', () => {
        isRunning = false;
        if (animationId) cancelAnimationFrame(animationId);
    });
}

// ============================================
// INITIALIZE ALL
// ============================================

window.addEventListener('load', () => {
    initHeroCanvas();
    initSuperposition();
    initMultiverse();
    initEntropy();
    initConsciousness();
    initDeterminism();
    initParadox();
    initSimulator();
    
    console.log('%cVisualizations loaded successfully!', 'color: #10b981; font-weight: bold;');
});
