/* ==========================================================
   HANAMI PROJECT
   Chapter II • The Way I See You
   Part 1A — Setup & Initialization
========================================================== */

/* ==========================================================
   STORY DATA
========================================================== */

const story = [
    "Ada orang-orang yang cukup dikenali lewat namanya.",
    "Namun ada juga seseorang...",
    "yang perlahan dikenali lewat caranya membuat orang lain merasa nyaman.",
    "Dan bagiku...",
    "orang itu adalah kamu."
];

/* ==========================================================
   REFLECTION DATA
========================================================== */

const reflections = [
    {
        text: "Lalu...",
        duration: 2200
    },
    {
        text: "Aku berpikir...",
        duration: 2600
    },
    {
        text: "Kalau harus memilih beberapa kata...",
        duration: 3400
    },
    {
        text: "Mungkin...",
        duration: 2200
    }
];

const qualities = [
    {
        text: "Baik",
        duration: 2600
    },
    {
        text: "Perhatian",
        duration: 2600
    },
    {
        text: "Penyayang",
        duration: 2600
    },
    {
        text: "Lembut",
        duration: 2600
    }
];

/* ==========================================================
   DOM ELEMENTS
========================================================== */

const sentence = document.getElementById("sentence");

const storySection = document.getElementById("storySection");
const reflectionSection = document.getElementById("reflectionSection");
const transitionSection = document.getElementById("transitionSection");
const endingSection = document.getElementById("endingSection");

const reflectionText = document.getElementById("reflectionText");
const transitionText = document.querySelector(".transition-text");

const endingSubtitle = document.getElementById("endingSubtitle");
const endingTitle = document.getElementById("endingTitle");
const endingDescription = document.getElementById("endingDescription");
const endingDivider = document.getElementById("endingDivider");
const nextChapter = document.getElementById("nextChapter");

const cursorLight = document.getElementById("cursorLight");
const transitionOverlay = document.getElementById("transitionOverlay");

const screenLoader = document.getElementById("screenLoader");

const ambientSound = document.getElementById("ambientSound");
const bgMusic = document.getElementById("bgMusic");

/* ==========================================================
   HEADER
========================================================== */

const chapterHeader = document.querySelector("header");

/* ==========================================================
   GLOBAL STATE
========================================================== */

let storyIndex = 0;
let reflectionIndex = 0;
let qualityIndex = 0;

let isAnimating = false;

/* ==========================================================
   TIMING
========================================================== */

const timing = {

    introDelay: 1200,

    headerDelay: 400,

    typingSpeed: 45,

    sentenceDelay: 1700,

    fadeDelay: 600,

    silentPause: 1000,

    reflectionDelay: 1200,

    wordFade: 700,

    transitionDuration: 2800,

    endingSubtitleDelay: 600,

    endingTitleDelay: 900,

    endingDescriptionDelay: 1200,

    endingDividerDelay: 700,

    endingButtonDelay: 700

};

/* ==========================================================
   HEADER ANIMATION
========================================================== */

function showHeader() {

    if (!chapterHeader) return;

    requestAnimationFrame(() => {

        chapterHeader.classList.add("show");

    });

}

/* ==========================================================
   TYPEWRITER
========================================================== */

function typeSentence(text, callback) {

    sentence.textContent = "";

    let index = 0;

    isAnimating = true;

    const typing = setInterval(() => {

        sentence.textContent += text.charAt(index);

        index++;

        if (index >= text.length) {

            clearInterval(typing);

            isAnimating = false;

            setTimeout(callback, timing.sentenceDelay);

        }

    }, timing.typingSpeed);

}

/* ==========================================================
   HANAMI PROJECT
   Chapter II • The Way I See You
   Part 1B — Story Engine
========================================================== */

/* ==========================================================
   PLAY STORY
========================================================== */

function playStory() {

    if (storyIndex >= story.length) {

        sentence.classList.add("fadeOut");

        setTimeout(() => {

            storySection.classList.add("hidden");

            setTimeout(() => {

                showReflection();

            }, timing.silentPause);

        }, timing.fadeDelay);

        return;

    }

    sentence.classList.remove("fadeOut");

    typeSentence(
        story[storyIndex],
        nextStory
    );

}

