const { CreateEvent } = require('./lazy-events');
const lazyLoadComplete = 'lazyloadcomplete';
const onLazyLoadCompleteEvent = CreateEvent(lazyLoadComplete);	

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
			return onShowImageElement;
		default:
			return onShowBackgroundImage;
	}
}

function onShowImageElement(image, src) {
	image.src = src;
}

function onShowBackgroundImage(div, src) {
	div.style.backgroundImage = `url(${src})`;
}

module.exports = {
	lazyLoadImage,
	loadImage,
	getOnImageLoadCallback,
	onShowImageElement,
	onShowBackgroundImage
};