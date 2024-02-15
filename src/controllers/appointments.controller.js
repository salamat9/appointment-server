const moment = require('moment-timezone');

const DataNotFoundError = require('../utils/errorTypes/dataNotFoundError');
const BadRequestError = require('../utils/errorTypes/badRequestError');
const { getEmployeeById } = require('../services/employees.service');
const {
	getAppointmentsByEmployeeIdAndDate,
	createAppointment,
} = require('../services/appointments.service');

async function httpGetAvailableTimeSlots(req, res) {
	try {
		const { employeeId, date, timezone, gradationCells } = req.body;

		const employee = await getEmployeeById(employeeId);
		if (!employee) {
			throw new DataNotFoundError(`Employee with id: ${employeeId} not found!`);
		}

		const targetDate = moment.tz(date, 'DD.MM.YYYY', timezone);

		const existingAppointments = await getAppointmentsByEmployeeIdAndDate({
			employeeId,
			date: targetDate,
		});

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
				const isBusySlot = existingAppointments.find(
					appointment =>
						currentTime.isBefore(appointment.endTime) &&
						endTime.isAfter(appointment.startTime)
				);

				if (!isBusySlot) {
					timeSlots.push({
						date: targetDate.format('DD.MM.YYYY'),
						timezone,
						busy: false,
						startDateTime: currentTime.tz(timezone).format('DD.MM.YYYY HH:mm'),
						endDateTime: endTime.tz(timezone).format('DD.MM.YYYY HH:mm'),
						utcStartDateTime: currentTime.toISOString(),
						utcEndDateTime: endTime.toISOString(),
					});
				} else {
					timeSlots.push({
						date: targetDate.format('DD.MM.YYYY'),
						timezone,
						busy: true,
						startDateTime: moment(isBusySlot.startTime)
							.tz(timezone)
							.format('DD.MM.YYYY HH:mm'),
						endDateTime: moment(isBusySlot.endTime)
							.tz(timezone)
							.format('DD.MM.YYYY HH:mm'),
						utcStartDateTime: isBusySlot.startTime.toISOString(),
						utcEndDateTime: isBusySlot.endTime.toISOString(),
					});
					currentTime = moment(isBusySlot.endTime);
					continue;
				}
			}
			currentTime.add(gradationCells, 'minutes');
		}

		res.status(200).json(timeSlots);
	} catch (err) {
		res.status(err.status).json({ error: err.message });
	}
}

async function httpCreateAppointment(req, res) {
	try {
		const { employeeId, startTime, endTime, title, description } =
			req.body;

		const employee = await getEmployeeById(employeeId);
		if (!employee) {
			throw new DataNotFoundError(`Employee with id: ${employeeId} not found!`);
		}

		const parsedStartTime = moment(startTime);
		const parsedEndTime = moment(endTime);

		if (parsedStartTime.isAfter(parsedEndTime)) {
			throw new BadRequestError(`StartTime is after EndTime!`);
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
		res.status(err.status).json({ error: err.message });
	}
}

module.exports = {
	httpGetAvailableTimeSlots,
	httpCreateAppointment,
};
