// taken from http://underscorejs.org/#debounce
function debounce(callback, wait, immediate) {
	let timeout;

	return function bounce() {
		const context = this;
		const args = arguments;

		function later() {
			timeout = null;

			if (!immediate) {
				callback.apply(context, args);
			}
		}

		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);

		if (callNow) {
			callback.apply(context, args);
		}
	};
}

module.exports = { debounce };
