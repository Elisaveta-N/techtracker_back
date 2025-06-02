const {
  getDepartments,
  getDepartment,
  createDepartment,
  patchDepartment,
  deleteDepartment,
} = require("../repo/department");

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
  const dbRes = await getDepartments({});
  if (dbRes === null) {
    return res.status(500).json({ message: `Departments not found` });
  }

  if (dbRes.code === 200) {
    dbRes.data.forEach((obj) => {
      obj.id = obj.id.toString();
      obj.name = obj.depName;
      delete obj.depName;
    });
  }
  return res.status(dbRes.code).json(dbRes.data);
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

  const dbRes = await deleteDepartment(id)
  return res.status(dbRes.code).json(dbRes.data);
}


module.exports = {
  getDepartmentById,
  getAllDepartments,
  changeDepartment,
  postDepartment,
  removeDepartment,
};
