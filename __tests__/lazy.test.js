const { LazyLoad } = require('../js/lazy');

const { 
  lazyImageClass,
	imagePath,
	imagePath2,
	imagePath3,
	imagePath4,
  fakelazyImageClass,
	createDom,
	cleanUpDom
} = require('../js/test-helpers');

describe('LazyLoad class tests', function() {

  afterEach(cleanUpDom);
  
  it('should find all images from a valid selector', function() {
    
    createDom(imagePath);
    createDom(imagePath2);
    createDom(imagePath3);
    createDom(imagePath4);
    
    const lazyImages = new LazyLoad(`.${lazyImageClass}`);

    expect(lazyImages.images.length).toBe(4);

  });

  it('should find no images from an invalid selector', function() {
    
    createDom(imagePath);
    createDom(imagePath2);
    createDom(imagePath3);
    createDom(imagePath4);
    
    const lazyImages = new LazyLoad(`.${fakelazyImageClass}`);

    expect(lazyImages.images.length).toBe(0);

  });

  it('lazy images should be stored as an object containing properties describing their state', function() {
    
    const image = createDom(imagePath);
		const lazyImages = new LazyLoad(`.${lazyImageClass}`);
		const [lazyImage] = lazyImages.images;

		expect(Object.keys(lazyImage).length).toBe(3);
		expect(lazyImage.image).toBe(image);
		expect(lazyImage.src).toBe(imagePath);
    expect(lazyImage.loaded).toBe(false);
    
  });

});