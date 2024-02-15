const { convertTimeToUTC } = require('../utils/dateHandlers');

const {
	getEmployeeById,
	createEmployee,
} = require('../services/employees.service');
const DataNotFoundError = require('../utils/errorTypes/dataNotFoundError');

async function httpGetEmployeeById(req, res) {
	try {
		const { id } = req.params;

		const employee = await getEmployeeById(id);
		if (!employee) {
			throw new DataNotFoundError(`Employee with id: ${id} not found!`);
		}

		res.status(200).json(employee);
	} catch (err) {
		console.log(err);
		res.status(err.status).json({ error: err.message });
	}
}

async function httpCreateEmployee(req, res) {
	try {
		const {
			name,
			position,
			startWorkTime,
			endWorkTime,
			startLunchTime,
			endLunchTime,
			timezone,
		} = req.body;

		const newEmployee = await createEmployee({
			name,
			position,
			startWorkTime: convertTimeToUTC(startWorkTime, timezone),
			endWorkTime: convertTimeToUTC(endWorkTime, timezone),
			startLunchTime: convertTimeToUTC(startLunchTime, timezone),
			endLunchTime: convertTimeToUTC(endLunchTime, timezone),
		});

		res.status(201).json(newEmployee);
	} catch (err) {
		console.log(err);
		res.status(err.status).json({ error: err.message });
	}
}

module.exports = {
	httpGetEmployeeById,
	httpCreateEmployee,
};
