const { createEvent } = require('./lazy-events');
const onCompleteEventName = 'lazyloadcomplete';
const onErrorEventName = 'lazyloaderror';
const onComplete = createEvent(onCompleteEventName);
const onError = createEvent(onErrorEventName);

/**
 *
 * loadImage
 *
 * @param { String or Array } src
 * @param { HTMLImageObject } image
 *
 * @return { Promise }
 *
 * Sets the `src` on an image element or `srcset` of source and image elements within a picture element.
 * Responds to its load / error events.
 *
 */

function loadImage(src, image) {

	return new Promise(function(resolve, reject) {

		function onLoad() {
			removeListeners();
			resolve(true);
		}

		function errorHandler() {
			removeListeners();
			reject(false);
		}

		function removeListeners() {
			image.removeEventListener('load', onLoad);
			image.removeEventListener('error', errorHandler);
		}

		image.addEventListener('load', onLoad);
		image.addEventListener('error', errorHandler);

		/**
		 *
		 * If the image is within a picture element, set srcset on each child.
		 * Browsers that don't support HTMLPictureElement will report it as an instance of a HTMLUnknownElement.
		 *
		*/

		if (
			image.parentNode && image.parentNode.constructor === window.HTMLPictureElement ||
			image.parentNode && typeof window.HTMLPictureElement === 'undefined' &&
			image.parentNode.constructor === window.HTMLUnknownElement ||
			image.parentNode && typeof window.HTMLPictureElement === 'undefined' &&
			image.parentNode.constructor === window.HTMLElement
		) {
			Array.from(image.parentNode.children).forEach(function(child, i) {
				// IE9 polyfill approach is to use a video element around the source elements
				if (child.constructor !== HTMLVideoElement) {
					child.setAttribute('srcset', src[i]);
				} else {
					// the source elements will be children of the video element in ie9
					Array.from(child.children).forEach(function(videoChild, j) {
						videoChild.setAttribute('srcset', src[i + j]);
					});
				}
			});

		} else {
			image.setAttribute('src', src);
		}
	});
}


// fired upon receipt of the `lazyload` event for each element stored in a LazyLoad instance
function lazyLoadImage() {
	const { image, src } = this;

	// create a dummy image to capture load / error events
	let lazyImage = new Image();

	// if it's a picture element, re-assign the dummy image to the img element within the picture element
	if (
		image.constructor === window.HTMLPictureElement ||
	    typeof window.HTMLPictureElement === 'undefined' && image.constructor === window.HTMLUnknownElement ||
		typeof window.HTMLPictureElement === 'undefined' && image.constructor === window.HTMLElement
	) {
		lazyImage = image.querySelector('img');
	}

	// get the appropriate callback to fire once an image has loaded
	const onImageLoad = getOnLoadCallback(image);

	loadImage(src, lazyImage)
		.then(function loadedImage() {
			onImageLoad(image, src);
			image.dispatchEvent(onComplete);
		})
		.catch(function loadingImageFailed() {
			image.dispatchEvent(onError);
		});

}

function getOnLoadCallback(image) {
	switch (true) {
		case image.constructor === HTMLImageElement:
			return onShowImage;

			// empty function callback for picture element
		case image.constructor === window.HTMLPictureElement ||
    typeof window.HTMLPictureElement === 'undefined' && image.constructor === window.HTMLUnknownElement ||
    typeof window.HTMLPictureElement === 'undefined' && image.constructor === window.HTMLElement:
			return () => {};

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
