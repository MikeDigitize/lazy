const { LazyLoad } = require('./lazy');
const { debounce } = require('./helpers');
let onFindImagesToLoad, onResize;

/**
 *
 * LazyScroll
 *
 * Triggers the lazy loading of elements based on their scroll position relative to the viewport.
 * Stores each element's positional data to test after a scroll or resize event.
 *
 */

class LazyScroll extends LazyLoad {
	constructor(selector) {
		super(selector);

		if (!this.images) {
			console.warn(
				`No elements matching the selector ${selector} were found, LazyScroll could not initialise`
			);
			return;
		}

		setLazyImagePositions.call(this);

		// Debounce the scroll listeners for performance
		onFindImagesToLoad = debounce(findImagesToLoad.bind(this), 100);
		onResize = debounce(setLazyImagePositions.bind(this), 100);

		// Use intersection observer if browser supports it, if not fall back to event listeners
		if (!('IntersectionObserver' in window)) {
			addEventListeners();
		} else {
			this.observer = new window.IntersectionObserver(
				onIntersection.bind(this),
				{
					rootMargin: '0px 0px',
					threshold: 0
				}
			);

			this.images.forEach(imageObj => this.observer.observe(imageObj.image));
		}
	}

	// Override to scan the viewport (slide changes, dynamic data etc)
	rescanViewport() {
		findImagesToLoad.call(this);
	}
}

// Handle the loading of images in the intersection observer
function onIntersection(entries) {
	const unloadedImages = getUnloadedImages(this.images);

	const imagesToLoad = entries.reduce((images, entry) => {
		if (entry.intersectionRatio > 0) {
			const { target } = entry;

			this.observer.unobserve(target);
			const image = unloadedImages.find(i => i.image === target);

			return images.concat(image);
		}

		// Image not in viewport
		return images;
	}, []);

	// Load the images
	if (imagesToLoad.length) {
		loadImages.call(this, imagesToLoad);
	}
}

function setLazyImagePositions() {
	this.images = getLazyImagePositions(this.images);
}

// Adds positional data to each lazy load element stored on the instance
function getLazyImagePositions(images) {
	return images.map(lazyImage => ({
		...lazyImage,
		imagePosition: getImagePosition(lazyImage.image)
	}));
}

// Find images to load from ones yet to be resolved
function findImagesToLoad() {
	this.images = getLazyImagePositions(this.images);
	const imagesToLoad = getImagesInView(this.images);
	loadImages.call(this, imagesToLoad);
}

// Attempt to load an element found within the viewport
function loadImages(imagesToLoad) {
	imagesToLoad.forEach(lazyImage => {
		this.fireLazyLoadEvent(lazyImage.image);
		lazyImage.resolved = true;
	});
}

// Add event listeners and image loading callbacks
function addEventListeners() {
	window.addEventListener('scroll', onFindImagesToLoad);
	window.addEventListener('DOMContentLoaded', onFindImagesToLoad);
	window.addEventListener('resize', onResize);
}

// Remove all event listeners
function removeEventListeners() {
	window.removeEventListener('scroll', onFindImagesToLoad);
	window.removeEventListener('DOMContentLoaded', onFindImagesToLoad);
	window.removeEventListener('resize', onResize);
}

// Get top and left co-ordinates of an element relative to the document
function getImagePosition(image) {
	const { top, left, bottom, right } = image.getBoundingClientRect();
	const { pageXOffset, pageYOffset } = window;
	return {
		top: top + pageYOffset,
		left: left + pageXOffset,
		bottom: bottom + pageYOffset,
		right: right + pageXOffset
	};
}

function getWindowScrollPosition() {
	const { pageXOffset, pageYOffset } = window;
	return { pageXOffset, pageYOffset };
}

// Get the boundaries of the viewport to see if an element is within them
function getWindowBoundaries() {
	const { pageXOffset, pageYOffset } = getWindowScrollPosition();
	const xMin = pageXOffset;
	const xMax = pageXOffset + window.innerWidth;
	const yMin = pageYOffset;
	const yMax = pageYOffset + window.innerHeight;
	return { xMin, xMax, yMin, yMax };
}

// Retrieve a list of all the images on the page that have not loaded
function getUnloadedImages(images) {
	return images.filter(lazyImage => !lazyImage.resolved);
}

// Test if a yet to be resolved element is horizontally and vertically within the viewport
function getImagesInView(images) {
	const { xMin, xMax, yMin, yMax } = getWindowBoundaries();
	const unloadedImages = getUnloadedImages(images);

	if (unloadedImages.length === 0) {
		removeEventListeners();
		return [];
	}

	return unloadedImages.filter(function(lazyImage) {
		const { top, left, bottom, right } = lazyImage.imagePosition;
		return (
			isInViewVertically(top, yMin, bottom, yMax) &&
			isInViewHorizontally(left, xMin, right, xMax)
		);
	});
}

// Calculate if an image is in the viewport vertically
function isInViewVertically(imageTop, windowTop, imageBottom, windowBottom) {
	return imageTop <= windowBottom && imageBottom >= windowTop;
}

// Calculate if an image is in the viewport horizontally
function isInViewHorizontally(imageLeft, windowLeft, imageRight, windowRight) {
	return imageLeft <= windowRight && imageRight >= windowLeft;
}

module.exports = {
	LazyScroll,
	isInViewVertically,
	isInViewHorizontally,
	getWindowScrollPosition
};
