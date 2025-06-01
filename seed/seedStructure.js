const prisma = require("../lib/prisma");
const { getEmployees, getEmployee, getFirstEmployee } = require("../repo/employee"); 

async function seedStructure() {
  try {
    console.log("seedStructure() started");

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


    await prisma.employee.updateMany({
      where: {firstName: 'Лев', lastName: 'Болдырев', },
      data:{userId: (await prisma.user.findFirst({where: {username: "LBOLD"}})).id}
    })

    await prisma.employee.updateMany({
      where: {firstName: 'Иван', lastName: 'Герасимов', },
      data:{userId: (await prisma.user.findFirst({where: {username: "IGER"}})).id}
    })

    await prisma.employee.updateMany({
      where: {firstName: 'Екатерина', lastName: 'Шарова', },
      data:{userId: (await prisma.user.findFirst({where: {username: "ESHAR"}})).id}
    })

    await prisma.employee.updateMany({
      where: {firstName: 'София', lastName: 'Белова', },
      data:{userId: (await prisma.user.findFirst({where: {username: "SBEL"}})).id}
    })

    await prisma.employee.updateMany({
      where: {firstName: 'Ульяна', lastName: 'Макарова', },
      data:{userId: (await prisma.user.findFirst({where: {username: "UMAK"}})).id}
    })

    await prisma.employee.updateMany({
      where: {firstName: 'Мария', lastName: 'Овсянникова', },
      data:{userId: (await prisma.user.findFirst({where: {username: "MOVS"}})).id}
    })

    console.log("seedStructure() done");
  } catch (error) {
    console.error("❌ seedStructure() error:", error.message);
  }
}

module.exports = { seedStructure };
