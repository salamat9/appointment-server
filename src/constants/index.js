const SIMPLE_DATETIME_FORMAT = 'DD.MM.YYYY HH:mm';
const DATE_FORMAT = 'DD.MM.YYYY';
const EMPLOYEE_NOT_FOUND_ERROR = id => `Employee with id: ${id} not found!`;
const EXISTING_APPOINTMENT_ERROR =
	'Appointment overlaps with existing appointments';

module.exports = {
	SIMPLE_DATETIME_FORMAT,
	DATE_FORMAT,
	EMPLOYEE_NOT_FOUND_ERROR,
	EXISTING_APPOINTMENT_ERROR,
};
