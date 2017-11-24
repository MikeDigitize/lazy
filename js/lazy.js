const { createEvent } = require('./lazy-events');
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
		// Create an array of all the images matching the given selector
		const images = Array.from(document.querySelectorAll(selector));

		// Warn user if no images found
		if (!images.length) {
			console.warn(`No elements matching the selector ${selector} were found, LazyLoad could not initialise`);
			return;
		}

		// store lazy load data for each element
		this.images = images.map(image => ({
			image,
			resolved: false,
			src: getLazySrc(image)
		}));

		// listen for the lazyload event on each element
		this.images.forEach(function(lazyImage) {
			lazyImage.image.addEventListener(onLoadEventName, lazyLoadImage.bind(lazyImage));
		});

	}

	// fire lazyload event on element to begin attempting to load
	fireLazyLoadEvent(image) {
		image.dispatchEvent(onLoad);
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
			return Array.from(child.children).map(function picturefillMap(videoChild) {
				return videoChild.getAttribute(lazySrcDataAttribute);
			});
		}

		return child.getAttribute(lazySrcDataAttribute);

	});

	// flatten the array if necessary
	return [].concat.apply([], srcs);

}

module.exports = { LazyLoad };
