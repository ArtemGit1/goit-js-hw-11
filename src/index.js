const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
let page = 1;
let searchQuery = '';

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    gallery.innerHTML = '';
    page = 1;
    searchQuery = e.target.searchQuery.value;
    await fetchImages();
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
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.hits.length === 0) {
            if (page === 1) {

                alert('Sorry, there are no images matching your search query. Please try again.');
            } else {

                loadMoreButton.style.display = 'none';
                alert("We're sorry, but you've reached the end of search results.");
            }
        } else {

            data.hits.forEach((image) => {
                const card = document.createElement('div');
                card.classList.add('photo-card');
                card.innerHTML = `
                    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
                        <p class="info-item"><b>Views:</b> ${image.views}</p>
                        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
                        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
                    </div>
                `;
                gallery.appendChild(card);
            });


            loadMoreButton.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}
