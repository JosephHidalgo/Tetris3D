import { COLORS, EMISSIVE, rotar3D, TETROMINOS_3D } from '../game/tetrominos.js';
import * as THREE from 'three';

export function crearPiezaMesh3D(tipo, rotX, rotY, rotZ) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ 
        color: COLORS[tipo],
        emissive: EMISSIVE[tipo], // Esto hace que brillen
        emissiveIntensity: 0.3,   // Ajusta la intensidad
        metalness: 0.7,
        roughness: 0.2
    });
    const shape = rotar3D(TETROMINOS_3D[tipo], rotX, rotY, rotZ);
    for (let i = 0; i < shape.length; i++) {
        const [dx, dy, dz] = shape[i];
        const cubo = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), mat);
        cubo.position.set(dx, dy, dz);
        cubo.castShadow = true;
        cubo.receiveShadow = true;
        group.add(cubo);
        const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.9, 0.9, 0.9));
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
        line.position.copy(cubo.position);
        group.add(line);
    }
    return group;
}
