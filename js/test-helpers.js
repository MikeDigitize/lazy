// bunch of common helper functions and values to use during testing

const lazyImageClass = 'lazy-image';
const lazyImageClass2 = 'lazy-image2';
const lazyImageClass3 = 'lazy-image3';
const lazyImageHolderClass = 'lazy-image-holder';
const lazyTriggerClass = 'lazy-trigger';
const lazyTriggerClass2 = 'lazy-trigger2';
const lazyTriggerClass3 = 'lazy-trigger3';
const bigDivClass = 'big-div';
const imagePath = '../images/bb.png';
const imagePath2 = '../images/earth.jpg';
const imagePath3 = '../images/light.jpg';
const imagePath4 = '../images/logo.png';
const gifPath = '../images/brent.gif';
const fakeImagePath = '../images/fake.jpg';
const fakelazyImageClass = 'fake-lazy-image';

function createLazyImage(src, lazyClass = lazyImageClass) {

	const holder = document.createElement('div');
	const image = document.createElement('image');

	holder.classList.add(lazyImageHolderClass);
	holder.style.height = '300px';
	holder.style.width = '300px';
	image.classList.add(lazyClass);
	image.style.width = '100%';
	image.setAttribute('data-lazy-src', src);
	holder.appendChild(image);

	document.body.appendChild(holder);

	return image;

}

function createLazyTrigger(triggerClass, targetClass = lazyImageClass) {

	const trigger = document.createElement('div');

	trigger.classList.add(triggerClass);
	trigger.style.height = '300px';
	trigger.style.width = '300px';
	trigger.setAttribute('data-lazy-target', `.${targetClass}`);

	document.body.appendChild(trigger);

	return trigger;

}

function createBigDiv() {

	const div = document.createElement('div');
	div.style.height = '6000px';
	div.style.width = '5000px';
	div.classList.add(bigDivClass);

	document.body.appendChild(div);

	return div;
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
	cleanUpDom,
	fakelazyImageClass,
	createBigDiv
};