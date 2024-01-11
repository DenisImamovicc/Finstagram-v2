const API_KEY = "904552878bd72bf5143028f71ca3411e"
const API_SECRET = "b41a48685433caf6"

export const getPhotosBySearch = async <T>(searchInput:T) => {
	 const res = await fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&text=${searchInput}&per_page=10&page=1&format=json&nojsoncallback=1`);

	 if (!res.ok) {
	 	console.log(`Could not get photos of ${searchInput}`, res);
	 	throw new Error(`Could not place order Status code was: ${res.status}`);
	 }
	 const data = await res.json();
	 console.log("Gots data back:", data);
     return data
}