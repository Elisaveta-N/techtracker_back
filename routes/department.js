const express = require('express')
const router = express.Router();

const departmentController = require('../controllers/departmentController')


router.route('/:id')
    .get(departmentController.getDepartmentById)
    .patch(departmentController.changeDepartment)
    .delete(departmentController.removeDepartment)

router.route('/')
    .get(departmentController.getAllDepartments)
    .post(departmentController.postDepartment)   

    

module.exports = router