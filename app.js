/**
 * Friday's Child — Floating Sticker Background System
 * Randomly places pixel-art PNGs around the page as ambient decorations
 */

const STICKERS = [
  { src: 'images/1.png',  size: 90,  speed: 5 },   // pink PC
  { src: 'images/2.png',  size: 70,  speed: 7 },   // I love you window
  { src: 'images/3.png',  size: 60,  speed: 4 },   // pixel heart
  { src: 'images/4.png',  size: 75,  speed: 6 },   // folder
  { src: 'images/5.png',  size: 65,  speed: 5 },   // folder
  { src: 'images/6.png',  size: 55,  speed: 8 },   // chat bubble
  { src: 'images/7.png',  size: 60,  speed: 6 },   // hourglass
  { src: 'images/9.png',  size: 70,  speed: 5 },   // cassette
  { src: 'images/10.png', size: 65,  speed: 7 },
  { src: 'images/11.png', size: 80,  speed: 4 },
  { src: 'images/12.png', size: 85,  speed: 6 },
  { src: 'images/13.png', size: 70,  speed: 5 },
  { src: 'images/14.png', size: 75,  speed: 7 },
  { src: 'images/15.png', size: 80,  speed: 4 },
  { src: 'images/16.png', size: 65,  speed: 6 },
  { src: 'images/17.png', size: 70,  speed: 5 },
  { src: 'images/18.png', size: 75,  speed: 7 },
  { src: 'images/19.png', size: 65,  speed: 6 },
  { src: 'images/20.png', size: 60,  speed: 4 },
  { src: 'images/21.png', size: 70,  speed: 5 },
  { src: 'images/22.png', size: 75,  speed: 7 },
  { src: 'images/23.png', size: 80,  speed: 6 },
];

// How many stickers to show simultaneously
const STICKER_COUNT = 12;

// Zones to avoid (center of screen, in %)
const SAFE_ZONES = [];

/**
 * Creates the sticker layer and populates it with floating stickers
 */
function initStickers() {
  // Create container
  const layer = document.createElement('div');
  layer.className = 'sticker-layer';
  layer.id = 'stickerLayer';
  document.body.prepend(layer);

  // Shuffle and pick N stickers
  const shuffled = [...STICKERS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, STICKER_COUNT);

  // Place stickers in safe edge zones
  const zones = getZones(STICKER_COUNT);

  selected.forEach((s, i) => {
    const el = document.createElement('img');
    el.src = s.src;
    el.className = 'sticker';
    el.alt = '';
    el.setAttribute('aria-hidden', 'true');
    el.draggable = false;

    // Position in zone
    const zone = zones[i];
    el.style.left = zone.x + '%';
    el.style.top  = zone.y + '%';
    el.style.width = s.size + 'px';
    el.style.opacity = zone.opacity;
    el.style.transform = `rotate(${zone.rotate}deg)`;

    // Random animation
    const animType = Math.random() > 0.4 ? 'floatY' : (Math.random() > 0.5 ? 'wander' : 'floatX');
    const dur = s.speed + (Math.random() * 3 - 1.5);
    const delay = Math.random() * 4;
    el.style.animation = `${animType} ${dur}s ease-in-out ${delay}s infinite`;
    el.style.imageRendering = 'pixelated';

    // Load fallback
    el.onerror = () => el.remove();
    layer.appendChild(el);
  });
}

/**
 * Generate positions for stickers around the edges/corners
 * Avoids the center content area
 */
function getZones(count) {
  const positions = [
    // Far left strip
    { x: 0.5,  y: 5,  rotate: -10, opacity: 0.65 },
    { x: 1,    y: 28, rotate: 8,   opacity: 0.55 },
    { x: 0.5,  y: 52, rotate: -5,  opacity: 0.60 },
    { x: 1.5,  y: 74, rotate: 12,  opacity: 0.50 },
    // Far right strip
    { x: 90,   y: 8,  rotate: 10,  opacity: 0.65 },
    { x: 91,   y: 30, rotate: -8,  opacity: 0.55 },
    { x: 90,   y: 55, rotate: 6,   opacity: 0.60 },
    { x: 91.5, y: 78, rotate: -12, opacity: 0.50 },
    // Top strip
    { x: 20,   y: 0.5,rotate: -6,  opacity: 0.50 },
    { x: 42,   y: 1,  rotate: 8,   opacity: 0.45 },
    { x: 64,   y: 0.5,rotate: -10, opacity: 0.50 },
    { x: 80,   y: 2,  rotate: 5,   opacity: 0.45 },
    // Bottom strip
    { x: 18,   y: 88, rotate: 8,   opacity: 0.50 },
    { x: 38,   y: 90, rotate: -6,  opacity: 0.45 },
    { x: 60,   y: 89, rotate: 10,  opacity: 0.50 },
    { x: 78,   y: 87, rotate: -8,  opacity: 0.45 },
  ];

  // Shuffle positions
  const shuffled = positions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStickers);
} else {
  initStickers();
}

