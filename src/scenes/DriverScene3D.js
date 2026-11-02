import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { sound } from '../systems/audio.js';
import { toBengaliNumber, formatTaka } from '../systems/utils.js';
import {
  buildTempoRickshaw3D,
  buildBambooFence3D,
  buildElectricPoleWithWires3D,
  buildVillageTinHouse3D,
  buildVillageTeaStallEnhanced3D,
  buildVillagePondSide3D,
  buildCanalBridgeSegment3D,
  buildDirectionalChevrons3D,
  buildVillageCoconutTree3D,
  buildFinishLine3D,
  buildBananaTree3D,
  buildPalmTree3D
} from '../systems/models3d.js';
import {
  createVillageAsphaltRoadTexture,
  createRicePaddyTexture
} from '../systems/textureGenerator.js';

// =========================================================================
// 🌾 BANGLADESHI VILLAGE ROUTE CHECKPOINTS
// =========================================================================
export const VILLAGE_CHECKPOINTS = [
  { id: 1, name: 'সবুজ ধানক্ষেত ও নারকেল বাগান', targetDist: 4.0 },
  { id: 2, name: 'শান্ত পুকুর ও খালের ব্রিজ', targetDist: 3.0 },
  { id: 3, name: 'পল্লী বসতি ও মাটির ঘর', targetDist: 2.0 },
  { id: 4, name: 'গ্রামের হাট ও চায়ের টং দোকান', targetDist: 1.0 },
  { id: 5, name: 'ছায়াঘেরা গ্রাম্য পথ ও বিজয় ফটক', targetDist: 0.0 }
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
    this.totalDistanceKm = 5.0;
    this.remainingDistanceKm = 5.0;
    this.currentCheckpointIndex = 1;
    this.totalCheckpoints = 5;
    this.delivered = false;
    this.vegetablesKg = 1000;
    this.maxSpeedReached = 0;

    // Timer (Milliseconds stopwatch)
    this.elapsedSeconds = 0;
    this.isTimerRunning = false;
    this.isPaused = false;

    // Vehicle Driving Physics
    this.speed = 0; // KM/H
    this.cruiseSpeed = 48; // Max normal speed for tempo
    this.boostSpeed = 70; // Turbo boost
    this.reverseSpeed = -16;
    this.truckX = 0; // Lateral position (-4.2m to +4.2m)
    this.steerAngle = 0; // Smoothed steering angle (-1 to 1)
    this.roadHalfWidth = 4.3;

    // Continuous 4-way Control State
    this.keyState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      boost: false,
      handbrake: false
    };

    // Environment & World
    this.roadSegments = [];
    this.roadsideProps = [];
    this.scrollingDecorations = [];
    this.electricPoles = [];
    this.bambooFences = [];
    this.directionalChevrons = null;
    this.finishLineArch = null;
    this.canalBridge = null;
    this.roadCurveOffset = 0;

    // Audio Motor Synth
    this.motorOsc = null;
    this.motorGain = null;

    // Bindings
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  render(container) {
    this.container = container;
    const char = this.engine.gameState.character || { name: 'ওস্তাদ করিম' };
    const truckColor = this.engine.gameState.truckColor?.hex || '#0E7C3A';

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; height: 100%; position: relative; background: #0F0A06; overflow: hidden; user-select: none;">
        
        <!-- 3D WebGL Canvas Viewport -->
        <div id="three-container" style="flex: 1; width: 100%; height: 100%; position: relative; overflow: hidden;">
          
          <!-- PROFESSIONAL DRIVING SIMULATOR HUD OVERLAY (MATCHING REFERENCE IMAGE) -->
          <div class="sim-hud-overlay">
            
            <!-- TOP-LEFT STATUS PANEL -->
            <div class="sim-top-left-panel">
              <div class="sim-status-row">
                <span class="sim-status-label">Position:</span>
                <span class="sim-status-val">1 / 1</span>
              </div>
              <div class="sim-status-row">
                <span class="sim-status-label">Time:</span>
                <span id="hud-sim-time" class="sim-status-val">00:00.00</span>
              </div>
              <div class="sim-status-row">
                <span class="sim-status-label">Checkpoint:</span>
                <span id="hud-sim-checkpoint" class="sim-status-val">1 / 5</span>
              </div>
            </div>

            <!-- TOP-RIGHT GROUP (PAUSE BUTTON & MINI-MAP) -->
            <div class="sim-top-right-group">
              <!-- Mini-Map Card -->
              <div class="sim-minimap-card">
                <canvas id="sim-minimap-canvas" class="sim-minimap-canvas" width="98" height="116"></canvas>
              </div>

              <!-- Pause Button -->
              <button id="btn-sim-pause" class="sim-pause-btn" title="Pause Game (ESC / P)">
                ❚❚
              </button>
            </div>

            <!-- CHECKPOINT NOTIFICATION BANNER -->
            <div id="sim-checkpoint-banner" class="sim-checkpoint-banner">
              🏁 চেকপয়েন্ট ১/৫ অতিক্রম!
            </div>

            <!-- ROAD SHOULDER OFF-ROAD WARNING -->
            <div id="sim-offroad-warn" style="display: none; position: absolute; top: 145px; left: 50%; transform: translateX(-50%); background: rgba(220, 38, 38, 0.9); border: 2px solid #FEF08A; border-radius: 8px; padding: 4px 16px; color: #FFF; font-weight: 800; font-size: 0.88rem; box-shadow: 0 4px 12px rgba(0,0,0,0.6); pointer-events: none; z-index: 55;">
              ⚠️ রাস্তার বাইরে (কাঁচা মাটি)! গতি কমে যাচ্ছে
            </div>

            <!-- BOTTOM-LEFT STEERING WHEEL OVERLAY -->
            <div id="sim-steering-wheel" class="sim-steering-container" title="স্টিয়ারিং ঘোরান (A/D বা মাউস ড্র্যাগ)">
              <svg viewBox="0 0 200 200" width="100%" height="100%" style="display: block; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.8));">
                <defs>
                  <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#4B5563" />
                    <stop offset="70%" stop-color="#1F2937" />
                    <stop offset="100%" stop-color="#111827" />
                  </radialGradient>
                  <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#374151" />
                    <stop offset="50%" stop-color="#1F2937" />
                    <stop offset="100%" stop-color="#111827" />
                  </linearGradient>
                  <linearGradient id="spokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#4B5563" />
                    <stop offset="50%" stop-color="#9CA3AF" />
                    <stop offset="100%" stop-color="#374151" />
                  </linearGradient>
                </defs>
                <!-- Outer Grip Rim -->
                <circle cx="100" cy="100" r="90" fill="none" stroke="url(#rimGrad)" stroke-width="18" />
                <circle cx="100" cy="100" r="98" fill="none" stroke="#111827" stroke-width="2" />
                <circle cx="100" cy="100" r="82" fill="none" stroke="#374151" stroke-width="1.5" />
                <!-- Grip Ribs -->
                <path d="M 18,92 Q 10,100 18,108" fill="none" stroke="#4B5563" stroke-width="3" />
                <path d="M 182,92 Q 190,100 182,108" fill="none" stroke="#4B5563" stroke-width="3" />
                <!-- Top Center Alignment Marker (Yellow racing stripe) -->
                <rect x="96" y="8" width="8" height="18" rx="2" fill="#F5A623" />
                <!-- Left Spoke -->
                <path d="M 40,100 L 75,96 L 75,104 Z" fill="url(#spokeGrad)" />
                <!-- Right Spoke -->
                <path d="M 160,100 L 125,96 L 125,104 Z" fill="url(#spokeGrad)" />
                <!-- Bottom Center Spoke -->
                <path d="M 100,165 L 94,125 L 106,125 Z" fill="url(#spokeGrad)" />
                <!-- Center Hub -->
                <circle cx="100" cy="100" r="32" fill="url(#hubGrad)" stroke="#6B7280" stroke-width="2.5" />
                <circle cx="100" cy="100" r="22" fill="#111827" stroke="#4B5563" stroke-width="1.5" />
                <!-- Center E-Rickshaw Icon -->
                <text x="100" y="107" font-size="20" text-anchor="middle" fill="#FFD700">🛺</text>
              </svg>
            </div>

            <!-- BOTTOM-RIGHT CONTROLS (SPEEDOMETER & FOOT PEDALS) -->
            <div class="sim-bottom-right-group">
              
              <!-- SPEEDOMETER GAUGE -->
              <div class="sim-speedo-gauge">
                <svg class="sim-speedo-svg" viewBox="0 0 160 160">
                  <defs>
                    <!-- Arc Gradient: Green (0-35) -> Yellow (35-55) -> Red (55-80) -->
                    <linearGradient id="speedArcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#10B981" />
                      <stop offset="50%" stop-color="#F59E0B" />
                      <stop offset="100%" stop-color="#EF4444" />
                    </linearGradient>
                  </defs>

                  <!-- Dial Background Disc -->
                  <circle cx="80" cy="80" r="74" fill="rgba(17, 24, 39, 0.88)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="2" />
                  
                  <!-- Inactive Track Arc (135 deg to 405 deg) -->
                  <circle cx="80" cy="80" r="62" fill="none" stroke="#374151" stroke-width="10" stroke-dasharray="292" stroke-dashoffset="73" stroke-linecap="round" transform="rotate(135 80 80)" />
                  
                  <!-- Dynamic Colored Active Speed Arc -->
                  <circle id="speedo-active-arc" cx="80" cy="80" r="62" fill="none" stroke="url(#speedArcGrad)" stroke-width="10" stroke-dasharray="292" stroke-dashoffset="292" stroke-linecap="round" transform="rotate(135 80 80)" style="transition: stroke-dashoffset 0.08s ease-out;" />

                  <!-- Speed Gauge Needle -->
                  <g id="speedo-needle-group" transform="rotate(135 80 80)" style="transition: transform 0.08s ease-out;">
                    <polygon points="80,24 83,80 77,80" fill="#EF4444" />
                    <circle cx="80" cy="80" r="6" fill="#F3F4F6" stroke="#111827" stroke-width="2" />
                  </g>
                </svg>

                <div class="sim-speedo-content">
                  <div id="sim-speedo-num" class="sim-speedo-value">0</div>
                  <div class="sim-speedo-unit">KM/H</div>
                </div>
              </div>

              <!-- FOOT PEDALS (BRAKE & RACE) -->
              <div class="sim-pedals-group">
                
                <!-- BRAKE PEDAL -->
                <div id="btn-pedal-brake" class="sim-pedal sim-pedal-brake" title="ব্রেক / রিভার্স (S / Down Arrow)">
                  <div class="sim-pedal-grip-lines">
                    <div class="sim-pedal-line"></div>
                    <div class="sim-pedal-line"></div>
                    <div class="sim-pedal-line"></div>
                    <div class="sim-pedal-line"></div>
                  </div>
                  <div class="sim-pedal-label">BRAKE</div>
                </div>

                <!-- RACE / ACCELERATOR PEDAL -->
                <div id="btn-pedal-race" class="sim-pedal sim-pedal-race" title="এক্সিলারেটর / গ্যাস (W / Up Arrow)">
                  <div class="sim-pedal-grip-lines">
                    <div class="sim-pedal-line"></div>
                    <div class="sim-pedal-line"></div>
                    <div class="sim-pedal-line"></div>
                    <div class="sim-pedal-line"></div>
                    <div class="sim-pedal-line"></div>
                  </div>
                  <div class="sim-pedal-label">RACE</div>
                </div>

              </div>

            </div>

          </div>

          <!-- PAUSE MODAL OVERLAY -->
          <div id="sim-pause-modal" class="modal-overlay" style="display: none; z-index: 100;">
            <div class="modal-dialog" style="max-width: 420px; text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 8px;">⏸️</div>
              <h2 style="color: #F5A623; font-size: 1.8rem; font-weight: 900; margin-bottom: 6px;">
                খেলা সাময়িক স্থগিত (Paused)
              </h2>
              <p style="font-size: 0.95rem; color: #555; margin-bottom: 18px;">
                গ্রামবাংলার মনোরম রাস্তায় গাড়ি পার্ক করা আছে। চালিয়ে যেতে প্রস্তুত?
              </p>

              <div style="display: flex; flex-direction: column; gap: 10px;">
                <button id="btn-pause-resume" class="btn btn-green" style="font-size: 1.15rem; padding: 12px;">
                  ▶ খেলা চালিয়ে যান (Resume)
                </button>
                <button id="btn-pause-sound" class="btn btn-secondary" style="font-size: 1rem; padding: 10px;">
                  🔊 সাউন্ড টগল
                </button>
                <button id="btn-pause-restart" class="btn btn-secondary" style="font-size: 1rem; padding: 10px;">
                  ↺ পুনরায় শুরু করুন (Restart)
                </button>
                <button id="btn-pause-quit" class="btn btn-danger" style="font-size: 1rem; padding: 10px;">
                  🏠 প্রধান মেনুতে প্রস্থান
                </button>
              </div>
            </div>
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
  }

  initThree(truckColor) {
    const container = this.container.querySelector('#three-container');
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene & Atmosphere (Sunny rural Bangladeshi daytime)
    this.scene = new THREE.Scene();
    const skyColor = new THREE.Color('#78B9ED'); // Crisp blue sunny sky
    this.scene.background = skyColor;
    this.scene.fog = new THREE.FogExp2('#A7D3F5', 0.0038);

    // 2. Camera: Professional Third-Person Follow Perspective
    this.camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 550);
    this.camera.position.set(0, 2.45, 4.3);
    this.camera.lookAt(0, 1.48, -14.0);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 4. Lighting Setup: Warm Sunlight & Atmospheric Ambient
    const hemiLight = new THREE.HemisphereLight('#E3F2FD', '#33691E', 0.85);
    this.scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight('#FFF9E6', 1.8);
    sunLight.position.set(35, 60, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 180;
    sunLight.shadow.camera.left = -30;
    sunLight.shadow.camera.right = 30;
    sunLight.shadow.camera.top = 30;
    sunLight.shadow.camera.bottom = -30;
    this.scene.add(sunLight);

    // 5. Expansive Ground Terrain (Lush Rice Paddy Field)
    const groundGeo = new THREE.PlaneGeometry(360, 640);
    const paddyTex = createRicePaddyTexture();
    paddyTex.repeat.set(16, 28);
    const groundMat = new THREE.MeshStandardMaterial({
      map: paddyTex,
      roughness: 0.85,
      metalness: 0.05
    });
    this.groundMesh = new THREE.Mesh(groundGeo, groundMat);
    this.groundMesh.rotation.x = -Math.PI / 2;
    this.groundMesh.position.set(0, -0.05, -160);
    this.scene.add(this.groundMesh);

    // 6. Seamless Scrolling Asphalt Road Segments
    const roadTex = createVillageAsphaltRoadTexture();
    roadTex.repeat.set(1, 14);
    const roadMat = new THREE.MeshStandardMaterial({
      map: roadTex,
      roughness: 0.75,
      metalness: 0.15
    });

    const segmentCount = 5;
    const segmentLength = 120;
    for (let i = 0; i < segmentCount; i++) {
      const roadGeo = new THREE.PlaneGeometry(11.0, segmentLength);
      const roadMesh = new THREE.Mesh(roadGeo, roadMat);
      roadMesh.rotation.x = -Math.PI / 2;
      roadMesh.position.set(0, 0.01, -i * segmentLength);
      roadMesh.receiveShadow = true;
      this.scene.add(roadMesh);
      this.roadSegments.push(roadMesh);
    }

    // 7. Player Bangladeshi Tempo / E-Rickshaw
    this.truck = buildTempoRickshaw3D(truckColor);
    this.truck.position.set(0, 0, 0);
    this.truck.rotation.y = Math.PI; // Orient forward along negative Z
    this.scene.add(this.truck);

    // 8. World Scenery: Rural Bangladesh Environment
    this.initVillageEnvironment();
  }

  initVillageEnvironment() {
    // 1. Bamboo Fences along Left Roadside
    for (let z = 20; z > -500; z -= 24) {
      const fence = buildBambooFence3D(24);
      fence.position.set(-5.9, 0, z);
      this.scene.add(fence);
      this.bambooFences.push(fence);
    }

    // 2. Concrete Electric Utility Poles along Right Roadside with Overhead Wires
    const wireDistance = 48;
    for (let z = 20; z > -520; z -= wireDistance) {
      const pole = buildElectricPoleWithWires3D(wireDistance);
      pole.position.set(6.8, 0, z);
      this.scene.add(pole);
      this.electricPoles.push(pole);
    }

    // 3. Village Pond on the Left Side
    this.villagePond = buildVillagePondSide3D(38, 75);
    this.villagePond.position.set(-28, 0, -110);
    this.scene.add(this.villagePond);
    this.scrollingDecorations.push(this.villagePond);

    // 4. Village Roadside Tea Stall on the Right Side
    this.teaStall = buildVillageTeaStallEnhanced3D();
    this.teaStall.position.set(11.2, 0, -85);
    this.scene.add(this.teaStall);
    this.scrollingDecorations.push(this.teaStall);

    // 5. Village Tin Houses along the Right Edge
    const houseDistances = [-160, -280, -410];
    houseDistances.forEach((z, idx) => {
      const house = buildVillageTinHouse3D();
      house.position.set(16 + (idx % 2) * 3, 0, z);
      this.scene.add(house);
      this.scrollingDecorations.push(house);
    });

    // 6. Canal Culvert Bridge across Road
    this.canalBridge = buildCanalBridgeSegment3D(11.2, 22);
    this.canalBridge.position.set(0, 0, -220);
    this.scene.add(this.canalBridge);
    this.scrollingDecorations.push(this.canalBridge);

    // 7. Directional Chevron Arrows (>>>) Hovering ahead (as in reference photo!)
    this.directionalChevrons = buildDirectionalChevrons3D();
    this.directionalChevrons.position.set(0, 1.8, -48);
    this.scene.add(this.directionalChevrons);

    // 8. Celebratory Finish Line Arch Gantry at Gated Destination
    this.finishLineArch = buildFinishLine3D(11.2);
    this.finishLineArch.position.set(0, 0, -560);
    this.scene.add(this.finishLineArch);
    this.scrollingDecorations.push(this.finishLineArch);

    // 9. Natural Trees & Vegetation (Coconuts, Bananas, Palms)
    for (let z = 10; z > -500; z -= 14) {
      this.spawnVegetationProp(z);
    }
  }

  spawnVegetationProp(z) {
    const isLeft = Math.random() > 0.45;
    // Keep vegetation safely off the asphalt road!
    const x = isLeft ? -(9.2 + Math.random() * 14) : (10.5 + Math.random() * 16);

    const r = Math.random();
    let tree;
    if (r < 0.45) {
      tree = buildVillageCoconutTree3D();
    } else if (r < 0.75) {
      tree = buildBananaTree3D();
    } else {
      tree = buildPalmTree3D();
    }

    tree.position.set(x, 0, z);
    this.scene.add(tree);
    this.roadsideProps.push(tree);
  }

  bindControls() {
    // Pedals binding
    const setupPedal = (selector, key) => {
      const el = this.container.querySelector(selector);
      if (!el) return;

      const press = (e) => {
        e.preventDefault();
        this.keyState[key] = true;
        el.classList.add('active');
      };
      const release = (e) => {
        e.preventDefault();
        this.keyState[key] = false;
        el.classList.remove('active');
      };

      el.addEventListener('mousedown', press);
      el.addEventListener('mouseup', release);
      el.addEventListener('mouseleave', release);
      el.addEventListener('touchstart', press, { passive: false });
      el.addEventListener('touchend', release);
      el.addEventListener('touchcancel', release);
    };

    setupPedal('#btn-pedal-race', 'forward');
    setupPedal('#btn-pedal-brake', 'backward');

    // Steering Wheel Interactive Drag
    const wheelEl = this.container.querySelector('#sim-steering-wheel');
    if (wheelEl) {
      let isDragging = false;
      let startX = 0;

      const onStart = (e) => {
        isDragging = true;
        startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      };

      const onMove = (e) => {
        if (!isDragging) return;
        const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const delta = currentX - startX;
        if (delta < -20) {
          this.keyState.left = true;
          this.keyState.right = false;
        } else if (delta > 20) {
          this.keyState.right = true;
          this.keyState.left = false;
        } else {
          this.keyState.left = false;
          this.keyState.right = false;
        }
      };

      const onEnd = () => {
        isDragging = false;
        this.keyState.left = false;
        this.keyState.right = false;
      };

      wheelEl.addEventListener('mousedown', onStart);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
      wheelEl.addEventListener('touchstart', onStart, { passive: true });
      window.addEventListener('touchmove', onMove, { passive: true });
      window.addEventListener('touchend', onEnd);
    }

    // Pause button and modal controls
    const pauseBtn = this.container.querySelector('#btn-sim-pause');
    const pauseModal = this.container.querySelector('#sim-pause-modal');
    const resumeBtn = this.container.querySelector('#btn-pause-resume');
    const soundBtn = this.container.querySelector('#btn-pause-sound');
    const restartBtn = this.container.querySelector('#btn-pause-restart');
    const quitBtn = this.container.querySelector('#btn-pause-quit');

    const togglePause = () => {
      this.isPaused = !this.isPaused;
      if (pauseModal) {
        pauseModal.style.display = this.isPaused ? 'flex' : 'none';
        if (this.isPaused) pauseModal.classList.add('active');
        else pauseModal.classList.remove('active');
      }
    };

    if (pauseBtn) pauseBtn.addEventListener('click', togglePause);
    if (resumeBtn) resumeBtn.addEventListener('click', togglePause);
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        sound.toggleMute();
        soundBtn.textContent = sound.isMuted() ? '🔇 সাউন্ড আনমিউট' : '🔊 সাউন্ড মিউট';
      });
    }
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.destroy();
        this.engine.changeScene('driver');
      });
    }
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        this.destroy();
        this.engine.changeScene('splash');
      });
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
      const pauseBtn = this.container.querySelector('#btn-sim-pause');
      if (pauseBtn) pauseBtn.click();
      return;
    }

    if (this.isPaused) return;

    // Forward (Accelerate: W, ArrowUp)
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      e.preventDefault();
      this.keyState.forward = true;
      const racePedal = this.container.querySelector('#btn-pedal-race');
      if (racePedal) racePedal.classList.add('active');
    }
    // Backward (Brake / Reverse: S, ArrowDown)
    else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      e.preventDefault();
      this.keyState.backward = true;
      const brakePedal = this.container.querySelector('#btn-pedal-brake');
      if (brakePedal) brakePedal.classList.add('active');
    }
    // Steer Left (A, ArrowLeft)
    else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      this.keyState.left = true;
    }
    // Steer Right (D, ArrowRight)
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      this.keyState.right = true;
    }
    // Handbrake / Horn (Space)
    else if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      this.keyState.handbrake = true;
      sound.playTruckHornSFX();
    }
    // Turbo Boost (Shift)
    else if (e.key === 'Shift') {
      this.keyState.boost = true;
    }
  }

  handleKeyUp(e) {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      this.keyState.forward = false;
      const racePedal = this.container.querySelector('#btn-pedal-race');
      if (racePedal) racePedal.classList.remove('active');
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      this.keyState.backward = false;
      const brakePedal = this.container.querySelector('#btn-pedal-brake');
      if (brakePedal) brakePedal.classList.remove('active');
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      this.keyState.left = false;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      this.keyState.right = false;
    } else if (e.key === ' ' || e.code === 'Space') {
      this.keyState.handbrake = false;
    } else if (e.key === 'Shift') {
      this.keyState.boost = false;
    }
  }

  startLoop() {
    let lastTime = performance.now();

    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      if (!this.isPaused) {
        this.update(dt);
        this.renderMiniMap();
      }

      this.renderer.render(this.scene, this.camera);

      if (!this.delivered) {
        this.animId = requestAnimationFrame(loop);
      }
    };

    this.animId = requestAnimationFrame(loop);
  }

  update(dt) {
    // 1. Calculate Target Speed with Smooth Acceleration Curve
    let targetSpeed = 0;

    if (this.keyState.forward) {
      this.isTimerRunning = true;
      targetSpeed = this.keyState.boost ? this.boostSpeed : this.cruiseSpeed;
    } else if (this.keyState.backward) {
      this.isTimerRunning = true;
      targetSpeed = this.reverseSpeed;
    } else {
      targetSpeed = 0; // Decelerate to stop
    }

    // Road Shoulder Boundary Detection: Off-road reduces maximum speed
    const isOffRoad = Math.abs(this.truckX) > 3.6;
    const offRoadWarn = this.container.querySelector('#sim-offroad-warn');
    if (isOffRoad) {
      if (offRoadWarn) offRoadWarn.style.display = 'block';
      if (targetSpeed > 24) targetSpeed = 24;
    } else {
      if (offRoadWarn) offRoadWarn.style.display = 'none';
    }

    // Acceleration & Braking Rates
    const accelRate = this.keyState.handbrake ? 95 : (this.keyState.forward ? 32 : (this.keyState.backward ? 45 : 24));
    if (this.speed < targetSpeed) {
      this.speed = Math.min(targetSpeed, this.speed + accelRate * dt);
    } else if (this.speed > targetSpeed) {
      this.speed = Math.max(targetSpeed, this.speed - accelRate * dt);
      if (Math.abs(this.speed) < 0.4 && targetSpeed === 0) {
        this.speed = 0;
      }
    }

    if (this.speed > this.maxSpeedReached) {
      this.maxSpeedReached = Math.round(this.speed);
    }

    // 2. Stopwatch Timer Tick (Starts on first acceleration)
    if (this.isTimerRunning && !this.delivered) {
      this.elapsedSeconds += dt;
      const mins = Math.floor(this.elapsedSeconds / 60);
      const secs = Math.floor(this.elapsedSeconds % 60);
      const hundredths = Math.floor((this.elapsedSeconds * 100) % 100);
      const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
      const timeEl = this.container.querySelector('#hud-sim-time');
      if (timeEl) timeEl.textContent = formattedTime;
    }

    // 3. Update Speedometer UI & Pedals
    const speedEl = this.container.querySelector('#sim-speedo-num');
    const needleEl = this.container.querySelector('#speedo-needle-group');
    const arcEl = this.container.querySelector('#speedo-active-arc');

    const displaySpeed = Math.round(Math.abs(this.speed));
    if (speedEl) speedEl.textContent = displaySpeed;

    // Rotate needle from 135deg (0 km/h) to 405deg (80 km/h)
    const speedRatio = Math.min(1, displaySpeed / 75);
    const needleAngle = 135 + speedRatio * 270;
    if (needleEl) needleEl.setAttribute('transform', `rotate(${needleAngle} 80 80)`);

    // Dash offset for arc: full circumference is 292, 0% is 292, 100% is 73
    const targetOffset = 292 - (speedRatio * 219);
    if (arcEl) arcEl.setAttribute('stroke-dashoffset', targetOffset);

    // 4. Smooth Steering Mechanics
    let steerTarget = 0;
    if (this.keyState.left) steerTarget = -1;
    if (this.keyState.right) steerTarget = 1;

    // Interpolate steer angle towards steer target
    this.steerAngle += (steerTarget - this.steerAngle) * 9.5 * dt;

    // Rotate Steering Wheel Overlay in Bottom-Left
    const wheelContainer = this.container.querySelector('#sim-steering-wheel');
    if (wheelContainer) {
      wheelContainer.style.transform = `rotate(${this.steerAngle * 54}deg)`;
    }

    // Move Vehicle laterally across the road
    const lateralSpeed = this.steerAngle * (Math.abs(this.speed) / 45) * 6.8 * dt;
    this.truckX = Math.max(-this.roadHalfWidth, Math.min(this.roadHalfWidth, this.truckX + lateralSpeed));

    // Smooth chassis visual tilt & steering fork
    const dx = this.truckX - this.truck.position.x;
    this.truck.position.x += dx * 0.22;
    this.truck.rotation.z = -this.steerAngle * 0.08; // Lean into turn
    this.truck.rotation.y = Math.PI - this.steerAngle * 0.12; // Yaw

    // Front fork steering angle
    if (this.truck.userData.frontSteerGroup) {
      this.truck.userData.frontSteerGroup.rotation.y = -this.steerAngle * 0.45;
    }

    // Spin wheels
    const worldSpeed = (this.speed * 0.42) * dt * 10;
    if (this.truck.userData.wheels) {
      this.truck.userData.wheels.forEach(w => {
        w.rotation.x += worldSpeed * 0.55;
      });
    }

    // 5. Professional Chase Camera Following with Subtle Dynamic Lag
    const targetCamX = this.truck.position.x * 0.42;
    this.camera.position.x += (targetCamX - this.camera.position.x) * 0.15;
    this.camera.position.y = 2.45 + (isOffRoad ? (Math.random() - 0.5) * 0.04 : 0); // Rumble on off-road
    this.camera.lookAt(this.truck.position.x * 0.52, 1.48, -14.0);

    // Dynamic FOV widening on high speed
    const targetFov = 54 + (Math.abs(this.speed) / 75) * 6;
    this.camera.fov += (targetFov - this.camera.fov) * 0.1;
    this.camera.updateProjectionMatrix();

    // 6. Trip Distance & Checkpoints
    if (this.speed > 0) {
      const distStep = (this.speed / 3600) * dt * 6.5;
      this.remainingDistanceKm = Math.max(0, this.remainingDistanceKm - distStep);
    }

    // Checkpoint Triggering
    const passedRatio = 1 - (this.remainingDistanceKm / this.totalDistanceKm);
    const newCheckpoint = Math.min(5, Math.max(1, Math.floor(passedRatio * 5) + 1));
    if (newCheckpoint > this.currentCheckpointIndex) {
      this.currentCheckpointIndex = newCheckpoint;
      this.triggerCheckpointPassed(this.currentCheckpointIndex);
    }

    // 7. World Scrolling: Road Segments
    this.roadSegments.forEach(seg => {
      seg.position.z += worldSpeed;
      if (seg.position.z > 60) {
        seg.position.z -= 600;
      } else if (seg.position.z < -540) {
        seg.position.z += 600;
      }
    });

    // 8. World Scrolling: Roadside Fences, Electric Poles, & Scenery
    this.bambooFences.forEach(fence => {
      fence.position.z += worldSpeed;
      if (fence.position.z > 50) fence.position.z -= 520;
    });

    this.electricPoles.forEach(pole => {
      pole.position.z += worldSpeed;
      if (pole.position.z > 50) pole.position.z -= 540;
    });

    this.scrollingDecorations.forEach(deco => {
      deco.position.z += worldSpeed;
      if (deco.position.z > 60) deco.position.z -= 600;
    });

    // Animate Hovering Chevron Arrows
    if (this.directionalChevrons) {
      this.directionalChevrons.position.z += worldSpeed;
      if (this.directionalChevrons.position.z > 25) {
        this.directionalChevrons.position.z = -220;
      }
      this.directionalChevrons.position.y = 1.8 + Math.sin(performance.now() * 0.005) * 0.15;
    }

    // Scroll Trees & Vegetation
    for (let i = this.roadsideProps.length - 1; i >= 0; i--) {
      const prop = this.roadsideProps[i];
      prop.position.z += worldSpeed;
      if (prop.position.z > 35) {
        this.scene.remove(prop);
        this.roadsideProps.splice(i, 1);
        this.spawnVegetationProp(-480);
      }
    }

    // 9. Finish Line Detection
    if (this.remainingDistanceKm <= 0.05 && !this.delivered) {
      this.reachFinishLine();
    }
  }

  triggerCheckpointPassed(index) {
    sound.playSuccess();
    sound.vibrate(80);

    const cpEl = this.container.querySelector('#hud-sim-checkpoint');
    if (cpEl) cpEl.textContent = `${index} / 5`;

    const banner = this.container.querySelector('#sim-checkpoint-banner');
    if (banner) {
      banner.textContent = `🏁 চেকপয়েন্ট ${toBengaliNumber(index)}/৫ অতিক্রম!`;
      banner.classList.add('visible');
      setTimeout(() => {
        banner.classList.remove('visible');
      }, 2600);
    }
  }

  renderMiniMap() {
    const canvas = this.container.querySelector('#sim-minimap-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, w, h);

    // Draw Smooth S-Curved Road Track
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.92);
    ctx.bezierCurveTo(w * 0.25, h * 0.65, w * 0.85, h * 0.45, w * 0.7, h * 0.12);
    ctx.stroke();

    // Checkpoints on map
    const cpPoints = [
      { t: 0.2 }, { t: 0.4 }, { t: 0.6 }, { t: 0.8 }, { t: 0.98 }
    ];

    const getBezierPoint = (t) => {
      const p0 = { x: w * 0.5, y: h * 0.92 };
      const p1 = { x: w * 0.25, y: h * 0.65 };
      const p2 = { x: w * 0.85, y: h * 0.45 };
      const p3 = { x: w * 0.7, y: h * 0.12 };
      const cx = 3 * (p1.x - p0.x);
      const bx = 3 * (p2.x - p1.x) - cx;
      const ax = p3.x - p0.x - cx - bx;
      const cy = 3 * (p1.y - p0.y);
      const by = 3 * (p2.y - p1.y) - cy;
      const ay = p3.y - p0.y - cy - by;
      const x = ax * (t ** 3) + bx * (t ** 2) + cx * t + p0.x;
      const y = ay * (t ** 3) + by * (t ** 2) + cy * t + p0.y;
      return { x, y };
    };

    cpPoints.forEach((cp, idx) => {
      const pt = getBezierPoint(cp.t);
      ctx.fillStyle = (idx + 1) < this.currentCheckpointIndex ? '#10B981' : '#F59E0B';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Checkered Flag at end of track
    ctx.font = '14px sans-serif';
    ctx.fillText('🏁', w * 0.62, h * 0.12);

    // Player Red Arrow Navigation Marker
    const progress = Math.min(0.98, Math.max(0.02, 1 - (this.remainingDistanceKm / this.totalDistanceKm)));
    const playerPt = getBezierPoint(progress);

    ctx.save();
    ctx.translate(playerPt.x, playerPt.y);
    // Red navigation triangle
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(4.5, 5);
    ctx.lineTo(0, 3);
    ctx.lineTo(-4.5, 5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  reachFinishLine() {
    if (this.delivered) return;
    this.delivered = true;

    cancelAnimationFrame(this.animId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.handleResize);

    sound.playSuccess();
    sound.vibrate([120, 60, 180]);

    // Confetti Fireworks Blast
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.55 }
      });
    } catch (e) {
      // ignore
    }

    const mins = Math.floor(this.elapsedSeconds / 60);
    const secs = Math.floor(this.elapsedSeconds % 60);
    const hundredths = Math.floor((this.elapsedSeconds * 100) % 100);
    const finalTimeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;

    // Professional Finish Celebration Modal
    const arrivalModal = document.createElement('div');
    arrivalModal.className = 'modal-overlay active';
    arrivalModal.style.zIndex = '150';
    arrivalModal.innerHTML = `
      <div class="modal-dialog" style="max-width: 480px; text-align: center; border-color: #3F9B5B;">
        <div style="font-size: 3.5rem; margin-bottom: 6px;">🏁 🛺 🥬</div>
        <h2 style="color: #3F9B5B; font-size: 1.85rem; font-weight: 900; margin-bottom: 4px;">
          যাত্রা সম্পন্ন! বিজয় ফটকে আগমন
        </h2>
        <p style="font-size: 0.98rem; color: #444; line-height: 1.5; margin-bottom: 16px;">
          শ্যামল পল্লীগ্রামের রাস্তা, পুকুরপাড় ও টং দোকান পেরিয়ে <strong>১,০০০ কেজি তাজা সবজিভর্তি টেম্পো</strong> অক্ষত অবস্থায় গন্তব্যে পৌঁছেছে!
        </p>

        <!-- Race Simulator Stats Box -->
        <div style="background: rgba(63,155,91,0.12); border: 2px solid #3F9B5B; border-radius: 12px; padding: 14px 18px; margin-bottom: 18px; text-align: left;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>⏱️ সমাপ্তি সময়:</span>
            <strong style="color: #1A110B; font-size: 1.15rem;">${finalTimeStr}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>📍 চেকপয়েন্ট সম্পন্ন:</span>
            <strong style="color: #2E86AB; font-size: 1.1rem;">৫ / ৫ (১০০%)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>⚡ সর্বোচ্চ গতি:</span>
            <strong style="color: #F5A623;">${toBengaliNumber(this.maxSpeedReached || 48)} কিমি/ঘণ্টা</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-top: 1.5px dashed rgba(0,0,0,0.15); padding-top: 8px;">
            <span>💰 উপার্জিত ভাড়া:</span>
            <strong style="color: #3F9B5B; font-size: 1.25rem;">৳৫,০০০</strong>
          </div>
        </div>

        <button id="btn-finish-delivery" class="btn btn-green" style="font-size: 1.25rem; padding: 14px; width: 100%;">
          🎉 হিসাব ও বিস্তারিত রসিদ দেখুন ➔
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
        finalTime: finalTimeStr,
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
