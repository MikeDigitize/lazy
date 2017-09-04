const { CreateEvent } = require('./lazy-events');
const { lazyLoadImage } = require('./lazy-image-loader');

const LAZY_LOAD = 'lazyload';
const LAZY_SRC = 'data-lazy-src';	

const onLazyLoadEvent = CreateEvent(LAZY_LOAD);	

class LazyLoad {
	
	constructor(selector) {
		
		const images = Array.from(document.querySelectorAll(selector));
		
		this.images = images.map(image => ({	
			image,
			loaded: false,
			src: image.getAttribute(LAZY_SRC)
		}));
		
		this.images.forEach(function(lazyImage) {
			lazyImage.image.addEventListener(LAZY_LOAD, lazyLoadImage.bind(lazyImage));
		});

	}

	fireEvent(image) {
		image.dispatchEvent(onLazyLoadEvent);
	}
	
}

module.exports = { LazyLoad };