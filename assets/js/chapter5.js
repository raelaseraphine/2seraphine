/* =========================================================
   CHAPTER V — "Things I Never Said"
   Vanilla JS only, no library. Dibikin ringan:
   - IntersectionObserver buat reveal (sekali muncul lalu unobserve)
   - requestAnimationFrame + passive listener buat progress bar
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1) Scroll-reveal lewat IntersectionObserver
     --------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-line");

  // kasih delay bertahap (stagger) berdasarkan data-delay,
  // atau urutan otomatis kalau dalam satu .line-stack
  revealEls.forEach(function (el) {
    var delay = el.getAttribute("data-delay");
    if (delay === null) {
      var siblings = el.parentElement
        ? Array.prototype.filter.call(
            el.parentElement.children,
            function (c) { return c.classList.contains("reveal-line"); }
          )
        : [];
      var idx = siblings.indexOf(el);
      delay = idx >= 0 ? idx : 0;
    }
    el.style.setProperty("--d", delay);
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target); // sekali aja, hemat kerja di scroll berikutnya
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // fallback browser lama: langsung tampilkan semua
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------------------------------------------------------
     2) Progress bar — dihitung pakai rAF biar gak nge-block scroll
     --------------------------------------------------------- */
  var progressFill = document.getElementById("progressFill");
  var ticking = false;

  function updateProgress() {
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var max = (doc.scrollHeight - window.innerHeight) || 1;
    var pct = Math.min(100, Math.max(0, (scrollTop / max) * 100));
    if (progressFill) progressFill.style.width = pct + "%";
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    },
    { passive: true }
  );
  updateProgress();

  /* ---------------------------------------------------------
     3) Scroll cue (panah di Scene 01) -> turun ke Scene 02
     --------------------------------------------------------- */
  var scrollCue = document.getElementById("scrollCue");
  var scene02 = document.getElementById("scene-02");
  if (scrollCue && scene02) {
    scrollCue.addEventListener("click", function () {
      scene02.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ---------------------------------------------------------
     4) Amplop interaktif di Scene 02
     --------------------------------------------------------- */
  var envelope = document.getElementById("envelopeMain");
  if (envelope) {
    envelope.addEventListener("click", function () {
      var isOpen = envelope.getAttribute("aria-expanded") === "true";
      envelope.setAttribute("aria-expanded", String(!isOpen));
    });
  }

  /* ---------------------------------------------------------
     5) Tombol "Continue to Chapter VI"
     --------------------------------------------------------- */
  var continueBtn = document.getElementById("continueBtn");
  var toast = document.getElementById("toast");
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-show");
    }, 2600);
  }
  /* tombol Continue to Chapter VI */
  function initContinueButton() {
    var continueBtn = document.getElementById("continueBtn");
    if (!continueBtn) return;
    // href sudah diisi link asli (chapter6.html), browser akan
    // navigasi otomatis tanpa perlu JS tambahan.
  }

  // Ganti fungsi ini kalau Chapter VI kamu sudah punya halaman/link sendiri.
  // Contoh: window.location.href = "chapter-vi.html";
  window.goToChapterVI = function (event) {
    var href = continueBtn ? continueBtn.getAttribute("href") : "";
    var hasRealDestination = href && href !== "#" && href !== "#chapter-vi";

    if (!hasRealDestination) {
      if (event) event.preventDefault();
      showToast("Chapter VI akan segera hadir 🌙");
      return;
    }
    // kalau href sudah diisi link asli, biarkan browser navigasi seperti biasa
  };

  if (continueBtn) {
    continueBtn.addEventListener("click", window.goToChapterVI);
  }

  /* ---------------------------------------------------------
     6) Bottom nav: Prev / Next antar scene + progress
     --------------------------------------------------------- */
  var allScenes = Array.prototype.slice.call(document.querySelectorAll(".scene"));
  var totalScenes = allScenes.length;
  var currentSceneIndex = 0;

  var navPrevBtn = document.getElementById("prevBtn");
  var navNextBtn = document.getElementById("nextBtn");
  var navProgressEl = document.getElementById("navProgress");

  function updateNavProgress() {
    if (!navProgressEl) return;
    var num = String(currentSceneIndex + 1).padStart(2, "0");
    var totalStr = String(totalScenes).padStart(2, "0");
    navProgressEl.textContent = num + " / " + totalStr;

    if (navPrevBtn) navPrevBtn.disabled = currentSceneIndex === 0;
    if (navNextBtn) navNextBtn.disabled = currentSceneIndex === totalScenes - 1;
  }

  function scrollToScene(index) {
    index = Math.max(0, Math.min(totalScenes - 1, index));
    allScenes[index].scrollIntoView({ behavior: "smooth", block: "start" });
    currentSceneIndex = index;
    updateNavProgress();
  }

  if (navPrevBtn) {
    navPrevBtn.addEventListener("click", function () {
      scrollToScene(currentSceneIndex - 1);
    });
  }
  if (navNextBtn) {
    navNextBtn.addEventListener("click", function () {
      scrollToScene(currentSceneIndex + 1);
    });
  }

  // update currentSceneIndex otomatis mengikuti scroll posisi (pakai observer ringan)
  if ("IntersectionObserver" in window) {
    var navIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var idx = allScenes.indexOf(entry.target);
            if (idx !== -1) {
              currentSceneIndex = idx;
              updateNavProgress();
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    allScenes.forEach(function (s) { navIO.observe(s); });
  }

  updateNavProgress();
})();