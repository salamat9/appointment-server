const express = require('express');

const employeesRouter = require('./employees.router');
const appointmentsRouter = require('./appointments.router');

const api = express.Router();

api.use('/employees', employeesRouter);
api.use('/appointments', appointmentsRouter);

module.exports = api;
