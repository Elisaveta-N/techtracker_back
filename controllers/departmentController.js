const {
  getDepartments,
  getDepartment,
  createDepartment,
  patchDepartment,
  deleteDepartment,
} = require("../repo/department");
const { findUser } = require("../repo/user");

const getDepartmentById = async function (req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: "Department id should be a number" });
  }
  const dbRes = await getDepartment({ where: { id } });
  if (dbRes === null) {
    return res.status(400).json({ message: `Department ID ${id} not found` });
  }
  return res.status(dbRes.code).json(dbRes.data);
};

const getAllDepartments = async function (req, res) {
  let dbDepartment = null;
  if (req.roles === "ADMIN") {
    dbDepartment = await getDepartments({});
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

    dbDepartment = await getDepartments({
      where: {
        id: dbUser.employee.departmentId,
      },
    });
  }

  if (dbDepartment === null) {
    return res.status(500).json({ message: `Departments not found` });
  }

  if (dbDepartment.code === 200) {
    dbDepartment.data.forEach((obj) => {
      obj.id = obj.id.toString();
      obj.name = obj.depName;
      delete obj.depName;
    });
  }
  return res.status(dbDepartment.code).json(dbDepartment.data);
};

const postDepartment = async function (req, res) {
  const department = req.body.department;
  if (department === null) {
    return res.status(400).json({ message: `Departments not specified` });
  }

  let dbRes = await getDepartments({ where: { depName: department.depName } });
  if (dbRes.data.length !== 0) {
    return res
      .status(409)
      .json({ message: `Department should have unique name` });
  }

  dbRes = await createDepartment(department);
  return res.status(dbRes.code).json(dbRes.data);
};

const changeDepartment = async function (req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: "Department id should be a number" });
  }

  let dbRes = await getDepartment({ where: { id } });
  if (dbRes === null) {
    return res.status(400).json({ message: `Department ID ${id} not found` });
  }

  let department = req.body.department;
  if (department === null) {
    return res.status(400).json({ message: `Departments not specified` });
  }

  department.id = id;
  dbRes = await patchDepartment(department);
  return res.status(dbRes.code).json(dbRes.data);
};

const removeDepartment = async function (req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: "Department id should be a number" });
  }

  const dbRes = await deleteDepartment(id);
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

  employee.id = id;
  dbRes = await patchEmployee(employee);
  return res.status(dbRes.code).json(dbRes.data);
};

module.exports = {
  getDepartmentById,
  getAllDepartments,
  changeDepartment,
  postDepartment,
  removeDepartment,
  changeEmployee,
};
