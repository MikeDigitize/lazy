const { LazyLoad } = require('./lazy');
const { debounce } = require('./debounce');
const lazyTargetDataAttribute = 'data-lazy-target';

/**
 *
 * LazyProximity
 *
 * Define triggers for lazy load elements.
 * Elements will begin lazy loading when the cursor is over a trigger or it receives a click.
 *
 */

class LazyProximity extends LazyLoad {

  constructor(imageSelector, proximitySelector) {

    super(imageSelector);

    if(!this.images.length) {
      console.warn(`No elements matching the selector ${imageSelector} were found, LazyProximity could not initialise`);
      return;
    }

    const proximityTriggers = getProximityTriggers.call(this, proximitySelector);

    if(!proximityTriggers.length) {
      console.warn(`No elements matching the selector ${proximityTriggers} were found, LazyProximity could not initialise`);
      return;
    }

    // store additional proximity data for each element contained in an instance of LazyProximity
    this.images = this.images.map(function(lazyImage) {

      let lazyProximityTrigger, onClickCallback;

      // loop through all triggers
      proximityTriggers.forEach(function(proximityTrigger) {

        // when a trigger's target is found
        const isTarget = proximityTrigger.targets.some((target) => target === lazyImage.image);

        // add its trigger and click callback to the target's data on the instance
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

// find all trigger elements and their lazy load targets
function getProximityTriggers(proximitySelector) {

  return Array.from(document.querySelectorAll(proximitySelector)).map((trigger) => {

    // get all targets for the trigger
    const targets = Array.from(document.querySelectorAll(trigger.getAttribute(lazyTargetDataAttribute)));

    // store a reference to it for removal later
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

// detect when the cursor is over a trigger element
function onMouseMove(evt) {

  // if there are no images remaining to load, remove the mousemove listener
  const unloadedImages = getUnloadedImages(this.images);
  if(unloadedImages.length === 0) {
    document.removeEventListener('mousemove', this.onMouseMove);
    return;
  }

  // find the element that the mouse is over
  const { clientX, clientY } = evt;
  const trigger = document.elementFromPoint(clientX, clientY);

  // loop through the remaining unloaded images
  unloadedImages.forEach((lazyImage) => {

    const { lazyProximityTrigger, onClickCallback, image } = lazyImage;

    if(lazyProximityTrigger) {

      // if the element the mouse is over is the trigger, or is a child of the trigger
      if(lazyProximityTrigger === trigger || lazyProximityTrigger.contains(trigger)) {

        // load the lazy element, remove its click handler and set it as resolved
        this.fireLazyLoadEvent(image);
        lazyImage.resolved = true;
        lazyProximityTrigger.removeEventListener('click', onClickCallback);

      }

    }

  });

}

// detect click on trigger
function onClick(evt) {

  const { target } = evt;

  // loop through images
  this.images.forEach((lazyImage) => {

    const { lazyProximityTrigger, image, onClickCallback } = lazyImage;

    if(lazyProximityTrigger) {

      // match the clicked trigger with a saved trigger
      if(lazyProximityTrigger === target || lazyProximityTrigger.contains(target)) {

        // and load that trigger's lazy element
        this.fireLazyLoadEvent(image);
        lazyImage.resolved = true;
        lazyProximityTrigger.removeEventListener('click', onClickCallback);

      }

    }

  });

}

module.exports = {
  LazyProximity,
  getProximityTriggers
};
