function createEvent(evt) {
	if (document.createEvent) {
		const event = document.createEvent('CustomEvent');
		event.initEvent(evt, true, true);
		return event;
	}

	return new Event(evt);
}

module.exports = { createEvent };
