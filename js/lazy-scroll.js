const { LazyLoad } = require('./lazy');
const { debounce } = require('./debounce');

let { width } = getWindowSize();

class LazyScroll extends LazyLoad {
	constructor(selector, eventName) {
		super(selector, eventName);
		setLazyImagePositions.call(this);
		window.addEventListener('scroll', debounce(testImages.bind(this), 100));
		window.addEventListener('DOMContentLoaded', testImages.bind(this));
		window.addEventListener('resize', debounce(setLazyImagePositions.bind(this), 100));
	}
}

function setLazyImagePositions() {
	this.images = getLazyImagePositions(this.images);
}

function getYPosition(image) {
	var left = 0, top = 0;
	if (image.offsetParent) { 
		do {
			left += image.offsetLeft;
			top += image.offsetTop;
		} while (image = image.offsetParent);
		return { left, top };
	}
}

function testImages() {
	setLazyImagePositions.call(this);
	const imagesToLoad = getImagesInView(this.images);
	console.log(imagesToLoad);
	// imagesToLoad.forEach(lazyImage => {
	// 	//lazyImage.loaded = true;
	// 	lazyImage.image.dispatchEvent(this.event);
	// });
}
function getLazyImagePositions(images) {
	return images.map(lazyImage => ({ imagePosition: getImagePosition(lazyImage.image), ...lazyImage }));
}

function getImagePosition(image) {
	const { top, left } = getYPosition(image);
	const bottom = top + image.offsetHeight;
	const right = left + image.offsetWidth;
	return { left, right, top, bottom };
}

function getScrollPosition() {
	return { scrollX, scrollY } = window;
}

function getWindowSize() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	return { width, height };
}

function getWindowBoundaries() {
	const { scrollX, scrollY } = getScrollPosition();
	const { width, height } = getWindowSize();
	const xMin = scrollX;
	const xMax = scrollX + width;
	const yMin = scrollY;
	const yMax = scrollY + height;
	return { xMin, xMax, yMin, yMax };
}

function getUnloadedImages(images) {
	return images.filter(lazyImage => !lazyImage.loaded);
}

function getImagesInView(images) {
	const { xMin, xMax, yMin, yMax } = getWindowBoundaries();
	const unloadedImages = getUnloadedImages(images);
	return unloadedImages.filter(lazyImage => {
		const { top, left, bottom, right } = lazyImage.imagePosition;
		return isInViewVertically(top, yMin, bottom, yMax) //&& isInViewHorizontally(left, xMin, right, xMax);
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