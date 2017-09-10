const { 
	loadImage, 
	getOnLoadCallback,
	onShowImage,
	loadPictureElement,
	onShowBackgroundImage 
} = require('../js/lazy-image-loader');

const { lazyImagePaths } = require('./test-helpers');

describe('loadImage tests', function() {
	
	it('Should respond appropriately when passed a correct file path', function(done) {
		
		const { imagePath } = lazyImagePaths;
		loadImage(imagePath).then(function(result) {
			expect(result).toEqual(true);
			done();
		});	

	});

	it('Should respond appropriately when passed an incorrect file path', function(done) {
		
		const { fakeImagePath } = lazyImagePaths;
		loadImage(fakeImagePath).catch(function(result) {
			expect(result).toEqual(false);
			done();
		});
		
	});

	it('Should respond appropriately when passed a correct GIF file path', function(done) {
		
		const { gifPath } = lazyImagePaths;
		loadImage(gifPath).then(function(result) {
			expect(result).toEqual(true);
			done();
		}); 

	});
	
});

describe('getOnLoadCallback tests', function() {

	const image = document.createElement('img');
	const picture = document.createElement('picture');
	const div = document.createElement('div');

	it('Should return the Image element loader when an image is received', function() {
		const result = getOnLoadCallback(image);
		expect(result).toBe(onShowImage);
	});

	it('Should return the CSS background loader when an image is not received', function() {
		const result = getOnLoadCallback(div);
		expect(result).toBe(onShowBackgroundImage);
	});

});