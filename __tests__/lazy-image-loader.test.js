const { 
	loadImage, 
	getOnLoadCallback,
	onShowImage,
	loadPictureElement,
	onShowBackgroundImage 
} = require('../js/lazy-image-loader');

const { 
	imagePath,
	gifPath,
	fakeImagePath
} = require('../js/test-helpers');

describe('loadImage tests', function() {
	
		it('Should respond appropriately when passed a correct file path', function(done) {
			loadImage(imagePath).then(result => expect(result.resolved).toEqual(true));
			done();
		});

		it('Should respond appropriately when passed an incorrect file path', function(done) {
			loadImage(fakeImagePath).then(result => expect(result.resolved).toEqual(false));
			done();
		});

		it('Should respond appropriately when passed a correct GIF file path', function(done) {
			loadImage(gifPath).then(result => expect(result.resolved).toEqual(true));
			done();
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