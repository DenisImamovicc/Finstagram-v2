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
    <div class="card m-2" style="width: 18rem;">
      <img src="https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg" class="card-img-top" alt="${image.title}">
      <div class="card-body">
        <h5 class="card-title">${image.title}</h5>
      </div>
    </div>
  `
  })
}