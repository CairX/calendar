var DateUtils = (function() {
	var weekNames = [
		'Mån', 'Tis', 'Ons',
		'Tor', 'Fre', 'Lör', 'Sön'
	];
	var monthNames = [
		'Januari', 'Februari', 'Mars', 'April',
		'Maj', 'Juni', 'Juli', 'Augusti',
		'September', 'Oktober', 'November', 'December'
	];

	var getMonthName = function(month) {
		return monthNames[month];
	};

	var getLogicalDay = function(day) {
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
		date.setDate(-getLogicalDay(date.getDay()) + 1);
		return date;
	};
	var getCalendarLastDay = function(year, month) {
		var date = new Date(year, month+1, 0);
		date.setDate(date.getDate() + 7 - getLogicalDay(date.getDay()) - 1);
		return date;
	};

	var getCalendarDates = function(year, month) {
		var dates = [];

		var date = getCalendarFirstDay(year, month);
		var end  = getCalendarLastDay(year, month);

		while (true) {
			var tmp = new Date(date);
			tmp.setDate(date.getDate());
			dates.push(tmp);

			if (tmp.getTime() == end.getTime()) {
				break;
			}

			date.setDate(date.getDate() + 1);
		}
		return dates;
	};

	var getWeek = function(date) {
		var year = new Date(date.getFullYear(), 0);
		var week = 7 * 24 * 60 * 60 * 1000;
		var start_of_week = getLogicalDay(date.getDay()) * 24 * 60 * 60 * 1000;
		var this_year = date.getTime() - start_of_week - year.getTime();

		return ((Math.ceil(this_year / week) % 52) + 1);
	};

	var padding = function(number) {
		return (number.toString().length == 1) ? '0' + number : number;
	};

	return {
		'getCalendarDates': getCalendarDates,
		'getCalendarFirstDay': getCalendarFirstDay,
		'getCalendarLastDay': getCalendarLastDay,
		'getMonthName': getMonthName,
		'getWeek': getWeek,
		'padding': padding,
		'weekNames': weekNames
	};
})();
