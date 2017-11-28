// bunch of common helper functions and values to use during testing

const lazyImageClass = 'lazy-image';
const lazyImageClass2 = 'lazy-image2';
const lazyImageClass3 = 'lazy-image3';
const lazyImageHolderClass = 'lazy-image-holder';
const lazyTriggerClass = 'lazy-trigger';
const lazyTriggerClass2 = 'lazy-trigger2';
const lazyTriggerClass3 = 'lazy-trigger3';
const fakelazyImageClass = 'fake-lazy-image';

const imagePath = '__tests__/images/bb.png';
const imagePath2 = '__tests__/images/earth.jpg';
const imagePath3 = '__tests__/images/light.jpg';
const imagePath4 = '__tests__/images/logo.png';
const gifPath = '__tests__/images/brent.gif';
const fakeImagePath = '__tests__/images/fake.jpg';

const lazyClassNames = {
	lazyImageClass,
	lazyImageClass2,
	lazyImageClass3,
	lazyImageHolderClass,
	lazyTriggerClass,
	lazyTriggerClass2,
	lazyTriggerClass3,
	fakelazyImageClass
};

const lazyImagePaths = {
	imagePath,
	imagePath2,
	imagePath3,
	imagePath4,
	gifPath,
	fakeImagePath
};

function createLazyImage(src, lazyClass = lazyImageClass) {

	const holder = createLazyHolder();
	const image = document.createElement('image');

	// needs to be explicity set in Karma
	image.constructor = HTMLImageElement;
	image.classList.add(lazyClass);
	image.style.width = '100%';
	image.setAttribute('data-lazy-src', src);

	holder.appendChild(image);
	document.body.appendChild(holder);

	return { holder, image };

}

function createLazyHolder() {

	const holder = document.createElement('div');

	// needs to be explicity set in Karma
	holder.constructor = HTMLDivElement;

	holder.classList.add(lazyImageHolderClass);
	holder.style.height = '300px';
	holder.style.width = '300px';
	holder.style.position = 'relative';

	return holder;

}

function createLazyBackground(src, lazyClass = lazyImageClass) {

	const holder = createLazyHolder();
	const divWithBackground = document.createElement('div');

	divWithBackground.constructor = HTMLDivElement;
	divWithBackground.classList.add(lazyClass);
	divWithBackground.style.height = '300px';
	divWithBackground.style.width = '300px';
	divWithBackground.setAttribute('data-lazy-src', src);

	holder.appendChild(divWithBackground);
	document.body.appendChild(holder);

	return { holder, divWithBackground };

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

	const holders = Array.from(document.querySelectorAll(`.${lazyImageClass}, .${lazyImageHolderClass}`));
	const triggers = Array.from(document.querySelectorAll(`.${lazyTriggerClass}, .${lazyTriggerClass2}, .${lazyTriggerClass3}`));

	holders.concat(triggers).forEach(function(element) {
		element.parentNode.removeChild(element);
	});

}

module.exports = {
	createLazyImage,
	createLazyTrigger,
	createLazyBackground,
	cleanUpDom,
	lazyClassNames,
	lazyImagePaths
};
