export function manejarTeclas3D(e, estado, piezaPos, rotacionX, rotacionY, rotacionZ, piezaTipo, colisiona3D, actualizarPieza, actualizarHUD) {
    if (estado !== 'juego') return { piezaPos, rotacionX, rotacionY, rotacionZ };
    let nuevaPos = { ...piezaPos };
    let nuevaRotX = rotacionX;
    let nuevaRotY = rotacionY;
    let nuevaRotZ = rotacionZ;
    switch(e.key) {
        case 'ArrowLeft': nuevaPos.x--; break;
        case 'ArrowRight': nuevaPos.x++; break;
        case 'ArrowUp': nuevaPos.z--; break;
        case 'ArrowDown': nuevaPos.z++; break;
        case 'q': case 'Q': nuevaPos.y++; break;
        case 'e': case 'E': nuevaPos.y--; break;
        case 'w': case 'W': nuevaRotX = (rotacionX + 1) % 4; break;
        case 's': case 'S': nuevaRotX = (rotacionX + 3) % 4; break;
        case 'a': case 'A': nuevaRotY = (rotacionY + 1) % 4; break;
        case 'd': case 'D': nuevaRotY = (rotacionY + 3) % 4; break;
        case 'z': case 'Z': nuevaRotZ = (rotacionZ + 1) % 4; break;
        case 'c': case 'C': nuevaRotZ = (rotacionZ + 3) % 4; break;
        case ' ': // Caída rápida
            while (!colisiona3D({ x: piezaPos.x, y: piezaPos.y - 1, z: piezaPos.z })) {
                piezaPos.y--;
            }
            actualizarPieza(piezaPos, rotacionX, rotacionY, rotacionZ);
            return { piezaPos, rotacionX, rotacionY, rotacionZ };
    }
    if (!colisiona3D(nuevaPos, nuevaRotX, nuevaRotY, nuevaRotZ)) {
        piezaPos = nuevaPos;
        rotacionX = nuevaRotX;
        rotacionY = nuevaRotY;
        rotacionZ = nuevaRotZ;
        actualizarPieza(piezaPos, rotacionX, rotacionY, rotacionZ);
        actualizarHUD();
    }
    return { piezaPos, rotacionX, rotacionY, rotacionZ };
}
