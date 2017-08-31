const { CreateEvent } = require('./lazy-events');
const { lazyLoadImage } = require('./image-loader');

class LazyLoad {
	
	constructor(selector, eventName) {
		
		const images = Array.from(document.querySelectorAll(selector));
		
		this.event = CreateEvent(eventName);		
		this.images = images.map(image => ({			
			image,
			loaded: false,
			src: image.getAttribute('data-src')	// js-dom doesn't support dataset
		}))
		.map(function(data) {
			const callback = lazyLoadImage.bind(data);
			image.addEventListener(eventName, callback);
			return {
				...data,
				callback
			};
		});

	}
	
}

module.exports = {
	LazyLoad
};