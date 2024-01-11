export const getPhotosBySearch = async (url:string) => {
	 const res = await fetch(url);

	 if (!res.ok) {
	 	console.log(`Could not get photos`, res);
	 	throw new Error(`Could not place order Status code was: ${res.status}`);
	 }
	 const data = await res.json();
	 console.log("Gots data back:", data);
     return data
}