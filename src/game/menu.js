export function crearInterfazHTML(iniciarJuego, mostrarMenu3DFondo) {
    let menuPrincipal = document.getElementById('main-menu');
    if (!menuPrincipal) {
        menuPrincipal = document.createElement('div');
        menuPrincipal.id = 'main-menu';
        menuPrincipal.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10;
            font-family: Arial, sans-serif;
            color: white;
        `;
        menuPrincipal.innerHTML = `
            <h1 style="font-size: 4em; margin: 0; color: #00e0ff; text-shadow: 0 0 20px #00e0ff;">
                TETRIS 3D
            </h1>
            <p style="font-size: 1.5em; margin: 20px 0; text-align: center; color: #aaa;">
                ¡Experimenta Tetris en verdadero espacio tridimensional!
            </p>
            <button id="btn-jugar" style="
                font-size: 1.5em;
                padding: 15px 30px;
                background: linear-gradient(45deg, #00e0ff, #0080ff);
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                margin: 10px;
                box-shadow: 0 4px 15px rgba(0,224,255,0.3);
                transition: all 0.3s ease;
            ">
                🎮 JUGAR
            </button>
            <div style="margin-top: 30px; text-align: center; color: #888; font-size: 0.9em;">
                <p><strong>Controles 3D:</strong></p>
                <p>↑↓←→: Mover en plano XZ | Q/E: Subir/Bajar | W/S: Rotar X</p>
                <p>A/D: Rotar Y | Z/C: Rotar Z | Espacio: Caída rápida</p>
            </div>
        `;
        document.body.appendChild(menuPrincipal);
        const btnJugar = document.getElementById('btn-jugar');
        btnJugar.addEventListener('mouseenter', () => {
            btnJugar.style.transform = 'scale(1.05)';
            btnJugar.style.boxShadow = '0 6px 20px rgba(0,224,255,0.5)';
        });
        btnJugar.addEventListener('mouseleave', () => {
            btnJugar.style.transform = 'scale(1)';
            btnJugar.style.boxShadow = '0 4px 15px rgba(0,224,255,0.3)';
        });
    }
    let panelGameOver = document.getElementById('gameover-panel');
    if (!panelGameOver) {
        panelGameOver = document.createElement('div');
        panelGameOver.id = 'gameover-panel';
        panelGameOver.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255,0,0,0.1);
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 15;
            font-family: Arial, sans-serif;
            color: white;
        `;
        panelGameOver.innerHTML = `
            <h1 style="font-size: 3em; margin: 0; color: #ff4444; text-shadow: 0 0 20px #ff4444;">
                GAME OVER
            </h1>
            <div id="puntaje-final" style="font-size: 1.5em; margin: 20px 0; text-align: center;"></div>
            <button id="btn-reiniciar" style="
                font-size: 1.3em;
                padding: 12px 25px;
                background: linear-gradient(45deg, #ff4444, #ff6666);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                margin: 10px;
                box-shadow: 0 4px 15px rgba(255,68,68,0.3);
                transition: all 0.3s ease;
            ">
                🔄 REINTENTAR
            </button>
            <button id="btn-menu" style="
                font-size: 1.1em;
                padding: 10px 20px;
                background: rgba(255,255,255,0.1);
                color: white;
                border: 1px solid rgba(255,255,255,0.3);
                border-radius: 6px;
                cursor: pointer;
                margin: 5px;
                transition: all 0.3s ease;
            ">
                📋 MENÚ PRINCIPAL
            </button>
        `;
        document.body.appendChild(panelGameOver);
    }
}

export function mostrarMenu(estado, iniciarJuego) {
    estado = 'menu';
    const menu = document.getElementById('main-menu');
    if (menu) menu.style.display = 'flex';
    const btnJugar = document.getElementById('btn-jugar');
    if (btnJugar) {
        btnJugar.onclick = () => {
            menu.style.display = 'none';
            iniciarJuego();
        };
    }
}

export function gameOver(sndGameOver, puntaje, nivel, renderer, scene, boardGroup, piezaActual, mostrarMenu3DFondo, mostrarMenu, iniciarJuego) {
    sndGameOver.play();
    const panel = document.getElementById('gameover-panel');
    const puntajeFinal = document.getElementById('puntaje-final');
    if (panel && puntajeFinal) {
        puntajeFinal.innerHTML = `
            <p>Puntaje Final: <strong>${puntaje}</strong></p>
            <p>Nivel Alcanzado: <strong>${nivel}</strong></p>
        `;
        panel.style.display = 'flex';
    }
    if (renderer && renderer.domElement) {
        renderer.domElement.style.filter = 'blur(2px) brightness(0.7) drop-shadow(0 0 60px #ff2222)';
    }
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const btnMenu = document.getElementById('btn-menu');
    if (btnReiniciar) {
        btnReiniciar.onclick = () => {
            if (renderer && renderer.domElement) renderer.domElement.style.filter = '';
            panel.style.display = 'none';
            iniciarJuego();
        };
    }
    if (btnMenu) {
        btnMenu.onclick = () => {
            if (renderer && renderer.domElement) renderer.domElement.style.filter = '';
            panel.style.display = 'none';
            // Limpiar escena y volver al menú
            const objetosAEliminar = [];
            scene.traverse((child) => {
                if (child.name === 'cuboFijo' || (boardGroup && child.parent === boardGroup)) {
                    objetosAEliminar.push(child);
                }
            });
            objetosAEliminar.forEach(obj => scene.remove(obj));
            if (boardGroup) scene.remove(boardGroup);
            if (piezaActual) scene.remove(piezaActual);
            mostrarMenu3DFondo();
            mostrarMenu();
        };
    }
}

export function mostrarGameOver(puntaje, nivel, onReiniciar, onVolverMenu) {
    ocultarGameOver();
    
    const gameOverContainer = document.createElement('div');
    gameOverContainer.id = 'gameOverContainer';
    gameOverContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(45deg, rgba(0, 0, 0, 0.95), rgba(10, 0, 20, 0.95));
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        font-family: 'Courier New', monospace;
        backdrop-filter: blur(8px);
        overflow: hidden;
    `;

    const gameOverPanel = document.createElement('div');
    gameOverPanel.style.cssText = `
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 0, 40, 0.9));
        border: 2px solid #ff0080;
        border-radius: 0;
        padding: 50px;
        text-align: center;
        box-shadow: 
            0 0 100px rgba(255, 0, 128, 0.5),
            inset 0 0 50px rgba(0, 255, 255, 0.1);
        max-width: 600px;
        width: 90%;
        position: relative;
        animation: cyberpunkGlitch 0.8s ease-out;
        clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
    `;

    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        @keyframes cyberpunkGlitch {
            0% {
                transform: translateX(-100vw) rotateY(90deg);
                filter: hue-rotate(0deg);
            }
            20% {
                transform: translateX(0) rotateY(0deg);
                filter: hue-rotate(180deg);
            }
            30% {
                transform: translateX(-10px);
                filter: hue-rotate(0deg);
            }
            40% {
                transform: translateX(10px);
                filter: hue-rotate(90deg);
            }
            50% {
                transform: translateX(0);
                filter: hue-rotate(0deg);
            }
            100% {
                transform: translateX(0) rotateY(0deg);
                filter: hue-rotate(0deg);
            }
        }
        
        @keyframes neonPulse {
            0%, 100% { 
                text-shadow: 
                    0 0 5px #ff0080,
                    0 0 10px #ff0080,
                    0 0 15px #ff0080,
                    0 0 20px #ff0080;
            }
            50% { 
                text-shadow: 
                    0 0 10px #ff0080,
                    0 0 20px #ff0080,
                    0 0 30px #ff0080,
                    0 0 40px #ff0080;
            }
        }
        
        @keyframes dataStream {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        
        .cyberpunk-title {
            font-family: 'Orbitron', monospace;
            font-weight: 900;
            letter-spacing: 8px;
            animation: neonPulse 2s infinite;
        }
        
        .cyber-button {
            background: linear-gradient(45deg, transparent, rgba(255, 0, 128, 0.2), transparent);
            border: 2px solid #00ffff;
            color: #00ffff;
            padding: 18px 35px;
            margin: 15px;
            font-family: 'Orbitron', monospace;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 2px;
            position: relative;
            overflow: hidden;
            clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
        }
        
        .cyber-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.4), transparent);
            transition: left 0.5s;
        }
        
        .cyber-button:hover::before {
            left: 100%;
        }
        
        .cyber-button:hover {
            transform: translateY(-2px);
            box-shadow: 
                0 10px 30px rgba(0, 255, 255, 0.3),
                0 0 20px rgba(255, 0, 128, 0.5);
            border-color: #ff0080;
            color: #ff0080;
        }
        
        .cyber-button:active {
            transform: translateY(0);
        }
        
        .data-panel {
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(255, 0, 128, 0.05));
            border: 1px solid rgba(0, 255, 255, 0.3);
            padding: 25px;
            margin: 25px 0;
            position: relative;
            clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
            animation: dataStream 0.8s ease-out 0.3s both;
        }
        
        .data-panel::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, #00ffff, transparent);
            animation: scanLine 2s infinite;
        }
        
        @keyframes scanLine {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
        }
        
        .stat-value {
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            font-size: 24px;
            text-shadow: 0 0 10px currentColor;
        }
        
        .glitch-text {
            position: relative;
            display: inline-block;
        }
        
        .glitch-text::before {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            color: #ff0080;
            opacity: 0.8;
            clip: rect(0, 900px, 0, 0);
            animation: glitch1 0.1s infinite linear alternate-reverse;
        }
        
        @keyframes glitch1 {
            0% { clip: rect(42px, 9999px, 44px, 0); }
            100% { clip: rect(12px, 9999px, 59px, 0); }
        }
    `;
    document.head.appendChild(style);

    gameOverPanel.innerHTML = `
        <div style="position: absolute; top: 10px; left: 10px; color: #00ffff; font-size: 12px; opacity: 0.7;">
            SYSTEM_ERROR_404
        </div>
        
        <h1 class="cyberpunk-title glitch-text" data-text="TERMINAL FAILURE" style="
            color: #ff0080; 
            font-size: 42px; 
            margin: 0 0 30px 0;
        ">
            TERMINAL FAILURE
        </h1>
        
        <div class="data-panel">
            <h2 style="color: #00ffff; margin: 0 0 20px 0; font-size: 18px; font-family: 'Orbitron', monospace; letter-spacing: 3px;">
                [[ FINAL DATA DUMP ]]
            </h2>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="color: #888; font-size: 14px; margin-bottom: 5px;">SCORE_VALUE:</div>
                    <div class="stat-value" style="color: #00ff41;">${puntaje.toLocaleString()}</div>
                </div>
                <div style="color: #ff0080; font-size: 20px;">|</div>
                <div>
                    <div style="color: #888; font-size: 14px; margin-bottom: 5px;">LEVEL_REACHED:</div>
                    <div class="stat-value" style="color: #ffff00;">${nivel}</div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 35px;">
            <button id="btnReiniciar" class="cyber-button">
                RESTART_SYSTEM
            </button>
            <button id="btnVolverMenu" class="cyber-button">
                EXIT_TO_MAIN
            </button>
        </div>
        
        <div style="margin-top: 25px; padding: 15px; border-top: 1px solid rgba(0, 255, 255, 0.2);">
            <p style="color: #666; font-size: 12px; font-family: 'Courier New', monospace; letter-spacing: 1px;">
                [SPACE] RESTART_PROTOCOL // [ESC] RETURN_TO_MAINFRAME
            </p>
        </div>
        
        <div style="position: absolute; bottom: 10px; right: 15px; color: #ff0080; font-size: 10px; opacity: 0.6;">
            TETRIS_v3.7.2_BETA
        </div>
    `;

    gameOverContainer.appendChild(gameOverPanel);
    document.body.appendChild(gameOverContainer);

    document.getElementById('btnReiniciar').addEventListener('click', () => {
        ocultarGameOver();
        onReiniciar();
    });

    document.getElementById('btnVolverMenu').addEventListener('click', () => {
        ocultarGameOver();
        onVolverMenu();
    });

    const handleKeyPress = (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            ocultarGameOver();
            onReiniciar();
            document.removeEventListener('keydown', handleKeyPress);
        } else if (e.code === 'Escape') {
            e.preventDefault();
            ocultarGameOver();
            onVolverMenu();
            document.removeEventListener('keydown', handleKeyPress);
        }
    };

    document.addEventListener('keydown', handleKeyPress);
    gameOverContainer.handleKeyPress = handleKeyPress;
}

export function ocultarGameOver() {
    const existingContainer = document.getElementById('gameOverContainer');
    if (existingContainer) {
        if (existingContainer.handleKeyPress) {
            document.removeEventListener('keydown', existingContainer.handleKeyPress);
        }
        existingContainer.remove();
    }
}
// Función auxiliar para evaluar el rendimiento
function evaluarRendimiento(puntaje, nivel) {
    if (puntaje >= 50000) return { mensaje: "¡INCREÍBLE!", color: "#gold" };
    if (puntaje >= 25000) return { mensaje: "¡Excelente!", color: "#00ff00" };
    if (puntaje >= 10000) return { mensaje: "¡Muy Bien!", color: "#00ffff" };
    if (puntaje >= 5000) return { mensaje: "¡Bien Hecho!", color: "#ffff00" };
    return { mensaje: "¡Sigue Intentando!", color: "#ff8800" };
}


