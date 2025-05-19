const express = require('express')
const router = express.Router();

const employeeController = require('../controllers/employeeController')


router.route('/:id')
    .get(employeeController.getEmployeeById)

router.route('/department/:id')
    .get(employeeController.getEmployeeByDepartmentId)

module.exports = router