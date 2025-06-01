const { importData } = require("./seedFunctions");
const { getPathForJson } = require("./config");
const { getDepartment } = require("../repo/department");
const fs = require("fs/promises");

async function initEmployeeData () {
  const depIT = (await getDepartment({ where: { depName: "Отдел ИТ" }})).data.id;
  const depFin = (await getDepartment({ where: { depName: "Отдел финансов"}})).data.id;
  const depAccount = (await getDepartment({ where: { depName: "Бухгалтерия"}})).data.id;

  const data = [
    {
      firstName: "Лев",
      lastName: "Болдырев",
      departmentId: depIT,
    },
    {
      firstName: "Иван",
      lastName: "Герасимов",
      departmentId: depIT,
    },
    {
      firstName: "Екатерина",
      lastName: "Шарова",
      departmentId: depFin,
    },
    {
      firstName: "София",
      lastName: "Белова",
      departmentId: depFin,
    },
    {
      firstName: "Ульяна",
      lastName: "Макарова",
      departmentId: depAccount,
    },
    {
      firstName: "Мария",
      lastName: "Овсянникова",
      departmentId: depAccount,
    },
  ];

  return data;
}

async function seedEmployee() {
  const initEmployeeDataPath = getPathForJson("initEmployeeData");

  await fs.writeFile(
    initEmployeeDataPath,
    JSON.stringify(await initEmployeeData(), null, 2)
  );
  console.log("initEmployeeData generated");
  await importData(initEmployeeDataPath, "Employee");
  console.log("initEmployeeData import done");
}

module.exports = { seedEmployee };
