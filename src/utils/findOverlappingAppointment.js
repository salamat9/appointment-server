const moment = require('moment-timezone');

async function findOverlappingAppointment(
	existingAppointments,
	startTime,
	endTime
) {
	const parsedStartTime = moment(startTime);
	const parsedEndTime = moment(endTime);
  
	return existingAppointments.find(appointment => {
		const appointmentStartTime = moment(appointment.startTime);
		const appointmentEndTime = moment(appointment.endTime);

		return (
			parsedStartTime.isBefore(appointmentEndTime) &&
			parsedEndTime.isAfter(appointmentStartTime)
		);
	});
}

module.exports = {
	findOverlappingAppointment,
};
