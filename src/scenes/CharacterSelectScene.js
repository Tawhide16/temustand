import { sound } from '../systems/audio.js';
import { COLLECTOR_CHARACTERS, DRIVER_CHARACTERS, TRUCK_COLORS } from '../data/characters.js';
import { generateVehicleSVG } from '../systems/utils.js';

export class CharacterSelectScene {
  constructor(engine) {
    this.engine = engine;
    this.selectedCharIndex = 0;
    this.selectedColorIndex = 0;
  }

  render(container) {
    const isCollector = this.engine.gameState.selectedRole === 'collector';
    const characters = isCollector ? COLLECTOR_CHARACTERS : DRIVER_CHARACTERS;

    container.innerHTML = `
      <div class="scene-wrapper">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #F5A623; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 800;">চরিত্র ও স্টাইল বেছে নিন</h2>
          <p style="font-size: 1.05rem; opacity: 0.9;">
            ${isCollector ? 'স্ট্যান্ডে আপনার স্টাইলিশ উপস্থিতি চূড়ান্ত করুন' : 'আপনার হাইওয়ে চালক ও ট্রাকের কালার কাস্টমাইজ করুন'}
          </p>
        </div>

        <!-- 4 Character Cards in Desktop Grid -->
        <div class="desktop-grid-4" style="margin-bottom: 20px;" id="char-grid">
          ${characters.map((c, i) => `
            <div class="char-card ${i === this.selectedCharIndex ? 'selected' : ''}" data-index="${i}" style="
              background: ${i === this.selectedCharIndex ? '#FFF8EC' : 'rgba(255,248,236,0.08)'};
              color: ${i === this.selectedCharIndex ? '#1A110B' : '#FFF8EC'};
              border: 3px solid ${i === this.selectedCharIndex ? '#F5A623' : 'rgba(255,248,236,0.18)'};
              border-radius: 16px;
              padding: 16px 14px;
              text-align: center;
              cursor: pointer;
              transition: all 0.25s ease;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ">
              <div style="font-size: 3.5rem; margin-bottom: 6px;">${c.avatarEmoji}</div>
              <div style="font-weight: 800; font-size: 1.15rem; line-height: 1.2;">${c.name}</div>
              <div style="font-size: 0.85rem; opacity: 0.85; margin-top: 4px; color: ${i === this.selectedCharIndex ? '#C8442B' : '#F5A623'}; font-weight: 600;">
                ${c.roleTitle}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Detail Preview Grid (2 columns on desktop) -->
        <div class="desktop-grid-2" style="margin-bottom: 20px;">
          
          <!-- Selected Character Detail Card -->
          <div class="card-truck-art" id="char-detail-card" style="display: flex; flex-direction: column; justify-content: center;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
              <div id="detail-emoji" style="font-size: 3.2rem;">${characters[this.selectedCharIndex].avatarEmoji}</div>
              <div>
                <h3 id="detail-name" style="color: #1A110B; font-size: 1.45rem; margin: 0; font-weight: 800;">
                  ${characters[this.selectedCharIndex].name}
                </h3>
                <span id="detail-role" style="font-size: 0.9rem; color: #C8442B; font-weight: bold;">
                  ${characters[this.selectedCharIndex].roleTitle}
                </span>
              </div>
            </div>
            
            <p id="detail-desc" style="font-size: 0.98rem; color: #333; margin-bottom: 12px; line-height: 1.5;">
              ${characters[this.selectedCharIndex].description}
            </p>
            
            <div id="detail-slogan" style="background: rgba(245,166,35,0.18); border-left: 4px solid #F5A623; padding: 8px 12px; font-style: italic; font-size: 0.92rem; color: #1A110B; font-weight: 700; border-radius: 0 8px 8px 0;">
              "${characters[this.selectedCharIndex].slogan || 'কাওরান বাজার জিন্দাবাদ!'}"
            </div>
          </div>

          <!-- If Driver: Truck Customizer; If Collector: Stand Info -->
          ${!isCollector ? `
            <div style="background: rgba(255,248,236,0.06); border: 2px solid rgba(245,166,35,0.25); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; align-items: center;">
              <div style="font-size: 1rem; font-weight: bold; margin-bottom: 10px; color: #FFF8EC;">
                🎨 ট্রাকের রঙ নির্বাচন করুন:
              </div>
              
              <div style="display: flex; gap: 14px; justify-content: center; margin-bottom: 12px;">
                ${TRUCK_COLORS.map((col, idx) => `
                  <div class="color-dot" data-colindex="${idx}" title="${col.name}" style="
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: ${col.hex};
                    border: 4px solid ${idx === this.selectedColorIndex ? '#FFF' : 'transparent'};
                    box-shadow: 0 4px 12px rgba(0,0,0,0.6);
                    cursor: pointer;
                    transform: ${idx === this.selectedColorIndex ? 'scale(1.15)' : 'scale(1)'};
                    transition: transform 0.2s ease;
                  "></div>
                `).join('')}
              </div>

              <div id="truck-preview-box" style="width: 100%; max-width: 280px; margin: 0 auto;">
                ${generateVehicleSVG('heavy_truck', TRUCK_COLORS[this.selectedColorIndex].hex, 'কাওরান বাজার এক্সপ্রেস')}
              </div>
            </div>
          ` : `
            <div style="background: rgba(255,248,236,0.06); border: 2px solid rgba(245,166,35,0.25); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; justify-content: center; gap: 12px;">
              <div style="font-size: 1.1rem; font-weight: bold; color: #F5A623;">
                📋 ফিল্ড ক্যাশিয়ার নির্দেশাবলী
              </div>
              <p style="font-size: 0.95rem; color: #DDD; line-height: 1.5; margin: 0;">
                স্ট্যান্ডে প্রতিটি গাড়ির ধরন অনুযায়ী টাকা দাবি করা হবে। সবসময় নেতার ১০% ভাগ আলাদা করে জমা দিতে ভুলবেন না। সঠিক হিসাবে ওস্তাদের সুনজর পাবেন!
              </p>
              <div style="background: rgba(63,155,91,0.15); border: 1px solid #3F9B5B; border-radius: 8px; padding: 8px 12px; font-size: 0.88rem; color: #7EE096;">
                🎓 বর্তমান শিক্ষা বোনাস: +${this.engine.gameState.education?.bonusPercent || 10}%
              </div>
            </div>
          `}

        </div>

        <!-- Actions -->
        <div style="display: flex; gap: 16px; max-width: 440px; margin: 0 auto; width: 100%;">
          <button id="btn-back" class="btn btn-secondary" style="flex: 1;">
            পেছনে
          </button>
          <button id="btn-confirm" class="btn btn-primary" style="flex: 2; font-size: 1.2rem;">
            টিউটোরিয়ালে যান ➔
          </button>
        </div>

      </div>
    `;

    // Character click handlers
    const charCards = container.querySelectorAll('.char-card');
    charCards.forEach(card => {
      card.addEventListener('click', () => {
        sound.playClick();
        this.selectedCharIndex = parseInt(card.getAttribute('data-index'), 10);
        const selected = characters[this.selectedCharIndex];

        charCards.forEach((c, idx) => {
          c.style.background = idx === this.selectedCharIndex ? '#FFF8EC' : 'rgba(255,248,236,0.08)';
          c.style.color = idx === this.selectedCharIndex ? '#1A110B' : '#FFF8EC';
          c.style.borderColor = idx === this.selectedCharIndex ? '#F5A623' : 'rgba(255,248,236,0.18)';
        });

        container.querySelector('#detail-emoji').textContent = selected.avatarEmoji;
        container.querySelector('#detail-name').textContent = selected.name;
        container.querySelector('#detail-role').textContent = selected.roleTitle;
        container.querySelector('#detail-desc').textContent = selected.description;
        container.querySelector('#detail-slogan').textContent = `"${selected.slogan || 'কাওরান বাজার জিন্দাবাদ!'}"`;
      });
    });

    // Truck color picker
    if (!isCollector) {
      const colorDots = container.querySelectorAll('.color-dot');
      colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
          sound.playClick();
          this.selectedColorIndex = parseInt(dot.getAttribute('data-colindex'), 10);
          colorDots.forEach((d, idx) => {
            d.style.borderColor = idx === this.selectedColorIndex ? '#FFF' : 'transparent';
            d.style.transform = idx === this.selectedColorIndex ? 'scale(1.15)' : 'scale(1)';
          });
          const chosenColor = TRUCK_COLORS[this.selectedColorIndex].hex;
          container.querySelector('#truck-preview-box').innerHTML = generateVehicleSVG('heavy_truck', chosenColor, 'কাওরান বাজার এক্সপ্রেস');
        });
      });
    }

    // Confirm button
    container.querySelector('#btn-confirm').addEventListener('click', () => {
      sound.playClick();
      this.engine.gameState.character = characters[this.selectedCharIndex];
      if (!isCollector) {
        this.engine.gameState.truckColor = TRUCK_COLORS[this.selectedColorIndex];
      }
      this.engine.changeScene('tutorial');
    });

    // Back button
    container.querySelector('#btn-back').addEventListener('click', () => {
      sound.playClick();
      if (isCollector) {
        this.engine.changeScene('hiring');
      } else {
        this.engine.changeScene('roleSelect');
      }
    });
  }
}
