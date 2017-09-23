const { LazyLoad } = require('./lazy');
const { debounce } = require('./debounce');
let onFindImagesToLoad, onResize;

// triggers lazy loading of images
// based on their position relative to the window position
class LazyScroll extends LazyLoad {

	constructor(selector) {

		super(selector);

    // add the positional info of elements to the data stored on the instance
    setLazyImagePositions.call(this);

    // debounce the scroll and resize event handlers
		onFindImagesToLoad = debounce(findImagesToLoad.bind(this), 100);
		onResize = debounce(setLazyImagePositions.bind(this), 100);
		addEventListeners();

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

// trigger the loading of images within the viewport
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
	let left = 0, top = 0;
	if (image.offsetParent) {
		do {
			left += image.offsetLeft;
			top += image.offsetTop;
		} while (image = image.offsetParent);
	}
	return { left, top };
}

// get top, left, right and bottom position of an image relative to document
function getImagePosition(image) {
	const { top, left } = getXYPosition(image);
	const bottom = top + image.offsetHeight;
	const right = left + image.offsetWidth;
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

// get the positional boundaries of the viewport
// to see if an element is within those boundaries
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

// test if an element is horizontally and vertically within the view port
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
	return posYmin <= windowYmax && posYmax >= windowYmin;
}

function isInViewHorizontally(posXmin, windowXmin, posXmax, windowXmax) {
	return posXmin <= windowXmax && posXmax >= windowXmin;
}

module.exports = {
	LazyScroll,
	isInViewVertically,
	isInViewHorizontally,
	getWindowScrollPosition,
	getImagePosition
};
