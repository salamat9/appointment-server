const moment = require('moment-timezone');

const DataNotFoundError = require('../utils/errorTypes/dataNotFoundError');
const { getEmployeeById } = require('../services/employees.service');
const {
	getAppointmentsByEmployeeIdAndDate,
	createAppointment,
} = require('../services/appointments.service');
const {
	calculateAvailableTimeSlots,
} = require('../utils/calculateAvailableTimeSlots');
const { DATE_FORMAT, EMPLOYEE_NOT_FOUND_ERROR } = require('../constants');

async function httpGetAvailableTimeSlots(req, res) {
	try {
		const { employeeId, date, timezone, gradationCells } = req.body;

		const employee = await getEmployeeById(employeeId);
		if (!employee) {
			throw new DataNotFoundError(EMPLOYEE_NOT_FOUND_ERROR(employeeId));
		}

		const existingAppointments = await getAppointmentsByEmployeeIdAndDate({
			employeeId,
			date: moment.tz(date, DATE_FORMAT, timezone),
		});

		const timeSlots = calculateAvailableTimeSlots(
			employee,
			existingAppointments,
			timezone,
			gradationCells
		);

		res.status(200).json(timeSlots);
	} catch (err) {
		console.log(err);
		res.status(err.status).json({ error: err.message });
	}
}

async function httpCreateAppointment(req, res) {
	try {
		const { employeeId, startTime, endTime, title, description } = req.body;

		const employee = await getEmployeeById(employeeId);
		if (!employee) {
			throw new DataNotFoundError(EMPLOYEE_NOT_FOUND_ERROR(employeeId));
		}

		const newAppointment = await createAppointment({
			employeeId,
			startTime,
			endTime,
			title,
			description,
		});

		res.status(201).json(newAppointment);
	} catch (err) {
		console.log(err);
		res.status(err.status).json({ error: err.message });
	}
}

module.exports = {
	httpGetAvailableTimeSlots,
	httpCreateAppointment,
};
