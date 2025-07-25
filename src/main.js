import * as THREE from 'three';
import { Howl } from 'howler';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { iniciarEscena, mostrarMenu3DFondo } from './render/scene.js';
import { crearPiezaMesh3D } from './render/pieceMesh.js';
import { BOARD_WIDTH, BOARD_HEIGHT, BOARD_DEPTH, inicializarBoard, colisiona3D, fijarPieza3D, eliminarCapasCompletas3D, cubosFijos, boardMatrix } from './game/board.js';
import { TETROMINOS_3D, COLORS, EMISSIVE } from './game/tetrominos.js';
import { manejarTeclas3D } from './game/controls.js';
import { crearHUD, mostrarInfoJuego, actualizarHUD } from './game/hud.js';
import { sndLinea, sndFijar, sndGameOver } from './game/sounds.js';
import { crearInterfazHTML, mostrarMenu, mostrarGameOver, ocultarGameOver } from './game/menu.js';
import { setupCyberpunkAmbience } from './render/ambientacion.js';

let scene, camera, renderer, controls;
let composer;
let ambience, customRender, updateAmbience;
let estado = 'menu';
let boardGroup;
let piezaActual, piezaTipo, piezaRot, piezaPos;
let lastDropTime = 0;
let dropInterval = 800;
let puntaje = 0;
let nivel = 1;
let rotacionX = 0, rotacionY = 0, rotacionZ = 0;

function iniciarJuego() {
    estado = 'juego';
    ocultarGameOver();
    const objetosAEliminar = [];
    scene.traverse((child) => {
        if (child.name === 'decorativo' || child.name === 'logoCuboDecorativo' || child.name === 'cuboFijo') {
            objetosAEliminar.push(child);
        }
    });
    objetosAEliminar.forEach(obj => scene.remove(obj));
    inicializarBoard();
    if (boardGroup) scene.remove(boardGroup);
    boardGroup = crearCuboContenedor();
    scene.add(boardGroup);
    puntaje = 0;
    nivel = 1;
    dropInterval = 800;
    rotacionX = 0;
    rotacionY = 0;
    rotacionZ = 0;
    actualizarHUD(puntaje, nivel, piezaPos);
    nuevaPieza();
    document.addEventListener('keydown', onKeyDown);
    lastDropTime = performance.now();
    mostrarInfoJuego(estado);
}

function crearCuboContenedor() {
    const group = new THREE.Group();
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.3 });
    const puntos = [
        [-BOARD_WIDTH/2, 0, -BOARD_DEPTH/2], [BOARD_WIDTH/2, 0, -BOARD_DEPTH/2],
        [BOARD_WIDTH/2, 0, -BOARD_DEPTH/2], [BOARD_WIDTH/2, 0, BOARD_DEPTH/2],
        [BOARD_WIDTH/2, 0, BOARD_DEPTH/2], [-BOARD_WIDTH/2, 0, BOARD_DEPTH/2],
        [-BOARD_WIDTH/2, 0, BOARD_DEPTH/2], [-BOARD_WIDTH/2, 0, -BOARD_DEPTH/2],
        [-BOARD_WIDTH/2, BOARD_HEIGHT, -BOARD_DEPTH/2], [BOARD_WIDTH/2, BOARD_HEIGHT, -BOARD_DEPTH/2],
        [BOARD_WIDTH/2, BOARD_HEIGHT, -BOARD_DEPTH/2], [BOARD_WIDTH/2, BOARD_HEIGHT, BOARD_DEPTH/2],
        [BOARD_WIDTH/2, BOARD_HEIGHT, BOARD_DEPTH/2], [-BOARD_WIDTH/2, BOARD_HEIGHT, BOARD_DEPTH/2],
        [-BOARD_WIDTH/2, BOARD_HEIGHT, BOARD_DEPTH/2], [-BOARD_WIDTH/2, BOARD_HEIGHT, -BOARD_DEPTH/2],
        [-BOARD_WIDTH/2, 0, -BOARD_DEPTH/2], [-BOARD_WIDTH/2, BOARD_HEIGHT, -BOARD_DEPTH/2],
        [BOARD_WIDTH/2, 0, -BOARD_DEPTH/2], [BOARD_WIDTH/2, BOARD_HEIGHT, -BOARD_DEPTH/2],
        [BOARD_WIDTH/2, 0, BOARD_DEPTH/2], [BOARD_WIDTH/2, BOARD_HEIGHT, BOARD_DEPTH/2],
        [-BOARD_WIDTH/2, 0, BOARD_DEPTH/2], [-BOARD_WIDTH/2, BOARD_HEIGHT, BOARD_DEPTH/2]
    ];
    for (let i = 0; i < puntos.length; i += 2) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(...puntos[i]),
            new THREE.Vector3(...puntos[i + 1])
        ]);
        const line = new THREE.Line(geometry, gridMaterial);
        group.add(line);
    }
    const baseGeometry = new THREE.PlaneGeometry(BOARD_WIDTH, BOARD_DEPTH);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        visible: false
    });
    const basePlane = new THREE.Mesh(baseGeometry, baseMaterial);
    basePlane.rotation.x = -Math.PI / 2;
    basePlane.position.y = 0;
    group.add(basePlane);
    return group;
}

