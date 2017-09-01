const { LazyLoad } = require('./lazy');
const { debounce } = require('./debounce');

class LazyScroll extends LazyLoad {
	constructor(selector, eventName) {
		super(selector, eventName);
		this.images = getLazyImagePositions(this.images);
		window.addEventListener('scroll', debounce(testImages.bind(this), 100));
		window.addEventListener('DOMContentLoaded', testImages.bind(this));
	}
}

function testImages() {
	console.log(getImagesInView(this.images));
}
function getLazyImagePositions(images) {
	return images.map(lazyImage => ({ imagePosition: getHolderPosition(lazyImage.image), ...lazyImage }));
}

function getHolderPosition(holder) {
	return holder.getBoundingClientRect();
}

function getScrollPosition() {
	const x = window.scrollX;
	const y = window.scrollY;
	return { x, y };
}

function getWindowSize() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	return { width, height };
}

function getWindowBoundaries() {
	const { x, y } = getScrollPosition();
	const { width, height } = getWindowSize();
	const xMin = x;
	const xMax = x + width;
	const yMin = y;
	const yMax = y + height;
	return { xMin, xMax, yMin, yMax };
}

function getUnloadedImages(images) {
	return images.filter(lazyImage => !lazyImage.loaded);
}

function getImagesInView(images) {
	const { xMin, xMax, yMin, yMax } = getWindowBoundaries();
	const unloadedImages = getUnloadedImages(images);
	return unloadedImages.filter(lazyImage => {
		const { top, bottom } = lazyImage.imagePosition;
		return isInViewVertically(top, yMin, bottom, yMax);
	});
}
function isInViewVertically(posYmin, windowYmin, posYmax, windowYmax) {
	//console.log('posYmin:', posYmin, 'windowYmin:', windowYmin, 'posYmax:', posYmax, 'windowYmax:', windowYmax);
	return (posYmin <= windowYmax && posYmin >= windowYmin) || (windowYmin <= posYmax && posYmax <= windowYmax);
}

module.exports = {
	LazyScroll
};