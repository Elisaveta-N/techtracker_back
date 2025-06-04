const prisma = require("../lib/prisma");
const { reportStatus } = require("../lib/functions");

// const getEmployee = async (condition) => {
//   try {
//     const dbEmployee = await prisma.employee.findUnique({
//       where: { ...condition },
//     });

//     if (dbEmployee === null) {
//       return null;
//     }
//     return reportStatus(200, dbEmployee);
//   } catch (err) {
//     console.log("getEmployee error: " + err.message);
//     return reportStatus(500, { message: err.message });
//   }
// };
const getEmployee = async (condition) => {
  try {
    const dbEmployee = await prisma.employee.findUnique(condition);

    if (dbEmployee === null) {
      return null;
    }
    return reportStatus(200, dbEmployee);
  } catch (err) {
    console.log("getEmployee error: " + err.message);
    return reportStatus(500, { message: err.message });
  }
};

// const getEmployees = async (condition) => {
//   try {
//     const dbEmployees = await prisma.employee.findMany({
//       where: { ...condition },
//     });
//     if (dbEmployees === null) {
//       return null;
//     }
//     return reportStatus(200, dbEmployees);
//   } catch (err) {
//     console.log("getEmployees error: " + err.message);
//     return reportStatus(500, { message: err.message });
//   }
// };

const getEmployees = async (condition) => {
  try {
    const dbEmployees = await prisma.employee.findMany(condition);
    if (dbEmployees === null) {
      return null;
    }
    return reportStatus(200, dbEmployees);
  } catch (err) {
    console.log("getEmployees error: " + err.message);
    return reportStatus(500, { message: err.message });
  }
};

const getFirstEmployee = async (condition) => {
  try {
    const dbEmployee = await prisma.employee.findFirst(condition);

    if (dbEmployee === null) {
      return null;
    }
    return reportStatus(200, dbEmployee);
  } catch (err) {
    console.log("getFirstEmployee error: " + err.message);
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

const deleteEmployee = async (id) => {
  try {
    const dbEmployee = await prisma.employee.delete({where: {id}});
    return reportStatus(204, dbEmployee);
  } catch (err) {
    console.log("deleteEmployee  error: " + err.message);
    return reportStatus(500, { message: err.message });
  }
};

const patchEmployee = async (employee) => {
  try {
    const dbEmployee = await prisma.employee.update({where: {id: employee.id,}, data: employee,});
    return reportStatus(200, dbEmployee);
  } catch (err) {
    console.log("patchEmployee error: " + err.message);
    return reportStatus(500, { message: err.message });
  }
};


module.exports = {patchEmployee, createEmployee, getEmployees, getEmployee, getFirstEmployee, deleteEmployee};
