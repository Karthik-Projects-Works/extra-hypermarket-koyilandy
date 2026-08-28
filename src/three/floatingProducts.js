import * as THREE from 'three';

export function createFloatingProducts(scene) {
  const productsGroup = new THREE.Group();
  const productItems = [];

  // Helper to create stylized 3D procedural product meshes
  const createVeggie = (type, x, y, z) => {
    const itemGroup = new THREE.Group();
    itemGroup.position.set(x, y, z);

    if (type === 'broccoli') {
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.8 });
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 0.8, 8), stemMat);
      const headMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9, flatShading: true });
      const head = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65, 1), headMat);
      head.position.y = 0.55;
      itemGroup.add(stem, head);
    } else if (type === 'apple') {
      const appleMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2, metalness: 0.1 });
      const apple = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), appleMat);
      apple.scale.set(1, 0.9, 1);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 6), stemMat);
      stem.position.y = 0.5;
      itemGroup.add(apple, stem);
    } else if (type === 'milk') {
      const cartonMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
      const carton = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 0.6), cartonMat);
      const capMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 8), capMat);
      cap.position.set(0, 0.65, 0);
      itemGroup.add(carton, cap);
    }

    productsGroup.add(itemGroup);
    productItems.push({
      mesh: itemGroup,
      baseY: y,
      baseZ: z,
      rotSpeedX: (Math.random() - 0.5) * 0.02,
      rotSpeedY: (Math.random() - 0.5) * 0.02,
      floatOffset: Math.random() * Math.PI * 2
    });
  };

  const createBakeryItem = (type, x, y, z) => {
    const itemGroup = new THREE.Group();
    itemGroup.position.set(x, y, z);

    if (type === 'bread') {
      const breadMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
      const bread = new THREE.Mesh(new THREE.CapsuleGeometry(0.45, 1.2, 8, 16), breadMat);
      bread.rotation.z = Math.PI / 2;
      itemGroup.add(bread);
    } else if (type === 'croissant') {
      const cMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
      const torus = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.22, 10, 24, Math.PI * 1.2), cMat);
      torus.rotation.x = Math.PI / 2;
      itemGroup.add(torus);
    }

    productsGroup.add(itemGroup);
    productItems.push({
      mesh: itemGroup,
      baseY: y,
      baseZ: z,
      rotSpeedX: (Math.random() - 0.5) * 0.02,
      rotSpeedY: (Math.random() - 0.5) * 0.02,
      floatOffset: Math.random() * Math.PI * 2
    });
  };

  const createGroceryItem = (type, x, y, z) => {
    const itemGroup = new THREE.Group();
    itemGroup.position.set(x, y, z);

    if (type === 'rice-bag') {
      const bagMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.7 });
      const bag = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.3, 0.5), bagMat);
      itemGroup.add(bag);
    } else if (type === 'oil-bottle') {
      const bottleMat = new THREE.MeshPhysicalMaterial({ color: 0xeab308, transmission: 0.6, roughness: 0.2 });
      const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 1.4, 12), bottleMat);
      itemGroup.add(bottle);
    } else if (type === 'spice-jar') {
      const jarMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
      const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.7, 12), jarMat);
      itemGroup.add(jar);
    }

    productsGroup.add(itemGroup);
    productItems.push({
      mesh: itemGroup,
      baseY: y,
      baseZ: z,
      rotSpeedX: (Math.random() - 0.5) * 0.02,
      rotSpeedY: (Math.random() - 0.5) * 0.02,
      floatOffset: Math.random() * Math.PI * 2
    });
  };

  const createHomeItem = (type, x, y, z) => {
    const itemGroup = new THREE.Group();
    itemGroup.position.set(x, y, z);

    if (type === 'pan') {
      const panMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.8, roughness: 0.3 });
      const panBase = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.6, 0.25, 20), panMat);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 1.1), handleMat);
      handle.position.set(0, 0.05, 1.1);
      itemGroup.add(panBase, handle);
    } else if (type === 'kettle') {
      const kMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, metalness: 0.7, roughness: 0.2 });
      const kettle = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), kMat);
      itemGroup.add(kettle);
    }

    productsGroup.add(itemGroup);
    productItems.push({
      mesh: itemGroup,
      baseY: y,
      baseZ: z,
      rotSpeedX: (Math.random() - 0.5) * 0.02,
      rotSpeedY: (Math.random() - 0.5) * 0.02,
      floatOffset: Math.random() * Math.PI * 2
    });
  };

  const createToyItem = (x, y, z) => {
    const itemGroup = new THREE.Group();
    itemGroup.position.set(x, y, z);

    const blockMat1 = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3 });
    const blockMat2 = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), blockMat1);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), blockMat2);
    b2.position.set(0.2, 0.4, 0);
    b2.rotation.y = 0.4;
    itemGroup.add(b1, b2);

    productsGroup.add(itemGroup);
    productItems.push({
      mesh: itemGroup,
      baseY: y,
      baseZ: z,
      rotSpeedX: 0.015,
      rotSpeedY: 0.02,
      floatOffset: Math.random() * Math.PI * 2
    });
  };

  // Populate floating products along the aisle path
  // Fresh section (z: -18 to -45)
  createVeggie('broccoli', -2.8, 0.5, -22);
  createVeggie('apple', 2.6, 0.8, -26);
  createVeggie('milk', -2.2, 0.2, -32);
  createVeggie('apple', -2.7, 1.2, -38);
  createVeggie('broccoli', 2.5, 0.4, -42);

  // Bakery (z: -55 to -85)
  createBakeryItem('bread', -2.4, 0.7, -60);
  createBakeryItem('croissant', 2.5, 0.9, -68);
  createBakeryItem('bread', 2.3, 0.3, -76);
  createBakeryItem('croissant', -2.6, 0.8, -82);

  // Grocery (z: -95 to -135)
  createGroceryItem('rice-bag', -2.5, 0.4, -100);
  createGroceryItem('oil-bottle', 2.4, 0.8, -108);
  createGroceryItem('spice-jar', -2.3, 1.1, -116);
  createGroceryItem('rice-bag', 2.6, 0.5, -125);
  createGroceryItem('oil-bottle', -2.5, 0.7, -132);

  // Home (z: -185 to -215)
  createHomeItem('pan', -2.6, 0.6, -190);
  createHomeItem('kettle', 2.4, 0.9, -200);
  createHomeItem('pan', 2.5, 0.4, -210);

  // Family (z: -225 to -255)
  createToyItem(-2.4, 0.8, -230);
  createToyItem(2.5, 0.6, -240);
  createToyItem(-2.2, 1.0, -250);

  // Bakery Steam Particle System
  const steamCount = 60;
  const steamGeo = new THREE.BufferGeometry();
  const steamPos = new Float32Array(steamCount * 3);
  for (let i = 0; i < steamCount; i++) {
    steamPos[i * 3] = -2.4 + (Math.random() - 0.5) * 1.5;
    steamPos[i * 3 + 1] = 0.5 + Math.random() * 2.5;
    steamPos[i * 3 + 2] = -65 + (Math.random() - 0.5) * 10;
  }
  steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));
  const steamMat = new THREE.PointsMaterial({
    color: 0xffedd5,
    size: 0.25,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending
  });
  const steamParticles = new THREE.Points(steamGeo, steamMat);
  productsGroup.add(steamParticles);

  scene.add(productsGroup);

  return {
    productsGroup,
    animate: (time) => {
      // Floating wave animation
      productItems.forEach((item) => {
        item.mesh.position.y = item.baseY + Math.sin(time * 2 + item.floatOffset) * 0.18;
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
      });

      // Animate bakery steam rising
      const pos = steamParticles.geometry.attributes.position.array;
      for (let i = 1; i < steamCount * 3; i += 3) {
        pos[i] += 0.015;
        if (pos[i] > 3.5) {
          pos[i] = 0.5;
        }
      }
      steamParticles.geometry.attributes.position.needsUpdate = true;
    }
  };
}