/* ==========================================================
   NEXT STORY
========================================================== */

function nextStory() {

    sentence.classList.add("fadeOut");

    setTimeout(() => {

        storyIndex++;

        playStory();

    }, timing.fadeDelay);

}

/* ==========================================================
   RESET STORY
========================================================== */

function resetStory() {

    storyIndex = 0;

    sentence.textContent = "";

    sentence.classList.remove("fadeOut");

}

/* ==========================================================
   START STORY
========================================================== */

function startStory() {

    resetStory();

    storySection.classList.remove("hidden");

    playStory();

}

/* ==========================================================
   INTRO SEQUENCE
========================================================== */

function startIntro() {

    setTimeout(() => {

        showHeader();

    }, timing.headerDelay);

    setTimeout(() => {

        startStory();

    }, timing.introDelay);

}

/* ==========================================================
   HANAMI PROJECT
   Chapter II • The Way I See You
   Part 2 — Reflection Engine
========================================================== */

/* ==========================================================
   START REFLECTION
========================================================== */

function showReflection() {

    reflectionSection.classList.remove("hidden");

    reflectionIndex = 0;
    qualityIndex = 0;

    setTimeout(() => {

        playReflection();

    }, timing.reflectionDelay);

}

/* ==========================================================
   PLAY REFLECTION
========================================================== */

function playReflection() {

    if (reflectionIndex >= reflections.length) {

        setTimeout(() => {

            playQuality();

        }, 900);

        return;

    }

    const current = reflections[reflectionIndex];

    animateReflection(

        current.text,

        current.duration,

        () => {

            reflectionIndex++;

            playReflection();

        }

    );

}

/* ==========================================================
   PLAY QUALITY
========================================================== */

function playQuality() {

    if (qualityIndex >= qualities.length) {

        setTimeout(() => {

            showFinalReflection();

        }, 1000);

        return;

    }

    const current = qualities[qualityIndex];

    reflectionText.classList.add("qualityText");

    animateReflection(

        current.text,

        current.duration,

        () => {

            qualityIndex++;

            playQuality();

        }

    );

}

/* ==========================================================
   REFLECTION ANIMATION
========================================================== */

function animateReflection(

    text,

    duration,

    callback

) {

    reflectionText.classList.remove(

        "showWord",
        "hideWord"

    );

    reflectionText.innerHTML = text;

    void reflectionText.offsetWidth;

    reflectionText.classList.add("showWord");

    setTimeout(() => {

        reflectionText.classList.remove("showWord");

        reflectionText.classList.add("hideWord");

        setTimeout(() => {

            callback();

        }, timing.wordFade);

    }, duration);

}

/* ==========================================================
   FINAL REFLECTION
========================================================== */

function showFinalReflection() {

    reflectionText.classList.remove("qualityText");

    const lines = [

        "Namun...",

        "Kurasa...",

        "Semua kata itu masih belum cukup<br>untuk menggambarkanmu."

    ];

    let index = 0;

    function next() {

        if (index >= lines.length) {

            reflectionSection.classList.add("hidden");

            showTransition();

            return;

        }

        animateReflection(

            lines[index],

            2200,

            () => {

                index++;

                next();

            }

        );

    }

    next();

}

/* ==========================================================
   HANAMI PROJECT
   Chapter II • The Way I See You
   Part 3 — Transition & Ending
========================================================== */

/* ==========================================================
   TRANSITION
========================================================== */

function showTransition() {

    transitionSection.classList.remove("hidden");

    transitionText.classList.remove(
        "showWord",
        "hideWord"
    );

    transitionText.textContent = "Dan mungkin...";

    void transitionText.offsetWidth;

    transitionText.classList.add("showWord");

    setTimeout(() => {

        transitionText.classList.remove("showWord");
        transitionText.classList.add("hideWord");

        setTimeout(() => {

            transitionSection.classList.add("hidden");

            showEnding();

        }, timing.wordFade);

    }, timing.transitionDuration);

}

