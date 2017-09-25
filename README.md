# Lazy

An image loading, event driven class supporting lazy load aka deferral of image loading.

## Browser support

IE9+ although you'll need to polyfill `Array.from`, `Array.prototype.some` and `Element.prototype.classList`. If you want to lazy load the `HTMLPictureElement` you'll need to polyfill it for non-supporting browsers ([Picturefill is recommended](https://github.com/scottjehl/picturefill)).

## How it works

The `LazyLoad` base class takes a CSS selector of elements to be lazy loaded. `LazyLoad` supports the loading of image elements, picture elements and elements with CSS background images.

```javascript
const lazy = new LazyLoad('.lazy-image');
```

`LazyLoad` uses a `data-lazy-src` attribute to identify the image path to load. When using image elements, the image's `src` attribute should be omitted or left empty. 

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

Upon initialisation, the `LazyLoad` class creates an array of image data, storing each element, its `src` (pulled from its `data-lazy-src` attribute) and a resolved attribute initially set to `false`. If a `HTMLPictureElement` is found the `src` will be an array of the `data-lazy-src` attributes from its children.

```javascript
// each element stored in the images array is represented with the following data structure
{
  image: <Elememt>
  src: <String or Array>
  resolved: <Boolean>
}
```
### Lazy Events

An event listener listening for a `lazyload` event is bound to each element upon initialisation. An instance of `LazyLoad` inherits a single method `fireLazyEvent` which, when passed an element, fires its `lazyload` event. Upon receipt of that event the element will attempt to load. 

Note: if an element that receives a `lazyload` event is not an image or picture element, upon successful load its CSS `background-image` property will be set as the loaded image. 

```javascript
// an instance of LazyLoad looks like this
{
  images: <Array> // array of objects representing each lazy load element (see above for data structure)
  fireLazyEvent: <Function> // inherited
}
```

The `lazyload` event can be captured on the `window` or another parent like any other event that bubbles. It's a signal that `LazyLoad` is attempting to load an element and so can be used as an opportunity to do something whilst this happens, such as show a loading spinner.

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

  // show a loading spinner
  spinner.style.display = "block";
});

window.addEventListener('lazyloadcomplete', function(evt) {
  var lazyImage = evt.target;
  var spinner = lazyImage.previousElementSibling;

  // hide the loading spinner and show the element
  spinner.style.display = "none";
  lazyImage.style.display = "block";
});
```

Upon a successful load, a `lazyloadcomplete` event is fired on the element. Following on from the previous example, this would be an opportunity to remove the loading spinner and display the element.

As older browers can display images without `src` attributes as broken images and some browsers display the `alt` text of an image before the image loads, it's probably a good idea to add styling to hide elements initially and reveal upon loading. If an element can't be loaded a `lazyloaderror` event is fired.

### Lazy Loading a Picture Element

For browsers that don't support the `HTMLPictureElement`, lazy loading will not work without some additional help from your chosen polyfill. The [Picturefill](https://github.com/scottjehl/picturefill) polyfill is used in the demo and tests. As non-supporting browsers will not react when the `srcset` property of an image is set (`LazyLoad` does not set the `src` property of source elements and the image within a picture element, it sets their `srcset` property), you'll need to retrigger the polyfill to force the picture element to load.

```javascript
// example using the Picturefill polyfill
const lazy = new LazyLoad('.lazy-picture');
const picture = lazy.images[0];
const image = picture.image;

// fire lazyload event
lazy.fireLazyEvent(image);

// force polyfill to run again
picturefill({
  reevaluate: true,
  elements: [image]
});
```

## Lazy Scroll

The `LazyScroll` class is a wrapper around `LazyLoad`, using positional data to determine if an element is in the viewport. If so, its `lazyload` event is fired. The `LazyScroll` class appends the positional data of each element to the data stored on the instance.

## Lazy Proximity

The `LazyProximity` class is a wrapper around `LazyLoad`. `LazyProximity` allows you to define elements on the page that will trigger the loading of any amount of lazy elements when hovered over or when receiving a click / touch event, for mobile.

The elements a trigger is to load should be defined with a CSS selector in its `data-lazy-target` attribute.

```html
<!-- loads all elements that match the selector ".lazy-holder img" -->
<button class="lazy-btn" data-lazy-target=".lazy-holder img">Click or hover over me!</button>
```

## Usage

The `lazy.min.js`, `lazy-scroll.min.js` and `lazy-proximity.min.js` files are in the `js` folder. 

```javascript
// new school
import LazyLoad from './lazy.min.js';

// old school
const LazyScroll = require('./lazy-scroll.min.js');
```

```html
<!-- in the browser to expose LazyProximity globally -->
<script src="./lazy-proximity.min.js"></script>
```

To extend any of the classes, install the project with `yarn` and run the appropriate command from npm `scripts` in the `package.json` file.

#### LazyLoad

To use the `LazyLoad` class, call the class with a CSS selector of the elements to lazy load.

```javascript
const lazy = new LazyScroll('.lazy-image');
```
To trigger the loading of an image, use the `fireLazyEvent` method on the instance, passing in the element to load.

```javascript
// access lazy image data from the instance's images array
const [lazyImage] = lazy.images;
// call the fireLazyEvent method on the instance passing in the element to lazy load
lazy.fireLazyEvent(lazyImage.image);
```

#### LazyScroll

To use the `LazyScroll` class, call the class with a CSS selector of the elements to lazy load and they will load as they appear in the viewport.

```javascript
const lazy = new LazyScroll('.lazy-image');
```

#### LazyProximity

To use the `LazyProximity` class, call the class with two arguments - a CSS selector for the elements to lazy load, and a CSS selector for the trigger elements. When these elements are hovered over or receive a click / touch it will trigger the loading of elements matching the selector in their `data-lazy-target` attribute.

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

### Licence
MIT
