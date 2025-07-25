import * as THREE from 'three';

export class CyberpunkAmbience {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;
        this.particles = [];
        this.lights = [];
        
        this.setupRenderer();
        this.createBackground();
        this.createLighting();
        this.createFog();
        //this.createParticles();
        this.createFloor();
    }

    setupRenderer() {
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.renderer.setClearColor(0x000000, 1);
    }

    createBackground() {
        const vertexShader = `
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            varying vec2 vUv;
            varying vec3 vPosition;
            uniform float time;
            
            void main() {
                vec2 center = vec2(0.5, 0.7);
                float dist = distance(vUv, center);
                
                vec3 colorTop = vec3(0.0, 0.0, 0.0);
                vec3 colorMid = vec3(0.02, 0.02, 0.08);
                vec3 colorBottom = vec3(0.05, 0.02, 0.12);
                
                float factor1 = smoothstep(0.0, 0.3, vUv.y);
                float factor2 = smoothstep(0.3, 1.0, vUv.y);
                
                vec3 color = mix(colorTop, colorMid, factor1);
                color = mix(color, colorBottom, factor2);
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        const backgroundGeometry = new THREE.PlaneGeometry(2, 2);
        this.backgroundMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader,
            fragmentShader,
            depthWrite: false,
            depthTest: false
        });

        const backgroundMesh = new THREE.Mesh(backgroundGeometry, this.backgroundMaterial);
        backgroundMesh.renderOrder = -1;
        
        this.backgroundScene = new THREE.Scene();
        this.backgroundCamera = new THREE.Camera();
        this.backgroundScene.add(backgroundMesh);
        this.backgroundScene.add(this.backgroundCamera);
    }

    createLighting() {
        const ambientLight = new THREE.AmbientLight(0x0a0520, 0.3);
        this.scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0x4a20aa, 0.4);
        mainLight.position.set(10, 15, 10);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 100;
        mainLight.shadow.camera.left = -50;
        mainLight.shadow.camera.right = 50;
        mainLight.shadow.camera.top = 50;
        mainLight.shadow.camera.bottom = -50;
        mainLight.shadow.bias = -0.0001;
        this.scene.add(mainLight);
        this.lights.push(mainLight);

        const rimLight1 = new THREE.DirectionalLight(0x00aaff, 0.2);
        rimLight1.position.set(-10, 8, -10);
        this.scene.add(rimLight1);
        this.lights.push(rimLight1);

        const rimLight2 = new THREE.DirectionalLight(0x9b59b6, 0.2);
        rimLight2.position.set(5, 5, -15);
        this.scene.add(rimLight2);
        this.lights.push(rimLight2);

        const fillLight = new THREE.DirectionalLight(0x3a3a5c, 0.15);
        fillLight.position.set(0, -5, 5);
        this.scene.add(fillLight);
        this.lights.push(fillLight);
    }

    createFog() {
        this.scene.fog = new THREE.Fog(0x000000, 30, 120);
    }

    createFloor() {
        const floorGeometry = new THREE.CircleGeometry(28, 64);
        
        const floorMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                centerColor: { value: new THREE.Color(0x1a0f2e) },
                edgeColor: { value: new THREE.Color(0x000000) } // Negro para bordes
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vWorldPosition;
                void main() {
                    vUv = uv;
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 centerColor;
                uniform vec3 edgeColor;
                varying vec2 vUv;
                varying vec3 vWorldPosition;
                
                void main() {
                    vec2 center = vec2(0.5);
                    float dist = distance(vUv, center);
                    
                    vec3 centerColor = vec3(0.8, 0.2, 1.0);
                    vec3 midColor = vec3(0.4, 0.6, 1.0);
                    vec3 edgeColor = vec3(0.0, 0.8, 1.0);
                    
                    float factor1 = smoothstep(0.0, 0.6, dist);
                    float factor2 = smoothstep(0.6, 0.8, dist);
                    
                    vec3 color = mix(centerColor, midColor, factor1);
                    color = mix(color, edgeColor, factor2);
                    
                    float fadeOut = exp(-dist * 4.0);;
                    color *= fadeOut;
                    
                    float pulse = sin(time * 0.003) * 0.1 + 0.9;
                    color *= pulse;
                    
                    gl_FragColor = vec4(color, fadeOut * 0.9);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -1;
        floor.receiveShadow = true;
        this.scene.add(floor);
        this.floorMaterial = floorMaterial;
    }

    createParticles() {
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 150;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 120;
            positions[i * 3 + 1] = Math.random() * 60 + 5;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 120;

            const colorChoice = Math.random();
            let color;
            if (colorChoice < 0.4) {
                color = new THREE.Color(0x6a4c93);
            } else if (colorChoice < 0.7) {
                color = new THREE.Color(0x4a90e2);
            } else {
                color = new THREE.Color(0x9b59b6);
            }
            
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            sizes[i] = Math.random() * 0.3 + 0.1;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.2,
            transparent: true,
            opacity: 0.4,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particleSystem);
    }

    animateParticles(time) {
        if (this.particleSystem) {
            const positions = this.particleSystem.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(time * 0.0005 + positions[i] * 0.01) * 0.02;
                positions[i] += Math.cos(time * 0.0003 + positions[i + 2] * 0.01) * 0.01;
                
                if (positions[i + 1] > 65) {
                    positions[i + 1] = 5;
                }
            }
            
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
            this.particleSystem.rotation.y = time * 0.00005;
        }
    }

    renderBackground() {
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.clear(true, false, false);
        this.renderer.render(this.backgroundScene, this.backgroundCamera);
    }

    animateLights(time) {
        this.lights.forEach((light, index) => {
            if (light.type === 'DirectionalLight' && index > 0) {
                const baseIntensity = [0.3, 0.2, 0.15][index - 1] || 0.1;
                light.intensity = baseIntensity + Math.sin(time * 0.001 + index * 2) * 0.05;
            }
        });
    }

    update(time) {
        //this.animateParticles(time);
        this.animateLights(time);
        
        if (this.backgroundMaterial) {
            this.backgroundMaterial.uniforms.time.value = time;
        }
        
        if (this.floorMaterial) {
            this.floorMaterial.uniforms.time.value = time;
        }
    }

    setAmbientIntensity(intensity) {
        this.lights.forEach(light => {
            light.intensity *= intensity;
        });
        
        if (this.particleSystem) {
            this.particleSystem.material.opacity = 0.4 * intensity;
        }
    }
}

export function setupCyberpunkAmbience(scene, renderer) {
    const ambience = new CyberpunkAmbience(scene, renderer);
    
    function customRender(scene, camera) {
        ambience.renderBackground();
        renderer.render(scene, camera);
    }
    
    return {
        ambience,
        customRender,
        update: (time) => ambience.update(time)
    };
}