/* ==========================================================
   RESET ENDING
========================================================== */

function resetEnding() {

    [
        endingSubtitle,
        endingTitle,
        endingDescription,
        endingDivider,
        nextChapter

    ].forEach(element => {

        element.classList.remove("showEnding");

    });

}

/* ==========================================================
   SHOW ENDING
========================================================== */

function showEnding() {

    endingSection.classList.remove("hidden");

    resetEnding();

    void endingSection.offsetWidth;

    animateEnding();

}

/* ==========================================================
   ANIMATE ENDING
========================================================== */

function animateEnding() {

    showEndingItem(
        endingSubtitle,
        () => {

            showEndingItem(
                endingTitle,
                () => {

                    showEndingItem(
                        endingDescription,
                        () => {

                            showEndingItem(
                                endingDivider,
                                () => {

                                    showEndingItem(
                                        nextChapter
                                    );

                                },
                                timing.endingDividerDelay
                            );

                        },
                        timing.endingDescriptionDelay
                    );

                },
                timing.endingTitleDelay
            );

        },
        timing.endingSubtitleDelay
    );

}

/* ==========================================================
   SHOW ENDING ITEM
========================================================== */

function showEndingItem(
    element,
    callback = null,
    delay = 600
) {

    setTimeout(() => {

        element.classList.add("showEnding");

        if (callback) {

            callback();

        }

    }, delay);

}

/* ==========================================================
   HANAMI PROJECT
   Chapter II • The Way I See You
   Part 4 — Cursor • Audio • Initialize
========================================================== */

/* ==========================================================
   CURSOR
========================================================== */

function initializeCursor() {

    if (!cursorLight) return;

    document.addEventListener("mousemove", ({ clientX, clientY }) => {

        cursorLight.style.left = `${clientX}px`;
        cursorLight.style.top = `${clientY}px`;

    });

}

function initializeButtonHover() {

    if (!nextChapter) return;

    nextChapter.addEventListener("mouseenter", () => {

        cursorLight.classList.add("cursorExpand");

    });

    nextChapter.addEventListener("mouseleave", () => {

        cursorLight.classList.remove("cursorExpand");

    });

}

/* ==========================================================
   AUDIO
========================================================== */

function initializeAudio() {

    if (ambientSound) ambientSound.volume = 0.25;

    if (bgMusic) bgMusic.volume = 0.45;

}

function playAudio() {

    ambientSound?.play().catch(() => {});
    bgMusic?.play().catch(() => {});

}

function fadeOutAudio() {

    const fade = setInterval(() => {

        if (bgMusic && bgMusic.volume > 0.02) {

            bgMusic.volume -= 0.02;

        }

        if (ambientSound && ambientSound.volume > 0.01) {

            ambientSound.volume -= 0.01;

        }

        if (

            (!bgMusic || bgMusic.volume <= 0.02) &&
            (!ambientSound || ambientSound.volume <= 0.01)

        ) {

            clearInterval(fade);

            bgMusic?.pause();
            ambientSound?.pause();

        }

    }, 120);

}

/* ==========================================================
   NEXT CHAPTER
========================================================== */

function goToNextChapter() {

    fadeOutAudio();

    transitionOverlay?.classList.add("active");

    setTimeout(() => {

        window.location.href = "../chapters/chapter3.html";

    }, 1500);

}

/* ==========================================================
   INITIALIZE
========================================================== */

function initializeChapter() {

    initializeAudio();

    initializeCursor();

    initializeButtonHover();

    showHeader();

    setTimeout(() => {

        startStory();

    }, timing.introDelay);

}

/* ==========================================================
   LOADER
========================================================== */

function hideLoader() {

    if (!screenLoader) return;

    screenLoader.classList.add("hidden");

}

/* ==========================================================
   EVENTS
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    setTimeout(() => {

        hideLoader();

        initializeChapter();

        playAudio();

    }, 1800);

    nextChapter?.addEventListener(

        "click",

        goToNextChapter

    );

});