/* exported DateUtils */

var DateUtils = (function() {
	'use strict';

	var dayInMilliseconds  = 24 * 60 * 60 * 1000;
	var weekInMilliseconds = 7 * dayInMilliseconds;

	var weekNames = [ 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön' ];

	var monthNames = [
		'Januari', 'Februari', 'Mars', 'April',
		'Maj', 'Juni', 'Juli', 'Augusti',
		'September', 'Oktober', 'November', 'December'
	];

	var redDays = [
		{ 'month': 0,  'day': 1,  'name': 'Nyårsdagen' },
		{ 'month': 0,  'day': 5,  'name': 'Trettondagsafton' },
		{ 'month': 0,  'day': 6,  'name': 'Trettondedag jul' },
		{ 'month': 3,  'day': 30, 'name': 'Valborgsmässoafton' },
		{ 'month': 4,  'day': 1,  'name': 'Valborg' },
		{ 'month': 5,  'day': 6,  'name': 'Sveriges nationaldag' },
		{ 'month': 11, 'day': 24, 'name': 'Julafton' },
		{ 'month': 11, 'day': 25, 'name': 'Juldagen' },
		{ 'month': 11, 'day': 26, 'name': 'Annandag jul' },
		{ 'month': 11, 'day': 31, 'name': 'Nyårsafton' }
	];

	var redDaysInterval = [
		{ 'month': 5, 'start': 19, 'end': 25, 'name': 'Midsommarafton' },
		{ 'month': 5, 'start': 20, 'end': 26, 'name': 'Midsommardagen' },
		{ 'month': 5, 'start': 20, 'end': 26, 'name': 'Allhelgonaafton' },
		{ 'month': 5, 'start': 20, 'end': 26, 'name': 'Alla helgons dag' }
	];

	var addRedDay = function(date) {
		for (var i = 0; i < redDays.length; i++) {
			var red = redDays [i];
			if (red.month == date.getMonth() && red.day == date.getDate()) {
				date.red = red.name;
				break;
			}
		}
		return date;
	};

	var getMonthName = function(month) {
		return monthNames[month];
	};

	var ConvertToSwedishDay = function(day) {
		if (day >= 1 && day <= 6) {
			return day - 1;
		} else if (day === 0) {
			return 6;
		} else {
			return null;
		}
	};

	var getCalendarFirstDay = function(year, month) {
		var date = new Date(year, month);
		date.setDate(-ConvertToSwedishDay(date.getDay()) + 1);
		return date;
	};
	var getCalendarLastDay = function(year, month) {
		var date = new Date(year, month+1, 0);
		date.setDate(date.getDate() + 7 - ConvertToSwedishDay(date.getDay()) - 1);
		return date;
	};

	var getCalendarDates = function(year, month) {
		var dates = [];

		var date = getCalendarFirstDay(year, month);
		var end  = getCalendarLastDay(year, month);

		while (true) {
			var tmp = new Date(date);
			tmp.setDate(date.getDate());
			tmp = addRedDay(tmp);
			dates.push(tmp);

			if (tmp.getTime() == end.getTime()) {
				break;
			}

			date.setDate(date.getDate() + 1);
		}
		return dates;
	};

	var getWeek = function(date) {
		var firstDayOfTheYear   = new Date(date.getFullYear(), 0);
		var isFirstDayInWeekOne = ConvertToSwedishDay(firstDayOfTheYear.getDay()) <= 3;

		var dayOfWeekInMS    = ConvertToSwedishDay(date.getDay()) * dayInMilliseconds;
		var mondayOfWeekInMS = date.getTime() - dayOfWeekInMS - firstDayOfTheYear.getTime();

		var weekThisYear = Math.ceil(mondayOfWeekInMS / weekInMilliseconds);
		weekThisYear     = weekThisYear + (isFirstDayInWeekOne ? 1 : 0);
		weekThisYear     = weekThisYear == 0 ? 53 : weekThisYear

		return weekThisYear;
	};

	var padding = function(number) {
		return (number.toString().length == 1) ? '0' + number : number;
	};

	return {
		'getCalendarDates': getCalendarDates,
		'getMonthName':     getMonthName,
		'getWeek':          getWeek,
		'monthNames':       monthNames,
		'padding':          padding,
		'weekNames':        weekNames
	};
})();
