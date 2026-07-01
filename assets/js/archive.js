/* =========================================================
   HANAMI ARCHIVE — script.js
   Semua interaksi ruangan ada di sini. Dikomentari pakai
   Bahasa Indonesia biar gampang kamu ubah-ubah sendiri.
   Tidak pakai library luar sama sekali — murni JS biasa,
   supaya tetap ringan di HP low-end.
   ========================================================= */

(function () {
  'use strict';

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // localStorage aman (fallback diam-diam kalau tidak tersedia, mis. dibuka dari file:// di beberapa browser)
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* abaikan */ } }
  };

  document.addEventListener('DOMContentLoaded', () => {
    initPetals();
    initBoot();
    initDockNav();
    initScrollReveal();
    initNook();
    initMusicRoom();
    initGallery();
    initBirthdayRoom();
    initSecretGarden();
    initWindowView();
    initExitFlow();
  });

  /* =======================================================
     1) KELOPAK SAKURA — dibatasi jumlahnya biar ringan
     ======================================================= */
  function initPetals() {
    if (reduceMotion) return; // hormati preferensi kurangi animasi
    const wrap = $('#petals');
    if (!wrap) return;
    const count = window.innerWidth < 600 ? 6 : 12;
    const glyphs = ['🌸', '🌸', '🌸', '🍃'];

    for (let i = 0; i < count; i++) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      petal.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      petal.style.left = Math.random() * 100 + 'vw';
      petal.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
      petal.style.fontSize = (0.7 + Math.random() * 0.8) + 'rem';
      petal.style.animationDuration = (10 + Math.random() * 10) + 's';
      petal.style.animationDelay = (Math.random() * -20) + 's';
      wrap.appendChild(petal);
    }
  }

  /* =======================================================
     2) OPENING SEQUENCE
     ======================================================= */
  function initBoot() {
    const boot = $('#boot');
    const bar = $('#bootBarFill');
    const percent = $('#bootPercent');
    const loading = $('#bootLoading');
    const welcome = $('#bootWelcome');
    const enterBtn = $('#bootEnter');
    const skipBtn = $('#bootSkip');
    const lines = $$('.boot__line', welcome);

    let done = false;
    const finishBoot = () => {
      if (done) return;
      done = true;
      boot.classList.add('is-hidden');
      setTimeout(() => { boot.hidden = true; }, 900);
    };

    skipBtn.addEventListener('click', finishBoot);

    // simulasi loading bar
    let pct = 0;
    const loadTimer = setInterval(() => {
      pct += Math.random() * 18 + 8;
      if (pct >= 100) {
        pct = 100;
        clearInterval(loadTimer);
        setTimeout(showWelcome, 350);
      }
      bar.style.width = pct + '%';
      percent.textContent = Math.floor(pct) + '%';
    }, 220);

    function showWelcome() {
      loading.hidden = true;
      welcome.hidden = false;
      let i = 0;
      const revealNext = () => {
        if (i >= lines.length) {
          enterBtn.hidden = false;
          requestAnimationFrame(() => enterBtn.classList.add('is-visible'));
          return;
        }
        lines[i].classList.add('is-visible');
        i++;
        setTimeout(revealNext, i === lines.length ? 1100 : 850);
      };
      revealNext();
    }

    enterBtn.addEventListener('click', finishBoot);

    // jaga-jaga: kalau lebih dari 12 detik belum selesai (mis. tab tidak aktif), tetap tampilkan tombol masuk
    setTimeout(() => {
      if (!welcome.hidden && enterBtn.hidden) {
        enterBtn.hidden = false;
        enterBtn.classList.add('is-visible');
      }
    }, 12000);
  }

  /* =======================================================
     3) NAVIGASI DOCK (ruangan) + scrollspy
     ======================================================= */
  function scrollToTarget(targetSel) {
    const el = document.querySelector(targetSel);
    if (!el) return;
    if (el.hidden) el.hidden = false; // kalau target masih tersembunyi (mis. secret garden), tampilkan dulu
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function initDockNav() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-target]');
      if (!trigger) return;
      e.preventDefault();
      scrollToTarget(trigger.getAttribute('data-target'));
    });

    // scrollspy: sorot ikon dock sesuai section yang sedang terlihat
    const dockItems = $$('.dock__item[data-target]');
    const sections = $$('main > section').filter(s => !s.hidden || s.id === 'secret-garden');

    if (!('IntersectionObserver' in window) || sections.length === 0) return;

    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = '#' + entry.target.id;
        dockItems.forEach(btn => {
          btn.classList.toggle('is-active', btn.getAttribute('data-target') === id);
        });
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(s => spy.observe(s));
  }

  /* =======================================================
     4) FADE-IN SAAT SCROLL
     ======================================================= */
  function initScrollReveal() {
    const targets = $$('.panel, .hub__intro, .nook, .rooms');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(t => t.classList.add('is-inview'));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(t => io.observe(t));
  }

  /* =======================================================
     5) LIVING ROOM NOOK — meja teh, kucing, jendela, pot
     ======================================================= */
  function initNook() {
    // --- meja teh ---
    const milk = $('#milkItem');
    if (milk) {
      milk.addEventListener('click', () => {
        let level = parseInt(milk.dataset.level, 10);
        if (level > 0) level--;
        milk.dataset.level = level;
        milk.style.transform = `scale(${1 - (4 - level) * 0.05})`;
        milk.title = level === 0 ? 'Habis~' : 'Sedikit berkurang';
      });
    }

    const cake = $('#cakeItem');
    if (cake) {
      cake.addEventListener('click', () => {
        let bites = parseInt(cake.dataset.bites, 10) + 1;
        cake.dataset.bites = bites;
        cake.style.opacity = Math.max(0.4, 1 - bites * 0.15);
        cake.title = 'Satu gigitan lagi~';
      });
    }

    const flower = $('#flowerItem');
    if (flower) {
      flower.addEventListener('click', () => spawnPetalBurst(flower));
    }

    const book = $('#bookItem');
    const quotes = [
      'Selalu ada tempat untuk pulang.',
      'Kenangan kecil pun layak disimpan.',
      'Terima kasih sudah singgah lagi.'
    ];
    if (book) {
      book.addEventListener('click', () => {
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        book.title = q;
        flashCaption(book, q);
      });
    }

    // --- kucing ---
    const cat = $('#catObj');
    const catEmoji = $('#catEmoji');
    const catBubble = $('#catBubble');
    if (cat) {
      cat.addEventListener('click', () => {
        catBubble.hidden = false;
        catEmoji.classList.add('is-hopping');
        setTimeout(() => { catBubble.hidden = true; }, 1400);
        setTimeout(() => { catEmoji.classList.remove('is-hopping'); }, 650);
      });

      // sesekali kucing bergerak sendiri (idle animation, hemat baterai)
      if (!reduceMotion) {
        setInterval(() => {
          if (Math.random() < 0.35) {
            catEmoji.classList.add('is-hopping');
            setTimeout(() => catEmoji.classList.remove('is-hopping'), 650);
          }
        }, 9000);
      }
    }
  }

  function spawnPetalBurst(anchor) {
    const rect = anchor.getBoundingClientRect();
    const wrap = $('#petals');
    if (!wrap) return;
    for (let i = 0; i < 6; i++) {
      const p = document.createElement('span');
      p.className = 'petal';
      p.textContent = '🌸';
      p.style.left = (rect.left + rect.width / 2) + 'px';
      p.style.top = (rect.top + window.scrollY) + 'px';
      p.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
      p.style.animationDuration = '3.2s';
      p.style.animationDelay = '0s';
      wrap.appendChild(p);
      setTimeout(() => p.remove(), 3300);
    }
  }

  function flashCaption(el, text) {
    const tip = document.createElement('span');
    tip.textContent = text;
    tip.style.position = 'absolute';
    tip.style.bottom = '100%';
    tip.style.left = '50%';
    tip.style.transform = 'translateX(-50%)';
    tip.style.background = 'var(--panel-alt)';
    tip.style.border = '1px solid var(--line)';
    tip.style.padding = '6px 10px';
    tip.style.borderRadius = '8px';
    tip.style.fontSize = '.75rem';
    tip.style.whiteSpace = 'nowrap';
    tip.style.marginBottom = '8px';
    el.style.position = 'relative';
    el.appendChild(tip);
    setTimeout(() => tip.remove(), 2200);
  }

  /* =======================================================
     6) MUSIC ROOM
     ======================================================= */
  function initMusicRoom() {
    // ---- DATA LAGU ----
    // Ganti "src" tiap lagu dengan path file mp3 kamu, contoh: "audio/hanami-theme.mp3"
    // Biarkan src kosong ("") kalau file belum ada — pemutar akan tetap jalan tanpa error.
    const playlists = [
      {
        id: 'soundtrack', name: '🌸 Hanami Soundtrack', ambience: 'dusk',
        songs: [
          { title: 'Hanami Theme', artist: 'Original Soundtrack', src: '' },
          { title: 'Chapter I Theme', artist: 'Original Soundtrack', src: '' },
          { title: 'Chapter II Theme', artist: 'Original Soundtrack', src: '' },
          { title: 'Chapter III Theme', artist: 'Original Soundtrack', src: '' },
          { title: 'Chapter IV Theme', artist: 'Original Soundtrack', src: '' },
          { title: 'Chapter V Theme', artist: 'Original Soundtrack', src: '' },
          { title: 'Chapter VI Theme', artist: 'Original Soundtrack', src: '' },
          { title: 'Epilogue Theme', artist: 'Original Soundtrack', src: '' },
          { title: 'Birthday Room Theme', artist: 'Original Soundtrack', src: '' }
        ]
      },
      {
        id: 'elga', name: "🎧 Elga's Favorite Songs", ambience: 'dusk',
        songs: [
          { title: 'Tambahkan lagu favoritmu', artist: 'Elga', src: '' },
          { title: 'Tambahkan lagu favoritmu', artist: 'Elga', src: '' }
        ]
      },
      {
        id: 'mawar', name: "🌷 Mawar's Favorite Songs", ambience: 'dusk',
        songs: [
          { title: 'Tambahkan lagu favorit Mawar', artist: 'Mawar', src: '' },
          { title: 'Tambahkan lagu favorit Mawar', artist: 'Mawar', src: '' }
        ]
      },
      {
        id: 'our', name: '🤍 Our Playlist', ambience: 'dusk',
        songs: [
          { title: 'Lagu pertama yang sama-sama disukai', artist: 'Our Playlist', src: '' },
          { title: 'Lagu yang cocok dengan Hanami', artist: 'Our Playlist', src: '' }
        ]
      },
      {
        id: 'sunset', name: '🌇 Sunset Playlist', ambience: 'sunset',
        songs: [{ title: 'Lagu sore', artist: 'Sunset Playlist', src: '' }]
      },
      {
        id: 'midnight', name: '🌙 Midnight Playlist', ambience: 'midnight',
        songs: [{ title: 'Lagu malam', artist: 'Midnight Playlist', src: '' }]
      },
      {
        id: 'rain', name: '🌧 Rain Playlist', ambience: 'rain',
        songs: [{ title: 'Lagu hujan', artist: 'Rain Playlist', src: '' }]
      },
      {
        id: 'sakura', name: '🌸 Sakura Playlist', ambience: 'morning',
        songs: [{ title: 'Lagu instrumental', artist: 'Sakura Playlist', src: '' }]
      }
    ];

    const playlistList = $('#playlistList');
    const trackList = $('#trackList');
    const player = $('#player');
    const nowTitle = $('#nowTitle');
    const nowArtist = $('#nowArtist');
    const progress = $('#progress');
    const timeCurrent = $('#timeCurrent');
    const timeTotal = $('#timeTotal');
    const playBtn = $('#playBtn');
    const prevBtn = $('#prevBtn');
    const nextBtn = $('#nextBtn');
    const volume = $('#volume');
    const note = $('#musicNote');

    if (!playlistList || !player) return;

    let activePlaylist = playlists[0];
    let activeIndex = -1;
    let isSeeking = false;

    // render tombol playlist
    playlists.forEach((pl) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'playlist-btn';
      btn.textContent = pl.name;
      btn.setAttribute('role', 'tab');
      btn.addEventListener('click', () => selectPlaylist(pl));
      playlistList.appendChild(btn);
    });

    function refreshPlaylistButtons() {
      $$('.playlist-btn', playlistList).forEach((btn, i) => {
        btn.classList.toggle('is-active', playlists[i].id === activePlaylist.id);
      });
    }

    function selectPlaylist(pl) {
      activePlaylist = pl;
      activeIndex = -1;
      refreshPlaylistButtons();
      renderTracks();
    }

    function renderTracks() {
      trackList.innerHTML = '';
      activePlaylist.songs.forEach((song, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'track-btn';
        btn.innerHTML = `<span>${song.src ? '🎵' : '＋'}</span><span>${song.title}</span>`;
        btn.addEventListener('click', () => playTrack(i));
        trackList.appendChild(btn);
      });
      highlightTrack();
    }

    function highlightTrack() {
      $$('.track-btn', trackList).forEach((btn, i) => {
        btn.classList.toggle('is-playing', i === activeIndex);
      });
    }

    function setAmbience(name) {
      document.body.className = document.body.className.replace(/\bambience-\S+/g, '').trim();
      document.body.classList.add('ambience-' + (name || 'dusk'));
    }

    function playTrack(i) {
      const song = activePlaylist.songs[i];
      if (!song) return;
      activeIndex = i;
      highlightTrack();
      nowTitle.textContent = song.title;
      nowArtist.textContent = song.artist || '—';
      setAmbience(activePlaylist.ambience);

      if (!song.src) {
        showNote('🎵 Belum ada file untuk lagu ini. Tambahkan path mp3 di script.js.');
        player.pause();
        playBtn.textContent = '▶️';
        return;
      }
      hideNote();
      player.src = song.src;
      player.play().then(() => {
        playBtn.textContent = '⏸️';
      }).catch(() => {
        showNote('🎵 Tidak bisa memutar file ini. Periksa kembali path-nya.');
      });
    }

    function showNote(msg) { note.textContent = msg; note.hidden = false; }
    function hideNote() { note.hidden = true; }

    playBtn.addEventListener('click', () => {
      if (activeIndex === -1) {
        if (activePlaylist.songs.length) playTrack(0);
        return;
      }
      if (player.paused) {
        if (!player.src) { playTrack(activeIndex); return; }
        player.play().then(() => playBtn.textContent = '⏸️').catch(() => {});
      } else {
        player.pause();
        playBtn.textContent = '▶️';
      }
    });

    prevBtn.addEventListener('click', () => {
      if (!activePlaylist.songs.length) return;
      const i = activeIndex <= 0 ? activePlaylist.songs.length - 1 : activeIndex - 1;
      playTrack(i);
    });
    nextBtn.addEventListener('click', () => {
      if (!activePlaylist.songs.length) return;
      const i = activeIndex >= activePlaylist.songs.length - 1 ? 0 : activeIndex + 1;
      playTrack(i);
    });

    player.addEventListener('timeupdate', () => {
      if (isSeeking || !player.duration) return;
      progress.value = (player.currentTime / player.duration) * 100;
      timeCurrent.textContent = formatTime(player.currentTime);
      timeTotal.textContent = formatTime(player.duration);
    });
    player.addEventListener('loadedmetadata', () => {
      timeTotal.textContent = formatTime(player.duration);
    });
    player.addEventListener('ended', () => nextBtn.click());
    player.addEventListener('error', () => {
      if (player.getAttribute('src')) showNote('🎵 File audio tidak ditemukan. Periksa kembali path-nya.');
    });

    progress.addEventListener('input', () => { isSeeking = true; });
    progress.addEventListener('change', () => {
      if (player.duration) player.currentTime = (progress.value / 100) * player.duration;
      isSeeking = false;
    });

    volume.addEventListener('input', () => { player.volume = volume.value / 100; });
    player.volume = volume.value / 100;

    function formatTime(sec) {
      if (!isFinite(sec)) return '0:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    // tampilan awal
    refreshPlaylistButtons();
    renderTracks();
  }

  /* =======================================================
     7) GALLERY — tabs + lightbox
     ======================================================= */
  function initGallery() {
    const tabs = $$('.tabs__btn');
    const albums = {
      memories: $('#albumMemories'),
      artwork: $('#albumArtwork'),
      behind: $('#albumBehind')
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        Object.entries(albums).forEach(([key, el]) => {
          if (!el) return;
          el.hidden = key !== tab.dataset.album;
        });
      });
    });

    const lightbox = $('#lightbox');
    const lightboxIcon = $('#lightboxIcon');
    const lightboxCaption = $('#lightboxCaption');
    const closeBtn = $('#lightboxClose');
    let lastFocused = null;

    $$('.polaroid__frame').forEach(frame => {
      frame.addEventListener('click', () => {
        const figure = frame.closest('.polaroid');
        const caption = figure ? figure.dataset.caption : '';
        const icon = frame.querySelector('span') ? frame.querySelector('span').textContent : '📷';
        lightboxIcon.textContent = icon;
        lightboxCaption.textContent = caption || '';
        lastFocused = document.activeElement;
        lightbox.hidden = false;
        closeBtn.focus();
      });
    });

    function closeLightbox() {
      lightbox.hidden = true;
      if (lastFocused) lastFocused.focus();
    }
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  /* =======================================================
     8) BIRTHDAY ROOM
     ======================================================= */
  function initBirthdayRoom() {
    const candle = $('#candle');
    if (candle) {
      candle.addEventListener('click', () => {
        candle.classList.toggle('is-out');
      });
    }

    $$('.balloon').forEach(balloon => {
      balloon.addEventListener('click', () => {
        if (balloon.classList.contains('is-popped')) return;
        balloon.classList.add('is-popped');
        burstAt(balloon);
        setTimeout(() => balloon.classList.remove('is-popped'), 2200);
      });
    });

    const giftBtn = $('#giftBtn');
    const letterBtn = $('#letterBtn');
    const reveal = $('#birthdayReveal');
    if (giftBtn) {
      giftBtn.addEventListener('click', () => {
        reveal.hidden = false;
        reveal.textContent = '🎁 Hadiah kecil menanti di sini — ganti teks ini dengan kejutan aslimu di archive.html.';
      });
    }
    if (letterBtn) {
      letterBtn.addEventListener('click', () => {
        reveal.hidden = false;
        reveal.textContent = '📖 "Selamat ulang tahun, Mawar. Semoga tahun ini secerah senja kesukaanmu." — ganti dengan suratmu sendiri.';
      });
    }
  }

  function burstAt(el) {
    if (reduceMotion) return;
    const scene = el.closest('.birthday__scene');
    if (!scene) return;
    const rect = el.getBoundingClientRect();
    const sceneRect = scene.getBoundingClientRect();
    const wrap = document.createElement('div');
    wrap.className = 'burst';
    for (let i = 0; i < 6; i++) {
      const bit = document.createElement('span');
      bit.className = 'burst__bit';
      bit.textContent = ['🎉', '✨', '🌸'][i % 3];
      const angle = (Math.PI * 2 * i) / 6;
      bit.style.setProperty('--bx', Math.cos(angle) * 40 + 'px');
      bit.style.setProperty('--by', Math.sin(angle) * 40 + 'px');
      bit.style.left = (rect.left - sceneRect.left + rect.width / 2) + 'px';
      bit.style.top = (rect.top - sceneRect.top + rect.height / 2) + 'px';
      wrap.appendChild(bit);
    }
    scene.appendChild(wrap);
    setTimeout(() => wrap.remove(), 900);
  }

  /* =======================================================
     9) SECRET GARDEN (easter egg)
     ======================================================= */
  function initSecretGarden() {
    const pot = $('#secretPot');
    const secretSection = $('#secret-garden');
    if (!pot || !secretSection) return;

    // sudah pernah dibuka sebelumnya? langsung tampilkan tanpa perlu klik ulang
    if (store.get('hanami_secret_unlocked') === '1') {
      secretSection.hidden = false;
      addSecretDockButton();
    }

    pot.addEventListener('click', () => {
      let clicks = parseInt(pot.dataset.clicks, 10) + 1;
      pot.dataset.clicks = clicks;
      pot.style.transform = 'scale(1.15)';
      setTimeout(() => { pot.style.transform = ''; }, 180);

      if (clicks >= 5 && secretSection.hidden) {
        secretSection.hidden = false;
        store.set('hanami_secret_unlocked', '1');
        addSecretDockButton();
        setTimeout(() => scrollToTarget('#secret-garden'), 300);
      }
    });
  }

  function addSecretDockButton() {
    const dock = $('#dock');
    const exitBtn = $('#exitBtn');
    if (!dock || $('.dock__item[data-target="#secret-garden"]')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dock__item';
    btn.setAttribute('data-target', '#secret-garden');
    btn.innerHTML = '<span class="dock__icon">🌷</span><span class="dock__tip">Secret Garden</span>';
    dock.insertBefore(btn, exitBtn);
  }

  /* =======================================================
     10) WINDOW VIEW
     ======================================================= */
  function initWindowView() {
    const windowObj = $('#windowObj');
    const view = $('#windowView');
    const closeBtn = $('#windowClose');
    if (!windowObj || !view) return;

    let lastFocused = null;
    windowObj.addEventListener('click', () => {
      lastFocused = document.activeElement;
      view.hidden = false;
      closeBtn.focus();
    });
    function close() {
      view.hidden = true;
      if (lastFocused) lastFocused.focus();
    }
    closeBtn.addEventListener('click', close);
    view.addEventListener('click', (e) => { if (e.target === view) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !view.hidden) close();
    });
  }

  /* =======================================================
     11) EXIT FLOW — modal konfirmasi + layar perpisahan
     ======================================================= */
  function initExitFlow() {
    const exitBtn = $('#exitBtn');
    const modal = $('#exitModal');
    const cancelBtn = $('#exitCancel');
    const confirmBtn = $('#exitConfirm');
    const goodbye = $('#goodbye');
    const goodbyeLines = $$('.goodbye__line', goodbye);
    const returnBtn = $('#goodbyeReturn');

    if (!exitBtn || !modal) return;

    exitBtn.addEventListener('click', () => {
      modal.hidden = false;
      cancelBtn.focus();
    });
    cancelBtn.addEventListener('click', () => { modal.hidden = true; });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.hidden = true; });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) modal.hidden = true;
    });

    confirmBtn.addEventListener('click', () => {
      modal.hidden = true;
      // hentikan musik yang sedang main, kalau ada
      const player = $('#player');
      if (player) player.pause();

      goodbye.hidden = false;
      let i = 0;
      const next = () => {
        if (i >= goodbyeLines.length) {
          returnBtn.hidden = false;
          requestAnimationFrame(() => returnBtn.classList.add('is-visible'));
          return;
        }
        goodbyeLines[i].classList.add('is-visible');
        i++;
        setTimeout(next, 900);
      };
      next();
    });

    returnBtn.addEventListener('click', () => {
      goodbye.hidden = true;
      goodbyeLines.forEach(l => l.classList.remove('is-visible'));
      returnBtn.classList.remove('is-visible');
      returnBtn.hidden = true;
      scrollToTarget('#hub');
    });
  }

})();