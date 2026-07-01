/* ==========================================================
   HANAMI PROJECT — Chapter IV
   Full Rombak: Scrapbook Flow
========================================================== */

/* ==========================================================
   DATA
========================================================== */

const recipientName = "Mawar";

const introStory = [
    "Sebelum kita melanjutkan...",
    "Aku ingin mengajakmu mendengarkan sesuatu.",
    "Lagu ini...",
    "Entah kenapa...",
    "Selalu berhasil mengingatkanku padamu."
];

const museumStory = [
    "Beberapa hal yang kamu suka...",
    "yang tanpa sadar selalu kuperhatikan.",
];

const exhibits = [
    {
        num: "01",
        category: "Hewan Kesukaan 🐾",
        title: "Kucing.",
        desc: "Entah sejak kapan, kamu dan kucing punya vibes yang sama. Lembut, menggemaskan, dan kadang suka menghilang entah ke mana. (PARAH BENER NGILANG NGILANG).",
        image: "../assets/img/cat.jpg",
        caption: "meow favorite ♡",
        decos: [
            { type: "flower", top: "8%",  right: "5%",  char: "✿" },
            { type: "flower", bottom: "12%", left: "4%", char: "❀" },
            { type: "star",   top: "20%", left: "12%",  char: "✦" },
        ]
    },
    {
        num: "02",
        category: "Minuman Kesukaan ☕",
        title: "Banana Milk.",
        desc: "Manisnya pas, lembutnya bikin nyaman. Seperti kamu yang selalu berhasil membuat hari biasa jadi lebih menyenangkan.",
        image: "../assets/img/banana-milk.jpg",
        caption: "simple, but favorite ♡",
        decos: [
            { type: "flower", top: "5%",  left: "6%",   char: "❀" },
            { type: "star",   bottom: "15%", right: "8%", char: "✧" },
            { type: "line",   top: "75%", left: "30%"  },
        ]
    },
    {
        num: "03",
        category: "Makanan Kesukaan 🍴",
        title: "Tiramisu.",
        desc: "Rasanya bikin happy. Seperti pelukan hangat di hari yang capek. Dan ya, kamu selalu punya cara untuk bikin hal sederhana jadi spesial.",
        image: "../assets/img/tiramisu.jpg",
        caption: "sweet, rich, perfect ♡",
        decos: [
            { type: "flower", bottom: "8%", right: "6%",  char: "✿" },
            { type: "star",   top: "12%",  right: "14%", char: "✦" },
        ]
    },
    {
        num: "04",
        category: "Musik Kesukaan 🎵",
        title: "Perunggu — ini abadi.",
        desc: "Liriknya sederhana, tapi dalem. Seperti kamu yang nggak banyak bicara, tapi selalu punya arti.",
        image: "../assets/img/perunggu.jpg",
        caption: "sounds like you ♡",
        decos: [
            { type: "flower", top: "6%",   left: "5%",   char: "♪" },
            { type: "flower", bottom: "10%", right: "4%", char: "♫" },
            { type: "star",   top: "35%",  left: "8%",   char: "✧" },
        ]
    },
    {
        num: "05",
        category: "Hal yang Disukai 🌸",
        title: "Fresh flower & menikmati senja.",
        desc: "Karena kamu punya cara sendiri untuk menemukan keindahan di hal-hal yang sederhana.",
        image: "../assets/img/flower.jpg",
        caption: "fresh, beautiful, timeless ♡",
        decos: [
            { type: "flower", top: "10%",  right: "6%",  char: "❀" },
            { type: "flower", bottom: "5%", left: "5%",  char: "✿" },
            { type: "star",   top: "55%",  right: "10%", char: "✦" },
        ]
    },
    {
        num: "06",
        category: "Tempat Favorit 🌅",
        title: "Golden Sunset.",
        desc: "Menikmati senja di tempat yang indah. Kedengarannya sederhana — tapi setiap kali membayangkannya, rasanya hangat.",
        image: "../assets/img/sunset.jpg",
        caption: "golden hour lover ♡",
        decos: [
            { type: "flower", top: "8%",   left: "6%",   char: "✿" },
            { type: "star",   bottom: "14%", right: "5%", char: "✧" },
            { type: "line",   top: "20%",  right: "12%" },
        ]
    },
    {
        num: "07",
        category: "Hobi 🎨",
        title: "Bernyanyi, melukis.",
        desc: "Dua hal yang membuatmu bebas. Karena lewat suara dan warna, kamu bisa menjadi dirimu sendiri.",
        image: "../assets/img/hobby.png",
        caption: "your kind of free ♡",
        decos: [
            { type: "flower", bottom: "8%", left: "5%",  char: "❀" },
            { type: "star",   top: "10%",  right: "8%",  char: "✦" },
        ]
    },
    {
        num: "08",
        category: "Keinginan yang Paling Diinginkan ☆",
        title: "I don't know yet.",
        desc: "Classic. Jawaban paling aman dan paling jujur di muka bumi. 10/10 for honesty — dan semesta masih punya banyak hal yang sedang disiapkan untukmu. Btw JAWABANNYA NGESELINN.",
        image: "../assets/img/question.jpg",
        caption: "plot twist incoming ♡",
        decos: [
            { type: "flower", top: "6%",   right: "5%",  char: "✿" },
            { type: "flower", bottom: "10%", left: "4%", char: "❀" },
            { type: "star",   top: "40%",  right: "8%",  char: "✧" },
        ]
    }
];

