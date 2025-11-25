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

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-overlay').classList.add('hidden');
    }, 5000);
});

const container = document.getElementById("cards-container");
let openCard = null;

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.18 });

function attachTilt(innerEl) {
    if (!innerEl) return;
    const maxTilt = 8;

    function handleMove(e) {
        const isTouch = e.type.startsWith('touch');
        const clientX = isTouch ? (e.touches[0] && e.touches[0].clientX) || 0 : e.clientX;
        const clientY = isTouch ? (e.touches[0] && e.touches[0].clientY) || 0 : e.clientY;

        const rect = innerEl.getBoundingClientRect();
        const relX = clientX - rect.left;
        const relY = clientY - rect.top;
        const px = (relX / rect.width) - 0.5;
        const py = (relY / rect.height) - 0.5;

        const tiltY = (px * maxTilt).toFixed(2);
        const tiltX = (-py * maxTilt).toFixed(2);

        innerEl.style.setProperty('--tiltX', tiltX + 'deg');
        innerEl.style.setProperty('--tiltY', tiltY + 'deg');
    }

    function resetTilt() {
        innerEl.style.setProperty('--tiltX', '0deg');
        innerEl.style.setProperty('--tiltY', '0deg');
    }

    innerEl.addEventListener('mousemove', handleMove);
    innerEl.addEventListener('mouseleave', resetTilt);
    innerEl.addEventListener('touchmove', function(e){ handleMove(e); }, {passive:true});
    innerEl.addEventListener('touchend', resetTilt);
}

async function loadCardsStrictly() {
    for (let num = 1; num <= 12; num++) {
        try {
            const response = await fetch(`cards/${num}.html`, { cache: "no-store" });
            if (!response.ok) continue;
            const html = await response.text();
            const card = document.createElement("div");
            card.className = "movie-card reveal";
            card.innerHTML = html;
            container.appendChild(card);
            revealObserver.observe(card);

            const reserveButton = card.querySelector(".reserve-bar");
            if (reserveButton) {
                reserveButton.addEventListener("click", () => {
                    window.location.href = "https://t.me/softshirazadmin";
                });
            }

            const inner = card.querySelector(".card-inner");
            if (inner) attachTilt(inner);
        } catch (e) {
            console.log("خطا در لود کارت", num);
        }
    }
}

loadCardsStrictly();

document.addEventListener("click", function (e) {
    const cardInner = e.target.closest(".card-inner");
    if (cardInner) {
        if (openCard && openCard !== cardInner) openCard.classList.remove("flipped");
        cardInner.classList.toggle("flipped");
        openCard = cardInner.classList.contains("flipped") ? cardInner : null;
    }
});

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
