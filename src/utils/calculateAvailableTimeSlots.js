const moment = require('moment-timezone');

const { SIMPLE_DATETIME_FORMAT, DATE_FORMAT } = require('../constants/index');

function findBusySlot(startTime, endTime, existingAppointments) {
	return existingAppointments.find(
		appointment =>
			startTime.isBefore(appointment.endTime) &&
			endTime.isAfter(appointment.startTime)
	);
}

function createTimeSlot(startTime, endTime, timezone, isBusy) {
	return {
		date: startTime.format(DATE_FORMAT),
		timezone,
		busy: isBusy,
		startDateTime: startTime.tz(timezone).format(SIMPLE_DATETIME_FORMAT),
		endDateTime: endTime.tz(timezone).format(SIMPLE_DATETIME_FORMAT),
		utcStartDateTime: startTime.toISOString(),
		utcEndDateTime: endTime.toISOString(),
	};
}

function calculateAvailableTimeSlots(
	employee,
	existingAppointments,
	timezone,
	gradationCells
) {
	const timeSlots = [];
	let currentTime = moment(employee.startWorkTime).clone();

	while (currentTime.isBefore(moment(employee.endWorkTime))) {
		const endTime = currentTime.clone().add(gradationCells, 'minutes');

		if (endTime.isBetween(employee.startLunchTime, employee.endLunchTime)) {
			currentTime = moment(employee.endLunchTime);
			continue;
		}

		if (
			currentTime.isSameOrAfter(employee.startWorkTime) &&
			endTime.isSameOrBefore(employee.endWorkTime)
		) {
			const isBusySlot = findBusySlot(
				currentTime,
				endTime,
				existingAppointments
			);

			if (!isBusySlot) {
				const timeSlot = createTimeSlot(currentTime, endTime, timezone, false);
				timeSlots.push(timeSlot);
			} else {
				const timeSlot = createTimeSlot(
					moment(isBusySlot.startTime),
					moment(isBusySlot.endTime),
					timezone,
					true
				);
				timeSlots.push(timeSlot);
				currentTime = moment(isBusySlot.endTime);
				continue;
			}
		}
		currentTime.add(gradationCells, 'minutes');
	}

	return timeSlots;
}

module.exports = {
	calculateAvailableTimeSlots,
};
