const { LazyLoad } = require('../js/lazy');

const {
	createLazyImage,
	createLazyBackground,
	cleanUpDom,
	lazyClassNames,
	lazyImagePaths
} = require('./test-helpers');

// TODO: test for picture element
describe('Picture element tests', function() {

	afterEach(cleanUpDom);

  it('Should work', function() {
    expect(true).toBe(true);
  });

});
