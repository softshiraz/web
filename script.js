// ذرات طلایی
const particleContainer = document.getElementById("gold-particles");
for (let i = 0; i < 80; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 3 + 2;
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.left = Math.random() * 100 + "%";
    p.style.top = Math.random() * -100 + "vh";
    p.style.animationDuration = Math.random() * 4 + 4 + "s";
    p.style.animationDelay = Math.random() * 3 + "s";
    particleContainer.appendChild(p);
}

// لودر
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-overlay').classList.add('hidden');
    }, 5000);
});

// کارت‌ها
const container = document.getElementById("cards-container");
let openCard = null;

async function loadCardsStrictly() {
    for (let num = 1; num <= 12; num++) {
        try {
            const response = await fetch(`cards/${num}.html`, { cache: "no-store" });
            if (!response.ok) continue;
            const html = await response.text();

            const card = document.createElement("div");
            card.className = "movie-card";
            card.innerHTML = html;

            container.appendChild(card);

            const reserveButton = card.querySelector(".reserve-bar");
            if (reserveButton) {
                reserveButton.addEventListener("click", () => {
                    window.location.href = "https://t.me/softshirazadmin";
                });
            }

        } catch (e) {
            console.log("خطا در لود کارت", num);
        }
    }
}

loadCardsStrictly();

// Flip
document.addEventListener("click", function (e) {
    const cardInner = e.target.closest(".card-inner");
    if (cardInner) {
        if (openCard && openCard !== cardInner) openCard.classList.remove("flipped");
        cardInner.classList.toggle("flipped");
        openCard = cardInner.classList.contains("flipped") ? cardInner : null;
    }
});

// درباره ما
const aboutBtn = document.getElementById("about-btn");
const aboutPopup = document.getElementById("about-popup");

aboutBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    aboutPopup.classList.toggle("show");
});

document.addEventListener("click", (e) => {
    if (!aboutPopup.contains(e.target) && e.target !== aboutBtn) {
        aboutPopup.classList.remove("show");
    }
});
