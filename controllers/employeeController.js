const {
  getEmployees,
  getEmployee,
  createEmployee,
  deleteEmployee,
  patchEmployee,
} = require("../repo/employee");
const { findUser } = require("../repo/user");

const getEmployeeById = async function (req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Employee id should be a number" });
  }
  const dbRes = await getEmployee({ where: { id } });
  if (dbRes === null) {
    return res.status(400).json({ message: `Employee ID ${id} not found` });
  }

  const emp = dbRes.data;
  const dto = {
    id: emp.id.toString(),
    firstName: emp.firstName,
    lastName: emp.lastName,
    departmentId: emp.departmentId.toString(),
  };

  return res.status(dbRes.code).json(dto);
};

const getEmployeeByDepartmentId = async function (req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: "Department id should be a number" });
  }
  const dbRes = await getEmployees({ where: { departmentId: id } });
  if (dbRes === null) {
    return res
      .status(400)
      .json({ message: `Employees for department ID ${id} not found` });
  }
  return res.status(dbRes.code).json(dbRes.data);
};

const getEmployeesDto = async function (req, res) {
  let dbEmployee = null
    if (req.roles === "ADMIN") {
    dbEmployee = await getEmployees({});
  } else if (req.roles === "MANAGER") {
    const dbUser = await findUser({
      where: { username: req.user },
      include: { employee: true },
    });
    if (dbUser === null) {
      return res
        .status(400)
        .json({ message: `User name: ${req.user} not found` });
    }
    dbEmployee = await getEmployees({
      where: {
        departmentId: dbUser.employee.departmentId,
      },
    });
  }


  
  if (dbEmployee === null) {
    return res.status(400).json({ message: `Employees not found` });
  }

  const dto = dbEmployee.data.map((emp) => {
    return {
      id: emp.id.toString(),
      firstName: emp.firstName,
      lastName: emp.lastName,
      departmentId: emp.departmentId.toString(),
    };
  });

  return res.status(dbEmployee.code).json(dto);
};

const postEmployee = async function (req, res) {
  const employee = req.body.employee;
  if (employee === null) {
    return res.status(400).json({ message: `Employees not specified` });
  }

  //   let dbRes = await getEmployees({ where: { depName: employee.depName } });
  //   if (dbRes.data.length !== 0) {
  //     return res
  //       .status(409)
  //       .json({ message: `Employee should have unique name` });
  //   }

  try {
    const emp_dto = {
      firstName: employee.firstName,
      lastName: employee.lastName,
      departmentId: parseInt(employee.departmentId),
    };
    dbRes = await createEmployee(emp_dto);
    if (dbRes.code === 201) {
      dbRes.data.id = dbRes.data.id.toString();
      dbRes.data.departmentId = dbRes.data.departmentId.toString();
    }
    return res.status(dbRes.code).json(dbRes.data);
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
};

const removeEmployee = async function (req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Employee id should be a number" });
  }

  const dbRes = await deleteEmployee(id);
  return res.status(dbRes.code).json(dbRes.data);
};

const changeEmployee = async function (req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Employee id should be a number" });
  }

  let dbRes = await getEmployee({ where: { id } });
  if (dbRes === null) {
    return res.status(400).json({ message: `Employee ID ${id} not found` });
  }

  let employee = req.body.employee;
  if (employee === null) {
    return res.status(400).json({ message: `Employees not specified` });
  }

  const emp_dto = {
    id: id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    departmentId: parseInt(employee.departmentId),
  };

  dbRes = await patchEmployee(emp_dto);
  if (dbRes.code === 200) {
    dbRes.data.id = dbRes.data.id.toString();
    dbRes.data.departmentId = dbRes.data.departmentId.toString();
  }

  return res.status(dbRes.code).json(dbRes.data);
};

module.exports = {
  getEmployeeById,
  getEmployeeByDepartmentId,
  getEmployeesDto,
  postEmployee,
  removeEmployee,
  changeEmployee,
};
