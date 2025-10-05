// ============================================
// ADVANCED EASTER EGGS v3.0
// ============================================

// ============================================
// 1. FIBONACCI SEQUENCE EASTER EGG
// ============================================

function initFibonacciEasterEgg() {
    const fibSequence = [1, 1, 2, 3, 5, 8, 13, 21];
    let clickSequence = [];
    let lastClickTime = 0;
    const clickTimeout = 2000; // 2 seconds between clicks
    
    document.addEventListener('click', (e) => {
        const currentTime = Date.now();
        
        // Reset if too much time passed
        if (currentTime - lastClickTime > clickTimeout) {
            clickSequence = [];
        }
        
        clickSequence.push(currentTime);
        lastClickTime = currentTime;
        
        // Check if intervals match Fibonacci * 100ms
        if (clickSequence.length >= 5) {
            const intervals = [];
            for (let i = 1; i < clickSequence.length; i++) {
                const interval = Math.round((clickSequence[i] - clickSequence[i-1]) / 100);
                intervals.push(interval);
            }
            
            // Check if last 4 intervals match Fibonacci
            const lastFour = intervals.slice(-4);
            const fibCheck = lastFour.every((interval, i) => {
                return Math.abs(interval - fibSequence[i]) <= 1; // Allow 1 unit tolerance
            });
            
            if (fibCheck) {
                revealFibonacciSecret();
                clickSequence = [];
            }
        }
    });
}

function revealFibonacciSecret() {
    const section = document.getElementById('fibonacci-secret');
    section.classList.remove('hidden');
    
    // Draw Fibonacci spiral
    const canvas = document.getElementById('fibonacciCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        drawFibonacciSpiral(ctx, canvas.width, canvas.height);
    }
    
    // Close button
    document.getElementById('closeFibonacci').addEventListener('click', () => {
        section.classList.add('hidden');
    });
    
    console.log('%c🔢 Fibonacci Easter Egg Activated!', 'color: #f59e0b; font-size: 18px; font-weight: bold;');
}

function drawFibonacciSpiral(ctx, width, height) {
    const colors = getThemeColors();
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, width, height);
    
    // Fibonacci sequence
    const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
    const scale = 3;
    
    let x = width / 2 - 50;
    let y = height / 2;
    let direction = 0; // 0: right, 1: up, 2: left, 3: down
    
    // Draw squares and spiral
    for (let i = 0; i < fib.length - 1; i++) {
        const size = fib[i] * scale;
        
        // Draw square
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, size, size);
        
        // Draw quarter circle (spiral)
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = colors.accent;
        
        const startAngle = direction * Math.PI / 2;
        const endAngle = (direction + 1) * Math.PI / 2;
        
        let centerX, centerY;
        switch (direction) {
            case 0: // right
                centerX = x;
                centerY = y + size;
                break;
            case 1: // up
                centerX = x;
                centerY = y;
                break;
            case 2: // left
                centerX = x + size;
                centerY = y;
                break;
            case 3: // down
                centerX = x + size;
                centerY = y + size;
                break;
        }
        
        ctx.arc(centerX, centerY, size, startAngle, endAngle);
        ctx.stroke();
        
        // Move to next position
        switch (direction) {
            case 0: // right
                y -= fib[i + 1] * scale;
                break;
            case 1: // up
                x -= fib[i + 1] * scale;
                break;
            case 2: // left
                y += fib[i + 1] * scale;
                break;
            case 3: // down
                x += fib[i + 1] * scale;
                break;
        }
        
        direction = (direction + 1) % 4;
    }
    
    // Add golden ratio text
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = colors.primary;
    ctx.textAlign = 'center';
    ctx.fillText('φ = 1.618... (Nombre d\'or)', width / 2, height - 30);
}

// ============================================
// 2. INFINITE SCROLL PARADOX EASTER EGG
// ============================================

function initScrollParadoxEasterEgg() {
    let scrollHistory = [];
    const historyLength = 10;
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const direction = currentScrollTop > lastScrollTop ? 'down' : 'up';
        
        scrollHistory.push(direction);
        
        if (scrollHistory.length > historyLength) {
            scrollHistory.shift();
        }
        
        // Check for pattern: down, down, down, ..., up, up, up, ...
        // Must scroll down a lot then up a lot
        if (scrollHistory.length === historyLength) {
            const firstHalf = scrollHistory.slice(0, 5);
            const secondHalf = scrollHistory.slice(5);
            
            const allDown = firstHalf.every(d => d === 'down');
            const allUp = secondHalf.every(d => d === 'up');
            
            if (allDown && allUp) {
                revealScrollParadox();
                scrollHistory = [];
            }
        }
        
        lastScrollTop = currentScrollTop;
    });
}

