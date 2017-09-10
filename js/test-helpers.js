// bunch of common helper functions and values to use during testing

const lazyImageClass = 'lazy-image';
const lazyImageClass2 = 'lazy-image2';
const lazyImageClass3 = 'lazy-image3';
const lazyImageHolderClass = 'lazy-image-holder';
const lazyTriggerClass = 'lazy-trigger';
const lazyTriggerClass2 = 'lazy-trigger2';
const lazyTriggerClass3 = 'lazy-trigger3';
const bigDivClass = 'big-div';
const imagePath = '__tests__/images/bb.png';
const imagePath2 = '__tests__/images/earth.jpg';
const imagePath3 = '__tests__/images/light.jpg';
const imagePath4 = '__tests__/images/logo.png';
const gifPath = '__tests__/images/brent.gif';
const fakeImagePath = '__tests__/images/fake.jpg';
const fakelazyImageClass = 'fake-lazy-image';

function createLazyImage(src, lazyClass = lazyImageClass, top = 'auto') {

	const holder = document.createElement('div');
	const image = document.createElement('image');

	// need to be explicity set in Karma
	holder.constructor = HTMLDivElement;
	image.constructor = HTMLImageElement;

	holder.classList.add(lazyImageHolderClass);
	holder.style.height = '300px';
	holder.style.width = '300px';
	holder.style.position = 'relative';
	holder.style.top = top;
	image.classList.add(lazyClass);
	image.style.width = '100%';
	image.setAttribute('data-lazy-src', src);
	holder.appendChild(image);

	document.body.appendChild(holder);

	return { holder, image };

}

function createLazyBackground(src, lazyClass = lazyImageClass) {

	const holder = document.createElement('div');

	holder.constructor = HTMLDivElement;
	holder.classList.add(lazyClass);
	holder.style.height = '300px';
	holder.style.width = '300px';
	holder.setAttribute('data-lazy-src', src);

	document.body.appendChild(holder);

	return holder;

}

function createLazyTrigger(triggerClass, targetClass = lazyImageClass) {

	const trigger = document.createElement('div');
	
	trigger.constructor = HTMLDivElement;
	trigger.classList.add(triggerClass);
	trigger.style.height = '300px';
	trigger.style.width = '300px';
	trigger.setAttribute('data-lazy-target', `.${targetClass}`);

	document.body.appendChild(trigger);

	return trigger;

}

function cleanUpDom() {

	const holders = Array.from(document.querySelectorAll(`.${lazyImageClass}, .${lazyImageHolderClass}, .${bigDivClass}`));
	const triggers = Array.from(document.querySelectorAll(`.${lazyTriggerClass}, .${lazyTriggerClass2}, .${lazyTriggerClass3}`));

	holders.forEach(function(holder) {
		holder.parentNode.removeChild(holder);
	});

	triggers.forEach(function(trigger) {
		trigger.parentNode.removeChild(trigger);
	});
	
}

module.exports = {
	lazyImageClass,
	lazyImageClass2,
	lazyImageClass3,
	lazyTriggerClass,
	lazyTriggerClass2,
	lazyTriggerClass3,
	imagePath,
	imagePath2,
	imagePath3,
	imagePath4,
	gifPath,
	fakeImagePath,
	createLazyImage,
	createLazyTrigger,
	createLazyBackground,
	cleanUpDom,
	fakelazyImageClass
};