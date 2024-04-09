import { SimpleLightbox } from 'simplelightbox';

const lightbox = new SimpleLightbox('.gallery a');

function clearGallery() {
  const galleryElement = document.querySelector('.gallery');
  galleryElement.innerHTML = '';
}

function renderImages(images) {
  const galleryElement = document.querySelector('.gallery');
  let imageHTML = '';

  images.forEach(image => {
    imageHTML += `
      <a href="${image.largeImageURL}">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
      </a>`;
  });

  galleryElement.innerHTML += imageHTML;
  lightbox.refresh();
}

export { clearGallery, renderImages };
