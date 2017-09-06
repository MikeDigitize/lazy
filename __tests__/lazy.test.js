const { LazyLoad } = require('../js/lazy');

const { 
  lazyImageClass,
	imagePath,
	imagePath2,
	imagePath3,
	imagePath4,
  fakelazyImageClass,
	createLazyImage,
	cleanUpDom
} = require('../js/test-helpers');

describe('LazyLoad class tests', function() {

  afterEach(cleanUpDom);
  
  it('should find all images from a valid selector', function() {
    
    createLazyImage(imagePath);
    createLazyImage(imagePath2);
    createLazyImage(imagePath3);
    createLazyImage(imagePath4);
    
    const lazyImages = new LazyLoad(`.${lazyImageClass}`);

    expect(lazyImages.images.length).toBe(4);

  });

  it('should find no images from an invalid selector', function() {
    
    createLazyImage(imagePath);
    createLazyImage(imagePath2);
    createLazyImage(imagePath3);
    createLazyImage(imagePath4);
    
    const lazyImages = new LazyLoad(`.${fakelazyImageClass}`);

    expect(lazyImages.images.length).toBe(0);

  });

  it('lazy images should be stored as an object containing properties describing their state', function() {
    
    const image = createLazyImage(imagePath);
		const lazyImages = new LazyLoad(`.${lazyImageClass}`);
		const [lazyImage] = lazyImages.images;

		expect(Object.keys(lazyImage).length).toBe(3);
		expect(lazyImage.image).toBe(image);
		expect(lazyImage.src).toBe(imagePath);
    expect(lazyImage.resolved).toBe(false);
    
  });

});