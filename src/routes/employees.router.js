const express = require('express');

const {
  httpGetEmployeeById,
  httpCreateEmployee,
} = require('../controllers/employees.controller');

const employeesRouter = express.Router();

employeesRouter.get('/:id', httpGetEmployeeById);
employeesRouter.post('', httpCreateEmployee);

module.exports = employeesRouter;
