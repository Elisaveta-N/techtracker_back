const { importData } = require("./seedFunctions");
const { getPathForJson } = require("./config");
const fs = require("fs/promises");

const initDepartmentData = [
  {
    depName: "Отдел ИТ",
  },
  {
    depName: "Отдел финансов",
  },
  {
    depName: "Бухгалтерия",
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
