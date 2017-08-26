const imageLoader = require('../js/image-loader');
const helpers = require('../js/test-helpers');

const {
	showImage,
	loadImage,
	getLazyImages
} = imageLoader;

const {
	holderSelector,
	imagePath,
	imagePath2,
	imagePath3,
	imagePath4,
	createDom,
	cleanUpDom
} = helpers;

describe('Get lazy images from DOM test', function() {

	console.log('getLazyImages expects a selector for an image container with an image inside');
	console.log('the image should have an empty src attribute and a data-src attribute with the image path');

	afterEach(cleanUpDom);

	test('getLazyImages retrieves an array of a single item matching a selector in DOM', function() {
		
		createDom(imagePath);
		const lazyImages = getLazyImages(`.${holderSelector}`);

		expect(lazyImages).toHaveLength(1);

	});

	test('getLazyImages retrieves an array of all items matching a selector in DOM', function() {
		
		createDom(imagePath2);
		createDom(imagePath3);
		createDom(imagePath4);
		const lazyImages = getLazyImages(`.${holderSelector}`);

		expect(lazyImages).toHaveLength(3);

	});

	test('getLazyImages returns an object containing properties describing the state of the lazy load item', function() {
		
		const { image, holder } = createDom(imagePath);
		const lazyImages = getLazyImages(`.${holderSelector}`);
		const [lazyImage] = lazyImages;

		expect(Object.keys(lazyImage)).toHaveLength(4);
		expect(lazyImage).toHaveProperty('holder', holder);
		expect(lazyImage).toHaveProperty('image', image);
		expect(lazyImage).toHaveProperty('src', imagePath);
		expect(lazyImage).toHaveProperty('loaded', false);

		expect(lazyImage.holder).toBeInstanceOf(HTMLElement);
		expect(lazyImage.image).toBeInstanceOf(HTMLElement);
		expect(typeof lazyImage.src).toBe('string');
		expect(typeof lazyImage.loaded).toBe('boolean');

	});

});