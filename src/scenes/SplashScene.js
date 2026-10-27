import { sound } from '../systems/audio.js';
import { storage } from '../systems/storage.js';
import { toBengaliNumber, generateVehicleSVG } from '../systems/utils.js';

export class SplashScene {
  constructor(engine) {
    this.engine = engine;
  }

  render(container) {
    container.innerHTML = `
      <div class="scene-wrapper" style="justify-content: center;">
        
        <div class="desktop-grid-2" style="align-items: center; margin-bottom: 24px;">
          
          <!-- Left Column: Title & Action -->
          <div style="display: flex; flex-direction: column; justify-content: center;">
            <div style="display: inline-flex; align-items: center; gap: 8px; width: fit-content; background: #C8442B; color: #FFF8EC; font-size: 0.82rem; padding: 3px 14px; border-radius: 20px; font-weight: 700; margin-bottom: 10px; letter-spacing: 1px;">
              <span>🇧🇩</span> ব্যঙ্গাত্মক ব্রাউজার গেম
            </div>
            
            <h1 style="font-size: clamp(2.1rem, 7vw, 3.8rem); font-weight: 800; color: #F5A623; text-shadow: 0 4px 16px rgba(0,0,0,0.8), 0 0 30px rgba(245,166,35,0.4); line-height: 1.1; margin-bottom: 6px;">
              টেম্পু স্ট্যান্ড
            </h1>
            
            <p style="font-size: clamp(1rem, 3.5vw, 1.3rem); color: #FFF8EC; opacity: 0.95; font-weight: 600; margin-bottom: 10px;">
              "রাস্তা একটাই, ভাগ্য দুই রকম।"
            </p>

            <p style="font-size: 0.9rem; color: #DDD; line-height: 1.5; margin-bottom: 16px; max-width: 480px;">
              একদিকে স্ট্যান্ডের চাঁদাবাজির হিসাব আর নেতার ১০% ভাগ; অন্যদিকে হাইওয়েতে সবজিভর্তি ট্রাক নিয়ে কাওরান বাজার পৌঁছানোর লড়াই।
            </p>

            <!-- Badges -->
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 18px;">
              <span style="background: rgba(245,166,35,0.18); border: 1px solid #F5A623; color: #F5A623; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">🪙 চাঁদাবাজ ও 🚚 ট্রাক ড্রাইভার</span>
              <span style="background: rgba(63,155,91,0.18); border: 1px solid #3F9B5B; color: #3F9B5B; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">৩D গেমপ্লে</span>
              <span style="background: rgba(200,68,43,0.18); border: 1px solid #C8442B; color: #FFF8EC; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">বাংলা UI</span>
            </div>

            <!-- Start Button -->
            <div style="width: 100%; max-width: 360px;">
              <button id="btn-play" class="btn btn-primary" style="font-size: 1.25rem; padding: 14px 24px; width: 100%;">
                <span>▶</span> খেলা শুরু করুন
              </button>
            </div>
          </div>

          <!-- Right Column: Vehicle Artwork & High Score Board -->
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            
            <!-- Animated Hero Vehicle Illustration -->
            <div style="width: 100%; max-width: 400px; margin-bottom: 20px; display: flex; justify-content: center; align-items: center; background: rgba(255, 248, 236, 0.04); border: 2px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 12px 16px; min-height: 300px;" class="pulse-glow">
              <img 
                src="./tempo-hero.png" 
                alt="টেম্পু ও ওস্তাদ ড্রাইভার" 
                style="height: 285px; width: auto; max-width: 100%; object-fit: contain; filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.85)); transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);"
                onmouseover="this.style.transform='scale(1.06)'"
                onmouseout="this.style.transform='scale(1)'"
              />
            </div>

            <!-- High Scores Dashboard -->
            <div style="width: 100%; max-width: 400px; background: rgba(255,248,236,0.08); border: 2px solid rgba(245,166,35,0.3); border-radius: 14px; padding: 16px 20px;">
              <div style="font-size: 0.85rem; color: #F5A623; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px;">
                🏆 স্ট্যান্ড ও হাইওয়ে রেকর্ড বোর্ড
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px dashed rgba(255,248,236,0.15);">
                <span style="font-size: 0.95rem;">🪙 সেরা চাঁদাবাজি রেকর্ড:</span>
                <strong style="color: #F5A623; font-size: 1.15rem;">৳${toBengaliNumber(storage.data.highScoreCollector)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0;">
                <span style="font-size: 0.95rem;">🚚 সেরা ড্রাইভিং মুনাফা:</span>
                <strong style="color: #3F9B5B; font-size: 1.15rem;">৳${toBengaliNumber(storage.data.highScoreDriver)}</strong>
              </div>
            </div>

          </div>

        </div>

        <div style="border-top: 1px solid rgba(255,248,236,0.1); padding-top: 14px; text-align: center;">
          <p style="font-size: 0.8rem; opacity: 0.7; margin: 0;">
            ⚠️ এটি একটি ব্যঙ্গাত্মক গেম। কোনো বাস্তব ব্যক্তি, রাজনৈতিক দল বা সম্প্রদায়ের নাম ব্যবহার করা হয়নি। নেতা এখানে "বড় ভাই" বা "ওস্তাদ"। সিস্টেমের অসঙ্গতি তুলে ধরাই মূল উদ্দেশ্য।
          </p>
        </div>

      </div>
    `;

    const startBGMOnce = () => {
      sound.startFileBGM();
      document.removeEventListener('click', startBGMOnce);
      document.removeEventListener('keydown', startBGMOnce);
    };
    // Start BGM on very first user interaction (browser autoplay policy)
    document.addEventListener('click', startBGMOnce);
    document.addEventListener('keydown', startBGMOnce);

    container.querySelector('#btn-play').addEventListener('click', () => {
      sound.playClick();
      sound.startFileBGM(); // ensure it starts if not started yet
      sound.restoreBGMVolume(); // bring to full volume if was faded
      sound.startBGM();
      this.engine.changeScene('roleSelect');
    });
  }
}
