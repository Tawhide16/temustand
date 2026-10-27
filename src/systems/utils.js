// Utility functions for Bengali formatting, math, and procedural art

export function toBengaliNumber(num) {
  if (num === null || num === undefined) return '০';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const str = Math.round(num).toString();
  return str.replace(/\d/g, d => bnDigits[parseInt(d, 10)]);
}

export function formatTaka(amount) {
  return `৳${toBengaliNumber(amount)}`;
}

// Procedural SVG Generator for Bangladeshi Vehicles
export function generateVehicleSVG(type, color = '#F5A623', truckArtDetail = 'মা-বাবার দোয়া') {
  switch (type) {
    case 'tempo':
      return `
        <img 
          src="./tempo-hero.png" 
          class="vehicle-svg" 
          alt="টেম্পু সার্ভিস" 
          style="max-height: 200px; width: auto; object-fit: contain; margin: 0 auto; display: block; filter: drop-shadow(0 6px 14px rgba(0,0,0,0.6));"
        />
      `;

    case 'pickup':
      return `
        <svg viewBox="0 0 180 110" class="vehicle-svg">
          <!-- Vegetables / Produce Load -->
          <circle cx="110" cy="38" r="14" fill="#3F9B5B"/>
          <circle cx="130" cy="35" r="16" fill="#52B788"/>
          <circle cx="150" cy="40" r="12" fill="#2D6A4F"/>
          <circle cx="120" cy="28" r="11" fill="#74C69D"/>
          <circle cx="140" cy="26" r="13" fill="#3F9B5B"/>
          <!-- Cargo bed -->
          <rect x="85" y="42" width="85" height="40" rx="3" fill="#C8442B" stroke="#1A110B" stroke-width="3"/>
          <line x1="85" y1="55" x2="170" y2="55" stroke="#FFF8EC" stroke-width="2"/>
          <!-- Cabin -->
          <path d="M 15 82 L 15 55 Q 20 40 40 40 L 85 40 L 85 82 Z" fill="${color}" stroke="#1A110B" stroke-width="3"/>
          <!-- Windshield -->
          <path d="M 25 55 L 42 45 L 75 45 L 75 55 Z" fill="#8CE0FF" stroke="#1A110B" stroke-width="2"/>
          <!-- Art Text -->
          <text x="127" y="68" font-family="'Hind Siliguri', sans-serif" font-size="10" font-weight="bold" fill="#FFF8EC" text-anchor="middle">${truckArtDetail}</text>
          <!-- Mudflap -->
          <rect x="155" y="80" width="12" height="15" fill="#1A110B"/>
          <!-- Wheels -->
          <circle cx="50" cy="85" r="15" fill="#1A110B"/>
          <circle cx="50" cy="85" r="7" fill="#AAA"/>
          <circle cx="140" cy="85" r="15" fill="#1A110B"/>
          <circle cx="140" cy="85" r="7" fill="#AAA"/>
          <!-- Headlight -->
          <circle cx="18" cy="68" r="4" fill="#FFF" stroke="#F5A623" stroke-width="2"/>
        </svg>
      `;

    case 'heavy_truck':
    default:
      return `
        <svg viewBox="0 0 220 120" class="vehicle-svg">
          <!-- High Wooden Cargo Body -->
          <rect x="90" y="15" width="120" height="75" rx="5" fill="#1F6E8C" stroke="#1A110B" stroke-width="3"/>
          <!-- Traditional Horizontal Truck Slats -->
          <rect x="90" y="25" width="120" height="8" fill="#F5A623"/>
          <rect x="90" y="42" width="120" height="8" fill="#C8442B"/>
          <rect x="90" y="59" width="120" height="8" fill="#3F9B5B"/>
          <!-- Truck Art Slogan -->
          <text x="150" y="50" font-family="'Hind Siliguri', sans-serif" font-size="12" font-weight="bold" fill="#FFF8EC" text-anchor="middle">${truckArtDetail}</text>
          <text x="150" y="78" font-family="'Hind Siliguri', sans-serif" font-size="9" fill="#FFF8EC" text-anchor="middle">১০০ হাত দূরে থাকুন</text>
          <!-- Heavy Cabin -->
          <path d="M 15 90 L 15 50 Q 25 30 50 30 L 90 30 L 90 90 Z" fill="${color}" stroke="#1A110B" stroke-width="3"/>
          <!-- Big Visor/Crown on Cabin -->
          <path d="M 12 48 L 5 44 L 5 36 L 50 24 L 92 24 L 92 30 Z" fill="#C8442B" stroke="#1A110B" stroke-width="2"/>
          <!-- Windshield & Mirror -->
          <path d="M 28 50 L 48 38 L 82 38 L 82 50 Z" fill="#8CE0FF" stroke="#1A110B" stroke-width="2"/>
          <rect x="6" y="48" width="5" height="12" rx="1" fill="#1A110B"/>
          <!-- Chrome Bumper -->
          <rect x="8" y="82" width="20" height="8" rx="2" fill="#E0E0E0" stroke="#1A110B" stroke-width="2"/>
          <!-- Mudflap -->
          <rect x="195" y="85" width="15" height="20" fill="#1A110B"/>
          <circle cx="202" cy="98" r="3" fill="#C8442B"/>
          <!-- Triple Wheels -->
          <circle cx="50" cy="94" r="16" fill="#1A110B"/>
          <circle cx="50" cy="94" r="7" fill="#C8442B"/>
          <circle cx="130" cy="94" r="16" fill="#1A110B"/>
          <circle cx="130" cy="94" r="7" fill="#DDD"/>
          <circle cx="170" cy="94" r="16" fill="#1A110B"/>
          <circle cx="170" cy="94" r="7" fill="#DDD"/>
          <!-- Dual Headlights -->
          <circle cx="18" cy="74" r="4" fill="#FFF" stroke="#F5A623" stroke-width="2"/>
        </svg>
      `;
  }
}

