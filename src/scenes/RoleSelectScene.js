import { sound } from '../systems/audio.js';

export class RoleSelectScene {
  constructor(engine) {
    this.engine = engine;
  }

  render(container) {
    container.innerHTML = `
      <div class="scene-wrapper">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #F5A623; font-size: clamp(2rem, 3.5vw, 2.6rem); font-weight: 800; line-height: 1.2;">
            আপনার ভূমিকা নির্বাচন করুন
          </h2>
          <p style="font-size: 1.1rem; opacity: 0.9; margin-top: 6px;">
            রাস্তা একটাই, কিন্তু দুই দিকের জীবন সম্পূর্ণ বিপরীত! আপনি কোন ভূমিকায় নামবেন?
          </p>
        </div>

        <!-- Role Cards Grid (Desktop 2-columns side by side) -->
        <div class="desktop-grid-2" style="margin-bottom: 24px;">
          
          <!-- Role 1: চাঁদাবাজ Card -->
          <div id="card-collector" class="card-truck-art" style="cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <span style="font-size: 3rem;">🪙</span>
                  <div>
                    <h3 style="font-size: 1.85rem; color: #1A110B; margin: 0; line-height: 1.1; font-weight: 800;">চাঁদাবাজ</h3>
                    <span style="font-size: 0.85rem; background: #C8442B; color: #FFF8EC; padding: 2px 10px; border-radius: 6px; font-weight: bold;">ট্যাপ ও দ্রুত হিসাবের গেম</span>
                  </div>
                </div>
                <span style="font-size: 2rem; color: #F5A623;">➔</span>
              </div>

              <p style="font-size: 1.05rem; color: #222; margin-bottom: 16px; line-height: 1.5;">
                স্ট্যান্ডে দাঁড়িয়ে বিভিন্ন সাইজের ট্রাক ও পিকআপ থামান। ধার্যকৃত চাঁদা আদায় করুন এবং নেতার সঠিক ১০% ভাগ তহবিলে জমা দিয়ে নিজের পকেট ভরুন!
              </p>

              <div style="background: rgba(0,0,0,0.06); padding: 12px 16px; border-radius: 10px; font-size: 0.92rem; color: #111; line-height: 1.6; margin-bottom: 16px;">
                <div>⚡ <strong>কোর মেকানিক:</strong> নেতার ঠিক ১০% হিসাব করা</div>
                <div>⚠️ <strong>চাপ:</strong> ৩টি ভুল হিসাবে স্ট্যান্ড থেকে বদলি!</div>
                <div>📜 <strong>যোগ্যতা:</strong> সর্বোচ্চ SSC পাস (বেশি শিক্ষিত হলে বাতিল!)</div>
              </div>
            </div>

            <button class="btn btn-primary" style="width: 100%; pointer-events: none;">
              চাঁদাবাজ হিসেবে খেলুন ➔
            </button>
          </div>

          <!-- Role 2: ট্রাক ড্রাইভার Card -->
          <div id="card-driver" class="card-truck-art" style="border-color: #3F9B5B; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <span style="font-size: 3rem;">🛺</span>
                  <div>
                    <h3 style="font-size: 1.85rem; color: #1A110B; margin: 0; line-height: 1.1; font-weight: 800;">টেম্পো / ড্রাইভার</h3>
                    <span style="font-size: 0.85rem; background: #3F9B5B; color: #FFF8EC; padding: 2px 10px; border-radius: 6px; font-weight: bold;">3D ভিলেজ সিমুলেটর</span>
                  </div>
                </div>
                <span style="font-size: 2rem; color: #3F9B5B;">➔</span>
              </div>

              <p style="font-size: 1.05rem; color: #222; margin-bottom: 16px; line-height: 1.5;">
                সবুজ ধানক্ষেত, পুকুরপাড়, টং দোকান ও বাঁশের বেড়ার মনোরম গ্রামবাংলায় ঐতিহ্যবাহী সবুজ টেম্পো/ই-রিকশা চালান! প্রফেশনাল স্পিডোমিটার, মিনিম্যাপ ও চেকপয়েন্ট।
              </p>

              <div style="background: rgba(0,0,0,0.06); padding: 12px 16px; border-radius: 10px; font-size: 0.92rem; color: #111; line-height: 1.6; margin-bottom: 16px;">
                <div>🎮 <strong>কোর কন্ট্রোল:</strong> W / A / S / D স্টিয়ারিং ও স্পিডোমিটার</div>
                <div>📍 <strong>অভিযান:</strong> ৫টি চেকপয়েন্ট অতিক্রম করে বিজয় ফটকে পৌঁছানো</div>
                <div>✨ <strong>ভিজ্যুয়াল:</strong> খাঁটি দেশি রিকশা আর্ট ও গ্রাম্য পরিবেশ</div>
              </div>
            </div>

            <button class="btn btn-green" style="width: 100%; pointer-events: none;">
              টেম্পো ড্রাইভার হিসেবে খেলুন ➔
            </button>
          </div>

        </div>

        <!-- Back Button -->
        <div style="max-width: 220px; margin: 0 auto; width: 100%;">
          <button id="btn-back" class="btn btn-secondary" style="width: 100%;">
            <span>⬅</span> প্রধান মেনু
          </button>
        </div>

      </div>
    `;

    container.querySelector('#card-collector').addEventListener('click', () => {
      sound.playClick();
      this.engine.gameState.selectedRole = 'collector';
      this.engine.changeScene('hiring');
    });

    container.querySelector('#card-driver').addEventListener('click', () => {
      sound.playClick();
      this.engine.gameState.selectedRole = 'driver';
      this.engine.changeScene('characterSelect');
    });

    container.querySelector('#btn-back').addEventListener('click', () => {
      sound.playClick();
      this.engine.changeScene('splash');
    });
  }
}
