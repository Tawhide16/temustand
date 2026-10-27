import { sound } from '../systems/audio.js';
import { LOCATIONS } from '../data/locations.js';
import { toBengaliNumber, formatTaka, generateVehicleSVG } from '../systems/utils.js';

export class CollectorScene {
  constructor(engine) {
    this.engine = engine;
    this.locationIndex = 0;
    this.timeLeft = 60; // 60 seconds round
    this.timerInterval = null;
    this.truckTimer = null;
    this.policeTimeout = null;

    // Session stats
    this.totalExtorted = 0;
    this.leaderShare = 0;
    this.myEarnings = 0;
    this.penalties = 0;
    this.warnings = 0;
    this.trucksServed = 0;

    // Current Truck State
    this.currentTruck = null;
    this.enteredLeaderCut = 0;
    this.isPolicePatrol = false;
    this.policeReacted = false;

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  render(container) {
    this.container = container;
    const currentLocation = LOCATIONS[this.locationIndex];
    const eduBonus = this.engine.gameState.education?.bonusPercent || 10;
    const char = this.engine.gameState.character || { name: 'লুঙ্গি-পরা ক্যাশিয়ার' };

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; height: 100%; position: relative; background: ${currentLocation.bgGradient};">
        
        <!-- Top HUD Header (Desktop Spacious) -->
        <div style="background: rgba(15, 10, 7, 0.95); padding: 12px 24px; border-bottom: 2px solid #F5A623; display: flex; flex-direction: column; gap: 8px; z-index: 10;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <span style="color: #F5A623; font-weight: 800; font-size: 1.15rem;">📍 ${currentLocation.name}</span>
              <span style="font-size: 0.85rem; background: #382516; padding: 2px 10px; border-radius: 6px; color: #FFF8EC; border: 1px solid rgba(245,166,35,0.3);">
                ${currentLocation.tagline}
              </span>
              <span style="font-size: 0.85rem; background: rgba(63,155,91,0.2); border: 1px solid #3F9B5B; padding: 2px 10px; border-radius: 6px; color: #7EE096; font-weight: bold;">
                শিক্ষা বোনাস: +${toBengaliNumber(eduBonus)}%
              </span>
            </div>
            
            <div style="color: #FFF8EC; font-weight: 800; font-size: 1.15rem; background: rgba(0,0,0,0.4); padding: 4px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
              ⏳ শিফট বাকি: <span id="hud-timer" style="color: #F5A623; font-size: 1.35rem;">${toBengaliNumber(this.timeLeft)}</span> সেকেন্ড
            </div>
          </div>

          <!-- Wide Metrics Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; text-align: center;">
            <div style="background: rgba(255,248,236,0.08); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(245,166,35,0.15);">
              <div style="font-size: 0.75rem; opacity: 0.8;">মোট উত্তোলিত চাঁদা</div>
              <div id="hud-total" style="color: #F5A623; font-weight: 800; font-size: 1.25rem;">৳০</div>
            </div>
            <div style="background: rgba(255,248,236,0.08); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(63,155,91,0.2);">
              <div style="font-size: 0.75rem; opacity: 0.8;">নেতার ১০% ফান্ড</div>
              <div id="hud-leader" style="color: #3F9B5B; font-weight: 800; font-size: 1.25rem;">৳০</div>
            </div>
            <div style="background: rgba(255,248,236,0.08); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15);">
              <div style="font-size: 0.75rem; opacity: 0.8;">নিজের পকেট (বোনাস সহ)</div>
              <div id="hud-my-pocket" style="color: #FFF8EC; font-weight: 800; font-size: 1.25rem;">৳০</div>
            </div>
            <div style="background: rgba(200,68,43,0.12); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(200,68,43,0.3); display: flex; flex-direction: column; justify-content: center;">
              <div style="font-size: 0.75rem; color: #FFAAA0;">নেতার সতর্কতা মিটার</div>
              <div id="hud-warnings" style="color: #C8442B; font-weight: 800; font-size: 1.15rem; letter-spacing: 2px;">
                [ ⚪ ⚪ ⚪ ]
              </div>
            </div>
          </div>
        </div>

        <!-- Stand / Road Stage (Scenic & Wide) -->
        <div id="stage-road" style="flex: 1; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; padding-bottom: 20px;">
          
          <!-- Background Roadside Ambiance -->
          <div style="position: absolute; top: 18px; left: 24px; font-size: 1.05rem; color: rgba(255,248,236,0.5); font-weight: bold; display: flex; align-items: center; gap: 8px;">
            <span>🛖</span> <span>${currentLocation.bgDetail}</span>
          </div>

          <!-- Roadside Stand Signboard (Desktop artistic detail) -->
          <div style="position: absolute; top: 18px; right: 24px; background: #C8442B; color: #FFF8EC; padding: 6px 14px; border-radius: 8px; border: 2px solid #F5A623; font-weight: 800; font-size: 0.85rem; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
            🚩 স্ট্যান্ড ফি পয়েন্ট
          </div>

          <!-- Collector Avatar Badge -->
          <div style="position: absolute; bottom: 100px; left: 24px; display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.55); backdrop-filter: blur(4px); padding: 6px 16px; border-radius: 24px; font-size: 0.95rem; border: 1px solid rgba(245,166,35,0.3);">
            <span style="font-size: 1.5rem;">${char.avatarEmoji || '🪙'}</span>
            <div>
              <div style="color: #FFF8EC; font-weight: 800; line-height: 1.1;">${char.name}</div>
              <div style="font-size: 0.75rem; color: #F5A623;">ডিউটিতে নিয়োজিত</div>
            </div>
          </div>

          <!-- Animated Vehicle Stage Area -->
          <div id="vehicle-container" style="width: 100%; min-height: 180px; display: flex; align-items: center; justify-content: center; position: relative;">
            <div id="waiting-text" style="color: rgba(255,248,236,0.65); font-size: 1.15rem; font-style: italic; background: rgba(0,0,0,0.3); padding: 8px 18px; border-radius: 12px;">
              👀 স্ট্যান্ডে দাঁড়িয়ে আছেন... গাড়ি আসামাত্র থামান!
            </div>
          </div>

          <!-- Road Asphalt Highway -->
          <div style="height: 44px; background: #2A2421; border-top: 4px dashed #F5A623; border-bottom: 4px solid #111; width: 100%; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 6px 10px rgba(0,0,0,0.6);">
            <div style="height: 4px; width: 100%; background: repeating-linear-gradient(90deg, #F5A623 0, #F5A623 40px, transparent 40px, transparent 80px);"></div>
          </div>

          <!-- Police Alert Overlay Banner -->
          <div id="police-banner" style="display: none; position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 500px; background: #C8442B; border: 4px solid #FFF8EC; padding: 20px; border-radius: 16px; text-align: center; box-shadow: 0 0 50px rgba(200,68,43,0.95); z-index: 50;">
            <div style="font-size: 3rem; margin-bottom: 6px;">🚨 👮‍♂️ 🚨</div>
            <strong style="font-size: 1.35rem; color: #FFF8EC;">পুলিশের টহল ভ্যান আসছে!</strong>
            <p style="font-size: 0.95rem; color: #FFF8EC; margin: 6px 0 16px;">
              দ্রুত স্লিপ পকেটে লুকান ও সাধারণ পথচারীর ভাব নিন!
            </p>
            <button id="btn-police-hide" class="btn btn-primary" style="padding: 12px 24px; font-size: 1.15rem; width: 100%;">
              🤫 স্লিপ লুকিয়ে স্বাভাবিক থাকুন! <span class="kbd-hint" style="color:#111;">H / Esc</span>
            </button>
          </div>

        </div>

        <!-- Action / Calculation Panel (Fixed at bottom) -->
        <div id="control-panel" style="background: #FFF8EC; color: #1A110B; border-top: 5px solid #F5A623; padding: 16px 24px; border-radius: 20px 20px 0 0; box-shadow: 0 -10px 30px rgba(0,0,0,0.5); z-index: 20;">
          
          <!-- When No Truck Stopped: Big Stop Button -->
          <div id="panel-idle" style="display: block; max-width: 600px; margin: 0 auto;">
            <button id="btn-stop-truck" class="btn btn-primary" style="font-size: 1.4rem; padding: 18px; width: 100%;" disabled>
              🛑 গাড়ি আসামাত্র থামান! <span class="kbd-hint" style="color:#111;">Space</span>
            </button>
          </div>

          <!-- When Truck Stopped: Extortion & Leader 10% Cut Interface -->
          <div id="panel-deal" style="display: none; max-width: 780px; margin: 0 auto;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
              <div>
                <span id="truck-type-label" style="font-weight: 800; font-size: 1.35rem; color: #1A110B;">আলুর ট্রাক</span>
                <span id="truck-goods-label" style="font-size: 0.9rem; color: #555; display: block;">বগুড়া থেকে কারওয়ান বাজার</span>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 0.85rem; color: #666; font-weight: 600;">দাবিকৃত চাঁদা</div>
                <div id="truck-demand-label" style="font-size: 1.65rem; font-weight: 900; color: #C8442B;">৳১,০০০</div>
              </div>
            </div>

            <!-- Leader Cut Calculator -->
            <div style="background: rgba(245,166,35,0.18); border: 2px dashed #F5A623; border-radius: 12px; padding: 12px 18px; margin-bottom: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 1rem; font-weight: 800; color: #1A110B;">নেতার ১০% তহবিলে দিচ্ছেন:</span>
                <span id="calculated-leader-cut" style="font-size: 1.55rem; font-weight: 900; color: #3F9B5B;">৳০</span>
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn-cut-adj" data-amount="10" style="flex: 1; min-width: 65px; padding: 10px; font-weight: 800; font-size: 1.05rem; background: #FFF8EC; border: 1px solid #CCC; border-radius: 8px; cursor: pointer;">+৳১০</button>
                <button class="btn-cut-adj" data-amount="50" style="flex: 1; min-width: 65px; padding: 10px; font-weight: 800; font-size: 1.05rem; background: #FFF8EC; border: 1px solid #CCC; border-radius: 8px; cursor: pointer;">+৳৫০</button>
                <button class="btn-cut-adj" data-amount="100" style="flex: 1; min-width: 65px; padding: 10px; font-weight: 800; font-size: 1.05rem; background: #FFF8EC; border: 1px solid #CCC; border-radius: 8px; cursor: pointer;">+৳১০০</button>
                <button id="btn-auto-10" style="flex: 1.8; min-width: 140px; padding: 10px; font-weight: 800; font-size: 1.05rem; background: #3F9B5B; color: #FFF; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 10px rgba(63,155,91,0.3);">
                  🎯 সরাসরি ১০% <span class="kbd-hint" style="background:rgba(0,0,0,0.25);">1</span>
                </button>
                <button id="btn-reset-cut" style="padding: 10px 14px; background: #EEE; border: 1px solid #CCC; border-radius: 8px; cursor: pointer; font-weight: bold;">
                  ↺ রিসেট
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button id="btn-submit-deal" class="btn btn-green" style="font-size: 1.3rem; padding: 14px; width: 100%;">
              💰 টাকা তুলে গাড়ি ছাড়ুন <span class="kbd-hint" style="background:rgba(0,0,0,0.25);">Enter</span>
            </button>

          </div>

        </div>

      </div>

      <!-- Transfer Screen (Modal after 3 warnings) -->
      <div id="transfer-modal" class="modal-overlay">
        <div class="modal-dialog">
          <div style="font-size: 3.2rem; margin-bottom: 8px;">🚨📦🚨</div>
          <h3 style="color: #C8442B; font-size: 1.6rem; margin-bottom: 8px; font-weight: 800;">ওস্তাদের কড়া নির্দেশ: বদলি!</h3>
          <p style="font-size: 1rem; color: #333; line-height: 1.5; margin-bottom: 14px;">
            "৩টা মারাত্মক ভুল করেছিস! নেতার হিসাব নিয়ে ছিনিমিনি বরদাশত করা হবে না। এই স্ট্যান্ড থেকে তোকে বদলি করা হলো!"
          </p>
          <div id="transfer-target-info" style="background: rgba(245,166,35,0.18); border: 2px solid #F5A623; padding: 12px 16px; border-radius: 10px; font-size: 0.95rem; color: #1A110B; margin-bottom: 18px;">
            নতুন দায়িত্ব: <strong>টেম্পু স্ট্যান্ড</strong>
          </div>
          <button id="btn-accept-transfer" class="btn btn-primary" style="width: 100%; font-size: 1.15rem;">
            নতুন স্ট্যান্ডে যোগ দিন ➔
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
    window.addEventListener('keydown', this.handleKeyDown);
    this.startRound();
  }

  handleKeyDown(e) {
    if (this.timeLeft <= 0) return;

    if (e.key === ' ' || e.code === 'Space') {
      if (this.currentTruck && !this.currentTruck.stopped) {
        e.preventDefault();
        sound.playBrake();
        sound.vibrate(80);
        this.stopCurrentTruck();
      }
    } else if (e.key === '1') {
      if (this.currentTruck && this.currentTruck.stopped) {
        sound.playCoin();
        this.enteredLeaderCut = Math.round(this.currentTruck.demandFee * 0.1);
        this.updateCutDisplay();
      }
    } else if (e.key === 'Enter') {
      if (this.currentTruck && this.currentTruck.stopped) {
        this.processDeal();
      }
    } else if (e.key === 'h' || e.key === 'H' || e.key === 'Escape') {
      if (this.isPolicePatrol) {
        sound.playClick();
        this.policeReacted = true;
        this.container.querySelector('#police-banner').style.display = 'none';
        this.showToast('✓ পুলিশ চলে গেছে! আপনি সুরক্ষিত।', '#3F9B5B');
      }
    }
  }

  bindEvents() {
    this.container.querySelector('#btn-stop-truck').addEventListener('click', () => {
      if (this.currentTruck && !this.currentTruck.stopped) {
        sound.playBrake();
        sound.vibrate(80);
        this.stopCurrentTruck();
      }
    });

    this.container.querySelectorAll('.btn-cut-adj').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const amt = parseInt(btn.getAttribute('data-amount'), 10);
        this.enteredLeaderCut += amt;
        this.updateCutDisplay();
      });
    });

    this.container.querySelector('#btn-auto-10').addEventListener('click', () => {
      if (this.currentTruck) {
        sound.playCoin();
        this.enteredLeaderCut = Math.round(this.currentTruck.demandFee * 0.1);
        this.updateCutDisplay();
      }
    });

    this.container.querySelector('#btn-reset-cut').addEventListener('click', () => {
      sound.playClick();
      this.enteredLeaderCut = 0;
      this.updateCutDisplay();
    });

    this.container.querySelector('#btn-submit-deal').addEventListener('click', () => {
      this.processDeal();
    });

    this.container.querySelector('#btn-police-hide').addEventListener('click', () => {
      sound.playClick();
      this.policeReacted = true;
      this.container.querySelector('#police-banner').style.display = 'none';
      this.showToast('✓ পুলিশ চলে গেছে! আপনি সুরক্ষিত।', '#3F9B5B');
    });

    this.container.querySelector('#btn-accept-transfer').addEventListener('click', () => {
      sound.playClick();
      this.container.querySelector('#transfer-modal').classList.remove('active');
      this.warnings = 0;
      this.locationIndex = (this.locationIndex + 1) % LOCATIONS.length;
      this.render(this.container);
    });
  }

  startRound() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      const el = this.container.querySelector('#hud-timer');
      if (el) el.textContent = toBengaliNumber(this.timeLeft);

      if (this.timeLeft <= 0) {
        this.endSession();
      }
    }, 1000);

    this.scheduleNextTruck(1000);

    const curLoc = LOCATIONS[this.locationIndex];
    if (curLoc.policeRisk > 0) {
      this.schedulePolicePatrol();
    }
  }

  schedulePolicePatrol() {
    const delay = Math.random() * 20000 + 15000;
    this.policeTimeout = setTimeout(() => {
      if (this.timeLeft > 10) {
        this.triggerPoliceEvent();
      }
    }, delay);
  }

  triggerPoliceEvent() {
    this.isPolicePatrol = true;
    this.policeReacted = false;
    sound.playBuzzer();
    sound.vibrate([100, 50, 100]);
    const banner = this.container.querySelector('#police-banner');
    if (banner) banner.style.display = 'block';

    setTimeout(() => {
      if (!this.policeReacted && this.isPolicePatrol) {
        banner.style.display = 'none';
        this.penalties += 300;
        this.addWarning('পুলিশ ধরেছে! ৩টি স্লিপ জব্দ ও জরিমানা ৳৩০০!');
      }
      this.isPolicePatrol = false;
      this.schedulePolicePatrol();
    }, 4500);
  }

  scheduleNextTruck(delay = 2500) {
    if (this.timeLeft <= 0) return;
    // যদি ট্রাক থামানো হয়নি (চাঁদা না দিয়ে পালিয়েছে), তাহলে escaped sound বাজাও
    if (this.currentTruck && !this.currentTruck.stopped) {
      sound.playEscapedSFX();
      this.currentTruck = null;
    }
    this.truckTimer = setTimeout(() => {
      this.spawnTruck();
    }, delay);
  }

  spawnTruck() {
    if (this.timeLeft <= 0) return;
    const truckTypes = [
      { type: 'tempo', name: 'লোকাল টেম্পু', goods: 'যাত্রী ও পার্সেল', minFee: 300, maxFee: 600, color: '#F5A623' },
      { type: 'pickup', name: 'কাঁচাবাজারের পিকআপ', goods: 'টাটকা শসা, বেগুন ও লেবু', minFee: 500, maxFee: 1200, color: '#3F9B5B' },
      { type: 'pickup', name: 'আলুর পিকআপ', goods: 'বগুড়ার লাল আলু ৫০ বস্তা', minFee: 800, maxFee: 1500, color: '#C8442B' },
      { type: 'heavy_truck', name: '১০ চাকার বড় ট্রাক', goods: 'দিনাজপুরের চালের চালান', minFee: 1200, maxFee: 2500, color: '#2E86AB' }
    ];

    const chosen = truckTypes[Math.floor(Math.random() * truckTypes.length)];
    const fee = Math.floor(Math.random() * (chosen.maxFee - chosen.minFee + 1) / 100) * 100 + chosen.minFee;

    this.currentTruck = {
      ...chosen,
      demandFee: fee,
      stopped: false
    };

    const containerEl = this.container.querySelector('#vehicle-container');
    containerEl.innerHTML = `
      <div id="animated-truck" style="width: 100%; max-width: 320px; animation: slideIn 0.5s ease-out;">
        ${generateVehicleSVG(chosen.type, chosen.color, chosen.goods)}
      </div>
    `;

    const stopBtn = this.container.querySelector('#btn-stop-truck');
    stopBtn.disabled = false;
    stopBtn.classList.add('pulse-glow');
    stopBtn.innerHTML = `🛑 ${chosen.name} থামান! <span class="kbd-hint" style="color:#111;">Space</span>`;

    // 🔊 ট্রাক আসলে horn বাজাও
    sound.playTruckHornSFX();
  }

  stopCurrentTruck() {
    this.currentTruck.stopped = true;
    this.enteredLeaderCut = 0;

    this.container.querySelector('#panel-idle').style.display = 'none';
    this.container.querySelector('#panel-deal').style.display = 'block';

    this.container.querySelector('#truck-type-label').textContent = this.currentTruck.name;
    this.container.querySelector('#truck-goods-label').textContent = this.currentTruck.goods;
    this.container.querySelector('#truck-demand-label').textContent = formatTaka(this.currentTruck.demandFee);

    this.updateCutDisplay();
  }

  updateCutDisplay() {
    const el = this.container.querySelector('#calculated-leader-cut');
    if (el) {
      el.textContent = formatTaka(this.enteredLeaderCut);
      const exact10 = Math.round(this.currentTruck.demandFee * 0.1);
      if (this.enteredLeaderCut === exact10) {
        el.style.color = '#3F9B5B';
      } else if (this.enteredLeaderCut < exact10) {
        el.style.color = '#C8442B';
      } else {
        el.style.color = '#F5A623';
      }
    }
  }

  processDeal() {
    if (!this.currentTruck) return;
    const totalFee = this.currentTruck.demandFee;
    const exact10 = Math.round(totalFee * 0.1);
    const myShare = totalFee - this.enteredLeaderCut;
    const eduBonusPercent = this.engine.gameState.education?.bonusPercent || 10;

    if (this.enteredLeaderCut < exact10) {
      sound.playBuzzer();
      sound.vibrate([100, 100, 100]);
      this.penalties += 200;
      this.addWarning(`নেতার ১০% ভাগ কম দিয়েছিস?! জরিমানা ৳২০০ এবং সতর্কতা +১!`);
    } else {
      sound.playCoin();
      sound.playSuccess();
      const bonusTaka = Math.round(myShare * (eduBonusPercent / 100));
      this.totalExtorted += totalFee;
      this.leaderShare += this.enteredLeaderCut;
      this.myEarnings += (myShare + bonusTaka);
      this.trucksServed++;

      this.showToast(`✓ হিসাব সঠিক! নেতার ১০% জমা হয়েছে (+৳${toBengaliNumber(bonusTaka)} শিক্ষা বোনাস)`, '#3F9B5B');
    }

    this.updateHUD();

    this.container.querySelector('#panel-deal').style.display = 'none';
    this.container.querySelector('#panel-idle').style.display = 'block';
    const stopBtn = this.container.querySelector('#btn-stop-truck');
    stopBtn.disabled = true;
    stopBtn.classList.remove('pulse-glow');
    stopBtn.innerHTML = `🛑 গাড়ি আসামাত্র থামান! <span class="kbd-hint" style="color:#111;">Space</span>`;

    const vehicleContainer = this.container.querySelector('#vehicle-container');
    vehicleContainer.innerHTML = `
      <div style="color: rgba(255,248,236,0.65); font-size: 1.15rem; font-style: italic;">
        গাড়ি চলে গেছে। পরবর্তী গাড়ির জন্য অপেক্ষা করুন...
      </div>
    `;

    this.currentTruck = null;
    this.scheduleNextTruck(LOCATIONS[this.locationIndex].trafficRate);
  }

  addWarning(msg) {
    this.warnings++;
    this.container.classList.add('shake-screen');
    setTimeout(() => this.container.classList.remove('shake-screen'), 400);

    this.showToast(`⚠️ ${msg}`, '#C8442B');
    this.updateHUD();

    if (this.warnings >= 3) {
      this.triggerTransfer();
    }
  }

  triggerTransfer() {
    sound.playBuzzer();
    const nextIdx = (this.locationIndex + 1) % LOCATIONS.length;
    const nextLoc = LOCATIONS[nextIdx];

    const modal = this.container.querySelector('#transfer-modal');
    modal.querySelector('#transfer-target-info').innerHTML = `নতুন স্ট্যান্ড: <strong>${nextLoc.name}</strong> (${nextLoc.tagline})`;
    modal.classList.add('active');
  }

  updateHUD() {
    this.container.querySelector('#hud-total').textContent = formatTaka(this.totalExtorted);
    this.container.querySelector('#hud-leader').textContent = formatTaka(this.leaderShare);
    this.container.querySelector('#hud-my-pocket').textContent = formatTaka(this.myEarnings);

    const warnSymbols = ['⚪', '⚪', '⚪'];
    for (let i = 0; i < Math.min(this.warnings, 3); i++) {
      warnSymbols[i] = '🔴';
    }
    this.container.querySelector('#hud-warnings').textContent = `[ ${warnSymbols.join(' ')} ]`;
  }

  showToast(text, color = '#F5A623') {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: absolute;
      top: 110px;
      left: 50%;
      transform: translateX(-50%);
      background: ${color};
      color: #FFF8EC;
      padding: 8px 20px;
      border-radius: 24px;
      font-size: 0.95rem;
      font-weight: bold;
      z-index: 100;
      box-shadow: 0 6px 16px rgba(0,0,0,0.5);
      white-space: nowrap;
      animation: floatUp 1.8s forwards ease-out;
    `;
    toast.textContent = text;
    this.container.appendChild(toast);
    setTimeout(() => toast.remove(), 1800);
  }

  endSession() {
    clearInterval(this.timerInterval);
    clearTimeout(this.truckTimer);
    clearTimeout(this.policeTimeout);
    window.removeEventListener('keydown', this.handleKeyDown);

    this.engine.gameState.collectorResult = {
      totalExtorted: this.totalExtorted,
      leaderShare: this.leaderShare,
      myEarnings: Math.max(0, this.myEarnings - this.penalties),
      penalties: this.penalties,
      warnings: this.warnings,
      trucksServed: this.trucksServed,
      location: LOCATIONS[this.locationIndex]
    };

    this.engine.changeScene('summary');
  }

  destroy() {
    clearInterval(this.timerInterval);
    clearTimeout(this.truckTimer);
    clearTimeout(this.policeTimeout);
    window.removeEventListener('keydown', this.handleKeyDown);
  }
}
