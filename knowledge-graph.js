// ============================================
// 3D KNOWLEDGE GRAPH WITH THREE.JS
// ============================================

function initKnowledgeGraph() {
    const container = document.getElementById('knowledgeGraph');
    if (!container) return;
    
    // Setup Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Camera position
    camera.position.z = 50;
    camera.position.y = 10;
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Node data structure
    const concepts = [
        // Physics nodes (blue)
        { id: 'superposition', label: 'Superposition', category: 'physics', color: 0x6366f1, 
          position: [0, 0, 0], description: 'Un système existe dans tous les états simultanément' },
        { id: 'entanglement', label: 'Intrication', category: 'physics', color: 0x6366f1, 
          position: [15, 5, -10], description: 'Corrélation quantique instantanée' },
        { id: 'measurement', label: 'Mesure', category: 'physics', color: 0x6366f1, 
          position: [-15, 5, -10], description: 'L\'acte d\'observation affecte le système' },
        { id: 'everett', label: 'Mondes Multiples', category: 'physics', color: 0x6366f1, 
          position: [0, 15, -5], description: 'Toutes les possibilités se réalisent' },
        { id: 'bell', label: 'Théorème de Bell', category: 'physics', color: 0x6366f1, 
          position: [20, 0, 5], description: 'Preuve de non-localité quantique' },
        { id: 'decoherence', label: 'Décohérence', category: 'physics', color: 0x6366f1, 
          position: [-10, -10, 0], description: 'Transition quantique → classique' },
        
        // Philosophy nodes (purple)
        { id: 'determinism', label: 'Déterminisme', category: 'philosophy', color: 0x8b5cf6, 
          position: [10, -5, 15], description: 'Tout est causalement déterminé' },
        { id: 'freewill', label: 'Libre Arbitre', category: 'philosophy', color: 0x8b5cf6, 
          position: [10, -15, 10], description: 'Capacité de choisir librement' },
        { id: 'realism', label: 'Réalisme', category: 'philosophy', color: 0x8b5cf6, 
          position: [-20, 5, 5], description: 'La réalité existe indépendamment de l\'observateur' },
        { id: 'idealism', label: 'Idéalisme', category: 'philosophy', color: 0x8b5cf6, 
          position: [-15, -5, 15], description: 'La conscience est fondamentale' },
        
        // AI & Consciousness nodes (pink)
        { id: 'consciousness', label: 'Conscience', category: 'ai', color: 0xec4899, 
          position: [0, 10, 15], description: 'Expérience subjective' },
        { id: 'iit', label: 'IIT (Tononi)', category: 'ai', color: 0xec4899, 
          position: [-5, 5, 20], description: 'Conscience = Intégration d\'information (Φ)' },
        { id: 'emergence', label: 'Émergence', category: 'ai', color: 0xec4899, 
          position: [5, -5, 20], description: 'Propriétés qui apparaissent de la complexité' },
        { id: 'panpsychism', label: 'Panpsychisme', category: 'ai', color: 0xec4899, 
          position: [-10, 0, 25], description: 'Toute matière a une proto-conscience' },
        { id: 'ai', label: 'Intelligence Artificielle', category: 'ai', color: 0xec4899, 
          position: [15, 0, 20], description: 'Intelligence non-biologique' },
        { id: 'turing', label: 'Test de Turing', category: 'ai', color: 0xec4899, 
          position: [20, -10, 15], description: 'Critère d\'intelligence machine' },
    ];
    
    // Connections (relationships)
    const connections = [
        // Physics connections
        { from: 'superposition', to: 'measurement', type: 'collapses' },
        { from: 'superposition', to: 'everett', type: 'splits' },
        { from: 'entanglement', to: 'bell', type: 'proves' },
        { from: 'measurement', to: 'decoherence', type: 'causes' },
        { from: 'everett', to: 'determinism', type: 'supports' },
        
        // Philosophy connections
        { from: 'determinism', to: 'freewill', type: 'contradicts' },
        { from: 'measurement', to: 'realism', type: 'challenges' },
        { from: 'realism', to: 'idealism', type: 'opposes' },
        
        // AI & Consciousness connections
        { from: 'consciousness', to: 'iit', type: 'quantified_by' },
        { from: 'consciousness', to: 'emergence', type: 'emerges_from' },
        { from: 'consciousness', to: 'panpsychism', type: 'or_fundamental' },
        { from: 'emergence', to: 'ai', type: 'enables' },
        { from: 'ai', to: 'turing', type: 'tested_by' },
        
        // Cross-domain connections
        { from: 'measurement', to: 'consciousness', type: 'requires' },
        { from: 'superposition', to: 'freewill', type: 'enables_possibly' },
        { from: 'decoherence', to: 'emergence', type: 'explains' },
        { from: 'iit', to: 'entanglement', type: 'measures_like' },
    ];
    
    // Create node meshes
    const nodes = [];
    const nodeMeshMap = {};
    
    concepts.forEach(concept => {
        const geometry = new THREE.SphereGeometry(1.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({ 
            color: concept.color,
            emissive: concept.color,
            emissiveIntensity: 0.2,
            shininess: 100
        });
        const sphere = new THREE.Mesh(geometry, material);
        
        sphere.position.set(...concept.position);
        sphere.userData = concept;
        
        scene.add(sphere);
        nodes.push(sphere);
        nodeMeshMap[concept.id] = sphere;
        
        // Add label sprite
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = 'white';
        context.font = 'Bold 24px Arial';
        context.textAlign = 'center';
        context.fillText(concept.label, 128, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(8, 2, 1);
        sprite.position.set(...concept.position);
        sprite.position.y += 3;
        
        scene.add(sprite);
    });
    
    // Create connection lines
    connections.forEach(conn => {
        const fromNode = nodeMeshMap[conn.from];
        const toNode = nodeMeshMap[conn.to];
        
        if (fromNode && toNode) {
            const points = [
                fromNode.position,
                toNode.position
            ];
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ 
                color: 0x888888,
                opacity: 0.4,
                transparent: true
            });
            const line = new THREE.Line(geometry, material);
            
            scene.add(line);
        }
    });
    
    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedNode = null;
    
    function onMouseMove(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodes);
        
        // Reset all nodes
        nodes.forEach(node => {
            node.material.emissiveIntensity = 0.2;
            node.scale.set(1, 1, 1);
        });
        
        // Highlight hovered node
        if (intersects.length > 0) {
            const hoveredNode = intersects[0].object;
            hoveredNode.material.emissiveIntensity = 0.6;
            hoveredNode.scale.set(1.3, 1.3, 1.3);
            container.style.cursor = 'pointer';
        } else {
            container.style.cursor = 'default';
        }
    }
    
    function onClick(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodes);
        
        if (intersects.length > 0) {
            selectedNode = intersects[0].object;
            const concept = selectedNode.userData;
            
            document.getElementById('graphNodeInfo').innerHTML = `
                <strong>${concept.label}</strong><br>
                ${concept.description}<br>
                <em>Catégorie: ${concept.category}</em>
            `;
        }
    }
    
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);
    
    // Animation
    let autoRotate = true;
    
    function animate() {
        requestAnimationFrame(animate);
        
        // Auto-rotate
        if (autoRotate) {
            scene.rotation.y += 0.002;
        }
        
        // Gentle bobbing animation for nodes
        nodes.forEach((node, i) => {
            node.position.y += Math.sin(Date.now() * 0.001 + i) * 0.01;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Reset button
    document.getElementById('resetGraph').addEventListener('click', () => {
        camera.position.set(0, 10, 50);
        scene.rotation.set(0, 0, 0);
        autoRotate = true;
        document.getElementById('graphNodeInfo').textContent = 'Cliquez sur un nœud pour plus d\'infos';
    });
    
    // Manual rotation with mouse drag
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    renderer.domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        autoRotate = false;
    });
    
    renderer.domElement.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: e.offsetY - previousMousePosition.y
            };
            
            scene.rotation.y += deltaMove.x * 0.01;
            scene.rotation.x += deltaMove.y * 0.01;
        }
        
        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });
    
    renderer.domElement.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    });
    
    console.log('%c3D Knowledge Graph initialized!', 'color: #8b5cf6; font-weight: bold;');
}

// ============================================
// INITIALIZE
// ============================================

window.addEventListener('load', () => {
    // Small delay to ensure Three.js is loaded
    setTimeout(initKnowledgeGraph, 100);
});
