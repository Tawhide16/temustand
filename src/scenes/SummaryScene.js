import confetti from 'canvas-confetti';
import { sound } from '../systems/audio.js';
import { storage } from '../systems/storage.js';
import { toBengaliNumber, formatTaka } from '../systems/utils.js';

export class SummaryScene {
  constructor(engine) {
    this.engine = engine;
  }

  render(container) {
    const isCollector = this.engine.gameState.selectedRole === 'collector';
    const collectorRes = this.engine.gameState.collectorResult;
    const driverRes = this.engine.gameState.driverResult;

    sound.playSuccess();
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.55 }
      });
    } catch (e) {
      // ignore
    }

    if (isCollector && collectorRes) {
      storage.recordCollectorSession({
        netEarnings: collectorRes.myEarnings,
        leader10: collectorRes.leaderShare,
        penalties: collectorRes.penalties,
        warnings: collectorRes.warnings
      });
    } else if (!isCollector && driverRes) {
      storage.recordDriverSession({
        profit: driverRes.profit,
        totalBribePaid: driverRes.totalBribePaid,
        deliveredKg: driverRes.deliveredKg
      });
    }

    container.innerHTML = `
      <div class="scene-wrapper" style="overflow-y: auto;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="display: inline-block; background: #C8442B; color: #FFF8EC; font-size: 0.9rem; padding: 4px 18px; border-radius: 20px; font-weight: bold; margin-bottom: 6px;">
            দিনান্তের ব্যঙ্গাত্মক রসিদ
          </div>
          <h2 style="color: #F5A623; font-size: clamp(2rem, 3.5vw, 2.6rem); font-weight: 800;">আজকের হিসাব</h2>
          <p style="font-size: 1.05rem; opacity: 0.85;">রাস্তার বাস্তবতা ও পকেটের দশা!</p>
        </div>

        <!-- Summary Receipt Card (Desktop 2-column or spacious parchment) -->
        <div class="card-truck-art" style="max-width: 850px; margin: 0 auto 24px; width: 100%;">
          
          ${isCollector && collectorRes ? `
            <!-- Collector Report -->
            <div class="desktop-grid-2" style="align-items: center;">
              
              <div style="text-align: center; padding-right: 16px; border-right: 2px dashed #D4A373;">
                <span style="font-size: 4rem;">🪙</span>
                <h3 style="color: #1A110B; font-size: 1.6rem; margin: 6px 0 2px; font-weight: 800;">স্ট্যান্ড ক্যাশিয়ার রিপোর্ট</h3>
                <div style="font-size: 0.95rem; color: #555; margin-bottom: 12px;">লোকেশন: <strong>${collectorRes.location?.name || 'খুঁটির নিচে'}</strong></div>
                <div style="background: rgba(0,0,0,0.06); padding: 10px 14px; border-radius: 10px; font-size: 0.88rem; color: #444; line-height: 1.5;">
                  ${collectorRes.warnings === 0 
                    ? '🌟 "নেতা আপনার কাজে মুগ্ধ! হিসাব সঠিক রাখায় ঈদে নতুন পাঞ্জাবি পাবেন!"' 
                    : '⚠️ "নেতার কড়া নজর আপনার ওপর আছে। পরবর্তীতে সাবধানে হিসাব করবেন!"'}
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 10px; font-size: 1.05rem;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(0,0,0,0.1); padding-bottom: 6px;">
                  <span>মোট উত্তোলিত চাঁদা:</span>
                  <strong style="color: #1A110B;">${formatTaka(collectorRes.totalExtorted)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(0,0,0,0.1); padding-bottom: 6px;">
                  <span style="color: #3F9B5B; font-weight: bold;">👑 নেতার ১০% ফান্ড:</span>
                  <strong style="color: #3F9B5B;">${formatTaka(collectorRes.leaderShare)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(0,0,0,0.1); padding-bottom: 6px;">
                  <span>জরিমানা ও কর্তন:</span>
                  <span style="color: #C8442B; font-weight: bold;">- ${formatTaka(collectorRes.penalties)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(0,0,0,0.1); padding-bottom: 6px;">
                  <span>মোট গাড়ি সেবা:</span>
                  <span>${toBengaliNumber(collectorRes.trucksServed)} টি</span>
                </div>
                
                <div style="border-top: 3px solid #1A110B; padding-top: 12px; margin-top: 6px; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 1.25rem; font-weight: 800; color: #1A110B;">নিজের নিট আয়:</span>
                  <span style="font-size: 2rem; font-weight: 900; color: #F5A623;">
                    ${formatTaka(collectorRes.myEarnings)}
                  </span>
                </div>
              </div>

            </div>
          ` : `
            <!-- Driver Report -->
            <div class="desktop-grid-2" style="align-items: center;">
              
              <div style="text-align: center; padding-right: 16px; border-right: 2px dashed #D4A373;">
                <span style="font-size: 4rem;">🚚</span>
                <h3 style="color: #1A110B; font-size: 1.6rem; margin: 6px 0 2px; font-weight: 800;">কাওরান বাজার ডেলিভারি ভাউচার</h3>
                <div style="font-size: 0.95rem; color: #555; margin-bottom: 12px;">চালান: ১,০০০ কেজি বগুড়ার বাঁধাকপি ও আলু</div>
                
                <!-- Key Satirical Consumer Impact Callout -->
                <div style="background: rgba(200,68,43,0.14); border: 2px dashed #C8442B; padding: 12px 14px; border-radius: 12px; text-align: left;">
                  <div style="font-size: 0.85rem; color: #C8442B; font-weight: bold;">
                    🚨 সাধারণ ভোক্তার বাজারে প্রভাব:
                  </div>
                  <div style="font-size: 1.25rem; font-weight: 900; color: #1A110B; margin-top: 4px;">
                    সবজির প্রতি কেজিতে বেড়েছে: +৳${toBengaliNumber(driverRes?.priceHikePerKg || '০')}!
                  </div>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 10px; font-size: 1.05rem;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(0,0,0,0.1); padding-bottom: 6px;">
                  <span>মোট চাঁদা ও টোল খরচ:</span>
                  <strong style="color: #C8442B;">${formatTaka(driverRes?.totalBribePaid || 0)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(0,0,0,0.1); padding-bottom: 6px;">
                  <span>কাওরান বাজারে মোট ভাড়া:</span>
                  <strong style="color: #1A110B;">৳৫,০০০</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(0,0,0,0.1); padding-bottom: 6px;">
                  <span>গাড়ির অবশিষ্ট কন্ডিশন:</span>
                  <span>${toBengaliNumber(driverRes?.truckHealth || 100)}%</span>
                </div>

                <div style="border-top: 3px solid #1A110B; padding-top: 12px; margin-top: 6px; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 1.25rem; font-weight: 800; color: #1A110B;">ড্রাইভারের নিট লাভ:</span>
                  <span style="font-size: 2rem; font-weight: 900; color: #3F9B5B;">
                    ${formatTaka(driverRes?.profit || 0)}
                  </span>
                </div>
              </div>

            </div>
          `}

        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 16px; max-width: 600px; margin: 0 auto; width: 100%; flex-wrap: wrap;">
          <button id="btn-share" class="btn btn-primary" style="flex: 1.5; font-size: 1.2rem; min-width: 220px;">
            <span>📢</span> ফলাফল কপি ও শেয়ার করুন
          </button>
          <button id="btn-replay" class="btn btn-green" style="flex: 1; font-size: 1.1rem; min-width: 140px;">
            <span>↺</span> আবার খেলুন
          </button>
          <button id="btn-switch-role" class="btn btn-secondary" style="flex: 1; font-size: 1.1rem; min-width: 140px;">
            অন্য রোল
          </button>
        </div>

      </div>
    `;

    this.bindEvents(isCollector, collectorRes, driverRes);
  }

  bindEvents(isCollector, collectorRes, driverRes) {
    this.container.querySelector('#btn-share').addEventListener('click', () => {
      sound.playClick();
      let shareText = '';
      if (isCollector && collectorRes) {
        shareText = `🪙 আমি 'টেম্পু স্ট্যান্ড' গেমে চাঁদাবাজ হয়ে তুলেছি ${formatTaka(collectorRes.totalExtorted)}! নেতার ১০% ঠিক দিয়ে নিজের আয় হয়েছে ${formatTaka(collectorRes.myEarnings)}! খেলুন: টেম্পু স্ট্যান্ড গেম`;
      } else {
        shareText = `🚚 আমি 'টেম্পু স্ট্যান্ড' গেমে কাওরান বাজারে সবজি পৌঁছে দিয়েছি! পথে চাঁদা দিয়েছি ${formatTaka(driverRes?.totalBribePaid || 0)}, যার ফলে সবজির প্রতি কেজিতে দাম বেড়েছে ৳${toBengaliNumber(driverRes?.priceHikePerKg || '০')}!`;
      }

      if (navigator.share) {
        navigator.share({
          title: 'টেম্পু স্ট্যান্ড - ব্যঙ্গাত্মক ব্রাউজার গেম',
          text: shareText
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareText).then(() => {
          alert('ফলাফল কপি করা হয়েছে! বন্ধুদের মেসেজে পাঠিয়ে দিন।');
        });
      }
    });

    this.container.querySelector('#btn-replay').addEventListener('click', () => {
      sound.playClick();
      if (isCollector) {
        this.engine.changeScene('collector');
      } else {
        this.engine.changeScene('driver');
      }
    });

    this.container.querySelector('#btn-switch-role').addEventListener('click', () => {
      sound.playClick();
      this.engine.changeScene('roleSelect');
    });
  }
}
