const express = require('express');

const {
	httpGetAvailableTimeSlots,
	httpCreateAppointment,
} = require('../controllers/appointments.controller');

const appointmentsRouter = express.Router();

appointmentsRouter.post('/available-slots', httpGetAvailableTimeSlots);
appointmentsRouter.post('', httpCreateAppointment);

module.exports = appointmentsRouter;
