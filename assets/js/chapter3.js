/* ==========================================================
   HANAMI PROJECT
   Chapter III • Little Things
   Part 1 — Setup & Initialization
========================================================== */

/* ==========================================================
   STORY DATA
========================================================== */

const story = [

    "Semakin lama mengenal seseorang...",

    "Semakin aku sadar...",

    "Yang paling melekat justru bukan hal-hal besar.",

    "Melainkan hal-hal kecil...",

    "Yang tanpa sadar menjadi ciri khasnya."

];

/* ==========================================================
   MEMORY DATA
========================================================== */

const memories = [

    {

        label: "Cara Memanggil",

        title: "KAA",

        description:
        "Entah kenapa, setiap melihat tulisan 'KAA', 'KA', atau 'Ka Ell', aku langsung tahu kalau itu kamu.",

        duration: 7000

    },

    {

        label: "Kebiasaan",

        title: "Kaca Pink G2G",

        description:
        "Mungkin buatmu itu hanya kaca kecil berwarna pink. Tapi entah kenapa, benda sederhana itu malah jadi salah satu hal pertama yang selalu kuingat darimu. (Inget banget pas kamu mamerin kaca itu😒)",

        duration: 10000

    },

    {

        label: "Sebuah Lagu",

        title: "Ours To Keep",

        description:
        "Ada masa ketika kamu hampir selalu menyanyikan lagu itu. Sampai akhirnya, setiap kali lagu itu terdengar, pikiranku otomatis mengingatmu.",

        duration: 9000

    },

    {

        label: "Sikap",

        title: "Pendengar yang Baik",

        description:
        "Saat aku bercerita, kamu tidak pernah terburu-buru memberi jawaban. Kamu lebih memilih mendengarkan, dan ternyata itu jauh lebih berarti daripada yang kamu kira.",

        duration: 10000

    },

    {

        label: "Sebuah Perjalanan",

        title: "Perjalanan Pulang",

        description:
        "Aku masih ingat perjalanan pulang setelah acara PMR. Sepanjang jalan kita hanya bercerita, tertawa, dan menikmati perjalanan yang terasa jauh lebih singkat dari biasanya.",

        duration: 7000

    }

];

/* ==========================================================
   REFLECTION DATA
========================================================== */

const reflections = [

    {

        text: "Lucunya...",

        duration: 2200

    },

    {

        text: "Semua itu terlihat sangat biasa.",

        duration: 2800

    },

    {

        text: "Tapi semakin lama aku mengingatnya...",

        duration: 3000

    },

    {

        text: "Aku sadar...",

        duration: 2200

    },

    {

        text: "Hal-hal kecil itulah yang akhirnya membuat seseorang begitu sulit dilupakan.",

        duration: 4200

    }

];

/* ==========================================================
   DOM ELEMENTS
========================================================== */

const sentence =
document.getElementById("sentence");

const storySection =
document.getElementById("storySection");

const memorySection =
document.getElementById("memorySection");

const memoryLabel =
document.getElementById("memoryLabel");

const memoryTitle =
document.getElementById("memoryTitle");

const memoryDescription =
document.getElementById("memoryDescription");

const reflectionSection =
document.getElementById("reflectionSection");

const reflectionText =
document.getElementById("reflectionText");

const transitionSection =
document.getElementById("transitionSection");

const transitionText =
document.querySelector(".transition-text");

const endingSection =
document.getElementById("endingSection");

const endingSubtitle =
document.getElementById("endingSubtitle");

const endingTitle =
document.getElementById("endingTitle");

const endingDescription =
document.getElementById("endingDescription");

const endingDivider =
document.getElementById("endingDivider");

const nextChapter =
document.getElementById("nextChapter");

const cursorLight =
document.getElementById("cursorLight");

const transitionOverlay =
document.getElementById("transitionOverlay");

const screenLoader =
document.getElementById("screenLoader");

const ambientSound =
document.getElementById("ambientSound");

const bgMusic =
document.getElementById("bgMusic");

/* ==========================================================
   GLOBAL STATE
========================================================== */

let storyIndex = 0;

let memoryIndex = 0;

let reflectionIndex = 0;

let isAnimating = false;

/* ==========================================================
   TIMING CONFIG
========================================================== */

const timing = {

    typingSpeed: 45,

    sentenceDelay: 1700,

    fadeDelay: 650,

    silentPause: 1000,

    memoryDelay: 1200,

    memoryPause: 1400,

    reflectionDelay: 1000,

    wordFade: 700,

    transitionDuration: 2800,

    endingSubtitleDelay: 600,

    endingTitleDelay: 900,

    endingDescriptionDelay: 1200,

    endingDividerDelay: 700,

    endingButtonDelay: 700

};

