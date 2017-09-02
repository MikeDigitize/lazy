const { CreateEvent } = require('./lazy-events');
const { lazyLoadImage } = require('./lazy-image-loader');
const LAZY_LOAD = 'lazyload';

class LazyLoad {
	
	constructor(selector) {
		
		const images = Array.from(document.querySelectorAll(selector));
		
		this.event = CreateEvent(LAZY_LOAD);		
		this.images = images.map(image => ({	
			image,
			loaded: false,
			src: image.getAttribute('data-src')	// js-dom doesn't support dataset
		}))
		
		this.images.forEach(function(lazyImage) {
			lazyImage.image.addEventListener(LAZY_LOAD, lazyLoadImage.bind(lazyImage));
		});

	}
	
}

module.exports = {
	LazyLoad
};