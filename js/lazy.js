const lazy = require('scroll-detection');
const { 
	getLazyImagesPositions,
	getUnloadedImages,
	loadImagesInView,
	getImagePositions } = lazy;

window.getLazyImagesPositions = getLazyImagesPositions;
window.getUnloadedImages = getUnloadedImages;
window.loadImagesInView = loadImagesInView;
window.getImagePositions = getImagePositions;