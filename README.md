# What is it?

Image loading, event driven classes that support lazy load aka deferral of image loading. The classes support the loading of image elements, picture elements and elements with CSS background images.

## LazyLoad, LazyScroll and LazyProximity

`LazyLoad` is the base class that provides the event driven loading functionality, `LazyScroll` is a `scroll` event based extension that loads items as they appear in the viewport and `LazyProximity` is an extension that defines trigger elements which, when the cursor is over them or they receive a touch event (on cursor-less devices), triggers the lazy load of specified target elements.

## Browser support

IE9+ although you'll need to polyfill `Array.from`, `Array.prototype.some` and `Element.prototype.classList`. If you want to lazy load the `HTMLPictureElement` you'll need to polyfill it for non-supporting browsers ([Picturefill is recommended](https://github.com/scottjehl/picturefill)).

## Usage

The `lazy.min.js`, `lazy-scroll.min.js` and `lazy-proximity.min.js` files are in the `js` folder. 

Each of these requires a `data-lazy-src` attribute to be added to each element to identify the image path to load. When using image elements, the image's `src` attribute should be omitted or left empty. 

Note: omitting the `src` is technically invalid HTML, but some older browsers make a HTTP request if the `src` is set to an empty string so omitting is probably the safest approach.

```html
<!-- lazy load an image element -->
<img data-lazy-src="images/my-lazy-load-image.png">

<!-- lazy load a CSS background image -->
<section data-lazy-src="images/my-lazy-background-image.png"></section>

<!-- lazy load a picture element -->
<picture>
  <source media="(min-width: 650px)" data-lazy-src="images/my-lazy-picture-large.png"></source>
  <source media="(min-width: 450px)" data-lazy-src="images/my-lazy-picture-med.png"></source>
  <img data-lazy-src="images/my-lazy-picture-small.png" />
</picture>
```
Once the elements have been marked up accordingly, the classes can be used in the following ways:

```javascript
// new school
import LazyLoad from './lazy.min.js';
import LazyScroll from './lazy-scroll.min.js';
import LazyProximity from './lazy-proximity.min.js';

// old school
const LazyLoad = require('./lazy.min.js');
const LazyScroll = require('./lazy-scroll.min.js');
const LazyProximity = require('./lazy-proximity.min.js');
```

```html
<!-- in the browser to expose globally -->
<script src="./lazy.min.js"></script>
<script src="./lazy-scroll.min.js"></script>
<script src="./lazy-proximity.min.js"></script>
```

To modify the classes or create your own wrapper around `LazyLoad` install the project with `yarn` and use either `yarn start` or `yarn run dist` to produce an unminified or minified output respectively. Use `yarn test` to run the test suite. 

#### LazyLoad

The `LazyLoad` base class gives you the means to lazy load items. It does not automatically trigger loading like the `LazyScroll` and `LazyProximity` classes do. An instance of `LazyLoad` inherits a method - `fireLazyEvent` - which, when passed an element, will fire a `lazyload` event on that element, telling `LazyLoad` to attempt the loading of it. 

To use the `LazyLoad` class, create a new instance by passing a CSS selector of the elements to lazy load.

```html
<img class="my-lazy-image" data-lazy-src="images/my-lazy-load-image.png">
```

```javascript
// create an instance 
const lazy = new LazyScroll('.my-lazy-image');
// pull the first element from the instance's images array
const [lazyImage] = lazy.images;
// call the fireLazyEvent method passing in the element to lazy load
lazy.fireLazyEvent(lazyImage.image);
```

#### LazyScroll

To use the `LazyScroll` class, call the class with a CSS selector of the elements to lazy load and they will load as they appear in the viewport. `LazyScroll` responds to the `scroll` event both vertically and horizontally.

```javascript
const lazy = new LazyScroll('.your-lazy-item-identifying-selector');
```

##### Manually loading an image

You may find yourself in a scenario where you have images appear on screen **not** as a result of a scroll event. For example, you might have a carousel of images to lazy load but some of the images are hidden off screen, meaning `LazyScroll` will not find them in the viewport. As the carousel transitions from slide to slide, images that were previously outside the viewport will enter, but as no `scroll` event has occurred, `LazyScroll` will not be aware of them. 

For these types of scenarios, `LazyScroll` provides a method - `rescanViewport` - which, when called, forces it to manually rescan the viewport for elements to lazy load. To utilise this functionality, in the case of such a carousel, the `rescanViewport` method would need to be called every time the carousel transitions from slide to slide.

```javascript
// add the `rescanViewport` method to the carousel controls
carouselNext.addEventListener('click', lazy.rescanViewport);
```

#### LazyProximity

To use the `LazyProximity` class, call the class with two arguments - a CSS selector for the elements to lazy load (the targets), and a CSS selector for the trigger elements. When these trigger elements are hovered over or receive a click / touch they will trigger the loading of elements matching the selector in their `data-lazy-target` attribute.

```html
<!-- trigger element that loads all elements that match the selector ".my-lazy-image" -->
<button class="lazy-btn" data-lazy-target=".my-lazy-image">Click or hover over me!</button>

<!-- target elements -->
<img class="my-lazy-image" data-lazy-src="images/my-lazy-load-image.png">
<img class="my-lazy-image" data-lazy-src="images/my-lazy-load-image2.png">
<img class="my-lazy-image" data-lazy-src="images/my-lazy-load-image3.png">
```

```javascript
const lazy = new LazyProximity('.lazy-image', '.lazy-btn');
```

#### Extending

To extend the base class and add custom loading criteria you can use the following pattern:

```javascript
class CustomLazy extends LazyLoad {
  constructor(selector) {
    super(selector);
    // modify the images property to add custom data
    this.images = this.images.map(function(lazyImage) {
      // return each lazy element's data object with additional data
    });
  }
}

// use some other criteria to trigger an element load
// internally in the class, loop through the array of elements, if one meets the criteria to load
// call the fireLazyEvent method passing in the element to load

const lazy = new CustomLazy('.lazy-image');
lazy.images.filter(function(lazyImage) {
  // get the elements yet to be resolved
  return !lazyImage.resolved;
}).forEach(function(lazyImage) {
  // test to see if the element meets the loading criteria, if it does fire the lazyload event
  lazy.fireLazyEvent(lazyImage.image);
  // and update the data to show the element has resolved
  lazyImage.resolved = true;
});
```

## How it works

Upon initialisation, the `LazyLoad` class creates an array of image data, storing each element, its `src` (pulled from its `data-lazy-src` attribute) and a resolved attribute initially set to `false`. If a `HTMLPictureElement` is found the `src` will be an `array` of the `data-lazy-src` attributes from its children.

```html
<!-- an image element -->
<img class="lazy-image" data-lazy-src="images/my-lazy-load-image.png">

<!-- lazy load a picture element -->
<picture class="lazy-image">
  <source media="(min-width: 650px)" data-lazy-src="images/my-lazy-picture-large.png"></source>
  <source media="(min-width: 450px)" data-lazy-src="images/my-lazy-picture-med.png"></source>
  <img data-lazy-src="images/my-lazy-picture-small.png" />
</picture>
```

```javascript
const lazy = new LazyLoad('.lazy-image');

// each element stored in the images array is represented with the following data structure
{
  image: <Elememt>
  src: <String or Array>
  resolved: <Boolean>
}

// image element above would produce a single source
src: 'images/my-lazy-load-image.png'

// picture element above would produce an array of sources
src: ['images/my-lazy-picture-large.png', 'images/my-lazy-picture-med.png', 'images/my-lazy-picture-small.png']
```

### Lazy Events

An event listener listening for a `lazyload` event is bound to each element upon initialisation. 

Note: if an element that receives a `lazyload` event is **not** an image or picture element, upon successful load its CSS `background-image` property will be set as the loaded image. 

#### Utilising the lazy events

The `lazyload` event can be captured on the `window` or another parent like any other event that bubbles. It's a signal that `LazyLoad` is attempting to load an element and so can be used as an opportunity to do something whilst this happens, such as show a loading spinner.

Upon a successful load, a `lazyloadcomplete` event is fired on the element. Following on from the previous example, this would be an opportunity to remove the loading spinner and display the element.

As older browers can display images without `src` attributes as broken images and some browsers display the `alt` text of an image before the image loads, it's probably a good idea to add styling to hide elements initially and reveal upon loading. If an element can't be loaded a `lazyloaderror` event is fired.

```html
<div class="lazy-image-container">
  <img src="images/loading-spinner.gif" class="loading-spinner">
  <img data-lazy-src="images/my-lazy-loading-image.png" class="lazy-image">
</div>
```

```javascript
// show a loading spinner whilst the image attempts to load 
window.addEventListener('lazyload', function(evt) {
  var lazyImage = evt.target;
  var spinner = lazyImage.previousElementSibling;

  // show a loading spinner
  spinner.style.display = "block";
});

// hide the spinner and show the image if the loading is successful
window.addEventListener('lazyloadcomplete', function(evt) {
  var lazyImage = evt.target;
  var spinner = lazyImage.previousElementSibling;

  // hide the loading spinner and show the element
  spinner.style.display = "none";
  lazyImage.style.display = "block";
});

// remove the image if the load is unsuccessful
window.addEventListener('lazyloaderror', function(evt) {
  var lazyImage = evt.target;
  var spinner = lazyImage.previousElementSibling;

  // hide the loading spinner and remove the image
  spinner.style.display = "none";
  lazyImage.parentNode.removeChild(lazyImage);
});
```

### Lazy Loading a Picture Element

For browsers that don't support the `HTMLPictureElement`, lazy loading will not work without some additional help from your chosen polyfill. The [Picturefill](https://github.com/scottjehl/picturefill) polyfill is used in the demo and tests. As non-supporting browsers will not react when the `srcset` property of an image is set (`LazyLoad` does not set the `src` property of source elements and the image within a picture element, it sets their `srcset` property), you'll need to retrigger the polyfill to force the picture element to load.

```javascript
// example using the Picturefill polyfill
const lazy = new LazyLoad('.lazy-picture');
// get the first picture element
const [picture] = lazy.images;

// fire lazyload event on the picture element
lazy.fireLazyEvent(picture.image);

// force polyfill to run again on the element
picturefill({
  reevaluate: true,
  elements: [picture.image]
});
```

### Licence
MIT
