const { LazyLoad } = require('./lazy');
const { debounce } = require('./debounce');

const LAZYTARGET = 'data-lazy-target';

let PROXIMITY_TOLERANCE = 50;

class LazyProximity extends LazyLoad {

  constructor(imageSelector, proximitySelector, tolerance = 50) {
    
    super(imageSelector);
    
    PROXIMITY_TOLERANCE = tolerance;
    const proximityTriggers = getProximityTriggers.call(this, proximitySelector);

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
        lazyProximityTrigger,
        onClickCallback,
        ...lazyImage
      };
      
    });

    this.onMouseMoveCallback = debounce(onMouseMove.bind(this), 100);
    document.addEventListener('mousemove', this.onMouseMoveCallback);

  }

}

function getProximityTriggers(proximitySelector) {
  return Array
          .from(document.querySelectorAll(proximitySelector))
          .map((trigger) => {
            const targets = Array.from(document.querySelectorAll(trigger.getAttribute(LAZYTARGET)));
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
  
  const unloadedImages = getUnloadedImages(this.images);
  if(unloadedImages.length === 0) {
    document.removeEventListener('mousemove', this.onMouseMoveCallback);
    return;
  }

  const { clientX, clientY } = evt;
  const coordinates = getSurroundingCoordinates(clientX, clientY);

  unloadedImages.forEach((lazyImage) => {

    const { lazyProximityTrigger, onClickCallback, image } = lazyImage;
    
    for(let i = 0; i < coordinates.length; i++) {
      
      const target = coordinates[i];
      const trigger = document.elementFromPoint(target.x, target.y);
      
      if(lazyProximityTrigger === trigger || lazyProximityTrigger.contains(trigger)) {
        this.fireEvent(image);
        lazyImage.loaded = true;
        lazyProximityTrigger.removeEventListener('click', onClickCallback);
        break;
      }

    }   

  });
  
}

function getSurroundingCoordinates(x, y) {
  const current = { x, y };
  const left = { x: x - PROXIMITY_TOLERANCE, y };
  const topLeft = { x: x - PROXIMITY_TOLERANCE, y: y - PROXIMITY_TOLERANCE };
  const top = { x, y: y - PROXIMITY_TOLERANCE };
  const topRight = { x: x + PROXIMITY_TOLERANCE, y: y - PROXIMITY_TOLERANCE };
  const right = { x: x + PROXIMITY_TOLERANCE, y };
  const bottomRight = { x: x + PROXIMITY_TOLERANCE, y: y + PROXIMITY_TOLERANCE };
  const bottom = { x, y: y + PROXIMITY_TOLERANCE };
  const bottomLeft = { x: x - PROXIMITY_TOLERANCE, y: y + PROXIMITY_TOLERANCE };
  return [ left, topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, current ];
}

function onClick(evt) {

  const { target } = evt;

  this.images.forEach((lazyImage) => {
    const { lazyProximityTrigger, image, onClickCallback } = lazyImage;
    if(lazyProximityTrigger === target) {
      this.fireEvent(image);
      lazyImage.loaded = true;
      lazyProximityTrigger.removeEventListener('click', onClickCallback);
    }
  });

}

module.exports = { 
  LazyProximity,
  getProximityTriggers,
  getSurroundingCoordinates
};