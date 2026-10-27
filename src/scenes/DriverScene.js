import { sound } from '../systems/audio.js';
import { toBengaliNumber, formatTaka, drawTopDownTruck } from '../systems/utils.js';

export class DriverScene {
  constructor(engine) {
    this.engine = engine;
    this.canvas = null;
    this.ctx = null;
    this.animId = null;

    // Game stats
    this.distanceKm = 10.0; // 10 km to Karwan Bazar
    this.totalBribePaid = 0;
    this.truckHealth = 100;
    this.vegetablesKg = 1000;
    this.cargoCondition = 100; // %
    this.speed = 65; // km/h

    // Lane positioning (0: Left, 1: Middle, 2: Right)
    this.currentLane = 1;
    this.laneX = [180, 360, 540];
    this.playerX = 360;
    this.playerY = 480;

    // Road scroll
    this.roadOffset = 0;

    // Obstacles
    this.obstacles = [];
    this.obstacleSpawnTimer = 0;
    this.isPausedForEvent = false;

    // Rain effect
    this.isRaining = false;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  render(container) {
    this.container = container;
    const char = this.engine.gameState.character || { name: 'ওস্তাদ করিম' };

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; height: 100%; position: relative; background: #1A110B;">
        
        <!-- Driver HUD Header (Desktop Spacious) -->
        <div style="background: rgba(15, 10, 7, 0.95); padding: 10px 24px; border-bottom: 2px solid #3F9B5B; z-index: 10;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <span style="color: #3F9B5B; font-weight: 800; font-size: 1.15rem;">🚚 ${char.name}</span>
              <span style="font-size: 0.85rem; background: #222; border: 1px solid rgba(245,166,35,0.4); padding: 2px 10px; border-radius: 6px; color: #F5A623; font-weight: bold;">
                রুট: বগুড়া ➔ কাওরান বাজার আড়ত
              </span>
              <span style="font-size: 0.85rem; color: #AAA;">
                স্পিড: <strong>৬৫ কিমি/ঘণ্টা</strong>
              </span>
            </div>
            
            <div style="color: #FFF8EC; font-weight: 800; font-size: 1.15rem; background: rgba(0,0,0,0.4); padding: 4px 14px; border-radius: 8px; border: 1px solid rgba(63,155,91,0.3);">
              📍 গন্তব্য বাকি: <span id="hud-distance" style="color: #3F9B5B; font-size: 1.35rem;">১০.০</span> কিমি
            </div>
          </div>

          <!-- Driver Metrics Bar -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; text-align: center;">
            <div style="background: rgba(200,68,43,0.15); padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(200,68,43,0.3);">
              <div style="font-size: 0.75rem; color: #FFAAA0;">মোট চাঁদা ও টোল খরচ</div>
              <div id="hud-driver-bribe" style="color: #C8442B; font-weight: 800; font-size: 1.25rem;">৳০</div>
            </div>
            <div style="background: rgba(63,155,91,0.15); padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(63,155,91,0.3);">
              <div style="font-size: 0.75rem; color: #7EE096;">সবজি বোঝাই (আড়ত চালান)</div>
              <div id="hud-driver-cargo" style="color: #FFF8EC; font-weight: 800; font-size: 1.25rem;">১,০০০ কেজি</div>
            </div>
            <div style="background: rgba(245,166,35,0.12); padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(245,166,35,0.3);">
              <div style="font-size: 0.75rem; color: #F5A623;">ট্রাকের বডি ও স্বাস্থ্য</div>
              <div id="hud-driver-health" style="color: #F5A623; font-weight: 800; font-size: 1.25rem;">১০০%</div>
            </div>
          </div>
        </div>

        <!-- Highway 2D Canvas Area -->
        <div style="flex: 1; position: relative; overflow: hidden;" id="canvas-wrapper">
          <canvas id="driver-canvas" style="width: 100%; height: 100%; display: block;"></canvas>

          <!-- Weather Alert Badge -->
          <div id="weather-badge" style="display: none; position: absolute; top: 16px; right: 20px; background: rgba(46,134,171,0.9); backdrop-filter: blur(4px); color: #FFF; padding: 6px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: bold; border: 1px solid #FFF;">
            🌧️ হঠাৎ বৃষ্টি শুরু হয়েছে! রাস্তা পিচ্ছিল
          </div>

          <!-- Barricade Decision Modal / Dialog Overlay -->
          <div id="barricade-modal" class="modal-overlay">
            <div class="modal-dialog">
              <div style="font-size: 3rem; margin-bottom: 8px;">🛑 🚧 🪙</div>
              <h3 style="color: #C8442B; font-size: 1.6rem; margin-bottom: 8px; font-weight: 800;">চাঁদাবাজদের চেকপোস্ট!</h3>
              <p id="barricade-text" style="font-size: 1rem; color: #333; line-height: 1.5; margin-bottom: 18px;">
                "স্ট্যান্ডের স্লিপ বাবদ <strong>৳৪০০</strong> চাঁদা দাবি করেছে! আপনি কী করবেন?"
              </p>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <button id="btn-pay-bribe" class="btn btn-primary" style="padding: 12px 18px; font-size: 1.1rem; width: 100%;">
                  💰 চাঁদা দিন (নিরাপদ, কিন্তু সবজির দাম বাড়বে) <span class="kbd-hint" style="color:#111;">1</span>
                </button>
                <button id="btn-dodge-bribe" class="btn btn-accent" style="padding: 12px 18px; font-size: 1.1rem; width: 100%;">
                  💨 ধোঁয়া উড়িয়ে পালান! (ঝুঁকিপূর্ণ) <span class="kbd-hint" style="color:#FFF;">2</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Touch & Desktop Controls Bar -->
        <div style="background: rgba(26,17,11,0.95); padding: 12px 24px; border-top: 3px solid rgba(245,166,35,0.3); display: flex; gap: 14px; max-width: 800px; margin: 0 auto; width: 100%; z-index: 20;">
          
          <!-- Left Button -->
          <button id="btn-lane-left" class="btn btn-secondary" style="flex: 1; min-height: 58px; font-size: 1.25rem;">
            ◀ বাঁয়ে লেন <span class="kbd-hint">A / ◀</span>
          </button>

          <!-- Loud Horn Button -->
          <button id="btn-truck-horn" class="btn btn-primary pulse-glow" style="flex: 1.5; min-height: 58px; font-size: 1.25rem; gap: 8px;">
            📢 বিকট হর্ন (পোঁ পোঁ) <span class="kbd-hint" style="color:#111;">Space / H</span>
          </button>

          <!-- Right Button -->
          <button id="btn-lane-right" class="btn btn-secondary" style="flex: 1; min-height: 58px; font-size: 1.25rem;">
            ডানে লেন ▶ <span class="kbd-hint">D / ▶</span>
          </button>

        </div>

      </div>
    `;

    this.initCanvas();
    this.bindControls();
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('resize', this.handleResize);
    this.startGameLoop();
    // গান আস্তে আস্তে কমিয়ে দাও — ড্রাইভিং শুরু হয়েছে
    sound.fadeBGMToLow();
  }

  handleResize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    const roadMargin = Math.max(30, (this.canvas.width - 600) / 2);
    const roadWidth = this.canvas.width - roadMargin * 2;
    const laneWidth = roadWidth / 3;

    this.laneX = [
      roadMargin + laneWidth * 0.5,
      roadMargin + laneWidth * 1.5,
      roadMargin + laneWidth * 2.5
    ];
    this.playerY = this.canvas.height - 110;
    this.playerX = this.laneX[this.currentLane];
  }

  initCanvas() {
    this.canvas = this.container.querySelector('#driver-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.handleResize();
  }

  bindControls() {
    this.container.querySelector('#btn-lane-left').addEventListener('click', () => {
      sound.playClick();
      if (this.currentLane > 0) this.currentLane--;
    });

    this.container.querySelector('#btn-lane-right').addEventListener('click', () => {
      sound.playClick();
      if (this.currentLane < 2) this.currentLane++;
    });

    this.container.querySelector('#btn-truck-horn').addEventListener('click', () => {
      this.triggerHorn();
    });

    this.container.querySelector('#btn-pay-bribe').addEventListener('click', () => {
      this.resolveBarricade(true);
    });

    this.container.querySelector('#btn-dodge-bribe').addEventListener('click', () => {
      this.resolveBarricade(false);
    });
  }

  handleKeyDown(e) {
    if (this.isPausedForEvent) {
      if (e.key === '1') {
        this.resolveBarricade(true);
      } else if (e.key === '2') {
        this.resolveBarricade(false);
      }
      return;
    }

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      if (this.currentLane > 0) {
        sound.playClick();
        this.currentLane--;
      }
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      if (this.currentLane < 2) {
        sound.playClick();
        this.currentLane++;
      }
    } else if (e.key === ' ' || e.code === 'Space' || e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      this.triggerHorn();
    }
  }

  triggerHorn() {
    sound.playTruckHornSFX();
    sound.vibrate(100);

    // Scare away cows
    this.obstacles.forEach(ob => {
      if (ob.type === 'cow' && ob.y < this.playerY && ob.y > this.playerY - 300) {
        ob.scared = true;
        ob.lane = ob.lane === 0 ? 1 : 0;
      }
    });

    const toast = document.createElement('div');
    toast.className = 'coin-popup';
    toast.style.left = `${this.playerX}px`;
    toast.style.top = `${this.playerY - 50}px`;
    toast.textContent = '📢 পিপিইইইপ!';
    this.container.querySelector('#canvas-wrapper').appendChild(toast);
    setTimeout(() => toast.remove(), 700);
  }

  spawnObstacle() {
    const lane = Math.floor(Math.random() * 3);
    const types = ['cow', 'barricade', 'pothole', 'toll'];
    const chosenType = types[Math.floor(Math.random() * types.length)];

    this.obstacles.push({
      type: chosenType,
      lane: lane,
      x: this.laneX[lane],
      y: -60,
      bribeAmount: Math.floor(Math.random() * 5 + 3) * 100, // ৳৩০০ - ৳৭০০
      scared: false,
      resolved: false
    });
  }

  startGameLoop() {
    let lastTime = performance.now();

    const loop = (currentTime) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!this.isPausedForEvent) {
        this.update(dt);
      }
      this.draw();

      if (this.distanceKm > 0 && this.truckHealth > 0) {
        this.animId = requestAnimationFrame(loop);
      } else {
        this.endTrip();
      }
    };

    this.animId = requestAnimationFrame(loop);
  }

  update(dt) {
    const distanceStep = (this.speed / 3600) * dt * 8;
    this.distanceKm = Math.max(0, this.distanceKm - distanceStep);

    const distEl = this.container.querySelector('#hud-distance');
    if (distEl) distEl.textContent = toBengaliNumber(this.distanceKm.toFixed(1));

    const targetX = this.laneX[this.currentLane];
    this.playerX += (targetX - this.playerX) * 0.22;

    this.roadOffset += this.speed * dt * 4;
    if (this.roadOffset > 80) this.roadOffset = 0;

    if (Math.random() < 0.002 && !this.isRaining) {
      this.isRaining = true;
      this.container.querySelector('#weather-badge').style.display = 'block';
      setTimeout(() => {
        this.isRaining = false;
        const b = this.container.querySelector('#weather-badge');
        if (b) b.style.display = 'none';
      }, 10000);
    }

    this.obstacleSpawnTimer += dt;
    if (this.obstacleSpawnTimer > 1.8) {
      this.obstacleSpawnTimer = 0;
      this.spawnObstacle();
    }

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const ob = this.obstacles[i];
      ob.y += this.speed * dt * 4.2;
      ob.x = this.laneX[ob.lane];

      const dx = Math.abs(ob.x - this.playerX);
      const dy = Math.abs(ob.y - this.playerY);

      if (dx < 40 && dy < 50 && !ob.resolved) {
        this.handleCollision(ob);
      }

      if (ob.y > this.canvas.height + 60) {
        this.obstacles.splice(i, 1);
      }
    }
  }

  handleCollision(ob) {
    ob.resolved = true;

    if (ob.type === 'barricade') {
      this.isPausedForEvent = true;
      sound.playBrake();
      sound.vibrate(100);

      const modal = this.container.querySelector('#barricade-modal');
      modal.querySelector('#barricade-text').innerHTML = `
        স্ট্যান্ডের চাঁদাবাজরা পথ আটকে দাঁড়িয়েছে!<br>
        দাবিকৃত চাঁদা: <strong>৳${toBengaliNumber(ob.bribeAmount)}</strong>। আপনি কী করবেন?
      `;
      this.currentBarricadeOb = ob;
      modal.classList.add('active');
    } else if (ob.type === 'cow') {
      sound.playBuzzer();
      sound.vibrate([100, 100]);
      this.truckHealth = Math.max(0, this.truckHealth - 15);
      this.cargoCondition = Math.max(50, this.cargoCondition - 5);
      this.container.classList.add('shake-screen');
      setTimeout(() => this.container.classList.remove('shake-screen'), 400);
      this.updateDriverHUD();
    } else if (ob.type === 'pothole') {
      sound.playBuzzer();
      this.truckHealth = Math.max(0, this.truckHealth - 8);
      this.updateDriverHUD();
    } else if (ob.type === 'toll') {
      sound.playCoin();
      this.totalBribePaid += 100;
      this.updateDriverHUD();
    }
  }

  resolveBarricade(didPay) {
    const modal = this.container.querySelector('#barricade-modal');
    modal.classList.remove('active');
    this.isPausedForEvent = false;

    if (didPay) {
      sound.playCoin();
      this.totalBribePaid += this.currentBarricadeOb.bribeAmount;
    } else {
      const escaped = Math.random() > 0.45;
      if (escaped) {
        sound.playEscapedSFX();
        sound.playSuccess();
      } else {
        sound.playBuzzer();
        sound.vibrate([100, 100, 100]);
        this.truckHealth = Math.max(0, this.truckHealth - 20);
        this.totalBribePaid += Math.round(this.currentBarricadeOb.bribeAmount * 1.5);
      }
    }

    this.updateDriverHUD();
  }

  updateDriverHUD() {
    this.container.querySelector('#hud-driver-bribe').textContent = formatTaka(this.totalBribePaid);
    this.container.querySelector('#hud-driver-health').textContent = `${toBengaliNumber(this.truckHealth)}%`;
  }

  draw() {
    const { ctx, canvas } = this;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Highway Roadside Greenery / Shoulder
    ctx.fillStyle = '#1D3319';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Highway Asphalt
    const roadMargin = Math.max(30, (canvas.width - 600) / 2);
    const roadWidth = canvas.width - roadMargin * 2;

    // Road Edge Curbs (Yellow & Black stripes)
    ctx.fillStyle = '#F5A623';
    ctx.fillRect(roadMargin - 10, 0, 10, canvas.height);
    ctx.fillRect(roadMargin + roadWidth, 0, 10, canvas.height);

    // Main Road
    ctx.fillStyle = '#261F1C';
    ctx.fillRect(roadMargin, 0, roadWidth, canvas.height);

    // Lane Dividers
    ctx.strokeStyle = '#F5A623';
    ctx.lineWidth = 4;
    ctx.setLineDash([30, 30]);
    ctx.lineDashOffset = -this.roadOffset;

    const lane1X = roadMargin + roadWidth / 3;
    const lane2X = roadMargin + (roadWidth / 3) * 2;

    ctx.beginPath();
    ctx.moveTo(lane1X, 0);
    ctx.lineTo(lane1X, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(lane2X, 0);
    ctx.lineTo(lane2X, canvas.height);
    ctx.stroke();

    ctx.setLineDash([]); // reset

    // Draw Obstacles
    this.obstacles.forEach(ob => {
      ctx.save();
      ctx.translate(ob.x, ob.y);

      if (ob.type === 'cow') {
        ctx.font = '34px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🐄', 0, 10);
      } else if (ob.type === 'barricade') {
        ctx.fillStyle = '#C8442B';
        ctx.fillRect(-30, -10, 60, 20);
        ctx.fillStyle = '#FFF8EC';
        ctx.fillRect(-20, -8, 10, 16);
        ctx.fillRect(10, -8, 10, 16);
        ctx.font = 'bold 12px Hind Siliguri';
        ctx.fillStyle = '#FFF';
        ctx.textAlign = 'center';
        ctx.fillText('🛑 চাঁদা চেকপোস্ট', 0, -16);
      } else if (ob.type === 'pothole') {
        ctx.fillStyle = '#110C09';
        ctx.beginPath();
        ctx.ellipse(0, 0, 24, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (ob.type === 'toll') {
        ctx.fillStyle = '#2E86AB';
        ctx.fillRect(-28, -8, 56, 16);
        ctx.font = 'bold 12px Hind Siliguri';
        ctx.fillStyle = '#FFF';
        ctx.textAlign = 'center';
        ctx.fillText('টোল প্লাজা', 0, -12);
      }

      ctx.restore();
    });

    // Draw Player Truck (Procedural Truck Art Top-Down)
    const truckColor = this.engine.gameState.truckColor?.hex || '#F5A623';
    drawTopDownTruck(ctx, this.playerX, this.playerY, 52, 98, truckColor, 'কাওরান বাজার');

    // Draw Rain
    if (this.isRaining) {
      ctx.strokeStyle = 'rgba(140, 224, 255, 0.45)';
      ctx.lineWidth = 1.8;
      for (let i = 0; i < 60; i++) {
        const rx = Math.random() * canvas.width;
        const ry = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 6, ry + 22);
        ctx.stroke();
      }
    }
  }

  endTrip() {
    cancelAnimationFrame(this.animId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('resize', this.handleResize);

    const baseFreightIncome = 5000;
    const profit = Math.max(0, baseFreightIncome - this.totalBribePaid);
    const priceHikePerKg = (this.totalBribePaid / this.vegetablesKg).toFixed(1);

    this.engine.gameState.driverResult = {
      deliveredKg: this.vegetablesKg,
      totalBribePaid: this.totalBribePaid,
      profit: profit,
      truckHealth: this.truckHealth,
      priceHikePerKg: priceHikePerKg,
      success: this.truckHealth > 0 && this.distanceKm <= 0
    };

    this.engine.changeScene('summary');
  }

  destroy() {
    cancelAnimationFrame(this.animId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('resize', this.handleResize);
  }
}
