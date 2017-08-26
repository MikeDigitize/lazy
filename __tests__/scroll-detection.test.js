const imageLoader = require('../js/scroll-detection');
const helpers = require('../js/test-helpers');

const {
	getLazyImagesPositions,
	getUnloadedImages,
	loadImagesInView,
	getImagePositions	
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

describe('Get lazy image positions wrapper tests', function() {

	console.log('getLazyImagesPositions wraps around the getLazyImages method');
	console.log('and retrieves the boundingClientRect postional data of each holder');

	afterEach(cleanUpDom);

	test('getLazyImagesPositions retrieves an empty array if it can\'t match a selector in DOM', function() {

		const fakeHolderSelector = 'no-matches';
		
		createDom(imagePath);		
		const lazyImages = getLazyImagesPositions(`.${fakeHolderSelector}`);

		expect(lazyImages).toHaveLength(0);

	});


	test('getLazyImagesPositions retrieves an array of items matching a selector in DOM', function() {
		
		createDom(imagePath);
		createDom(imagePath2);
		createDom(imagePath3);
		createDom(imagePath4);
		
		const lazyImages = getLazyImagesPositions(`.${holderSelector}`);

		expect(lazyImages).toHaveLength(4);

	});

	test('getLazyImagesPositions retrieves an array of items matching a selector in DOM', function() {
		
		createDom(imagePath);
		createDom(imagePath2);
		createDom(imagePath3);
		createDom(imagePath4);
		
		const lazyImages = getLazyImagesPositions(`.${holderSelector}`);

		expect(lazyImages).toHaveLength(4);

	});

	test('getLazyImagesPositions returns an object with a property describing the positional state of the lazy load item', function() {
		
		const { image, holder } = createDom(imagePath);
		const lazyImages = getLazyImagesPositions(`.${holderSelector}`);
		const [lazyImage] = lazyImages;

		expect(Object.keys(lazyImage)).toHaveLength(5);
		expect(lazyImage).toHaveProperty('holder', holder);
		expect(lazyImage).toHaveProperty('image', image);
		expect(lazyImage).toHaveProperty('src', imagePath);
		expect(lazyImage).toHaveProperty('loaded', false);
		expect(lazyImage).toHaveProperty('holderPosition');

		expect(Object.keys(lazyImage.holderPosition)).toHaveLength(6);
		expect(lazyImage.holderPosition).toHaveProperty('top');
		expect(lazyImage.holderPosition).toHaveProperty('bottom');
		expect(lazyImage.holderPosition).toHaveProperty('left');
		expect(lazyImage.holderPosition).toHaveProperty('right');
		expect(lazyImage.holderPosition).toHaveProperty('width');
		expect(lazyImage.holderPosition).toHaveProperty('height');
		
	});

});