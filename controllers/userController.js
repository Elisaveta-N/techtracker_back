const prisma = require("../lib/prisma");

const {
  findUserByUsername,
  findUserById,
  createDbUser,
  findUserByToken,
  updateUser,
  findUser,
} = require("../repo/user");

// export interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   departmentId: string;
//   role: UserRole;
//   position: string;
// }

const getUserDetailes = async function (req, res) {
  console.log(req.user);
  console.log(req.roles);

  const condition = {
    where: { username: req.user },
    include: { employee: true },
  };

  const dbUser = await findUser(condition);
  if (dbUser === null) {
    return res
      .status(400)
      .json({ message: `User name: ${req.user} not found` });
  }
  const dto = {
    id: dbUser.id.toString(),
    firstName: dbUser.employee.firstName,
    lastName: dbUser.employee.lastName,
    email: "",
    departmentId: dbUser.employee.departmentId.toString(),
    role: req.roles,
    position: "",
  };

  return res.status(200).json(dto);
};

module.exports = { getUserDetailes };
