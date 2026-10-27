import * as THREE from 'three';
import {
  createTailgateTexture,
  createWoodSlatsTexture,
  createBarrierTexture,
  createParliamentTexture,
  createCurzonHallTexture,
  createMetroTrainTexture,
  createTunnelTileTexture,
  createWaterTexture,
  createAirportRunwayTexture,
  createBimanLiveryTexture,
  createBanglaBillboardTexture
} from './textureGenerator.js';

// Procedural 3D Low-Poly Mesh Builder for Bangladeshi Vehicles and Highway Props

export function buildTruck3D(primaryColor = '#F5A623', slogan = 'হর্ন দিন') {
  const truckGroup = new THREE.Group();

  const primaryMat = new THREE.MeshLambertMaterial({ color: primaryColor });
  const woodMat = new THREE.MeshLambertMaterial({ map: createWoodSlatsTexture(primaryColor) });
  const tailgateMat = new THREE.MeshLambertMaterial({ map: createTailgateTexture(slogan) });
  const darkMetalMat = new THREE.MeshLambertMaterial({ color: '#1A110B' });
  const chromeMat = new THREE.MeshStandardMaterial({ color: '#E0E0E0', roughness: 0.3, metalness: 0.8 });
  const glassMat = new THREE.MeshLambertMaterial({ color: '#8CE0FF', transparent: true, opacity: 0.75 });
  const redMat = new THREE.MeshLambertMaterial({ color: '#C8442B' });
  const greenMat = new THREE.MeshLambertMaterial({ color: '#3F9B5B' });
  const tireMat = new THREE.MeshLambertMaterial({ color: '#151515' });

  // 1. Chassis Frame
  const chassisGeo = new THREE.BoxGeometry(2.4, 0.4, 6.2);
  const chassis = new THREE.Mesh(chassisGeo, darkMetalMat);
  chassis.position.y = 0.6;
  truckGroup.add(chassis);

  // 2. Front Cabin (Traditional Bangladeshi high curved crown)
  const cabinGeo = new THREE.BoxGeometry(2.3, 1.8, 1.8);
  const cabin = new THREE.Mesh(cabinGeo, primaryMat);
  cabin.position.set(0, 1.6, 2.1);
  truckGroup.add(cabin);

  // Cabin Crown / Visor (Traditional painted truck crown)
  const visorGeo = new THREE.BoxGeometry(2.4, 0.4, 0.6);
  const visor = new THREE.Mesh(visorGeo, redMat);
  visor.position.set(0, 2.6, 2.3);
  truckGroup.add(visor);

  // Windshield
  const windshieldGeo = new THREE.PlaneGeometry(2.0, 0.8);
  const windshield = new THREE.Mesh(windshieldGeo, glassMat);
  windshield.position.set(0, 1.8, 3.01);
  truckGroup.add(windshield);

  // Front Chrome Grille & Bumper
  const bumperGeo = new THREE.BoxGeometry(2.5, 0.35, 0.4);
  const bumper = new THREE.Mesh(bumperGeo, chromeMat);
  bumper.position.set(0, 0.55, 3.1);
  truckGroup.add(bumper);

  // Dual Headlights
  const lightGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 12);
  lightGeo.rotateX(Math.PI / 2);
  const lightMat = new THREE.MeshBasicMaterial({ color: '#FFF8EC' });
  const leftLight = new THREE.Mesh(lightGeo, lightMat);
  leftLight.position.set(-0.9, 0.85, 3.02);
  const rightLight = leftLight.clone();
  rightLight.position.x = 0.9;
  truckGroup.add(leftLight, rightLight);

  // Side Mirrors
  const mirrorGeo = new THREE.BoxGeometry(0.1, 0.4, 0.2);
  const leftMirror = new THREE.Mesh(mirrorGeo, darkMetalMat);
  leftMirror.position.set(-1.3, 1.8, 2.2);
  const rightMirror = leftMirror.clone();
  rightMirror.position.x = 1.3;
  truckGroup.add(leftMirror, rightMirror);

  // 3. Wooden Cargo Bed
  const bedFloorGeo = new THREE.BoxGeometry(2.4, 0.2, 4.2);
  const bedFloor = new THREE.Mesh(bedFloorGeo, woodMat);
  bedFloor.position.set(0, 0.9, -0.9);
  truckGroup.add(bedFloor);

  // Side Planks (Left & Right with colorful slats)
  const sideGeo = new THREE.BoxGeometry(0.15, 1.6, 4.2);
  const leftSide = new THREE.Mesh(sideGeo, woodMat);
  leftSide.position.set(-1.15, 1.7, -0.9);
  const rightSide = leftSide.clone();
  rightSide.position.x = 1.15;
  truckGroup.add(leftSide, rightSide);

  // Tailgate (The Rear Face with authentic truck art texture!)
  const tailgateGeo = new THREE.BoxGeometry(2.4, 1.6, 0.15);
  // Materials: front, back, top, bottom, right, left
  const materials = [
    woodMat, woodMat, woodMat, woodMat,
    woodMat, tailgateMat
  ];
  const tailgate = new THREE.Mesh(tailgateGeo, materials);
  tailgate.position.set(0, 1.7, -3.0);
  truckGroup.add(tailgate);

  // 4. Produce Cargo Load (Vegetable sacks: Potatoes & Cabbages)
  const cargoGroup = new THREE.Group();
  const sackGeo = new THREE.SphereGeometry(0.45, 8, 8);
  sackGeo.scale(1.2, 0.7, 1.0);

  const colors = ['#3F9B5B', '#52B788', '#C8442B', '#E9C46A', '#2D6A4F'];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 2; col++) {
      for (let layer = 0; layer < 2; layer++) {
        const mat = new THREE.MeshLambertMaterial({ color: colors[(row + col + layer) % colors.length] });
        const sack = new THREE.Mesh(sackGeo, mat);
        sack.position.set(
          -0.55 + col * 1.1 + (Math.random() - 0.5) * 0.1,
          1.2 + layer * 0.55,
          -2.2 + row * 1.3 + (Math.random() - 0.5) * 0.1
        );
        cargoGroup.add(sack);
      }
    }
  }
  truckGroup.add(cargoGroup);

  // 5. Wheels (6 rolling wheels)
  const wheels = [];
  const wheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.35, 16);
  wheelGeo.rotateZ(Math.PI / 2);

  const wheelPositions = [
    [-1.25, 0.48, 2.1],   // Front Left
    [1.25, 0.48, 2.1],    // Front Right
    [-1.25, 0.48, -1.2],  // Rear Mid Left
    [1.25, 0.48, -1.2],   // Rear Mid Right
    [-1.25, 0.48, -2.4],  // Rear Back Left
    [1.25, 0.48, -2.4]    // Rear Back Right
  ];

  wheelPositions.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, tireMat);
    wheel.position.set(x, y, z);

    // Rim hub
    const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.36, 12);
    rimGeo.rotateZ(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeo, chromeMat);
    wheel.add(rim);

    truckGroup.add(wheel);
    wheels.push(wheel);
  });

  truckGroup.userData = { wheels, cargoGroup };
  return truckGroup;
}

