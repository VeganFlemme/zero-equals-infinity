// KNOWLEDGE-GRAPH.JS - FIXED & OPTIMIZED
import { animationManager } from './animation-manager.js';
import { FEATURES, debounce, showError } from './utils.js';
import { CONFIG } from './config.js';

function initKnowledgeGraph() {
    const container = document.getElementById('knowledgeGraph');
    if (!container) return;
    
    if (typeof THREE === 'undefined') {
        console.error('Three.js failed to load');
        showError('Erreur: Impossible de charger la visualisation 3D. Veuillez rafraîchir la page.', container);
        return;
    }
    
    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            CONFIG.THREE.CAMERA_FOV,
            container.clientWidth / container.clientHeight,
            CONFIG.THREE.CAMERA_NEAR,
            CONFIG.THREE.CAMERA_FAR
        );
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        camera.position.z = CONFIG.THREE.CAMERA_Z;
        camera.position.y = CONFIG.THREE.CAMERA_Y;
        
        const ambientLight = new THREE.AmbientLight(0xffffff, CONFIG.THREE.LIGHT_INTENSITY_AMBIENT);
        scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, CONFIG.THREE.LIGHT_INTENSITY_POINT);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);
        
        // Create sample nodes
        const nodes = [];
        const concepts = [
            { id: 'superposition', label: 'Superposition', color: 0x6366f1, position: [0, 0, 0] },
            { id: 'entanglement', label: 'Intrication', color: 0x6366f1, position: [15, 5, -10] },
            { id: 'consciousness', label: 'Conscience', color: 0xec4899, position: [0, 10, 15] },
        ];
        
        concepts.forEach(concept => {
            const geometry = new THREE.SphereGeometry(CONFIG.THREE.NODE_SIZE, CONFIG.THREE.NODE_SEGMENTS, CONFIG.THREE.NODE_SEGMENTS);
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
        });
        
        let autoRotate = true;
        
        function animate() {
            if (autoRotate) {
                scene.rotation.y += CONFIG.ANIMATION.ROTATION_SPEED;
            }
            nodes.forEach((node, i) => {
                node.position.y += Math.sin(Date.now() * 0.001 + i) * 0.01;
            });
            renderer.render(scene, camera);
        }
        
        const cleanup = animationManager.register('knowledgeGraph', animate, container);
        
        // Reset button
        const resetBtn = document.getElementById('resetGraph');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                camera.position.set(0, CONFIG.THREE.CAMERA_Y, CONFIG.THREE.CAMERA_Z);
                scene.rotation.set(0, 0, 0);
                autoRotate = true;
                const info = document.getElementById('graphNodeInfo');
                if (info) info.textContent = 'Cliquez sur un nœud pour plus d\'infos';
            });
        }
        
        // Handle resize
        const handleResize = debounce(() => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }, CONFIG.DEBOUNCE.RESIZE);
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            cleanup();
            window.removeEventListener('resize', handleResize);
            scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(m => m.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
            renderer.dispose();
            container.removeChild(renderer.domElement);
        };
    } catch (e) {
        console.error('3D graph error:', e);
        showError('Erreur lors de l\'initialisation du graphe 3D', container);
    }
}

window.addEventListener('load', () => {
    setTimeout(() => {
        try {
            initKnowledgeGraph();
            console.log('%c✓ Knowledge graph loaded', 'color: #10b981; font-weight: bold;');
        } catch (e) {
            console.error('Knowledge graph init error:', e);
        }
    }, 100);
});
