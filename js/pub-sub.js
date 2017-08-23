const pubsub = (function() {

	let events = [];

	return {
		pub(event, data) {

			events.forEach(function(e) {
				if(e.event === event) {
					e.callback(data);
				}
			});

		},
		sub(event, callback) {

			events.push({ event, callback });
			return function() {
				const index = events.findIndex(function(e) {
					return e.event === event && e.callback === callback;
				});
				events.splice(index, 1);
			}

		}
	}

})();