/* ==========================================================
   HANAMI PROJECT
   Chapter III • Little Things
   Part 2 — Story Engine
========================================================== */

/* ==========================================================
   TYPE WRITER
========================================================== */

function typeSentence(text, callback) {

    sentence.innerHTML = "";

    let charIndex = 0;

    isAnimating = true;

    const typing = setInterval(() => {

        sentence.innerHTML += text.charAt(charIndex);

        charIndex++;

        if (charIndex >= text.length) {

            clearInterval(typing);

            isAnimating = false;

            setTimeout(() => {

                callback();

            }, timing.sentenceDelay);

        }

    }, timing.typingSpeed);

}

/* ==========================================================
   STORY LOOP
========================================================== */

function playStory() {

    if (storyIndex >= story.length) {

        sentence.classList.add("fadeOut");

        setTimeout(() => {

            storySection.classList.add("hidden");

            setTimeout(() => {

                showMemory();

            }, timing.silentPause);

        }, timing.fadeDelay);

        return;

    }

    sentence.classList.remove("fadeOut");

    typeSentence(story[storyIndex], () => {

        sentence.classList.add("fadeOut");

        setTimeout(() => {

            storyIndex++;

            playStory();

        }, timing.fadeDelay);

    });

}

/* ==========================================================
   START STORY
========================================================== */

function startStory() {

    storyIndex = 0;

    storySection.classList.remove("hidden");

    playStory();

}

/* ==========================================================
   HANAMI PROJECT
   Chapter III • Little Things
   Part 3 — Memory Engine
========================================================== */

/* ==========================================================
   SHOW MEMORY
========================================================== */

function showMemory() {

    memorySection.classList.remove("hidden");

    memoryIndex = 0;

    setTimeout(() => {

        playMemory();

    }, timing.memoryDelay);

}

/* ==========================================================
   MEMORY LOOP
========================================================== */

function playMemory() {

    if (memoryIndex >= memories.length) {

        [
            memoryLabel,
            memoryTitle,
            memoryDescription
        ].forEach(el => {

            el.classList.remove("showWord");
            el.classList.add("hideWord");

        });

        setTimeout(() => {

            memorySection.classList.add("hidden");

            showReflection();

        }, timing.wordFade);

        return;

    }

    const current = memories[memoryIndex];

    memoryLabel.textContent = current.label;
    memoryTitle.textContent = current.title;
    memoryDescription.textContent = current.description;

    [
        memoryLabel,
        memoryTitle,
        memoryDescription
    ].forEach(el => {

        el.classList.remove("hideWord");
        el.classList.remove("showWord");

        void el.offsetWidth;

        el.classList.add("showWord");

    });

    setTimeout(() => {

        [
            memoryLabel,
            memoryTitle,
            memoryDescription
        ].forEach(el => {

            el.classList.remove("showWord");
            el.classList.add("hideWord");

        });

        setTimeout(() => {

            memoryIndex++;

            playMemory();

        }, timing.wordFade);

    }, current.duration);

}

/* ==========================================================
   HANAMI PROJECT
   Chapter III • Little Things
   Part 4 — Reflection Engine
========================================================== */

/* ==========================================================
   SHOW REFLECTION
========================================================== */

function showReflection() {

    reflectionSection.classList.remove("hidden");

    reflectionIndex = 0;

    setTimeout(() => {

        playReflection();

    }, timing.reflectionDelay);

}

/* ==========================================================
   REFLECTION LOOP
========================================================== */

function playReflection() {

    if (reflectionIndex >= reflections.length) {

        reflectionText.classList.remove(
            "showWord",
            "hideWord"
        );

        reflectionText.classList.add("hideWord");

        setTimeout(() => {

            reflectionSection.classList.add("hidden");

            showEnding();

        }, timing.wordFade);

        return;

    }

    const current = reflections[reflectionIndex];

    reflectionText.classList.remove(
        "showWord",
        "hideWord"
    );

    reflectionText.innerHTML = current.text;

    void reflectionText.offsetWidth;

    reflectionText.classList.add("showWord");

    setTimeout(() => {

        reflectionText.classList.remove("showWord");

        reflectionText.classList.add("hideWord");

        setTimeout(() => {

            reflectionIndex++;

            playReflection();

        }, timing.wordFade);

    }, current.duration);

}

/* ==========================================================
   HANAMI PROJECT
   Chapter III • Little Things
   Part 5 — Ending Engine
========================================================== */

