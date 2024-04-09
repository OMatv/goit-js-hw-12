import axios from 'axios';

const API_KEY = '43289261-b2f679df5fe28faf218337d96';
const BASE_URL = 'https://pixabay.com/api/';

async function fetchImages(query, page, perPage = 15) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPage,
      },
    });

    const { data } = response;
    if (data.totalHits === 0) {
      throw new Error('No images found');
    }

    return data.hits;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}

export { fetchImages };
