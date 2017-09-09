# Lazy

An image loading, event driven class supporting lazy load aka deferral of image loading. 

## Browser support

IE9+ although you'll need to polyfill `Array.from` and `Array.prototype.some`.

## How it works

The `LazyLoad` base class takes a CSS selector of images to be lazy loaded. `LazyLoad` supports both Image elements and CSS background images.

```javascript
const lazy = new LazyLoad('.lazy-image');
```

Lazy images require a `data-lazy-src` attribute specifying the image path to load. If an element is an Image, when triggered `LazyLoad` will set its `src` attribute, otherwise it will set the `URL` value of the element's `CSS background-image` property.  

When using Image elements, the image's `src` attribute can be omitted or left empty. Note that omitting the `src` is technically invalid HTML, but some older browsers make a HTTP request if the `src` is set to an empty string so omitting is probably the safest approach.

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

An event listener listening for a `lazyload` event is bound to each lazy image. When fired the event triggers the loading of the image into cache and, once resolved, either sets the `src` attribute of an Image element, or the `background-image` of any other element.

An instance of `LazyLoad` inherits a single method `fireLazyEvent`. When passed an element it fires the `lazyload` event on it.

```javascript
// an instance of LazyLoad looks like this
{
  images: <Array> // array of objects representing each lazy load image (see above for data structure)
  fireLazyEvent: <Function> // inherited
}
```

The `lazyload` event can be captured on the `window` like any other event that bubbles. It's a signal that `LazyLoad` is attempting to load an image and so can be used as an opportunity to show a loading spinner whilst this happens. 

```html
<div class="lazy-image-container">
  <img src="images/loading-spinner.gif" class="loading-spinner">
  <img data-lazy-src="images/my-lazy-loading-image.png" class="lazy-image">
</div>
```
```javascript
window.addEventListener('lazyload', function(evt) {
  var lazyImage = evt.target;
  var spinner = lazyImage.previousElementSibling;
  
  // show the loading spinner for an image
  spinner.style.display = "block";
});

window.addEventListener('lazyloadcomplete', function(evt) {
  var lazyImage = evt.target;
  var spinner = lazyImage.previousElementSibling;
  
  // hide the loading spinner and show the image
  spinner.style.display = "none";
  lazyImage.style.display = "block";
});
```

Upon a successful load, a `lazyloadcomplete` event is fired on the element. Following on from the previous example, this is when the loading spinner for that image can be removed and the image displayed. 

As older browers can display images without `src` attributes as broken images, it's probably a good idea to add styling to hide them initially and reveal upon loading. If an image can't be loaded a `lazyloaderror` event is fired.

## Lazy Scroll

The `LazyScroll` class is a wrapper around `LazyLoad`, using positional data to determine if an image is in the viewport. If it is its `lazyload` event is fired. The `LazyScroll` class appends the positional data of each element to the image data stored on the instance.

## Lazy Proximity

The `LazyProximity` class is a wrapper around `LazyLoad`. `LazyProximity` allows you to define elements on the page that will trigger the loading of any amount of lazy images when hovered over or when receiving a click / touch event, for mobile. 

The lazy images that a trigger element is to load should be defined with a CSS selector in its `data-lazy-target` attribute.

```html
<!-- loads all images that match the selector ".lazy-holder img" -->
<button class="lazy-btn" data-lazy-target=".lazy-holder img">Click me!</button>
```

## Usage

The `lazy.min.js`, `lazy-scroll.min.js` and `lazy-proximity.min.js` files are in the `js` folder. Reference one of these in your HTML and use the instructions below to initialise.

To extend any of the classes, install the project with -

```
yarn
```
and run the relevant command from npm `scripts` in the `package.json` file (`start`, `run dist` or `test`).

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
* Add support for Picture element
* Handling when functions are supplied with wrong argument types or null / empty results
