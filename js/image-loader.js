/**	
	Expects a selector for an image container with an image inside that has a data-src attribute for the image source
	and no or an empty src attribute

	*/

function getLazyImages(selector) {
	return Array
					.from(document.querySelectorAll(selector))
					.map(holder => ({ holder, image: holder.querySelector('[data-src]') }))
					.map(holder => ({ src: holder.image.dataset.src, loaded: false,  ...holder }));
}

function loadImage(src) {

	return new Promise(function(resolve) {

		const lazyImage = new Image();
		const result = { loaded: true };

		function onLoad() {
			removeListeners();
			resolve(result);
		}

		function onError() {
			removeListeners();
			result.loaded = false;
			resolve(result);
		}

		function removeListeners() {
			lazyImage.removeEventListener('load', onLoad);
			lazyImage.removeEventListener('error', onError);
		}

		lazyImage.addEventListener('load', onLoad);
		lazyImage.addEventListener('error', onError);

		lazyImage.src = src;

	});

}

function showImage(imageData) {

	let { image, src, loaded } = imageData;

	return new Promise(function(resolve) {

		loadImage(src).then(function(result) {		

			const { loaded } = result;
			
			if(loaded) {
				// don't tie to image element - picture and CSS backgrounds too
				image.src = src;
				imageData.loaded = true;
			}
			else {
				// handle unloadable images here
			}

			resolve(imageData);

		});

	});

}

module.exports = {
	showImage,
	loadImage,
	getLazyImages
};