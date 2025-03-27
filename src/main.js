import {
  fetchImages,
  resetPagination,
  incrementPage,
  getCurrentPage,
} from './js/pixabay-api';
import { renderGallery } from './js/render-functions';
import { clearGallery } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.load-more-button');
const messageEnd = document.querySelector('.message-end');

let currentSearchQuery = '';
let totalLoadedImages = 0;

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

function showLoadMoreButton() {
  loadMoreButton.style.display = 'block';
}

function hideLoadMoreButton() {
  loadMoreButton.style.display = 'none';
}

function showMessageEnd() {
  messageEnd.style.display = 'block';
}

function hideMessageEnd() {
  messageEnd.style.display = 'none';
}

function scrollToNextImages() {
  const galleryItem = gallery.querySelector('.gallery-item');

  if (galleryItem) {
    const cardHeight = galleryItem.getBoundingClientRect().height;

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

async function handleSearchSubmit(e) {
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

  resetPagination(query);
  currentSearchQuery = query;
  totalLoadedImages = 0;

  showLoader();
  clearGallery();
  hideMessageEnd();
  hideLoadMoreButton();

  try {
    const { hits, totalHits } = await fetchImages(query, getCurrentPage());
    hideLoader();

    if (hits.length === 0) {
      iziToast.error({
        title: '❌ No images found',
        message: 'Try another search query!',
        position: 'topRight',
      });
      hideLoadMoreButton();
    } else {
      renderGallery(hits);
      totalLoadedImages += hits.length;

      if (totalLoadedImages >= totalHits) {
        hideLoadMoreButton();
        showMessageEnd();
      } else if (hits.length < totalHits) {
        showLoadMoreButton();
      }

      scrollToNextImages();
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: '❌ Error',
      message: 'Something went wrong!',
      position: 'topRight',
    });
  }
}

async function handleLoadMoreClick() {
  incrementPage();
  showLoader();

  try {
    const { hits, totalHits } = await fetchImages(
      currentSearchQuery,
      getCurrentPage()
    );
    hideLoader();

    if (hits.length > 0) {
      renderGallery(hits);
      totalLoadedImages += hits.length;

      if (totalLoadedImages >= totalHits) {
        hideLoadMoreButton();
        showMessageEnd();
      } else {
        showLoadMoreButton();
      }

      scrollToNextImages();
    } else {
      iziToast.error({
        title: '❌ No more images found',
        message: 'End of results!',
        position: 'topRight',
      });
      hideLoadMoreButton();
      showMessageEnd();
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: '❌ Error',
      message: 'Something went wrong!',
      position: 'topRight',
    });
  }
}

form.addEventListener('submit', handleSearchSubmit);
loadMoreButton.addEventListener('click', handleLoadMoreClick);
