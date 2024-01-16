import "./style.css";
import { getPhotosBySearch } from "./Flickrapi";
import { FlickrResponse, Photo, PhotosData } from "./types";
import {
  Listloader,
  Searchinput,
  alert,
  imageList,
  searchImgForm,
  submitBttn,
  modalContent,
} from "./dom-handlers";

const API_KEY = import.meta.env.VITE_APP_FLICKR_API_KEY;
const FLICKR_URL = import.meta.env.VITE_APP_FLICKR_URL;
let prevUserSearch: null | string = null;
let FlickrData: FlickrResponse;

window.addEventListener("scrollend", () => handleInfinityScroll());

imageList.addEventListener("click", async (e: MouseEvent) => {
  if (!e.target) {
    return;
  }

  try {
    const parentElement = (e.target as HTMLElement).parentElement;

    if (!parentElement || !parentElement.dataset.id) {
      return;
    }

    const data = await getPhotosBySearch(
      `https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${API_KEY}&photo_id=${parentElement.dataset.id}&format=json&nojsoncallback=1`
    );
    renderModal(data.photo);
  } catch (error) {
    renderTempAlert(`Server not responding! ${error}`, "alert-danger");
  }
});

searchImgForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (Searchinput.value.length === 0 || Searchinput.value === prevUserSearch) {
    return renderTempAlert(
      "Cannot send empty or previous search word!",
      "alert-warning"
    );
  } else {
    prevUserSearch = Searchinput.value;
  }
  submitBttn.disabled = true;
  imageList.innerHTML = "";
  Listloader.hidden = false;
  try {
    FlickrData = await getPhotosBySearch(
      `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&text=${Searchinput.value}&per_page=10&page=1&format=json&nojsoncallback=1`
    );
  } catch (error) {
    console.log(error);
    return renderTempAlert(`Server not responding!,${error}`, "alert-danger");
  }
  console.log(FlickrData);
  renderImages(FlickrData.photos);
  submitBttn.disabled = false;
  Listloader.hidden = true;
});

const renderImages = (images: PhotosData) => {
  images.photo.map((image: Photo) => {
    imageList.innerHTML += `
    <div class="col">       
      <div class="card m-2 h-100" id="card"  data-id="${image.id}">
        <img src="https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg" class="card-img w-100 h-100" alt="${image.title}">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#detailsModal">
        Show more
        </button>
      </div>
    </div>   
  `;
  });
};

const renderModal = (images: any) => {
  modalContent.innerHTML = `
    <div class="modal-header d-flex flex-column align-items-start">
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      <h1 class="modal-title fs-5" id="detailsModalLabel">${images.title._content}</h1>
      <h2 class="modal-title fs-6"  text-muted" >By: ${images.owner.username}</h2>
      <p>Views: ${images.views}</p>
    </div>
    <div class="modal-body">
    <a href="${images.urls.url[0]._content}" target="_blank">
      <img src="https://live.staticflickr.com/${images.server}/${images.id}_${images.secret}.jpg" class="card-img w-100 h-100" alt="${images.title._content}">
    </a>
    <h3 class="modal-title fs-6"  text-muted" >${images.description._content}</h3>
    </div>
    <div class="modal-footer">
    <button type="button" class="btn btn-secondary">Download</button>
    <button type="button" class="btn btn-primary">Save Photo</button>
  </div>
  `;
};

const renderTempAlert = (alertText: string, alertType: string) => {
  submitBttn.disabled = true;
  alert.hidden = false;
  alert.innerHTML = `
  <span>
    ${alertText}
  </span>
  `;
  alert.className = `alert ${alertType} text-center`;
  setTimeout(() => {
    submitBttn.disabled = false;
    alert.hidden = true;
    alert.innerHTML = "";
  }, 3000);
};

const handleInfinityScroll = async () => {
  const preRenderThreshold = 250;
  if (
    window.scrollY + window.innerHeight >
    document.documentElement.scrollHeight - preRenderThreshold
  ) {
    Listloader.hidden = false;
    let data = await getPhotosBySearch(
      `${FLICKR_URL}&api_key=${API_KEY}&text=${
        Searchinput.value
      }&per_page=10&page=${++FlickrData.photos
        .page}&format=json&nojsoncallback=1`
    );
    renderImages(data.photos);
    Listloader.hidden = true;
  }
};
