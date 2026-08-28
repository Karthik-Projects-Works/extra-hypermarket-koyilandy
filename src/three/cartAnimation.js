import * as THREE from 'three';

export function createCartAnimation(scene) {
  const cartGroup = new THREE.Group();
  cartGroup.position.set(0, -0.6, -268);
  cartGroup.scale.set(0.001, 0.001, 0.001); // starts hidden

  // Materials
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.15
  });

  const redAccentMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    metalness: 0.4,
    roughness: 0.3
  });

  const blackRubberMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.8
  });

  // 1. Cart Basket Wireframe
  const basketGeo = new THREE.BoxGeometry(1.6, 1.1, 2.2);
  const wireGeo = new THREE.WireframeGeometry(basketGeo);
  const basketLines = new THREE.LineSegments(
    wireGeo,
    new THREE.LineBasicMaterial({ color: 0x94a3b8, linewidth: 2 })
  );
  basketLines.position.y = 1.1;
  cartGroup.add(basketLines);

  // Bottom base plate
  const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 2.1), chromeMat);
  baseMesh.position.y = 0.55;
  cartGroup.add(baseMesh);

  // 2. Handle Bar
  const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.7, 12), redAccentMat);
  handleBar.rotation.z = Math.PI / 2;
  handleBar.position.set(0, 1.7, 1.15);
  cartGroup.add(handleBar);

  // Handle Supports
  const suppL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8), chromeMat);
  suppL.position.set(-0.8, 1.4, 0.9);
  suppL.rotation.x = -0.4;
  cartGroup.add(suppL);

  const suppR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8), chromeMat);
  suppR.position.set(0.8, 1.4, 0.9);
  suppR.rotation.x = -0.4;
  cartGroup.add(suppR);

  // 3. Four Wheels
  const wheelPositions = [
    [-0.7, 0.2, 0.8],
    [0.7, 0.2, 0.8],
    [-0.7, 0.2, -0.8],
    [0.7, 0.2, -0.8]
  ];

  const wheels = [];
  wheelPositions.forEach((pos) => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16), blackRubberMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(...pos);
    cartGroup.add(wheel);
    wheels.push(wheel);
  });

  // 4. Cart Droppable Items
  const cartItemsGroup = new THREE.Group();
  cartGroup.add(cartItemsGroup);

  // Item 1: Fresh Broccoli & Apples
  const freshItem = new THREE.Group();
  const broc = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.3, 1),
    new THREE.MeshStandardMaterial({ color: 0x16a34a })
  );
  broc.position.set(-0.3, 0.8, -0.4);
  const app = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xdc2626 })
  );
  app.position.set(0.3, 0.75, -0.3);
  freshItem.add(broc, app);
  freshItem.position.y = 5; // starts above
  cartItemsGroup.add(freshItem);

  // Item 2: Bakery Bread & Croissant
  const bakeryItem = new THREE.Group();
  const bread = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.2, 0.6, 6, 12),
    new THREE.MeshStandardMaterial({ color: 0xd97706 })
  );
  bread.rotation.z = 0.5;
  bread.position.set(-0.2, 0.9, 0.2);
  const croiss = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.08, 8, 16),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b })
  );
  croiss.position.set(0.4, 0.8, 0.2);
  bakeryItem.add(bread, croiss);
  bakeryItem.position.y = 5;
  cartItemsGroup.add(bakeryItem);

  // Item 3: Grocery Staples (Rice bag & Oil)
  const groceryItem = new THREE.Group();
  const rice = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.7, 0.3),
    new THREE.MeshStandardMaterial({ color: 0xfde047 })
  );
  rice.position.set(-0.35, 1.0, 0);
  const oil = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.8, 10),
    new THREE.MeshStandardMaterial({ color: 0xca8a04 })
  );
  oil.position.set(0.25, 1.0, -0.2);
  groceryItem.add(rice, oil);
  groceryItem.position.y = 5;
  cartItemsGroup.add(groceryItem);

  // Item 4: Home Cookware (Pan)
  const homeItem = new THREE.Group();
  const pan = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.4, 0.15, 16),
    new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
  );
  pan.position.set(0, 1.2, 0.3);
  pan.rotation.x = 0.3;
  homeItem.add(pan);
  homeItem.position.y = 5;
  cartItemsGroup.add(homeItem);

  // Item 5: Family Toys (Blocks)
  const familyItem = new THREE.Group();
  const toy = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.35, 0.35),
    new THREE.MeshStandardMaterial({ color: 0xec4899 })
  );
  toy.position.set(0.2, 1.35, -0.1);
  toy.rotation.y = 0.6;
  familyItem.add(toy);
  familyItem.position.y = 5;
  cartItemsGroup.add(familyItem);

  scene.add(cartGroup);

  // 5. Constellation Particles that Morph into the "EXTRA" Typographic Logo
  const particleCount = 1200;
  const particleGeo = new THREE.BufferGeometry();
  const currentPositions = new Float32Array(particleCount * 3);
  const targetPositions = new Float32Array(particleCount * 3);
  const originPositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  // Calculate 3D points forming the bold letters "E X T R A"
  const generateExtraPoints = () => {
    const points = [];
    const addLine = (x1, y1, z1, x2, y2, z2, density) => {
      for (let i = 0; i <= density; i++) {
        const t = i / density;
        points.push([
          x1 + (x2 - x1) * t,
          y1 + (y2 - y1) * t,
          z1 + (z2 - z1) * t
        ]);
      }
    };

    // Letter E (x: -12 to -7)
    addLine(-12, -3, 0, -12, 3, 0, 40); // vertical
    addLine(-12, 3, 0, -7, 3, 0, 30);   // top
    addLine(-12, 0, 0, -8, 0, 0, 24);   // middle
    addLine(-12, -3, 0, -7, -3, 0, 30); // bottom

    // Letter X (x: -5 to 0)
    addLine(-5, 3, 0, 0, -3, 0, 45);
    addLine(-5, -3, 0, 0, 3, 0, 45);

    // Letter T (x: 2 to 7)
    addLine(2, 3, 0, 7, 3, 0, 35);
    addLine(4.5, 3, 0, 4.5, -3, 0, 40);

    // Letter R (x: 9 to 14)
    addLine(9, -3, 0, 9, 3, 0, 40);
    addLine(9, 3, 0, 13.5, 3, 0, 25);
    addLine(13.5, 3, 0, 13.5, 0.5, 0, 20);
    addLine(13.5, 0.5, 0, 9, 0.5, 0, 25);
    addLine(10, 0.5, 0, 14, -3, 0, 30);

    // Letter A (x: 16 to 21)
    addLine(16, -3, 0, 18.5, 3, 0, 40);
    addLine(21, -3, 0, 18.5, 3, 0, 40);
    addLine(17.2, -0.4, 0, 19.8, -0.4, 0, 20);

    return points;
  };

  const extraPoints = generateExtraPoints();
  const palette = [
    new THREE.Color(0x10b981), // Emerald
    new THREE.Color(0xf59e0b), // Amber
    new THREE.Color(0x3b82f6), // Blue
    new THREE.Color(0xec4899), // Pink
    new THREE.Color(0xffffff)  // Bright White
  ];

  for (let i = 0; i < particleCount; i++) {
    // Initial exploded cloud around cart
    const r = 2 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    originPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    originPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) + 1;
    originPositions[i * 3 + 2] = -268 + r * Math.cos(phi);

    currentPositions[i * 3] = originPositions[i * 3];
    currentPositions[i * 3 + 1] = originPositions[i * 3 + 1];
    currentPositions[i * 3 + 2] = originPositions[i * 3 + 2];

    // Target EXTRA logo layout positioned at z = -260
    const pointIdx = i % extraPoints.length;
    const pt = extraPoints[pointIdx];
    // Scale and center the logo
    targetPositions[i * 3] = (pt[0] - 4.5) * 0.9 + (Math.random() - 0.5) * 0.2;
    targetPositions[i * 3 + 1] = pt[1] * 0.9 + 2.5 + (Math.random() - 0.5) * 0.2;
    targetPositions[i * 3 + 2] = -260 + (Math.random() - 0.5) * 0.5;

    const col = palette[i % palette.length];
    particleColors[i * 3] = col.r;
    particleColors[i * 3 + 1] = col.g;
    particleColors[i * 3 + 2] = col.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  });

  const constellation = new THREE.Points(particleGeo, particleMat);
  scene.add(constellation);

  return {
    cartGroup,
    constellation,
    wheels,
    updateTimeline: (progress) => {
      // Cart sequence occurs between progress 0.75 and 0.88
      if (progress >= 0.74 && progress <= 0.89) {
        // Fade & scale cart in
        const cartNorm = (progress - 0.74) / 0.15;
        const scale = Math.min(cartNorm * 5, 1.4);
        cartGroup.scale.set(scale, scale, scale);

        // Spin wheels
        wheels.forEach((w) => {
          w.rotation.x += 0.08;
        });

        // Drop items progressively
        // Fresh drop: 0.76 - 0.78
        if (progress >= 0.76) {
          const t = Math.min((progress - 0.76) / 0.02, 1);
          freshItem.position.y = 5 - t * 5;
        } else {
          freshItem.position.y = 5;
        }

        // Bakery drop: 0.78 - 0.80
        if (progress >= 0.78) {
          const t = Math.min((progress - 0.78) / 0.02, 1);
          bakeryItem.position.y = 5 - t * 5;
        } else {
          bakeryItem.position.y = 5;
        }

        // Grocery drop: 0.80 - 0.82
        if (progress >= 0.80) {
          const t = Math.min((progress - 0.80) / 0.02, 1);
          groceryItem.position.y = 5 - t * 5;
        } else {
          groceryItem.position.y = 5;
        }

        // Home drop: 0.82 - 0.835
        if (progress >= 0.82) {
          const t = Math.min((progress - 0.82) / 0.015, 1);
          homeItem.position.y = 5 - t * 5;
        } else {
          homeItem.position.y = 5;
        }

        // Family drop: 0.835 - 0.85
        if (progress >= 0.835) {
          const t = Math.min((progress - 0.835) / 0.015, 1);
          familyItem.position.y = 5 - t * 5;
        } else {
          familyItem.position.y = 5;
        }

        // Morph to EXTRA logo constellation: 0.84 to 0.88
        if (progress >= 0.835) {
          const morphT = Math.min((progress - 0.835) / 0.04, 1);
          particleMat.opacity = Math.min(morphT * 1.5, 0.95);

          const pos = constellation.geometry.attributes.position.array;
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            pos[i3] = THREE.MathUtils.lerp(originPositions[i3], targetPositions[i3], morphT);
            pos[i3 + 1] = THREE.MathUtils.lerp(originPositions[i3 + 1], targetPositions[i3 + 1], morphT);
            pos[i3 + 2] = THREE.MathUtils.lerp(originPositions[i3 + 2], targetPositions[i3 + 2], morphT);
          }
          constellation.geometry.attributes.position.needsUpdate = true;
        } else {
          particleMat.opacity = 0;
        }
      } else if (progress > 0.89) {
        cartGroup.scale.set(0.001, 0.001, 0.001);
        particleMat.opacity = Math.max(0, 0.95 - (progress - 0.89) * 10);
      } else {
        cartGroup.scale.set(0.001, 0.001, 0.001);
        particleMat.opacity = 0;
      }
    }
  };
}
