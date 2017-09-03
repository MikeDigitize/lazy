const { LazyLoad } = require('./lazy');
const { debounce } = require('./debounce');

class LazyProximity extends LazyLoad {

  constructor(imageSelector, proximitySelector) {
    
    super(imageSelector);
    
    const proximityTriggers = getProximityTriggers(proximitySelector);

    this.images = this.images.map(function(lazyImage) {
      let lazyProximityTrigger;
      proximityTriggers.forEach(function(proximityTrigger) {
        const isTarget = proximityTrigger.targets.some((target) => target === lazyImage.image);
        if(isTarget) {
          lazyProximityTrigger = proximityTrigger.trigger;
        }
      });
      return {
        lazyProximityTrigger,
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
          .map(function(trigger) {
            const targets = Array.from(document.querySelectorAll(trigger.getAttribute('data-lazy-target')));
            return {
              trigger,
              targets
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
  const target = document.elementFromPoint(clientX, clientY);

  unloadedImages.forEach((lazyImage) => {
    const { lazyProximityTrigger } = lazyImage;
    if(lazyProximityTrigger === target || lazyProximityTrigger.contains(target)) {
      this.fireEvent(lazyImage.image);
      lazyImage.loaded = true;
    }
  });
  
}

module.exports = { LazyProximity };