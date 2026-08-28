import * as THREE from 'three';
import { createStoreTunnel } from './storeTunnel.js';
import { createFloatingProducts } from './floatingProducts.js';
import { createCartAnimation } from './cartAnimation.js';

export class SupermarketScene {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.targetScroll = 0;
    this.currentScroll = 0;
    this.mouseX = 0;
    this.mouseY = 0;

    this.init();
  }

  init() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060709);
    this.scene.fog = new THREE.FogExp2(0x060709, 0.014);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(55, this.width / this.height, 0.1, 400);
    this.camera.position.set(0, 1.8, 45);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting
    this.setupLighting();

    // 5. Store Geometry & Layers
    this.tunnel = createStoreTunnel(this.scene);
    this.floatingProducts = createFloatingProducts(this.scene);
    this.cartManager = createCartAnimation(this.scene);

    // 6. Event Listeners
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));

    // 7. Start Render Loop
    this.clock = new THREE.Clock();
    this.animate();
  }

  setupLighting() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambient);

    // Main entrance warm flood light
    const entranceLight = new THREE.SpotLight(0xffffff, 2.5, 60, Math.PI / 4, 0.5);
    entranceLight.position.set(0, 15, 30);
    entranceLight.target.position.set(0, 2, 10);
    this.scene.add(entranceLight);
    this.scene.add(entranceLight.target);

    // Aisle Traveling Follow Light
    this.followLight = new THREE.PointLight(0xffffff, 2.2, 35);
    this.followLight.position.set(0, 3, 40);
    this.scene.add(this.followLight);
  }

  onMouseMove(e) {
    this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  setScrollProgress(progress) {
    this.targetScroll = Math.min(Math.max(progress, 0), 1);
  }

  updateCamera(delta) {
    // Smooth lerp for buttery camera transition
    this.currentScroll = THREE.MathUtils.lerp(this.currentScroll, this.targetScroll, 0.08);
    const p = this.currentScroll;

    // Calculate camera Z along the hypermarket store
    // Exterior: p = 0 -> z = 45
    // Entrance: p = 0.12 -> z = 12
    // Fresh: p = 0.25 -> z = -32
    // Bakery: p = 0.35 -> z = -70
    // Grocery: p = 0.48 -> z = -115
    // Meat/Fish: p = 0.58 -> z = -160
    // Home: p = 0.68 -> z = -200
    // Family: p = 0.74 -> z = -240
    // Cart Hero: p = 0.82 -> z = -262
    // Pullback to EXTRA logo: p = 0.86 -> z = -250 (pulls back)
    // End: p = 1.0 -> stays gracefully in background

    let targetZ = 45;
    let targetY = 1.8;
    let targetX = 0;
    let lookTargetZ = targetZ - 20;

    if (p <= 0.12) {
      const t = p / 0.12;
      targetZ = THREE.MathUtils.lerp(45, 12, t);
      targetY = THREE.MathUtils.lerp(2.5, 1.8, t);
    } else if (p <= 0.75) {
      // Travel smoothly through all departments
      const t = (p - 0.12) / 0.63;
      targetZ = THREE.MathUtils.lerp(12, -245, t);
      // Gentle subtle curve to simulate walking
      targetX = Math.sin(t * Math.PI * 4) * 0.45;
      targetY = 1.75 + Math.sin(t * Math.PI * 8) * 0.05;
    } else if (p <= 0.83) {
      // Move up to the shopping cart
      const t = (p - 0.75) / 0.08;
      targetZ = THREE.MathUtils.lerp(-245, -263, t);
      targetY = THREE.MathUtils.lerp(1.75, 1.2, t);
      targetX = 0;
    } else if (p <= 0.88) {
      // Climax pull back to reveal the full EXTRA constellation logo
      const t = (p - 0.83) / 0.05;
      targetZ = THREE.MathUtils.lerp(-263, -246, t);
      targetY = THREE.MathUtils.lerp(1.2, 2.8, t);
      targetX = 0;
    } else {
      // Past 0.88 stays at wide cinematic logo overview
      targetZ = -246;
      targetY = 2.8;
      targetX = 0;
    }

    lookTargetZ = targetZ - 18;

    // Apply mouse parallax
    const mouseInfluenceX = this.mouseX * 0.4;
    const mouseInfluenceY = -this.mouseY * 0.25;

    this.camera.position.x = targetX + mouseInfluenceX;
    this.camera.position.y = targetY + mouseInfluenceY;
    this.camera.position.z = targetZ;

    this.camera.lookAt(mouseInfluenceX * 0.5, targetY * 0.9, lookTargetZ);

    // Follow light moves with camera
    this.followLight.position.set(this.camera.position.x, this.camera.position.y + 1.5, this.camera.position.z - 4);

    // Update submodules
    this.tunnel.updateDoors(p);
    this.cartManager.updateTimeline(p);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    this.updateCamera(delta);
    this.floatingProducts.animate(elapsedTime);

    this.renderer.render(this.scene, this.camera);
  }
}
