const { createEvent } = require('./helpers');
const { lazyLoadImage } = require('./lazy-image-loader');
const onLoadEventName = 'lazyload';
const onLoad = createEvent(onLoadEventName);
const lazySrcDataAttribute = 'data-lazy-src';

/**
 *
 * LazyLoad
 *
 * The base class that provides the functionality to lazy load images, picture elements and CSS background images.
 * LazyLoad doesn't auto trigger any lazy load behaviour internally, it just provides an event driven interface to do so.
 *
 */

class LazyLoad {
	constructor(selector) {
		const images = Array.from(document.querySelectorAll(selector));

		if (!images.length) {
			console.warn(
				`No elements matching the selector ${selector} were found, LazyLoad could not initialise`
			);
			return;
		}

		this.images = images.map(image => ({
			image,
			resolved: false,
			src: getLazySrc(image)
		}));

		this.images.forEach(function initialiseLoadEventListeners(lazyImage) {
			lazyImage.onLoad = lazyLoadImage.bind(lazyImage);
			lazyImage.image.addEventListener(onLoadEventName, lazyImage.onLoad);
		});
	}

	fireLazyLoadEvent(image) {
		image.dispatchEvent(onLoad);
	}

	destroy() {
		this.images.forEach(function removeLoadEventListeners(lazyImage) {
			lazyImage.image.removeEventListener(onLoadEventName, lazyImage.onLoad);
		});
	}
}

// get the filepath to load for each element within an instance
function getLazySrc(image) {
	// if the element is not a picture element return its `data-lazy-src` attribute
	const src = image.getAttribute(lazySrcDataAttribute);

	if (src) {
		return src;
	}

	// if the element is a picture element return an array of srcs from its children (source and img elements)
	const srcs = Array.from(image.children).map(function(child) {
		/**
		 *
		 * The picturefill polyfill wraps a video element around source elements in IE9.
		 * If this is the case the `data-lazy-src` attributes need to be retrieved from within the video element.
		 * The srcs will be returned as an array if this is the case so will need flattening.
		 *
		 */

		if (child.constructor === HTMLVideoElement) {
			return Array.from(child.children).map(function picturefillMap(
				videoChild
			) {
				return videoChild.getAttribute(lazySrcDataAttribute);
			});
		}

		return child.getAttribute(lazySrcDataAttribute);
	});

	// flatten the array if necessary
	return [].concat.apply([], srcs);
}

module.exports = { LazyLoad };
