const prisma = require("../lib/prisma");
const { reportStatus } = require("../lib/functions");

const getDepartment = async (condition) => {
  try {
    const dbDepartment = await prisma.department.findUnique(condition);

    if (dbDepartment === null) {
      return null;
    }
    return reportStatus(200, dbDepartment);
  } catch (err) {
    console.log("getDepartment error: " + err.message);
    return reportStatus(500, { message: err.message });
  }
};

const getDepartments = async (condition) => {
  try {
    const dbDepartments = await prisma.department.findMany(condition);
    if (dbDepartments === null) {
      return null;
    }
    return reportStatus(200, dbDepartments);
  } catch (err) {
    console.log("getDepartments error: " + err.message);
    return reportStatus(500, { message: err.message });
  }
};

const createDepartment = async (department) => {
  try {
    const dbDepartment = await prisma.department.create({ data: department });

    if (dbDepartment === null) {
      return reportStatus(500, { message: "Something went wrong, couldn't create an department" });
    }
    return reportStatus(201, dbDepartment);
  } catch (err) {
    console.log("createDepartment error: " + err.message);
    return reportStatus(500, { message: err.message });
  }
};

const patchDepartment = async (department) => {
  try {
    const dbDepartment = await prisma.department.update({where: {id: department.id,}, data: department,});
    return reportStatus(200, dbDepartment);
  } catch (err) {
    console.log("patchDepartment error: " + err.message);
    return reportStatus(500, { message: err.message });
  }
};

const deleteDepartment = async (id) => {
  try {
    const dbDepartment = await prisma.department.delete({where: {id}});
    return reportStatus(204, dbDepartment);
  } catch (err) {
    console.log("deleteDepartment  error: " + err.message);
    return reportStatus(500, { message: err.message });
  }
};
const createEmployee = async (employee) => {
  try {
    const dbEmployee = await prisma.employee.create({ data: employee });

    if (dbEmployee === null) {
      return reportStatus(500, { message: "Something went wrong, couldn't create an employee" });
    }
    return reportStatus(201, dbEmployee);
  } catch (err) {
    console.log("createEmployee error: " + err.message);
    return reportStatus(500, { message: err.message });
  }
};

module.exports = { createEmployee, getDepartments, getDepartment, createDepartment, patchDepartment, deleteDepartment};
