const { importData } = require("./seedFunctions");
const { getPathForJson } = require("./config");
const fs = require("fs/promises");
const bcrypt = require('bcrypt')

// model User{
//   id Int @id @default(autoincrement())
//   username String @unique
//   password String
//   refreshToken String @default("")
//   roles Role[] @default([USER])
//   employee Employee?
// }



async function initUserData () {

  const data = [
    {
      username: "LBOLD",
      password: (await bcrypt.hash("pass", 10)),      
      roles: ['MANAGER']
    },
    {
      username: "IGER",
      password: (await bcrypt.hash("pass", 10)),      
      roles: ['ADMIN']
    },
    {
      username: "ESHAR",
      password: (await bcrypt.hash("pass", 10)),      
      roles: ['MANAGER']
    },
    {
      username: "SBEL",
      password: (await bcrypt.hash("pass", 10)),      
      roles: ['USER']
    },
    {
      username: "UMAK",
      password: (await bcrypt.hash("pass", 10)),      
      roles: ['MANAGER']
    },
    {
      username: "MOVS",
      password: (await bcrypt.hash("pass", 10)),      
      roles: ['USER']
    },
  ];

  return data;
}

async function seedUser() {
  const initUserDataPath = getPathForJson("initUserData");

  await fs.writeFile(
    initUserDataPath,
    JSON.stringify(await initUserData(), null, 2)
  );
  // console.log(JSON.stringify(await initUserData(), null, 2))
  console.log("initUserData generated");
  await importData(initUserDataPath, "User");
  console.log("initUserData import done");
}


module.exports = { seedUser };