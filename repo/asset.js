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
    const dbAsset = await prisma.asset.create({ data: asset });

    if (dbAsset === null) {
      return reportStatus(500, { message: "Something went wrong, couldn't create an asset" });
    }
    return reportStatus(201, dbAsset);
  } catch (err) {
    console.log("createAsset error: " + err.message);
    return reportStatus(500, { message: err.message });
  }
};

const patchAsset = async (asset) => {
  try {
    const dbAsset = await prisma.asset.update({where: {id: asset.id,}, data: asset,});
    return reportStatus(200, dbAsset);
  } catch (err) {
    console.log("patchAsset error: " + err.message);
    return reportStatus(500, { message: err.message });
  }
};

module.exports = { getAssets, getAsset, createAsset, patchAsset};
