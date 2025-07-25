export function crearHUD() {
    let hud = document.getElementById('hud');
    if (!hud) {
        hud = document.createElement('div');
        hud.id = 'hud';
        hud.style.position = 'absolute';
        hud.style.top = '10px';
        hud.style.right = '20px';
        hud.style.color = '#fff';
        hud.style.fontFamily = 'Arial';
        hud.style.fontSize = '1.2em';
        hud.style.zIndex = '2';
        hud.style.background = 'rgba(0,0,0,0.3)';
        hud.style.padding = '10px';
        hud.style.borderRadius = '8px';
        document.body.appendChild(hud);
    }
    let controles = document.getElementById('controles-3d');
    if (!controles) {
        controles = document.createElement('div');
        controles.id = 'controles-3d';
        controles.style.position = 'absolute';
        controles.style.top = '10px';
        controles.style.left = '20px';
        controles.style.color = '#00e0ff';
        controles.style.fontFamily = 'Arial';
        controles.style.fontSize = '0.9em';
        controles.style.zIndex = '2';
        controles.style.background = 'rgba(0,0,0,0.3)';
        controles.style.padding = '10px';
        controles.style.borderRadius = '8px';
        controles.innerHTML = `
            <b>Controles 3D:</b><br>
            ↑↓←→: Mover X,Z<br>
            Q/E: Mover Y<br>
            W/S: Rotar X<br>
            A/D: Rotar Y<br>
            Z/C: Rotar Z<br>
            Espacio: Caída rápida
        `;
        document.body.appendChild(controles);
    }
    let info = document.getElementById('hud-info');
    if (!info) {
        info = document.createElement('div');
        info.id = 'hud-info';
        info.style.position = 'absolute';
        info.style.left = '20px';
        info.style.bottom = '18px';
        info.style.color = '#00e0ff';
        info.style.fontFamily = 'Arial';
        info.style.fontSize = '1.05em';
        info.style.zIndex = '2';
        info.style.background = 'rgba(0,0,0,0.25)';
        info.style.padding = '8px 16px';
        info.style.borderRadius = '10px';
        info.style.pointerEvents = 'none';
        document.body.appendChild(info);
    }
}

export function mostrarInfoJuego(estado) {
    const info = document.getElementById('hud-info');
    const controles = document.getElementById('controles-3d');
    if (info && estado === 'juego') {
        info.innerHTML = `
            <b>Tetris 3D</b><br>
            <span style='color:#aaa;font-size:0.95em;'>Proyecto de Computación Gráfica<br>Verdadero Tetris en espacio 3D</span>
        `;
        info.style.display = 'block';
        if (controles) controles.style.display = 'block';
    } else {
        if (info) info.style.display = 'none';
        if (controles) controles.style.display = 'none';
    }
}

export function actualizarHUD(puntaje, nivel, piezaPos) {
    const hud = document.getElementById('hud');
    if (hud) {
        hud.innerHTML = `
            <b>Puntaje:</b> ${puntaje}<br>
            <b>Nivel:</b> ${nivel}<br>
            <b>Posición:</b><br>
            X: ${piezaPos ? piezaPos.x : 0}<br>
            Y: ${piezaPos ? piezaPos.y : 0}<br>
            Z: ${piezaPos ? piezaPos.z : 0}
        `;
    }
}
