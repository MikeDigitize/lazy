const { LazyLoad } = require('./lazy');
const { debounce } = require('./debounce');

class LazyProximity extends LazyLoad {

  constructor(imageSelector, proximitySelector) {
    
    super(imageSelector);
    
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
            const targets = Array.from(document.querySelectorAll(trigger.getAttribute('data-lazy-target')));
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
  const target = document.elementFromPoint(clientX, clientY);

  unloadedImages.forEach((lazyImage) => {
    const { lazyProximityTrigger, onClickCallback, image } = lazyImage;
    if(lazyProximityTrigger === target || lazyProximityTrigger.contains(target)) {
      this.fireEvent(image);
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
      this.fireEvent(image);
      lazyImage.loaded = true;
      lazyProximityTrigger.removeEventListener('click', onClickCallback);
    }
  });

}

module.exports = { LazyProximity };