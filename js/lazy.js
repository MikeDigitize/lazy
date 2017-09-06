const { CreateEvent } = require('./lazy-events');
const { lazyLoadImage } = require('./lazy-image-loader');
const onLoadEventName = 'lazyload';
const onLoad = CreateEvent(onLoadEventName);	
const lazySrcDataAttribute = 'data-lazy-src';	

// base lazy load class that provides the functionality to lazy load
// but doesn't actually trigger any lazy load behaviour internally
class LazyLoad {
	
	constructor(selector) {
		
		const images = Array.from(document.querySelectorAll(selector));
		
		// lazy load data for each image
		this.images = images.map(image => ({	
			image,
			resolved: false,
			src: image.getAttribute(lazySrcDataAttribute)
		}));
		
		this.images.forEach(function(lazyImage) {
			lazyImage.image.addEventListener(onLoadEventName, lazyLoadImage.bind(lazyImage));
		});

	}

	fireLazyEvent(image) {
		image.dispatchEvent(onLoad);
	}
	
}

module.exports = { LazyLoad };