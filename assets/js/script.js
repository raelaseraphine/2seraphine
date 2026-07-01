const openBtn = document.getElementById("openBtn");
const intro = document.getElementById("intro");
const letter = document.getElementById("letter");
const form = document.getElementById("loginForm");
const message = document.getElementById("message");
openBtn.addEventListener("click", () => {
    intro.classList.add("fade-out");
    setTimeout(() => {
        intro.style.display = "none";
        letter.classList.remove("hidden");
        void letter.offsetWidth;
        letter.classList.add("letter-show");
    }, 500);
});
const users = [
    {
        name: "mutiara kasih suci",
        birth: "31-01-2010",
        page: "mutiara.html"
    },
    {
        name: "windi idna nuraeni",
        birth: "16-06-2009",
        page: "windi.html"
    },
    {
        name: "neng mawar yulianti",
        birth: "01-07-2009",
        page: "chapters/chapter1.html"
    },
    {
        name: "julia avia ningsih",
        birth: "23-07-2007",
        page: "julia.html"
    }
];
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document
        .getElementById("name")
        .value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
    const birth = document
        .getElementById("birth")
        .value
        .trim();
    const user = users.find(
        u => u.name === name && u.birth === birth
    );
    if(user){
        message.textContent =
            `Halo, ${user.name.split(" ")[0]} ✨`;
        setTimeout(() => {
            window.location.href = user.page;
        }, 1500);
    } else {
        message.textContent =
            "Hmm... sepertinya surat ini bukan untukmu 💌";
    }
});