function revealScrollParadox() {
    // Create temporary message overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.95);
        color: #fff;
        padding: 3rem;
        border-radius: 16px;
        z-index: 10000;
        max-width: 600px;
        text-align: center;
        border: 2px solid #6366f1;
        box-shadow: 0 0 50px rgba(99, 102, 241, 0.5);
        animation: fadeInScale 0.5s ease;
    `;
    
    overlay.innerHTML = `
        <h2 style="margin-bottom: 1rem; color: #6366f1;">🔄 Paradoxe Détecté</h2>
        <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: 1.5rem;">
            Vous cherchez un sens même dans le chaos.<br>
            Descendre puis remonter infiniment.<br>
            Comme Sisyphe, mais numérique.
        </p>
        <p style="font-style: italic; color: #a0a0a0; margin-bottom: 1.5rem;">
            "On doit imaginer Sisyphe heureux" - Camus
        </p>
        <button id="closeScrollParadox" style="
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
        ">Accepter l'Absurde</button>
    `;
    
    document.body.appendChild(overlay);
    
    document.getElementById('closeScrollParadox').addEventListener('click', () => {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => overlay.remove(), 300);
    });
    
    console.log('%c🔄 Scroll Paradox Easter Egg Activated!', 'color: #8b5cf6; font-size: 18px; font-weight: bold;');
}

// ============================================
// 3. TRIPLE-CLICK BINARY MODE EASTER EGG
// ============================================

function initBinaryModeEasterEgg() {
    const mainTitle = document.getElementById('mainTitle');
    if (!mainTitle) return;
    
    let clickCount = 0;
    let clickTimer = null;
    
    mainTitle.addEventListener('click', () => {
        clickCount++;
        
        if (clickTimer) clearTimeout(clickTimer);
        
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 500);
        
        if (clickCount === 3) {
            activateBinaryMode();
            clickCount = 0;
        }
    });
}

function activateBinaryMode() {
    const overlay = document.getElementById('binaryOverlay');
    overlay.classList.remove('hidden');
    
    // Convert entire page content to binary representation using a Web Worker
    const bodyText = document.body.innerText;
    
    // Worker code as a string
    const workerCode = `
        self.onmessage = function(e) {
            const sample = e.data;
            let binaryText = '';
            for (let i = 0; i < sample.length; i++) {
                const binary = sample.charCodeAt(i).toString(2).padStart(8, '0');
                binaryText += binary + ' ';
                if ((i + 1) % 10 === 0) {
                    binaryText += '\\n';
                }
            }
            self.postMessage(binaryText);
        };
    `;
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    worker.onmessage = function(e) {
        overlay.textContent = e.data;
        // Matrix rain effect
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 10000;
            mix-blend-mode: screen;
        `;
        overlay.appendChild(canvas);
        worker.terminate();
    };
    // Send first 5000 characters to worker
    worker.postMessage(bodyText.substring(0, 5000));
    
    const ctx = canvas.getContext('2d');
    const columns = Math.floor(canvas.width / 20);
    const drops = Array(columns).fill(0);
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0f0';
        ctx.font = '16px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = Math.random() > 0.5 ? '1' : '0';
            ctx.fillText(text, i * 20, drops[i] * 20);
            
            if (drops[i] * 20 > canvas.height && Math.random() > 0.95) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    const matrixInterval = setInterval(drawMatrix, 50);
    
    // Show message after 3 seconds
    setTimeout(() => {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #000;
            color: #0f0;
            padding: 2rem;
            border: 2px solid #0f0;
            font-family: monospace;
            font-size: 1.2rem;
            text-align: center;
            z-index: 10001;
        `;
        
        message.innerHTML = `
            <div style="margin-bottom: 1rem;">BINARY MODE ACTIVATED</div>
            <div style="margin-bottom: 1rem; font-size: 2rem;">∅ = ∞</div>
            <div style="margin-bottom: 1rem;">01011010 01100101 01110010 01101111</div>
            <div style="margin-bottom: 1rem;">01000101 01110001 01110101 01100001 01101100 01110011</div>
            <div style="margin-bottom: 1.5rem;">01001001 01101110 01100110 01101001 01101110 01101001 01110100 01111001</div>
            <button id="exitBinary" style="
                background: #0f0;
                color: #000;
                border: none;
                padding: 0.5rem 2rem;
                font-family: monospace;
                font-weight: bold;
                cursor: pointer;
                font-size: 1rem;
            ">EXIT [ESC]</button>
        `;
        
        overlay.appendChild(message);
        
        document.getElementById('exitBinary').addEventListener('click', exitBinaryMode);
    }, 3000);
    
    // ESC key to exit
    function handleEscape(e) {
        if (e.key === 'Escape') {
            exitBinaryMode();
        }
    }
    
    document.addEventListener('keydown', handleEscape);
    
    function exitBinaryMode() {
        clearInterval(matrixInterval);
        overlay.classList.add('hidden');
        overlay.innerHTML = '';
        document.removeEventListener('keydown', handleEscape);
    }
    
    console.log('%c01000101 01100001 01110011 01110100 01100101 01110010 (Binary Mode!)', 'color: #0f0; font-family: monospace; font-size: 16px;');
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// INITIALIZE ALL EASTER EGGS
// ============================================

window.addEventListener('load', () => {
    initFibonacciEasterEgg();
    initScrollParadoxEasterEgg();
    initBinaryModeEasterEgg();
    
    console.log('%c🥚 Advanced Easter Eggs initialized!', 'color: #ec4899; font-weight: bold;');
    console.log('%cHints:', 'color: #6c757d;');
    console.log('%c- Try clicking in a Fibonacci pattern...', 'color: #6c757d;');
    console.log('%c- Scroll down a lot, then scroll up a lot...', 'color: #6c757d;');
    console.log('%c- Triple-click on ∅ = ∞...', 'color: #6c757d;');
});
