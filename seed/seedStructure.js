const prisma = require("../lib/prisma");

async function seedStructure() {
  try {
    console.log("seedStructure() started");
    //   устанавливаем, что пользователи с id 1 и 2 работают в отделе с id 1
    await prisma.employee.updateMany({
      where: {
        id: {
          in: [1, 2],
        },
      },
      data: {
        departmentId: 1,
      },
    });
    //   устанавливаем, что assets с id 1 и 2 принадлежат пользователю с id 1
    await prisma.asset.updateMany({
      where: {
        id: {
          in: [1, 7],
        },
      },
      data: {
        employeeId: 1,
      },
    });
    //   устанавливаем, что asset с id 2 принадлежат пользователю с id 2
    await prisma.asset.update({
      where: {
        id: 2,
      },
      data: {
        employeeId: 2,
      },
    });

    console.log("seedStructure() completed");
  } catch (error) {
    console.error("❌ seedStructure() error:", error.message);
  }
}

module.exports = { seedStructure };
