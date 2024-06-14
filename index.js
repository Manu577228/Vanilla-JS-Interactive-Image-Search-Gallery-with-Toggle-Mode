const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalDescription = document.getElementById('modalDescription');
const closeModal = document.getElementById('closeModal');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const toggleThemeButton = document.getElementById('toggleTheme');
const downloadButton = document.getElementById('downloadButton');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

const UNSPLASH_ACCESS_KEY = 'xyA5vL_uQ-T3dsS-ub-YQeG7hV9yordfxyUxOtxhBag'; // Your Unsplash API access key

let currentPage = 1;
let currentSearchTerm = '';

async function fetchArtItems(query = '', page = 1) {
  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=9&client_id=${UNSPLASH_ACCESS_KEY}`);
    const data = await response.json();
    if (data.results.length === 0) {
      throw new Error('No images found');
    }
    return data.results.map(item => ({
      src: item.urls.regular,
      description: item.alt_description || 'No description available',
      download: item.links.download
    }));
  } catch (error) {
    return [];
  }
}

async function displayArtGallery(query = '', page = 1) {
  gallery.innerHTML = ''; // Clear previous images
  const artItems = await fetchArtItems(query, page);

  if (artItems.length === 0 && query !== '') {
    gallery.innerHTML = `<div class="text-center text-xl text-gray-700">No images found. Please try a different search term.</div>`;
    return;
  }

  artItems.forEach(item => {
    const artElement = document.createElement('div');
    artElement.classList.add('relative', 'overflow-hidden', 'rounded-lg', 'shadow-lg', 'aspect-w-1', 'aspect-h-1');
    artElement.innerHTML = `
      <img src="${item.src}" alt="Art" class="w-full h-full object-cover cursor-pointer">
    `;
    artElement.addEventListener('click', () => {
      modalImage.src = item.src;
      modalDescription.textContent = item.description;
      downloadButton.href = item.download;
      modal.classList.remove('hidden');
    });
    gallery.appendChild(artElement);
  });
}

searchButton.addEventListener('click', () => {
  currentSearchTerm = searchInput.value;
  currentPage = 1;
  displayArtGallery(currentSearchTerm, currentPage);
});

prevPageButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    displayArtGallery(currentSearchTerm, currentPage);
  }
});

nextPageButton.addEventListener('click', () => {
  currentPage++;
  displayArtGallery(currentSearchTerm, currentPage);
});

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

toggleThemeButton.addEventListener('click', () => {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  sunIcon.style.display = isDarkMode ? 'inline-block' : 'none';
  moonIcon.style.display = isDarkMode ? 'none' : 'inline-block';
});

// Set initial theme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark-mode');
  sunIcon.style.display = 'inline-block';
  moonIcon.style.display = 'none';
} else {
  document.body.classList.add('light-mode');
  sunIcon.style.display = 'none';
  moonIcon.style.display = 'inline-block';
}

// Initial display
displayArtGallery();
