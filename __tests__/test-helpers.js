// Test constants
const lazyClassNames = Object.freeze({
	lazyImageClass: 'lazy-image',
	lazyImageClass2: 'lazy-image2',
	lazyImageClass3: 'lazy-image3',
	lazyImageHolderClass: 'lazy-image-holder',
	lazyTriggerClass: 'lazy-trigger',
	lazyTriggerClass2: 'lazy-trigger2',
	lazyTriggerClass3: 'lazy-trigger3',
	fakelazyImageClass: 'fake-lazy-image'
});

const lazyImagePaths = Object.freeze({
	imagePath: '__tests__/images/bb.png',
	imagePath2: '__tests__/images/earth.jpg',
	imagePath3: '__tests__/images/light.jpg',
	imagePath4: '__tests__/images/logo.png',
	gifPath: '__tests__/images/brent.gif',
	fakeImagePath: '__tests__/images/fake.jpg'
});

// Create a lazy image within a holder
function createLazyImage(src, imageClass = lazyClassNames.lazyImageClass) {
	const holder = createLazyHolder();
	const image = createImage(src, imageClass);
	holder.appendChild(image);
	document.body.appendChild(holder);

	return { holder, image };
}

// Create a picture element with multiple sources within a holder
function createLazyPicture(
	srcs = [],
	imageClass = lazyClassNames.lazyImageClass
) {
	const holder = createLazyHolder();

	// Create picture element
	const picture = document.createElement('picture');
	picture.classList.add(imageClass);

	// Create and append image sources
	srcs.forEach(function(src) {
		const source = document.createElement('source');
		source.setAttribute('data-lazy-src', src.path);
		source.setAttribute('media', `(min-width: ${src.minWidth}px)`);
		picture.appendChild(source);
	});

	// Add image fallback
	if (srcs[0]) {
		const image = createImage(srcs[0].path);
		picture.appendChild(image);
	}

	holder.appendChild(picture);

	document.body.appendChild(holder);

	return { holder, picture };
}

function createImage(src, imageClass) {
	const image = document.createElement('image');
	image.constructor = HTMLImageElement;
	image.style.width = '100%';
	image.setAttribute('data-lazy-src', src);

	if (imageClass) {
		image.classList.add(imageClass);
	}

	return image;
}

function createLazyHolder() {
	const holder = document.createElement('div');

	// needs to be explicity set in Karma
	holder.constructor = HTMLDivElement;

	holder.classList.add(lazyClassNames.lazyImageHolderClass);
	holder.style.height = '300px';
	holder.style.width = '300px';
	holder.style.position = 'relative';

	return holder;
}

function createLazyBackground(src, lazyClass = lazyClassNames.lazyImageClass) {
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

function createLazyTrigger(
	triggerClass,
	targetClass = lazyClassNames.lazyImageClass
) {
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
	const {
		lazyImageClass,
		lazyTriggerClass,
		lazyTriggerClass2,
		lazyTriggerClass3,
		lazyImageHolderClass
	} = lazyClassNames;
	const holders = Array.from(
		document.querySelectorAll(`.${lazyImageClass}, .${lazyImageHolderClass}`)
	);
	const triggers = Array.from(
		document.querySelectorAll(
			`.${lazyTriggerClass}, .${lazyTriggerClass2}, .${lazyTriggerClass3}`
		)
	);

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
	lazyImagePaths,
	createLazyPicture
};
