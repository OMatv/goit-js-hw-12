import { fetchImages } from './js/pixabay-api.js';
import { renderImages, clearGallery } from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#search-form');
  const input = document.querySelector('#search-input');
  const loader = document.querySelector('.loader');
  const loadMoreButton = document.querySelector('#load-more');

  let currentPage = 1;

  form.addEventListener('submit', async e => {
    e.preventDefault();

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
    loader.classList.add('visible');
    loadMoreButton.style.display = 'none';
    currentPage = 1;

    try {
      const images = await fetchImages(searchTerm, currentPage);
      renderImages(images);

      if (images.length > 0) {
        loadMoreButton.style.display = 'block';
      } else {
        iziToast.info({
          title: 'Info',
          message: 'No images found. Please try again!',
          position: 'topRight',
        });
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      iziToast.error({
        title: 'Error',
        message: 'Failed to fetch images. Please try again later.',
        position: 'topRight',
      });
    } finally {
      loader.classList.remove('visible');
    }
  });

  loadMoreButton.addEventListener('click', async () => {
    currentPage++;

    try {
      const images = await fetchImages(input.value.trim(), currentPage);
      renderImages(images);

      if (images.length === 0) {
        loadMoreButton.style.display = 'none';
        iziToast.info({
          title: 'Info',
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
        });
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      iziToast.error({
        title: 'Error',
        message: 'Failed to fetch more images. Please try again later.',
        position: 'topRight',
      });
    }
  });
});
