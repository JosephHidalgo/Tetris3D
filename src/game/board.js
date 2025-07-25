import { TETROMINOS_3D, rotar3D } from '../game/tetrominos.js';

export const BOARD_WIDTH = 8;
export const BOARD_HEIGHT = 16;
export const BOARD_DEPTH = 8;

export let boardMatrix;
export let cubosFijos = [];

export function inicializarBoard() {
    boardMatrix = [];
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        boardMatrix[y] = [];
        for (let x = 0; x < BOARD_WIDTH; x++) {
            boardMatrix[y][x] = [];
            for (let z = 0; z < BOARD_DEPTH; z++) {
                boardMatrix[y][x][z] = 0;
            }
        }
    }
    cubosFijos = [];
}

export function colisiona3D(piezaTipo, piezaPos, rotacionX, rotacionY, rotacionZ) {
    const shape = rotar3D(TETROMINOS_3D[piezaTipo], rotacionX, rotacionY, rotacionZ);
    for (let i = 0; i < shape.length; i++) {
        const [dx, dy, dz] = shape[i];
        const x = piezaPos.x + dx;
        const y = piezaPos.y + dy;
        const z = piezaPos.z + dz;
        if (x < 0 || x >= BOARD_WIDTH || y < 0 || y >= BOARD_HEIGHT || z < 0 || z >= BOARD_DEPTH) {
            return true;
        }
        if (boardMatrix[y][x][z]) {
            return true;
        }
    }
    return false;
}

export function fijarPieza3D(piezaTipo, piezaPos, rotacionX, rotacionY, rotacionZ, scene, COLORS, EMISSIVE) {
    const shape = rotar3D(TETROMINOS_3D[piezaTipo], rotacionX, rotacionY, rotacionZ);
    for (let i = 0; i < shape.length; i++) {
        const [dx, dy, dz] = shape[i];
        const x = piezaPos.x + dx;
        const y = piezaPos.y + dy;
        const z = piezaPos.z + dz;
        if (x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT && z >= 0 && z < BOARD_DEPTH) {
            boardMatrix[y][x][z] = piezaTipo + 1;
            // Visualización de cubos fijos se maneja en main.js
        }
    }
}

export function eliminarCapasCompletas3D(scene, sndLinea, puntaje, nivel, actualizarHUD) {
    let capasEliminadas = 0;
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        let capaCompleta = true;
        for (let x = 0; x < BOARD_WIDTH && capaCompleta; x++) {
            for (let z = 0; z < BOARD_DEPTH && capaCompleta; z++) {
                if (!boardMatrix[y][x][z]) {
                    capaCompleta = false;
                }
            }
        }
        if (capaCompleta) {
            capasEliminadas++;
            // Visualización de cubos fijos se maneja en main.js
            for (let yy = y; yy < BOARD_HEIGHT - 1; yy++) {
                for (let x = 0; x < BOARD_WIDTH; x++) {
                    for (let z = 0; z < BOARD_DEPTH; z++) {
                        boardMatrix[yy][x][z] = boardMatrix[yy + 1][x][z];
                    }
                }
            }
            for (let x = 0; x < BOARD_WIDTH; x++) {
                for (let z = 0; z < BOARD_DEPTH; z++) {
                    boardMatrix[BOARD_HEIGHT - 1][x][z] = 0;
                }
            }
            y--;
        }
    }
    if (capasEliminadas > 0) {
        sndLinea.play();
        puntaje += capasEliminadas * 200 * nivel;
        if (puntaje >= nivel * 1000) {
            nivel++;
        }
        actualizarHUD();
    }
    return { puntaje, nivel };
}
