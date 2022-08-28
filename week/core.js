/* global DateUtils */
/* exported update, displayWeek, displayRedDays */

'use strict';

var Tag = (function() {
	return {
		'string': function(name, content, options) {
			var result = '<' + name;

			for (var key in options) {
				result += ' ' + key;
				result += '="' + options[key] + '"';
			}

			result += '>';
			result += content;
			result += '</' + name + '>';

			return result;
		}
	};
})();

var update = function() {
	var result  = '';
	var page = '';

	var startYear     = parseInt(document.getElementById('year').value);
	var startWeek     = parseInt(document.getElementById('week').value);
	var numberOfWeeks = parseInt(document.getElementById('weeks').value);
	var showRedDays   = document.getElementById('red-days').checked;

	for (var i = 0; i < numberOfWeeks; i++) {
		var gridContent = '';
		var dates = DateUtils.getWeekDates(startYear, startWeek + i);
		var year = dates[0].getFullYear();
		var week = DateUtils.getWeek(dates[0]);

		for (var j = 0; j < 7; j++) {
			var date = dates[j];
			var info = '';
			info += DateUtils.getDayName(date.getDay());
			info += ' - ' + date.getDate() + ' ' + DateUtils.getMonthName(date.getMonth());
			info = Tag.string('h3', info);

			var lines = '';
			for (var line = 0; line < 5; line++) {
				var content = ''
				if (line == 0 && date.red) {
					var show = showRedDays ? '' : ' hide';
					content = Tag.string('span', date.red, { 'class': 'red-day' + show });
				}
				lines += Tag.string('p', content, { 'class': 'line' });
			}
			gridContent += Tag.string('div', info + lines);
		}

		var info = Tag.string('h3', 'Anteckningar');
		var lines = '';
		for (var line = 0; line < 5; line++) {
			lines += Tag.string('p', '', { 'class': 'line' });
		}
		gridContent += Tag.string('div', info + lines);

		var grid = Tag.string('div', gridContent, { 'class': 'day-grid' });
		var yearTag = Tag.string('span', year, { 'class': 'year' });
		var header  = Tag.string('h2',  'Vecka ' + week + ' - ' + yearTag);
		var week = Tag.string('div', header + grid, { 'class': 'week' });
		page += week;

		if ((i + 1) % 2 == 0 || (i + 1) == numberOfWeeks) {
			result += Tag.string('div', page, { 'class': 'page' });
			page = '';
		}
	}

	document.getElementById('content').innerHTML = result;
};

var displayRedDays = function() {
	var days = document.getElementsByClassName('red-day');
	var show = document.getElementById('red-days').checked;

	for (var i = 0; i < days.length; i++) {
		show ? days[i].classList.remove("hide") : days[i].classList.add("hide");
	}
};

var displayWeek = function() {
	var weeks = document.getElementsByClassName('week');
	var show = document.getElementById('week').checked;

	for (var i = 0; i < weeks.length; i++) {
		show ? weeks[i].classList.remove("hide") : weeks[i].classList.add("hide");
	}
};

const displayWeekend = function() {
	var weekends = document.getElementsByClassName('weekend');
	var show = document.getElementById('weekend').checked;

	for (var i = 0; i < weekends.length; i++) {
		show ? weekends[i].classList.remove("hide") : weekends[i].classList.add("hide");
	}
};
