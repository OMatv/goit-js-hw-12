import { fetchImages } from './js/pixabay-api.js';
import { renderImages, clearGallery } from './js/render-functions.js';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import iziToast from 'izitoast';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#search-form');
  const input = document.querySelector('#search-input');
  const gallery = document.querySelector('.gallery');
  const loader = document.querySelector('.loader');
  const loadMoreBtn = document.querySelector('#load-more-btn');

  loadMoreBtn.textContent = 'Load more';
  gallery.parentNode.insertBefore(loadMoreBtn, gallery.nextSibling);
  loadMoreBtn.style.display = 'none';

  const lightbox = new SimpleLightbox('.gallery a');

  let currentPage = 1;
  let currentQuery = '';

  async function loadMoreImages() {
    try {
      loader.classList.add('visible');
      const images = await fetchImages(currentQuery, currentPage);
      if (images.length === 0) {
        iziToast.info({
          title: 'Info',
          message: 'No more images to load.',
          position: 'topRight',
        });
        loadMoreBtn.style.display = 'none';
        return;
      }
      renderImages(images);
      lightbox.refresh(); // Оновлюємо SimpleLightbox після додавання нових зображень
      currentPage++;
    } catch (error) {
      iziToast.error({
        title: 'Error',
        message: 'Failed to fetch images. Please try again later.',
        position: 'topRight',
      });
    } finally {
      loader.classList.remove('visible'); // Прибрати лоудер після завершення запиту
    }
  }

  async function handleSearchSubmit(event) {
    event.preventDefault();
    const searchTerm = input.value.trim();
    if (!searchTerm) {
      iziToast.error({
        title: 'Error',
        message: 'Please enter a search term',
        position: 'topRight',
      });
      return;
    }
    clearGallery();
    currentQuery = searchTerm;
    currentPage = 1;
    loadMoreBtn.style.display = 'none'; // Приховати кнопку перед запитом
    gallery.style.display = 'none'; // Приховуємо галерею перед запитом
    await loadMoreImages();
    gallery.style.display = 'flex'; // Показуємо галерею після завантаження зображень
    loadMoreBtn.style.display = 'block'; // Показуємо кнопку Load more
    window.scrollTo({
      top: gallery.offsetTop,
      behavior: 'smooth',
    });
  }

  form.addEventListener('submit', handleSearchSubmit);

  loadMoreBtn.addEventListener('click', async () => {
    await loadMoreImages();
    window.scrollBy({
      top: gallery.offsetHeight * 2,
      behavior: 'smooth',
    });
  });
});