const reflections = [
    "Lucu ya...",
    "Awalnya ini cuma daftar hal yang kamu suka.",
    "Tapi lama-lama...",
    "Semuanya jadi hal-hal yang selalu mengingatkanku padamu.",
    "Mungkin memang seperti itulah cara seseorang tinggal di ingatan orang lain."
];

/* ==========================================================
   DOM
========================================================== */

const screenIntro       = document.getElementById("screenIntro");
const introText         = document.getElementById("introText");

const screenMusic       = document.getElementById("screenMusic");
const playBtn           = document.getElementById("playBtn");
const musicProgress     = document.getElementById("musicProgress");

const screenMuseumIntro = document.getElementById("screenMuseumIntro");
const museumIntroText   = document.getElementById("museumIntroText");

const screenExhibit     = document.getElementById("screenExhibit");
const miniPlayer        = document.getElementById("miniPlayer");
const miniDisc          = document.getElementById("miniDisc");
const exhibitCounter    = document.getElementById("exhibitCounter");
const counterNum        = document.getElementById("counterNum");
const exhibitProgress   = document.getElementById("exhibitProgress");
const progressFill      = document.getElementById("progressFill");
const exhibitCard       = document.getElementById("exhibitCard");
const cardDecos         = document.getElementById("cardDecos");
const polaroidWrap      = document.getElementById("polaroidWrap");
const exhibitImg        = document.getElementById("exhibitImg");
const polaroidCaption   = document.getElementById("polaroidCaption");
const stickyWrap        = document.getElementById("stickyWrap");
const stickyNum         = document.getElementById("stickyNum");
const stickyCategory    = document.getElementById("stickyCategory");
const stickyTitle       = document.getElementById("stickyTitle");
const stickyDesc        = document.getElementById("stickyDesc");
const nextBtn           = document.getElementById("nextBtn");
const nextBtnText       = document.getElementById("nextBtnText");

const screenReflection  = document.getElementById("screenReflection");
const reflectionText    = document.getElementById("reflectionText");

const screenEnding      = document.getElementById("screenEnding");
const endingTitle       = document.getElementById("endingTitle");
const endingNote        = document.querySelector(".ending-note");
const endingText        = document.getElementById("endingText");
const endingPolaroids   = document.querySelector(".ending-polaroids");
const endingFooter      = document.querySelector(".ending-footer");
const nextChapter       = document.getElementById("nextChapter");
const endingBoard       = document.querySelector(".ending-board");

const bgMusic           = document.getElementById("bgMusic");
const siteHeader        = document.getElementById("siteHeader");

/* ==========================================================
   STATE
========================================================== */

let introIdx      = 0;
let museumIdx     = 0;
let exhibitIdx    = 0;
let reflectIdx    = 0;
let typingTimer   = null;
let progressTimer = null;
let musicPlaying  = false;

const EXHIBIT_DURATION = 0; // 0 = manual only (user clicks next)

/* ==========================================================
   CURSOR
========================================================== */

const cursorDot  = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + "px";
    cursorDot.style.top  = my + "px";
});

(function ringLoop() {
    rx += (mx - rx) * .11;
    ry += (my - ry) * .11;
    cursorRing.style.left = rx + "px";
    cursorRing.style.top  = ry + "px";
    requestAnimationFrame(ringLoop);
})();

/* ==========================================================
   BACKGROUND PETALS
========================================================== */

function spawnBgPetals() {
    const wrap = document.getElementById("bgPetals");
    const chars = ["❀", "✿", "❁", "✾"];
    for (let i = 0; i < 14; i++) {
        const el = document.createElement("span");
        el.className = "bg-petal";
        el.textContent = chars[Math.floor(Math.random() * chars.length)];
        el.style.left = Math.random() * 100 + "vw";
        el.style.animationDuration = (18 + Math.random() * 20) + "s";
        el.style.animationDelay    = (Math.random() * 20) + "s";
        el.style.fontSize          = (12 + Math.random() * 14) + "px";
        wrap.appendChild(el);
    }
}

