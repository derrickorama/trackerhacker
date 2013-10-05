setInterval(function () {
	$('.story.item:not(.hacked)').each(function () {
		var self = $(this),
			keywords = [],
			owner = [];

		// Labels/epics
		self.find('.label').each(function () {
			keywords.push(this.innerHTML);
		});

		// Owner info
		self.find('.owner').each(function () {
			owner.push(this.title);
			owner.push(this.innerHTML);
		});
		owner = owner.join(' ');
		keywords.push(owner);

		// Story name
		keywords.push(self.find('.story_name').text());

		self
			.data('keywords', keywords.join(' ').toLowerCase())
			.data('owner', owner.toLowerCase())
			.addClass('hacked');

		$('[name="search"]').trigger('change');
	});
}, 500);

function keywordFilter(value) {
	return $(this).data('keywords').indexOf(value) < 0;
}

function ownerFilter(value) {
	return $(this).data('owner').indexOf(value) < 0;
}

function executeSearch() {
	var filterFunction = keywordFilter,
		stories = $('.story.item').show(),
		value = $.trim(this.value).toLowerCase();

	if (value.indexOf(':') > -1) {
		if (value.indexOf('mywork:') === 0) {
			value = value.substring(7);
			filterFunction = ownerFilter;
		}
	}

	if (value === '') {
		return true;
	}

	console.time('search');
	stories.filter($.proxy(filterFunction, null, value)).hide();
	console.timeEnd('search');
}

$(document.body).on('keyup change focus', '[name="search"]', executeSearch);