const { CreateEvent } = require('./lazy-events');
const { lazyLoadImage } = require('./lazy-image-loader');
const onLoadEventName = 'lazyload';
const onLoad = CreateEvent(onLoadEventName);
const lazySrcDataAttribute = 'data-lazy-src';

// base lazy load class that provides the functionality to lazy load
// but doesn't actually auto trigger any lazy load behaviour internally
// just provides an event driven interface to do so
class LazyLoad {

	constructor(selector) {

    const images = Array.from(document.querySelectorAll(selector));

    if(!images.length) {
      console.warn(`No elements matching the selector ${selector} were found, LazyLoad could not initialise`);
      return;
    }

		// lazy load data for each element
		this.images = images.map(image => ({
			image,
			resolved: false,
			src: getLazySrc(image)
		}));

    // add the lazyload event listener to each element
		this.images.forEach(function(lazyImage) {
			lazyImage.image.addEventListener(onLoadEventName, lazyLoadImage.bind(lazyImage));
		});

	}

  // fire lazyload event on element to begin attempting to load
	fireLazyEvent(image) {
		image.dispatchEvent(onLoad);
	}

}

function getLazySrc(image) {

  // if a non picture element get the `data-lazy-src` attribute directly from it
  const src = image.getAttribute(lazySrcDataAttribute);

  if(src) {
    return src;
  }

  // if a picture element return an array of image sources from its children (source and img elements)
  const srcs = Array.from(image.children).map(function(child) {

    // polyfill approach is to use a video element around source elements
    // so the `data-lazy-src` attributes need to be retrieved from within the video element
    // the sources will be an array in an array so will need flattening
    if(child.constructor === HTMLVideoElement) {
      return Array.from(child.children).map(function(videoChild) {
        return videoChild.getAttribute(lazySrcDataAttribute);
      });
    }
    else {
      return child.getAttribute(lazySrcDataAttribute);
    }
  });

  // flatten the array if necessary
  return [].concat.apply([], srcs);

}

module.exports = { LazyLoad };
