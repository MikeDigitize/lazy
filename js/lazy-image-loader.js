const { CreateEvent } = require('./lazy-events');
const onCompleteEventName = 'lazyloadcomplete';
const onErrorEventName = 'lazyloaderror';
const onComplete = CreateEvent(onCompleteEventName);
const onError = CreateEvent(onErrorEventName);

function loadImage(src, image) {

	return new Promise(function(resolve, reject) {

		function onLoad() {
			removeListeners();
			resolve(true);
		}

		function onError() {
			removeListeners();
			reject(false);
		}

		function removeListeners() {
			image.removeEventListener('load', onLoad);
			image.removeEventListener('error', onError);
		}

		image.addEventListener('load', onLoad);
		image.addEventListener('error', onError);

    // if picture element set srcset on each child
    if(image.parentNode instanceof HTMLPictureElement) {
      Array.from(image.parentNode.children).forEach(function(child, i) {
        child.setAttribute('srcset', src[i]);
      });
    }
    else {
      image.setAttribute('src', src);
    }

	});

}

function lazyLoadImage() {

  const { image, src } = this;

  let lazyImage = new Image();

  // find the img element within the picture element
  if(image instanceof HTMLPictureElement) {
    lazyImage = image.querySelector('img');
  }

	const onImageLoad = getOnLoadCallback(image);

	loadImage(src, lazyImage)
		.then(function() {
			onImageLoad(image, src);
			image.dispatchEvent(onComplete);
		})
		.catch(function() {
			image.dispatchEvent(onError);
		});

}

function getOnLoadCallback(image) {
	switch (true) {
		case image.constructor === HTMLImageElement:
      return onShowImage;
    case image.constructor !== HTMLPictureElement:
			return onShowBackgroundImage;
		default:
			return () => {};
	}
}

function onShowImage(image, src) {
	image.setAttribute('src', src);
}

function onShowBackgroundImage(div, src) {
	div.style.backgroundImage = `url(${src})`;
}

module.exports = {
	lazyLoadImage,
	loadImage,
	getOnLoadCallback,
	onShowImage,
	onShowBackgroundImage
};
