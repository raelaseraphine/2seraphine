/* =========================================================
   HANAMI — End Credits
   Semua orkestrasi scene ada di sini. Kalau mau ubah durasi
   atau pacing, cukup ubah angka-angka di CONFIG di bawah —
   nggak perlu sentuh logic lainnya.
   ========================================================= */

(() => {
  'use strict';

  /* ---------------------------------------------------------
     CONFIG — semua satuan waktu dalam milidetik (ms)
     --------------------------------------------------------- */
  const CONFIG = {
    redirectUrl: 'aftercredits.html', // halaman tujuan setelah "One More Thing..."

    darkHold:      2000,   // Scene 1 — hening sebelum bintang muncul
    starsAppear:   5500,   // Scene 1 — durasi bintang bermunculan satu-satu

    titleCardHold: 3800,   // Scene 2a — "HANAMI / Created by / Elga"

    rollDuration:     62000, // Scene 2b — total durasi scroll credit ke atas
    specialThanksAt:  0.87,  // Scene 2b — di titik ini (fraksi 0..1) layar jadi terang & sakura mulai jatuh

    memoriesStagger: 600,   // Scene 3 — jeda antar ikon kenangan muncul
    memoriesHold:    4200,  // Scene 3 — jeda diam sebelum berpindah scene

    statsCountDuration: 1400, // Scene 4 — durasi angka menghitung naik
    statsHold:          5000, // Scene 4 — berapa lama box status ditahan di layar

    thanksHold: 6200,       // Scene 5 — masing-masing dari 2 baris "Thank you"

    finalHold1: 5200,       // Scene 6 — baris "This project was made..."
    finalHold2: 9500,       // Scene 6 — baris "Dedicated to Mawar." (ditahan paling lama, sesuai naskah)

    lastStarLineHold:      2600, // Scene 7 — tiap baris teks
    lastStarBlinkDuration: 2000, // Scene 7 — bintang berkedip cepat di akhir

    loadingStepDelay: 650,  // Scene 8 — jeda dasar antar persen loading
    oneMoreHold:      3000, // Scene 8 — lama "One More Thing..." ditahan

    blackoutHold: 2200,     // layar hitam sebelum pindah ke aftercredits.html
    // Catatan durasi: total default sekitar ~2.5 menit. Untuk mendekati 4-6 menit
    // seperti naskah aslinya, tinggal perbesar rollDuration, thanksHold, dan finalHold2.

    // jumlah bintang menyesuaikan lebar layar biar tetap ringan di HP low-end
    starCount: () => (window.innerWidth < 480 ? 90 : window.innerWidth < 900 ? 140 : 190),
    petalCount: 9,
    shootingStarMinGap: 7000,
    shootingStarMaxGap: 15000,
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const debounce = (fn, wait) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  };

  /* ===========================================================
     STARFIELD — satu <canvas>, redraw jarang (bukan tiap frame)
     supaya tetap ringan di perangkat low-end.
     =========================================================== */

  const starCanvas = document.getElementById('stars');
  const ctx = starCanvas.getContext('2d');
  let stars = [];
  let dpr = 1;
  let starClock = 0;
  let visibleStarCount = 0;
  let starIntervalId = null;

  function buildStars() {
    const count = CONFIG.starCount();
    stars = new Array(count).fill(0).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.92,
      r: Math.random() * 1.3 + 0.4,
      base: Math.random() * 0.55 + 0.35,
      phase: Math.random() * Math.PI * 2,
      warm: Math.random() < 0.15,
    }));
  }

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5); // cap DPR biar canvas nggak raksasa di HP retina
    starCanvas.width = Math.floor(window.innerWidth * dpr);
    starCanvas.height = Math.floor(window.innerHeight * dpr);
    starCanvas.style.width = window.innerWidth + 'px';
    starCanvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
  }

  function drawStars() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    starClock += 0.35;
    const n = Math.min(visibleStarCount, stars.length);
    for (let i = 0; i < n; i++) {
      const s = stars[i];
      const alpha = s.base * (0.55 + 0.45 * Math.sin(starClock * 0.6 + s.phase));
      ctx.beginPath();
      ctx.fillStyle = s.warm ? `rgba(244,221,176,${alpha})` : `rgba(255,255,255,${alpha})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function startTwinkle() {
    if (starIntervalId) return;
    // update jarang (2-3x/detik) — twinkle tetap terasa halus tanpa membebani CPU
    starIntervalId = setInterval(drawStars, reduceMotion ? 900 : 380);
  }

  async function revealStarsGradually(duration) {
    visibleStarCount = 0;
    startTwinkle();
    if (reduceMotion) { visibleStarCount = stars.length; return; }
    const total = stars.length;
    const steps = 24;
    const stepTime = duration / steps;
    for (let i = 1; i <= steps; i++) {
      visibleStarCount = Math.round((i / steps) * total);
      await sleep(stepTime);
    }
    visibleStarCount = total;
  }

  /* ===========================================================
     SAKURA PETALS — elemen DOM kecil (emoji), dianimasikan lewat
     CSS transform/opacity (murah, jalan di compositor).
     =========================================================== */

  const petalsContainer = document.getElementById('petals');
  let petalsActive = false;
  let petalIntervalId = null;

  function spawnPetal() {
    if (!petalsActive) return;
    const el = document.createElement('span');
    el.className = 'petal';
    el.textContent = '🌸';
    el.style.setProperty('--left', (Math.random() * 100) + 'vw');
    el.style.setProperty('--size', (14 + Math.random() * 14) + 'px');
    el.style.setProperty('--dur', (9 + Math.random() * 8) + 's');
    el.style.setProperty('--drift', (Math.random() * 140 - 70) + 'px');
    petalsContainer.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  function startPetals() {
    if (reduceMotion || petalsActive) return;
    petalsActive = true;
    for (let i = 0; i < CONFIG.petalCount; i++) setTimeout(spawnPetal, i * 400);
    petalIntervalId = setInterval(spawnPetal, 1400);
  }

  function stopPetals() {
    petalsActive = false;
    if (petalIntervalId) clearInterval(petalIntervalId);
  }

  /* ===========================================================
     SHOOTING STAR — satu elemen, dipicu random via CSS keyframe.
     =========================================================== */

  const shootingStarEl = document.getElementById('shooting-star');
  let shootingTimerId = null;

  function scheduleShootingStar() {
    if (reduceMotion) return;
    const gap = CONFIG.shootingStarMinGap + Math.random() * (CONFIG.shootingStarMaxGap - CONFIG.shootingStarMinGap);
    shootingTimerId = setTimeout(() => {
      shootingStarEl.style.top = (8 + Math.random() * 20) + '%';
      shootingStarEl.classList.add('active');
      shootingStarEl.addEventListener('animationend', function handler() {
        shootingStarEl.classList.remove('active');
        shootingStarEl.removeEventListener('animationend', handler);
      }, { once: true });
      scheduleShootingStar();
    }, gap);
  }

  function stopShootingStar() {
    if (shootingTimerId) clearTimeout(shootingTimerId);
    shootingStarEl.classList.remove('active');
  }

  const flashEl = document.getElementById('flash');
  function triggerFlash() {
    flashEl.classList.remove('active');
    void flashEl.offsetWidth; // reflow biar animasi bisa diulang
    flashEl.classList.add('active');
  }

  /* ===========================================================
     SCENE HELPERS
     =========================================================== */

  function showScene(id, display = 'flex') {
    const el = document.getElementById(id);
    el.style.display = display;
    void el.offsetWidth;
    el.classList.add('visible');
    return el;
  }

  function hideScene(id) {
    return new Promise(resolve => {
      const el = document.getElementById(id);
      el.classList.remove('visible');
      setTimeout(() => { el.style.display = 'none'; resolve(); }, 1150);
    });
  }

  function animateCount(el, duration) {
    const final = parseInt(el.dataset.final, 10);
    const pad = parseInt(el.dataset.pad || '1', 10);
    const suffix = el.dataset.suffix || '';
    const useComma = el.dataset.format === 'comma';
    const start = performance.now();

    function format(val) {
      const num = useComma ? val.toLocaleString('en-US') : String(val).padStart(pad, '0');
      return num + suffix;
    }

    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      el.textContent = format(Math.round(final * p));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  async function runLoadingBar() {
    const steps = [0, 15, 31, 67, 92, 100];
    const fill = document.getElementById('loading-fill');
    const pct = document.getElementById('loading-pct');
    for (const s of steps) {
      fill.style.width = s + '%';
      pct.textContent = s + '%';
      await sleep(CONFIG.loadingStepDelay + Math.random() * 250);
    }
  }

  /* ===========================================================
     MAIN TIMELINE
     =========================================================== */

  async function playSequence() {
    resizeCanvas();
    startTwinkle();
    scheduleShootingStar();

    /* ---------- Scene 1 — Darkness ---------- */
    showScene('scene-dark');
    await sleep(CONFIG.darkHold);
    document.body.classList.remove('pre-reveal'); // langit mulai terlihat
    await revealStarsGradually(CONFIG.starsAppear);
    await sleep(600);
    await hideScene('scene-dark');

    /* ---------- Scene 2a — Title card ---------- */
    showScene('scene-title');
    await sleep(CONFIG.titleCardHold);
    await hideScene('scene-title');

    /* ---------- Scene 2b — Rolling credits ---------- */
    showScene('scene-roll', 'block');
    const track = document.getElementById('roll-track');
    track.style.setProperty('--roll-duration', (CONFIG.rollDuration / 1000) + 's');
    void track.offsetWidth;
    track.classList.add('scrolling');

    // Saat "Special Thanks — Mawar" mendekat: layar jadi terang & kelopak sakura mulai jatuh
    setTimeout(() => {
      triggerFlash();
      startPetals();
    }, CONFIG.rollDuration * CONFIG.specialThanksAt);

    await sleep(CONFIG.rollDuration + 400);
    await hideScene('scene-roll');
    track.classList.remove('scrolling');

    /* ---------- Scene 3 — Little Memories ---------- */
    showScene('scene-memories');
    const cards = Array.from(document.querySelectorAll('.memory-card'));
    cards.forEach((c, i) => setTimeout(() => c.classList.add('show'), i * CONFIG.memoriesStagger));
    await sleep(cards.length * CONFIG.memoriesStagger + CONFIG.memoriesHold);
    await hideScene('scene-memories');
    cards.forEach(c => c.classList.remove('show'));

    /* ---------- Scene 4 — Hidden Statistics ---------- */
    showScene('scene-stats');
    document.querySelectorAll('.count').forEach(el => animateCount(el, CONFIG.statsCountDuration));
    await sleep(CONFIG.statsCountDuration + CONFIG.statsHold);
    await hideScene('scene-stats');

    /* ---------- Scene 5 — Thank You ---------- */
    showScene('scene-thanks');
    await sleep(CONFIG.thanksHold);
    document.getElementById('thanks-1').classList.add('hidden');
    document.getElementById('thanks-2').classList.remove('hidden');
    await sleep(CONFIG.thanksHold);
    await hideScene('scene-thanks');
    document.getElementById('thanks-1').classList.remove('hidden');
    document.getElementById('thanks-2').classList.add('hidden');

    /* ---------- Scene 6 — Final Credit ---------- */
    showScene('scene-final');
    await sleep(CONFIG.finalHold1);
    document.getElementById('final-1').classList.add('hidden');
    document.getElementById('final-2').classList.remove('hidden');
    await sleep(CONFIG.finalHold2);
    await hideScene('scene-final');
    document.getElementById('final-1').classList.remove('hidden');
    document.getElementById('final-2').classList.add('hidden');

    stopPetals(); // suasana mulai tenang menjelang Scene 7

    /* ---------- Scene 7 — The Last Star ---------- */
    showScene('scene-laststar');
    await sleep(900);
    document.getElementById('ls-1').classList.add('show');
    await sleep(CONFIG.lastStarLineHold);
    document.getElementById('ls-1').classList.remove('show');
    document.getElementById('ls-2').classList.remove('hidden');
    document.getElementById('ls-2').classList.add('show');
    await sleep(CONFIG.lastStarLineHold * 0.7);
    document.getElementById('ls-2').classList.remove('show');
    document.getElementById('ls-3').classList.remove('hidden');
    document.getElementById('ls-3').classList.add('show');
    await sleep(CONFIG.lastStarLineHold);
    document.getElementById('last-star').classList.add('blink-fast');
    await sleep(CONFIG.lastStarBlinkDuration);
    await hideScene('scene-laststar');

    /* ---------- Scene 8 — Secret Loading ---------- */
    stopShootingStar(); // fokus penuh ke "layar game"
    showScene('scene-loading');
    await runLoadingBar();
    await sleep(400);
    document.getElementById('one-more').classList.add('show');
    await sleep(CONFIG.oneMoreHold);

    /* ---------- Blackout → pindah ke After Credits ---------- */
    document.getElementById('blackout').classList.add('show');
    await sleep(CONFIG.blackoutHold);
    window.location.href = CONFIG.redirectUrl;
  }

  /* ===========================================================
     BOOT
     =========================================================== */

  resizeCanvas();
  window.addEventListener('resize', debounce(resizeCanvas, 250), { passive: true });

  document.getElementById('start-btn').addEventListener('click', () => {
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.add('hide');
    setTimeout(() => { startScreen.style.display = 'none'; }, 850);

    playSequence().catch(err => {
      // kalau ada error tak terduga, tetap lanjut ke aftercredits biar user nggak "nyangkut"
      console.error('HANAMI end credits error:', err);
      window.location.href = CONFIG.redirectUrl;
    });
  }, { once: true });

  document.getElementById('skip-btn').addEventListener('click', () => {
    window.location.href = CONFIG.redirectUrl;
  });

})();