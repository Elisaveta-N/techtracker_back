const prisma = require("../lib/prisma");

const getTest = async function (req, res) {
  // //   пример выборки пользователя с принадлежащими ему assets
  //   const dbEmployee = await prisma.employee.findUnique({
  //     where: { id: 1 },
  //     include: {
  //       asset: true, // Include the assets related to this user
  //     },
  //   });

  const dbEmployees = await prisma.employee.findMany({
    where: { departmentId: 1 },
    include: {
      asset: true, // Include the assets related to this user
    },
  });

  return res.status(200).json(dbEmployees);
};

module.exports = { getTest };
