const { LazyLoad } = require('./lazy');
const { debounce } = require('./debounce');
let onFindImagesToLoad, onResize;

// triggers lazy loading of images
// based on their position relative to the window position
class LazyScroll extends LazyLoad {
	
	constructor(selector) {

		super(selector);

		setLazyImagePositions.call(this);

		onFindImagesToLoad = debounce(findImagesToLoad.bind(this), 100);
		onResize = debounce(setLazyImagePositions.bind(this), 100);
		addEventListeners();

	}
}

function setLazyImagePositions() {
	this.images = getLazyImagePositions(this.images);
}

// adds positional data to each lazy load image stored on the instance
function getLazyImagePositions(images) {
	return images.map(lazyImage => ({ 
		...lazyImage,
		imagePosition: getImagePosition(lazyImage.image)		 
	}));
}

function getYPosition(image) {
	let left = 0, top = 0;
	if (image.offsetParent) { 
		do {
			left += image.offsetLeft;
			top += image.offsetTop;
		} while (image = image.offsetParent);
		return { left, top };
	}
}

function findImagesToLoad() {
	setLazyImagePositions.call(this);
	const imagesToLoad = getImagesInView(this.images);
	loadImages.call(this, imagesToLoad);
}

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

function getImagePosition(image) {
	const { top, left } = getYPosition(image);
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

function getImagesInView(images) {

	const { xMin, xMax, yMin, yMax } = getWindowBoundaries();
	const unloadedImages = getUnloadedImages(images);
	
	if(unloadedImages.length === 0) {
		removeEventListeners();
		return [];
	}

	return unloadedImages.filter(lazyImage => {
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