// ============================================
// SCHRÖDINGER'S CAT EXPERIMENT
// ============================================

function initSchrodingerCat() {
    const canvasData = getCanvasContext('schrodingerCanvas');
    if (!canvasData) return;
    
    const { ctx, width, height } = canvasData;
    
    let state = 'superposition';
    let trials = 0;
    let aliveCount = 0;
    let deadCount = 0;
    let animProgress = 0;
    
    function draw() {
        const colors = getThemeColors();
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const boxSize = isMobile() ? 120 : 180;
        
        if (state === 'superposition') {
            // Box closed - superposition
            // Draw box
            ctx.strokeStyle = colors.primary;
            ctx.lineWidth = 3;
            ctx.strokeRect(centerX - boxSize/2, centerY - boxSize/2, boxSize, boxSize);
            
            // Draw question marks floating
            ctx.font = `bold ${getFontSize(48)}px sans-serif`;
            ctx.fillStyle = colors.primary + '88';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const offset = Math.sin(animProgress) * 10;
            ctx.fillText('?', centerX - 30 + offset, centerY - 20);
            ctx.fillText('?', centerX + 30 - offset, centerY + 20);
            
            // Label
            ctx.font = `${getFontSize(16)}px sans-serif`;
            ctx.fillStyle = colors.text;
            ctx.fillText('État: |vivant⟩ + |mort⟩', centerX, height - 60);
            ctx.fillText('(Superposition)', centerX, height - 40);
            
            animProgress += 0.05;
            requestAnimationFrame(draw);
        } else {
            // Box opened - collapsed state
            // Draw open box
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
            
            // Draw cat emoji
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
    
    document.getElementById('openBox').addEventListener('click', () => {
        if (state === 'superposition') {
            // Collapse wavefunction
            state = Math.random() > 0.5 ? 'alive' : 'dead';
            trials++;
            
            if (state === 'alive') aliveCount++;
            else deadCount++;
            
            updateStats();
            draw();
        }
    });
    
    document.getElementById('resetCat').addEventListener('click', () => {
        state = 'superposition';
        updateStats();
        draw();
    });
    
    function updateStats() {
        document.getElementById('catState').textContent = 
            state === 'superposition' ? 'Superposition' : 
            state === 'alive' ? 'Vivant (mesuré)' : 'Mort (mesuré)';
        
        document.getElementById('catTrials').textContent = `${trials}/100`;
        document.getElementById('catAlive').textContent = 
            trials > 0 ? `${((aliveCount/trials)*100).toFixed(1)}%` : '0%';
        document.getElementById('catDead').textContent = 
            trials > 0 ? `${((deadCount/trials)*100).toFixed(1)}%` : '0%';
    }
    
    draw();
}

// ============================================
// WIGNER'S FRIEND EXPERIMENT
// ============================================

function initWignerFriend() {
    const canvasData = getCanvasContext('wignerCanvas');
    if (!canvasData) return;
    
    const { ctx, width, height } = canvasData;
    
    let systemState = 'unmeasured';
    let friendState = 'observing';
    let wignerState = 'outside';
    
    function draw() {
        const colors = getThemeColors();
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, width, height);
        
        const roomX = width / 2;
        const roomY = height / 2;
        const roomWidth = isMobile() ? 250 : 350;
        const roomHeight = isMobile() ? 200 : 300;
        
        // Draw laboratory room
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 3;
        ctx.strokeRect(roomX - roomWidth/2, roomY - roomHeight/2, roomWidth, roomHeight);
        
        // Label room
        ctx.font = `bold ${getFontSize(16)}px sans-serif`;
        ctx.fillStyle = colors.text;
        ctx.textAlign = 'center';
        ctx.fillText('Laboratoire', roomX, roomY - roomHeight/2 - 15);
        
        // Draw Friend inside
        ctx.font = `${getFontSize(40)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👤', roomX - 60, roomY - 30);
        
        ctx.font = `${getFontSize(14)}px sans-serif`;
        ctx.fillStyle = colors.text;
        ctx.fillText('Ami', roomX - 60, roomY + 30);
        
        // Draw quantum system
        ctx.font = `${getFontSize(40)}px sans-serif`;
        if (systemState === 'unmeasured') {
            ctx.fillText('⚛️', roomX + 60, roomY - 30);
            ctx.font = `${getFontSize(12)}px sans-serif`;
            ctx.fillText('Système en', roomX + 60, roomY + 20);
            ctx.fillText('superposition', roomX + 60, roomY + 35);
        } else if (systemState === 'up') {
            ctx.fillText('↑', roomX + 60, roomY - 30);
            ctx.font = `${getFontSize(14)}px sans-serif`;
            ctx.fillStyle = colors.primary;
            ctx.fillText('Spin UP', roomX + 60, roomY + 30);
        } else {
            ctx.fillText('↓', roomX + 60, roomY - 30);
            ctx.font = `${getFontSize(14)}px sans-serif`;
            ctx.fillStyle = colors.secondary;
            ctx.fillText('Spin DOWN', roomX + 60, roomY + 30);
        }
        
        // Draw Wigner outside
        ctx.font = `${getFontSize(50)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('👁️', roomX, roomY + roomHeight/2 + 60);
        
        ctx.font = `${getFontSize(16)}px sans-serif`;
        ctx.fillStyle = colors.text;
        ctx.fillText('Wigner (observateur externe)', roomX, roomY + roomHeight/2 + 100);
        
        // Show perspective
        ctx.font = `italic ${getFontSize(13)}px sans-serif`;
        ctx.fillStyle = colors.textSecondary;
        ctx.textAlign = 'left';
        
        if (wignerState === 'outside') {
            ctx.fillText('Perspective de Wigner:', 20, height - 80);
            ctx.fillText('Ami + Système = SUPERPOSITION', 20, height - 60);
            ctx.fillText('(Pas encore mesuré pour lui)', 20, height - 40);
        } else {
            ctx.fillText('Wigner a mesuré. Tout s\'effondre.', 20, height - 60);
            ctx.fillText('Les deux observateurs s\'accordent.', 20, height - 40);
        }
    }
    
    document.getElementById('friendMeasure').addEventListener('click', () => {
        if (systemState === 'unmeasured') {
            systemState = Math.random() > 0.5 ? 'up' : 'down';
            friendState = 'measured';
            
            document.getElementById('wignerState').textContent = 
                `L'ami voit: ${systemState === 'up' ? '↑' : '↓'}. Mais pour Wigner, c'est encore en superposition!`;
            
            draw();
        }
    });
    
    document.getElementById('wignerMeasure').addEventListener('click', () => {
        if (friendState === 'measured' && wignerState === 'outside') {
            wignerState = 'measured';
            
            document.getElementById('wignerState').textContent = 
                `Wigner mesure tout. État: ${systemState === 'up' ? '↑' : '↓'}. Le paradoxe se résout.`;
            
            draw();
        }
    });
    
    document.getElementById('resetWigner').addEventListener('click', () => {
        systemState = 'unmeasured';
        friendState = 'observing';
        wignerState = 'outside';
        
        document.getElementById('wignerState').textContent = 'Système non mesuré';
        
        draw();
    });
    
    draw();
}

// ============================================
// EPR / BELL TEST EXPERIMENT
// ============================================

function initEPRBell() {
    const canvasData = getCanvasContext('eprCanvas');
    if (!canvasData) return;
    
    const { ctx, width, height } = canvasData;
    
    let pairCreated = false;
    let particleA = null;
    let particleB = null;
    let measurements = [];
    let correlationCount = 0;
    let totalMeasurements = 0;
    let bellS = 0;
    
    function draw() {
        const colors = getThemeColors();
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        if (!pairCreated) {
            // Show source
            ctx.font = `${getFontSize(60)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⚛️', centerX, centerY);
            
            ctx.font = `${getFontSize(16)}px sans-serif`;
            ctx.fillStyle = colors.text;
            ctx.fillText('Source de paires intriquées', centerX, centerY + 60);
        } else {
            // Show entangled particles
            const separation = isMobile() ? 150 : 200;
            
            // Particle A (left)
            ctx.font = `${getFontSize(50)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(particleA !== null ? (particleA === 1 ? '↑' : '↓') : '?', 
                         centerX - separation, centerY);
            
            ctx.font = `${getFontSize(14)}px sans-serif`;
            ctx.fillStyle = colors.primary;
            ctx.fillText('Particule A', centerX - separation, centerY + 50);
            if (particleA !== null) {
                ctx.fillText(particleA === 1 ? 'Spin ↑' : 'Spin ↓', 
                            centerX - separation, centerY + 70);
            }
            
            // Entanglement line
            if (particleA === null && particleB === null) {
                ctx.strokeStyle = colors.accent + '44';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(centerX - separation + 20, centerY);
                ctx.lineTo(centerX + separation - 20, centerY);
                ctx.stroke();
                ctx.setLineDash([]);
                
                ctx.font = `italic ${getFontSize(12)}px sans-serif`;
                ctx.fillStyle = colors.textSecondary;
                ctx.fillText('Intrication', centerX, centerY - 15);
            }
            
            // Particle B (right)
            ctx.font = `${getFontSize(50)}px sans-serif`;
            ctx.fillText(particleB !== null ? (particleB === 1 ? '↑' : '↓') : '?', 
                         centerX + separation, centerY);
            
            ctx.font = `${getFontSize(14)}px sans-serif`;
            ctx.fillStyle = colors.secondary;
            ctx.fillText('Particule B', centerX + separation, centerY + 50);
            if (particleB !== null) {
                ctx.fillText(particleB === 1 ? 'Spin ↑' : 'Spin ↓', 
                            centerX + separation, centerY + 70);
            }
        }
        
        // Show statistics at bottom
        ctx.font = `${getFontSize(13)}px sans-serif`;
        ctx.fillStyle = colors.text;
        ctx.textAlign = 'center';
        ctx.fillText(`Mesures: ${totalMeasurements} | Corrélées: ${correlationCount}`, 
                    centerX, height - 40);
    }
    
    document.getElementById('createPair').addEventListener('click', () => {
        pairCreated = true;
        particleA = null;
        particleB = null;
        draw();
    });
    
    document.getElementById('measureBoth').addEventListener('click', () => {
        if (pairCreated && particleA === null && particleB === null) {
            // Create entangled state
            // For simplicity: perfect anti-correlation
            particleA = Math.random() > 0.5 ? 1 : 0;
            particleB = 1 - particleA; // Always opposite for perfect entanglement
            
            totalMeasurements++;
            if (particleA !== particleB) {
                correlationCount++;
            }
            
            updateBellStats();
            draw();
        }
    });
    
    document.getElementById('testBell').addEventListener('click', () => {
        // Run multiple measurements to test Bell inequality
        measurements = [];
        correlationCount = 0;
        totalMeasurements = 0;
        
        for (let i = 0; i < 100; i++) {
            const a = Math.random() > 0.5 ? 1 : 0;
            const b = 1 - a; // Perfect anti-correlation
            measurements.push({a, b});
            totalMeasurements++;
            if (a !== b) correlationCount++;
        }
        
        // Simplified Bell S parameter
        // For perfect quantum correlation: S ≈ 2.8 (violates Bell inequality S ≤ 2)
        bellS = 2.8 + (Math.random() - 0.5) * 0.2;
        
        updateBellStats();
        draw();
        
        if (bellS > 2) {
            document.getElementById('bellVerdict').textContent = 'Quantique!';
            document.getElementById('bellVerdict').style.color = '#10b981';
        }
    });
    
    document.getElementById('resetEPR').addEventListener('click', () => {
        pairCreated = false;
        particleA = null;
        particleB = null;
        measurements = [];
        correlationCount = 0;
        totalMeasurements = 0;
        bellS = 0;
        updateBellStats();
        draw();
    });
    
    function updateBellStats() {
        const corrPercent = totalMeasurements > 0 ? 
            ((correlationCount / totalMeasurements) * 100).toFixed(1) : '0';
        
        document.getElementById('correlations').textContent = corrPercent + '%';
        document.getElementById('bellInequality').textContent = bellS.toFixed(2);
        
        if (bellS === 0) {
            document.getElementById('bellVerdict').textContent = '-';
        }
    }
    
    draw();
}

// ============================================
// CHINESE ROOM EXPERIMENT
// ============================================

function initChineseRoom() {
    const canvasData = getCanvasContext('chineseRoomCanvas');
    if (!canvasData) return;
    
    const { ctx, width, height } = canvasData;
    
    let processing = false;
    let currentInput = '';
    let currentOutput = '';
    
    // Simple symbol mapping (fake Chinese)
    const symbolMap = {
        '你好': '你好吗？',
        '谢谢': '不客气',
        '是': '对',
        '不': '错',
        'default': '我明白了'
    };
    
    function draw() {
        const colors = getThemeColors();
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const roomWidth = isMobile() ? 200 : 280;
        const roomHeight = isMobile() ? 150 : 200;
        
        // Draw room
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 3;
        ctx.strokeRect(centerX - roomWidth/2, centerY - roomHeight/2, roomWidth, roomHeight);
        
        // Draw person inside
        ctx.font = `${getFontSize(40)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🤷', centerX, centerY);
        
        ctx.font = `${getFontSize(12)}px sans-serif`;
        ctx.fillStyle = colors.text;
        ctx.fillText('Ne parle pas chinois', centerX, centerY + 40);
        
        // Draw rulebook
        ctx.font = `${getFontSize(30)}px sans-serif`;
        ctx.fillText('📖', centerX - 70, centerY - 30);
        
        ctx.font = `${getFontSize(11)}px sans-serif`;
        ctx.fillText('Livre de', centerX - 70, centerY);
        ctx.fillText('règles', centerX - 70, centerY + 15);
        
        // Show processing
        if (processing) {
            ctx.font = `italic ${getFontSize(14)}px sans-serif`;
            ctx.fillStyle = colors.accent;
            ctx.fillText('Consultation des règles...', centerX, centerY - 80);
        }
        
        // Draw input slot
        ctx.fillStyle = colors.bg;
        ctx.fillRect(centerX - 40, centerY - roomHeight/2 - 30, 80, 20);
        ctx.strokeStyle = colors.primary;
        ctx.strokeRect(centerX - 40, centerY - roomHeight/2 - 30, 80, 20);
        
        ctx.font = `${getFontSize(10)}px sans-serif`;
        ctx.fillStyle = colors.text;
        ctx.fillText('Entrée', centerX, centerY - roomHeight/2 - 40);
        
        // Draw output slot
        ctx.fillStyle = colors.bg;
        ctx.fillRect(centerX - 40, centerY + roomHeight/2 + 10, 80, 20);
        ctx.strokeStyle = colors.primary;
        ctx.strokeRect(centerX - 40, centerY + roomHeight/2 + 10, 80, 20);
        
        ctx.font = `${getFontSize(10)}px sans-serif`;
        ctx.fillText('Sortie', centerX, centerY + roomHeight/2 + 40);
    }
    
    const input = document.getElementById('chineseInput');
    
    document.getElementById('sendChinese').addEventListener('click', () => {
        const text = input.value.trim();
        if (text) {
            currentInput = text;
            processing = true;
            document.getElementById('roomProcess').textContent = 'Recherche dans le livre de règles...';
            document.getElementById('chineseOutput').textContent = '-';
            
            draw();
            
            // Simulate processing time
            setTimeout(() => {
                currentOutput = symbolMap[text] || symbolMap['default'];
                processing = false;
                
                document.getElementById('roomProcess').textContent = 
                    'Règles appliquées mécaniquement';
                document.getElementById('chineseOutput').textContent = currentOutput;
                
                draw();
            }, 1500);
            
            input.value = '';
        }
    });
    
    document.getElementById('resetRoom').addEventListener('click', () => {
        processing = false;
        currentInput = '';
        currentOutput = '';
        input.value = '';
        document.getElementById('roomProcess').textContent = 'En attente...';
        document.getElementById('chineseOutput').textContent = '-';
        draw();
    });
    
    draw();
}

// ============================================
// INITIALIZE ALL EXPERIMENTS
// ============================================

window.addEventListener('load', () => {
    initSchrodingerCat();
    initWignerFriend();
    initEPRBell();
    initChineseRoom();
    
    console.log('%cMental Experiments initialized!', 'color: #10b981; font-weight: bold;');
});
