const {getEmployees, getEmployee} = require('../repo/employee')


const getEmployeeById = async function (req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)){
        return res.status(400).json({message: 'Employee id should be a number'})
    }
    const dbRes = await getEmployee({id})
    if(dbRes === null) {
        return res.status(400).json({ "message": `Employee ID ${id} not found` });
    }
    return res.status(dbRes.code).json(dbRes.data)
}

const getEmployeeByDepartmentId = async function (req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)){
        return res.status(400).json({message: 'Department id should be a number'})
    }
    const dbRes = await getEmployees({departmentId: id})
    if(dbRes === null) {
        return res.status(400).json({ "message": `Employees for department ID ${id} not found` });
    }
    return res.status(dbRes.code).json(dbRes.data)
}

module.exports = {getEmployeeById, getEmployeeByDepartmentId}