const prisma = require("../lib/prisma");
const { reportStatus } = require("../lib/functions");

const RoleEnum = {
  ADMIN: 5150,
  USER: 2001,
  EDITOR: 1984,
};

const adjustRoles = (dbUser) => {
  if (dbUser) {
    let newRoles = {};
    dbUser.roles.map((role) => {
      newRoles[role] = RoleEnum[role];
    });
    console.log(newRoles);
    dbUser.roles = newRoles;
  }

  return dbUser;
};

const findUserByUsername = async (username) => {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { username: username },
    });

    if (dbUser) {
      adjustRoles(dbUser);
    }
    return dbUser;
  } catch (err) {
    console.log("findUserByUsername error: " + err.message);
  }

  return null;
};

const findUserById = async (id) => {
  try {
    const dbUser = await prisma.user.findFirst({
      where: { id },
    });
    if (dbUser) {
      adjustRoles(dbUser);
    }

    return dbUser;
  } catch (err) {
    console.log("findUserById error: " + err.message);
  }
  return null;
};

const createDbUser = async (user) => {
  try {
    const dbUser = await prisma.user.create({ data: user });
    if (dbUser) {
      adjustRoles(dbUser);
    }
    return reportStatus(201, dbUser);
  } catch (err) {
    if (err.code === "P2002") {
      console.log("Not unique record: " + err.code);
      return reportStatus(409, {
        message: "User with this name alredy exists",
      });
    } else {
      console.log("General error: " + err.code);
      console.log(err);
      return reportStatus(500, { message: "General server error" });
    }
  }
};

const findUserByToken = async (refreshToken) => {
  try {
    const dbUser = await prisma.user.findFirst({
      where: { refreshToken },
    });
    if (dbUser) {
      adjustRoles(dbUser);
    }

    return dbUser;
  } catch (err) {
    console.log("findUserById error: " + err.message);
  }
  return null;
};

const updateUser = async (id, data) => {
  try {
    const dbUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    if (dbUser) {
      adjustRoles(dbUser);
    }

    return dbUser;
  } catch (err) {
    console.log("updateUser: " + err.message);
  }
  return null;
};

module.exports = {
  findUserByUsername,
  findUserById,
  createDbUser,
  findUserByToken,
  updateUser,
};