/* ==========================================================
   SCREEN TRANSITIONS
========================================================== */

function showScreen(el) {
    el.classList.remove("hidden");
    requestAnimationFrame(() => el.classList.remove("fade-out"));
}

function hideScreen(el, cb) {
    el.classList.add("fade-out");
    setTimeout(() => {
        el.classList.add("hidden");
        el.classList.remove("fade-out");
        if (cb) cb();
    }, 600);
}

/* ==========================================================
   TYPEWRITER ENGINE
========================================================== */

function typeWriter(el, text, onDone) {
    clearTimeout(typingTimer);
    el.textContent = "";
    el.classList.remove("hide");
    el.classList.add("show");

    let i = 0;
    function write() {
        if (i < text.length) {
            el.textContent += text.charAt(i++);
            typingTimer = setTimeout(write, 30);
        } else {
            typingTimer = setTimeout(onDone, 1100);
        }
    }
    write();
}

function hideSentence(el, cb) {
    el.classList.remove("show");
    el.classList.add("hide");
    setTimeout(cb, 380);
}

/* ==========================================================
   INTRO FLOW
========================================================== */

function playIntro() {
    if (introIdx >= introStory.length) {
        hideSentence(introText, () => {
            hideScreen(screenIntro, showMusicScreen);
        });
        return;
    }
    typeWriter(introText, introStory[introIdx], () => {
        hideSentence(introText, () => {
            introIdx++;
            playIntro();
        });
    });
}

/* ==========================================================
   MUSIC SCREEN
========================================================== */

function showMusicScreen() {
    showScreen(screenMusic);
    animateMusicBar();
}

function animateMusicBar() {
    let w = 0;
    const t = setInterval(() => {
        w = (w + .3) % 100;
        musicProgress.style.width = w + "%";
    }, 80);
}

playBtn?.addEventListener("click", () => {
    if (musicPlaying) return;
    musicPlaying = true;
    playBtn.disabled = true;
    playBtn.textContent = "♪ Sedang Diputar...";
    startMusic();
    setTimeout(() => {
        hideScreen(screenMusic, startMuseumIntro);
    }, 900);
});

/* ==========================================================
   MUSIC ENGINE
========================================================== */

function startMusic() {
    if (!bgMusic) return;
    bgMusic.volume = 0;
    bgMusic.loop   = true;
    bgMusic.play().catch(() => {});
    let v = 0;
    const fi = setInterval(() => {
        v = Math.min(v + .025, .45);
        bgMusic.volume = v;
        if (v >= .45) clearInterval(fi);
    }, 100);
}

