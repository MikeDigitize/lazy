# Lazy

An image loading, event driven class supporting lazy load aka deferral of image loading. 

## Browser support

IE9+ although you'll need to polyfill `Array.from` and `Array.prototype.some`.

## How it works

The `LazyLoad` base class takes a CSS selector of images to be lazy resolved. 

```javascript
const lazy = new LazyLoad('.lazy-image');
```

Lazy images require a `data-lazy-src` attribute specifying the image path to load. The image's `src` attribute can be omitted or left empty. Note that omitting the `src` is technically invalid HTML, but some older browsers make a HTTP request if the `src` is set to an empty string so omitting is probably the safest approach.

```html
<img data-lazy-src="images/my-lazy-loading-image.png">
```

Upon initialisation, the `LazyLoad` class creates an array of image data, storing each image element, its `src` and a resolved attribute initially set to `false`.

```javascript
// each lazy image stored in the images array is represented with the following data structure
{
  image: <Image Elememt>
  src: <String>
  resolved: <Boolean>
}
```

An event listener listening for a `lazyload` event is bound to each lazy image. When fired the event triggers the loading of the image into cache and, once resolved, sets the src attribute of the image so it appears in the document.

An instance of `LazyLoad` inherits a single method `fireLazyEvent`. When passed an image element it fires the `lazyload` event on the image.

```javascript
// an instance of LazyLoad looks like this
{
  images: <Array> // array of objects representing each lazy load image (see above for data structure)
  fireLazyEvent: <Function> // inherited
}
```

Upon a successful load, a `lazyloadcomplete` event is fired on the image which can be captured on the window. As older browers can display images without `src` attributes as broken images, this is a good opportunity to add styling to hide them initially and reveal upon loading. If an image can't be loaded a `lazyloaderror` event is fired on the image which too can be captured.

```javascript
window.addEventListener('lazyloadcomplete', function(evt) {
  // do something with the evt target
});
```

## Lazy Scroll

The `LazyScroll` class is a wrapper around `LazyLoad`, using positional data to determine if an image is in the viewport. If it is its `lazyload` event is fired.

The `LazyScroll` class appends the positional data of each image to the image data stored on the instance.

```javascript
// lazy scroll images get an additional imagePosition property
{
  img: <Image Elememt>
  src: <String>
  resolved: <Boolean>
  imagePosition: <Object>
}
```

## Lazy Proximity

The `LazyProximity` class is a wrapper around `LazyLoad`. `LazyProximity` allows you to define elements on the page that will trigger the loading of any amount of lazy images when hovered over or when receiving a click / touch event, for mobile. 

The lazy images a trigger element will load are defined with a CSS selector in its `data-lazy-target` attribute.

```html
<!-- loads all images that match the selector ".lazy-holder img" -->
<button type="button" class="lazy-btn" data-lazy-target=".lazy-holder img">Click me!</button>
```

The `LazyProximity` class appends the trigger element and its `onclick` callback function to each lazy image stored on the instance.

```javascript
// lazy proximity images get additional lazyProximityTrigger and onClickCallback properties
{
  img: <Image Elememt>
  src: <String>
  resolved: <Boolean>
  lazyProximityTrigger: <Element>
  onClickCallback: <Function>
}
```

## Usage

#### LazyLoad

To use the `LazyLoad` class, call the class with a CSS selector for the lazy images.

```javascript
const lazy = new LazyScroll('.lazy-image');
```
To trigger the loading of an image, use the `fireLazyEvent` method on the instance, passing in the lazy image element to load.

```javascript
// access an image from the instance's images array
const [lazyImage] = lazy.images;
// call the fireLazyEvent method on the instance passing in the lazy image element
lazy.fireLazyEvent(lazyImage.image);
```

#### LazyScroll

To use the `LazyScroll` class, call the class with a CSS selector for the lazy images and the plugin will load images as they appear in the viewport.

```javascript
const lazy = new LazyScroll('.lazy-image');
```

#### LazyProximity

To use the `LazyProximity` class, call the class with two arguments - a CSS selector for the lazy images, and a CSS selector for the trigger elements. When these elements are hovered over by the mouse, or receive a click / touch it will trigger the loading of images matching the selector in their `data-lazy-target` attribute.

```javascript
const lazy = new LazyProximity('.lazy-image', '.lazy-btn');
```

#### Extending

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

// use some other criteria to trigger an image load
// internally in the class, loop through the array of images, if one meets the criteria to load
// call the fireLazyEvent method passing in the image to load

const lazy = new CustomLazy('.lazy-image');
lazy.images.filter(function(lazyImage) {
  // get the images yet to be resolved
  return !lazyImage.resolved;
}).forEach(function(lazyImage) {
  // test to see if the image meets the loading criteria, if it does fire the event
  lazy.fireLazyEvent(lazyImage.image);
  // and update the image data to show the image has resolved
  lazyImage.resolved = true;
});
```

### TODO:
* Write tests for background image support
* Add support for Picture element
* Better handling of when images fail to load
* Handling when functions are supplied with wrong argument types or null / empty results
* Option to show a loading spinner whilst images load
