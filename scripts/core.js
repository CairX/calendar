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
    var element = document.getElementById('content');
    var result = '';

    var year = parseInt(document.getElementById('year').value);
    var month = parseInt(document.getElementById('month').value);
    var start = new Date(year, month);

    var months = parseInt(document.getElementById('months').value);

    for (var m = month; m < (month + months); m++) {
        var tmp = new Date(start);
        tmp.setMonth(m);

        var dates = DateUtils.getCalendarDates(tmp.getFullYear(), tmp.getMonth());

        // Make into HTML
        var rows = '';
        var row = '';
        for (var i = 0; i < dates.length; i++) {
            var day = dates[i];
            var content = '';

            if (i % 7 === 0) {
                row += Tag.string('td', DateUtils.padding(DateUtils.getWeek(day)), { 'class': 'week' });
            }

            content += DateUtils.padding(day.getDate());

            if (day.red) {
                content += Tag.string('p', day.red, { 'class': 'red-day', 'style': 'display: none;' });
            }

            row += Tag.string('td', content);

            if ((i + 1) % 7 === 0 || i == dates.length - 1) {
                rows += Tag.string('tr', row);
                row = '';
            }
        }

        var thead = Tag.string('th', 'V', { 'class': 'week' });
        for (var i = 0; i < DateUtils.weekNames.length; i++) {
            thead += Tag.string('th', DateUtils.weekNames[i]);
        }
        thead = Tag.string('thead', Tag.string('tr', thead));

        var tbody = Tag.string('tbody', rows);
        var table = Tag.string('table', thead + tbody, { 'class': 'day-rows-' + Math.round(dates.length / 7) });

        var yearTag = Tag.string('span', tmp.getFullYear(), { 'class': 'year' });
        var header = Tag.string('h2', DateUtils.getMonthName(tmp.getMonth()) + ' ' + yearTag);
        var page = Tag.string('div', header + table, { 'class': 'page' });

        result += page;
    }
    element.innerHTML = result;
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