// 3D Stray Cow (গরু) that crosses the highway
export function buildCow3D() {
  const cowGroup = new THREE.Group();
  const cowWhiteMat = new THREE.MeshLambertMaterial({ color: '#E8DFD8' });
  const cowSpotMat = new THREE.MeshLambertMaterial({ color: '#5A3E2B' });
  const hornMat = new THREE.MeshLambertMaterial({ color: '#D4C2B0' });
  const blackMat = new THREE.MeshLambertMaterial({ color: '#1A110B' });

  // Body
  const bodyGeo = new THREE.BoxGeometry(1.2, 1.1, 2.0);
  const body = new THREE.Mesh(bodyGeo, cowWhiteMat);
  body.position.y = 1.2;
  cowGroup.add(body);

  // Cow patches
  const patchGeo = new THREE.BoxGeometry(0.6, 0.6, 0.8);
  const patch = new THREE.Mesh(patchGeo, cowSpotMat);
  patch.position.set(0.4, 1.3, 0.2);
  cowGroup.add(patch);

  // Head
  const headGeo = new THREE.BoxGeometry(0.7, 0.7, 0.8);
  const head = new THREE.Mesh(headGeo, cowWhiteMat);
  head.position.set(0, 1.6, 1.2);
  cowGroup.add(head);

  // Snout
  const snoutGeo = new THREE.BoxGeometry(0.6, 0.4, 0.4);
  const snout = new THREE.Mesh(snoutGeo, new THREE.MeshLambertMaterial({ color: '#EAA9A9' }));
  snout.position.set(0, 1.45, 1.65);
  cowGroup.add(snout);

  // Horns
  const hornGeo = new THREE.ConeGeometry(0.08, 0.4, 6);
  const leftHorn = new THREE.Mesh(hornGeo, hornMat);
  leftHorn.rotation.z = -Math.PI / 4;
  leftHorn.position.set(-0.35, 2.05, 1.2);
  const rightHorn = leftHorn.clone();
  rightHorn.rotation.z = Math.PI / 4;
  rightHorn.position.x = 0.35;
  cowGroup.add(leftHorn, rightHorn);

  // 4 Legs
  const legGeo = new THREE.BoxGeometry(0.25, 0.9, 0.25);
  const legPositions = [
    [-0.45, 0.45, 0.7],
    [0.45, 0.45, 0.7],
    [-0.45, 0.45, -0.7],
    [0.45, 0.45, -0.7]
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, cowSpotMat);
    leg.position.set(x, y, z);
    cowGroup.add(leg);
  });

  return cowGroup;
}

// 3D Extortion Barricade (চাঁদা চেকপোস্ট)
export function buildBarricade3D(width = 8.0) {
  const barricadeGroup = new THREE.Group();
  const barrierMat = new THREE.MeshLambertMaterial({ map: createBarrierTexture() });
  const postMat = new THREE.MeshLambertMaterial({ color: '#C8442B' });
  const woodMat = new THREE.MeshLambertMaterial({ color: '#8B4513' });

  // Left & Right Stand Posts
  const postGeo = new THREE.CylinderGeometry(0.2, 0.25, 2.2, 8);
  const leftPost = new THREE.Mesh(postGeo, postMat);
  leftPost.position.set(-width / 2 + 0.3, 1.1, 0);
  const rightPost = leftPost.clone();
  rightPost.position.x = width / 2 - 0.3;
  barricadeGroup.add(leftPost, rightPost);

  // Main Boom Barrier with Red/White Stripes
  const boomGeo = new THREE.BoxGeometry(width, 0.35, 0.15);
  const boom = new THREE.Mesh(boomGeo, barrierMat);
  boom.position.set(0, 1.5, 0);
  barricadeGroup.add(boom);

  // Signboard "চাঁদা চেকপোস্ট"
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 256;
  signCanvas.height = 96;
  const ctx = signCanvas.getContext('2d');
  ctx.fillStyle = '#C8442B';
  ctx.fillRect(0, 0, 256, 96);
  ctx.strokeStyle = '#F5A623';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 248, 88);
  ctx.fillStyle = '#FFF8EC';
  ctx.font = 'bold 36px "Hind Siliguri", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('স্ট্যান্ড ফি চেকপোস্ট', 128, 58);

  const signTex = new THREE.CanvasTexture(signCanvas);
  const signGeo = new THREE.PlaneGeometry(2.4, 0.9);
  const signMesh = new THREE.Mesh(signGeo, new THREE.MeshBasicMaterial({ map: signTex }));
  signMesh.position.set(0, 2.3, 0.1);
  barricadeGroup.add(signMesh);

  // Red Flag
  const flagGeo = new THREE.ConeGeometry(0.3, 0.6, 4);
  flagGeo.rotateZ(Math.PI / 2);
  const flag = new THREE.Mesh(flagGeo, new THREE.MeshBasicMaterial({ color: '#C8442B' }));
  flag.position.set(-width / 2 + 0.5, 2.4, 0);
  barricadeGroup.add(flag);

  return barricadeGroup;
}

// Low-Poly Palm Tree (তালগাছ)
export function buildPalmTree3D() {
  const tree = new THREE.Group();
  const trunkMat = new THREE.MeshLambertMaterial({ color: '#4E3629' });
  const leafMat = new THREE.MeshLambertMaterial({ color: '#2E7944' });

  // Tall slender trunk
  const trunkGeo = new THREE.CylinderGeometry(0.25, 0.45, 7.0, 7);
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 3.5;
  tree.add(trunk);

  // Fronds / Palm Crown
  const frondGeo = new THREE.ConeGeometry(1.6, 1.4, 5);
  for (let i = 0; i < 5; i++) {
    const frond = new THREE.Mesh(frondGeo, leafMat);
    frond.position.set(0, 7.0 + i * 0.3, 0);
    frond.rotation.y = (i * Math.PI) / 2.5;
    tree.add(frond);
  }
  return tree;
}

// Low-Poly Banana Tree (কলাগাছ)
export function buildBananaTree3D() {
  const tree = new THREE.Group();
  const stemMat = new THREE.MeshLambertMaterial({ color: '#74A82F' });
  const leafMat = new THREE.MeshLambertMaterial({ color: '#4E881D' });

  const stemGeo = new THREE.CylinderGeometry(0.2, 0.3, 3.0, 6);
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.y = 1.5;
  tree.add(stem);

  // Broad drooping leaves
  const leafGeo = new THREE.BoxGeometry(0.35, 0.04, 1.8);
  for (let i = 0; i < 6; i++) {
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(0, 3.0, 0);
    leaf.rotation.y = (i * Math.PI) / 3;
    leaf.rotation.x = 0.55;
    tree.add(leaf);
  }
  return tree;
}

// Village Straw Hut / Cottage (কুঁড়েঘর)
export function buildHut3D() {
  const hut = new THREE.Group();
  const wallMat = new THREE.MeshLambertMaterial({ color: '#A07855' });
  const roofMat = new THREE.MeshLambertMaterial({ color: '#C8963E' });

  // Mud walls
  const wallGeo = new THREE.BoxGeometry(2.5, 1.6, 2.5);
  const wall = new THREE.Mesh(wallGeo, wallMat);
  wall.position.y = 0.8;
  hut.add(wall);

  // Straw Pyramid Roof
  const roofGeo = new THREE.ConeGeometry(2.2, 1.5, 4);
  roofGeo.rotateY(Math.PI / 4);
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = 2.3;
  hut.add(roof);

  return hut;
}

