# Lazy

An image loading, event driven class supporting deferral of image loading to a developer specified time. 

## How it works

The `LazyLoad` base class takes a CSS selector of images to be lazy loaded. 

```javascript
const lazy = new LazyLoad('.lazy-image');
```

Lazy images require a `data-lazy-src` attribute with the image path to load. The image's `src` attribute can be omitted or left empty.

```html
<img data-lazy-src="images/my-lazy-loading-image.png">
```

Upon initialisation, the `LazyLoad` class creates an array of image data, storing each image element, its src and a loaded attribute to identify if the image has loaded.

```javascript
// each lazy image stored in the images array is represented with the following data structure
{
  image: <Image Elememt>
  src: <String>
  loaded: <Boolean>
}
```

An event listener is added to each image upon initialisation of a new `LazyLoad` instance, listening for a custom event `lazyload` which triggers the loading of the image into cache and, once loaded, sets the src attribute of the image so it appears in the document.

An instance of `LazyLoad` inherits a single method `fireLazyEvent`, which takes an image element as an argument and fires the `lazyload` event on the image.

```javascript
// an instance of LazyLoad looks like this
{
  images: <Array> // array pf objects representing each lazy load image (see above for data structure)
  fireLazyEvent: <Function> // inherited
}
```

Upon an image loading, anpther custom event - `lazyloadcomplete` is fired on the image. This event can be captured on the window to allow for any further operations on the image, for example to trigger an opacity based fade-in CSS transition.

```javascript
window.addEventListener('lazyloadcomplete', function(evt) {
  // do something with the evt target
});
```

The `LazyLoad` class has been designed to be as unopinionated as possible, making it easily extendable to support any loading criteria.

## Lazy Scroll

The `LazyScroll` class is a wrapper around `LazyLoad`, using positional data to determine if an image is in the viewport. If an image is in the viewport the `lazyload` event is fired on the image.

The `LazyScroll` class appends the positional data of each image to the image data stored on the instance.

```javascript
// lazy scroll images get an additional imagePosition property
{
  img: <Image Elememt>
  src: <String>
  loaded: <Boolean>
  imagePosition: <Object>
}
```

The `scroll` event listener which triggers the `LazyScroll` functionality has its callback throttled to conserve performance.

## Lazy Proximity

The `LazyProximity` class is a wrapper around `LazyLoad`. `LazyProximity` allows you to define trigger elements on the page that will trigger the loading of any amount of lazy images. Loading is triggered wither when the mouse is over a trigger element or when they receive a click / touch event, for mobile. The lazy images to load are defined with a CSS selector in the trigger element's `data-lazy-target` attribute.

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
  loaded: <Boolean>
  lazyProximityTrigger: <Element>
  onClickCallback: <Function>
}
```

In order to save excessive positional calculations that could potentially be a performance overhead, the `LazyProximity` class keeps proximity detection simple. It runs via a single `mousemove` event listener on the document whose calback is throttled so as not to fire repeatedly.

It utilises two native DOM methods - `elementFromPoint` which takes an `x` and `y` co-ordinate and responds with the DOM element relative to those co-ordinates, and the `contains` method, inherited by every DOM Node which, when called against an element and passed an element as an argument, responds with whether the passed element is a child of the element the method is called against.  

## Usage

#### LazyScroll

To use the `LazyScroll` class, call the class with a CSS selector for the lazy images and the plugin will load images as they appear in the viewport.

```javascript
const lazy = new LazyScroll('.lazy-image');
```

#### LazyProximity

To use the `LazyProximity` class, call the class with two arguments - a CSS selector for the lazy images, and a CSS selector for the trigger elements. When these elements are hovered over by the mouse, or receive a click / touch (for mobile) they'll trigger the loading of images matching the selector in their `data-lazy-target` attribute.

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
  // get the images yet to be loaded
  return !lazyImage.loaded;
}).forEach(function(lazyImage) {
  // test to see if the image meets the loading criteria, if it does fire the event
  lazy.fireLazyEvent(lazyImage.image);
  // and update the image data to show the image has loaded
  lazyImage.loaded = true;
});
```

### TODO:
* Support background images and picture element
* Better handling of when images fail to load
* Option to show a loading spinner whilst images load
