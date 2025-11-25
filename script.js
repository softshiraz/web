/* ---------------- ذرات طلایی ---------------- */
const particles = document.getElementById("gold-particles");

for (let i = 0; i < 80; i++) {
    const p = document.createElement("div");
    p.className = "particle";

    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 5 + 5;

    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = duration + "s";
    p.style.animationDelay = Math.random() * 5 + "s";

    particles.appendChild(p);
}

/* ---------------- لودر ---------------- */
window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loading-overlay").classList.add("hidden");
    }, 1500);
});

/* ---------------- بارگذاری کارت‌ها ---------------- */
const cardsContainer = document.getElementById("cards-container");

for (let i = 1; i <= 12; i++) {
    fetch(`cards/${i}.html`)
        .then(res => res.text())
        .then(html => {
            const card = document.createElement("div");
            card.innerHTML = html;
            cardsContainer.appendChild(card);

            setupCard(card);
        });
}

/* ---------------- Flip کارت ---------------- */
let openCard = null;

function setupCard(wrapper) {
    const inner = wrapper.querySelector(".card-inner");
    const reserve = wrapper.querySelector(".reserve-bar");

    inner.addEventListener("click", () => {
        if (openCard && openCard !== inner) {
            openCard.classList.remove("flipped");
        }
        inner.classList.toggle("flipped");
        openCard = inner;
    });

    reserve.addEventListener("click", (e) => {
        e.stopPropagation();
        window.location.href = "https://t.me/SoftShiraz_Admin";
    });
}

/* ---------------- پاپ‌آپ درباره ما ---------------- */
const aboutBtn = document.getElementById("about-btn");
const aboutPopup = document.getElementById("about-popup");

aboutBtn.onclick = () => aboutPopup.classList.toggle("hidden");

document.addEventListener("click", (e) => {
    if (!aboutPopup.contains(e.target) && e.target !== aboutBtn) {
        aboutPopup.classList.add("hidden");
    }
});
