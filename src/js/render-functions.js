export function renderImages(images) {
  const galleryElement = document.querySelector('.gallery');

  images.forEach(image => {
    const imageHTML = `
      <a class="gallery__item" href="${image.largeImageURL}" target="_blank">
        <figure class="gallery__figure">
          <img class="gallery__img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
          <figcaption class="gallery__figcaption">
            <div class="gallery__caption">Likes: ${image.likes}</div>
            <div class="gallery__caption">Views: ${image.views}</div>
            <div class="gallery__caption">Comments: ${image.comments}</div>
            <div class="gallery__caption">Downloads: ${image.downloads}</div>
          </figcaption>
        </figure>
      </a>`;

    galleryElement.insertAdjacentHTML('beforeend', imageHTML);
  });
}

export function clearGallery() {
  const galleryElement = document.querySelector('.gallery');
  galleryElement.innerHTML = '';
}