/* ==========================================================
   SHOW ENDING
========================================================== */

function showEnding() {

    endingSection.classList.remove("hidden");

    endingTitle.innerHTML =
        "Dan mungkin...";

    endingDescription.innerHTML = `

        Ada banyak hal yang mungkin suatu hari nanti akan terlupakan.

        <br><br>

        Percakapan yang pernah kita lakukan.

        Hari-hari yang pernah kita lewati.

        Bahkan beberapa kenangan mungkin perlahan akan memudar.

        <br><br>

        Tapi entah kenapa...

        hal-hal kecil yang tanpa sadar menjadi kebiasaanmu,

        selalu berhasil tinggal lebih lama di ingatanku.

        `;
    [

        endingSubtitle,
        endingTitle,
        endingDescription,
        endingDivider,
        nextChapter

    ].forEach(element => {

        if(!element) return;

        element.classList.remove("showEnding");

    });

    void endingSection.offsetWidth;

    setTimeout(() => {

        endingSubtitle.classList.add("showEnding");

        setTimeout(() => {

            endingTitle.classList.add("showEnding");

            setTimeout(() => {

                endingDescription.classList.add("showEnding");

                setTimeout(() => {

                    endingDivider.classList.add("showEnding");

                    setTimeout(() => {

                        nextChapter.classList.add("showEnding");

                    }, timing.endingButtonDelay);

                }, timing.endingDividerDelay);

            }, timing.endingDescriptionDelay);

        }, timing.endingTitleDelay);

    }, timing.endingSubtitleDelay);

}

/* ==========================================================
   HANAMI PROJECT
   Chapter III • Little Things
   Part 6 — Cursor Engine
========================================================== */

/* ==========================================================
   CURSOR LIGHT
========================================================== */

function initializeCursor() {

    if (!cursorLight) return;

    document.addEventListener("mousemove", (event) => {

        cursorLight.style.left =
            `${event.clientX}px`;

        cursorLight.style.top =
            `${event.clientY}px`;

    });

}

/* ==========================================================
   BUTTON HOVER
========================================================== */

function initializeButtonHover() {

    if (!nextChapter) return;

    nextChapter.addEventListener("mouseenter", () => {

        cursorLight.classList.add(
            "cursorExpand"
        );

    });

    nextChapter.addEventListener("mouseleave", () => {

        cursorLight.classList.remove(
            "cursorExpand"
        );

    });

}

/* ==========================================================
   HANAMI PROJECT
   Chapter III • Little Things
   Part 7 — Audio Engine
========================================================== */

/* ==========================================================
   AUDIO INITIALIZATION
========================================================== */

function initializeAudio() {

    if (ambientSound) {

        ambientSound.volume = 0.25;

    }

    if (bgMusic) {

        bgMusic.volume = 0.45;

    }

}

/* ==========================================================
   PLAY AUDIO
========================================================== */

function playAudio() {

    ambientSound?.play().catch(() => {});

    bgMusic?.play().catch(() => {});

}

/* ==========================================================
   FADE OUT AUDIO
========================================================== */

function fadeOutAudio() {

    const fade = setInterval(() => {

        if (
            bgMusic &&
            bgMusic.volume > 0.02
        ) {

            bgMusic.volume -= 0.02;

        }

        if (
            ambientSound &&
            ambientSound.volume > 0.01
        ) {

            ambientSound.volume -= 0.01;

        }

        if (

            bgMusic.volume <= 0.02 &&
            ambientSound.volume <= 0.01

        ) {

            clearInterval(fade);

            bgMusic.pause();

            ambientSound.pause();

        }

    }, 120);

}

/* ==========================================================
   HANAMI PROJECT
   Chapter III • Little Things
   Part 8 — Initialize & Events
========================================================== */

/* ==========================================================
   INITIALIZE CHAPTER
========================================================== */

function initializeChapter() {

    initializeAudio();

    initializeCursor();

    initializeButtonHover();

    startStory();

}

/* ==========================================================
   NEXT CHAPTER
========================================================== */

function goToNextChapter() {

    fadeOutAudio();

    if (transitionOverlay) {

        transitionOverlay.classList.add(
            "active"
        );

    }

    setTimeout(() => {

        window.location.href =
        "../chapters/chapter4.html";

    }, 1500);

}

/* ==========================================================
   EVENTS
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTimeout(() => {

            if (screenLoader) {

                screenLoader.classList.add(
                    "hidden"
                );

            }

            initializeChapter();

            playAudio();

        }, 1800);

        if (nextChapter) {

            nextChapter.addEventListener(

                "click",

                goToNextChapter

            );

        }

    }

);