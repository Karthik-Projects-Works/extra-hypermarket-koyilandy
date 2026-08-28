import * as THREE from 'three';

export function createStoreTunnel(scene) {
  const group = new THREE.Group();

  // Create procedural textures for floor and shelves
  const createTileTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Marble Base
    ctx.fillStyle = '#18191c';
    ctx.fillRect(0, 0, 512, 512);

    // Grid lines for tiles
    ctx.strokeStyle = '#282b30';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 512, 512);

    // Subtle marble veining
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 512, 0);
      ctx.bezierCurveTo(
        Math.random() * 512, 170,
        Math.random() * 512, 340,
        Math.random() * 512, 512
      );
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 60);
    return texture;
  };

  const tileTexture = createTileTexture();

  // 1. Polished Reflective Supermarket Floor
  const floorGeo = new THREE.PlaneGeometry(36, 320);
  const floorMat = new THREE.MeshStandardMaterial({
    map: tileTexture,
    roughness: 0.18,
    metalness: 0.35,
    color: 0x22252a
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -2.5, -120);
  floor.receiveShadow = true;
  group.add(floor);

  // Aisle Center Glow Stripes
  const stripeGeo = new THREE.PlaneGeometry(0.3, 300);
  const stripeMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.4
  });
  const stripeL = new THREE.Mesh(stripeGeo, stripeMat);
  stripeL.rotation.x = -Math.PI / 2;
  stripeL.position.set(-1.8, -2.48, -120);
  group.add(stripeL);

  const stripeR = new THREE.Mesh(stripeGeo, stripeMat);
  stripeR.rotation.x = -Math.PI / 2;
  stripeR.position.set(1.8, -2.48, -120);
  group.add(stripeR);

  // 2. High Ceiling with Industrial LED Light Panels
  const ceilingGeo = new THREE.PlaneGeometry(36, 320);
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x0f1115,
    roughness: 0.8
  });
  const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 9, -120);
  group.add(ceiling);

  // Overhead LED Light Fixtures (Long luminous strips)
  const numLights = 32;
  for (let i = 0; i < numLights; i++) {
    const zPos = 20 - i * 10;
    const lightBarGeo = new THREE.BoxGeometry(2.4, 0.15, 6);
    const lightBarMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 1.4,
      roughness: 0.1
    });

    // Left and right light tracks
    const lightL = new THREE.Mesh(lightBarGeo, lightBarMat);
    lightL.position.set(-4.5, 8.8, zPos);
    group.add(lightL);

    const lightR = new THREE.Mesh(lightBarGeo, lightBarMat);
    lightR.position.set(4.5, 8.8, zPos);
    group.add(lightR);
  }

  // 3. Entrance Facade & Sliding Automatic Glass Doors
  const facadeGroup = new THREE.Group();
  facadeGroup.position.set(0, 0, 15);

  // Exterior wall
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x13151a,
    roughness: 0.4,
    metalness: 0.6
  });
  const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(14, 12, 1), wallMat);
  wallLeft.position.set(-11, 3.5, 0);
  facadeGroup.add(wallLeft);

  const wallRight = new THREE.Mesh(new THREE.BoxGeometry(14, 12, 1), wallMat);
  wallRight.position.set(11, 3.5, 0);
  facadeGroup.add(wallRight);

  const wallTop = new THREE.Mesh(new THREE.BoxGeometry(12, 4, 1), wallMat);
  wallTop.position.set(0, 7.5, 0);
  facadeGroup.add(wallTop);

  // Big Glowing EXTRA Entrance Sign
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 1024;
  signCanvas.height = 256;
  const sCtx = signCanvas.getContext('2d');
  sCtx.fillStyle = '#0b0d11';
  sCtx.fillRect(0, 0, 1024, 256);
  sCtx.fillStyle = '#10b981';
  sCtx.font = '900 110px Syne, sans-serif';
  sCtx.textAlign = 'center';
  sCtx.fillText('EXTRA HYPERMARKET', 512, 130);
  sCtx.fillStyle = '#94a3b8';
  sCtx.font = '600 32px sans-serif';
  sCtx.fillText('KOYILANDY • KERALA', 512, 195);

  const signTex = new THREE.CanvasTexture(signCanvas);
  const signMat = new THREE.MeshStandardMaterial({
    map: signTex,
    emissive: 0x059669,
    emissiveMap: signTex,
    emissiveIntensity: 0.8
  });
  const signMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 2.5, 0.4), signMat);
  signMesh.position.set(0, 7.2, 0.6);
  facadeGroup.add(signMesh);

  // Sliding Glass Doors
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x93c5fd,
    transparent: true,
    opacity: 0.45,
    roughness: 0.1,
    transmission: 0.7,
    thickness: 0.2
  });

  const doorGeo = new THREE.BoxGeometry(3.8, 7.5, 0.1);
  const doorLeft = new THREE.Mesh(doorGeo, glassMat);
  doorLeft.position.set(-2, 1.3, 0);
  facadeGroup.add(doorLeft);

  const doorRight = new THREE.Mesh(doorGeo, glassMat);
  doorRight.position.set(2, 1.3, 0);
  facadeGroup.add(doorRight);

  group.add(facadeGroup);

  // 4. Department Aisle Shelving Bays Along the Z Axis
  // Departments along depth:
  // Fresh: z = -5 to -45
  // Bakery: z = -50 to -85
  // Grocery: z = -90 to -135
  // Meat & Seafood: z = -140 to -175
  // Home & Living: z = -180 to -215
  // Family Zone: z = -220 to -255

  const departmentZones = [
    { name: 'FRESH MARKET', color: 0x10b981, zStart: -15, zEnd: -50, shelfColor: 0x24382e },
    { name: 'ARTISAN BAKERY', color: 0xf59e0b, zStart: -55, zEnd: -90, shelfColor: 0x3d2b1f },
    { name: 'GROCERY & SPICES', color: 0x3b82f6, zStart: -95, zEnd: -140, shelfColor: 0x1e293b },
    { name: 'MEAT & SEAFOOD', color: 0xef4444, zStart: -145, zEnd: -180, shelfColor: 0x1f1a24 },
    { name: 'HOME & LIVING', color: 0x8b5cf6, zStart: -185, zEnd: -220, shelfColor: 0x2e1065 },
    { name: 'FAMILY ZONE', color: 0xec4899, zStart: -225, zEnd: -260, shelfColor: 0x3b0764 }
  ];

  departmentZones.forEach((dept) => {
    const length = Math.abs(dept.zEnd - dept.zStart);
    const zCenter = (dept.zStart + dept.zEnd) / 2;

    // Shelf geometry (Left and Right aisles)
    const shelfGeo = new THREE.BoxGeometry(3.5, 7, length);
    const shelfMat = new THREE.MeshStandardMaterial({
      color: dept.shelfColor,
      roughness: 0.4,
      metalness: 0.3
    });

    const shelfLeft = new THREE.Mesh(shelfGeo, shelfMat);
    shelfLeft.position.set(-7.5, 1, zCenter);
    group.add(shelfLeft);

    const shelfRight = new THREE.Mesh(shelfGeo, shelfMat);
    shelfRight.position.set(7.5, 1, zCenter);
    group.add(shelfRight);

    // Glowing Neon Department Header Rail
    const railGeo = new THREE.BoxGeometry(0.3, 0.3, length);
    const railMat = new THREE.MeshStandardMaterial({
      color: dept.color,
      emissive: dept.color,
      emissiveIntensity: 1.2
    });

    const railLeft = new THREE.Mesh(railGeo, railMat);
    railLeft.position.set(-5.6, 4.6, zCenter);
    group.add(railLeft);

    const railRight = new THREE.Mesh(railGeo, railMat);
    railRight.position.set(5.6, 4.6, zCenter);
    group.add(railRight);

    // Department Overhead Sign Hanging in Center
    const dCanvas = document.createElement('canvas');
    dCanvas.width = 512;
    dCanvas.height = 128;
    const dCtx = dCanvas.getContext('2d');
    dCtx.fillStyle = '#0a0d14';
    dCtx.fillRect(0, 0, 512, 128);
    dCtx.strokeStyle = '#' + dept.color.toString(16).padStart(6, '0');
    dCtx.lineWidth = 6;
    dCtx.strokeRect(4, 4, 504, 120);

    dCtx.fillStyle = '#' + dept.color.toString(16).padStart(6, '0');
    dCtx.font = 'bold 44px Syne, sans-serif';
    dCtx.textAlign = 'center';
    dCtx.fillText(dept.name, 256, 78);

    const dTex = new THREE.CanvasTexture(dCanvas);
    const dSignMat = new THREE.MeshStandardMaterial({
      map: dTex,
      emissive: dept.color,
      emissiveMap: dTex,
      emissiveIntensity: 0.6,
      side: THREE.DoubleSide
    });

    const dSign = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5), dSignMat);
    dSign.position.set(0, 6.2, dept.zStart - 2);
    group.add(dSign);

    // Department Point Light
    const deptLight = new THREE.PointLight(dept.color, 1.6, 25);
    deptLight.position.set(0, 5.5, zCenter);
    group.add(deptLight);
  });

  scene.add(group);

  return {
    group,
    doorLeft,
    doorRight,
    facadeGroup,
    updateDoors: (progress) => {
      // Open doors when entering store between 0.08 and 0.16
      if (progress >= 0.06 && progress <= 0.22) {
        const doorProgress = Math.min(Math.max((progress - 0.07) / 0.08, 0), 1);
        doorLeft.position.x = -2 - doorProgress * 3.2;
        doorRight.position.x = 2 + doorProgress * 3.2;
      } else if (progress > 0.22) {
        doorLeft.position.x = -5.2;
        doorRight.position.x = 5.2;
      } else {
        doorLeft.position.x = -2;
        doorRight.position.x = 2;
      }
    }
  };
}
