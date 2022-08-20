/* global DateUtils */
/* exported update, displayMonths, displayRedDays, displayWeek */

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

    var startYear      = parseInt(document.getElementById('year').value);
    var startMonth     = parseInt(document.getElementById('month').value);
    var startDate      = new Date(startYear, startMonth);
    var numberOfMonths = parseInt(document.getElementById('months').value);

    for (var month = startMonth; month < (startMonth + numberOfMonths); month++) {
        var tmp = new Date(startDate);
        tmp.setMonth(month);

        var dates = DateUtils.getCalendarDates(tmp.getFullYear(), tmp.getMonth());

        // Make into HTML
        var rows = '';
        var row = '';
        for (var i = 0; i < dates.length; i++) {
            var day = dates[i];
            var content = '';

            content += DateUtils.padding(day.getDate());

            if (day.red) {
                content += Tag.string('p', day.red, { 'class': 'red-day', 'style': 'display: none;' });
            }

            var classes = [];
            if (day.getMonth() != (month % 12)) { classes.push('not-in-month'); }
            if (day.getDay() == 6 || day.getDay() == 0) { classes.push('weekend'); }
            row += Tag.string('td', content, { 'class': classes.join(" ") });

            if ((i + 1) % 7 === 0 || i == dates.length - 1) {
                row += Tag.string('td', DateUtils.padding(DateUtils.getWeek(day)), { 'class': 'week' });
                rows += Tag.string('tr', row);
                row = '';
            }
        }

        var thead = '';
        for (var i = 0; i < DateUtils.weekNames.length; i++) {
            var options = {};
            if (i >= 5) { options['class'] = 'weekend'; }
            thead += Tag.string('th', DateUtils.weekNames[i], options);
        }

        thead += Tag.string('th', 'V', { 'class': 'week' });
        thead  = Tag.string('thead', Tag.string('tr', thead));

        var tbody = Tag.string('tbody', rows);
        var table = Tag.string('table', thead + tbody, { 'class': 'day-rows-' + Math.round(dates.length / 7) });

        var yearTag = Tag.string('span', tmp.getFullYear(), { 'class': 'year' });
        var header  = Tag.string('h2', DateUtils.getMonthName(tmp.getMonth()) + ' ' + yearTag);
        var page    = Tag.string('div', header + table, { 'class': 'page' });

        result += page;
    }

    document.getElementById('content').innerHTML = result;
};

var displayMonths = function() {
    document.getElementById('months-display').innerHTML = document.getElementById('months').value;
};

var displayRedDays = function() {
    var days = document.getElementsByClassName('red-day');
    var show = document.getElementById('red-days').checked;
    var display = show ? 'block' : 'none';

    for (var i = 0; i < days.length; i++) {
        days[i].style.display = display;
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
