const { LazyLoad } = require('./lazy');
const { debounce } = require('./debounce');

let findImagesCallback, resizeCallback;

class LazyScroll extends LazyLoad {
	constructor(selector) {
		super(selector);
		setLazyImagePositions.call(this);
		findImagesCallback = debounce(findImagesToLoad.bind(this), 100);
		resizeCallback = debounce(setLazyImagePositions.bind(this), 100);
		addEventListeners();
	}
}

function getLazyImagePositions(images) {
	return images.map(lazyImage => ({ 
		imagePosition: getImagePosition(lazyImage.image), 
		...lazyImage 
	}));
}

function setLazyImagePositions() {
	this.images = getLazyImagePositions(this.images);
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
	imagesToLoad.forEach(lazyImage => {
		this.fireEvent(lazyImage.image);
		lazyImage.loaded = true;
	});
}

function addEventListeners() {
	window.addEventListener('scroll', findImagesCallback);
	window.addEventListener('DOMContentLoaded', findImagesCallback);
	window.addEventListener('resize', resizeCallback);
}

function removeEventListeners() {
	window.removeEventListener('scroll', findImagesCallback);
	window.removeEventListener('DOMContentLoaded', findImagesCallback);
	window.removeEventListener('resize', resizeCallback);
}

function getImagePosition(image) {
	const { top, left } = getYPosition(image);
	const bottom = top + image.offsetHeight;
	const right = left + image.offsetWidth;
	return { left, right, top, bottom };
}

function getScrollPosition() {
	const { pageXOffset, pageYOffset } = window;
	return { pageXOffset, pageYOffset };
}

function getWindowSize() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	return { width, height };
}

function getWindowBoundaries() {
	const { pageXOffset, pageYOffset } = getScrollPosition();
	const { width, height } = getWindowSize();
	const xMin = pageXOffset;
	const xMax = pageXOffset + width;
	const yMin = pageYOffset;
	const yMax = pageYOffset + height;
	return { xMin, xMax, yMin, yMax };
}

function getUnloadedImages(images) {
	return images.filter(lazyImage => !lazyImage.loaded);
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
	LazyScroll
};