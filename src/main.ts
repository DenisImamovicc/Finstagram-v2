import './style.css'
import data from "./data.json"


const imageList = document.querySelector("#Imagelist") as HTMLDivElement
const searchImgForm = document.querySelector("#Searchimgform") as HTMLFormElement

searchImgForm.addEventListener("submit",(e) => {
  e.preventDefault()
  // const currUserSearch = e.target[0].value
  console.log(data);
  renderImages(data.photos.photo)
})


const renderImages = (images) => {
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