// Procedural Top-Down Truck Renderer for Highway Runner
export function drawTopDownTruck(ctx, x, y, width, height, color = '#F5A623', truckName = 'আলুর চালান') {
  ctx.save();
  ctx.translate(x, y);

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.roundRect(-width / 2 + 6, -height / 2 + 8, width, height, 8);
  ctx.fill();

  // Wheels (4 or 6)
  ctx.fillStyle = '#111';
  ctx.fillRect(-width / 2 - 4, -height / 2 + 15, 6, 18);
  ctx.fillRect(width / 2 - 2, -height / 2 + 15, 6, 18);
  ctx.fillRect(-width / 2 - 4, height / 2 - 35, 6, 22);
  ctx.fillRect(width / 2 - 2, height / 2 - 35, 6, 22);

  // Main Truck Body / Cargo Bed
  ctx.fillStyle = '#1E3D59';
  ctx.strokeStyle = '#1A110B';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-width / 2, -height / 2 + 35, width, height - 35, 6);
  ctx.fill();
  ctx.stroke();

  // Vegetables / Cargo interior
  ctx.fillStyle = '#3F9B5B';
  ctx.beginPath();
  ctx.roundRect(-width / 2 + 4, -height / 2 + 40, width - 8, height - 46, 4);
  ctx.fill();

  // Vegetable sacks pattern
  ctx.fillStyle = '#2D6A4F';
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 2; col++) {
      ctx.beginPath();
      ctx.ellipse(-width / 4 + col * (width / 2), -height / 2 + 55 + row * 22, 10, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Front Cabin
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(-width / 2, -height / 2, width, 40, [8, 8, 3, 3]);
  ctx.fill();
  ctx.stroke();

  // Windshield
  ctx.fillStyle = '#8CE0FF';
  ctx.beginPath();
  ctx.roundRect(-width / 2 + 6, -height / 2 + 10, width - 12, 14, 3);
  ctx.fill();
  ctx.stroke();

  // Headlights
  ctx.fillStyle = '#FFF8EC';
  ctx.fillRect(-width / 2 + 3, -height / 2 - 2, 8, 4);
  ctx.fillRect(width / 2 - 11, -height / 2 - 2, 8, 4);

  // Truck Art Banner on roof
  ctx.fillStyle = '#C8442B';
  ctx.fillRect(-width / 2 + 4, -height / 2 + 28, width - 8, 8);

  ctx.restore();
}
