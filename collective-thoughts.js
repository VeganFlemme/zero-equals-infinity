// ============================================
// COLLECTIVE THOUGHTS SYSTEM
// ============================================

function initCollectiveThoughts() {
    const canvas = document.getElementById('thoughtsCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const thoughts = getStoredThoughts();
    
    const thoughtInput = document.getElementById('thoughtInput');
    const charCount = document.getElementById('charCount');
    const submitBtn = document.getElementById('submitThought');
    const recentThoughts = document.getElementById('recentThoughts');
    const thoughtClusters = document.getElementById('thoughtClusters');
    
    // Character counter
    thoughtInput.addEventListener('input', () => {
        const length = thoughtInput.value.length;
        charCount.textContent = `${length}/280`;
        
        if (length > 280) {
            charCount.style.color = '#ef4444';
        } else if (length > 240) {
            charCount.style.color = '#f59e0b';
        } else {
            charCount.style.color = 'var(--text-secondary)';
        }
    });
    
    // Submit thought
    submitBtn.addEventListener('click', () => {
        const text = thoughtInput.value.trim();
        
        if (text.length > 0 && text.length <= 280) {
            const thought = {
                id: Date.now(),
                text: text,
                timestamp: new Date().toISOString(),
                keywords: extractKeywords(text)
            };
            
            thoughts.push(thought);
            saveThoughts(thoughts);
            
            thoughtInput.value = '';
            charCount.textContent = '0/280';
            charCount.style.color = 'var(--text-secondary)';
            
            renderThoughts();
            visualizeThoughts();
            analyzeClusters();
            
            // Success feedback
            submitBtn.textContent = '✓ Partagée!';
            submitBtn.style.background = '#10b981';
            
            setTimeout(() => {
                submitBtn.textContent = '📤 Partager';
                submitBtn.style.background = '';
            }, 2000);
        }
    });
    
    // Keywords extraction (simple)
    function extractKeywords(text) {
        const stopWords = new Set([
            'le', 'la', 'les', 'un', 'une', 'des', 'et', 'ou', 'mais', 'donc',
            'de', 'du', 'à', 'au', 'ce', 'cette', 'ces', 'mon', 'ma', 'mes',
            'est', 'sont', 'a', 'ai', 'as', 'avez', 'avoir', 'être', 'dans',
            'pour', 'par', 'sur', 'avec', 'sans', 'que', 'qui', 'quoi', 'dont'
        ]);
        
        const words = text.toLowerCase()
            .replace(/[.,;!?]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3 && !stopWords.has(word));
        
        // Count frequency
        const freq = {};
        words.forEach(word => {
            freq[word] = (freq[word] || 0) + 1;
        });
        
        // Return top 5 keywords
        return Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word]) => word);
    }
    
    // Simple semantic similarity (Jaccard)
    function similarity(thought1, thought2) {
        const set1 = new Set(thought1.keywords);
        const set2 = new Set(thought2.keywords);
        
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        
        return intersection.size / union.size;
    }
    
    // Visualize thoughts as points
    function visualizeThoughts() {
        const colors = getThemeColors();
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, width, height);
        
        if (thoughts.length === 0) {
            ctx.font = '16px sans-serif';
            ctx.fillStyle = colors.textSecondary;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Aucune pensée pour le moment...', width / 2, height / 2);
            return;
        }
        
        // Use simple 2D projection based on keywords
        // Create positions based on keyword similarity
        const positions = [];
        
        thoughts.forEach((thought, i) => {
            // Simple hash-based positioning for consistency
            let x = 0, y = 0;
            
            thought.keywords.forEach((keyword, j) => {
                const hash = keyword.split('').reduce((acc, char) => {
                    return acc + char.charCodeAt(0);
                }, 0);
                
                x += Math.sin(hash * 0.1 + j) * 100;
                y += Math.cos(hash * 0.1 + j) * 100;
            });
            
            // Normalize to canvas
            x = (x % (width - 100)) + 50;
            y = (y % (height - 100)) + 50;
            
            // Ensure within bounds
            x = Math.max(30, Math.min(width - 30, x));
            y = Math.max(30, Math.min(height - 30, y));
            
            positions.push({ x, y, thought, index: i });
        });
        
        // Draw connections between similar thoughts
        positions.forEach((pos1, i) => {
            positions.slice(i + 1).forEach(pos2 => {
                const sim = similarity(pos1.thought, pos2.thought);
                
                if (sim > 0.2) {
                    ctx.beginPath();
                    ctx.moveTo(pos1.x, pos1.y);
                    ctx.lineTo(pos2.x, pos2.y);
                    ctx.strokeStyle = colors.primary + Math.min(Math.floor(sim * 100), 255).toString(16).padStart(2, '0');
                    ctx.lineWidth = sim * 3;
                    ctx.stroke();
                }
            });
        });
        
        // Draw thought points
        positions.forEach((pos, i) => {
            const age = Date.now() - pos.thought.id;
            const ageHours = age / (1000 * 60 * 60);
            const opacity = Math.max(0.3, 1 - (ageHours / 24)); // Fade over 24h
            
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = colors.primary + Math.floor(opacity * 255).toString(16).padStart(2, '0');
            ctx.fill();
            
            // Hover effect (simplified - just show index)
            ctx.font = '10px sans-serif';
            ctx.fillStyle = colors.text;
            ctx.textAlign = 'center';
            ctx.fillText(`#${i + 1}`, pos.x, pos.y - 12);
        });
    }
    
    // Analyze and display clusters
    function analyzeClusters() {
        if (thoughts.length < 3) {
            thoughtClusters.innerHTML = '<p>Pas assez de pensées pour détecter des patterns (minimum 3).</p>';
            return;
        }
        
        // Simple clustering by keyword frequency
        const keywordFreq = {};
        
        thoughts.forEach(thought => {
            thought.keywords.forEach(keyword => {
                keywordFreq[keyword] = (keywordFreq[keyword] || 0) + 1;
            });
        });
        
        // Get top themes
        const topThemes = Object.entries(keywordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        if (topThemes.length > 0) {
            let html = '<h4>Thèmes émergents :</h4><div class="theme-tags">';
            
            topThemes.forEach(([theme, count]) => {
                const percentage = ((count / thoughts.length) * 100).toFixed(0);
                html += `<span class="theme-tag">${theme} <strong>(${count})</strong></span>`;
            });
            
            html += '</div>';
            
            // Add cluster description
            html += '<p style="margin-top: 1rem; font-size: 0.9rem;">Ces mots apparaissent fréquemment dans les pensées collectives, suggérant des préoccupations communes.</p>';
            
            thoughtClusters.innerHTML = html;
        }
    }
    
    // Render recent thoughts list
    function renderThoughts() {
        if (thoughts.length === 0) {
            recentThoughts.innerHTML = '<p class="empty-state">Aucune pensée partagée pour le moment. Soyez le premier !</p>';
            return;
        }
        
        // Sort by most recent
        const sortedThoughts = [...thoughts].sort((a, b) => b.id - a.id);
        
        let html = '';
        
        sortedThoughts.slice(0, 20).forEach((thought, index) => {
            const date = new Date(thought.timestamp);
            const timeAgo = getTimeAgo(date);
            
            html += `
                <div class="thought-item">
                    <div class="thought-text">${escapeHtml(thought.text)}</div>
                    <div class="thought-meta">
                        ${timeAgo} • 
                        Mots-clés: ${thought.keywords.join(', ') || 'aucun'}
                    </div>
                </div>
            `;
        });
        
        recentThoughts.innerHTML = html;
    }
    
    // Helper: time ago
    function getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (seconds < 60) return 'À l\'instant';
        if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
        if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
        return `Il y a ${Math.floor(seconds / 86400)}j`;
    }
    
    // Helper: escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Local storage
    function getStoredThoughts() {
        const stored = localStorage.getItem('quantumThoughts');
        return stored ? JSON.parse(stored) : [];
    }
    
    function saveThoughts(thoughts) {
        // Keep only last 100 thoughts
        const toSave = thoughts.slice(-100);
        localStorage.setItem('quantumThoughts', JSON.stringify(toSave));
    }
    
    // Initialize display
    renderThoughts();
    visualizeThoughts();
    analyzeClusters();
    
    // Redraw visualization periodically
    setInterval(visualizeThoughts, 5000);
    
    console.log('%cCollective Thoughts initialized!', 'color: #ec4899; font-weight: bold;');
}

// ============================================
// INITIALIZE
// ============================================

window.addEventListener('load', initCollectiveThoughts);

// Add CSS for theme tags
const style = document.createElement('style');
style.textContent = `
    .theme-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    
    .theme-tag {
        background: var(--bg-secondary);
        padding: 0.4rem 0.8rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-color);
        font-size: 0.9rem;
        color: var(--text-primary);
    }
    
    .theme-tag strong {
        color: var(--accent-primary);
        margin-left: 0.25rem;
    }
`;
document.head.appendChild(style);
