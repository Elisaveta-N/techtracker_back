const prisma = require("../lib/prisma");
const { reportStatus } = require("../lib/functions");

const getEmployee = async (condition) => {
  try {
    const dbEmployee = await prisma.employee.findUnique({
      where: { ...condition },
    });

    if (dbEmployee === null) {
      return null;
    }
    return reportStatus(200, dbEmployee);
  } catch (err) {
    console.log("getEmployee error: " + err.message);
    return reportStatus(500, { message: err.message });
  }
};

const getEmployees = async (condition) => {
  try {
    const dbEmployees = await prisma.employee.findMany({
      where: { ...condition },
    });
    if (dbEmployees === null) {
      return null;
    }
    return reportStatus(200, dbEmployees);
  } catch (err) {
    console.log("getEmployees error: " + err.message);
    return reportStatus(500, { message: err.message });
  }
};

module.exports = { getEmployees, getEmployee };
