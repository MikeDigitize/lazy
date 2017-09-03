const { CreateEvent } = require('./lazy-events');
const { lazyLoadImage } = require('./lazy-image-loader');

const LAZY_LOAD = 'lazyload';
const lazyEvent = CreateEvent(LAZY_LOAD);	
const SRC = 'data-src';	

class LazyLoad {
	
	constructor(selector) {
		
		const images = Array.from(document.querySelectorAll(selector));
		
		this.images = images.map(image => ({	
			image,
			loaded: false,
			src: image.getAttribute(SRC)	// js-dom doesn't support dataset
		}));
		
		this.images.forEach(function(lazyImage) {
			lazyImage.image.addEventListener(LAZY_LOAD, lazyLoadImage.bind(lazyImage));
		});

	}

	fireEvent(image) {
		image.dispatchEvent(lazyEvent);
	}
	
}

module.exports = { LazyLoad };