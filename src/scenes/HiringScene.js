import { sound } from '../systems/audio.js';
import { EDUCATION_TIERS } from '../data/bonusTable.js';

export class HiringScene {
  constructor(engine) {
    this.engine = engine;
  }

  render(container) {
    container.innerHTML = `
      <div class="scene-wrapper">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; font-size: 0.9rem; color: #F5A623; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
            নিয়োগ প্রক্রিয়া (চাঁদাবাজ উইং)
          </div>
          <h2 style="color: #FFF8EC; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 800;">
            আপনার শিক্ষাগত যোগ্যতা নির্বাচন করুন
          </h2>
          <p style="font-size: 1.05rem; opacity: 0.85; margin-top: 4px; max-width: 600px; margin-left: auto; margin-right: auto;">
            সতর্কতা: বেশি শিক্ষিত হলে নেতার অর্ডার মানতে কষ্ট হতে পারে! কম শিক্ষায় বেশি বোনাস!
          </p>
        </div>

        <!-- 2x2 Grid of Education Tiers on Desktop -->
        <div class="desktop-grid-2" style="margin-bottom: 24px;">
          ${EDUCATION_TIERS.map(tier => `
            <div class="tier-card" data-id="${tier.id}" style="
              background: ${tier.accepted ? '#FFF8EC' : '#FFEBEB'};
              color: #1A110B;
              padding: 20px 22px;
              border-radius: 14px;
              cursor: pointer;
              border: 3px solid ${tier.accepted ? '#F5A623' : '#C8442B'};
              transition: all 0.25s ease;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              gap: 12px;
              box-shadow: 0 6px 16px rgba(0,0,0,0.25);
            ">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                <div>
                  <div style="font-weight: 800; font-size: 1.35rem; color: #1A110B;">${tier.title}</div>
                  <div style="font-size: 0.92rem; color: #444; margin-top: 4px; line-height: 1.4;">${tier.comment}</div>
                </div>
                <span style="
                  display: inline-block;
                  font-size: 0.9rem;
                  font-weight: bold;
                  padding: 4px 10px;
                  border-radius: 8px;
                  background: ${tier.accepted ? '#3F9B5B' : '#C8442B'};
                  color: #FFF;
                  white-space: nowrap;
                ">
                  ${tier.badgeText}
                </span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; color: #666; border-top: 1px dashed rgba(0,0,0,0.15); padding-top: 8px;">
                <span>${tier.accepted ? '✅ নিয়োগযোগ্য' : '❌ সরাসরি অযোগ্য'}</span>
                <strong style="color: ${tier.accepted ? '#F5A623' : '#C8442B'}; font-size: 1rem;">
                  ${tier.accepted ? 'নির্বাচন করতে ক্লিক করুন ➔' : 'শর্ত লঙ্ঘন'}
                </strong>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Back Button -->
        <div style="max-width: 220px; margin: 0 auto; width: 100%;">
          <button id="btn-back" class="btn btn-secondary" style="width: 100%;">
            <span>⬅</span> রোল বাছাইয়ে ফিরে যান
          </button>
        </div>

      </div>

      <!-- Rejection Modal for HSC+ -->
      <div id="rejection-modal" class="modal-overlay">
        <div class="modal-dialog">
          <div style="font-size: 3.2rem; margin-bottom: 10px;">❌📜❌</div>
          <h3 style="color: #C8442B; font-size: 1.6rem; margin-bottom: 8px;">আবেদন সরাসরি বাতিল!</h3>
          <p style="font-size: 1rem; color: #333; line-height: 1.5; margin-bottom: 16px;">
            "আপনি বেশি শিক্ষিত! নেতা নিজেই এই পর্যন্ত পড়তে পারেননি। নেতার চেয়ে বেশি জানলে স্ট্যান্ডে গণ্ডগোল লাগাবেন!"
          </p>
          <div style="background: rgba(200,68,43,0.1); padding: 10px; border-radius: 8px; font-size: 0.9rem; color: #8B2010; margin-bottom: 20px;">
            💡 <strong>পরামর্শ:</strong> কম শিক্ষিত অপশন বেছে নিন এবং স্ট্যান্ডে বেশি বোনাস উপভোগ করুন!
          </div>
          <button id="btn-retry-hiring" class="btn btn-accent" style="width: 100%;">
            পুনরায় যোগ্যতা নির্বাচন করুন
          </button>
        </div>
      </div>
    `;

    // Handle clicks
    container.querySelectorAll('.tier-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const tier = EDUCATION_TIERS.find(t => t.id === id);

        if (!tier.accepted) {
          sound.playBuzzer();
          sound.vibrate(120);
          container.querySelector('#rejection-modal').classList.add('active');
        } else {
          sound.playCoin();
          this.engine.gameState.education = tier;
          this.engine.changeScene('characterSelect');
        }
      });
    });

    // Modal Close
    container.querySelector('#btn-retry-hiring').addEventListener('click', () => {
      sound.playClick();
      container.querySelector('#rejection-modal').classList.remove('active');
    });

    // Back
    container.querySelector('#btn-back').addEventListener('click', () => {
      sound.playClick();
      this.engine.changeScene('roleSelect');
    });
  }
}
