function lazyLoadImage(src) {

	return new Promise(function (resolve) {

		const lazyImage = new Image();
		const result = { loaded: true };

		function onLoad() {
			removeListeners();
			resolve(result);
		}

		function onError() {
			removeListeners();
			result.loaded = false;
			resolve(result);
		}

		function removeListeners() {
			lazyImage.removeEventListener('load', onLoad);
			lazyImage.removeEventListener('error', onError);
		}

		lazyImage.addEventListener('load', onLoad);
		lazyImage.addEventListener('error', onError);

		lazyImage.src = src;

	});

}

module.exports = {
	lazyLoadImage
};