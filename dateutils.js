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
		for (var i = 1; i <= getLastDay(year, month); i++) {
			var tmp = new Date(base);
			tmp.setDate(i);
			dates.push(tmp);
		}

		// Fill end...
		var end = dates[dates.length -1];
		for (var i = 1; i < (8 - dates.length % 7); i++) {
			var tmp = new Date(end);
			tmp.setMonth(tmp.getMonth() + 1);
			tmp.setDate(i);
			dates.push(tmp);
		}

		return dates;
	};

	return { 'getCalendarDates': getCalendarDates, 'getMonthName': getMonthName };
})();
