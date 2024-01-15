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
} from "./dom-handlers";

const API_KEY = import.meta.env.VITE_APP_FLICKR_API_KEY;
const FLICKR_URL = import.meta.env.VITE_APP_FLICKR_URL;
let prevUserSearch: null | string = null;
let FlickrData: FlickrResponse;

window.addEventListener("scrollend", () => handleInfinityScroll());

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
    return renderTempAlert(
      `Server not responding!,${error}`,
      "alert-danger"
    );
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
      <div class="card m-2 h-100">
        <img src="https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg" class="card-img w-100 h-100" alt="${image.title}">
        <div class="card-img-overlay ">
          <h5 class="card-title bg-dark text-white p-1 rounded d-inline" text-break>${image.title}</h5>
        </div>
      </div>
    </div>   
  `;
  });
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