// ── User Role Utilities ──────────────────────────────────────

/** Returns true if current user is owner */
function isOwner() {
  return localStorage.getItem('poempet_role') === 'owner';
}

/** Returns current username */
function getUsername() {
  return localStorage.getItem('poempet_username') || 'Guest';
}

/** Renders the correct nav badge and returns it as HTML string */
function renderBadge(id) {
  const name = getUsername();
  const owner = isOwner();
  const el = document.getElementById(id);
  if (!el) return;
  if (owner) {
    el.className = 'neo-badge neo-badge-owner';
    el.textContent = `👑 ${name}`;
  } else {
    el.className = 'neo-badge';
    el.textContent = `@${name}`;
  }
}

// ── Gallery Data Utilities ───────────────────────────────────

const DEFAULT_ITEMS = [
  {
    id: 'default_1', title: 'Cloud Dream', type: 'Art',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5v1bjqylWuchVZdU5AG6GZj9MEJAfPcNjZRBLAnuMNqDJx7zrfQsJHD2y6yr2nunsRxG1C2gI4LZjY9httWimDoT9eLZ9H5h2HzEM2EYPTy2GNe4Gl1ffPbZBIY7MA0s6_M0Zo0JLmsIpQD93FKso8bWPpxxQzq80JtxJkszTtpt0lfSo9o4N2xXtmK-f4wLes8R39xhblNw4M33zNUJrI7Bjg2tPA7tZwJff4Qr6IsKI0Na-zDD5fDbPyKFt0erq_7NlpBR-ARwT',
    description: 'Soft as cotton, sweet as dawn, this cloud drifts through a pixel sky.',
    creator: 'starry_night', likes: '1.2k',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5Ik3NWLANzhQ2mzFwfB93DwI9fbPjFEjWnj1p4sRzOfqr-30v_NWSTAxF-c1zthcMYekxBnUp7kuFiPezYwSRef98N6YQumOZ56_Yo1vsM7LGJpLkTxoCvHJY_F_iSs83dZWOVQHLetYUOzwphRUNWGoLqq6cQ89QXRYm0igjqT60qKMwiDpkvzVtbY6-BEVnpuu0h5DfFZzS1XFvCULFq9Fp3bTSGKq25ZJHR5_rj0vli04zfeBq-K0wPLDq7weCsWH8-kKhtApG'
  },
  {
    id: 'default_2', title: "Sprout's Song", type: 'Poem',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChfnTjXeIzunLaH6zdcrya8Qav1s3IBWBvmfHDI_hHDQkJxMcdQOp72tJkXn_55L4SYVEzrUCXXxGbLQRdw9tUGeJGMebhu4JH3hloNpT6JzLbbTrirVBL0Z5dNl1zPuqIUHQDGDBDpcKOrZ7SoEAykj1O52xlAIMhKCgqJajcx_rXT_X_OTWxpIc8a6oMYBkYcmBeaQrceYZig8oWpH8oL2EVqifqmejS131Aqsx8nmJKPCIsTThQLoASkYsTnr4izXUJ20yn8jEU',
    description: "Neon vines creep across the screen,\nA garden built of code unseen.\nWatered by the tears we keep,\nWhile Tamagotchis softly sleep.\n\nIn pixels bright, our feelings hide,\nA digital warmth, a glowing tide.\nPress the button, hear the chime,\nA friendship frozen perfectly in time.\n\nThough screens may fade and cables fray,\nIn this soft glow, we choose to stay.",
    creator: 'pixel_poet', likes: '892',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBE3HDXcE_QVhF_ad28fABStrUCXvC_GVi5ypDqDtxqPWDgorVAaj0owJcI0ACfOHCdZUJDvkjEhjKHRECkfe9Lwg7mXgMRTy0eXhkXGPF96FF1sL8xQOMJALa09VBwe2HhcX2gchvDO1Ux8NRmPwOh-Y8BWqerkdePaA6rOEbjdxjVP8ZE9keo1Gta099imy04e1B3qEwBO6j9zhM0PSaXIpR2jv3XEwMIturPqMYez1FMgw1bQoxPrX6kpn3tgEYODSCfhOxmwk24'
  },
  {
    id: 'default_3', title: 'Nap Time', type: 'Art',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgKUytzEDhlPlO6_7x-cfru0kyGwuHoU2bmvrLJmnVIuRq0PzsvKYfLU51H_tACqz8MdwMhNNJptvYAK_O5uhQkCLVWWy0P47YHuXAKF-OvdBlZlAyc7mkwJM61v3qdXkpH22jRnWQ0vl2v_j-hVDpmgiKJEY8w4PSH9uHGr0dSduiPQuagY_X5dl5NihhmHKQ6-0s64QbAcfFam_nM5x99vlUkoXHVB38kwELnmd7RJGGDPm2Ef16nTHMYbfnYAtRjZZNVxYmhPYV',
    description: 'Charging batteries and dreaming of electric sheep in the softest pixel meadow.',
    creator: 'cyber_snooze', likes: '512',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZLcvFRwQdNs2WUf-mSqDU_qOm8_Qp6yod_Xt4haGsVRYn_kgZAHMq7_v6-M5iPr_jRIrWJinepJrtbQ3KVGUwtWEVnTphA9W49wxCvuYhz1J696eAIXpEdMinmyhivAkvMTlRUG_QHxnrfy_3EZZ42LOOXAaAogOPvByIMqo_qInkO71VDfr46P4CIyRq17YAR4qK7lu8NWBFTS1GN7XjyZ1E_XMVJCstKozGhKL60JhNe6IIlJZzln7VwoZHxAaQr0g5DUzRbkry'
  },
];

