const express = require('express')
const router = express.Router();

const employeeController = require('../controllers/employeeController')


router.route('/:id')
    .get(employeeController.getEmployeeById)

router.route('/department/:id')
    .get(employeeController.getEmployeeByDepartmentId)

router.route('/')
    .get(employeeController.getEmployeesDto)
    .post(employeeController.postEmployee)



module.exports = router