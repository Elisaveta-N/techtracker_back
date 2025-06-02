const { seedAsset } = require("./seedAsset");
const { seedDepartment } = require("./seedDepartment");
const { seedEmployee } = require("./seedEmployee");
const { seedStructure } = require("./seedStructure");
const { seedUser } = require("./seedUser");

// npx prisma migrate reset
// node .\seed\seed.js

// создаем начальную структуру как указано ниже, пароль для всех пользователей "pass"
// Отдел ИТ
// Болдырев Лев MANAGER LBOLD
// Герасимов Иван ADMIN IGER

// Отдел финансов
// Шарова Екатерина MANAGER ESHAR
// Белова София USER SBEL

// Бухгалтерия
// Макарова Ульяна MANAGER UMAK
// Овсянникова Мария USER MOVS

seedAsset(2).then(() => {
  seedDepartment().then(() => {
    console.log("Department generated");
    seedEmployee().then(() => {
      console.log("Employee generated");
      seedUser().then(() => {
        console.log("User generated");
        seedStructure().then(() => {
          console.log("seedStructure() completed");
        });
      });
    });
  });
});
