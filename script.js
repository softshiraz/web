const API_KEY = 'YOUR_TMDB_API_KEY'; // جایگزین کن
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const LANGUAGE = 'fa'; // پارسی

// تابع برای normalize جستجو (انگلیسی/فارسی)
function normalizeText(text) {
    return text.toLowerCase().replace(/[\u064B-\u065F\u0670]/g, ''); // حذف اعراب پارسی
}

// Carousel
async function loadCarousel() {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${LANGUAGE}`);
    const data = await res.json();
    const container = document.getElementById('carouselContainer');
    data.results.slice(0, 5).forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('carousel-item');
        div.innerHTML = `<img src="${IMG_URL + item.poster_path}" alt="${item.title || item.name}">`;
        container.appendChild(div);
    });

    let current = 0;
    const items = document.querySelectorAll('.carousel-item');
    items[0].classList.add('active');
    document.body.style.backgroundImage = `url(${IMG_URL + data.results[0].backdrop_path})`;
    document.body.style.backgroundSize = 'cover';

    setInterval(() => {
        items[current].classList.remove('active');
        current = (current + 1) % items.length;
        items[current].classList.add('active');
        document.body.style.backgroundImage = `url(${IMG_URL + data.results[current].backdrop_path})`;
    }, 10000);
}

// فیلم/سریال‌های جدید
async function loadNewItems(type, containerId) {
    const endpoint = type === 'movie' ? 'movie/now_playing' : 'tv/on_the_air';
    const res = await fetch(`${BASE_URL}/${endpoint}?api_key=${API_KEY}&language=${LANGUAGE}`);
    const data = await res.json();
    const container = document.getElementById(containerId);
    data.results.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = `
            <img src="${IMG_URL + item.poster_path}" alt="${item.title || item.name}">
            <h3>${item.title || item.name}</h3>
            <p>نمره: ${item.vote_average}</p>
            <a href="details.html?type=${type}&id=${item.id}">مشاهده جزئیات</a>
        `;
        container.appendChild(div);
    });
}

// ژانرها
async function loadGenres(type) {
    const res = await fetch(`${BASE_URL}/genre/${type}/list?api_key=${API_KEY}&language=${LANGUAGE}`);
    const data = await res.json();
    const select = document.getElementById('genreSelect');
    data.genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        select.appendChild(option);
    });

    select.addEventListener('change', () => loadItems(type, document.getElementById('sortSelect').value, select.value));
    document.getElementById('sortSelect').addEventListener('change', () => loadItems(type, document.getElementById('sortSelect').value, select.value));
}

// آرشیو
async function loadItems(type, sort, genre) {
    const containerId = type === 'movie' ? 'moviesContainer' : 'seriesContainer';
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const endpoint = type === 'movie' ? 'discover/movie' : 'discover/tv';
    let url = `${BASE_URL}/${endpoint}?api_key=${API_KEY}&language=${LANGUAGE}&sort_by=${sort}`;
    if (genre) url += `&with_genres=${genre}`;
    const res = await fetch(url);
    const data = await res.json();
    data.results.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = `
            <img src="${IMG_URL + item.poster_path}" alt="${item.title || item.name}">
            <h3>${item.title || item.name}</h3>
            <p>نمره: ${item.vote_average}</p>
            <a href="details.html?type=${type}&id=${item.id}">مشاهده جزئیات</a>
        `;
        container.appendChild(div);
    });
}

// جزئیات
async function loadDetails(type, id) {
    const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=${LANGUAGE}&append_to_response=videos`);
    const data = await res.json();
    const container = document.getElementById('detailsContainer');
    const englishNameRes = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US`);
    const englishData = await englishNameRes.json();

    const seasons = type === 'tv' ? `<p>تعداد فصل‌ها: ${data.number_of_seasons} | قسمت‌ها: ${data.number_of_episodes}</p>` : '';
    const trailerKey = data.videos.results.find(v => v.type === 'Trailer')?.key;
    const trailer = trailerKey ? `<a href="https://www.youtube.com/watch?v=${trailerKey}" target="_blank">تریلر</a>` : '';

    container.innerHTML = `
        <img src="${IMG_URL + data.poster_path}" alt="${data.title || data.name}">
        <h2>${data.title || data.name} (فارسی)</h2>
        <h3>${englishData.title || englishData.name} (انگلیسی)</h3>
        <p>ژانرها: ${data.genres.map(g => g.name).join(', ')}</p>
        <p>نمره: ${data.vote_average}</p>
        <p>خلاصه: ${data.overview}</p>
        ${seasons}
        <p>کشور: ${data.production_countries.map(c => c.name).join(', ')}</p>
        <p>زبان: ${data.spoken_languages.map(l => l.name).join(', ')}</p>
        ${trailer}
        <button onclick="alert('دانلود قانونی: لینک به سرویس رسمی')">دانلود</button>
        <button onclick="saveItem('${id}', '${type}')">ذخیره</button>
    `;
}

// ذخیره
function saveItem(id, type) {
    let saved = JSON.parse(localStorage.getItem('savedItems')) || [];
    saved.push({id, type});
    localStorage.setItem('savedItems', JSON.stringify(saved));
    alert('ذخیره شد!');
}

// جستجو
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        loadCarousel();
        loadNewItems('movie', 'newMoviesContainer');
        loadNewItems('tv', 'newSeriesContainer');

        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', async () => {
            const query = normalizeText(searchInput.value);
            if (query.length < 3) return;

            const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=${LANGUAGE}&query=${encodeURIComponent(searchInput.value)}`);
            const data = await res.json();
            // نمایش نتایج در یک div جدید یا جایگزین sections
            console.log(data.results); // برای ساده، در کنسول. می‌تونی div اضافه کنی.
        });
    }
});