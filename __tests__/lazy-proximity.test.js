const { LazyProximity } = require('../js/lazy-proximity');

const {
	createLazyImage,
	createLazyTrigger,
	createLazyBackground,
	cleanUpDom,
	lazyClassNames,
	lazyImagePaths
} = require('./test-helpers');

describe('LazyProximity class tests', function() {
	afterEach(cleanUpDom);

	it('should add the proximity trigger of each image to existing lazy image data', function() {
		const { lazyImageClass, lazyTriggerClass } = lazyClassNames;

		const { imagePath, imagePath2, imagePath3, imagePath4 } = lazyImagePaths;

		const image = createLazyImage(imagePath).image;
		const image2 = createLazyImage(imagePath2).image;
		const image3 = createLazyImage(imagePath3).image;
		const image4 = createLazyImage(imagePath4).image;
		const trigger = createLazyTrigger(lazyTriggerClass);
		const lazyImages = new LazyProximity(
			`.${lazyImageClass}`,
			`.${lazyTriggerClass}`
		);
		const [lazyImage, lazyImage2, lazyImage3, lazyImage4] = lazyImages.images;

		expect(lazyImage.image).toBe(image);
		expect(lazyImage.lazyProximityTrigger).toBe(trigger);
		expect(lazyImage.src).toBe(imagePath);
		expect(lazyImage.resolved).toBe(false);
		expect(lazyImage.onClickCallback).toBeDefined();

		expect(lazyImage2.image).toBe(image2);
		expect(lazyImage2.lazyProximityTrigger).toBe(trigger);
		expect(lazyImage2.src).toBe(imagePath2);
		expect(lazyImage2.resolved).toBe(false);
		expect(lazyImage2.onClickCallback).toBeDefined();

		expect(lazyImage3.image).toBe(image3);
		expect(lazyImage3.lazyProximityTrigger).toBe(trigger);
		expect(lazyImage3.src).toBe(imagePath3);
		expect(lazyImage3.resolved).toBe(false);
		expect(lazyImage3.onClickCallback).toBeDefined();

		expect(lazyImage4.image).toBe(image4);
		expect(lazyImage4.lazyProximityTrigger).toBe(trigger);
		expect(lazyImage4.src).toBe(imagePath4);
		expect(lazyImage4.resolved).toBe(false);
		expect(lazyImage4.onClickCallback).toBeDefined();
	});

	it('should add proximity data from multiple proximity triggers', function() {
		const {
			lazyImageClass,
			lazyImageClass2,
			lazyImageClass3,
			lazyTriggerClass,
			lazyTriggerClass2,
			lazyTriggerClass3
		} = lazyClassNames;

		const { imagePath, imagePath2, imagePath3 } = lazyImagePaths;

		const image = createLazyImage(imagePath, lazyImageClass).image;
		const image2 = createLazyImage(imagePath2, lazyImageClass2).image;
		const image3 = createLazyImage(imagePath3, lazyImageClass3).image;

		const trigger = createLazyTrigger(lazyTriggerClass, lazyImageClass);
		const trigger2 = createLazyTrigger(lazyTriggerClass2, lazyImageClass2);
		const trigger3 = createLazyTrigger(lazyTriggerClass3, lazyImageClass3);

		const lazyImages = new LazyProximity(
			`.${lazyImageClass}, .${lazyImageClass2}, .${lazyImageClass3}`,
			`.${lazyTriggerClass}, .${lazyTriggerClass2}, .${lazyTriggerClass3}`
		);
		const [lazyImage, lazyImage2, lazyImage3] = lazyImages.images;

		expect(lazyImage.image).toBe(image);
		expect(lazyImage.lazyProximityTrigger).toBe(trigger);
		expect(lazyImage.src).toBe(imagePath);
		expect(lazyImage.resolved).toBe(false);
		expect(lazyImage.onClickCallback).toBeDefined();

		expect(lazyImage2.image).toBe(image2);
		expect(lazyImage2.lazyProximityTrigger).toBe(trigger2);
		expect(lazyImage2.src).toBe(imagePath2);
		expect(lazyImage2.resolved).toBe(false);
		expect(lazyImage2.onClickCallback).toBeDefined();

		expect(lazyImage3.image).toBe(image3);
		expect(lazyImage3.lazyProximityTrigger).toBe(trigger3);
		expect(lazyImage3.src).toBe(imagePath3);
		expect(lazyImage3.resolved).toBe(false);
		expect(lazyImage3.onClickCallback).toBeDefined();
	});

	it('should trigger the loading of an image when a proximity target is clicked', function(done) {
		const { lazyImageClass, lazyTriggerClass } = lazyClassNames;

		const { imagePath } = lazyImagePaths;
		const { image, holder } = createLazyImage(imagePath, lazyImageClass);
		const trigger = createLazyTrigger(lazyTriggerClass, lazyImageClass);
		const lazyImages = new LazyProximity(
			`.${lazyImageClass}`,
			`.${lazyTriggerClass}`
		);
		const [lazyImage] = lazyImages.images;

		holder.addEventListener('lazyload', function onLazyLoad(evt) {
			expect(evt.target).toBe(lazyImage.image);
			holder.removeEventListener('lazyload', onLazyLoad);
			done();
		});

		lazyImage.lazyProximityTrigger.click();
	});

	it('should set an image src when a proximity target is clicked', function(done) {
		const { lazyImageClass, lazyTriggerClass } = lazyClassNames;

		const { imagePath } = lazyImagePaths;
		const { image, holder } = createLazyImage(imagePath, lazyImageClass);
		const trigger = createLazyTrigger(lazyTriggerClass, lazyImageClass);
		const lazyImages = new LazyProximity(
			`.${lazyImageClass}`,
			`.${lazyTriggerClass}`
		);
		const [lazyImage] = lazyImages.images;

		holder.addEventListener('lazyloadcomplete', function onLazyLoadComplete(
			evt
		) {
			expect(evt.target).toBe(lazyImage.image);
			const src = lazyImage.image.getAttribute('src');
			expect(src).toBeDefined();
			expect(src).toContain(imagePath);
			holder.removeEventListener('lazyloadcomplete', onLazyLoadComplete);
			done();
		});

		lazyImage.lazyProximityTrigger.click();
	});

	it('should set a background-image property when a proximity target is clicked', function(done) {
		const { lazyImageClass, lazyTriggerClass } = lazyClassNames;

		const { imagePath } = lazyImagePaths;
		const { holder } = createLazyBackground(imagePath);
		const trigger = createLazyTrigger(lazyTriggerClass, lazyImageClass);
		const lazyImages = new LazyProximity(
			`.${lazyImageClass}`,
			`.${lazyTriggerClass}`
		);
		const [lazyImage] = lazyImages.images;

		holder.parentNode.addEventListener(
			'lazyloadcomplete',
			function onLazyLoadComplete(evt) {
				expect(evt.target).toBe(lazyImage.image);
				const { backgroundImage } = lazyImage.image.style;
				expect(backgroundImage).toBeDefined();
				expect(backgroundImage).toContain(imagePath);
				holder.parentNode.removeEventListener(
					'lazyloadcomplete',
					onLazyLoadComplete
				);
				done();
			}
		);

		lazyImage.lazyProximityTrigger.click();
	});
});
