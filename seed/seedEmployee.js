const { importData } = require("./seedFunctions");
const { getPathForJson } = require("./config");
const fs = require("fs/promises");

const initEmployeeData = [
  {
    id: 1,
    firstName: "Петр",
    lastName: "Смирнов",
    departmentId: 1,
  },
  {
    id: 2,
    firstName: "Дмитрий",
    lastName: "Волков",
    departmentId: 1,
  },
];

async function seedEmployee() {
  const initEmployeeDataPath = getPathForJson("initEmployeeData");

  await fs.writeFile(initEmployeeDataPath, JSON.stringify(initEmployeeData, null, 2));
  console.log("initEmployeeData generated");
  await importData(initEmployeeDataPath, "Employee");
  console.log("initEmployeeData import done");
}

module.exports = { seedEmployee };
