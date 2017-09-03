function loadImage(src) {

	return new Promise(function (resolve) {

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

function lazyLoadImage() {
	const { image, src } = this;
	const onImageLoad = getOnImageLoadCallback(image);
	loadImage(src).then((result) => {
		if(result.loaded) {
			onImageLoad(image, src)
		}
	});
}

function getOnImageLoadCallback(image) {
	switch (true) {
		case image instanceof Image:
			return loadImageElement;
		default:
			return loadBackgroundImage;
	}
}

function loadImageElement(image, src) {
	image.src = src;
}

function loadPictureElement() {

}

function loadBackgroundImage() {

}

module.exports = {
	lazyLoadImage,
	loadImage,
	getOnImageLoadCallback,
	loadImageElement,
	loadPictureElement,
	loadBackgroundImage
};