function nuevaPieza() {
    if (piezaActual) scene.remove(piezaActual);
    piezaTipo = Math.floor(Math.random() * TETROMINOS_3D.length);
    rotacionX = 0;
    rotacionY = 0; 
    rotacionZ = 0;
    const shape = TETROMINOS_3D[piezaTipo];
    let maxY = Math.max(...shape.map(([x, y, z]) => y));
    piezaPos = { 
        x: Math.floor(BOARD_WIDTH / 2), 
        y: BOARD_HEIGHT - 1 - maxY,
        z: Math.floor(BOARD_DEPTH / 2) 
    };
    piezaActual = crearPiezaMesh3D(piezaTipo, rotacionX, rotacionY, rotacionZ);
    actualizarPosicionPieza3D();
    scene.add(piezaActual);
}

function actualizarPosicionPieza3D() {
    if (piezaActual) {
        piezaActual.position.set(
            piezaPos.x - BOARD_WIDTH/2 + 0.5, 
            piezaPos.y, 
            piezaPos.z - BOARD_DEPTH/2 + 0.5
        );
    }
}

function onKeyDown(e) {
    const result = manejarTeclas3D(
        e, estado, piezaPos, rotacionX, rotacionY, rotacionZ, piezaTipo,
        (pos, rx, ry, rz) => colisiona3D(piezaTipo, pos || piezaPos, rx ?? rotacionX, ry ?? rotacionY, rz ?? rotacionZ),
        (pos, rx, ry, rz) => {
            piezaPos = pos;
            rotacionX = rx;
            rotacionY = ry;
            rotacionZ = rz;
            scene.remove(piezaActual);
            piezaActual = crearPiezaMesh3D(piezaTipo, rotacionX, rotacionY, rotacionZ);
            actualizarPosicionPieza3D();
            scene.add(piezaActual);
        },
        () => actualizarHUD(puntaje, nivel, piezaPos)
    );
    piezaPos = result.piezaPos;
    rotacionX = result.rotacionX;
    rotacionY = result.rotacionY;
    rotacionZ = result.rotacionZ;
}

