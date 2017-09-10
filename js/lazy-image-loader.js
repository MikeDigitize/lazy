const { CreateEvent } = require('./lazy-events');
const onCompleteEventName = 'lazyloadcomplete';
const onErrorEventName = 'lazyloaderror';
const onComplete = CreateEvent(onCompleteEventName);	
const onError = CreateEvent(onErrorEventName);	

function loadImage(src) {

	return new Promise(function (resolve, reject) {

		const lazyImage = new Image();

		function onLoad() {
			removeListeners();
			resolve(true);
		}

		function onError() {
			removeListeners();
			reject(false);
		}

		function removeListeners() {
			lazyImage.removeEventListener('load', onLoad);
			lazyImage.removeEventListener('error', onError);
		}

		lazyImage.addEventListener('load', onLoad);
		lazyImage.addEventListener('error', onError);

		lazyImage.setAttribute('src', src);

	});

}

function lazyLoadImage() {

	const { image, src } = this;
	const onImageLoad = getOnLoadCallback(image);
	
	loadImage(src)
		.then(function() {
			onImageLoad(image, src);
			image.dispatchEvent(onComplete);
		})
		.catch(function() {
			image.dispatchEvent(onError);
		});

}

// TODO: add support for picture element
function getOnLoadCallback(image) {
	switch (true) {
		case image.constructor === HTMLImageElement:
			return onShowImage;
		default:
			return onShowBackgroundImage;
	}
}

function onShowImage(image, src) {
	image.setAttribute('src', src);
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