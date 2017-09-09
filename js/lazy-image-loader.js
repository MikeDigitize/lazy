const { CreateEvent } = require('./lazy-events');
const onCompleteEventName = 'lazyloadcomplete';
const onErrorEventName = 'lazyloaderror';
const onComplete = CreateEvent(onCompleteEventName);	
const onError = CreateEvent(onErrorEventName);	

function loadImage(src) {

	return new Promise(function (resolve) {

		const lazyImage = new Image();
		const result = { resolved: true };

		function onLoad() {
			removeListeners();
			resolve(result);
		}

		function onError() {
			removeListeners();
			result.resolved = false;
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
	const onImageLoad = getOnLoadCallback(image);
	
	loadImage(src).then((result) => {
		if(result.resolved) {
			onImageLoad(image, src);
			image.dispatchEvent(onComplete);
		}
		else {
			image.dispatchEvent(onError);
		}
	});

}

// TODO: add support for picture element
function getOnLoadCallback(image) {
	switch (true) {
		case image instanceof Image:
			return onShowImage;
		default:
			return onShowBackgroundImage;
	}
}

function onShowImage(image, src) {
	image.src = src;
}

function onShowBackgroundImage(div, src) {
	div.style.backgroundImage = `url(${src})`;
}

module.exports = {
	lazyLoadImage,
	loadImage,
	getOnLoadCallback,
	onShowImage,
	onShowBackgroundImage
};