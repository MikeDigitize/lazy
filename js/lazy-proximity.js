const { LazyLoad } = require('./lazy');
const { debounce } = require('./debounce');
const lazyTargetDataAttribute = 'data-lazy-target';

// triggers lazy load of images when
// the mouse cursor is over a trigger
// or the trigger receives a click
class LazyProximity extends LazyLoad {

  constructor(imageSelector, proximitySelector) {
    
    super(imageSelector);
    
    const proximityTriggers = getProximityTriggers.call(this, proximitySelector);

    // add the proximity trigger and the click handler
    // to the lazy image data stored on the instance
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

    this.onMouseMoveCallback = debounce(onMouseMove.bind(this), 100);
    document.addEventListener('mousemove', this.onMouseMoveCallback);

  }

}

// create a record of each proximity trigger, 
// the lazy images it triggers the loading of 
// and a reference to a click handler to remove once loading has finished 
function getProximityTriggers(proximitySelector) {
  return Array
          .from(document.querySelectorAll(proximitySelector))
          .map((trigger) => {
            const targets = Array.from(document.querySelectorAll(trigger.getAttribute(lazyTargetDataAttribute)));
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
	return images.filter(lazyImage => !lazyImage.loaded);
}

function onMouseMove(evt) {
  
  // if no images remaining to load, remove the mousemove listener
  const unloadedImages = getUnloadedImages(this.images);
  if(unloadedImages.length === 0) {
    document.removeEventListener('mousemove', this.onMouseMoveCallback);
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
      lazyImage.loaded = true;
      lazyProximityTrigger.removeEventListener('click', onClickCallback);
    }  

  });
  
}

function onClick(evt) {

  const { target } = evt;

  this.images.forEach((lazyImage) => {
    const { lazyProximityTrigger, image, onClickCallback } = lazyImage;
    if(lazyProximityTrigger === target) {
      this.fireLazyEvent(image);
      lazyImage.loaded = true;
      lazyProximityTrigger.removeEventListener('click', onClickCallback);
    }
  });

}

module.exports = { 
  LazyProximity,
  getProximityTriggers
};