const { importData } = require("./seedFunctions");
const { getPathForJson } = require("./config");
const fs = require("fs/promises");

const initDepartmentData = [
  {
    // id: 1,
    depName: "Отдел ИТ",
  },
  {
    // id: 2,
    depName: "Бухгалтерия",
  },
  {
    // id: 3,
    depName: "Отдел Снабжения",
  },
];

async function seedDepartment() {
  const initDepartmentDataPath = getPathForJson("initDepartmentData");

  await fs.writeFile(
    initDepartmentDataPath,
    JSON.stringify(initDepartmentData, null, 2)
  );
  console.log("initDepartmentData generated");
  await importData(initDepartmentDataPath, "Department");
  console.log("initDepartmentData import done");
}

module.exports = { seedDepartment };
