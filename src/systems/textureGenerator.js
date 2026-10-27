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

