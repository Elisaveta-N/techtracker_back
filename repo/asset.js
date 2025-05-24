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

const createAsset = async (asset) => {
  try {
    // const asset2 = {
    //     "assetModel": "HP ProDesk 400 G7 MT",

    //     "assetType": "computer",
    //     "assetSN": "TURU1Z6ARQ",
    //     "assetStatus": "inStock",
    //     "assetInvenrotyNumber": "kjesdghfidshgfi"
    // }
    const dbAssets = await prisma.asset.create({ data: asset });

    if (dbAssets === null) {
      return null;
    }
    return reportStatus(201, dbAssets);
  } catch (err) {
    console.log("createAsset error: " + err.message);
    return reportStatus(500, { message: err.message });
  }
};

module.exports = { getAssets, getAsset, createAsset};
