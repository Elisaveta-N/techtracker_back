const { importData, generateSN } = require("./seedFunctions");
const { getPathForJson } = require("./config");
const fs = require("fs/promises");

const nomenclature = [
  {
    assetType: "computer",
    assetModel: "HP ProDesk 400 G7 MT",
  },
  {
    assetType: "laptop",
    assetModel: "HP EliteBook 840 G10",
  },
  {
    assetType: "dockstation",
    assetModel: "HP USB-C G5",
  },
  {
    assetType: "monitor",
    assetModel: "AOC Professional 27P2Q",
  },
  {
    assetType: "smartphone",
    assetModel: "Xiaomi Redmi Note 14 Pro",
  },
];

function generateAssets(batchSize) {
  let data = [];
  let id = 1;

  nomenclature.forEach((item) => {
    for (let i = 0; i < batchSize; ++i) {
      const sn = generateSN();
      const row = {
        // id: id++,
        assetModel: item.assetModel,
        employeeId: null,
        assetType: item.assetType,
        assetSN: sn,
        assetStatus: "inStock",
        assetInvenrotyNumber: (1000000 + id).toString(),
      };
      data.push(row);
      id++;
    }
  });

  return data;
}

async function seedAsset(batchSize) {
  const initAssetData = generateAssets(batchSize);
  const initAssetDataPath = getPathForJson("initAssetsData");

  await fs.writeFile(initAssetDataPath, JSON.stringify(initAssetData, null, 2));
  console.log("initAssetData generated");
  await importData(initAssetDataPath, "Asset");
  console.log("initAssetData import done");
}

module.exports = { seedAsset };