function animar(time) {
    requestAnimationFrame(animar);
    
    if (updateAmbience) {
        updateAmbience(time);
    }
    
    if (estado === 'menu') {
        scene.traverse((child) => {
            if (child.name === 'decorativo') {
                child.rotation.x += 0.01;
                child.rotation.y += 0.015;
                child.rotation.z += 0.008;
            } else if (child.name === 'logoCuboDecorativo') {
                child.rotation.y += 0.02;
                child.rotation.x += 0.01;
            }
        });
    }
    if (estado === 'juego') {
        const ahora = performance.now();
        if (ahora - lastDropTime > dropInterval) {
            let nuevaPos = { x: piezaPos.x, y: piezaPos.y - 1, z: piezaPos.z };
            if (!colisiona3D(piezaTipo, nuevaPos, rotacionX, rotacionY, rotacionZ)) {
                piezaPos = nuevaPos;
                actualizarPosicionPieza3D();
                actualizarHUD(puntaje, nivel, piezaPos);
            } else {
                if (colisiona3D(piezaTipo, piezaPos, rotacionX, rotacionY, rotacionZ)) {
                    estado = 'gameover';
                    document.removeEventListener('keydown', onKeyDown);
                    sndGameOver.play();
                    
                    mostrarGameOver(
                        puntaje, 
                        nivel, 
                        () => {
                            iniciarJuego();
                        },
                        () => {
                            estado = 'menu';
                            if (boardGroup) scene.remove(boardGroup);
                            if (piezaActual) scene.remove(piezaActual);
                            
                            const objetosAEliminar = [];
                            scene.traverse((child) => {
                                if (child.name === 'cuboFijo') {
                                    objetosAEliminar.push(child);
                                }
                            });
                            objetosAEliminar.forEach(obj => scene.remove(obj));
                            
                            mostrarMenu3DFondo(scene, crearPiezaMesh3D);
                            mostrarMenu(estado, iniciarJuego);
                        }
                    );
                    return;
                }
                fijarPieza3D(piezaTipo, piezaPos, rotacionX, rotacionY, rotacionZ, scene, undefined, undefined);
                const shape = TETROMINOS_3D[piezaTipo].map(([x, y, z]) => [x, y, z]);
                let rotShape = shape;
                for (let i = 0; i < rotacionX; i++) rotShape = rotShape.map(([x, y, z]) => [x, -z, y]);
                for (let i = 0; i < rotacionY; i++) rotShape = rotShape.map(([x, y, z]) => [z, y, -x]);
                for (let i = 0; i < rotacionZ; i++) rotShape = rotShape.map(([x, y, z]) => [y, -x, z]);
                for (let i = 0; i < rotShape.length; i++) {
                    const [dx, dy, dz] = rotShape[i];
                    const x = piezaPos.x + dx;
                    const y = piezaPos.y + dy;
                    const z = piezaPos.z + dz;
                    if (x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT && z >= 0 && z < BOARD_DEPTH) {
                        const mat = new THREE.MeshStandardMaterial({ 
                            color: COLORS[piezaTipo], 
                            emissive: EMISSIVE[piezaTipo], 
                            emissiveIntensity: 0.3,
                            metalness: 0.7, 
                            roughness: 0.2 
                        });
                        const cubo = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), mat);
                        cubo.position.set(
                            x - BOARD_WIDTH/2 + 0.5, 
                            y, 
                            z - BOARD_DEPTH/2 + 0.5
                        );
                        cubo.castShadow = true;
                        cubo.receiveShadow = true;
                        cubo.name = 'cuboFijo';
                        scene.add(cubo);
                        const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.9, 0.9, 0.9));
                        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
                        line.position.copy(cubo.position);
                        line.name = 'cuboFijo';
                        scene.add(line);
                    }
                }
                sndFijar.play();
                const resultado = eliminarCapasCompletas3D(scene, sndLinea, puntaje, nivel, () => actualizarHUD(puntaje, nivel, piezaPos));
                puntaje = resultado.puntaje;
                nivel = resultado.nivel;
                actualizarHUD(puntaje, nivel, piezaPos);
                nuevaPieza();
            }
            lastDropTime = ahora;
        }
    }
    if (controls) controls.update();
    
    if (customRender) {
    customRender(scene, camera);
    } else {
        composer.render();
    }
    
    mostrarInfoJuego(estado);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

({ scene, camera, renderer, controls } = iniciarEscena());

composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 0.6, 0.9));
const cyberpunkSetup = setupCyberpunkAmbience(scene, renderer);
ambience = cyberpunkSetup.ambience;
customRender = cyberpunkSetup.customRender;
updateAmbience = cyberpunkSetup.update;

mostrarMenu3DFondo(scene, crearPiezaMesh3D);
crearInterfazHTML(iniciarJuego, () => mostrarMenu3DFondo(scene, crearPiezaMesh3D));
mostrarMenu(estado, iniciarJuego);
animar();