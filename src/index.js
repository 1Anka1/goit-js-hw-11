import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { fetchApiImg } from './js/fetchApi.js';
import { refs } from './js/getRefs';
import { createMarkupItem } from './js/createMarkupItem';

const lightbox = new SimpleLightbox('.gallery a');
let inputValue = '';
let page = 1;
let perPage = 40;
let totalHits;

Notiflix.Notify.init({
  timeout: 2000,
  width: '480px',
});

refs.loadMoreBtn.classList.add('is-hidden');
refs.loadMoreBtn.addEventListener('click', onClick);
refs.searchForm.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  page = 1;

  clearGallery();
  getGalleryItems();

  page += 1;
}

function onClick() {
  oncheckTotalPages();
  getLoadMoreItems();

  page += 1;
}
function clearGallery() {
  refs.gallery.innerHTML = '';
}

async function getGalleryItems() {
  inputValue = refs.inputForm.value.trim();

  if (!inputValue) {
    return;
  }

  try {
    const searchGallery = await fetchApiImg(inputValue, page);
    createGallery(searchGallery.hits);

    if (searchGallery.totalHits) {
      refs.loadMoreBtn.classList.remove('is-hidden');
      Notiflix.Notify.success(
        `Hooray! We found ${searchGallery.totalHits} images.`
      );
    }
    totalHits = searchGallery.totalHits;

    if (totalHits < perPage) {
      refs.loadMoreBtn.classList.add('is-hidden');
    }

    onSearchHits(searchGallery.totalHits);
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}

function createGallery(arr) {
  const galleryList = arr.reduce(
    (acc, item) => acc + createMarkupItem(item),
    ''
  );
  return refs.gallery.insertAdjacentHTML('beforeend', galleryList);
}

function onSearchHits(total) {
  if (!total) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again..'
    );
    return;
  }
}

async function getLoadMoreItems() {
  try {
    const searchGallery = await fetchApiImg(inputValue, page);
    createGallery(searchGallery.hits);
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}

function oncheckTotalPages() {
  if (page >= Math.ceil(totalHits / perPage)) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
  }
}
