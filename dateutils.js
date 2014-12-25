var DateUtils = (function() {
	var getMonthName = function(month) {
		return ['January',
				'February',
				'Mars',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December'][month];
	};

	var getLogicalDay = function(day) {
		if (day >= 1 && day <= 6) {
			return day - 1;
		} else if (day == 0) {
			return 6;
		} else {
			return null;
		}
	};

	var getLastDay = function(year, month) {
		var date = new Date(year, month);
		var last = 1;

		while (true) {
			var tmp = new Date(date);
			tmp.setDate(last);

			if (tmp.getMonth() == date.getMonth()) {
				last += 1;
			} else {
				break;
			}
		}

		return last;
	};

	var getCalendarDates = function(year, month) {
		var base = new Date(year, month);
		var dates = [];

		// Fill previous days of the week from last month.
		for (var i = -getLogicalDay(base.getDay()); i < 0; i++) {
			var tmp = new Date(base);
			tmp.setDate(i);
			dates.push(tmp);
		}

		// Fill we the coming days...
		for (var i = 1; i < getLastDay(year, month); i++) {
			var tmp = new Date(base);
			tmp.setDate(i);
			dates.push(tmp);
		}

		// Fill end...
		var end = dates[dates.length -1];
		var stop = (7 - (dates.length % 7));
		for (var i = 1; i <= stop; i++) {
			var tmp = new Date(end);
			tmp.setMonth(tmp.getMonth() + 1);
			tmp.setDate(i);
			dates.push(tmp);
		}

		return dates;
	};

	var getWeek = function(date) {
		var year = new Date(date.getFullYear(), 0);
		return Math.ceil((date.getTime() - year.getTime()) / (7 * 24 * 60 * 60 * 1000));
	};

	var padding = function(number) {
		return (number.toString().length == 1) ? '0' + number : number;
	};

	return {
		'getCalendarDates': getCalendarDates,
		'getMonthName': getMonthName,
		'getWeek': getWeek,
		'padding': padding
	};
})();
