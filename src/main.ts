import './style.css'
import { getPhotosBySearch } from './Flickrapi'
import {Photo, PhotosData} from "./types"
const alert = document.querySelector("#alert") as HTMLDivElement
const imageList = document.querySelector("#Imagelist") as HTMLDivElement
const searchImgForm = document.querySelector("#Searchimgform") as HTMLFormElement
const submitBttn = document.querySelector("#submitBttn") as HTMLButtonElement
const Searchinput = document.querySelector("#Searchinput") as HTMLInputElement


let prevUserSearch : null | string = null

searchImgForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  let data;

  if (Searchinput.value.length === 0 || Searchinput.value === prevUserSearch) {
    return renderTempAlert("Cannot send empty or previous search word!","alert-warning")
  }else{
    prevUserSearch = Searchinput.value
  }
  submitBttn.disabled = true

  try {
    data = await getPhotosBySearch(Searchinput.value)
  } catch (error) {
    console.log(error);
    submitBttn.disabled = false
  }
  console.log(data);
  
  renderImages(data.photos)
  submitBttn.disabled = false

})


const renderImages = (images:PhotosData) => {
  imageList.innerHTML = ""

  images.photo.map((image:Photo) => {
    imageList.innerHTML += `
    <div class="col">       
      <div class="card m-2 h-100">
        <img src="https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg" class="card-img w-100 h-100" alt="${image.title}">
        <div class="card-img-overlay ">
          <h5 class="card-title bg-dark text-white p-1 rounded d-inline" text-break>${image.title}</h5>
        </div>
      </div>
    </div>   
  `
  })
}

const renderTempAlert = (alertText:String,alertType:String) => {
  submitBttn.disabled = true
  alert.hidden = false
  alert.innerHTML = 
  `
  <span>
    ${alertText}
  </span>
  `
  alert.className = `alert ${alertType} text-center`
  setTimeout(() => {
    submitBttn.disabled = false
    alert.hidden = true
    alert.innerHTML = ""
  }, 3000);
}