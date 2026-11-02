import * as THREE from 'three';

// Procedural Canvas Texture Generator for Authentic Bangladeshi Truck Art & Environment

export function createTailgateTexture(slogan = 'হর্ন দিন', subText = 'সাবধানে চালান') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Background Wood Planks
  ctx.fillStyle = '#C8442B';
  ctx.fillRect(0, 0, 512, 512);

  // Decorative border
  ctx.strokeStyle = '#F5A623';
  ctx.lineWidth = 16;
  ctx.strokeRect(12, 12, 488, 488);

  ctx.strokeStyle = '#3F9B5B';
  ctx.lineWidth = 8;
  ctx.strokeRect(26, 26, 460, 460);

  // Inner banner
  ctx.fillStyle = '#FFF8EC';
  ctx.fillRect(40, 100, 432, 280);
  ctx.strokeStyle = '#1A110B';
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 100, 432, 280);

  // Bangladeshi Traditional Truck Art Floral Motifs (Top corners)
  ctx.fillStyle = '#3F9B5B';
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.arc(80 + i * 58, 65, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = i % 2 === 0 ? '#F5A623' : '#3F9B5B';
  }

  // Calligraphy Texts
  ctx.textAlign = 'center';
  ctx.fillStyle = '#C8442B';
  ctx.font = 'bold 54px "Hind Siliguri", sans-serif';
  ctx.fillText(slogan, 256, 190);

  ctx.fillStyle = '#1A110B';
  ctx.font = 'bold 36px "Hind Siliguri", sans-serif';
  ctx.fillText(subText, 256, 255);

  ctx.fillStyle = '#2E86AB';
  ctx.font = 'bold 26px "Hind Siliguri", sans-serif';
  ctx.fillText('ঢাকা মেট্রো-ট ১১-৫৬৭৮', 256, 320);

  // Bottom Truck Art Warnings
  ctx.fillStyle = '#FFF8EC';
  ctx.font = 'bold 30px "Hind Siliguri", sans-serif';
  ctx.fillText('১০০ হাত দূরে থাকুন', 256, 440);

  // Small Stars
  ctx.fillStyle = '#F5A623';
  ctx.font = '28px sans-serif';
  ctx.fillText('★ মা-বাবার দোয়া ★', 256, 475);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createWoodSlatsTexture(primaryColor = '#F5A623') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Striped colorful truck slats
  ctx.fillStyle = '#1F6E8C';
  ctx.fillRect(0, 0, 512, 256);

  const stripes = ['#F5A623', '#C8442B', '#3F9B5B', '#FFF8EC'];
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = stripes[i];
    ctx.fillRect(0, i * 64 + 10, 512, 24);
    // Wood grain lines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, i * 64 + 34, 512, 6);
  }

  // Truck Art Vines / Floral stencil
  ctx.fillStyle = '#FFF8EC';
  ctx.font = 'bold 28px "Hind Siliguri", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('কাওরান বাজার এক্সপ্রেস', 256, 150);

  return new THREE.CanvasTexture(canvas);
}

