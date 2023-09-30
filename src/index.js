import axios from 'axios';
import { Buffer } from 'buffer';

const loadMoreButton = document.querySelector('.load-more');
loadMoreButton.style.display = 'none'; 

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const notification = document.querySelector('.notification');
let page = 1;
let searchQuery = '';
let totalHits = 0;
let totalPages = 0;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    gallery.innerHTML = '';
    page = 1;
    searchQuery = e.target.searchQuery.value.trim();
    if (isValidSearchQuery(searchQuery)) {
        await fetchImages();
    } else {
        alert('Будь ласка, введіть коректний запит для пошуку зображень.'); // Виводимо повідомлення через alert
        loadMoreButton.style.display = 'none';
    }
});

loadMoreButton.addEventListener('click', async () => {
    page++;
    await fetchImages();
});

async function fetchImages() {
    const apiKey = '39751555-c2fbc931ac716611d03f33f4d';
    const perPage = 40;
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.totalHits === 0) {
            notification.textContent = 'На жаль, за вашим запитом не знайдено зображень. Будь ласка, спробуйте ще раз.';
            loadMoreButton.style.display = 'none';
        } else {
            totalHits = data.totalHits;
            totalPages = Math.ceil(totalHits / perPage);

            data.hits.forEach((image) => {
                const card = document.createElement('div');
                card.classList.add('photo-card');
                card.innerHTML = `
                    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item"><b>Лайки:</b> ${image.likes}</p>
                        <p class="info-item"><b>Перегляди:</b> ${image.views}</p>
                        <p class="info-item"><b>Коментарі:</b> ${image.comments}</p>
                        <p class="info-item"><b>Завантаження:</b> ${image.downloads}</p>
                    </div>
                `;
                gallery.appendChild(card);
            });

            if (page < totalPages) {
                loadMoreButton.style.display = 'block';
            } else {
                loadMoreButton.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Помилка при отриманні зображень:', error);
    }
}

function isValidSearchQuery(query) {
    return query.length > 0; // Перевіряємо, що запит не порожній
}
