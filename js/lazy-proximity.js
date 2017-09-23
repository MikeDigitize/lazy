const { LazyLoad } = require('./lazy');
const { debounce } = require('./debounce');
const lazyTargetDataAttribute = 'data-lazy-target';

// triggers lazy load of images when
// the mouse cursor is over a trigger
// or the trigger receives a click
class LazyProximity extends LazyLoad {

  constructor(imageSelector, proximitySelector) {

    super(imageSelector);

    if(!this.images.length) {
      console.warn(`No elements matching the selector ${selector} were found, LazyProximity could not initialise`);
      return;
    }

    const proximityTriggers = getProximityTriggers.call(this, proximitySelector);

    if(!proximityTriggers.length) {
      console.warn(`No elements matching the selector ${proximityTriggers} were found, LazyProximity could not initialise`);
      return;
    }

    // add the proximity trigger and the click handler (for removal later)
    // to the lazy image data stored on the instance
    // click handler is for touch support
    this.images = this.images.map(function(lazyImage) {

      let lazyProximityTrigger, onClickCallback;

      proximityTriggers.forEach(function(proximityTrigger) {
        const isTarget = proximityTrigger.targets.some((target) => target === lazyImage.image);
        if(isTarget) {
          lazyProximityTrigger = proximityTrigger.trigger;
          onClickCallback = proximityTrigger.onClickCallback;
        }
      });

      return {
        ...lazyImage,
        lazyProximityTrigger,
        onClickCallback
      };

    });

    // capture mousemove on document to detect hover over trigger
    this.onMouseMove = debounce(onMouseMove.bind(this), 100);
    document.addEventListener('mousemove', this.onMouseMove);

  }

}

// create a record of each proximity trigger,
// the lazy images it triggers the loading of
// and a reference to a click handler to remove once loading has finished
function getProximityTriggers(proximitySelector) {
  return Array
          .from(document.querySelectorAll(proximitySelector))
          .map((trigger) => {
            // get all elements to trigger the loading of
            const targets = Array.from(document.querySelectorAll(trigger.getAttribute(lazyTargetDataAttribute)));
            // bind the click handler for touch and store a reference to it for removal later
            const onClickCallback = onClick.bind(this);
            trigger.addEventListener('click', onClickCallback);
            return {
              trigger,
              targets,
              onClickCallback
            };
          });
}

function getUnloadedImages(images) {
	return images.filter(lazyImage => !lazyImage.resolved);
}

// hover capturing
function onMouseMove(evt) {

  // if no images remaining to load, remove the mousemove listener
  const unloadedImages = getUnloadedImages(this.images);
  if(unloadedImages.length === 0) {
    document.removeEventListener('mousemove', this.onMouseMove);
    return;
  }

  // find the element that the mouse is over
  const { clientX, clientY } = evt;
  const trigger = document.elementFromPoint(clientX, clientY);

  unloadedImages.forEach((lazyImage) => {

    const { lazyProximityTrigger, onClickCallback, image } = lazyImage;

    // if the element the mouse is over is the trigger or is a child of the trigger
    // load the lazy images and remove its click handler
    if(lazyProximityTrigger === trigger || lazyProximityTrigger.contains(trigger)) {
      this.fireLazyEvent(image);
      lazyImage.resolved = true;
      lazyProximityTrigger.removeEventListener('click', onClickCallback);
    }

  });

}

// click handling
function onClick(evt) {

  const { target } = evt;

  this.images.forEach((lazyImage) => {
    const { lazyProximityTrigger, image, onClickCallback } = lazyImage;
    if(lazyProximityTrigger === target) {
      this.fireLazyEvent(image);
      lazyImage.resolved = true;
      lazyProximityTrigger.removeEventListener('click', onClickCallback);
    }
  });

}

module.exports = {
  LazyProximity,
  getProximityTriggers
};
