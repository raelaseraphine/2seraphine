/* ==========================================================================
   HANAMI — AFTER CREDITS
   ------------------------------------------------------------------------
   Semua teks & aset di bawah CONFIG boleh kamu ubah bebas.
   File ini murni vanilla JS (tanpa library) supaya ringan di HP low-end.
   ========================================================================== */
(function () {
  'use strict';

  /* ========================================================================
     CONFIG — edit bagian ini sesuai kebutuhanmu
     ====================================================================== */
  const CONFIG = {
    recipientName: 'Mawar',
    senderName: 'Elga',

    // Halaman tujuan setelah "Opening Archive" selesai.
    // Ganti / buat file archive.html di folder yang sama.
    redirectUrl: '../end/archive.html',

    // 6 chapter untuk Gallery & Buku Hanami.
    // Isi "img" dengan path foto asli kalau ada, mis. "assets/img/chapter-1.jpg".
    // Kalau dikosongkan, akan tampil placeholder sakura.
    gallery: [
      { caption: 'Chapter I',   img: '' },
      { caption: 'Chapter II',  img: '' },
      { caption: 'Chapter III', img: '' },
      { caption: 'Chapter IV',  img: '' },
      { caption: 'Chapter V',   img: '' },
      { caption: 'Chapter VI',  img: '' },
    ],
    bookCovers: [
      { caption: 'Chapter I' },
      { caption: 'Chapter II' },
      { caption: 'Chapter III' },
      { caption: 'Chapter IV' },
      { caption: 'Chapter V' },
      { caption: 'Chapter VI' },
    ],

    // Surat di dalam kado (Quest 6). Tulis ulang sesuai isi hati kamu.
    letterParagraphs: [
      'Untuk Mawar Seraphine, 🌸',

      'Selamat ulang tahun yaa. Akhirnya hari yang sudah kutunggu sejak lama benar-benar tiba. Aku harap, saat kamu membaca surat ini, kamu sedang tersenyum.',

      'Semoga di usia yang baru ini kamu selalu diberi kesehatan, kebahagiaan, dan dikelilingi oleh orang-orang yang benar-benar menyayangimu. Semoga semua hal yang sedang kamu perjuangkan perlahan menemukan jalannya, dan semua doa baikmu satu per satu menemukan waktunya untuk menjadi nyata.',

      'Mungkin hadiah ini tidak sempurna. Mungkin masih ada banyak kekurangan di sana-sini. Tapi percayalah, setiap halaman, setiap animasi, setiap musik, setiap baris kode, semuanya dibuat dengan penuh perhatian... sambil membayangkan bagaimana reaksi kamu ketika membukanya.',

      'Hanami sebenarnya bukan hanya tentang bunga sakura, atau sebuah website. Hanami adalah kumpulan waktu, usaha, dan perasaan yang perlahan berubah menjadi sebuah kenangan. Kenangan yang ingin kuberikan khusus untukmu.',

      'Terima kasih sudah mau berjalan sejauh ini. Terima kasih sudah membuka setiap halaman, membaca setiap cerita, dan menyelesaikan semuanya sampai akhir. Itu saja sudah membuat semua usaha ini terasa sangat berarti.',

      'Aku tidak tahu seperti apa hari-hari yang akan datang. Tapi aku benar-benar berharap semoga kamu selalu menemukan alasan untuk tersenyum, selalu punya tempat untuk pulang, dan selalu dipertemukan dengan hal-hal yang membuat hatimu hangat.',

      'Kalau suatu hari nanti kamu kembali membuka Hanami lagi, semoga saat itu kamu sedang baik-baik saja. Dan semoga hadiah kecil ini masih bisa membuatmu tersenyum, walaupun hanya sebentar.',

      'Sekali lagi...',

      'Selamat ulang tahun, Mawar. Terima kasih sudah menjadi seseorang yang menginspirasi lahirnya seluruh cerita ini. Semoga tahun ini menjadi tahun yang penuh dengan kebahagiaan, kejutan indah, dan cerita-cerita baru yang jauh lebih baik dari sebelumnya.',

      'Dengan tulus,',

      '— Raela Seraphine (Elga)🤍',
    ],

    // Pesan tetap di halaman kiri "One Last Page" (Quest 7).
    elgaFinalMessage:
      'Kalau kamu sedang membaca halaman ini...\n\nberarti kita benar-benar sudah sampai di akhir perjalanan.\n\nTerima kasih...\n\nkarena sudah meluangkan waktumu untuk membuka setiap halaman, membaca setiap cerita, dan berjalan sampai sejauh ini.\n\nAku sengaja membiarkan halaman di sebelah ini tetap kosong.\n\nBukan karena aku tidak punya lagi yang ingin ditulis.\n\nTapi karena aku percaya...\n\nhalaman terakhir akan terasa jauh lebih berarti kalau kita menuliskannya bersama.\n\nJadi sekarang...\n\nhalaman itu menjadi milikmu.\n\nTulislah apa pun yang ingin kamu simpan.\n\nSebuah doa.\n\nSebuah harapan.\n\nAtau mungkin hanya satu kalimat sederhana yang suatu hari nanti bisa membuatmu tersenyum ketika membacanya kembali.\n\nSemoga, bertahun-tahun dari sekarang pun, halaman ini tetap menjadi pengingat bahwa pernah ada seseorang yang dengan tulus membuat semua ini hanya untukmu.\n\nTerima kasih sudah menjadi bagian dari cerita ini.\n\n— Raela Seraphine 🌸',

    // Kutipan singkat Elga yang tampil di scene "Save This Memory".
    memoryElgaExcerpt:
      'Selamat ulang tahun, Mawar.\n\nSemoga, bertahun-tahun dari sekarang, hari ini tetap menjadi salah satu hari yang layak untuk dikenang.\n\n— Raela Seraphine 🌸',

    // Audio bersifat OPSIONAL dan mati secara default (biar tidak ada request
    // ke file yang belum ada). Untuk mengaktifkan:
    // 1) taruh file mp3 di folder assets/audio/
    // 2) isi path di bawah ini
    // 3) ubah enabled menjadi true
    audio: {
      enabled: true,
      doorCreak: '',     // assets/audio/door.mp3
      ambience: '',      // assets/audio/room-ambience.mp3 (loop) — tidak dipakai, backsound pakai birthdaySong
      birthdaySong: '../assets/audio/happy-birthday.mp3', // diputar loop dari pintu dibuka sampai quest tiup lilin dimulai, lalu diputar sekali lagi setelah lilin ditiup
      clap: '',          // assets/audio/clap.mp3
      paper: '',         // assets/audio/paper.mp3
      pop: '',           // assets/audio/pop.mp3
      ribbon: '',        // assets/audio/ribbon.mp3
    },
  };

  /* ========================================================================
     Utilities
     ====================================================================== */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  // wait() yang bisa "dipercepat" dengan tap di layar (skip animasi teks)
  let fastForward = null;
  function wait(ms) {
    return new Promise((resolve) => {
      const t = setTimeout(() => { fastForward = null; resolve(); }, ms);
      fastForward = () => { clearTimeout(t); fastForward = null; resolve(); };
    });
  }
  document.addEventListener('pointerdown', () => { if (fastForward) fastForward(); });

  async function flashLine(el, text, holdMs) {
    el.textContent = text;
    el.classList.add('is-visible');
    await wait(650);
    await wait(holdMs || 1200);
    el.classList.remove('is-visible');
    await wait(650);
  }

  /* ========================================================================
     Audio (opsional, no-op kalau CONFIG.audio.enabled = false)
     ====================================================================== */
  let soundEnabled = false;
  let ambienceAudio = null;
  let birthdayBgAudio = null;

  // Backsound "Happy Birthday" loop, mulai dari pintu dibuka.
  // Dipanggil dari klik pintu (openDoor) — klik itu sendiri adalah user
  // gesture yang bikin browser mengizinkan audio bersuara diputar otomatis.
  function startBirthdayBg() {
    if (!CONFIG.audio.enabled || !CONFIG.audio.birthdaySong || birthdayBgAudio) return;
    soundEnabled = true;
    const toggleBtn = $('#sound-toggle');
    if (toggleBtn) toggleBtn.setAttribute('aria-pressed', 'true');
    birthdayBgAudio = playSfx('birthdaySong', { loop: true });
  }
  function stopBirthdayBg() {
    if (birthdayBgAudio) { birthdayBgAudio.pause(); birthdayBgAudio = null; }
  }

  function playSfx(key, opts) {
    opts = opts || {};
    if (!CONFIG.audio.enabled) return null;
    const src = CONFIG.audio[key];
    if (!src) return null;
    try {
      const a = new Audio(src);
      a.loop = !!opts.loop;
      a.volume = opts.loop ? 0.35 : 0.8;
      a.muted = !soundEnabled;
      a.play().catch(() => {});
      return a;
    } catch (e) { return null; }
  }
  function startAmbience() {
    if (!CONFIG.audio.enabled || !CONFIG.audio.ambience || ambienceAudio) return;
    ambienceAudio = playSfx('ambience', { loop: true });
  }
  function stopAmbience() {
    if (ambienceAudio) { ambienceAudio.pause(); ambienceAudio = null; }
  }
  function toggleSound() {
    soundEnabled = !soundEnabled;
    $('#sound-toggle').setAttribute('aria-pressed', String(soundEnabled));
    if (ambienceAudio) {
      ambienceAudio.muted = !soundEnabled;
      if (soundEnabled) ambienceAudio.play().catch(() => {});
    }
    if (birthdayBgAudio) {
      birthdayBgAudio.muted = !soundEnabled;
      if (soundEnabled) birthdayBgAudio.play().catch(() => {});
    }
  }

  /* ========================================================================
     Scene manager
     ====================================================================== */
  function goTo(name) {
    $$('.scene').forEach((s) => s.classList.toggle('is-active', s.dataset.scene === name));
  }

  /* ========================================================================
     Ambient sakura petals (CSS-only animation, dibuat sekali saat load)
     ====================================================================== */
  function initPetals() {
    if (REDUCED_MOTION) return;
    $$('.petals').forEach((container) => {
      const count = parseInt(container.dataset.count || '10', 10);
      const frag = document.createDocumentFragment();
      for (let i = 0; i < count; i++) {
        const p = document.createElement('span');
        p.className = 'petal';
        const size = (6 + Math.random() * 8).toFixed(1);
        const duration = (9 + Math.random() * 8).toFixed(1);
        const delay = (Math.random() * duration).toFixed(1);
        const x = (Math.random() * 100).toFixed(1);
        const drift = (Math.random() * 60 - 30).toFixed(1);
        p.style.setProperty('--size', size + 'px');
        p.style.setProperty('--duration', duration + 's');
        p.style.setProperty('--delay', '-' + delay + 's');
        p.style.setProperty('--x', x + '%');
        p.style.setProperty('--drift', drift + 'px');
        frag.appendChild(p);
      }
      container.appendChild(frag);
    });
  }

  /* ========================================================================
     Confetti (canvas ringan, tanpa library)
     ====================================================================== */
  const confettiCanvas = () => $('#confetti-canvas');
  let confettiParticles = [];
  let confettiRunning = false;
  let confettiLastTs = null;
  const CONFETTI_COLORS = ['#f6a8c4', '#eab873', '#ffffff', '#9c86d6', '#e8749f'];

  function resizeConfettiCanvas() {
    const canvas = confettiCanvas();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function burstConfetti(opts) {
    opts = opts || {};
    let count = opts.count || 70;
    const duration = opts.duration || 1500;
    if (REDUCED_MOTION) count = Math.round(count * 0.35);

    const canvas = confettiCanvas();
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const fresh = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: -20 - Math.random() * h * 0.3,
      vx: (Math.random() - 0.5) * 2.2,
      vy: 2 + Math.random() * 2.6,
      size: 4 + Math.random() * 5,
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 10,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      life: 0,
      maxLife: duration + Math.random() * 600,
    }));
    confettiParticles = confettiParticles.concat(fresh).slice(-260);
    if (!confettiRunning) {
      confettiRunning = true;
      confettiLastTs = null;
      requestAnimationFrame(confettiTick);
    }
  }

  function confettiTick(ts) {
    const canvas = confettiCanvas();
    const ctx = canvas.getContext('2d');
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (confettiLastTs == null) confettiLastTs = ts;
    const dt = Math.min(32, ts - confettiLastTs);
    confettiLastTs = ts;

    ctx.clearRect(0, 0, w, h);
    confettiParticles.forEach((p) => {
      p.life += dt;
      p.x += p.vx * (dt / 16);
      p.y += p.vy * (dt / 16);
      p.rot += p.vr * (dt / 16);
      p.vy += 0.02 * (dt / 16);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    confettiParticles = confettiParticles.filter((p) => p.life < p.maxLife && p.y < h + 40);

    if (confettiParticles.length > 0) {
      requestAnimationFrame(confettiTick);
    } else {
      confettiRunning = false;
      ctx.clearRect(0, 0, w, h);
    }
  }

  /* ========================================================================
     Quest state
     ====================================================================== */
  const questState = { balon: false, jendela: false, gallery: false, buku: false, lilin: false, hadiah: false, halaman: false };
  const OVERLAY_COMPLETE_ON_CLOSE = { jendela: true, gallery: true, buku: true };
  let savedPage = null; // { name, msg } dari Quest 7

  function markDone(key) {
    if (questState[key]) return;
    questState[key] = true;
    const li = $(`.quest-log__list li[data-quest="${key}"]`);
    if (li) li.classList.add('is-done');
    const card = $(`.quest-card[data-open="${key}"]`);
    if (card) card.classList.add('is-done');
    const done = Object.values(questState).filter(Boolean).length;
    $('#quest-progress-text').textContent = `${done} / 7`;
    const toggleCount = $('#quest-log-toggle-count');
    if (toggleCount) toggleCount.textContent = `${done}/7`;
    if (done >= 7) setTimeout(onAllQuestsDone, 900);
  }

  function onAllQuestsDone() {
    goTo('complete');
    runComplete();
  }

  /* ========================================================================
     Overlay open / close
     ====================================================================== */
  function openOverlay(name) {
    const el = $(`#overlay-${name}`);
    if (!el) return;
    const setup = {
      balon: resetBalloon,
      jendela: buildWindow,
      gallery: buildGallery,
      buku: () => { bookIndex = 0; renderBook(); },
      lilin: resetCandle,
      hadiah: resetGift,
      halaman: openLastPage,
    }[name];
    if (setup) setup();
    el.classList.add('is-open');
    const closeBtn = el.querySelector('.overlay-close');
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  }

  function closeOverlay(name) {
    const el = $(`#overlay-${name}`);
    if (!el) return;
    if (name === 'lilin') {
      candleActive = false;
      stopManualBlow();
      if (micRafId) cancelAnimationFrame(micRafId);
      cleanupMic();
    }
    if (OVERLAY_COMPLETE_ON_CLOSE[name]) markDone(name);
    el.classList.remove('is-open');
  }

  function handleGlobalClose(e) {
    const btn = e.target.closest('[data-close]');
    if (!btn) return;
    const overlay = btn.closest('.overlay');
    if (overlay) closeOverlay(overlay.dataset.overlay);
  }

  /* ========================================================================
     Quest 1 — Balon
     ====================================================================== */
  function resetBalloon() {
    const b = $('#balloon-el');
    b.classList.remove('is-floating', 'is-popped');
    $('#balloon-msg').textContent = '';
  }
  function handleBalloonClick() {
    const b = $('#balloon-el');
    if (b.classList.contains('is-popped')) return;
    if (!b.classList.contains('is-floating')) {
      b.classList.add('is-floating');
      return;
    }
    b.classList.remove('is-floating');
    b.classList.add('is-popped');
    burstConfetti({ count: 55, duration: 1200 });
    playSfx('pop');
    const messages = ['Yay! 🎉', 'Happy Birthday! 🌸', 'Horeee! 🎈', 'Semoga senang! 💛'];
    $('#balloon-msg').textContent = messages[Math.floor(Math.random() * messages.length)];
    markDone('balon');
    setTimeout(() => closeOverlay('balon'), 1500);
  }

  /* ========================================================================
     Quest 2 — Jendela
     ====================================================================== */
  let windowBuilt = false;
  function buildWindow() {
    if (windowBuilt) return;
    windowBuilt = true;
    const sky = $('#window-sky');
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('span');
      s.className = 'star';
      s.style.left = (Math.random() * 94 + 2) + '%';
      s.style.top = (Math.random() * 70 + 4) + '%';
      s.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
      const size = (1 + Math.random() * 2).toFixed(1) + 'px';
      s.style.width = size;
      s.style.height = size;
      frag.appendChild(s);
    }
    const meteor = document.createElement('span');
    meteor.className = 'meteor';
    frag.appendChild(meteor);
    sky.appendChild(frag);
  }

  /* ========================================================================
     Quest 3 — Gallery
     ====================================================================== */
  let galleryBuilt = false;
  function buildGallery() {
    if (galleryBuilt) return;
    galleryBuilt = true;
    const row = $('#polaroid-row');
    const frag = document.createDocumentFragment();
    CONFIG.gallery.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'polaroid';
      card.style.setProperty('--tilt', ((i % 2 === 0 ? -1 : 1) * (2 + Math.random() * 3)).toFixed(1) + 'deg');
      const frame = document.createElement('div');
      frame.className = 'polaroid__frame';
      if (item.img) {
        frame.style.backgroundImage = `url("${item.img}")`;
        frame.style.backgroundSize = 'cover';
        frame.style.backgroundPosition = 'center';
      } else {
        frame.textContent = '🌸';
      }
      const cap = document.createElement('p');
      cap.className = 'polaroid__caption';
      cap.textContent = item.caption;
      card.appendChild(frame);
      card.appendChild(cap);
      frag.appendChild(card);
    });
    row.appendChild(frag);
  }

  /* ========================================================================
     Quest 4 — Buku Hanami
     ====================================================================== */
  let bookIndex = 0;
  function renderBook() {
    const item = CONFIG.bookCovers[bookIndex];
    $('#book-cover-label').textContent = item.caption;
    $('#book-page-indicator').textContent = `${bookIndex + 1} / ${CONFIG.bookCovers.length}`;
    $('#book-prev').disabled = bookIndex === 0;
    $('#book-next').disabled = bookIndex === CONFIG.bookCovers.length - 1;
  }
  function turnBook(newIndex) {
    const cover = $('#book-cover-view');
    cover.classList.add('is-turning');
    setTimeout(() => {
      bookIndex = newIndex;
      renderBook();
      cover.classList.remove('is-turning');
    }, 200);
  }

  /* ========================================================================
     Quest 5 — Tiup lilin (mic + fallback tombol)
     ====================================================================== */
  let candleActive = false;
  let blowProgress = 0;
  let micStream = null, audioCtx = null, analyser = null, micRafId = null;
  let manualBlowInterval = null;

  function resetCandle() {
    stopBirthdayBg();
    candleActive = true;
    blowProgress = 0;
    $('#flame-el').classList.remove('is-out');
    $('#flame-el').style.transform = '';
    $('#smoke-el').hidden = true;
    $('#candle-celebrate').hidden = true;
    $('#blow-controls').hidden = true;
    $('#mic-meter-fill').style.width = '0%';
    $('#mic-status').textContent = '';
    runCandleIntro();
  }

  async function runCandleIntro() {
    const el = $('#candle-line');
    const lines = [
      ['Sebelum meniup lilin...', 1100],
      ['buatlah satu harapan.', 1600],
      ['Tidak usah terburu-buru.', 1400],
      ['Kalau sudah...', 900],
      ['tiuplah lilinnya.', 1400],
    ];
    for (const [t, h] of lines) {
      if (!candleActive) return;
      await flashLine(el, t, h);
    }
    el.textContent = '';
    if (!candleActive) return;
    $('#blow-controls').hidden = false;
    initMic();
  }

  async function initMic() {
    const status = $('#mic-status');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status.textContent = 'Mikrofon tidak didukung — gunakan tombol di bawah.';
      return;
    }
    status.textContent = 'Meminta izin mikrofon...';
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(micStream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      status.textContent = 'Tiup perlahan ke mikrofon...';
      micLoop();
    } catch (err) {
      status.textContent = 'Mikrofon tidak aktif — gunakan tombol di bawah.';
    }
  }

  function micLoop() {
    if (!analyser || !candleActive) return;
    const data = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / data.length);
    const level = Math.min(1, rms * 4);
    const fill = $('#mic-meter-fill');
    if (fill) fill.style.width = level * 100 + '%';

    const THRESHOLD = 0.12;
    if (level > THRESHOLD) {
      blowProgress = Math.min(1, blowProgress + (level - THRESHOLD) * 0.045);
      updateFlame();
    }
    if (blowProgress >= 1) { extinguishFlame(); return; }
    micRafId = requestAnimationFrame(micLoop);
  }

  function updateFlame() {
    const flame = $('#flame-el');
    const scale = Math.max(0.15, 1 - blowProgress * 0.85);
    flame.style.transform = `translateX(-50%) scale(${scale})`;
  }

  function startManualBlow() {
    if (manualBlowInterval || !candleActive) return;
    manualBlowInterval = setInterval(() => {
      blowProgress = Math.min(1, blowProgress + 0.07);
      const fill = $('#mic-meter-fill');
      if (fill) fill.style.width = Math.min(100, blowProgress * 130) + '%';
      updateFlame();
      if (blowProgress >= 1) extinguishFlame();
    }, 90);
  }
  function stopManualBlow() {
    if (manualBlowInterval) { clearInterval(manualBlowInterval); manualBlowInterval = null; }
  }

  function cleanupMic() {
    if (micStream) { micStream.getTracks().forEach((t) => t.stop()); micStream = null; }
    if (audioCtx) { audioCtx.close().catch(() => {}); audioCtx = null; }
    analyser = null;
  }

  async function extinguishFlame() {
    if (!candleActive) return;
    candleActive = false;
    stopManualBlow();
    if (micRafId) cancelAnimationFrame(micRafId);
    cleanupMic();

    $('#flame-el').classList.add('is-out');
    const smoke = $('#smoke-el');
    smoke.hidden = false;
    smoke.style.animation = 'none';
    void smoke.offsetWidth;
    smoke.style.animation = '';
    $('#blow-controls').hidden = true;

    await wait(1500);
    smoke.hidden = true;
    burstConfetti({ count: 90, duration: 1600 });
    playSfx('clap');
    startBirthdayBg();
    $('#candle-celebrate').hidden = false;
    markDone('lilin');
    await wait(2600);
    closeOverlay('lilin');
  }

  /* ========================================================================
     Quest 6 — Hadiah
     ====================================================================== */
  function resetGift() {
    $('#gift-box').classList.remove('is-open');
    $('#letter-el').hidden = true;
  }
  function handleGiftClick() {
    const box = $('#gift-box');
    if (box.classList.contains('is-open')) return;
    box.classList.add('is-open');
    playSfx('ribbon');
    setTimeout(() => {
      $('#letter-text').textContent = CONFIG.letterParagraphs.join('\n\n');
      $('#letter-el').hidden = false;
    }, 650);
  }

  /* ========================================================================
     Quest 7 — Halaman terakhir
     ====================================================================== */
  function openLastPage() {
    const nameInput = $('#mawar-name'), msgInput = $('#mawar-msg');
    const status = $('#save-page-status'), btn = $('#save-page-btn');
    $('#last-page-elga').textContent = CONFIG.elgaFinalMessage;
    if (savedPage) {
      nameInput.value = savedPage.name;
      msgInput.value = savedPage.msg;
      nameInput.disabled = true;
      msgInput.disabled = true;
      btn.hidden = true;
      status.hidden = false;
    } else {
      nameInput.value = '';
      msgInput.value = '';
      nameInput.disabled = false;
      msgInput.disabled = false;
      btn.hidden = false;
      status.hidden = true;
    }
  }
  function handleSavePage() {
    const nameInput = $('#mawar-name'), msgInput = $('#mawar-msg');
    savedPage = { name: nameInput.value.trim() || CONFIG.recipientName, msg: msgInput.value.trim() };
    nameInput.disabled = true;
    msgInput.disabled = true;
    $('#save-page-btn').hidden = true;
    $('#save-page-status').hidden = false;
    playSfx('paper');
    markDone('halaman');
  }

  /* ========================================================================
     Scene: Opening
     ====================================================================== */
  function animateBarTo100(fillEl, durationMs) {
    return new Promise((resolve) => {
      const start = performance.now();
      function step(ts) {
        const p = Math.min(1, (ts - start) / durationMs);
        fillEl.style.width = p * 100 + '%';
        if (p < 1) requestAnimationFrame(step);
        else resolve();
      }
      requestAnimationFrame(step);
    });
  }

  async function runOpening() {
    const line = $('#opening-line');
    const bar = $('#opening-bar');
    const fill = $('#opening-bar-fill');

    line.textContent = 'One More Thing...';
    line.classList.add('is-visible');
    await wait(1300);
    line.classList.remove('is-visible');
    await wait(650);

    line.textContent = 'Loading...';
    line.classList.add('is-visible');
    bar.hidden = false;
    await animateBarTo100(fill, 1500);
    line.textContent = '100%';
    await wait(600);
    line.classList.remove('is-visible');
    bar.hidden = true;
    await wait(700);

    await wait(1300); // jeda hening, layar hitam

    await flashLine(line, 'End Credits Finished.', 1500);
    await wait(250);
    await flashLine(line, '...', 900);
    await wait(250);
    await flashLine(line, 'Or is it?', 1500);
    await wait(500);

    goTo('truth');
    runTruth();
  }

  /* ========================================================================
     Scene: The Truth
     ====================================================================== */
  async function runTruth() {
    const el = $('#truth-line');
    const lines = [
      ['Kamu tahu...', 900],
      ['kenapa website ini dibuat?', 1500],
      ['Bukan...', 800],
      ['karena aku ingin membuat website.', 1400],
      ['Bukan...', 800],
      ['karena aku ingin belajar coding.', 1400],
      ['Bukan juga...', 800],
      ['karena aku punya banyak waktu luang.', 1500],
      ['Website ini dibuat...', 1000],
      ['karena...', 900],
      ['akan ada seseorang...', 1000],
      ['yang berulang tahun.', 1400],
      ['Dan orang itu...', 1000],
      ['adalah kamu.', 1500],
      [`Selamat Ulang Tahun,\n${CONFIG.recipientName}.`, 2400],
    ];
    for (const [t, h] of lines) await flashLine(el, t, h);
    await wait(400);
    goTo('door');
  }

  /* ========================================================================
     Scene: The Door
     ====================================================================== */
  function openDoor() {
    const frame = $('#door-frame');
    if (frame.classList.contains('is-open')) return;
    frame.classList.add('is-open');
    playSfx('doorCreak');
    startBirthdayBg();
    const hint = $('#door-hint');
    hint.style.transition = 'opacity .4s';
    hint.style.opacity = '0';
    setTimeout(() => { goTo('surprise'); runSurprise(); }, 1300);
  }

  /* ========================================================================
     Scene: Birthday Surprise
     ====================================================================== */
  async function runSurprise() {
    burstConfetti({ count: 100, duration: 1800 });
    startAmbience();
    await wait(900);
    $('#surprise-line-1').classList.add('is-visible');
    await wait(1300);
    $('#surprise-line-2').classList.add('is-visible');
    await wait(1300);
    const btn = $('#btn-to-room');
    btn.hidden = false;
    requestAnimationFrame(() => btn.classList.add('is-visible'));
  }

  /* ========================================================================
     Scene: Quest Complete
     ====================================================================== */
  async function runComplete() {
    const el = $('#complete-line');
    el.textContent = 'Terima kasih.\n\nKarena hari ini... kamu sudah menyelesaikan seluruh perjalanan Hanami.\n\nDan sekarang... cerita ini... akhirnya lengkap.';
    await wait(400);
    el.classList.add('is-visible');
    await wait(2600);
    const btn = $('#btn-to-memory');
    btn.hidden = false;
    requestAnimationFrame(() => btn.classList.add('is-visible'));
  }

  /* ========================================================================
     Scene: Save This Memory
     ====================================================================== */
  function runMemory() {
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    $('#memory-date').textContent = dateStr;
    $('#memory-elga').textContent = CONFIG.memoryElgaExcerpt;
    $('#memory-mawar').textContent = savedPage && savedPage.msg ? savedPage.msg : '(halaman belum ditulis)';
  }

  /* ========================================================================
     Scene: Close Hanami
     ====================================================================== */
  function handleCloseHanami() {
    const btn = $('#btn-close-hanami');
    btn.disabled = true;
    playSfx('paper');
    stopAmbience();
    stopBirthdayBg();
    $('#book-close').classList.add('is-closing');
    setTimeout(() => { goTo('goodbye'); runGoodbye(); }, 1700);
  }

  /* ========================================================================
     Scene: Goodbye
     ====================================================================== */
  async function runGoodbye() {
    const el = $('#goodbye-line');
    const lines = [
      ['Hanami\nhas been completed.', 1900],
      ['Terima kasih.', 1400],
      ['🌸', 1000],
      ['Sampai jumpa lagi.', 1900],
    ];
    for (const [t, h] of lines) await flashLine(el, t, h);
    await wait(500);
    goTo('archive');
    runArchive();
  }

  /* ========================================================================
     Scene: Opening Archive → redirect
     ====================================================================== */
  function runArchive() {
    const totalBlocks = 8;
    const barFill = $('#archive-bar-fill');
    const blocksEl = $('#archive-blocks');
    const percentEl = $('#archive-percent');
    let pct = 0;
    const timer = setInterval(() => {
      pct = Math.min(100, pct + 3 + Math.random() * 4);
      const filled = Math.round((pct / 100) * totalBlocks);
      blocksEl.textContent = '■'.repeat(filled) + '□'.repeat(totalBlocks - filled);
      barFill.style.width = pct + '%';
      percentEl.textContent = Math.round(pct) + '%';
      if (pct >= 100) {
        clearInterval(timer);
        try { localStorage.setItem('hanami_completed', 'true'); } catch (err) { /* ignore */ }
        setTimeout(() => { window.location.href = CONFIG.redirectUrl; }, 700);
      }
    }, 90);
  }

  /* ========================================================================
     Init
     ====================================================================== */
  function onEnter() {
    $('#btn-enter').disabled = true;
    goTo('opening');
    runOpening();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initPetals();
    resizeConfettiCanvas();
    window.addEventListener('resize', debounce(resizeConfettiCanvas, 150));

    $('#btn-enter').addEventListener('click', onEnter);
    $('#sound-toggle').addEventListener('click', toggleSound);

    const doorFrame = $('#door-frame');
    doorFrame.setAttribute('tabindex', '0');
    doorFrame.setAttribute('role', 'button');
    doorFrame.setAttribute('aria-label', 'Buka pintu');
    doorFrame.addEventListener('click', openDoor);
    doorFrame.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDoor(); }
    });

    $('#btn-to-room').addEventListener('click', () => goTo('room'));

    // Toggle panel checklist Birthday Quest (dipakai di layar sempit/HP)
    const questLog = $('#quest-log');
    const questLogToggle = $('#quest-log-toggle');
    if (questLog && questLogToggle) {
      questLogToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = !questLog.classList.contains('is-open');
        questLog.classList.toggle('is-open', willOpen);
        questLogToggle.setAttribute('aria-expanded', String(willOpen));
      });
      // Tutup otomatis kalau tap di luar panel
      document.addEventListener('click', (e) => {
        if (!questLog.classList.contains('is-open')) return;
        if (questLog.contains(e.target)) return;
        questLog.classList.remove('is-open');
        questLogToggle.setAttribute('aria-expanded', 'false');
      });
    }

    $$('.quest-card').forEach((btn) => btn.addEventListener('click', () => openOverlay(btn.dataset.open)));
    document.addEventListener('click', handleGlobalClose);

    $('#balloon-el').addEventListener('click', handleBalloonClick);

    $('#book-prev').addEventListener('click', () => { if (bookIndex > 0) turnBook(bookIndex - 1); });
    $('#book-next').addEventListener('click', () => { if (bookIndex < CONFIG.bookCovers.length - 1) turnBook(bookIndex + 1); });

    const blowBtn = $('#blow-btn');
    blowBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); startManualBlow(); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((evt) => blowBtn.addEventListener(evt, stopManualBlow));

    $('#gift-box').addEventListener('click', handleGiftClick);
    $('#letter-close').addEventListener('click', () => { markDone('hadiah'); closeOverlay('hadiah'); });

    $('#save-page-btn').addEventListener('click', handleSavePage);

    $('#btn-to-memory').addEventListener('click', () => { goTo('memory'); runMemory(); });
    $('#btn-save-memory').addEventListener('click', () => openOverlay('memory-note'));
    $('#btn-to-close').addEventListener('click', () => goTo('close'));

    $('#btn-close-hanami').addEventListener('click', handleCloseHanami);
  });
})();