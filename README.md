# Tetris 3D

Un juego de Tetris completamente tridimensional desarrollado con Three.js, Vite y JavaScript moderno.

## 🎮 Características

- **Juego 3D completo**: Tetris en espacio tridimensional real
- **10 tipos de piezas 3D**: Incluyendo piezas únicas que no existen en Tetris 2D
- **Controles 3D**: Movimiento y rotación en todos los ejes
- **Efectos visuales**: Post-procesamiento con bloom y efectos cyberpunk
- **Sistema de audio**: Efectos de sonido con Howler.js
- **Interfaz moderna**: Diseño responsive y atractivo

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd Tetris3D

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### Scripts disponibles
- `npm run dev` - Ejecutar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción
- `npm run deploy` - Desplegar a GitHub Pages

## 🎯 Controles

### Movimiento
- **Flechas**: Mover en plano XZ
- **Q/E**: Subir/Bajar (eje Y)
- **Espacio**: Caída rápida

### Rotación
- **W/S**: Rotar en eje X
- **A/D**: Rotar en eje Y
- **Z/C**: Rotar en eje Z

### Cámara
- **Mouse**: Arrastrar para rotar vista
- **Rueda**: Zoom in/out

## 🏗️ Arquitectura del Proyecto

```
src/
├── main.js              # Punto de entrada y lógica principal
├── game/                # Lógica del juego
│   ├── board.js         # Tablero 3D y colisiones
│   ├── tetrominos.js    # Definición de piezas 3D
│   ├── controls.js      # Manejo de controles
│   ├── menu.js          # Interfaz de usuario
│   ├── hud.js           # Información del juego
│   └── sounds.js        # Sistema de audio
├── render/              # Renderizado y gráficos
│   ├── scene.js         # Configuración de escena
│   ├── pieceMesh.js     # Creación de mallas 3D
│   └── ambientacion.js  # Efectos visuales
└── postprocessing/      # Efectos post-procesamiento
    ├── EffectComposer.js
    └── BloomPass.js
```

## 🛠️ Tecnologías Utilizadas

- **Three.js**: Biblioteca 3D para WebGL
- **Vite**: Herramienta de construcción rápida
- **Howler.js**: Manejo de audio
- **JavaScript ES6+**: Módulos y sintaxis moderna

## 🌐 Despliegue en GitHub Pages

### Método 1: Automático (Recomendado)
```bash
npm run deploy
```

### Método 2: Manual
1. Construir el proyecto: `npm run build`
2. Subir la carpeta `dist/` a la rama `gh-pages`
3. Configurar GitHub Pages en la configuración del repositorio

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.

## 👥 Autores

- [Tu Nombre] - Desarrollo principal
- [Nombres del equipo] - Contribuciones

## 🎯 Próximas Mejoras

- [ ] Modo multijugador
- [ ] Más tipos de piezas 3D
- [ ] Sistema de niveles con obstáculos
- [ ] Modo VR
- [ ] Leaderboard online 