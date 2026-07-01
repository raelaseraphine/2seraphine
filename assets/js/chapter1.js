/* =========================
   Respect "reduce motion" setting
========================= */
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

/* =========================
   Intro Lines
========================= */
const lines = [
    "Setiap orang...",
    "memiliki cerita.",
    "Dan setiap cerita...",
    "selalu memiliki seseorang.",
    "Hari ini...",
    "aku ingin mengajakmu melihat sebuah cerita."
];
const text = document.getElementById("text");
const finalSection = document.getElementById("final");
let currentIndex = 0;
let introTimeouts = [];

/* =========================
   Text Sequence
========================= */
function showNextLine() {
    if (currentIndex >= lines.length) {
        revealFinal();
        return;
    }
    text.textContent = lines[currentIndex];
    text.classList.add("show");
    const t = setTimeout(() => {
        text.classList.remove("show");
        currentIndex++;
        const t2 = setTimeout(showNextLine, 800);
        introTimeouts.push(t2);
    }, 2200);
    introTimeouts.push(t);
}

function revealFinal() {
    text.style.display = "none";
    finalSection.classList.remove("hide");
    finalSection.style.opacity = "1";
    finalSection.style.transform = "translateY(0)";
    removeSkipButton();
}

/* =========================
   Start Intro
========================= */
if (prefersReducedMotion) {
    // Skip straight to the final reveal, no animated sequence at all.
    revealFinal();
} else {
    const startTimeout = setTimeout(showNextLine, 1200);
    introTimeouts.push(startTimeout);
}

/* =========================
   Skip Button
   Injected from JS so no HTML edits are needed.
   Lets repeat visitors jump straight to the reveal.
========================= */
let skipBtn = null;

function createSkipButton() {
    if (prefersReducedMotion) return; // nothing to skip, already instant

    skipBtn = document.createElement("button");
    skipBtn.type = "button";
    skipBtn.className = "skip-btn";
    skipBtn.textContent = "Lewati →";
    skipBtn.setAttribute("aria-label", "Lewati animasi pembuka");

    skipBtn.addEventListener("click", () => {
        introTimeouts.forEach((id) => clearTimeout(id));
        introTimeouts = [];
        revealFinal();
    });

    document.body.appendChild(skipBtn);
}

function removeSkipButton() {
    if (!skipBtn) return;
    skipBtn.classList.add("fade-out");
    setTimeout(() => skipBtn && skipBtn.remove(), 400);
}

createSkipButton();

/* =========================
   Falling Petals
========================= */
let petalInterval = null;

function startPetals() {
    if (prefersReducedMotion) return; // CSS already hides .petal, but skip spawning too

    // Slightly slower spawn rate on small/likely low-end screens to save battery/CPU.
    const isSmallScreen = window.matchMedia("(max-width:768px)").matches;
    const spawnRate = isSmallScreen ? 900 : 600;

    petalInterval = setInterval(() => {
        const petal = document.createElement("div");
        petal.className = "petal";
        petal.textContent = Math.random() > 0.5 ? "🌸" : "❀";
        petal.style.left = `${Math.random() * 100}vw`;
        const duration = 8 + Math.random() * 6;
        petal.style.animationDuration = `${duration}s`;

        document.body.appendChild(petal);

        // Remove the petal exactly when its own animation finishes,
        // instead of a fixed timeout that didn't match the random duration.
        petal.addEventListener("animationend", () => petal.remove());
        // Fallback in case animationend doesn't fire for some reason
        // (e.g. tab was backgrounded): clean up a bit after expected end.
        setTimeout(() => petal.remove(), duration * 1000 + 1000);
    }, spawnRate);
}

startPetals();

/* =========================
   Pause petal spawning when the tab isn't visible
   (saves battery/CPU on phones when the screen is off or app is backgrounded)
========================= */
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        if (petalInterval) {
            clearInterval(petalInterval);
            petalInterval = null;
        }
    } else if (!petalInterval) {
        startPetals();
    }
});