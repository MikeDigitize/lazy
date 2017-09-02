# Lazy Loader Plugin

A base image loading, event driven class that is easily extendable to support any loading criteria.

## How it works

The `LazyLoad` base class takes a CSS selector to identify all images to be lazy loaded. These images need a `data-src` attribute which is the path to the image. The `src` attribute can be omitted or left empty.

```html
<img data-src="images/my-lazy-loading-image.png">
```

Upon initialisation the `LazyLoad` class creates an array of image data, including each image element, its src and a loaded attribute that's used to identify if the image has been loaded.

```javascript
// lazy image data is stored in an array as below
{
  image: <Image Elememt>
  src: <String>
  loaded: <Boolean>
}
```

An event listener is added to each image, listening for the custom event `lazyload`.

```javascript
// an instance of LazyLoad looks like this
{
  images: <Array>
}
```

An instance of `LazyLoad` inherits a single method `fireEvent`, which takes an image element as an argument and fires the `lazyload` event on the image, which triggers the loading of the image and, once loaded, sets the src attribute of the image, so it appears in the document.

## Lazy Scroll

The `LazyScroll` class is a wrapper around `LazyLoad`, using positional data to determine if an image is in the viewport and, if it is, it fires the `lazyload` event on the image.

The `LazyScroll` class appends the positional data of each image to the image data stored as part of the base class.

```javascript
// lazy scroll images are stored as below with the additional imagePosition property
{
  img: <Image Elememt>
  src: <String>
  loaded: <Boolean>
  imagePosition: <Object>
}
```

## Usage

To use the `LazyScroll` class simply call the class with a CSS selector and the plugin will do the rest, loading images as they appear in the viewport.

```javascript
const lazy = new LazyScroll('.lazy-image');
```

To extend the base class and add custom loading criteria use the following pattern:

```javascript
class CustomLazy extends LazyLoad {
  constructor(selector) {
    super(selector);
    // modify the images property to add custom data 
    this.images = this.images.map(function(lazyImage) {
      // return the lazyImage object with additional data
    });
  }
}

// use some other user action to trigger an image load
// loop through the array of images, if one meets the criteria to load
// call the fireEvent method passing in the image to load

const lazy = new CustomLazy('.lazy-image');
lazy.images.filter(function(lazyImage) {
  // get the images yet to be loaded
  return !lazyImage.loaded;
}).forEach(function(lazyImage) {
  // test to see if the image meets the loading criteria, if it does fire the event
  lazy.fireEvent(lazyImage.image);
  // and update the image data to show the image has loaded
  lazyImage.loaded = true;
});
```

### TODO:
* A proximity based loader class
* End to end testing
* Support background images and picture element
