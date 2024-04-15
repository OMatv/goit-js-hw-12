import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { renderImages, clearGallery } from './js/render-functions.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#search-form');
  const input = document.querySelector('#search-input');
  const gallery = document.querySelector('.gallery');
  const loader = document.querySelector('.loader');
  const loadMoreBtn = document.querySelector('#load-more-btn');

  const lightbox = new SimpleLightbox('.gallery a');
  let currentPage = 1;
  let currentQuery = '';
  let cardHeight = 0;

  async function loadImages(query, page) {
    try {
      loader.style.display = 'block';
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: '43289261-b2f679df5fe28faf218337d96',
          q: query,
          image_type: 'photo',
          orientation: 'horizontal',
          captions: true,
          page: page,
          per_page: 15,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch images from Pixabay API');
    } finally {
      loader.style.display = 'none';
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
    await fetchAndRenderImages(currentQuery, currentPage);
    gallery.style.display = 'flex';
    loadMoreBtn.style.display = 'block';
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  async function fetchAndRenderImages(query, page) {
    try {
      const { hits, totalHits } = await loadImages(query, page);
      renderImages(hits);
      lightbox.refresh();
      if (page === 1) {
        const card = document.querySelector('.gallery__item');
        cardHeight = card.getBoundingClientRect().height;
      }
      if (hits.length === 0 || page * 15 >= totalHits) {
        loadMoreBtn.style.display = 'none';
        iziToast.info({
          title: 'Info',
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
        });
      }
    } catch (error) {
      iziToast.error({
        title: 'Error',
        message: 'Failed to fetch images. Please try again later.',
        position: 'topRight',
      });
    }
  }

  async function loadMoreImages() {
    currentPage++;
    const scrollDistance = cardHeight * 2;
    await fetchAndRenderImages(currentQuery, currentPage);
    window.scrollBy({ top: scrollDistance, behavior: 'smooth' });
  }

  form.addEventListener('submit', handleSearchSubmit);
  loadMoreBtn.addEventListener('click', loadMoreImages);
});