export function createRoadTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Asphalt
  ctx.fillStyle = '#2B2623';
  ctx.fillRect(0, 0, 512, 512);

  // Road grit / noise
  for (let i = 0; i < 2000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#1F1B18' : '#38322E';
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  // Yellow road edge curbs
  ctx.fillStyle = '#F5A623';
  ctx.fillRect(0, 0, 24, 512);
  ctx.fillRect(488, 0, 24, 512);

  // Broken lane dividers
  ctx.fillStyle = '#F5A623';
  const lane1 = 170;
  const lane2 = 342;
  for (let y = 30; y < 512; y += 120) {
    ctx.fillRect(lane1 - 4, y, 8, 60);
    ctx.fillRect(lane2 - 4, y, 8, 60);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createBarrierTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Red and White diagonal safety stripes
  ctx.fillStyle = '#FFF8EC';
  ctx.fillRect(0, 0, 256, 64);

  ctx.fillStyle = '#C8442B';
  for (let x = -64; x < 256; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 24, 0);
    ctx.lineTo(x + 50, 64);
    ctx.lineTo(x + 26, 64);
    ctx.closePath();
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 🏛️ Jatiya Sangsad Bhaban (National Parliament) Concrete with Geometric Cutout Motifs
export function createParliamentTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Monumental Louis Kahn off-white/grey architectural concrete
  ctx.fillStyle = '#B8B2A8';
  ctx.fillRect(0, 0, 512, 512);

  // Formwork seams (horizontal & vertical concrete board lines)
  ctx.strokeStyle = '#9D978E';
  ctx.lineWidth = 2;
  for (let y = 0; y < 512; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }
  for (let x = 0; x < 512; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  // Authentic circular cutout light-wells (Kahn's signature)
  ctx.fillStyle = '#1D1A17';
  ctx.beginPath();
  ctx.arc(128, 160, 48, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(384, 160, 48, 0, Math.PI * 2);
  ctx.fill();

  // Triangular cutouts
  ctx.beginPath();
  ctx.moveTo(256, 260);
  ctx.lineTo(192, 380);
  ctx.lineTo(320, 380);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 🏫 Curzon Hall, Dhaka University - Mughal Gothic Crimson Red Brickwork
export function createCurzonHallTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep heritage crimson terracotta brick
  ctx.fillStyle = '#8B261E';
  ctx.fillRect(0, 0, 512, 512);

  // Brick rows
  ctx.strokeStyle = '#D9A39A';
  ctx.lineWidth = 2;
  const brickH = 16;
  const brickW = 40;
  for (let y = 0; y < 512; y += brickH) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
    const offset = (y / brickH) % 2 === 0 ? 0 : brickW / 2;
    for (let x = offset; x < 512; x += brickW) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + brickH);
      ctx.stroke();
    }
  }

  // Decorative Mughal horseshoe arch windows in white sandstone trim
  const drawArch = (cx, cy, w, h) => {
    ctx.fillStyle = '#FFF8EC';
    ctx.beginPath();
    ctx.arc(cx, cy - h / 4, w / 2, Math.PI, 0);
    ctx.lineTo(cx + w / 2, cy + h / 2);
    ctx.lineTo(cx - w / 2, cy + h / 2);
    ctx.closePath();
    ctx.fill();

    // Inner dark window glass
    ctx.fillStyle = '#1A2833';
    ctx.beginPath();
    ctx.arc(cx, cy - h / 4, w / 2 - 8, Math.PI, 0);
    ctx.lineTo(cx + w / 2 - 8, cy + h / 2 - 8);
    ctx.lineTo(cx - w / 2 + 8, cy + h / 2 - 8);
    ctx.closePath();
    ctx.fill();
  };

  drawArch(128, 240, 70, 110);
  drawArch(256, 240, 70, 110);
  drawArch(384, 240, 70, 110);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 🚇 Dhaka Metro Rail (MRT Line-6) Green & Silver Train Livery
export function createMetroTrainTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Stainless steel body
  ctx.fillStyle = '#D4D8DD';
  ctx.fillRect(0, 0, 512, 128);

  // Iconic Green MRT Band
  ctx.fillStyle = '#007A3D';
  ctx.fillRect(0, 28, 512, 22);

  // Red accent line
  ctx.fillStyle = '#DA291C';
  ctx.fillRect(0, 50, 512, 6);

  // Windows
  ctx.fillStyle = '#1B2A38';
  for (let x = 30; x < 480; x += 75) {
    ctx.fillRect(x, 62, 55, 38);
    // Silver window frame
    ctx.strokeStyle = '#AAB2BD';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, 62, 55, 38);
  }

  // Metro Rail Logo and Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px "Hind Siliguri", sans-serif';
  ctx.fillText('ঢাকা মেট্রোরেল MRT Line-6', 60, 20);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 🚇 Karnaphuli Tunnel (বঙ্গবন্ধু টানেল) Illuminated Ceramic Wall Tiles & Strips
