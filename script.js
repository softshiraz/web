// فایل data.json رو دستی به‌روز کن با قسمت‌های جدید
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const list = document.getElementById('episode-list');
        data.episodes.forEach(episode => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${episode.title}</strong> - ${episode.date} <br> <a href="${episode.download}" download>دانلود</a>`;
            list.appendChild(li);
        });
    });