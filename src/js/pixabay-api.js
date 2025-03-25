import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const API_KEY = '49355863-0bea5bd004f89622601c6cae0';
const BASE_URL = 'https://pixabay.com/api/';

let currentPage = 1;
let currentQuery = '';

/**
 * The function makes a request to the Pixabay API
 * @param {string} query - search
 * @param {number} page - page number
 * @returns {Promise} - array promise
 */
export async function fetchImages(query, page = 1) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: 15,
      },
    });

    return {
      hits: response.data.hits,
      totalHits: response.data.totalHits,
    };
  } catch (error) {
    console.error(
      'Sorry, there are no images matching your search query. Please try again!',
      error
    );

    iziToast.error({
      title: '❌ Error',
      message: 'Something went wrong!',
      position: 'topRight',
    });

    return { hits: [], totalHits: 0 };
  }
}

export function resetPagination(query) {
  currentQuery = query;
  currentPage = 1;
}
export function incrementPage() {
  currentPage += 1;
}
export function getCurrentPage() {
  return currentPage;
}