function stopMusic() {
    if (!bgMusic) return;
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

miniPlayer?.addEventListener("click", () => {
    if (!bgMusic) return;
    if (bgMusic.paused) { bgMusic.play(); miniDisc?.classList.remove("paused"); }
    else                { bgMusic.pause(); miniDisc?.classList.add("paused"); }
});

window.addEventListener("focus", () => { if (bgMusic && !bgMusic.paused) bgMusic.volume = .45; });
window.addEventListener("blur",  () => { if (bgMusic && !bgMusic.paused) bgMusic.volume = .15; });

/* ==========================================================
   MUSEUM INTRO
========================================================== */

function startMuseumIntro() {
    showScreen(screenMuseumIntro);
    playMuseumIntro();
}

function playMuseumIntro() {
    if (museumIdx >= museumStory.length) {
        hideSentence(museumIntroText, () => {
            hideScreen(screenMuseumIntro, startExhibits);
        });
        return;
    }
    typeWriter(museumIntroText, museumStory[museumIdx], () => {
        hideSentence(museumIntroText, () => {
            museumIdx++;
            playMuseumIntro();
        });
    });
}

/* ==========================================================
   EXHIBITS
========================================================== */

function startExhibits() {
    showScreen(screenExhibit);
    miniPlayer.classList.remove("hidden");
    setTimeout(() => miniPlayer.classList.add("show"), 100);
    exhibitCounter.classList.remove("hidden");
    setTimeout(() => exhibitCounter.classList.add("show"), 100);
    exhibitProgress.classList.remove("hidden");
    setTimeout(() => exhibitProgress.classList.add("show"), 100);
    exhibitIdx = 0;
    loadExhibit();
}

function loadExhibit() {
    if (exhibitIdx >= exhibits.length) {
        // all done — go to reflection
        exitExhibit(() => {
            hideScreen(screenExhibit, startReflection);
        });
        return;
    }

    const item = exhibits[exhibitIdx];

    // counter
    counterNum.textContent = item.num + " / 08";

    // even/odd layout
    exhibitCard.classList.toggle("even", exhibitIdx % 2 === 1);

    // decos
    cardDecos.innerHTML = "";
    item.decos?.forEach(d => {
        const el = document.createElement("div");
        el.className = "deco-" + d.type;
        if (d.top)    el.style.top    = d.top;
        if (d.bottom) el.style.bottom = d.bottom;
        if (d.left)   el.style.left   = d.left;
        if (d.right)  el.style.right  = d.right;
        if (d.char)   el.textContent  = d.char;
        cardDecos.appendChild(el);
    });

    // content
    stickyNum.textContent      = "0" + item.num + "  —";
    stickyCategory.textContent = item.category;
    stickyTitle.textContent    = item.title;
    stickyDesc.textContent     = item.desc;
    polaroidCaption.textContent = item.caption;

    // last exhibit — change button text
    if (exhibitIdx === exhibits.length - 1) {
        nextBtnText.textContent = "Lihat Penutup →";
    } else {
        nextBtnText.textContent = "Selanjutnya →";
    }

    // reset progress bar
    progressFill.style.transition = "none";
    progressFill.style.width = "0%";

    // image load then animate in
    exhibitCard.classList.remove("show", "exit-left");

    function showCard() {
        requestAnimationFrame(() => {
            exhibitCard.classList.add("show");
            // progress bar animates — purely visual, no auto-advance
            requestAnimationFrame(() => {
                progressFill.style.transition = "width 6s linear";
                progressFill.style.width = "100%";
            });
        });
    }

    exhibitImg.onload  = showCard;
    exhibitImg.onerror = showCard;
    exhibitImg.src = item.image;
    exhibitImg.alt = item.title;
}

function exitExhibit(cb) {
    exhibitCard.classList.remove("show");
    exhibitCard.classList.add("exit-left");
    progressFill.style.transition = "none";
    progressFill.style.width = "0%";
    setTimeout(cb, 450);
}

nextBtn?.addEventListener("click", () => {
    exitExhibit(() => {
        exhibitIdx++;
        loadExhibit();
    });
});

/* keyboard shortcut */
document.addEventListener("keydown", e => {
    if (!screenExhibit.classList.contains("hidden") && e.code === "Space") {
        e.preventDefault();
        nextBtn.click();
    }
});

/* ==========================================================
   REFLECTION
========================================================== */

function startReflection() {
    showScreen(screenReflection);
    reflectIdx = 0;
    playReflection();
}

function playReflection() {
    if (reflectIdx >= reflections.length) {
        hideSentence(reflectionText, () => {
            hideScreen(screenReflection, showEnding);
        });
        return;
    }

    reflectionText.classList.remove("show");
    reflectionText.classList.add("hide");

    setTimeout(() => {
        typeWriter(reflectionText, reflections[reflectIdx], () => {
            hideSentence(reflectionText, () => {
                reflectIdx++;
                playReflection();
            });
        });
    }, 300);
}

/* ==========================================================
   ENDING
========================================================== */

function showEnding() {
    showScreen(screenEnding);

    setTimeout(() => endingBoard.classList.add("show"), 100);

    endingTitle.textContent = `Dan mungkin, ${recipientName}...`;
    setTimeout(() => endingTitle.classList.add("show"), 400);

    endingText.innerHTML = `
        Aku memang tidak bisa mengingat semua percakapan kita.
        <br><br>
        Tapi anehnya... aku justru mengingat hal-hal kecil yang kamu sukai.
        <br><br>
        Lagu favoritmu. Banana Milk. Tiramisu. Senja. Bunga.
        Bahkan jawaban <b>"I don't know yet."</b>
        masih berhasil membuatku tersenyum setiap kali mengingatnya.
        <br><br>
        Mungkin... memang begitulah cara seseorang tinggal di hati orang lain.
    `;
    setTimeout(() => endingNote.classList.add("show"), 700);
    setTimeout(() => endingPolaroids.classList.add("show"), 1000);
    setTimeout(() => endingFooter.classList.add("show"), 1200);
    setTimeout(() => nextChapter.classList.add("show"), 1500);
}

nextChapter?.addEventListener("click", () => {
    stopMusic();
    document.body.classList.add("page-fade");
    setTimeout(() => { window.location.href = "../chapters/chapter5.html"; }, 1200);
});

/* ==========================================================
   PRELOAD
========================================================== */

function preload() {
    exhibits.forEach(ex => {
        const img = new Image();
        img.src = ex.image;
    });
}

/* ==========================================================
   INIT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    spawnBgPetals();
    preload();
    playIntro();
});