function getAllItems() {
  const custom  = JSON.parse(localStorage.getItem('fc_custom_items')  || '[]');
  const deleted = JSON.parse(localStorage.getItem('fc_deleted_ids')   || '[]');
  const edited  = JSON.parse(localStorage.getItem('fc_edited_items')  || '{}');
  return [...DEFAULT_ITEMS, ...custom]
    .filter(item => !deleted.includes(item.id))
    .map(item => edited[item.id] ? { ...item, ...edited[item.id] } : item);
}

function deleteItemById(id) {
  const custom = JSON.parse(localStorage.getItem('fc_custom_items') || '[]');
  if (custom.some(i => i.id === id)) {
    localStorage.setItem('fc_custom_items', JSON.stringify(custom.filter(i => i.id !== id)));
  } else {
    const deleted = JSON.parse(localStorage.getItem('fc_deleted_ids') || '[]');
    deleted.push(id);
    localStorage.setItem('fc_deleted_ids', JSON.stringify(deleted));
  }
}

function saveEditById(id, updates) {
  const custom = JSON.parse(localStorage.getItem('fc_custom_items') || '[]');
  const ci = custom.findIndex(i => i.id === id);
  if (ci >= 0) {
    Object.assign(custom[ci], updates);
    localStorage.setItem('fc_custom_items', JSON.stringify(custom));
  } else {
    const edited = JSON.parse(localStorage.getItem('fc_edited_items') || '{}');
    edited[id] = { ...(edited[id] || {}), ...updates };
    localStorage.setItem('fc_edited_items', JSON.stringify(edited));
  }
}

// ── Audio Synth ──────────────────────────────────────────────
let _audioCtx = null;
function getAudio() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
}
function playTone(freq, type = 'sine', dur = 0.15, vol = 0.07) {
  const ctx = getAudio();
  if (ctx.state === 'suspended') ctx.resume();
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type; osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + dur);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(); osc.stop(ctx.currentTime + dur);
}
function playChime() {
  playTone(523.25, 'triangle', 0.1);
  setTimeout(() => playTone(659.25, 'triangle', 0.1), 80);
  setTimeout(() => playTone(783.99, 'triangle', 0.1), 160);
  setTimeout(() => playTone(1046.5, 'triangle', 0.3), 240);
}
function playPop() {
  playTone(660, 'sine', 0.08);
  setTimeout(() => playTone(880, 'sine', 0.12), 60);
}
function playLike() {
  playTone(659.25, 'triangle', 0.2);
}
