const { LazyLoad } = require('./lazy');
const { debounce } = require('./debounce');
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

    if(!this.images) {
      console.warn(`No elements matching the selector ${selector} were found, LazyScroll could not initialise`);
      return;
    }

    // add the positional info of elements to the data stored on the instance
    setLazyImagePositions.call(this);

    // debounce the scroll and resize event handlers used to test if elements are in the viewport
		onFindImagesToLoad = debounce(findImagesToLoad.bind(this), 100);
		onResize = debounce(setLazyImagePositions.bind(this), 100);
		addEventListeners();

  }

  rescanViewport() {
    findImagesToLoad.call(this);
  }

}

function setLazyImagePositions() {
	this.images = getLazyImagePositions(this.images);
}

// adds positional data to each lazy load element stored on the instance
function getLazyImagePositions(images) {
	return images.map(lazyImage => ({
		...lazyImage,
		imagePosition: getImagePosition(lazyImage.image)
	}));
}

// find images to load from ones yet to be resolved
function findImagesToLoad() {
	setLazyImagePositions.call(this);
	const imagesToLoad = getImagesInView(this.images);
	loadImages.call(this, imagesToLoad);
}

// attempt to load an element found within the viewport
function loadImages(imagesToLoad) {
	imagesToLoad.forEach(lazyImage => {
		this.fireLazyEvent(lazyImage.image);
		lazyImage.resolved = true;
	});
}

function addEventListeners() {
	window.addEventListener('scroll', onFindImagesToLoad);
	window.addEventListener('DOMContentLoaded', onFindImagesToLoad);
	window.addEventListener('resize', onResize);
}

function removeEventListeners() {
	window.removeEventListener('scroll', onFindImagesToLoad);
	window.removeEventListener('DOMContentLoaded', onFindImagesToLoad);
	window.removeEventListener('resize', onResize);
}

// get top and left co-ordinates of an element relative to the document
function getXYPosition(image) {
	const { top, left, bottom, right } = image.getBoundingClientRect();
	const { pageXOffset, pageYOffset } = window;
  return {
    top: top + pageYOffset,
    left: left + pageXOffset,
    bottom: bottom + pageYOffset,
    right: right + pageXOffset
  };
}

// get top, left, right and bottom position of an image relative to document
function getImagePosition(image) {
	const { top, left, bottom, right } = getXYPosition(image);
	return { left, right, top, bottom };
}

function getWindowScrollPosition() {
	const { pageXOffset, pageYOffset } = window;
	return { pageXOffset, pageYOffset };
}

function getWindowSize() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	return { width, height };
}

// get the boundaries of the viewport to see if an element is within them
function getWindowBoundaries() {
	const { pageXOffset, pageYOffset } = getWindowScrollPosition();
	const { width, height } = getWindowSize();
	const xMin = pageXOffset;
	const xMax = pageXOffset + width;
	const yMin = pageYOffset;
	const yMax = pageYOffset + height;
	return { xMin, xMax, yMin, yMax };
}

function getUnloadedImages(images) {
	return images.filter(lazyImage => !lazyImage.resolved);
}

// test if a yet to be resolved element is horizontally and vertically within the viewport
function getImagesInView(images) {

	const { xMin, xMax, yMin, yMax } = getWindowBoundaries();
	const unloadedImages = getUnloadedImages(images);

	if(unloadedImages.length === 0) {
		removeEventListeners();
		return [];
	}

	return unloadedImages.filter(function(lazyImage) {
		const { top, left, bottom, right } = lazyImage.imagePosition;
		return isInViewVertically(top, yMin, bottom, yMax) && isInViewHorizontally(left, xMin, right, xMax);
	});

}

function isInViewVertically(posYmin, windowYmin, posYmax, windowYmax) {
	return (posYmin <= windowYmax && posYmin >= windowYmin) || (posYmax <= windowYmax && posYmax >= windowYmin);
}

function isInViewHorizontally(posXmin, windowXmin, posXmax, windowXmax) {
	return (posXmin <= windowXmax && posXmin >= windowXmin) || (posXmax <= windowXmax && posXmax >= windowXmin);
}

module.exports = {
	LazyScroll,
	isInViewVertically,
	isInViewHorizontally,
	getWindowScrollPosition,
	getImagePosition
};
