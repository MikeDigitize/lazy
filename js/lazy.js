const { CreateEvent } = require('./lazy-events');
const { lazyLoadImage } = require('./lazy-image-loader');

const lazyLoadEvent = 'lazyload';
const lazySrcDataAttribute = 'data-lazy-src';	

const onLazyLoadEvent = CreateEvent(lazyLoadEvent);	

class LazyLoad {
	
	constructor(selector) {
		
		const images = Array.from(document.querySelectorAll(selector));
		
		this.images = images.map(image => ({	
			image,
			loaded: false,
			src: image.getAttribute(lazySrcDataAttribute)
		}));
		
		this.images.forEach(function(lazyImage) {
			lazyImage.image.addEventListener(lazyLoadEvent, lazyLoadImage.bind(lazyImage));
		});

	}

	fireLazyEvent(image) {
		image.dispatchEvent(onLazyLoadEvent);
	}
	
}

module.exports = { LazyLoad };