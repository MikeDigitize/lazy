const lazy = require('scroll-detection');
const { 
	getLazyImagesPositions,
	getUnloadedImages,
	loadImagesInView } = lazy;

window.getLazyImagesPositions = getLazyImagesPositions;
window.getUnloadedImages = getUnloadedImages;
window.loadImagesInView = loadImagesInView;