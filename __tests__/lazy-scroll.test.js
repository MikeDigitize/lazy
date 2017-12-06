const {
	LazyScroll,
	isInViewVertically,
	isInViewHorizontally
} = require('../js/lazy-scroll');

const {
	createLazyImage,
	createLazyPicture,
	createLazyBackground,
	cleanUpDom,
	lazyClassNames,
	lazyImagePaths
} = require('./test-helpers');

describe('LazyScroll class tests', function() {

	afterEach(cleanUpDom);

	it('should add positional data to existing lazy image data', function() {
		const imagePaths = Object.keys(lazyImagePaths).map(path => lazyImagePaths[path]);
		const { lazyImageClass } = lazyClassNames;

		const images = [
			createLazyImage(imagePaths[0], lazyImageClass),
			createLazyImage(imagePaths[1], lazyImageClass),
			createLazyImage(imagePaths[2], lazyImageClass),
			createLazyImage(imagePaths[3], lazyImageClass)
		];

		// Create lazy instance
		const lazyImages = new LazyScroll(`.${lazyImageClass}`);

		// Should return a list of all images created in the images array
		expect(lazyImages.images.length).toBe(images.length);

		lazyImages.images.forEach((lazyImage, index) => {
			expect(lazyImage.image.getAttribute('class')).toBe(lazyImageClass);
			expect(lazyImage.imagePosition).toBeDefined();
			expect(lazyImage.src).toBe(imagePaths[index]);
			expect(lazyImage.resolved).toBe(false);
			expect(lazyImage.image).toBe(images[index].image);
		});
	});

	it('should detect when an image\'s top and bottom positions are in the viewport', function() {
		const imageTopPosition = 100;
		const windowTopPosition = 50;
		const imageBottomPosition = 200;
		const windowBottomPosition = 550;

		expect(isInViewVertically(imageTopPosition, windowTopPosition, imageBottomPosition, windowBottomPosition)).toBe(true);
	});

	it('should detect when an image\'s top position is in the viewport but not the bottom', function() {
		const imageTopPosition = 100;
		const windowTopPosition = 50;
		const imageBottomPosition = 600;
		const windowBottomPosition = 550;

		expect(isInViewVertically(imageTopPosition, windowTopPosition, imageBottomPosition, windowBottomPosition)).toBe(true);
	});

	it('should detect when an image\'s bottom position is in the viewport but not the top', function() {
		const imageTopPosition = 0;
		const windowTopPosition = 50;
		const imageBottomPosition = 500;
		const windowBottomPosition = 550;

		expect(isInViewVertically(imageTopPosition, windowTopPosition, imageBottomPosition, windowBottomPosition)).toBe(true);
	});

	it('should detect when an image\'s top and bottom position are not in the viewport but the image is', function() {
		const imageTopPosition = 0;
		const windowTopPosition = 50;
		const imageBottomPosition = 600;
		const windowBottomPosition = 550;

		expect(isInViewVertically(imageTopPosition, windowTopPosition, imageBottomPosition, windowBottomPosition)).toBe(true);
	});

	it('should detect when an image\'s top and bottom position are the same as the window\'s', function() {
		const imageTopPosition = 50;
		const windowTopPosition = 50;
		const imageBottomPosition = 600;
		const windowBottomPosition = 600;

		expect(isInViewVertically(imageTopPosition, windowTopPosition, imageBottomPosition, windowBottomPosition)).toBe(true);
	});

	it('should detect when an image is above the viewport', function() {
		const imageTopPosition = 50;
		const windowTopPosition = 201;
		const imageBottomPosition = 200;
		const windowBottomPosition = 300;

		expect(isInViewVertically(imageTopPosition, windowTopPosition, imageBottomPosition, windowBottomPosition)).toBe(false);
	});

	it('should detect when an image is below the viewport', function() {
		const imageTopPosition = 500;
		const windowTopPosition = 100;
		const imageBottomPosition = 600;
		const windowBottomPosition = 300;

		expect(isInViewVertically(imageTopPosition, windowTopPosition, imageBottomPosition, windowBottomPosition)).toBe(false);
	});

	it('should detect when an image\'s left and right positions are in the viewport', function() {
		const imageLeftPosition = 100;
		const windowLeftPosition = 50;
		const imageRightPosition = 200;
		const windowRightPosition = 550;

		expect(isInViewHorizontally(imageLeftPosition, windowLeftPosition, imageRightPosition, windowRightPosition)).toBe(true);
	});

	it('should detect when an image\'s left position is in the viewport but not the right', function() {
		const imageLeftPosition = 100;
		const windowLeftPosition = 50;
		const imageRightPosition = 600;
		const windowRightPosition = 550;

		expect(isInViewHorizontally(imageLeftPosition, windowLeftPosition, imageRightPosition, windowRightPosition)).toBe(true);
	});

	it('should detect when an image\'s right position is in the viewport but not the left', function() {
		const imageLeftPosition = 0;
		const windowLeftPosition = 50;
		const imageRightPosition = 500;
		const windowRightPosition = 550;

		expect(isInViewHorizontally(imageLeftPosition, windowLeftPosition, imageRightPosition, windowRightPosition)).toBe(true);
	});

	it('should detect when an image\'s left and right position are not in the viewport but the image is', function() {
		const imageLeftPosition = 0;
		const windowLeftPosition = 50;
		const imageRightPosition = 600;
		const windowRightPosition = 550;

		expect(isInViewHorizontally(imageLeftPosition, windowLeftPosition, imageRightPosition, windowRightPosition)).toBe(true);
	});

	it('should detect when an image\'s left and right position are the same as the window\'s', function() {
		const imageLeftPosition = 50;
		const windowLeftPosition = 50;
		const imageRightPosition = 600;
		const windowRightPosition = 600;

		expect(isInViewHorizontally(imageLeftPosition, windowLeftPosition, imageRightPosition, windowRightPosition)).toBe(true);

	});

	it('should detect when an image is to the left of the viewport', function() {
		const imageLeftPosition = 50;
		const windowLeftPosition = 201;
		const imageRightPosition = 200;
		const windowRightPosition = 300;

		expect(isInViewHorizontally(imageLeftPosition, windowLeftPosition, imageRightPosition, windowRightPosition)).toBe(false);
	});

	it('should detect when an image is to the right of the viewport', function() {
		const imageLeftPosition = 500;
		const windowLeftPosition = 100;
		const imageRightPosition = 600;
		const windowRightPosition = 300;

		expect(isInViewHorizontally(imageLeftPosition, windowLeftPosition, imageRightPosition, windowRightPosition)).toBe(false);
	});

	it('should trigger the load of an image when its in the viewport', function(done) {
		const { imagePath } = lazyImagePaths;
		const { lazyImageClass } = lazyClassNames;
		const { holder } = createLazyImage(imagePath, lazyImageClass);
		holder.style.top = '2000px';

		const lazyImages = new LazyScroll(`.${lazyImageClass}`);
		const [lazyImage] = lazyImages.images;

		holder.addEventListener('lazyloadcomplete', function onLazyLoadComplete(evt) {
			expect(evt.target).toBe(lazyImage.image);
			const src = lazyImage.image.getAttribute('src');
			expect(src).toBeDefined();
			expect(src).toContain(imagePath);
			holder.removeEventListener('lazyloadcomplete', onLazyLoadComplete);
			done();
		});

		window.scrollTo(0, lazyImage.imagePosition.top);
	});

	// TODO - Write this test to use picture element


	it('should trigger the load of a background image when its in the viewport', function(done) {
		const { imagePath } = lazyImagePaths;
		const { lazyImageClass } = lazyClassNames;
		const { holder } = createLazyBackground(imagePath);
		const lazyImages = new LazyScroll(`.${lazyImageClass}`);
		const [lazyImage] = lazyImages.images;

		holder.addEventListener('lazyloadcomplete', function onLazyLoadComplete(evt) {
			expect(evt.target).toBe(lazyImage.image);
			const { backgroundImage } = lazyImage.image.style;
			expect(backgroundImage).toBeDefined();
			expect(backgroundImage).toContain(imagePath);
			holder.removeEventListener('lazyloadcomplete', onLazyLoadComplete);
			done();
		});

		window.scrollTo(0, lazyImage.imagePosition.top);
	});
});
