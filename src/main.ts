import './style.css'
import { getPhotosBySearch } from './Flickrapi'
const alert = document.querySelector("#alert") as HTMLDivElement
const imageList = document.querySelector("#Imagelist") as HTMLDivElement
const searchImgForm = document.querySelector("#Searchimgform") as HTMLFormElement
const submitBttn = document.querySelector("#submitBttn") as HTMLButtonElement

let prevUserSearch;

searchImgForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  const currUserSearch = e.target[0].value
  let data;

  if (e.target[0].value.length === 0 || currUserSearch === prevUserSearch) {
    return renderTempAlert("Cannot send empty or previous search word!","alert-warning")
  }else{
    prevUserSearch = currUserSearch
  }
  submitBttn.disabled = true

  try {
    data = await getPhotosBySearch(currUserSearch)
  } catch (error) {
    console.log(error);
    submitBttn.disabled = false
  }
  console.log(data);
  
  renderImages(data.photos.photo)
  submitBttn.disabled = false

})


const renderImages = (images) => {
  imageList.innerHTML = ""

  images.map((image) => {
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


const renderTempAlert = (alertText,alertType) => {
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