export function createTunnelTileTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Concrete dark tunnel base
  ctx.fillStyle = '#25292D';
  ctx.fillRect(0, 0, 512, 512);

  // White enamel ceramic tile acoustic wall
  ctx.fillStyle = '#E8ECEF';
  ctx.fillRect(0, 160, 512, 200);

  // Tile grout grid
  ctx.strokeStyle = '#B0B8C0';
  ctx.lineWidth = 2;
  for (let y = 160; y <= 360; y += 25) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }
  for (let x = 0; x < 512; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 160);
    ctx.lineTo(x, 360);
    ctx.stroke();
  }

  // Cyan & Amber luminous LED guidance band
  ctx.fillStyle = '#00E5FF';
  ctx.fillRect(0, 150, 512, 10);

  ctx.fillStyle = '#FFAE00';
  ctx.fillRect(0, 360, 512, 14);

  // Tunnel Emergency sign
  ctx.fillStyle = '#009944';
  ctx.fillRect(180, 210, 152, 45);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px "Hind Siliguri", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('জরুরি বহির্গমন ➔', 256, 238);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 🌊 Padma River Dynamic Water Texture
export function createWaterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // River water gradient
  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, '#1E4D6B');
  grad.addColorStop(0.5, '#2B6E96');
  grad.addColorStop(1, '#1A435E');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Wave ripple highlights
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 14; i++) {
    const y = i * 20 + 5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(64, y - 6, 128, y + 6, 192, y - 4);
    ctx.bezierCurveTo(220, y + 4, 240, y - 2, 256, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// ✈️ Airport Runway with Touchdown Markers & Edge Strips
export function createAirportRunwayTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Dark asphalt runway
  ctx.fillStyle = '#1C1E20';
  ctx.fillRect(0, 0, 512, 512);

  // Runway white side stripes
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(20, 0, 10, 512);
  ctx.fillRect(482, 0, 10, 512);

  // Centerline dashed runway strip
  for (let y = 20; y < 512; y += 100) {
    ctx.fillRect(246, y, 20, 60);
  }

  // Touchdown zone bars
  for (let y = 60; y < 512; y += 220) {
    ctx.fillRect(80, y, 40, 80);
    ctx.fillRect(140, y, 40, 80);
    ctx.fillRect(332, y, 40, 80);
    ctx.fillRect(392, y, 40, 80);
  }

  // Runway threshold number "14L"
  ctx.font = 'bold 64px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('14L', 256, 470);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// ✈️ Biman Bangladesh Airlines Livery (White, Forest Green & Red Sun)
export function createBimanLiveryTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // White fuselage
  ctx.fillStyle = '#F8F9FA';
  ctx.fillRect(0, 0, 512, 256);

  // Green belly and tail sweep
  ctx.fillStyle = '#006A4E';
  ctx.beginPath();
  ctx.moveTo(0, 170);
  ctx.lineTo(512, 170);
  ctx.lineTo(512, 256);
  ctx.lineTo(0, 256);
  ctx.closePath();
  ctx.fill();

  // Biman Red Circle Motif on Tail
  ctx.fillStyle = '#F42A41';
  ctx.beginPath();
  ctx.arc(430, 80, 42, 0, Math.PI * 2);
  ctx.fill();

  // Cockpit & Passenger windows
  ctx.fillStyle = '#1D2A3A';
  for (let x = 40; x < 380; x += 22) {
    ctx.fillRect(x, 110, 12, 16);
  }

  // Bengali title
  ctx.fillStyle = '#006A4E';
  ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
  ctx.fillText('বিমান বাংলাদেশ এয়ারলাইন্স', 70, 90);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 🛣️ Realistic Bangladeshi Road Billboard with Bangla Signage
export function createBanglaBillboardTexture(title, subtitle = '', theme = 'padma') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  let bg = '#1F6E8C';
  let accent = '#F5A623';

  if (theme === 'padma') {
    bg = '#0B3C5D';
    accent = '#F5A623';
  } else if (theme === 'nuclear') {
    bg = '#2A3B1F';
    accent = '#7ED321';
  } else if (theme === 'metro') {
    bg = '#004D26';
    accent = '#FFD700';
  } else if (theme === 'parliament') {
    bg = '#4A2A18';
    accent = '#E5A93C';
  } else if (theme === 'airport') {
    bg = '#0F2A4A';
    accent = '#00E5FF';
  }

  // Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 256);

  // Frame border
  ctx.strokeStyle = accent;
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, 500, 244);

  // Header band
  ctx.fillStyle = accent;
  ctx.fillRect(12, 12, 488, 48);

  ctx.fillStyle = '#1A110B';
  ctx.font = 'bold 26px "Hind Siliguri", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('গণপ্রজাতন্ত্রী বাংলাদেশ সরকার', 256, 44);

  // Main Landmark Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 44px "Hind Siliguri", sans-serif';
  ctx.fillText(title, 256, 135);

  // Subtitle
  if (subtitle) {
    ctx.fillStyle = '#FFDD80';
    ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
    ctx.fillText(subtitle, 256, 185);
  }

  // Bottom slogan
  ctx.fillStyle = '#E0E0E0';
  ctx.font = '18px "Hind Siliguri", sans-serif';
  ctx.fillText('গতিসীমা মেনে চলুন • নিরাপদ যাত্রা', 256, 230);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// =========================================================================
// 🛺 AUTHENTIC BANGLADESHI E-RICKSHAW / TEMPO ART TEXTURE (MATCHING REFERENCE)
// =========================================================================
export function createRickshawArtBackTexture(primaryColor = '#0E7C3A') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // 1. Rich Deep Green Metal Base
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, 512, 512);

  // 2. Ornate Bangladeshi Rickshaw Folk Borders (Outer Golden Frame)
  ctx.strokeStyle = '#F5A623';
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, 492, 492);

  ctx.strokeStyle = '#E02424';
  ctx.lineWidth = 6;
  ctx.strokeRect(22, 22, 468, 468);

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, 456, 456);

  // Top Folk Art Decorative Triangles (Yellow/Red Scallop pattern)
  const scallopCount = 14;
  const scallopWidth = 456 / scallopCount;
  for (let i = 0; i < scallopCount; i++) {
    const sx = 28 + i * scallopWidth;
    ctx.fillStyle = i % 2 === 0 ? '#FFD700' : '#E02424';
    ctx.beginPath();
    ctx.moveTo(sx, 32);
    ctx.lineTo(sx + scallopWidth / 2, 58);
    ctx.lineTo(sx + scallopWidth, 32);
    ctx.closePath();
    ctx.fill();
  }

  // 3. Central Framed Art Oval / Rounded Plaque (Sky Blue Background)
  const centerX = 256;
  const centerY = 240;
  const radiusX = 180;
  const radiusY = 140;

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
  const skyGrad = ctx.createLinearGradient(0, centerY - radiusY, 0, centerY + radiusY);
  skyGrad.addColorStop(0, '#5AC8FA');
  skyGrad.addColorStop(0.65, '#E0F7FA');
  skyGrad.addColorStop(1, '#0097A7');
  ctx.fillStyle = skyGrad;
  ctx.fill();

  ctx.lineWidth = 8;
  ctx.strokeStyle = '#FFD700';
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#E02424';
  ctx.stroke();

  // Water Ripple Base inside oval
  ctx.fillStyle = '#00838F';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 85, radiusX - 20, 45, 0, 0, Math.PI);
  ctx.fill();

  // 4. Large Hand-Painted Water Lily (Shapla / পদ্ম ফুল) - Bangladesh National Flower
  // Large Green Lotus Leaves
  ctx.fillStyle = '#2E7D32';
  ctx.beginPath();
  ctx.ellipse(centerX - 80, centerY + 65, 55, 20, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1B5E20';
  ctx.beginPath();
  ctx.ellipse(centerX + 80, centerY + 65, 55, 20, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Outer Blooming Pink/Magenta Petals
  const petalColors = ['#E91E63', '#FF4081', '#F48FB1', '#FFFFFF'];
  const drawPetal = (x, y, w, h, angle, color) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(w, -h * 0.5, 0, -h);
    ctx.quadraticCurveTo(-w, -h * 0.5, 0, 0);
    ctx.fill();
    ctx.strokeStyle = '#C2185B';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  };

  // Layer 1 - Wide Back Petals
  drawPetal(centerX, centerY + 50, 24, 78, -0.65, petalColors[0]);
  drawPetal(centerX, centerY + 50, 24, 78, 0.65, petalColors[0]);
  drawPetal(centerX, centerY + 50, 26, 92, -0.38, petalColors[1]);
  drawPetal(centerX, centerY + 50, 26, 92, 0.38, petalColors[1]);
  drawPetal(centerX, centerY + 50, 28, 105, 0, petalColors[1]);

  // Layer 2 - Inner Bright White & Pink Petals
  drawPetal(centerX - 15, centerY + 50, 20, 85, -0.2, petalColors[2]);
  drawPetal(centerX + 15, centerY + 50, 20, 85, 0.2, petalColors[2]);
  drawPetal(centerX, centerY + 50, 22, 95, 0, petalColors[3]);

  // Golden Flower Core / Stamens
  ctx.fillStyle = '#FFEB3B';
  ctx.beginPath();
  ctx.arc(centerX, centerY + 30, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FF9800';
  ctx.beginPath();
  ctx.arc(centerX, centerY + 30, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 5. Traditional Rickshaw Art Slogans
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 32px "Hind Siliguri", sans-serif';
  ctx.strokeStyle = '#1A110B';
  ctx.lineWidth = 4;
  ctx.strokeText('মা বাবার দোয়া', 256, 95);
  ctx.fillText('মা বাবার দোয়া', 256, 95);

  // License plate box at bottom
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(140, 410, 232, 54);
  ctx.strokeStyle = '#1A110B';
  ctx.lineWidth = 4;
  ctx.strokeRect(140, 410, 232, 54);

  ctx.fillStyle = '#1A110B';
  ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
  ctx.fillText('ঢাকা মেট্রো-থ ১১-২৩৪৫', 256, 445);

  // 6. Dual Rear Tail Lights (Left and Right)
  // Left Lamp Unit
  ctx.fillStyle = '#111';
  ctx.fillRect(36, 350, 60, 95);
  ctx.fillStyle = '#FF9800'; // Amber turn signal top
  ctx.fillRect(40, 354, 52, 42);
  ctx.fillStyle = '#D32F2F'; // Red brake light bottom
  ctx.fillRect(40, 400, 52, 42);
  // Chrome bezel
  ctx.strokeStyle = '#B0BEC5';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 350, 60, 95);

  // Right Lamp Unit
  ctx.fillStyle = '#111';
  ctx.fillRect(416, 350, 60, 95);
  ctx.fillStyle = '#FF9800';
  ctx.fillRect(420, 354, 52, 42);
  ctx.fillStyle = '#D32F2F';
  ctx.fillRect(420, 400, 52, 42);
  ctx.strokeStyle = '#B0BEC5';
  ctx.lineWidth = 3;
  ctx.strokeRect(416, 350, 60, 95);

  // Bottom Rickshaw Mudflap art
  ctx.fillStyle = '#111';
  ctx.fillRect(100, 478, 312, 28);
  ctx.fillStyle = '#FFF8EC';
  ctx.font = 'bold 16px "Hind Siliguri", sans-serif';
  ctx.fillText('১০০ হাত দূরে থাকুন • হর্ন দিন', 256, 498);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// =========================================================================
// 🛣️ REALISTIC VILLAGE ASPHALT ROAD WITH MARKINGS & DIRT SHOULDERS
// =========================================================================
export function createVillageAsphaltRoadTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Outer Dirt Shoulders (Left & Right ~12% width each)
  const shoulderWidth = 110;
  const dirtGradLeft = ctx.createLinearGradient(0, 0, shoulderWidth, 0);
  dirtGradLeft.addColorStop(0, '#5D4037');
  dirtGradLeft.addColorStop(0.5, '#795548');
  dirtGradLeft.addColorStop(1, '#8D6E63');
  ctx.fillStyle = dirtGradLeft;
  ctx.fillRect(0, 0, shoulderWidth, 1024);

  const dirtGradRight = ctx.createLinearGradient(1024 - shoulderWidth, 0, 1024, 0);
  dirtGradRight.addColorStop(0, '#8D6E63');
  dirtGradRight.addColorStop(0.5, '#795548');
  dirtGradRight.addColorStop(1, '#5D4037');
  ctx.fillStyle = dirtGradRight;
  ctx.fillRect(1024 - shoulderWidth, 0, shoulderWidth, 1024);

  // Dirt shoulder sand/pebble speckles
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() < 0.5 ? Math.random() * shoulderWidth : 1024 - Math.random() * shoulderWidth;
    const y = Math.random() * 1024;
    ctx.fillStyle = Math.random() > 0.5 ? '#A1887F' : '#4E342E';
    ctx.fillRect(x, y, 2 + Math.random() * 3, 2 + Math.random() * 3);
  }

  // Asphalt Village Road Surface
  const roadX = shoulderWidth;
  const roadWidth = 1024 - shoulderWidth * 2;
  ctx.fillStyle = '#2A2D30';
  ctx.fillRect(roadX, 0, roadWidth, 1024);

  // Fine Aggregate / Asphalt Texture noise
  for (let i = 0; i < 8000; i++) {
    const rx = roadX + Math.random() * roadWidth;
    const ry = Math.random() * 1024;
    const brightness = Math.floor(35 + Math.random() * 35);
    ctx.fillStyle = `rgb(${brightness}, ${brightness + 2}, ${brightness + 4})`;
    ctx.fillRect(rx, ry, 2, 2);
  }

  // Weathered wear tracks (where tires usually drive)
  const trackMat = 'rgba(25, 27, 30, 0.4)';
  ctx.fillStyle = trackMat;
  ctx.fillRect(roadX + 70, 0, 140, 1024);
  ctx.fillRect(roadX + roadWidth - 210, 0, 140, 1024);

  // Crisp Solid White Shoulder Edge Lines
  ctx.fillStyle = '#E8EAF0';
  ctx.fillRect(roadX + 16, 0, 10, 1024);
  ctx.fillRect(roadX + roadWidth - 26, 0, 10, 1024);

  // Broken White Center Lane Line (Exact Bangladesh highway dashed lines)
  const centerLineX = 512 - 6;
  const dashLength = 120;
  const gapLength = 136;
  ctx.fillStyle = '#F0F2F5';
  for (let y = 20; y < 1024; y += dashLength + gapLength) {
    ctx.fillRect(centerLineX, y, 12, dashLength);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// =========================================================================
// 🏠 CORRUGATED TIN ROOF TEXTURE (FOR BANGLADESHI VILLAGE HOUSES & SHOPS)
// =========================================================================
export function createCorrugatedTinRoofTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base metallic galvanized zinc
  ctx.fillStyle = '#90A4AE';
  ctx.fillRect(0, 0, 512, 512);

  // Corrugation Flutes (repeating ridges)
  const fluteWidth = 16;
  for (let x = 0; x < 512; x += fluteWidth) {
    const grad = ctx.createLinearGradient(x, 0, x + fluteWidth, 0);
    grad.addColorStop(0, '#546E7A');
    grad.addColorStop(0.35, '#B0BEC5');
    grad.addColorStop(0.65, '#ECEFF1');
    grad.addColorStop(1, '#455A64');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, fluteWidth, 512);
  }

  // Realistic Rust Patches (Typical weathered Bangladeshi rural tin roofs)
  for (let i = 0; i < 18; i++) {
    const rx = Math.random() * 450;
    const ry = Math.random() * 450;
    const rw = 25 + Math.random() * 55;
    const rh = 15 + Math.random() * 35;
    const rustGrad = ctx.createRadialGradient(rx + rw/2, ry + rh/2, 4, rx + rw/2, ry + rh/2, rw/2);
    rustGrad.addColorStop(0, 'rgba(160, 60, 20, 0.7)');
    rustGrad.addColorStop(0.6, 'rgba(120, 45, 15, 0.45)');
    rustGrad.addColorStop(1, 'rgba(120, 45, 15, 0)');
    ctx.fillStyle = rustGrad;
    ctx.fillRect(rx, ry, rw, rh);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// =========================================================================
// 🏪 HANGING SNACK PACKETS TEXTURE (FOR VILLAGE TEA STALL & GENERAL STORE)
// =========================================================================
export function createSnackPacketsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Clear background
  ctx.clearRect(0, 0, 512, 256);

  const colors = ['#E53935', '#FB8C00', '#FDD835', '#43A047', '#1E88E5', '#8E24AA'];
  const labels = ['চিপস', 'চানাচুর', 'বিস্কুট', 'মুড়ি', 'ডালভাজা', 'টাক'];

  const rows = 3;
  const cols = 6;
  const packetW = 68;
  const packetH = 72;

  for (let r = 0; r < rows; r++) {
    // Hanging String
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, r * 84 + 12);
    ctx.lineTo(502, r * 84 + 12);
    ctx.stroke();

    for (let c = 0; c < cols; c++) {
      const px = 16 + c * 82;
      const py = r * 84 + 14;
      const col = colors[(r * 2 + c) % colors.length];

      // Packet body
      ctx.fillStyle = col;
      ctx.fillRect(px, py, packetW, packetH);

      // Packet glossy highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(px + 4, py + 4, packetW - 8, 12);

      // Border / Seams
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py, packetW, packetH);

      // Clip / Clothespin holding packet
      ctx.fillStyle = '#6D4C41';
      ctx.fillRect(px + packetW / 2 - 3, py - 6, 6, 8);

      // Packet Label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[(r + c) % labels.length], px + packetW / 2, py + 45);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// =========================================================================
// 🌾 RICE PADDY FIELD TEXTURE (EMERALD GREEN CROPS)
// =========================================================================
export function createRicePaddyTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Vibrant Bangladeshi Rice Field Green
  ctx.fillStyle = '#66BB6A';
  ctx.fillRect(0, 0, 512, 512);

  // Rows of lush rice shoots
  const rowH = 16;
  for (let y = 0; y < 512; y += rowH) {
    ctx.fillStyle = y % (rowH * 2) === 0 ? '#43A047' : '#81C784';
    ctx.fillRect(0, y, 512, rowH);

    // Fine blade texture
    for (let x = 0; x < 512; x += 12) {
      ctx.fillStyle = '#2E7D32';
      ctx.fillRect(x + (y % 8), y + 2, 2, rowH - 4);
    }
  }

  // Earthen Ail (mud ridge dyke)
  ctx.fillStyle = '#795548';
  ctx.fillRect(0, 500, 512, 12);
  ctx.fillRect(500, 0, 12, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

