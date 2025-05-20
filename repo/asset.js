const prisma = require("../lib/prisma");
const { reportStatus } = require("../lib/functions");

// const getAsset = async (condition) => {
//   try {
//     const dbAsset = await prisma.asset.findUnique({
//       where: { ...condition },
//     });

//     if (dbAsset === null) {
//       return null;
//     }
//     return reportStatus(200, dbAsset);
//   } catch (err) {
//     console.log("getAsset error: " + err.message);
//     return reportStatus(500, { message: err.message });
//   }
// };

// const getAssets = async (condition) => {
//   try {
//     const dbAssets = await prisma.asset.findMany({
//       where: { ...condition },
//     });
//     if (dbAssets === null) {
//       return null;
//     }
//     return reportStatus(200, dbAssets);
//   } catch (err) {
//     console.log("getAssets error: " + err.message);
//     return reportStatus(500, { message: err.message });
//   }
// };

const getAsset = async (condition) => {
  try {
    const dbAsset = await prisma.asset.findUnique(condition);

    if (dbAsset === null) {
      return null;
    }
    return reportStatus(200, dbAsset);
  } catch (err) {
    console.log("getAsset error: " + err.message);
    return reportStatus(500, { message: err.message });
  }
};

const getAssets = async (condition) => {
  try {
    const dbAssets = await prisma.asset.findMany(condition);
    if (dbAssets === null) {
      return null;
    }
    return reportStatus(200, dbAssets);
  } catch (err) {
    console.log("getAssets error: " + err.message);
    return reportStatus(500, { message: err.message });
  }
};

module.exports = { getAssets, getAsset };