// =========================================================================
// 🏛️ 1. JATIYA SANGSAD BHABAN (জাতীয় সংসদ ভবন - Bangladesh Parliament)
// =========================================================================
export function buildParliament3D() {
  const complex = new THREE.Group();
  const concreteMat = new THREE.MeshLambertMaterial({ map: createParliamentTexture() });
  const plainConcreteMat = new THREE.MeshLambertMaterial({ color: '#B5AFA6' });
  const lakeMat = new THREE.MeshLambertMaterial({ map: createWaterTexture(), transparent: true, opacity: 0.88 });
  const grassMat = new THREE.MeshLambertMaterial({ color: '#3A6332' });
  const flagGreenMat = new THREE.MeshBasicMaterial({ color: '#006A4E' });
  const flagRedMat = new THREE.MeshBasicMaterial({ color: '#F42A41' });
  const whiteMat = new THREE.MeshLambertMaterial({ color: '#FFFFFF' });

  // 1. Crescent Lake Water Reservoir & Lawn Podium
  const lakeGeo = new THREE.PlaneGeometry(70, 40);
  const lake = new THREE.Mesh(lakeGeo, lakeMat);
  lake.rotation.x = -Math.PI / 2;
  lake.position.set(0, 0.1, 10);
  complex.add(lake);

  const lawnGeo = new THREE.BoxGeometry(76, 0.4, 48);
  const lawn = new THREE.Mesh(lawnGeo, grassMat);
  lawn.position.set(0, 0.05, 8);
  complex.add(lawn);

  // 2. Central High Assembly Hall (Octagonal Monumental Core)
  const coreGeo = new THREE.CylinderGeometry(8, 9, 14, 8);
  const core = new THREE.Mesh(coreGeo, concreteMat);
  core.position.set(0, 7.2, 0);
  complex.add(core);

  // High central skylight dome/pyramid
  const domeGeo = new THREE.ConeGeometry(6, 3.5, 8);
  const dome = new THREE.Mesh(domeGeo, plainConcreteMat);
  dome.position.set(0, 15.5, 0);
  complex.add(dome);

  // 3. Perimeter Cylindrical & Block Pavilions (Kahn's monumental geometry)
  const wingPositions = [
    [-11, 5.5, -4],
    [11, 5.5, -4],
    [-12, 5.5, 6],
    [12, 5.5, 6],
    [0, 5.5, -12]
  ];

  wingPositions.forEach(([x, y, z]) => {
    const wingGeo = new THREE.BoxGeometry(7, 11, 7);
    const wing = new THREE.Mesh(wingGeo, concreteMat);
    wing.position.set(x, y, z);
    complex.add(wing);

    // Cylinder accent tower on corners
    const cylGeo = new THREE.CylinderGeometry(2.4, 2.4, 12, 12);
    const cyl = new THREE.Mesh(cylGeo, concreteMat);
    cyl.position.set(x * 1.15, 6.0, z * 1.1);
    complex.add(cyl);
  });

  // 4. Lake Entrance Bridges & Plaza
  const bridgeGeo = new THREE.BoxGeometry(6, 0.5, 18);
  const bridge = new THREE.Mesh(bridgeGeo, plainConcreteMat);
  bridge.position.set(0, 0.35, 10);
  complex.add(bridge);

  // 5. Bangladesh National Flag flying on tall pole
  const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 9, 8);
  const pole = new THREE.Mesh(poleGeo, whiteMat);
  pole.position.set(0, 18.5, 0);
  complex.add(pole);

  // Green flag cloth
  const flagGeo = new THREE.BoxGeometry(2.6, 1.5, 0.05);
  const flagMesh = new THREE.Mesh(flagGeo, flagGreenMat);
  flagMesh.position.set(1.3, 21.5, 0);
  // Red circle emblem on flag
  const redCircGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.08, 16);
  redCircGeo.rotateX(Math.PI / 2);
  const redCirc = new THREE.Mesh(redCircGeo, flagRedMat);
  redCirc.position.set(0, 0, 0);
  flagMesh.add(redCirc);
  complex.add(flagMesh);

  // Landmark Title Stone Plaque
  const signGeo = new THREE.BoxGeometry(8, 1.2, 0.3);
  const signMesh = new THREE.Mesh(signGeo, plainConcreteMat);
  signMesh.position.set(0, 0.8, 22);
  complex.add(signMesh);

  return complex;
}

// =========================================================================
// ✈️ 2. HAZRAT SHAHJALAL INTERNATIONAL AIRPORT (শাহজালাল বিমানবন্দর)
// =========================================================================
export function buildAirport3D() {
  const airport = new THREE.Group();
  const whiteMat = new THREE.MeshLambertMaterial({ color: '#EBF0F5' });
  const darkGlassMat = new THREE.MeshLambertMaterial({ color: '#1E3A5F', transparent: true, opacity: 0.85 });
  const metalMat = new THREE.MeshStandardMaterial({ color: '#B0BAC5', roughness: 0.4, metalness: 0.6 });
  const redMat = new THREE.MeshBasicMaterial({ color: '#F42A41' });
  const runwayMat = new THREE.MeshLambertMaterial({ map: createAirportRunwayTexture() });

  // 1. Runway Strip parallel to highway
  const runwayGeo = new THREE.PlaneGeometry(28, 120);
  const runway = new THREE.Mesh(runwayGeo, runwayMat);
  runway.rotation.x = -Math.PI / 2;
  runway.position.set(-18, 0.02, 0);
  airport.add(runway);

  // Runway Edge Lights (Green & Amber)
  for (let z = -50; z <= 50; z += 16) {
    const lightMat = new THREE.MeshBasicMaterial({ color: '#00E5FF' });
    const lightGeo = new THREE.SphereGeometry(0.2, 6, 6);
    const leftL = new THREE.Mesh(lightGeo, lightMat);
    leftL.position.set(-31, 0.3, z);
    const rightL = leftL.clone();
    rightL.position.x = -5;
    airport.add(leftL, rightL);
  }

  // 2. Main Terminal Building (Curved modern architectural glass concourse)
  const termGeo = new THREE.BoxGeometry(32, 8, 16);
  const term = new THREE.Mesh(termGeo, whiteMat);
  term.position.set(-20, 4.0, -35);
  airport.add(term);

  // Large curved glass curtain facade
  const glassGeo = new THREE.BoxGeometry(30, 5.5, 0.3);
  const glass = new THREE.Mesh(glassGeo, darkGlassMat);
  glass.position.set(-20, 4.2, -26.9);
  airport.add(glass);

  // Aerobridge / Jet Bridge extending out
  const jetBridgeGeo = new THREE.BoxGeometry(2.2, 2.2, 10);
  const jetBridge = new THREE.Mesh(jetBridgeGeo, whiteMat);
  jetBridge.position.set(-12, 3.2, -21);
  airport.add(jetBridge);

  // 3. Air Traffic Control (ATC) Tower
  const towerGeo = new THREE.CylinderGeometry(1.6, 2.8, 22, 12);
  const tower = new THREE.Mesh(towerGeo, whiteMat);
  tower.position.set(-32, 11, -30);
  airport.add(tower);

  // ATC Hexagonal Observation Cab (360-degree glass)
  const cabGeo = new THREE.CylinderGeometry(3.6, 2.6, 3.2, 8);
  const cab = new THREE.Mesh(cabGeo, darkGlassMat);
  cab.position.set(-32, 22, -30);
  airport.add(cab);

  // Rotating Radar Dish on Tower Roof
  const radarStem = new THREE.CylinderGeometry(0.12, 0.12, 2, 8);
  const stem = new THREE.Mesh(radarStem, metalMat);
  stem.position.set(-32, 24.5, -30);
  airport.add(stem);

  const radarDishGeo = new THREE.BoxGeometry(3.2, 0.8, 0.15);
  const dish = new THREE.Mesh(radarDishGeo, redMat);
  dish.position.set(-32, 25.4, -30);
  airport.add(dish);

  // 4. Parked Boeing 787 (Biman Bangladesh Airlines)
  const plane = buildAirplane3D();
  plane.position.set(-18, 0, -5);
  plane.rotation.y = -Math.PI / 4;
  airport.add(plane);

  airport.userData = { radarDish: dish };
  return airport;
}

