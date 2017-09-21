const { CreateEvent } = require('./lazy-events');
const onCompleteEventName = 'lazyloadcomplete';
const onErrorEventName = 'lazyloaderror';
const onComplete = CreateEvent(onCompleteEventName);
const onError = CreateEvent(onErrorEventName);

function loadImage(src) {

	return new Promise(function(resolve, reject) {

		const image = new Image();

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

		image.setAttribute('src', src);

	});

}

function lazyLoadImage() {

  const { image, src } = this;

  if(image instanceof HTMLPictureElement) {
    loadPictureElement(image, src);
    return;
  }

	const onImageLoad = getOnLoadCallback(image);

	loadImage(src)
		.then(function() {
			onImageLoad(image, src);
			image.dispatchEvent(onComplete);
		})
		.catch(function() {
			image.dispatchEvent(onError);
		});

}

function loadPictureElement(picture, src) {

  const image = picture.querySelector('img');

  new Promise(function(resolve, reject) {

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

    Array.from(picture.children).forEach(function(child, i) {
      child.setAttribute('srcset', src[i]);
    });

  })
  .then(function() {
    picture.dispatchEvent(onComplete);
  })
  .catch(function() {
    picture.dispatchEvent(onError);
  });

}

function getOnLoadCallback(image) {
	switch (true) {
		case image.constructor === HTMLImageElement:
			return onShowImage;
		default:
			return onShowBackgroundImage;
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
