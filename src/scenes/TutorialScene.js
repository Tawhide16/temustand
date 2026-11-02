import { sound } from '../systems/audio.js';

export class TutorialScene {
  constructor(engine) {
    this.engine = engine;
  }

  render(container) {
    const isCollector = this.engine.gameState.selectedRole === 'collector';

    container.innerHTML = `
      <div class="scene-wrapper">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background: #F5A623; color: #1A110B; font-weight: 800; font-size: 0.85rem; padding: 4px 14px; border-radius: 14px; margin-bottom: 6px;">
            হাতেনাতে ট্রেনিং (১৫ সেকেন্ড)
          </div>
          <h2 style="color: #FFF8EC; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 800;">
            ${isCollector ? 'চাঁদা তোলার ৩টি নিয়ম' : 'হাইওয়ে ড্রাইভ ও সবজি রক্ষার ৩টি নিয়ম'}
          </h2>
          <p style="font-size: 1rem; opacity: 0.85; margin-top: 4px;">
            ${isCollector ? 'ডেস্কটপে কীবোর্ড বা মাউস দিয়ে দ্রুত হিসাব সম্পন্ন করুন' : 'ডেস্কটপে A / D বা Arrow Keys দিয়ে লেন পরিবর্তন করুন'}
          </p>
        </div>

        <!-- 3 Interactive Cards in Desktop Grid -->
        <div class="desktop-grid-3" style="margin-bottom: 28px;">
          
          ${isCollector ? `
            <!-- Collector Step 1 -->
            <div style="background: #FFF8EC; color: #1A110B; padding: 22px; border-radius: 16px; border-top: 6px solid #F5A623; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">
              <div>
                <div style="font-size: 3rem; margin-bottom: 10px;">🛑</div>
                <strong style="font-size: 1.3rem; display: block; color: #1A110B; margin-bottom: 6px;">১. গাড়ি থামান</strong>
                <p style="font-size: 0.95rem; color: #444; line-height: 1.5;">
                  রাস্তায় যেকোনো পিকআপ বা ট্রাক আসামাত্র <strong>'থামান!'</strong> বাটনে ক্লিক করুন অথবা কীবোর্ডের <span class="kbd-hint" style="color:#111; border-color:#888;">Space</span> চাপুন।
                </p>
              </div>
              <div style="margin-top: 14px; font-size: 0.82rem; background: rgba(0,0,0,0.06); padding: 6px 10px; border-radius: 6px; font-weight: 600;">
                গাড়ির সাইজ অনুযায়ী টাকা নির্ধারিত হবে
              </div>
            </div>

            <!-- Collector Step 2 -->
            <div style="background: #FFF8EC; color: #1A110B; padding: 22px; border-radius: 16px; border-top: 6px solid #C8442B; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">
              <div>
                <div style="font-size: 3rem; margin-bottom: 10px;">👑</div>
                <strong style="font-size: 1.3rem; display: block; color: #1A110B; margin-bottom: 6px;">২. নেতার ১০% ভাগ দিন</strong>
                <p style="font-size: 0.95rem; color: #444; line-height: 1.5;">
                  মোট তোলা টাকার ঠিক ১০% নেতার তহবিলে জমা করুন। <strong>'সরাসরি ১০%'</strong> বাটনে ক্লিক করতে পারেন। ১০% কম দিলে নেতা ক্ষুব্ধ হবেন!
                </p>
              </div>
              <div style="margin-top: 14px; font-size: 0.82rem; background: rgba(200,68,43,0.1); color: #C8442B; padding: 6px 10px; border-radius: 6px; font-weight: 700;">
                কম দিলে জরিমানা + সতর্কতা!
              </div>
            </div>

            <!-- Collector Step 3 -->
            <div style="background: #FFF8EC; color: #1A110B; padding: 22px; border-radius: 16px; border-top: 6px solid #3F9B5B; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">
              <div>
                <div style="font-size: 3rem; margin-bottom: 10px;">⚠️</div>
                <strong style="font-size: 1.3rem; display: block; color: #1A110B; margin-bottom: 6px;">৩. ৩ সতর্কতায় বদলি!</strong>
                <p style="font-size: 0.95rem; color: #444; line-height: 1.5;">
                  ৩ বার ভুল হিসাব দিলে কিংবা পুলিশের কাছে ধরা পড়লে নেতা আপনাকে স্ট্যান্ড থেকে বদলি করে দেবে। তবে শিক্ষা অনুযায়ী পাবেন আকর্ষণীয় বোনাস!
                </p>
              </div>
              <div style="margin-top: 14px; font-size: 0.82rem; background: rgba(63,155,91,0.1); color: #2E7944; padding: 6px 10px; border-radius: 6px; font-weight: 700;">
                পুলিশের টহল দেখলে দ্রুত লুকিয়ে পড়ুন
              </div>
            </div>
          ` : `
            <!-- Driver Step 1 -->
            <div style="background: #FFF8EC; color: #1A110B; padding: 22px; border-radius: 16px; border-top: 6px solid #2E86AB; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">
              <div>
                <div style="font-size: 3rem; margin-bottom: 10px;">⚡</div>
                <strong style="font-size: 1.3rem; display: block; color: #1A110B; margin-bottom: 6px;">১. এক্সিলারেশন ও ব্রেক</strong>
                <p style="font-size: 0.95rem; color: #444; line-height: 1.5;">
                  গাড়ি চালাতে কীবোর্ডের <span class="kbd-hint" style="color:#111; border-color:#888;">W</span> বা <span class="kbd-hint" style="color:#111; border-color:#888;">⬆️</span> চেপে রাখুন অথবা <strong>RACE</strong> প্যাডেল চাপুন। ব্রেক বা রিভার্সে <span class="kbd-hint" style="color:#111; border-color:#888;">S</span> / <span class="kbd-hint" style="color:#111; border-color:#888;">⬇️</span>।
                </p>
              </div>
              <div style="margin-top: 14px; font-size: 0.82rem; background: rgba(0,0,0,0.06); padding: 6px 10px; border-radius: 6px; font-weight: 600;">
                Shift চাপলে টার্বো স্পিড বুস্ট পাবেন
              </div>
            </div>

            <!-- Driver Step 2 -->
            <div style="background: #FFF8EC; color: #1A110B; padding: 22px; border-radius: 16px; border-top: 6px solid #F5A623; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">
              <div>
                <div style="font-size: 3rem; margin-bottom: 10px;">🛞</div>
                <strong style="font-size: 1.3rem; display: block; color: #1A110B; margin-bottom: 6px;">২. স্টিয়ারিং হুইল</strong>
                <p style="font-size: 0.95rem; color: #444; line-height: 1.5;">
                  কীবোর্ডের <span class="kbd-hint" style="color:#111; border-color:#888;">A</span> ও <span class="kbd-hint" style="color:#111; border-color:#888;">D</span> অথবা বাঁয়ে-ডানে তীর কী চাপুন। চাইলে স্ক্রিনের স্টিয়ারিং হুইলও মাউস দিয়ে ঘোরাতে পারেন।
                </p>
              </div>
              <div style="margin-top: 14px; font-size: 0.82rem; background: rgba(245,166,35,0.15); color: #B37107; padding: 6px 10px; border-radius: 6px; font-weight: 700;">
                রাস্তার বাইরে কাঁচা মাটিতে নামলে গতি কমবে!
              </div>
            </div>

            <!-- Driver Step 3 -->
            <div style="background: #FFF8EC; color: #1A110B; padding: 22px; border-radius: 16px; border-top: 6px solid #3F9B5B; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">
              <div>
                <div style="font-size: 3rem; margin-bottom: 10px;">🏁</div>
                <strong style="font-size: 1.3rem; display: block; color: #1A110B; margin-bottom: 6px;">৩. ৫টি চেকপয়েন্ট ও ফিনিশ</strong>
                <p style="font-size: 0.95rem; color: #444; line-height: 1.5;">
                  মিনি-ম্যাপ ও নিয়ন হলুদ অ্যারো পথ নির্দেশ করবে। ধানক্ষেত, পুকুরপাড় ও টং দোকান পেরিয়ে ৫টি চেকপয়েন্ট পাড়ি দিয়ে বিজয় ফটকে পৌঁছান!
                </p>
              </div>
              <div style="margin-top: 14px; font-size: 0.82rem; background: rgba(63,155,91,0.1); color: #2E7944; padding: 6px 10px; border-radius: 6px; font-weight: 700;">
                Space চাপলে হর্ন বাজবে, ESC চাপলে পজ
              </div>
            </div>
          `}

        </div>

        <!-- Big Start Action Button -->
        <div style="max-width: 360px; margin: 0 auto; width: 100%;">
          <button id="btn-start-game" class="btn btn-primary" style="font-size: 1.35rem; width: 100%;">
            বুঝতে পেরেছি, খেলা শুরু হোক! ➔
          </button>
        </div>

      </div>
    `;

    container.querySelector('#btn-start-game').addEventListener('click', () => {
      sound.playClick();
      if (isCollector) {
        this.engine.changeScene('collector');
      } else {
        this.engine.changeScene('driver');
      }
    });
  }
}