// ✈️ 3D Biman Bangladesh Boeing 787 Jet
export function buildAirplane3D() {
  const plane = new THREE.Group();
  const whiteMat = new THREE.MeshLambertMaterial({ color: '#F8F9FA' });
  const bimanMat = new THREE.MeshLambertMaterial({ map: createBimanLiveryTexture() });
  const greenMat = new THREE.MeshLambertMaterial({ color: '#006A4E' });
  const redMat = new THREE.MeshBasicMaterial({ color: '#F42A41' });
  const glassMat = new THREE.MeshLambertMaterial({ color: '#1B2A38' });
  const engineMat = new THREE.MeshStandardMaterial({ color: '#4A5568', metalness: 0.7, roughness: 0.3 });

  // 1. Fuselage (Airframe Body)
  const bodyGeo = new THREE.CylinderGeometry(1.4, 1.4, 16, 16);
  bodyGeo.rotateX(Math.PI / 2);
  const body = new THREE.Mesh(bodyGeo, bimanMat);
  body.position.y = 2.4;
  plane.add(body);

  // Nose Cone
  const noseGeo = new THREE.ConeGeometry(1.4, 3.2, 16);
  noseGeo.rotateX(Math.PI / 2);
  const nose = new THREE.Mesh(noseGeo, whiteMat);
  nose.position.set(0, 2.4, 9.6);
  plane.add(nose);

  // Tail Cone
  const tailConeGeo = new THREE.ConeGeometry(1.4, 4.0, 16);
  tailConeGeo.rotateX(-Math.PI / 2);
  const tailCone = new THREE.Mesh(tailConeGeo, greenMat);
  tailCone.position.set(0, 2.4, -10.0);
  plane.add(tailCone);

  // Cockpit Glass
  const cockpitGeo = new THREE.BoxGeometry(1.2, 0.45, 0.9);
  const cockpit = new THREE.Mesh(cockpitGeo, glassMat);
  cockpit.position.set(0, 3.2, 8.8);
  plane.add(cockpit);

  // 2. Swept Main Wings (Left & Right)
  const wingGeo = new THREE.BoxGeometry(16, 0.18, 3.4);
  const wing = new THREE.Mesh(wingGeo, whiteMat);
  wing.position.set(0, 2.2, 0.5);
  plane.add(wing);

  // Winglets (Vertical tips in Green)
  const tipGeo = new THREE.BoxGeometry(0.12, 1.2, 1.0);
  const leftTip = new THREE.Mesh(tipGeo, greenMat);
  leftTip.position.set(-8.0, 2.7, 0.5);
  const rightTip = leftTip.clone();
  rightTip.position.x = 8.0;
  plane.add(leftTip, rightTip);

  // 3. Turbofan Jet Engines (Twin engines mounted under wings)
  const engineGeo = new THREE.CylinderGeometry(0.7, 0.7, 2.6, 12);
  engineGeo.rotateX(Math.PI / 2);
  const leftEngine = new THREE.Mesh(engineGeo, engineMat);
  leftEngine.position.set(-3.6, 1.4, 0.8);
  const rightEngine = leftEngine.clone();
  rightEngine.position.x = 3.6;
  plane.add(leftEngine, rightEngine);

  // 4. Vertical Tail Fin with Biman Red Sun Emblem
  const finGeo = new THREE.BoxGeometry(0.16, 3.8, 3.2);
  const fin = new THREE.Mesh(finGeo, greenMat);
  fin.position.set(0, 5.0, -9.0);
  // Red circle sun on tail
  const sunGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.22, 16);
  sunGeo.rotateZ(Math.PI / 2);
  const sun = new THREE.Mesh(sunGeo, redMat);
  sun.position.set(0, 5.2, -8.8);
  plane.add(fin, sun);

  // Horizontal Stabilizers
  const hStabGeo = new THREE.BoxGeometry(5.8, 0.15, 1.6);
  const hStab = new THREE.Mesh(hStabGeo, whiteMat);
  hStab.position.set(0, 3.2, -10.2);
  plane.add(hStab);

  // Landing Gear Struts
  const strutMat = new THREE.MeshLambertMaterial({ color: '#2B2B2B' });
  const strutGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.4, 8);
  const gear1 = new THREE.Mesh(strutGeo, strutMat);
  gear1.position.set(0, 0.7, 6.0);
  const gear2 = gear1.clone();
  gear2.position.set(-2.2, 0.7, -0.5);
  const gear3 = gear1.clone();
  gear3.position.set(2.2, 0.7, -0.5);
  plane.add(gear1, gear2, gear3);

  return plane;
}

// ✈️ Flying Jet Plane that swoops overhead across the Airport zone
export function buildAirplaneInFlight3D() {
  const plane = buildAirplane3D();
  plane.scale.set(1.4, 1.4, 1.4);
  return plane;
}

// =========================================================================
// 🏫 3. CURZON HALL, DHAKA UNIVERSITY (ঢাকা বিশ্ববিদ্যালয় - কার্জন হল)
// =========================================================================
export function buildCurzonHall3D() {
  const curzon = new THREE.Group();
  const brickMat = new THREE.MeshLambertMaterial({ map: createCurzonHallTexture() });
  const trimMat = new THREE.MeshLambertMaterial({ color: '#FFF8EC' });
  const domeMat = new THREE.MeshLambertMaterial({ color: '#E8D8C8' });
  const lawnMat = new THREE.MeshLambertMaterial({ color: '#2A5826' });

  // Green garden front lawn
  const lawnGeo = new THREE.BoxGeometry(60, 0.4, 30);
  const lawn = new THREE.Mesh(lawnGeo, lawnMat);
  lawn.position.set(0, 0.1, 8);
  curzon.add(lawn);

  // 1. Central Grand Block
  const centerGeo = new THREE.BoxGeometry(16, 12, 14);
  const center = new THREE.Mesh(centerGeo, brickMat);
  center.position.set(0, 6.2, 0);
  curzon.add(center);

  // High Mughal arched entrance pavilion
  const archPorticoGeo = new THREE.BoxGeometry(8, 9, 3);
  const portico = new THREE.Mesh(archPorticoGeo, brickMat);
  portico.position.set(0, 4.6, 7.5);
  curzon.add(portico);

  // White ornamental balustrade & parapet
  const parapetGeo = new THREE.BoxGeometry(16.5, 0.8, 14.5);
  const parapet = new THREE.Mesh(parapetGeo, trimMat);
  parapet.position.set(0, 12.5, 0);
  curzon.add(parapet);

  // 2. Symmetrical Flanking Wings (Left & Right)
  const leftWingGeo = new THREE.BoxGeometry(14, 9, 10);
  const leftWing = new THREE.Mesh(leftWingGeo, brickMat);
  leftWing.position.set(-15, 4.7, 0);
  const rightWing = leftWing.clone();
  rightWing.position.x = 15;
  curzon.add(leftWing, rightWing);

  // 3. Four Iconic Mughal Corner Minarets with Domed Chhatris
  const minaretPositions = [
    [-8, 0, 7],
    [8, 0, 7],
    [-22, 0, 5],
    [22, 0, 5]
  ];

  minaretPositions.forEach(([x, y, z]) => {
    // Octagonal minaret tower shaft
    const shaftGeo = new THREE.CylinderGeometry(1.1, 1.4, 16, 8);
    const shaft = new THREE.Mesh(shaftGeo, brickMat);
    shaft.position.set(x, 8, z);
    curzon.add(shaft);

    // White sandstone balcony
    const balconyGeo = new THREE.CylinderGeometry(1.6, 1.3, 0.6, 8);
    const balcony = new THREE.Mesh(balconyGeo, trimMat);
    balcony.position.set(x, 15.5, z);
    curzon.add(balcony);

    // Domed Mughal Cupola (Chhatri dome)
    const domeGeo = new THREE.SphereGeometry(1.3, 10, 8);
    domeGeo.scale(1, 1.4, 1);
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(x, 17.2, z);
    curzon.add(dome);

    // Golden spire finial
    const finialGeo = new THREE.ConeGeometry(0.15, 1.5, 6);
    const finial = new THREE.Mesh(finialGeo, new THREE.MeshBasicMaterial({ color: '#F5A623' }));
    finial.position.set(x, 19.3, z);
    curzon.add(finial);
  });

  // Central Grand Cupola Dome on main hall roof
  const mainDomeGeo = new THREE.SphereGeometry(3.2, 12, 10);
  mainDomeGeo.scale(1, 1.3, 1);
  const mainDome = new THREE.Mesh(mainDomeGeo, domeMat);
  mainDome.position.set(0, 15.2, 0);
  curzon.add(mainDome);

  return curzon;
}

