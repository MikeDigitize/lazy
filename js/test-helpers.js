const holderSelector = 'holder';
const imagePath = '../images/bb.png';
const imagePath2 = '../images/earth.jpg';
const imagePath3 = '../images/light.jpg';
const imagePath4 = '../images/logo.png';
const fakeImagePath = 'images/fake.jpg';

function createDom(src) {

	const holder = document.createElement('div');
	const image = document.createElement('image');

	holder.classList.add(holderSelector);
	image.setAttribute('data-src', src);
	holder.appendChild(image);

	document.body.appendChild(holder);

	return { image, holder };

}

function cleanUpDom() {

	const holders = Array.from(document.querySelectorAll(`.${holderSelector}`));
	holders.forEach(function(holder) {
		holder.parentNode.removeChild(holder);
	});
	
}

module.exports = {
	holderSelector,
	imagePath,
	imagePath2,
	imagePath3,
	imagePath4,
	fakeImagePath,
	createDom,
	cleanUpDom
};