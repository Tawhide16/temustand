import * as THREE from 'three';
import { sound } from '../systems/audio.js';
import { toBengaliNumber, formatTaka } from '../systems/utils.js';
import {
  buildTruck3D,
  buildPalmTree3D,
  buildBananaTree3D,
  buildHut3D,
  buildTeaStall3D,
  buildCurzonHall3D,
  buildMetroViaductSegment3D,
  buildMetroTrain3D,
  buildKarnaphuliTunnelSegment3D,
  buildVillageCluster3D,
  buildCitySkyscraper3D,
  buildBillboard3D,
  buildMarketDestination3D,
  buildCNG3D,
  buildBus3D
} from '../systems/models3d.js';
import { createRoadTexture } from '../systems/textureGenerator.js';

// =========================================================================
// 🗺️ 6 EXACT SCENERIES & ROUTE ZONES (VILLAGE ➔ CITY ➔ UNIVERSITY ➔ TUNNEL ➔ RAIL ➔ MARKET)
// =========================================================================
export const ROUTE_ZONES = [
  {
    id: 'village',
    minKm: 10.0,
    maxKm: 12.0,
    name: '১. পল্লীগ্রাম (Village)',
    icon: '🌾',
    subtitle: 'শান্ত শ্যামল গ্রামবাংলা, কুঁড়েঘর ও চায়ের টং দোকান',
    skyColor: '#96BA9F',
    fogDensity: 0.006,
    groundColor: '#4C7A32',
    isTunnel: false
  },
  {
    id: 'city',
    minKm: 8.0,
    maxKm: 10.0,
    name: '২. আধুনিক শহর (City)',
    icon: '🏙️',
    subtitle: 'উঁচু স্কাইস্ক্র্যাপার, বাণিজ্যিক টাওয়ার ও রঙিন বিলবোর্ড',
    skyColor: '#6DA3D6',
    fogDensity: 0.006,
    groundColor: '#3D4952',
    isTunnel: false
  },
  {
    id: 'university',
    minKm: 6.0,
    maxKm: 8.0,
    name: '৩. বিশ্ববিদ্যালয় (University)',
    icon: '🏫',
    subtitle: 'ঐতিহাসিক ঢাকা বিশ্ববিদ্যালয় ও লাল ইটের কার্জন হল',
    skyColor: '#8E9BAC',
    fogDensity: 0.007,
    groundColor: '#455A44',
    isTunnel: false
  },
  {
    id: 'tunnel',
    minKm: 4.0,
    maxKm: 6.0,
    name: '৪. আন্ডারওয়াটার টানেল (Tunnel)',
    icon: '🚇',
    subtitle: 'নদীর তলদেশের আধুনিক টানেল ও আলোকিত নিয়ন সুড়ঙ্গ',
    skyColor: '#101418',
    fogDensity: 0.016,
    groundColor: '#1A1E24',
    isTunnel: true
  },
  {
    id: 'rail',
    minKm: 1.5,
    maxKm: 4.0,
    name: '৫. রেল ও মেট্রোরেল (Rail)',
    icon: '🚊',
    subtitle: 'এলিভেটেড ভায়াডাক্ট ও মাথার উপর দিয়ে চলমান মেট্রোরেল',
    skyColor: '#8096A8',
    fogDensity: 0.007,
    groundColor: '#3F5244',
    isTunnel: false
  },
  {
    id: 'bajar',
    minKm: 0.0,
    maxKm: 1.5,
    name: '৬. কাওরান বাজার আড়ৎ (Market Delivery)',
    icon: '🥬',
    subtitle: 'গন্তব্য: পাইকারি সবজির আড়ৎ — মাল খালাস পয়েন্ট',
    skyColor: '#E6A25D', // Golden arrival glow
    fogDensity: 0.006,
    groundColor: '#45382B',
    isTunnel: false
  }
];

export class DriverScene3D {
  constructor(engine) {
    this.engine = engine;

    // Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animId = null;

    // Trip & Stats
    this.totalTripKm = 12.0;
    this.distanceKm = 12.0;
    this.vegetablesKg = 1000;
    this.delivered = false;

    // Driving Physics & Speed (Stationary until Up arrow / Forward is pressed!)
    this.speed = 0; // Starts stopped (0 km/h)
    this.baseSpeed = 0;
    this.cruiseSpeed = 75; // Forward driving speed
    this.boostSpeed = 135; // Turbo boost speed
    this.reverseSpeed = -25;
    this.minSpeed = -30;
    this.maxSpeed = 140;
    this.isBoostActive = false;

    // Continuous 4-way Control State (Keyboard / UI Buttons)
    this.keyState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      boost: false
    };

