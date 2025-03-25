import { fetchImages } from './js/pixabay-api';
import { renderGallery } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  const query = form.elements['search-text'].value.trim();
  if (query === '') {
    iziToast.error({
      title: '❌ Error',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  showLoader();
  gallery.innerHTML = '';

  try {
    const images = await fetchImages(query);
    hideLoader();

    if (images.length === 0) {
      iziToast.error({
        title: '❌ No images found',
        message: 'Try another search query!',
        position: 'topRight',
      });
    } else {
      renderGallery(images);
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: '❌ Error',
      message: 'Something went wrong!',
      position: 'topRight',
    });
  }
});