// =========================================================================
// 🚇 4. DHAKA METRO RAIL (মেট্রোরেল MRT Line-6 Elevated Viaduct & Train)
// =========================================================================
export function buildMetroViaductSegment3D(length = 120) {
  const viaduct = new THREE.Group();
  const concreteMat = new THREE.MeshLambertMaterial({ color: '#A8B2BA' });
  const darkMat = new THREE.MeshLambertMaterial({ color: '#4E5A65' });
  const railMat = new THREE.MeshStandardMaterial({ color: '#7E8890', metalness: 0.8 });

  // 1. Heavy Cylindrical Concrete Pillars (MRT Piers)
  for (let z = -length / 2; z <= length / 2; z += 30) {
    // Column shaft
    const pierGeo = new THREE.CylinderGeometry(1.1, 1.3, 7.8, 12);
    const pier = new THREE.Mesh(pierGeo, concreteMat);
    pier.position.set(0, 3.9, z);
    viaduct.add(pier);

    // Pier Cap / Hammerhead Cantilever Crossbeam
    const capGeo = new THREE.BoxGeometry(6.5, 1.2, 3.2);
    const cap = new THREE.Mesh(capGeo, concreteMat);
    cap.position.set(0, 8.0, z);
    viaduct.add(cap);

    // Catenary Overhead Electric Pole (Mast)
    const mastGeo = new THREE.CylinderGeometry(0.12, 0.12, 5.0, 6);
    const mast = new THREE.Mesh(mastGeo, darkMat);
    mast.position.set(-3.0, 11.2, z);
    const armGeo = new THREE.BoxGeometry(3.8, 0.15, 0.15);
    const arm = new THREE.Mesh(armGeo, darkMat);
    arm.position.set(-1.4, 13.5, z);
    viaduct.add(mast, arm);
  }

  // 2. Continuous Elevated Box Girder Deck
  const deckGeo = new THREE.BoxGeometry(6.2, 1.0, length);
  const deck = new THREE.Mesh(deckGeo, concreteMat);
  deck.position.set(0, 8.9, 0);
  viaduct.add(deck);

  // Parapet Soundproof Barrier Walls (Left & Right)
  const wallGeo = new THREE.BoxGeometry(0.35, 1.4, length);
  const leftWall = new THREE.Mesh(wallGeo, concreteMat);
  leftWall.position.set(-3.0, 9.8, 0);
  const rightWall = leftWall.clone();
  rightWall.position.x = 3.0;
  viaduct.add(leftWall, rightWall);

  // Steel Tracks (Two lines: Up & Down)
  const trackGeo = new THREE.BoxGeometry(0.15, 0.15, length);
  [-1.8, -1.0, 1.0, 1.8].forEach(x => {
    const track = new THREE.Mesh(trackGeo, railMat);
    track.position.set(x, 9.5, 0);
    viaduct.add(track);
  });

  return viaduct;
}

// 🚇 Moving 3D Metro Train (4-car set in MRT Line-6 Green & Silver Livery)
export function buildMetroTrain3D() {
  const train = new THREE.Group();
  const trainMat = new THREE.MeshLambertMaterial({ map: createMetroTrainTexture() });
  const darkMat = new THREE.MeshLambertMaterial({ color: '#1B242C' });
  const lightMat = new THREE.MeshBasicMaterial({ color: '#FFFDE0' });
  const redLightMat = new THREE.MeshBasicMaterial({ color: '#FF2222' });

  // 4 connected passenger coaches
  const carCount = 4;
  const carLength = 12;
  const carGap = 0.5;

  for (let i = 0; i < carCount; i++) {
    const zOffset = (i - (carCount - 1) / 2) * (carLength + carGap);

    const carGeo = new THREE.BoxGeometry(2.4, 2.6, carLength);
    const car = new THREE.Mesh(carGeo, trainMat);
    car.position.set(0, 1.4, zOffset);
    train.add(car);

    // Rooftop Air Conditioners (AC pods)
    const acGeo = new THREE.BoxGeometry(1.6, 0.45, 3.2);
    const ac = new THREE.Mesh(acGeo, darkMat);
    ac.position.set(0, 2.85, zOffset);
    train.add(ac);

    // Front headlights on lead car
    if (i === 0) {
      const headGeo = new THREE.SphereGeometry(0.18, 8, 8);
      const l1 = new THREE.Mesh(headGeo, lightMat);
      l1.position.set(-0.8, 1.2, zOffset - carLength / 2 - 0.05);
      const l2 = l1.clone();
      l2.position.x = 0.8;
      train.add(l1, l2);
    }

    // Red taillights on rear car
    if (i === carCount - 1) {
      const tailGeo = new THREE.SphereGeometry(0.16, 8, 8);
      const t1 = new THREE.Mesh(tailGeo, redLightMat);
      t1.position.set(-0.8, 1.2, zOffset + carLength / 2 + 0.05);
      const t2 = t1.clone();
      t2.position.x = 0.8;
      train.add(t1, t2);
    }
  }

  // Pantograph on car 2
  const pantoGeo = new THREE.BoxGeometry(1.2, 0.8, 0.8);
  const panto = new THREE.Mesh(pantoGeo, darkMat);
  panto.position.set(0, 3.2, -6);
  train.add(panto);

  return train;
}

// =========================================================================
// 🌉 5. PADMA MULTIPURPOSE BRIDGE (পদ্মা বহুমুখী সেতু)
// =========================================================================
export function buildPadmaBridgeSegment3D(length = 120) {
  const bridge = new THREE.Group();
  const steelTrussMat = new THREE.MeshStandardMaterial({ color: '#7AA3BE', metalness: 0.7, roughness: 0.4 });
  const concreteMat = new THREE.MeshLambertMaterial({ color: '#A0AAB2' });
  const waterMat = new THREE.MeshLambertMaterial({ map: createWaterTexture(), transparent: true, opacity: 0.9 });
  const railingMat = new THREE.MeshLambertMaterial({ color: '#4A5568' });

  // 1. Mighty River Water Surface (পদ্মা নদী) below
  const waterGeo = new THREE.PlaneGeometry(360, length + 20);
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, -6.5, 0);
  bridge.add(water);

  // 2. Colossal Concrete River Piers beneath
  for (let z = -length / 2; z <= length / 2; z += 40) {
    const pierGeo = new THREE.CylinderGeometry(2.4, 3.2, 9.0, 14);
    const pier = new THREE.Mesh(pierGeo, concreteMat);
    pier.position.set(0, -2.5, z);
    bridge.add(pier);

    // Street light on deck
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 4.5, 6);
    const leftPole = new THREE.Mesh(poleGeo, railingMat);
    leftPole.position.set(-5.6, 2.2, z);
    const rightPole = leftPole.clone();
    rightPole.position.x = 5.6;
    bridge.add(leftPole, rightPole);
  }

  // 3. Double-Deck Steel Truss Structure (Spanning overhead)
  // Left and Right main diagonal truss frameworks
  const trussHeight = 7.5;
  const leftX = -5.8;
  const rightX = 5.8;

  // Top longitudinal steel chords
  const chordGeo = new THREE.BoxGeometry(0.4, 0.4, length);
  const leftTopChord = new THREE.Mesh(chordGeo, steelTrussMat);
  leftTopChord.position.set(leftX, trussHeight, 0);
  const rightTopChord = leftTopChord.clone();
  rightTopChord.position.x = rightX;
  bridge.add(leftTopChord, rightTopChord);

  // Diagonal & Vertical Warren Truss members
  for (let z = -length / 2; z < length / 2; z += 10) {
    // Vertical uprights
    const vertGeo = new THREE.BoxGeometry(0.35, trussHeight, 0.35);
    const leftVert = new THREE.Mesh(vertGeo, steelTrussMat);
    leftVert.position.set(leftX, trussHeight / 2, z);
    const rightVert = leftVert.clone();
    rightVert.position.x = rightX;
    bridge.add(leftVert, rightVert);

    // Diagonal cross struts
    const diagGeo = new THREE.BoxGeometry(0.28, Math.sqrt(trussHeight * trussHeight + 100), 0.28);
    diagGeo.rotateX(0.65);
    const leftDiag = new THREE.Mesh(diagGeo, steelTrussMat);
    leftDiag.position.set(leftX, trussHeight / 2, z + 5);
    const rightDiag = leftDiag.clone();
    rightDiag.position.x = rightX;
    bridge.add(leftDiag, rightDiag);

    // Overhead Portal Wind Bracing cross-beams
    const portalGeo = new THREE.BoxGeometry(11.8, 0.35, 0.35);
    const portal = new THREE.Mesh(portalGeo, steelTrussMat);
    portal.position.set(0, trussHeight, z);
    bridge.add(portal);
  }

  // 4. Heavy Steel Safety Railings on road edges
  const railGeo = new THREE.BoxGeometry(0.25, 0.9, length);
  const leftRail = new THREE.Mesh(railGeo, railingMat);
  leftRail.position.set(-5.3, 0.45, 0);
  const rightRail = leftRail.clone();
  rightRail.position.x = 5.3;
  bridge.add(leftRail, rightRail);

  // 5. Traditional Bangladeshi Fishing Boats (নৌকা) on River Padma
  for (let b = 0; b < 2; b++) {
    const boat = buildRiverBoat3D();
    const bx = b === 0 ? -28 : 34;
    boat.position.set(bx, -6.3, (b - 0.5) * 50);
    boat.rotation.y = (b * Math.PI) / 3;
    bridge.add(boat);
  }

  return bridge;
}

