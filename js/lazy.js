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

    if(!images.length) {
      console.warn(`No elements matching the selector ${selector} were found, LazyImage could not initialise`);
      return;
    }

		// lazy load data for each image
		this.images = images.map(image => ({
			image,
			resolved: false,
			src: getLazySrc(image)
		}));

		this.images.forEach(function(lazyImage) {
			lazyImage.image.addEventListener(onLoadEventName, lazyLoadImage.bind(lazyImage));
		});

	}

	fireLazyEvent(image) {
		image.dispatchEvent(onLoad);
	}

}

function getLazySrc(image) {

  const src = image.getAttribute(lazySrcDataAttribute);

  if(src) {
    return src;
  }

  // return an array of image sources from the picture element children (source and img elements)
  return Array.from(image.children).map((source) => source.getAttribute(lazySrcDataAttribute));

}

module.exports = { LazyLoad };
