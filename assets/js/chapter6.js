/* ==========================================================================
   HANAMI — Chapter VI: The Last Page
   Vanilla JS only — no dependencies, kept light for low-end devices.
   Navigation model: one slide visible at a time, controlled by
   Next/Prev buttons, arrow keys, or a swipe.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isSmallScreen = window.matchMedia("(max-width: 640px)").matches;

  var scenes = [];
  var currentIndex = 0;
  var total = 0;

  var prevBtn, nextBtn, navProgress, petalsLayer;

  /* ------------------------------------------------------------------ *
   * Stagger setup — give each scene's animated children a --i index
   * once, so the CSS transition-delay chain works when revealed.
   * ------------------------------------------------------------------ */
  function setStaggerIndexes(scene) {
    var staggerSelectors = ".line, .glyph, .chapter-card, .polaroid, .letter-line";
    var items = scene.querySelectorAll(staggerSelectors);
    items.forEach(function (el, i) {
      el.style.setProperty("--i", i);
    });
  }

  /* ------------------------------------------------------------------ *
   * Core slide controller
   * ------------------------------------------------------------------ */
  function goTo(index) {
    index = Math.max(0, Math.min(total - 1, index));
    if (index === currentIndex && scenes[index].classList.contains("active")) {
      updateNav();
      return;
    }

    scenes.forEach(function (scene, i) {
      scene.classList.toggle("active", i === index);
    });

    // trigger the reveal animation for the slide we just landed on
    requestAnimationFrame(function () {
      scenes[index].classList.add("in-view");
    });

    currentIndex = index;
    updatePetalHush();
    updateNav();
    maybeRevealEpilogueButton();
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  function updateNav() {
    var num = String(currentIndex + 1).padStart(2, "0");
    var totalStr = String(total).padStart(2, "0");
    navProgress.textContent = num + " / " + totalStr;

    prevBtn.disabled = currentIndex === 0;

    var isLast = currentIndex === total - 1;
    nextBtn.classList.toggle("is-hidden", isLast);
  }

  /* Hush the ambient petals during the quiet final scenes (10 & 11) */
  function updatePetalHush() {
    if (!petalsLayer) return;
    var sceneNumber = currentIndex + 1;
    petalsLayer.classList.toggle("hush", sceneNumber === 10 || sceneNumber === 11);
  }

  /* ------------------------------------------------------------------ *
   * Ambient sakura petals — generated once, animated purely by CSS.
   * Fewer petals on mobile; skipped entirely with reduced motion.
   * ------------------------------------------------------------------ */
  function initPetals() {
    petalsLayer = document.querySelector(".petals-global");
    if (!petalsLayer || reduceMotion) return;

    var count = isSmallScreen ? 6 : 14;
    var frag = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var petal = document.createElement("div");
      petal.className = "petal";

      var size = 8 + Math.random() * 8;
      var x = Math.random() * 100;
      var drift = (Math.random() * 120 - 60).toFixed(0);
      var dur = (10 + Math.random() * 10).toFixed(1);
      var delay = (Math.random() * dur).toFixed(1);

      petal.style.setProperty("--size", size.toFixed(1) + "px");
      petal.style.setProperty("--x", x.toFixed(1) + "%");
      petal.style.setProperty("--drift", drift + "px");
      petal.style.setProperty("--dur", dur + "s");
      petal.style.setProperty("--delay", "-" + delay + "s");

      frag.appendChild(petal);
    }

    petalsLayer.appendChild(frag);
  }

  /* ------------------------------------------------------------------ *
   * Epilogue button inside the final slide
   * ------------------------------------------------------------------ */
  function initEpilogueButton() {
    var btn = document.getElementById("epilogueBtn");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var href = btn.getAttribute("data-href") || "#";
      window.location.href = href;
    });
  }

  function maybeRevealEpilogueButton() {
    var isLast = currentIndex === total - 1;
    var btn = document.getElementById("epilogueBtn");
    if (!btn) return;

    if (isLast) {
      var delay = reduceMotion ? 400 : 1400;
      setTimeout(function () { btn.classList.add("show"); }, delay);
    } else {
      btn.classList.remove("show");
    }
  }

  /* ------------------------------------------------------------------ *
   * Input: buttons, keyboard, swipe
   * ------------------------------------------------------------------ */
  function initControls() {
    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);

    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { next(); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { prev(); }
    });

    var slides = document.getElementById("slides");
    if (!slides) return;

    var touchStartX = 0, touchStartY = 0;
    var SWIPE_THRESHOLD = 50;

    slides.addEventListener("touchstart", function (e) {
      var t = e.changedTouches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    }, { passive: true });

    slides.addEventListener("touchend", function (e) {
      var t = e.changedTouches[0];
      var dx = t.clientX - touchStartX;
      var dy = t.clientY - touchStartY;
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) { next(); } else { prev(); }
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    scenes = Array.prototype.slice.call(document.querySelectorAll(".scene"));
    total = scenes.length;
    scenes.forEach(setStaggerIndexes);

    prevBtn = document.getElementById("prevBtn");
    nextBtn = document.getElementById("nextBtn");
    navProgress = document.getElementById("navProgress");

    initPetals();
    initEpilogueButton();
    initControls();

    // show the first slide
    goTo(0);
  });
})();