// 🚣 Wooden Country Boat (নৌকা) floating on the Padma
export function buildRiverBoat3D() {
  const boat = new THREE.Group();
  const woodMat = new THREE.MeshLambertMaterial({ color: '#5A3825' });
  const bambooMat = new THREE.MeshLambertMaterial({ color: '#C8A058' });

  // Curved hull
  const hullGeo = new THREE.BoxGeometry(2.0, 0.8, 6.0);
  const hull = new THREE.Mesh(hullGeo, woodMat);
  hull.position.y = 0.4;
  boat.add(hull);

  // Pointed prow and stern
  const bowGeo = new THREE.ConeGeometry(1.0, 1.8, 4);
  bowGeo.rotateX(Math.PI / 2);
  const bow = new THREE.Mesh(bowGeo, woodMat);
  bow.position.set(0, 0.5, 3.8);
  const stern = bow.clone();
  stern.position.z = -3.8;
  stern.rotation.x = -Math.PI / 2;
  boat.add(bow, stern);

  // Bamboo arched canopy shelter (ছই)
  const canopyGeo = new THREE.CylinderGeometry(1.2, 1.2, 3.2, 8, 1, false, 0, Math.PI);
  canopyGeo.rotateZ(Math.PI / 2);
  canopyGeo.rotateY(Math.PI / 2);
  const canopy = new THREE.Mesh(canopyGeo, bambooMat);
  canopy.position.set(0, 1.2, 0);
  boat.add(canopy);

  return boat;
}

// =========================================================================
// 🚇 6. KARNAPHULI TUNNEL (বঙ্গবন্ধু শেখ মুজিবুর রহমান টানেল)
// =========================================================================
export function buildKarnaphuliTunnelSegment3D(length = 120, isPortal = false) {
  const tunnel = new THREE.Group();
  const tileMat = new THREE.MeshLambertMaterial({ map: createTunnelTileTexture() });
  const darkMat = new THREE.MeshLambertMaterial({ color: '#1B1E22' });
  const concreteMat = new THREE.MeshLambertMaterial({ color: '#525B64' });
  const yellowMat = new THREE.MeshBasicMaterial({ color: '#FFAE00' });
  const lightMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF' });
  const signMat = new THREE.MeshBasicMaterial({ color: '#006A4E' });

  // 1. Arched Concrete Tunnel Enclosure (Ceiling & Side Walls)
  const tunnelGeo = new THREE.CylinderGeometry(7.2, 7.2, length, 24, 1, true, 0, Math.PI);
  tunnelGeo.rotateZ(Math.PI / 2);
  tunnelGeo.rotateY(Math.PI / 2);
  const tube = new THREE.Mesh(tunnelGeo, tileMat);
  tube.position.set(0, 0.2, 0);
  tunnel.add(tube);

  // 2. Overhead Linear White & Amber LED Strip Lighting Arrays
  for (let z = -length / 2 + 10; z <= length / 2 - 10; z += 12) {
    const stripGeo = new THREE.BoxGeometry(0.2, 0.15, 8.0);
    const leftStrip = new THREE.Mesh(stripGeo, yellowMat);
    leftStrip.position.set(-4.5, 5.2, z);
    const rightStrip = leftStrip.clone();
    rightStrip.position.x = 4.5;
    const centerStrip = new THREE.Mesh(stripGeo, lightMat);
    centerStrip.position.set(0, 7.1, z);
    tunnel.add(leftStrip, rightStrip, centerStrip);

    // Industrial Jet Ventilation Fans suspended from ceiling
    if (z % 36 === 0) {
      const fanCylGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.4, 12);
      fanCylGeo.rotateX(Math.PI / 2);
      const fanMesh = new THREE.Mesh(fanCylGeo, darkMat);
      fanMesh.position.set(0, 6.2, z);
      tunnel.add(fanMesh);
    }
  }

  // 3. Grand Entrance Portal Arch (Open archway so road is completely clear)
  if (isPortal) {
    // Left Pillar (well off the road)
    const leftP = new THREE.Mesh(new THREE.BoxGeometry(3.0, 10, 3.5), concreteMat);
    leftP.position.set(-8.5, 5.0, length / 2);
    // Right Pillar (well off the road)
    const rightP = new THREE.Mesh(new THREE.BoxGeometry(3.0, 10, 3.5), concreteMat);
    rightP.position.set(8.5, 5.0, length / 2);
    // Top Arch Beam spanning high above
    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(20.0, 2.8, 3.5), concreteMat);
    topBeam.position.set(0, 9.5, length / 2);
    tunnel.add(leftP, rightP, topBeam);

    // Signboard high on top beam
    const signBoardGeo = new THREE.BoxGeometry(14, 1.8, 0.4);
    const signBoard = new THREE.Mesh(signBoardGeo, signMat);
    signBoard.position.set(0, 9.8, length / 2 + 1.8);
    tunnel.add(signBoard);

    // Sign Canvas Texture
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 512;
    signCanvas.height = 96;
    const sctx = signCanvas.getContext('2d');
    sctx.fillStyle = '#006A4E';
    sctx.fillRect(0, 0, 512, 96);
    sctx.strokeStyle = '#F5A623';
    sctx.lineWidth = 6;
    sctx.strokeRect(4, 4, 504, 88);
    sctx.fillStyle = '#FFFFFF';
    sctx.font = 'bold 24px "Hind Siliguri", sans-serif';
    sctx.textAlign = 'center';
    sctx.fillText('বঙ্গবন্ধু শেখ মুজিবুর রহমান টানেল', 256, 46);
    sctx.fillStyle = '#FFDD80';
    sctx.font = 'bold 16px "Hind Siliguri", sans-serif';
    sctx.fillText('কর্ণফুলী নদীর তলদেশের আন্ডারওয়াটার এক্সপ্রেসওয়ে', 256, 76);

    const stex = new THREE.CanvasTexture(signCanvas);
    const stexGeo = new THREE.PlaneGeometry(13.6, 1.6);
    const stexMesh = new THREE.Mesh(stexGeo, new THREE.MeshBasicMaterial({ map: stex }));
    stexMesh.position.set(0, 9.8, length / 2 + 2.02);
    tunnel.add(stexMesh);
  }

  return tunnel;
}

// =========================================================================
// ⚛️ 7. ROOPPUR NUCLEAR POWER PLANT (রূপপুর পারমাণবিক বিদ্যুৎ কেন্দ্র)
// =========================================================================
export function buildNuclearPlant3D() {
  const plant = new THREE.Group();
  const towerMat = new THREE.MeshLambertMaterial({ color: '#CBD4DC' });
  const domeMat = new THREE.MeshLambertMaterial({ color: '#E2E8F0' });
  const pylonMat = new THREE.MeshStandardMaterial({ color: '#556575', metalness: 0.8, roughness: 0.4 });
  const yellowSymbolMat = new THREE.MeshBasicMaterial({ color: '#FFD700' });
  const steamMat = new THREE.MeshLambertMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.65 });

  // 1. Two Gigantic Hyperbolic Cooling Towers
  const towerPositions = [
    [-24, 0, -10],
    [-42, 0, 15]
  ];

  const steamMeshes = [];

  towerPositions.forEach(([x, y, z]) => {
    // Hyperboloid profile approximated with stacked tapered cylinders
    const towerH = 26;
    const baseGeo = new THREE.CylinderGeometry(8.5, 12.0, towerH * 0.55, 20, 1, true);
    const base = new THREE.Mesh(baseGeo, towerMat);
    base.position.set(x, towerH * 0.275, z);

    const neckGeo = new THREE.CylinderGeometry(9.6, 8.5, towerH * 0.45, 20, 1, true);
    const neck = new THREE.Mesh(neckGeo, towerMat);
    neck.position.set(x, towerH * 0.775, z);

    plant.add(base, neck);

    // Billowing Steam Plumes from the top of cooling towers
    for (let s = 0; s < 4; s++) {
      const steamGeo = new THREE.SphereGeometry(3.5 + s * 0.9, 8, 8);
      const steam = new THREE.Mesh(steamGeo, steamMat);
      steam.position.set(x + (Math.random() - 0.5) * 2, towerH + 2 + s * 3.5, z + (Math.random() - 0.5) * 2);
      plant.add(steam);
      steamMeshes.push(steam);
    }
  });

  // 2. Spherical Reactor Containment Dome
  const reactorGeo = new THREE.SphereGeometry(8.0, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const reactor = new THREE.Mesh(reactorGeo, domeMat);
  reactor.position.set(-15, 0, 18);
  plant.add(reactor);

  // Turbine Hall Building alongside reactor
  const hallGeo = new THREE.BoxGeometry(18, 6.5, 14);
  const hall = new THREE.Mesh(hallGeo, towerMat);
  hall.position.set(-16, 3.25, 34);
  plant.add(hall);

  // 3. High-Voltage Electricity Transmission Pylons (Steel lattice towers)
  for (let p = 0; p < 2; p++) {
    const pylon = new THREE.Group();
    const pz = -35 + p * 45;

    // Tapered 4-legged lattice mast
    const mastGeo = new THREE.CylinderGeometry(0.3, 1.8, 20, 4);
    const mast = new THREE.Mesh(mastGeo, pylonMat);
    mast.position.set(-12, 10, pz);
    pylon.add(mast);

    // Cross-arms for high voltage conductors
    const arm1 = new THREE.BoxGeometry(8, 0.4, 0.4);
    const m1 = new THREE.Mesh(arm1, pylonMat);
    m1.position.set(-12, 16, pz);
    const arm2 = new THREE.BoxGeometry(10, 0.4, 0.4);
    const m2 = new THREE.Mesh(arm2, pylonMat);
    m2.position.set(-12, 13, pz);
    pylon.add(m1, m2);

    plant.add(pylon);
  }

  plant.userData = { steamMeshes };
  return plant;
}

