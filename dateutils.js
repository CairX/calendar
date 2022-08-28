/* exported DateUtils */

var DateUtils = (function() {
	'use strict';

	var dayInMilliseconds  = 24 * 60 * 60 * 1000;
	var weekInMilliseconds = 7 * dayInMilliseconds;

	var dayNames = [ 'Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör' ];

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

	var monthOrdinalDayCommonYear = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

	var isLeapYear = function(year) {
		if (year % 4 != 0)
			return false;
		if (year % 100 != 0)
			return true;
		if (year % 400 != 0)
			return false;
		return true;
	};
	var isCommonYear = function(year) {
		return !isLeapYear(year);
	};

	var getOrdinalDay = function(date) {
		var month = date.getMonth();
		var ordinal = monthOrdinalDayCommonYear[month] + date.getDate();
		// Early exist when we know that leap year calculation isn't needed.
		if (month < 2)
			return ordinal;
		var leapYear = isLeapYear(date.getFullYear());
		return ordinal + (leapYear ? 1 : 0);
	};

	/* ISO 8601 - Weeks per year
	 * The long years, with 53 weeks in them, can be described by any of
	 * the following equivalent definitions:
	 * - any year starting on Thursday (dominical letter D or DC) and any
	 *   leap year starting on Wednesday (ED)
	 * - any year ending on Thursday (D, ED) and any leap year ending on Friday (DC)
	 * - years in which 1 January or 31 December are Thursdays
	 */
	var getWeeks = function(year) {
		var date = new Date(year, 0, 4);
		if (date.getDay() == 4)
			return 53;
		date = new Date(year - 1, 11, 31);
		if (date.getDay() == 3)
			return 53;
		return 52;
	};

	var getWeek = function(date) {
		var year = date.getFullYear();
		var ordinal = getOrdinalDay(date);
		var dayOfTheWeek = (date.getDay() + 1 % 7) + 1;
		var week = Math.floor((10 + ordinal - dayOfTheWeek) / 7);

		if (week < 1)
			return getWeeks(year - 1);
		if (week > getWeeks(year))
			return 1;
		return week;
	};

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

	var getDayName = function(day) {
		return dayNames[day];
	};

	var ConvertToSwedishDay = function(day) {
		if (day >= 1 && day <= 6)
			return day - 1;
		if (day === 0)
			return 6;
		return null;
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
			tmp = addRedDay(tmp);
			dates.push(tmp);

			if (tmp.getTime() == end.getTime()) {
				break;
			}

			date.setDate(date.getDate() + 1);
		}
		return dates;
	};

	/* ISO 8601 - First week
	 * The ISO 8601 definition for week 01 is the week with the first Thursday
	 * of the Gregorian year (i.e. of January) in it. The following definitions
	 * based on properties of this week are mutually equivalent, since
	 * the ISO week starts with Monday:
	 * - It is the first week with a majority (4 or more) of its days in January.
	 * - Its first day is the Monday nearest to 1 January.
	 * - It has 4 January in it. Hence the earliest possible first week extends
	 *   from Monday 29 December (previous Gregorian year) to Sunday 4 January,
	 *   the latest possible first week extends from Monday 4 January to Sunday 10 January.
	 * - It has the year's first working day in it, if Saturdays,
	 *   Sundays and 1 January are not working days.
	 */
	var getWeekDates = function(year, week) {
		var dates = [];
		// Start at the 4 January as we know according to ISO 8601 (note above)
		// that it will be in the first week of the year.
		var date = new Date(year, 0, 4);
		// Move to Monday of week one.
		date.setDate(date.getDate() - date.getDay() + 1);
		// Move the desired number of weeks.
		date.setDate(date.getDate() + ((week - 1) * 7));

		for (var i = 0; i < 7; i++) {
			var tmp = new Date(date);
			tmp = addRedDay(tmp);
			dates.push(tmp);
			date.setDate(date.getDate() + 1);
		}

		return dates;
	};

	var padding = function(number) {
		return (number.toString().length == 1) ? '0' + number : number;
	};

	return {
		'getCalendarDates': getCalendarDates,
		'getWeekDates':     getWeekDates,
		'getMonthName':     getMonthName,
		'getDayName':       getDayName,
		'getWeek':          getWeek,
		'padding':          padding,
	};
})();
