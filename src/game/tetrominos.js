export const TETROMINOS_3D = [
    [ [0,0,0], [0,1,0], [0,2,0], [0,3,0] ],
    [ [0,0,0], [1,0,0], [0,1,0], [1,1,0] ],
    [ [0,0,0], [-1,1,0], [0,1,0], [1,1,0] ],
    [ [0,0,0], [0,1,0], [0,2,0], [1,2,0] ],
    [ [0,0,0], [0,1,0], [0,2,0], [-1,2,0] ],
    [ [0,0,0], [1,0,0], [0,1,0], [-1,1,0] ],
    [ [0,0,0], [-1,0,0], [0,1,0], [1,1,0] ],
    [ [0,0,0], [1,0,0], [-1,0,0], [0,0,1], [0,0,-1] ],
    [ [0,0,0], [0,1,0], [0,2,0], [0,0,1] ],
    [ [0,0,0], [1,0,0], [1,1,0], [1,1,1] ]
];

export const COLORS = [0x00e0ff, 0xffff00, 0xaa00ff, 0x00ff00, 0xff0000, 0x0000ff, 0xffa500, 0xff69b4, 0x32cd32, 0xff4500];
export const EMISSIVE = [0x0088ff, 0x888800, 0x660088, 0x008800, 0x880000, 0x000088, 0xaa5500, 0x884477, 0x228844, 0x882200];

export function rotar3D(shape, rotX, rotY, rotZ) {
    let resultado = shape.map(([x, y, z]) => [x, y, z]);
    for (let i = 0; i < rotX; i++) {
        resultado = resultado.map(([x, y, z]) => [x, -z, y]);
    }
    for (let i = 0; i < rotY; i++) {
        resultado = resultado.map(([x, y, z]) => [z, y, -x]);
    }
    for (let i = 0; i < rotZ; i++) {
        resultado = resultado.map(([x, y, z]) => [y, -x, z]);
    }
    return resultado;
}