// =========================================================================
// 🌾 8. AUTHENTIC BANGLADESHI VILLAGE CLUSTER (পল্লীবাংলা ও টং দোকান)
// =========================================================================
export function buildVillageCluster3D() {
  const village = new THREE.Group();

  // 1. Mud & Tin Hut with Veranda
  const hut = buildHut3D();
  hut.position.set(-12, 0, 0);
  village.add(hut);

  // Second hut
  const hut2 = buildHut3D();
  hut2.position.set(-18, 0, 14);
  hut2.scale.set(0.85, 0.85, 0.85);
  village.add(hut2);

  // 2. Village Tea Stall (চায়ের টং দোকান)
  const stall = buildTeaStall3D();
  stall.position.set(-8.5, 0, -10);
  stall.rotation.y = Math.PI / 4;
  village.add(stall);

  // 3. Golden Haystacks (খড়ের গাদা)
  const hayMat = new THREE.MeshLambertMaterial({ color: '#D4A842' });
  for (let i = 0; i < 2; i++) {
    const hayGeo = new THREE.ConeGeometry(1.6, 3.2, 8);
    const hay = new THREE.Mesh(hayGeo, hayMat);
    hay.position.set(-15 + i * 4, 1.6, -18 + i * 3);
    village.add(hay);
  }

  // 4. Palm & Banana trees
  const palm = buildPalmTree3D();
  palm.position.set(-20, 0, -4);
  village.add(palm);

  const banana = buildBananaTree3D();
  banana.position.set(-10, 0, 18);
  village.add(banana);

  return village;
}

// ☕ Bangladeshi Roadside Tea Stall (টং দোকান)
export function buildTeaStall3D() {
  const stall = new THREE.Group();
  const woodMat = new THREE.MeshLambertMaterial({ color: '#6A4B35' });
  const tinMat = new THREE.MeshLambertMaterial({ color: '#8899A6' });
  const benchMat = new THREE.MeshLambertMaterial({ color: '#8B5A2B' });

  // Wooden counter booth
  const counterGeo = new THREE.BoxGeometry(2.4, 1.2, 1.6);
  const counter = new THREE.Mesh(counterGeo, woodMat);
  counter.position.y = 0.6;
  stall.add(counter);

  // Corrugated Tin Roof angled forward
  const roofGeo = new THREE.BoxGeometry(3.0, 0.1, 2.4);
  roofGeo.rotateX(0.18);
  const roof = new THREE.Mesh(roofGeo, tinMat);
  roof.position.set(0, 2.2, 0);
  stall.add(roof);

  // Wooden Benches for customers
  const benchGeo = new THREE.BoxGeometry(2.2, 0.45, 0.6);
  const bench = new THREE.Mesh(benchGeo, benchMat);
  bench.position.set(0, 0.22, 1.6);
  stall.add(bench);

  // Red & Yellow tea kettle on counter
  const kettleGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.35, 8);
  const kettle = new THREE.Mesh(kettleGeo, new THREE.MeshLambertMaterial({ color: '#C8442B' }));
  kettle.position.set(0.6, 1.38, 0);
  stall.add(kettle);

  return stall;
}

// =========================================================================
// 🏙️ 9. DHAKA MODERN CITY SKYSCRAPER & COMMERCIAL TOWERS
// =========================================================================
export function buildCitySkyscraper3D(height = 28, theme = 'metro') {
  const building = new THREE.Group();
  const concreteMat = new THREE.MeshLambertMaterial({ color: '#4A545E' });
  const glassMat = new THREE.MeshStandardMaterial({
    color: theme === 'metro' ? '#18453B' : '#1C3A5A',
    roughness: 0.2,
    metalness: 0.8
  });

  // Tower core
  const towerGeo = new THREE.BoxGeometry(12, height, 12);
  const tower = new THREE.Mesh(towerGeo, concreteMat);
  tower.position.y = height / 2;
  building.add(tower);

  // Reflective glass facade bands
  for (let y = 3; y < height - 2; y += 3) {
    const glassGeo = new THREE.BoxGeometry(12.1, 1.8, 12.1);
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.y = y;
    building.add(glass);
  }

  // Giant Rooftop Illuminated Billboard
  const billboard = buildBillboard3D('ডিজিটাল বাংলাদেশ', 'মেট্রোরেলে বদলে গেছে ঢাকা', 'metro');
  billboard.position.set(0, height + 3.2, 0);
  building.add(billboard);

  return building;
}

// 🪧 Roadside / Rooftop Highway Billboard
export function buildBillboard3D(title, subtitle = '', theme = 'padma') {
  const board = new THREE.Group();
  const steelMat = new THREE.MeshStandardMaterial({ color: '#2C3539', metalness: 0.7 });
  const tex = createBanglaBillboardTexture(title, subtitle, theme);
  const faceMat = new THREE.MeshBasicMaterial({ map: tex });

  // Dual Support Steel Columns
  const colGeo = new THREE.CylinderGeometry(0.2, 0.2, 6.0, 8);
  const leftCol = new THREE.Mesh(colGeo, steelMat);
  leftCol.position.set(-3.2, 3.0, 0);
  const rightCol = leftCol.clone();
  rightCol.position.x = 3.2;
  board.add(leftCol, rightCol);

  // Main Display Board
  const boardGeo = new THREE.BoxGeometry(8.5, 4.2, 0.3);
  const boardMesh = new THREE.Mesh(boardGeo, faceMat);
  boardMesh.position.set(0, 7.5, 0);
  board.add(boardMesh);

  return board;
}

