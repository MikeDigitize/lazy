function CreateEvent(evt) {
	if(document.createEvent) {
		const event = document.createEvent('CustomEvent');
		event.initEvent(evt, true, true);
		return event;
	}
	else {
		return new Event(evt);		
	}
}

module.exports = {
	CreateEvent
};