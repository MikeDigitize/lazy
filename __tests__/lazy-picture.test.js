const { LazyScroll } = require('../js/lazy-scroll');

const {
	createLazyPicture,
	cleanUpDom,
	lazyClassNames,
	lazyImagePaths
} = require('./test-helpers');

describe('Picture element tests', function() {
	let imagePaths;
	let images;
	let lazyImageClass;
	let lazyInstance;

	// Reinitialize global variables with test data
	beforeEach(function() {
		imagePaths = Object.keys(lazyImagePaths).map(path => lazyImagePaths[path]);
		lazyImageClass = lazyClassNames.lazyImageClass;

		images = [
			createLazyPicture(
				[{ minWidth: 250, path: [imagePaths[0]] }],
				lazyImageClass
			),
			createLazyPicture(
				[{ minWidth: 250, path: [imagePaths[1]] }],
				lazyImageClass
			),
			createLazyPicture(
				[{ minWidth: 250, path: [imagePaths[2]] }],
				lazyImageClass
			),
			createLazyPicture(
				[{ minWidth: 250, path: [imagePaths[3]] }],
				lazyImageClass
			),
			createLazyPicture(
				[{ minWidth: 250, path: [imagePaths[4]] }],
				lazyImageClass
			)
		];

		// Create lazy instance
		lazyInstance = new LazyScroll(`.${lazyImageClass}`);
	});

	afterEach(cleanUpDom);

	it('should load all picture elements', () => {
		expect(lazyInstance.images.length).toBe(images.length);
	});

	it('should configure lazy instances correctly', () => {
		lazyInstance.images.forEach((lazyPicture, index) => {
			expect(lazyPicture.image.getAttribute('class')).toBe(lazyImageClass);
			expect(lazyPicture.imagePosition).toBeDefined();
			expect(lazyPicture.resolved).toBe(false);
			expect(
				lazyPicture.image.querySelector('source').getAttribute('data-lazy-src')
			).toBe(imagePaths[index]);
		});
	});
});