// =========================================================================
// 🛺 10. AUTHENTIC BANGLADESHI CNG AUTO-RICKSHAW (সবুজ সিএনজি)
// =========================================================================
export function buildCNG3D() {
  const cng = new THREE.Group();
  const greenMat = new THREE.MeshLambertMaterial({ color: '#007A3D' });
  const yellowMat = new THREE.MeshLambertMaterial({ color: '#FFD700' });
  const hoodMat = new THREE.MeshLambertMaterial({ color: '#1A1816' });
  const glassMat = new THREE.MeshLambertMaterial({ color: '#8CE0FF', transparent: true, opacity: 0.75 });
  const tireMat = new THREE.MeshLambertMaterial({ color: '#151515' });

  // 1. Lower Body Shell (Green)
  const bodyGeo = new THREE.BoxGeometry(1.4, 0.7, 2.4);
  const body = new THREE.Mesh(bodyGeo, greenMat);
  body.position.y = 0.65;
  cng.add(body);

  // Yellow warning bumper strip
  const stripGeo = new THREE.BoxGeometry(1.42, 0.12, 2.42);
  const strip = new THREE.Mesh(stripGeo, yellowMat);
  strip.position.y = 0.55;
  cng.add(strip);

  // 2. Black Canvas Canopy / Hood
  const hoodGeo = new THREE.BoxGeometry(1.35, 0.8, 1.8);
  const hood = new THREE.Mesh(hoodGeo, hoodMat);
  hood.position.set(0, 1.4, -0.2);
  cng.add(hood);

  // Windshield
  const windGeo = new THREE.PlaneGeometry(1.2, 0.65);
  const wind = new THREE.Mesh(windGeo, glassMat);
  wind.position.set(0, 1.35, 1.05);
  cng.add(wind);

  // Single Front Headlight
  const lightGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 10);
  lightGeo.rotateX(Math.PI / 2);
  const light = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: '#FFF8EC' }));
  light.position.set(0, 0.75, 1.25);
  cng.add(light);

  // 3 Wheels (1 Front, 2 Rear)
  const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.22, 12);
  wheelGeo.rotateZ(Math.PI / 2);

  const frontWheel = new THREE.Mesh(wheelGeo, tireMat);
  frontWheel.position.set(0, 0.3, 0.95);
  const leftWheel = new THREE.Mesh(wheelGeo, tireMat);
  leftWheel.position.set(-0.7, 0.3, -0.7);
  const rightWheel = leftWheel.clone();
  rightWheel.position.x = 0.7;

  cng.add(frontWheel, leftWheel, rightWheel);
  cng.userData = { wheels: [frontWheel, leftWheel, rightWheel] };
  return cng;
}

// =========================================================================
// 🚌 11. BANGLADESHI HIGHWAY BUS (রঙিন লোকাল বাস)
// =========================================================================
export function buildBus3D(primaryColor = '#1F6E8C', name = 'ঢাকা টু যশোর') {
  const bus = new THREE.Group();
  const bodyMat = new THREE.MeshLambertMaterial({ color: primaryColor });
  const roofMat = new THREE.MeshLambertMaterial({ color: '#F5A623' });
  const darkMat = new THREE.MeshLambertMaterial({ color: '#1B242C' });
  const glassMat = new THREE.MeshLambertMaterial({ color: '#8CE0FF', transparent: true, opacity: 0.75 });
  const tireMat = new THREE.MeshLambertMaterial({ color: '#151515' });

  // 1. Long Aerodynamic Bus Body
  const bodyGeo = new THREE.BoxGeometry(2.5, 2.2, 8.4);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 1.7;
  bus.add(body);

  // Painted Crown Roof
  const roofGeo = new THREE.BoxGeometry(2.52, 0.4, 8.42);
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = 2.9;
  bus.add(roof);

  // Roof Luggage Carrier with Canvas Covers
  const rackGeo = new THREE.BoxGeometry(2.0, 0.35, 5.0);
  const rack = new THREE.Mesh(rackGeo, darkMat);
  rack.position.set(0, 3.25, -0.5);
  bus.add(rack);

  // Passenger Windows Band
  const winGeo = new THREE.BoxGeometry(2.55, 0.75, 7.2);
  const win = new THREE.Mesh(winGeo, glassMat);
  win.position.set(0, 2.05, -0.2);
  bus.add(win);

  // Front Windshield
  const fwindGeo = new THREE.PlaneGeometry(2.2, 0.9);
  const fwind = new THREE.Mesh(fwindGeo, glassMat);
  fwind.position.set(0, 2.05, 4.22);
  bus.add(fwind);

  // Destination Board (গন্তব্য)
  const destGeo = new THREE.BoxGeometry(1.8, 0.35, 0.1);
  const dest = new THREE.Mesh(destGeo, new THREE.MeshBasicMaterial({ color: '#C8442B' }));
  dest.position.set(0, 2.7, 4.22);
  bus.add(dest);

  // Dual Headlights
  const lightGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 10);
  lightGeo.rotateX(Math.PI / 2);
  const l1 = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: '#FFFDE0' }));
  l1.position.set(-0.85, 0.9, 4.22);
  const l2 = l1.clone();
  l2.position.x = 0.85;
  bus.add(l1, l2);

  // 6 Heavy Rolling Wheels
  const wheels = [];
  const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.38, 14);
  wheelGeo.rotateZ(Math.PI / 2);

  const wheelPositions = [
    [-1.28, 0.5, 2.6],
    [1.28, 0.5, 2.6],
    [-1.28, 0.5, -2.0],
    [1.28, 0.5, -2.0],
    [-1.28, 0.5, -3.2],
    [1.28, 0.5, -3.2]
  ];

  wheelPositions.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, tireMat);
    wheel.position.set(x, y, z);
    bus.add(wheel);
    wheels.push(wheel);
  });

  bus.userData = { wheels };
  return bus;
}

// =========================================================================
// 🥬 12. WHOLESALE PRODUCE MARKET (কাওরান বাজার পাইকারি আড়ৎ - গন্তব্য)
// =========================================================================
export function buildMarketDestination3D() {
  const market = new THREE.Group();
  const tinMat = new THREE.MeshLambertMaterial({ color: '#8294A0' });
  const woodMat = new THREE.MeshLambertMaterial({ color: '#6E482C' });
  const redMat = new THREE.MeshBasicMaterial({ color: '#C8442B' });
  const greenMat = new THREE.MeshBasicMaterial({ color: '#2E7D32' });
  const sackMat = new THREE.MeshLambertMaterial({ color: '#C49746' });
  const archMat = new THREE.MeshStandardMaterial({ color: '#F5A623', metalness: 0.5 });

  // 1. Grand Welcome Arch Gate spanning across the highway (wide clearance)
  const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 9.5, 1.4), archMat);
  leftPillar.position.set(-8.5, 4.75, 0);
  const rightPillar = leftPillar.clone();
  rightPillar.position.x = 8.5;
  market.add(leftPillar, rightPillar);

  // Cross beam
  const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(19.0, 1.6, 1.6), archMat);
  crossBeam.position.set(0, 9.8, 0);
  market.add(crossBeam);

  // Grand Signboard Canvas "কাওরান বাজার পাইকারি আড়ৎ"
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512;
  signCanvas.height = 128;
  const sctx = signCanvas.getContext('2d');
  sctx.fillStyle = '#C8442B';
  sctx.fillRect(0, 0, 512, 128);
  sctx.strokeStyle = '#FFD700';
  sctx.lineWidth = 8;
  sctx.strokeRect(6, 6, 500, 116);
  sctx.fillStyle = '#FFFFFF';
  sctx.font = 'bold 36px "Hind Siliguri", sans-serif';
  sctx.textAlign = 'center';
  sctx.fillText('কাওরান বাজার পাইকারি আড়ৎ', 256, 55);
  sctx.fillStyle = '#FFE082';
  sctx.font = 'bold 22px "Hind Siliguri", sans-serif';
  sctx.fillText('সবজি আনলোড পয়েন্ট • শুভ আগমন', 256, 95);

  const signTex = new THREE.CanvasTexture(signCanvas);
  const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(14, 2.8), new THREE.MeshBasicMaterial({ map: signTex }));
  signMesh.position.set(0, 11.2, 0.85);
  market.add(signMesh);

  // 2. Left & Right Wholesale Produce Sheds (Safely placed at +/-15m off the road)
  [-15, 15].forEach((xSide, idx) => {
    // Shed roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 18), tinMat);
    roof.position.set(xSide, 4.2, 8);
    roof.rotation.z = idx === 0 ? 0.15 : -0.15;
    market.add(roof);

    // Support poles
    for (let pz = 0; pz <= 16; pz += 8) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4.2, 8), woodMat);
      pole.position.set(xSide - 4, 2.1, pz);
      const pole2 = pole.clone();
      pole2.position.x = xSide + 4;
      market.add(pole, pole2);
    }

    // Crates and sacks of produce stacked under shed
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        const crate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 1.2), woodMat);
        crate.position.set(xSide + (c - 1) * 1.6, 0.35, 2 + r * 3.5);
        market.add(crate);

        // Vegetable sack on top
        const sack = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), sackMat);
        sack.scale.set(1.2, 0.8, 1.0);
        sack.position.set(xSide + (c - 1) * 1.6, 0.95, 2 + r * 3.5);
        market.add(sack);
      }
    }
  });

  return market;
}


