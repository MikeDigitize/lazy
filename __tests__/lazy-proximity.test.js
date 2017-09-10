const { LazyProximity } = require('../js/lazy-proximity');

const { 
  lazyImageClass,
  lazyImageClass2,
	lazyImageClass3,
  lazyTriggerClass,
	lazyTriggerClass2,
	lazyTriggerClass3,
	imagePath,
	imagePath2,
	imagePath3,
	imagePath4,
  createLazyImage,
  createLazyTrigger,
  createLazyBackground,
	cleanUpDom
} = require('../js/test-helpers');

describe('LazyProximity class tests', function() {

	afterEach(cleanUpDom);
	
	it('should add the proximity trigger of each image to existing lazy image data', function() {
		
		const image = createLazyImage(imagePath).image;
		const image2 = createLazyImage(imagePath2).image;
		const image3 = createLazyImage(imagePath3).image;
    const image4 = createLazyImage(imagePath4).image;    
    const trigger = createLazyTrigger(lazyTriggerClass);		

    const lazyImages = new LazyProximity(`.${lazyImageClass}`, `.${lazyTriggerClass}`);
    const [lazyImage, lazyImage2, lazyImage3, lazyImage4] = lazyImages.images;
  
    expect(Object.keys(lazyImage).length).toBe(5);
    expect(lazyImage.image).toBe(image);
    expect(lazyImage.lazyProximityTrigger).toBe(trigger);
    expect(lazyImage.src).toBe(imagePath);
    expect(lazyImage.resolved).toBe(false);	
    expect(lazyImage.onClickCallback).toBeDefined();

    expect(Object.keys(lazyImage2).length).toBe(5);
    expect(lazyImage2.image).toBe(image2);
    expect(lazyImage2.lazyProximityTrigger).toBe(trigger);
    expect(lazyImage2.src).toBe(imagePath2);
    expect(lazyImage2.resolved).toBe(false);	
    expect(lazyImage2.onClickCallback).toBeDefined();

    expect(Object.keys(lazyImage3).length).toBe(5);
    expect(lazyImage3.image).toBe(image3);
    expect(lazyImage3.lazyProximityTrigger).toBe(trigger);
    expect(lazyImage3.src).toBe(imagePath3);
    expect(lazyImage3.resolved).toBe(false);	
    expect(lazyImage3.onClickCallback).toBeDefined();

    expect(Object.keys(lazyImage4).length).toBe(5);
    expect(lazyImage4.image).toBe(image4);
    expect(lazyImage4.lazyProximityTrigger).toBe(trigger);
    expect(lazyImage4.src).toBe(imagePath4);
    expect(lazyImage4.resolved).toBe(false);	
    expect(lazyImage4.onClickCallback).toBeDefined();

  });
  
  it('should add proximity data from multiple proximity triggers', function() {
		
		const image = createLazyImage(imagePath, lazyImageClass).image;
    const image2 = createLazyImage(imagePath2, lazyImageClass2).image;
    const image3 = createLazyImage(imagePath3, lazyImageClass3).image;

    const trigger = createLazyTrigger(lazyTriggerClass, lazyImageClass);	
    const trigger2 = createLazyTrigger(lazyTriggerClass2, lazyImageClass2);	
    const trigger3 = createLazyTrigger(lazyTriggerClass3, lazyImageClass3);	

    const lazyImages = new LazyProximity(`.${lazyImageClass}, .${lazyImageClass2}, .${lazyImageClass3}`, `.${lazyTriggerClass}, .${lazyTriggerClass2}, .${lazyTriggerClass3}`);
    const [lazyImage, lazyImage2, lazyImage3] = lazyImages.images;
  
    expect(Object.keys(lazyImage).length).toBe(5);
    expect(lazyImage.image).toBe(image);
    expect(lazyImage.lazyProximityTrigger).toBe(trigger);
    expect(lazyImage.src).toBe(imagePath);
    expect(lazyImage.resolved).toBe(false);	
    expect(lazyImage.onClickCallback).toBeDefined();

    expect(Object.keys(lazyImage2).length).toBe(5);
    expect(lazyImage2.image).toBe(image2);
    expect(lazyImage2.lazyProximityTrigger).toBe(trigger2);
    expect(lazyImage2.src).toBe(imagePath2);
    expect(lazyImage2.resolved).toBe(false);	
    expect(lazyImage2.onClickCallback).toBeDefined();

    expect(Object.keys(lazyImage3).length).toBe(5);
    expect(lazyImage3.image).toBe(image3);
    expect(lazyImage3.lazyProximityTrigger).toBe(trigger3);
    expect(lazyImage3.src).toBe(imagePath3);
    expect(lazyImage3.resolved).toBe(false);	
    expect(lazyImage3.onClickCallback).toBeDefined();

  });

  it('should trigger the loading of an image when a proximity target is clicked', function(done) {

    const image = createLazyImage(imagePath, lazyImageClass).image;
    const trigger = createLazyTrigger(lazyTriggerClass, lazyImageClass);	
    const lazyImages = new LazyProximity(`.${lazyImageClass}`, `.${lazyTriggerClass}`);
    const [lazyImage] = lazyImages.images;

    window.addEventListener('lazyload', function onLazyLoad(evt) {
      expect(evt.target).toBe(lazyImage.image);
      window.removeEventListener('lazyload', onLazyLoad);
      done();
    });

    lazyImage.lazyProximityTrigger.click();

  });

  it('should set an image src when a proximity target is clicked', function(done) {
    
    const image = createLazyImage(imagePath, lazyImageClass).image;
    const trigger = createLazyTrigger(lazyTriggerClass, lazyImageClass);	
    const lazyImages = new LazyProximity(`.${lazyImageClass}`, `.${lazyTriggerClass}`);
    const [lazyImage] = lazyImages.images;

    window.addEventListener('lazyloadcomplete', function onLazyLoadComplete(evt) {
      expect(evt.target).toBe(lazyImage.image);
      const src = lazyImage.image.getAttribute('src');
      expect(src).toBeDefined();
      expect(src).toContain(imagePath);
      window.removeEventListener('lazyloadcomplete', onLazyLoadComplete);
      done();
    });

    lazyImage.lazyProximityTrigger.click();

  });

  it('should set a background-image property when a proximity target is clicked', function(done) {
    
    const image = createLazyBackground(imagePath);   
    const trigger = createLazyTrigger(lazyTriggerClass, lazyImageClass);	 
    const lazyImages = new LazyProximity(`.${lazyImageClass}`, `.${lazyTriggerClass}`);
    const [lazyImage] = lazyImages.images;

    window.addEventListener('lazyloadcomplete', function onLazyLoadComplete(evt) {
      expect(evt.target).toBe(lazyImage.image);
      const { backgroundImage } = lazyImage.image.style;
      expect(backgroundImage).toBeDefined();
      expect(backgroundImage).toContain(imagePath);
      window.removeEventListener('lazyloadcomplete', onLazyLoadComplete);
      done();
    });

    lazyImage.lazyProximityTrigger.click();

  });
	
});
