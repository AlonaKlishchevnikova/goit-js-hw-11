

import './styles.css';
import fetchImages from './server.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const endText = document.querySelector('.end-text')
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');


let pageNumber = 1;
let currentHits = 0;
let searchQuery = '';

loadMoreBtn.style.display = 'none';
endText.style.display = 'none';

function renderImageList(images) {
    const markup = images
      .map(image => {
        return `<div class="photo-card">
         <a href="${image.largeImageURL}"><img class="photo" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/></a>
          <div class="info">
             <p class="info-item">
      <b>Likes</b> <span class="info-item-api"> ${image.likes} </span>
  </p>
              <p class="info-item">
                  <b>Views</b> <span class="info-item-api">${image.views}</span>
              </p>
              <p class="info-item">
                  <b>Comments</b> <span class="info-item-api">${image.comments}</span>
              </p>
              <p class="info-item">
                  <b>Downloads</b> <span class="info-item-api">${image.downloads}</span>
              </p>
          </div>
      </div>`;
      })
      .join('');
    gallery.insertAdjacentHTML('beforeend', markup);
  }

searchForm.addEventListener('submit', onSubmitSearchForm);

async function onSubmitSearchForm(e) {

  e.preventDefault();
  searchQuery = e.currentTarget.searchQuery.value.trim();
  pageNumber = 1;

    if (searchQuery === '') {
        Notiflix.Notify.failure('Please, enter your request');
         return;
  }
  gallery.innerHTML = '';
  endText.style.display = 'none';
  const response = await fetchImages(searchQuery, pageNumber);
  currentHits = response.hits.length;

  if (response.totalHits > 40) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
  }

  try {
    if (response.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      renderImageList (response.hits);
      gallerySimpleLightbox.refresh();
    }

    if (response.totalHits === 0) {
      gallery.innerHTML = '';
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      loadMoreBtn.style.display = 'none';
    }
   
  } catch (error) {
    console.log(error);
  }
  searchForm.reset(); 
}

loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);

async function onClickLoadMoreBtn(e) {
  e.preventDefault();
  pageNumber ++;
  const response = await fetchImages(searchQuery, pageNumber);
  renderImageList(response.hits);
  gallerySimpleLightbox.refresh();
  currentHits += response.hits.length;

  if (currentHits >= response.totalHits) {
    loadMoreBtn.style.display = 'none';
    endText.style.display = 'block'
  }
  
}

 