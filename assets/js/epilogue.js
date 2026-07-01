/* ==========================================================
   HANAMI — EPILOGUE
   Mesin scene sederhana: tiap scene = background + beberapa
   baris teks yang muncul satu-satu lewat tombol "Lanjut"
   (atau tap di layar). Tidak ada scroll sama sekali.

   Ingin ubah teks / urutan scene? Edit array SCENES di bawah.
   Ingin ubah isi End Credits? Edit array CREDITS di bawah.
   ========================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1) DATA SCENE — edit di sini kalau mau ganti isi cerita
     --------------------------------------------------------- */
  var SCENES = [
    {
      title: "White Silence",
      note: "Layar putih • musik piano pelan",
      bg: "bg-1",
      particle: { type: "none" },
      lines: [
        "Ceritanya memang sudah selesai.",
        "Tapi…",
        "Ada satu hal terakhir."
      ]
    },
    {
      title: "Sakura Road",
      note: "Jalan kecil penuh sakura, hanya kelopak yang jatuh",
      bg: "bg-2",
      particle: { type: "petal", rate: 1 },
      lines: [
        "Terima kasih…",
        "Sudah berjalan sejauh ini.",
        "Menemani setiap halaman.",
        "Sampai halaman terakhir."
      ]
    },
    {
      title: "The Meaning of Hanami",
      note: "Sakura bermekaran, lalu perlahan berguguran",
      bg: "bg-3",
      particle: { type: "petal", rate: 1.25 },
      lines: [
        "Tahukah kamu…",
        "Di Jepang, Hanami berarti menikmati indahnya bunga sakura.",
        "Tapi orang-orang juga tahu…",
        "Bahwa bunga itu tidak akan mekar selamanya."
      ]
    },
    {
      title: "Impermanence",
      note: "Langit sore yang tenang",
      bg: "bg-4",
      particle: { type: "none" },
      lines: [
        "Mungkin…",
        "Memang tidak ada yang benar-benar abadi.",
        "Bahkan musim pun berganti.",
        "Waktu terus berjalan.",
        "Orang-orang pun bertumbuh."
      ]
    },
    {
      title: "The Warmth",
      note: "Warna semakin hangat, atmosfer lembut",
      bg: "bg-5",
      particle: { type: "bokeh", rate: 1 },
      lines: [
        "Tapi…",
        "Kehangatan tidak selalu ikut pergi.",
        "Kadang…",
        "Ia tinggal.",
        "Di dalam ingatan."
      ]
    },
    {
      title: "The Wish",
      note: "Bagian paling personal",
      bg: "bg-6",
      particle: { type: "star" },
      lines: [
        "Aku tidak tahu…",
        "Apa yang akan terjadi nanti.",
        "Tapi…",
        "Aku berharap…",
        "Kamu selalu menemukan alasan untuk tersenyum.",
        "Untuk terus melangkah.",
        "Dan untuk tetap menjadi dirimu sendiri."
      ]
    },
    {
      title: "Goodbye",
      note: "Kelopak sakura tinggal sedikit",
      bg: "bg-7",
      particle: { type: "petal", rate: 0.35 },
      lines: [
        "Kalau suatu hari nanti…",
        "Kamu kembali ke sini.",
        "Semoga…",
        "Kamu datang dengan lebih banyak kebahagiaan…",
        "Daripada terakhir kali."
      ]
    },
    {
      title: "Signature",
      note: "Layar putih",
      bg: "bg-8",
      particle: { type: "none" },
      signature: true,
      lines: ["Thank you,", "for reading Hanami.", "— Raela Seraphine"]
    },
    {
      title: "Ending Epilogue",
      note: "",
      bg: "bg-9",
      particle: { type: "none" },
      isEnding: true,
      lines: ["(Semua perlahan menghilang.)"]
    }
  ];

  /* ---------------------------------------------------------
     2) URL halaman End Credits — ganti sesuai link kamu
     --------------------------------------------------------- */
  var END_CREDITS_URL = "endcredits.html";

  /* ---------------------------------------------------------
     3) Deteksi perangkat low-end / preferensi hemat gerakan
     --------------------------------------------------------- */
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lowPower =
    reduceMotion ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4);

  var MAX_PARTICLES = lowPower ? 6 : 14;
  var SPAWN_MS = lowPower ? 950 : 480;
  var STAR_COUNT = lowPower ? 14 : 34;

  /* ---------------------------------------------------------
     4) Ambil elemen
     --------------------------------------------------------- */
  var stage = document.getElementById("stage");
  var bgLayer = document.getElementById("bgLayer");
  var particleLayer = document.getElementById("particleLayer");
  var progressRail = document.getElementById("progressRail");
  var skipBtn = document.getElementById("skipBtn");
  var sceneFrame = document.querySelector(".scene-frame");
  var sceneTag = document.getElementById("sceneTag");
  var sceneNum = document.getElementById("sceneNum");
  var sceneTitleLabel = document.getElementById("sceneTitleLabel");
  var sceneNote = document.getElementById("sceneNote");
  var textWell = document.getElementById("textWell");
  var controlBar = document.getElementById("controlBar");
  var hint = document.getElementById("hint");
  var nextBtn = document.getElementById("nextBtn");

  /* ---------------------------------------------------------
     5) State
     --------------------------------------------------------- */
  var sceneIndex = -1;
  var lineIndex = 0;
  var transitioning = false;
  var finalButtonShown = false;
  var spawnTimer = null;

  /* ---------------------------------------------------------
     6) Progress rail
     --------------------------------------------------------- */
  function buildProgressRail() {
    SCENES.forEach(function () {
      var seg = document.createElement("div");
      seg.className = "seg";
      progressRail.appendChild(seg);
    });
  }

  function updateProgressRail(idx) {
    var segs = progressRail.children;
    for (var i = 0; i < segs.length; i++) {
      segs[i].classList.toggle("done", i < idx);
      segs[i].classList.toggle("current", i === idx);
    }
  }

  /* ---------------------------------------------------------
     7) Partikel (kelopak / bokeh / bintang)
     --------------------------------------------------------- */
  function clearParticles() {
    if (spawnTimer) {
      clearInterval(spawnTimer);
      spawnTimer = null;
    }
    while (particleLayer.firstChild) {
      particleLayer.removeChild(particleLayer.firstChild);
    }
  }

  function spawnFallingParticle(type) {
    if (particleLayer.children.length >= MAX_PARTICLES) return;
    var el = document.createElement("div");
    el.className = "particle " + type;
    el.style.left = Math.random() * 100 + "%";
    var duration = type === "petal" ? 7 + Math.random() * 5 : 6 + Math.random() * 6;
    el.style.animationDuration = duration.toFixed(2) + "s";
    el.style.setProperty("--drift", Math.round(Math.random() * 80 - 40) + "px");
    if (type === "bokeh") {
      el.style.setProperty("--size", (6 + Math.random() * 10).toFixed(1) + "px");
    }
    el.addEventListener("animationend", function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    particleLayer.appendChild(el);
  }

  function spawnStars(count) {
    for (var i = 0; i < count; i++) {
      var el = document.createElement("div");
      el.className = "particle star";
      el.style.left = Math.random() * 100 + "%";
      el.style.top = Math.random() * 85 + "%";
      el.style.animationDuration = 2 + Math.random() * 3 + "s";
      el.style.animationDelay = Math.random() * 3 + "s";
      particleLayer.appendChild(el);
    }
  }

  function startParticles(scene) {
    clearParticles();
    var p = scene.particle;
    if (!p || p.type === "none") return;

    if (p.type === "star") {
      spawnStars(STAR_COUNT);
      return;
    }

    var interval = SPAWN_MS / (p.rate || 1);
    spawnTimer = setInterval(function () {
      if (document.hidden) return; // hemat baterai saat tab tidak aktif
      spawnFallingParticle(p.type);
    }, interval);
  }

  /* ---------------------------------------------------------
     8) Masuk ke sebuah scene
     --------------------------------------------------------- */
  function enterScene(idx) {
    transitioning = true;
    sceneIndex = idx;
    lineIndex = 0;
    finalButtonShown = false;

    var scene = SCENES[idx];

    // fade out dulu
    bgLayer.classList.remove("visible");
    textWell.innerHTML = "";
    sceneTag.classList.remove("fade-hide");
    controlBar.classList.remove("fade-hide");

    var existingFinal = sceneFrame.querySelector(".final-btn");
    if (existingFinal) existingFinal.remove();

    setTimeout(function () {
      bgLayer.className = "bg-layer " + scene.bg;
      sceneNum.textContent = String(idx + 1).padStart(2, "0");
      sceneTitleLabel.textContent = scene.title;
      sceneNote.textContent = scene.note || "";

      requestAnimationFrame(function () {
        bgLayer.classList.add("visible");
      });

      updateProgressRail(idx);
      startParticles(scene);
      updateHint();

      transitioning = false;

      // beri jeda sejenak sebelum baris pertama muncul
      setTimeout(revealNextLine, 450);
    }, 500);
  }

  /* ---------------------------------------------------------
     9) Menampilkan baris teks satu per satu
     --------------------------------------------------------- */
  function revealNextLine() {
    var scene = SCENES[sceneIndex];
    if (lineIndex >= scene.lines.length) return;

    var p = document.createElement("p");
    p.className = "line" + (scene.signature ? " signature" : "");
    if (scene.signature && lineIndex === scene.lines.length - 1) {
      p.classList.add("mark");
    }
    p.textContent = scene.lines[lineIndex];
    textWell.appendChild(p);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        p.classList.add("show");
      });
    });

    lineIndex++;
    updateHint();

    if (scene.isEnding && lineIndex >= scene.lines.length) {
      scheduleEndingHold();
    }
  }

  function updateHint() {
    var scene = SCENES[sceneIndex];
    if (!scene) return;
    if (lineIndex < scene.lines.length) {
      hint.textContent = "Ketuk layar untuk lanjut";
    } else if (sceneIndex < SCENES.length - 1) {
      hint.textContent = "Lanjut ke scene berikutnya";
    } else {
      hint.textContent = "";
    }
  }

  /* ---------------------------------------------------------
     10) Alur maju (dipanggil dari tombol / tap / keyboard)
     --------------------------------------------------------- */
  function advance() {
    if (transitioning) return;

    if (sceneIndex === -1) {
      enterScene(0);
      return;
    }

    var scene = SCENES[sceneIndex];

    if (scene.isEnding) return; // alur ending berjalan otomatis, lihat scheduleEndingHold()

    if (lineIndex < scene.lines.length) {
      revealNextLine();
    } else if (sceneIndex < SCENES.length - 1) {
      enterScene(sceneIndex + 1);
    }
  }

  /* ---------------------------------------------------------
     11) Scene terakhir: hening lalu tombol "Lanjut ke End Credits"
     --------------------------------------------------------- */
  function scheduleEndingHold() {
    setTimeout(function () {
      var lines = textWell.querySelectorAll(".line");
      lines.forEach(function (l) {
        l.classList.remove("show");
        l.classList.add("fade-out");
      });
      sceneTag.classList.add("fade-hide");
      controlBar.classList.add("fade-hide");

      setTimeout(showFinalButton, 2400);
    }, 1200);
  }

  function showFinalButton() {
    if (finalButtonShown) return;
    finalButtonShown = true;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "final-btn";
    btn.innerHTML = "🌌&nbsp;<span>Lanjut ke End Credits</span>";
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      goToEndCredits();
    });
    sceneFrame.appendChild(btn);
    requestAnimationFrame(function () {
      btn.classList.add("show");
    });
  }

  function goToEndCredits() {
    clearParticles();
    window.location.href = END_CREDITS_URL;
  }

  /* ---------------------------------------------------------
     13) Event listeners
     --------------------------------------------------------- */
  nextBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    advance();
  });

  skipBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    // langsung menuju scene terakhir (Ending Epilogue)
    enterScene(SCENES.length - 1);
  });

  stage.addEventListener("click", function (e) {
    if (e.target.closest("button")) return;
    advance();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
      e.preventDefault();
      advance();
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) clearParticles();
    else if (sceneIndex > -1) startParticles(SCENES[sceneIndex]);
  });

  /* ---------------------------------------------------------
     14) Mulai!
     --------------------------------------------------------- */
  buildProgressRail();
  enterScene(0);
})();