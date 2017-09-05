const { CreateEvent } = require('./lazy-events');
const LAZY_LOAD_COMPLETE = 'lazyloadcomplete';

const onLazyLoadCompleteEvent = CreateEvent(LAZY_LOAD_COMPLETE);	

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
			onImageLoad(image, src);
			image.dispatchEvent(onLazyLoadCompleteEvent);
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

function loadBackgroundImage() {

}

module.exports = {
	lazyLoadImage,
	loadImage,
	getOnImageLoadCallback,
	loadImageElement,
	loadBackgroundImage
};