import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { crearHUD } from '../game/hud.js';

export function iniciarEscena() {
    const scene = new THREE.Scene();
    
    const canvas = document.createElement('canvas');
    canvas.width = 1; 
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0,0,0,256);
    grad.addColorStop(0, '#000000');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,1,256);
    const bgTexture = new THREE.CanvasTexture(canvas);
    scene.background = bgTexture;
    
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 6, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 6, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 10;
    controls.maxDistance = 40;
    
    const luz1 = new THREE.DirectionalLight(0xffffff, 0.8);
    luz1.position.set(10, 15, 10);
    luz1.castShadow = true;
    luz1.shadow.mapSize.width = 2048;
    luz1.shadow.mapSize.height = 2048;
    scene.add(luz1);
    
    const luz2 = new THREE.DirectionalLight(0xffffff, 0.6);
    luz2.position.set(-10, 15, -10);
    scene.add(luz2);
    
    const luz3 = new THREE.DirectionalLight(0xffffff, 0.4);
    luz3.position.set(0, 15, -15);
    scene.add(luz3);
    
    scene.add(new THREE.AmbientLight(0x404060, 0.8));
    
    crearHUD();
    return { scene, camera, renderer, controls };
}

export function mostrarMenu3DFondo(scene, crearPiezaMesh3D) {
    const piezas = [
        [0, 8, -6, 0], [6, 12, -2, 1], [-6, 10, 4, 2], [0, 6, 6, 3],
        [-8, 14, 2, 4], [8, 13, -4, 5], [4, 16, 4, 6], [-4, 5, -8, 7]
    ];
    for (let i = 0; i < piezas.length; i++) {
        const [x, y, z, tipo] = piezas[i];
        const mesh = crearPiezaMesh3D(tipo, 0, 0, 0);
        mesh.position.set(x, y, z);
        mesh.rotation.y = Math.random() * Math.PI * 2;
        mesh.rotation.x = Math.random() * Math.PI * 2;
        mesh.rotation.z = Math.random() * Math.PI * 2;
        mesh.name = 'decorativo';
        scene.add(mesh);
    }
    const geo = new THREE.BoxGeometry(3, 3, 3);
    const mat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        metalness: 0.8, 
        roughness: 0.1, 
        emissive: 0x00bfff 
    });
    const cubo = new THREE.Mesh(geo, mat);
    cubo.name = 'logoCuboDecorativo';
    cubo.position.set(0, 8, 0);
    cubo.castShadow = true;
    scene.add(cubo);
}