    // Free Steering (Smooth lateral positioning across the road)
    this.truckX = 0; // -4.2 to 4.2
    this.truckZ = 0;
    this.roadHalfWidth = 4.2;

    // World & Environment
    this.roadSegments = [];
    this.roadsideProps = [];
    this.landmarkSuperstructures = [];
    this.currentZone = ROUTE_ZONES[0];
    this.lastAnnouncedZoneId = null;

    // Active Animated Props
    this.movingMetroTrain = null;
    this.curzonHall = null;
    this.marketGate = null;

    // Environmental Lights
    this.groundMesh = null;
    this.ambientLight = null;
    this.sunLight = null;
    this.tunnelLight = null;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  render(container) {
    this.container = container;
    const char = this.engine.gameState.character || { name: 'ওস্তাদ করিম' };
    const truckColor = this.engine.gameState.truckColor?.hex || '#F5A623';

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; height: 100%; position: relative; background: #0F0A06; overflow: hidden; user-select: none;">
        
        <!-- Top HUD Header -->
        <div style="position: absolute; top: 0; left: 0; right: 0; background: linear-gradient(180deg, rgba(15,10,7,0.96) 0%, rgba(15,10,7,0) 100%); padding: 8px 12px; z-index: 20; pointer-events: none; width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: center; pointer-events: auto; width: 100%; gap: 8px; flex-wrap: wrap;">
            
            <!-- Driver Name & Mission -->
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="color: #3F9B5B; font-weight: 800; font-size: clamp(0.95rem, 2.5vw, 1.15rem); text-shadow: 0 2px 4px rgba(0,0,0,0.8);">
                🚚 ${char.name}
              </span>
              <span style="font-size: 0.72rem; background: rgba(200,68,43,0.85); color: #FFF8EC; padding: 2px 8px; border-radius: 6px; font-weight: bold; border: 1px solid #F5A623;">
                গ্রাম ➔ শহর ➔ কাওরান বাজার
              </span>
            </div>

            <!-- Current Zone Pill Indicator -->
            <div id="hud-zone-pill" style="display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); padding: 4px 14px; border-radius: 20px; border: 1.5px solid #F5A623; color: #FFF8EC; font-size: 0.82rem; font-weight: bold; box-shadow: 0 2px 10px rgba(0,0,0,0.5);">
              <span id="zone-icon">🌾</span>
              <span id="zone-title">১. পল্লীগ্রাম (Village)</span>
            </div>

            <!-- Distance Remaining -->
            <div style="color: #FFF8EC; font-weight: 800; font-size: 0.92rem; background: rgba(0,0,0,0.65); backdrop-filter: blur(6px); padding: 3px 14px; border-radius: 20px; border: 1px solid rgba(63,155,91,0.5); white-space: nowrap;">
              📍 বাকি: <span id="hud-distance" style="color: #3F9B5B; font-size: 1.2rem;">১২.০</span> কিমি
            </div>
          </div>

          <!-- Produce Load Status & Driving Hint -->
          <div style="display: flex; gap: 8px; margin-top: 6px; pointer-events: auto; width: 100%; max-width: 620px; align-items: center; flex-wrap: wrap;">
            <div style="background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); padding: 3px 10px; border-radius: 8px; border: 1px solid rgba(63,155,91,0.3); text-align: center;">
              <span style="font-size: 0.65rem; color: #7EE096;">সবজির চালান:</span>
              <span style="color: #FFF8EC; font-weight: 800; font-size: 0.95rem; margin-left: 4px;">১,০০০ কেজি</span>
            </div>
            
            <div style="font-size: 0.72rem; color: #FFE082; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); padding: 3px 10px; border-radius: 8px; border: 1px solid rgba(245,166,35,0.4); font-weight: bold;">
              🎮 গাড়ি চালাতে <strong>⬆️ বা W</strong> চেপে রাখুন • বুস্টে <strong>Shift</strong>
            </div>

            <div id="turbo-badge-top" style="display: none; background: linear-gradient(90deg, #F5A623, #FF4500); color: #FFF; font-weight: 900; font-size: 0.75rem; padding: 3px 12px; border-radius: 8px; align-items: center; gap: 4px; animation: pulse 0.6s infinite alternate;">
              ⚡ টার্বো বুস্ট সক্রিয়!
            </div>
          </div>
        </div>

        <!-- 3D WebGL Canvas Viewport -->
        <div id="three-container" style="flex: 1; width: 100%; height: 100%; position: relative; overflow: hidden;">
          
          <!-- Animated Landmark Announcement Banner -->
          <div id="landmark-banner" style="display: none; position: absolute; top: 105px; left: 50%; transform: translateX(-50%) translateY(-20px); opacity: 0; background: rgba(20, 14, 10, 0.94); border: 2px solid #F5A623; border-radius: 14px; padding: 10px 24px; z-index: 28; box-shadow: 0 10px 35px rgba(0,0,0,0.85); text-align: center; pointer-events: none; transition: all 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275); min-width: 290px; max-width: 90%;">
            <div id="banner-badge" style="font-size: 0.72rem; color: #F5A623; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800;">
              📍 নতুন অঞ্চল
            </div>
            <div id="banner-title" style="font-size: clamp(1.15rem, 3.2vw, 1.45rem); color: #FFF8EC; font-weight: 900; margin: 3px 0;">
              ১. পল্লীগ্রাম (Village)
            </div>
            <div id="banner-subtitle" style="font-size: 0.82rem; color: #DDD;">
              শান্ত শ্যামল গ্রামবাংলা, কুঁড়েঘর ও চায়ের টং দোকান
            </div>
          </div>

          <!-- Speedometer Dial (Bottom-Left) -->
          <div id="speedo-box" style="position: absolute; bottom: 85px; left: 14px; width: 88px; height: 88px; background: rgba(26,17,11,0.85); backdrop-filter: blur(6px); border-radius: 50%; border: 2.5px solid #F5A623; box-shadow: 0 4px 15px rgba(0,0,0,0.6); z-index: 25; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: all 0.2s;">
            <div style="font-size: 0.62rem; color: #AAA; text-transform: uppercase;">গতি</div>
            <div id="speedo-number" style="font-size: 1.35rem; font-weight: 900; color: #F5A623; line-height: 1;">০</div>
            <div style="font-size: 0.58rem; color: #FFF8EC;">কিমি/ঘণ্টা</div>
          </div>

        </div>

        <!-- Bottom Controls Console: 4-Way Steering + Shift Turbo Boost + Horn -->
        <div style="background: rgba(20, 13, 8, 0.96); padding: 8px 12px; border-top: 3px solid rgba(245,166,35,0.35); width: 100%; z-index: 30;">
          <div style="display: flex; gap: 8px; width: 100%; max-width: 820px; margin: 0 auto; align-items: center;">
            
            <!-- Left / Right Steering -->
            <button id="btn-ctrl-left" class="btn btn-secondary" style="flex: 1; min-height: 52px; font-size: clamp(0.95rem, 2.2vw, 1.15rem); padding: 4px 8px;">
              ◀ বাঁয়ে <span class="kbd-hint">A / ⬅️</span>
            </button>

            <!-- Forward / Backward Drive -->
            <button id="btn-ctrl-forward" class="btn btn-secondary" style="flex: 1.1; min-height: 52px; font-size: clamp(0.95rem, 2.2vw, 1.15rem); padding: 4px 8px; background: #2A402A; border-color: #3F9B5B;">
              ⬆️ সামনে <span class="kbd-hint">W / ⬆️</span>
            </button>

            <button id="btn-ctrl-backward" class="btn btn-secondary" style="flex: 1.1; min-height: 52px; font-size: clamp(0.95rem, 2.2vw, 1.15rem); padding: 4px 8px; background: #402A2A; border-color: #C8442B;">
              ⬇️ পেছনে <span class="kbd-hint">S / ⬇️</span>
            </button>

            <button id="btn-ctrl-right" class="btn btn-secondary" style="flex: 1; min-height: 52px; font-size: clamp(0.95rem, 2.2vw, 1.15rem); padding: 4px 8px;">
              ডানে ▶ <span class="kbd-hint">D / ➡️</span>
            </button>

            <!-- Turbo Boost (Shift) Button -->
            <button id="btn-ctrl-boost" class="btn btn-accent" style="flex: 1.3; min-height: 52px; font-size: clamp(0.95rem, 2.2vw, 1.15rem); padding: 4px 8px; background: linear-gradient(135deg, #FF6B35, #D82B00); border: 1.5px solid #FFD700; font-weight: 900;">
              ⚡ বুস্ট <span class="kbd-hint" style="color:#FFF;">Shift</span>
            </button>

            <!-- Horn Button -->
            <button id="btn-ctrl-horn" class="btn btn-primary pulse-glow" style="flex: 1.2; min-height: 52px; font-size: clamp(0.95rem, 2.2vw, 1.15rem); padding: 4px 8px;">
              📢 হর্ন <span class="kbd-hint" style="color:#111;">Space</span>
            </button>

          </div>
        </div>

      </div>
    `;

    this.initThree(truckColor);
    this.bindControls();
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('resize', this.handleResize);

    this.startLoop();
    sound.fadeBGMToLow();
    this.announceZone(this.currentZone);
  }

  initThree(truckColor) {
    const container = this.container.querySelector('#three-container');
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene & Atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.currentZone.skyColor);
    this.scene.fog = new THREE.FogExp2(this.currentZone.skyColor, this.currentZone.fogDensity);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 450);
    this.camera.position.set(0, 4.8, 9.5);
    this.camera.lookAt(0, 2.2, -8.0);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    // 4. Lights
    this.ambientLight = new THREE.AmbientLight('#FFF8EC', 0.7);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight('#FFF3D1', 1.2);
    this.sunLight.position.set(25, 45, 20);
    this.sunLight.castShadow = true;
    this.scene.add(this.sunLight);

    this.tunnelLight = new THREE.PointLight('#FFAE00', 0, 40);
    this.tunnelLight.position.set(0, 6, -10);
    this.scene.add(this.tunnelLight);

    // 5. Ground Plane
    const groundGeo = new THREE.PlaneGeometry(360, 600);
    this.groundMat = new THREE.MeshLambertMaterial({ color: this.currentZone.groundColor });
    this.groundMesh = new THREE.Mesh(groundGeo, this.groundMat);
    this.groundMesh.rotation.x = -Math.PI / 2;
    this.groundMesh.position.set(0, -0.05, -150);
    this.scene.add(this.groundMesh);

    // 6. Smooth Scrolling Road (NO obstacles on road!)
    const roadTex = createRoadTexture();
    roadTex.repeat.set(1, 10);
    const roadMat = new THREE.MeshLambertMaterial({ map: roadTex });

    for (let i = 0; i < 4; i++) {
      const roadGeo = new THREE.PlaneGeometry(10.5, 120);
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.rotation.x = -Math.PI / 2;
      road.position.set(0, 0, -i * 120);
      this.scene.add(road);
      this.roadSegments.push(road);
    }

    // 7. Player Truck
    this.truck = buildTruck3D(truckColor, 'হর্ন দিন');
    this.truck.position.set(0, 0, 0);
    this.truck.rotation.y = Math.PI;
    this.scene.add(this.truck);

    // 8. Roadside Scenery (Village, City, DU, Tunnel, Rail, Market)
    this.initRoadsideProps();
    this.initZoneLandmarks();
  }

  initRoadsideProps() {
    for (let z = -20; z > -360; z -= 16) {
      this.spawnRoadsideProp(z);
    }
  }

  // Spawns scenery safely off the road on the grass/sidewalk (never on the road!)
  spawnRoadsideProp(z) {
    const isLeft = Math.random() > 0.5;
    // Road edge is +/-5.25m. Minimum X is +/-10.5m so all props are at least 5.25m away on the grass!
    const x = isLeft ? -(10.5 + Math.random() * 8) : (10.5 + Math.random() * 8);

    let prop;
    const zoneId = this.currentZone.id;

    if (zoneId === 'village') {
      // Use clean single-model props centered at (0,0,0) — never clusters with internal offsets!
      const bList = [buildHut3D, buildTeaStall3D, buildPalmTree3D, buildBananaTree3D];
      const b = bList[Math.floor(Math.random() * bList.length)];
      prop = b();
    } else if (zoneId === 'city') {
      const bList = [
        () => buildCitySkyscraper3D(26, 'metro'),
        () => buildBillboard3D('ডিজিটাল বাংলাদেশ', 'স্বপ্নের রাজধানী এক্সপ্রেস', 'metro'),
        buildPalmTree3D
      ];
      const b = bList[Math.floor(Math.random() * bList.length)];
      prop = b();
    } else if (zoneId === 'university') {
      const bList = [
        () => buildBillboard3D('ঢাকা বিশ্ববিদ্যালয়', 'প্রাচ্যের অক্সফোর্ড ক্যাম্পাস', 'parliament'),
        buildPalmTree3D
      ];
      const b = bList[Math.floor(Math.random() * bList.length)];
      prop = b();
    } else if (zoneId === 'tunnel') {
      // Inside tunnel, props hidden
      prop = new THREE.Group();
    } else if (zoneId === 'rail') {
      const bList = [
        () => buildBillboard3D('ঢাকা মেট্রোরেল MRT-6', 'উত্তরা টু মতিঝিল সরাসরি', 'metro'),
        () => buildCitySkyscraper3D(24, 'metro')
      ];
      const b = bList[Math.floor(Math.random() * bList.length)];
      prop = b();
    } else {
      // Market zone
      prop = buildTeaStall3D();
    }

    prop.position.set(x, 0, z);
    this.scene.add(prop);
    this.roadsideProps.push(prop);
  }

  initZoneLandmarks() {
    // 1. Village (Initial view has roadside tea stalls & palms safely on the grass)

    // 2. City Block Skyscrapers (Safely on right side grass at X = 25m to 45m)
    this.cityBlock = new THREE.Group();
    for (let c = 0; c < 3; c++) {
      const tower = buildCitySkyscraper3D(28 + c * 4, 'metro');
      tower.position.set(25 + c * 10, 0, -220 - c * 50);
      this.cityBlock.add(tower);
    }
    this.scene.add(this.cityBlock);
    this.landmarkSuperstructures.push(this.cityBlock);

    // 3. Dhaka University Curzon Hall (Safely on right side lawn at X = 38m)
    this.curzonHall = buildCurzonHall3D();
    this.curzonHall.position.set(38, 0, -480);
    this.scene.add(this.curzonHall);
    this.landmarkSuperstructures.push(this.curzonHall);

    // 4. Karnaphuli Tunnel Tube (Zone 4 - Open archway portal spanning above road)
    this.karnaphuliTunnel = buildKarnaphuliTunnelSegment3D(200, true);
    this.karnaphuliTunnel.position.set(0, 0, -680);
    this.scene.add(this.karnaphuliTunnel);
    this.landmarkSuperstructures.push(this.karnaphuliTunnel);

    // 5. Metro Rail Elevated Viaduct & Moving Train (Safely on left side at X = -14m)
    this.metroViaduct = buildMetroViaductSegment3D(220);
    this.metroViaduct.position.set(-14, 0, -880);
    this.scene.add(this.metroViaduct);
    this.landmarkSuperstructures.push(this.metroViaduct);

    this.movingMetroTrain = buildMetroTrain3D();
    this.movingMetroTrain.position.set(-14, 9.8, -940);
    this.scene.add(this.movingMetroTrain);

    // 6. Wholesale Market Destination (Zone 6 - 17m wide arch gate spanning road at 9.8m height)
    this.marketDestination = buildMarketDestination3D();
    this.marketDestination.position.set(0, 0, -1120);
    this.scene.add(this.marketDestination);
    this.landmarkSuperstructures.push(this.marketDestination);
  }

  bindControls() {
    // UI Button bindings for mouse & touch
    const addHoldListener = (selector, key) => {
      const el = this.container.querySelector(selector);
      if (!el) return;

      const start = (e) => {
        e.preventDefault();
        this.keyState[key] = true;
        el.classList.add('active');
        if (key === 'boost') this.triggerBoostSound();
      };
      const stop = (e) => {
        e.preventDefault();
        this.keyState[key] = false;
        el.classList.remove('active');
      };

      el.addEventListener('mousedown', start);
      el.addEventListener('mouseup', stop);
      el.addEventListener('mouseleave', stop);
      el.addEventListener('touchstart', start, { passive: false });
      el.addEventListener('touchend', stop);
      el.addEventListener('touchcancel', stop);
    };

    addHoldListener('#btn-ctrl-left', 'left');
    addHoldListener('#btn-ctrl-right', 'right');
    addHoldListener('#btn-ctrl-forward', 'forward');
    addHoldListener('#btn-ctrl-backward', 'backward');
    addHoldListener('#btn-ctrl-boost', 'boost');

    // Horn Button
    const hornBtn = this.container.querySelector('#btn-ctrl-horn');
    if (hornBtn) {
      hornBtn.addEventListener('click', () => {
        this.triggerHorn();
      });
    }
  }

  handleKeyDown(e) {
    // Forward (Up Arrow, W)
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      e.preventDefault();
      this.keyState.forward = true;
    }
    // Backward (Down Arrow, S)
    else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      e.preventDefault();
      this.keyState.backward = true;
    }
    // Left (Left Arrow, A)
    else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      this.keyState.left = true;
    }
    // Right (Right Arrow, D)
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      this.keyState.right = true;
    }
    // Turbo Boost (Shift)
    else if (e.key === 'Shift') {
      e.preventDefault();
      if (!this.keyState.boost) {
        this.triggerBoostSound();
      }
      this.keyState.boost = true;
    }
    // Horn (Space, H)
    else if (e.key === ' ' || e.code === 'Space' || e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      this.triggerHorn();
    }
  }

  handleKeyUp(e) {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      this.keyState.forward = false;
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      this.keyState.backward = false;
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      this.keyState.left = false;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      this.keyState.right = false;
    } else if (e.key === 'Shift') {
      this.keyState.boost = false;
    }
  }

  triggerBoostSound() {
    sound.playSuccess();
    sound.vibrate([60, 40, 80]);
  }

  triggerHorn() {
    sound.playTruckHornSFX();
    sound.vibrate(100);

    const toast = document.createElement('div');
    toast.className = 'coin-popup';
    toast.style.left = '50%';
    toast.style.top = '58%';
    toast.textContent = '📢 পিপিইইইপ!';
    this.container.appendChild(toast);
    setTimeout(() => toast.remove(), 600);
  }

  announceZone(zone) {
    if (!zone || this.lastAnnouncedZoneId === zone.id) return;
    this.lastAnnouncedZoneId = zone.id;

    // Update Top Pill
    const iconEl = this.container.querySelector('#zone-icon');
    const titleEl = this.container.querySelector('#zone-title');
    if (iconEl) iconEl.textContent = zone.icon;
    if (titleEl) titleEl.textContent = zone.name;

    // Toast Banner
    const banner = this.container.querySelector('#landmark-banner');
    const bTitle = this.container.querySelector('#banner-title');
    const bSub = this.container.querySelector('#banner-subtitle');

    if (banner && bTitle && bSub) {
      bTitle.textContent = `${zone.icon} ${zone.name}`;
      bSub.textContent = zone.subtitle;

      banner.style.display = 'block';
      requestAnimationFrame(() => {
        banner.style.opacity = '1';
        banner.style.transform = 'translateX(-50%) translateY(0)';
      });

      sound.playSuccess();

      setTimeout(() => {
        banner.style.opacity = '0';
        banner.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
          banner.style.display = 'none';
        }, 450);
      }, 4000);
    }
  }

  startLoop() {
    let lastTime = performance.now();

    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      this.update(dt);
      this.renderer.render(this.scene, this.camera);

      if (this.distanceKm > 0) {
        this.animId = requestAnimationFrame(loop);
      } else {
        this.reachMarketDestination();
      }
    };

    this.animId = requestAnimationFrame(loop);
  }

  update(dt) {
    // 1. Calculate Target Speed with 4-Way Controls & Shift Boost
    // IMPORTANT: When Up arrow / Forward is NOT pressed, target speed is 0! (Truck stays stopped)
    let targetSpeed = 0;

    if (this.keyState.forward) {
      if (this.keyState.boost) {
        targetSpeed = this.boostSpeed; // 135 km/h Turbo
      } else {
        targetSpeed = this.cruiseSpeed; // 75 km/h Normal forward
      }
    } else if (this.keyState.backward) {
      targetSpeed = this.reverseSpeed; // -25 km/h Reverse / Brake
    } else if (this.keyState.boost && this.speed > 5) {
      targetSpeed = this.boostSpeed;
    } else {
      targetSpeed = 0; // Decelerate to complete stop
    }

    // Smooth acceleration / deceleration
    const accelRate = this.keyState.boost ? 85 : (this.keyState.backward ? 95 : 55);
    if (this.speed < targetSpeed) {
      this.speed = Math.min(targetSpeed, this.speed + accelRate * dt);
    } else if (this.speed > targetSpeed) {
      this.speed = Math.max(targetSpeed, this.speed - (targetSpeed === 0 ? 70 : accelRate) * dt);
      if (Math.abs(this.speed) < 0.6 && targetSpeed === 0) {
        this.speed = 0;
      }
    }


    // Update Speedometer UI
    const speedEl = this.container.querySelector('#speedo-number');
    const speedBox = this.container.querySelector('#speedo-box');
    const turboBadge = this.container.querySelector('#turbo-badge-top');

    if (speedEl) {
      speedEl.textContent = toBengaliNumber(Math.round(Math.abs(this.speed)));
    }

    if (this.speed > 105) {
      if (speedBox) {
        speedBox.style.borderColor = '#FF4500';
        speedBox.style.boxShadow = '0 0 25px rgba(255, 69, 0, 0.8)';
      }
      if (turboBadge) turboBadge.style.display = 'inline-flex';
      // Dynamically widen camera FOV for high speed sensation
      this.camera.fov += (62 - this.camera.fov) * 0.1;
      this.camera.updateProjectionMatrix();
    } else {
      if (speedBox) {
        speedBox.style.borderColor = '#F5A623';
        speedBox.style.boxShadow = '0 4px 15px rgba(0,0,0,0.6)';
      }
      if (turboBadge) turboBadge.style.display = 'none';
      this.camera.fov += (54 - this.camera.fov) * 0.1;
      this.camera.updateProjectionMatrix();
    }

    // 2. Free Continuous Left / Right Steering
    const steerSpeed = 6.8 * dt;
    if (this.keyState.left) {
      this.truckX = Math.max(-this.roadHalfWidth, this.truckX - steerSpeed);
    }
    if (this.keyState.right) {
      this.truckX = Math.min(this.roadHalfWidth, this.truckX + steerSpeed);
    }

    // Smooth truck position & steering tilt
    const dx = this.truckX - this.truck.position.x;
    this.truck.position.x += dx * 0.22;
    this.truck.rotation.z = -dx * 0.08; // Lean into turn
    this.truck.rotation.y = Math.PI - dx * 0.08; // Yaw

    // Rotate Wheels
    const worldSpeed = (this.speed * 0.45) * dt * 10;
    if (this.truck.userData.wheels) {
      this.truck.userData.wheels.forEach(w => {
        w.rotation.x += worldSpeed * 0.6;
      });
    }

    // Camera follow truck
    this.camera.position.x = this.truck.position.x * 0.42;
    this.camera.lookAt(this.truck.position.x * 0.5, 2.2, -20.0);

    // 3. Distance Countdown towards Karwan Bazar Market
    if (this.speed > 0) {
      const distStep = (this.speed / 3600) * dt * 7.5;
      this.distanceKm = Math.max(0, this.distanceKm - distStep);
    }
    const distEl = this.container.querySelector('#hud-distance');
    if (distEl) distEl.textContent = toBengaliNumber(this.distanceKm.toFixed(1));

    // 4. Update Current Route Zone
    const currentZone = ROUTE_ZONES.find(
      z => this.distanceKm <= z.maxKm && this.distanceKm > z.minKm
    ) || ROUTE_ZONES[ROUTE_ZONES.length - 1];

    if (currentZone.id !== this.currentZone.id) {
      this.currentZone = currentZone;
      this.announceZone(currentZone);
    }

    // Atmosphere transitions
    const targetSky = new THREE.Color(this.currentZone.skyColor);
    this.scene.background.lerp(targetSky, 0.06);
    this.scene.fog.color.lerp(targetSky, 0.06);
    this.scene.fog.density += (this.currentZone.fogDensity - this.scene.fog.density) * 0.06;

    const targetGround = new THREE.Color(this.currentZone.groundColor);
    this.groundMat.color.lerp(targetGround, 0.06);

    // Tunnel Lights
    if (this.currentZone.isTunnel) {
      this.tunnelLight.intensity += (1.8 - this.tunnelLight.intensity) * 0.1;
      this.sunLight.intensity += (0.15 - this.sunLight.intensity) * 0.1;
    } else {
      this.tunnelLight.intensity += (0 - this.tunnelLight.intensity) * 0.1;
      this.sunLight.intensity += (1.2 - this.sunLight.intensity) * 0.1;
    }

    // 5. Scroll Road Segments
    this.roadSegments.forEach(seg => {
      seg.position.z += worldSpeed;
      if (seg.position.z > 60) {
        seg.position.z -= 480;
      } else if (seg.position.z < -420) {
        seg.position.z += 480;
      }
    });

    // 6. Scroll Landmark Superstructures
    this.landmarkSuperstructures.forEach(struct => {
      struct.position.z += worldSpeed;
      if (struct.position.z > -400 && struct.position.z < 60) {
        struct.visible = true;
      } else {
        struct.visible = false;
      }
      if (struct.position.z > 80) {
        struct.position.z -= 1120;
      }
    });

    // Animate Metro Rail Train along viaduct
    if (this.movingMetroTrain && this.movingMetroTrain.visible) {
      this.movingMetroTrain.position.z += (worldSpeed + 0.45);
      if (this.movingMetroTrain.position.z > 60) {
        this.movingMetroTrain.position.z = -1000;
      }
    }

    // 7. Scroll Roadside Props safely off the road
    for (let i = this.roadsideProps.length - 1; i >= 0; i--) {
      const prop = this.roadsideProps[i];
      prop.position.z += worldSpeed;
      if (prop.position.z > 25) {
        this.scene.remove(prop);
        this.roadsideProps.splice(i, 1);
        this.spawnRoadsideProp(-320);
      }
    }
  }

  // Arrival at Kaoran Bazar Wholesale Produce Market
  reachMarketDestination() {
    if (this.delivered) return;
    this.delivered = true;

    cancelAnimationFrame(this.animId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.handleResize);

    sound.playSuccess();
    sound.vibrate([100, 50, 150]);

    // Beautiful Delivery Arrival Modal
    const arrivalModal = document.createElement('div');
    arrivalModal.className = 'modal-overlay active';
    arrivalModal.innerHTML = `
      <div class="modal-dialog" style="max-width: 480px; text-align: center;">
        <div style="font-size: 3.5rem; margin-bottom: 8px;">🥬 🚚 🪙</div>
        <h2 style="color: #3F9B5B; font-size: 1.8rem; font-weight: 900; margin-bottom: 6px;">
          কাওরান বাজার আড়তে সফল আগমন!
        </h2>
        <p style="font-size: 1rem; color: #444; line-height: 1.5; margin-bottom: 16px;">
          গ্রাম, শহর, ঢাকা বিশ্ববিদ্যালয়, টানেল ও মেট্রোরেল পাড়ি দিয়ে <strong>১,০০০ কেজি সবজির চালান</strong> নিরাপদে কাওরান বাজারে পৌঁছে গেছে!
        </p>

        <div style="background: rgba(63,155,91,0.12); border: 2px solid #3F9B5B; border-radius: 12px; padding: 12px 18px; margin-bottom: 18px; text-align: left;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>ডেলিভারি ওজন:</span>
            <strong style="color: #1A110B;">১,০০০ কেজি</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>ভাড়া ও পারিশ্রমিক আয়:</span>
            <strong style="color: #3F9B5B; font-size: 1.15rem;">৳৫,০০০</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>রাস্তায় কোনো চাঁদা/জরিমানা লাগেনি:</span>
            <strong style="color: #2E86AB;">৳০ (১০০% লাভ!)</strong>
          </div>
        </div>

        <button id="btn-finish-delivery" class="btn btn-green" style="font-size: 1.25rem; padding: 14px; width: 100%;">
          🎉 হিসাব ও সারসংক্ষেপ দেখুন ➔
        </button>
      </div>
    `;
    this.container.appendChild(arrivalModal);

    arrivalModal.querySelector('#btn-finish-delivery').addEventListener('click', () => {
      this.engine.gameState.driverResult = {
        deliveredKg: this.vegetablesKg,
        totalBribePaid: 0,
        profit: 5000,
        truckHealth: 100,
        priceHikePerKg: '0.0',
        success: true
      };
      this.engine.changeScene('summary');
    });
  }

  handleResize() {
    const container = this.container.querySelector('#three-container');
    if (!container || !this.renderer || !this.camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  destroy() {
    cancelAnimationFrame(this.animId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.handleResize);
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
