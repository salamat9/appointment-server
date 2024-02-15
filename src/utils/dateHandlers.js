const moment = require('moment');
const momentTz = require('moment-timezone');

function convertTimeToUTC(time, timezone) {
	return momentTz.tz(time, timezone).utc().format();
}

function addDays(date, days) {
	return moment(date).add(days, 'day').toDate();
}

function stringToUTCDate(stringDate) {
	return moment.utc(stringDate, 'DD.MM.YYYY').toDate();
}

module.exports = {
	convertTimeToUTC,
	addDays,
	stringToUTCDate,
};
