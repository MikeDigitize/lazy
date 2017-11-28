const { LazyLoad } = require('../js/lazy');

const {
	createLazyImage,
	createLazyBackground,
	cleanUpDom,
	lazyClassNames,
	lazyImagePaths
} = require('./test-helpers');

describe('LazyLoad class tests', function() {

	afterEach(cleanUpDom);

	it('should find all images from a valid selector', function() {

		const {
			imagePath,
			imagePath2,
			imagePath3,
			imagePath4
		} = lazyImagePaths;

		createLazyImage(imagePath);
		createLazyImage(imagePath2);
		createLazyImage(imagePath3);
		createLazyImage(imagePath4);

		const { lazyImageClass } = lazyClassNames;
		const lazyImages = new LazyLoad(`.${lazyImageClass}`);

		expect(lazyImages.images.length).toBe(4);
	});

	it('should find no images from an invalid selector', function() {
		const {
			imagePath,
			imagePath2,
			imagePath3,
			imagePath4
		} = lazyImagePaths;

		createLazyImage(imagePath);
		createLazyImage(imagePath2);
		createLazyImage(imagePath3);
		createLazyImage(imagePath4);

		const { fakelazyImageClass } = lazyClassNames;
		const lazyImages = new LazyLoad(`.${fakelazyImageClass}`);

		expect(Object.keys(lazyImages).length).toBe(0);
	});

	it('lazy images should be stored as an object containing properties describing their state', function() {
		const { imagePath } = lazyImagePaths;
		const { image } = createLazyImage(imagePath);
		const { lazyImageClass } = lazyClassNames;
		const lazyImages = new LazyLoad(`.${lazyImageClass}`);
		const [lazyImage] = lazyImages.images;

		expect(Object.keys(lazyImage).length).toBe(3);
		expect(lazyImage.image).toBe(image);
		expect(lazyImage.src).toBe(imagePath);
		expect(lazyImage.resolved).toBe(false);

	});

	it('should fire a lazyload event when LazyLoad attempts to load an image', function(done) {
		const { imagePath } = lazyImagePaths;
		const { holder } = createLazyImage(imagePath);
		const { lazyImageClass } = lazyClassNames;
		const lazyImages = new LazyLoad(`.${lazyImageClass}`);
		const [lazyImage] = lazyImages.images;

		holder.addEventListener('lazyload', function onLazyLoad(evt) {
			expect(evt.target).toBe(lazyImage.image);
			holder.removeEventListener('lazyload', onLazyLoad);
			done();
		});

		lazyImages.fireLazyLoadEvent(lazyImage.image);

	});

	it('should set the src tag of an image element and fire a lazyloadcomplete event', function(done) {

		const { imagePath } = lazyImagePaths;
		const { image, holder } = createLazyImage(imagePath);
		const { lazyImageClass } = lazyClassNames;
		const lazyImages = new LazyLoad(`.${lazyImageClass}`);
		const [lazyImage] = lazyImages.images;

		expect(lazyImage.image).toBe(image);
		expect(lazyImage.image.getAttribute('src')).toBe(null);

		lazyImages.fireLazyLoadEvent(lazyImage.image);

		holder.addEventListener('lazyloadcomplete', function onLazyLoadComplete(evt) {
			expect(evt.target).toBe(lazyImage.image);
			const src = lazyImage.image.getAttribute('src');
			expect(src).toBeDefined();
			expect(src).toContain(imagePath);
			holder.removeEventListener('lazyloadcomplete', onLazyLoadComplete);
			done();
		});

	});

	it('should set the background-image property of a non-image element and fire a lazyloadcomplete event', function(done) {

		const { imagePath } = lazyImagePaths;
		const { holder, divWithBackground } = createLazyBackground(imagePath);
		const { lazyImageClass } = lazyClassNames;
		const lazyImages = new LazyLoad(`.${lazyImageClass}`);
		const [lazyImage] = lazyImages.images;

		expect(lazyImage.image).toBe(divWithBackground);
		expect(lazyImage.image.style.backgroundImage).toBe('');

		lazyImages.fireLazyLoadEvent(lazyImage.image);

		holder.addEventListener('lazyloadcomplete', function onLazyLoadComplete(evt) {
			expect(evt.target).toBe(lazyImage.image);
			const { backgroundImage } = lazyImage.image.style;
			expect(backgroundImage).toBeDefined();
			expect(backgroundImage).toContain(imagePath);
			holder.parentNode.removeEventListener('lazyloadcomplete', onLazyLoadComplete);
			done();
		});

	});

	it('should fire a lazyloaderror event when an unresolvable image path is set', function(done) {

		const { fakeImagePath } = lazyImagePaths;
		const { image, holder } = createLazyImage(fakeImagePath);
		const { lazyImageClass } = lazyClassNames;
		const lazyImages = new LazyLoad(`.${lazyImageClass}`);
		const [lazyImage] = lazyImages.images;

		holder.addEventListener('lazyloaderror', function onLazyLoadError(evt) {
			expect(evt.target).toBe(lazyImage.image);
			holder.removeEventListener('lazyloaderror', onLazyLoadError);
			done();
		});

		lazyImages.fireLazyLoadEvent(lazyImage.image);

	});

});
