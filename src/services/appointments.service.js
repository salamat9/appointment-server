const DatabaseError = require('../utils/errorTypes/databaseError');
const appointmentsCollection = require('../models/appointment.model');

async function getAppointmentsByEmployeeId({ employeeId }) {
	try {
		return await appointmentsCollection.find({
			employeeId,
		});
	} catch (err) {
		console.log(err);
		throw new DatabaseError();
	}
}

async function getAppointmentsByEmployeeIdAndDate({ employeeId, date }) {
	try {
		const startOfDay = date.clone().startOf('day');
		const endOfDay = date.clone().endOf('day');

		return appointmentsCollection
			.find({
				employeeId,
				startTime: { $gte: startOfDay.toDate() },
				endTime: { $lte: endOfDay.toDate() },
			})
			.sort({ startTime: 1 });
	} catch (err) {
		console.log(err);
		throw new DatabaseError();
	}
}

async function createAppointment({
	employeeId,
	startTime,
	endTime,
	title,
	description,
}) {
	try {
		return await appointmentsCollection.create({
			employeeId,
			startTime,
			endTime,
			title,
			description,
		});
	} catch (err) {
		console.log(err);
		throw new DatabaseError();
	}
}

module.exports = {
	getAppointmentsByEmployeeId,
	getAppointmentsByEmployeeIdAndDate,
	createAppointment,
};
