const fs = require("fs/promises");
const prisma = require("./lib/prisma");
const path = require("path");

async function exportData(fileName, tableName) {
  try {
    const Model = prisma[tableName];
    if (!Model) {
      throw new Error(
        `Table ${tableName} does not exist in the Prisma schema.`
      );
    }

    const data = await Model.findMany();

    // Convert data to JSON and write to file
    await fs.writeFile(fileName, JSON.stringify(data, null, 2));
    console.log(`✅ Data exported successfully to ${fileName}`);
  } catch (error) {
    console.error("❌ Error exporting data:", error.message);
  } finally {
    // Disconnect the Prisma client
    await prisma.$disconnect();
  }
}

async function importData(fileName, tableName) {
  try {
    const Model = prisma[tableName];
    if (!Model) {
      throw new Error(
        `Table ${tableName} does not exist in the Prisma schema.`
      );
    }

    const jsonData = await fs.readFile(fileName, "utf8");
    const data = JSON.parse(jsonData);

    if (Array.isArray(data)) {
      const result = await Model.createMany({
        data: data,
        skipDuplicates: true, // Optional: skip duplicate records
      });
      console.log(`Imported ${result.count} records`);
    } else {
      await prisma.department.create({
        data: data,
      });
      console.log("✅ Record imported successfully");
    }
  } catch (error) {
    console.error("❌ Import error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function exportTables(folderPath, tableNames) {
  try {
    await tableNames.forEach(async (tableName) => {
      fileName = path.join(folderPath, `${tableName}.json`);
      await exportData(fileName, tableName);
    });
  } catch (err) {
    console.error("❌ Something went wrong in exportTables function:", err);
  }
}

function generateSN() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let sn = "";

  for (let i = 0; i < 10; i++) {
    sn += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return sn;
}

function generateAssets(batchSize) {
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

  let data = [];
  let id = 0;

  nomenclature.forEach((item) => {
    for (let i = 0; i < batchSize; ++i) {
      const sn = generateSN();
      const row = {
        id: id++,
        assetModel: item.assetModel,
        employeeId: null,
        assetType: item.assetType,
        assetSN: sn,
        assetStatus: "inStock",
      };
      data.push(row);
    }
  });

  return data;
}

const initAssetData = generateAssets(2);
const initAssetDataPath = path.join(
  __dirname,
  "SeedData",
  "initAssetsData.json"
);

fs.writeFile(initAssetDataPath, JSON.stringify(initAssetData, null, 2)).then(
  () => {
    console.log("initAssetData generated");
    importData(initAssetDataPath, "Asset").then(() => {
      console.log("initAssetData import done");
    });
  }
);

const initDepartmentData = [
  {
    id: 1,
    depName: "Отдел ИТ",
  },
  {
    id: 2,
    depName: "Бухгалтерия",
  },
  {
    id: 3,
    depName: "Отдел Снабжения",
  },
];
const initDepartmentDataPath = path.join(
  __dirname,
  "SeedData",
  "initDepartmentData.json"
);

fs.writeFile(initDepartmentDataPath, JSON.stringify(initDepartmentData, null, 2)).then(
  () => {
    console.log("initDepartmentData generated");
    importData(initDepartmentDataPath, "Department").then(() => {
      console.log("initDepartmentData import done");
    });
  }
);


const initEmployeeData = [
  {
    id: 1,
    firstName: 'Петр',
    lastName: 'Смирнов',
    departmentId: 1
  },
  {
    id: 2,
    firstName: 'Дмитрий',
    lastName: 'Волков',
    departmentId: 1
  },
];

const initEmployeeDataPath = path.join(
  __dirname,
  "SeedData",
  "initEmployeeData.json"
);

fs.writeFile(initEmployeeDataPath, JSON.stringify(initEmployeeData, null, 2)).then(
  () => {
    console.log("initEmployeeData generated");
    importData(initEmployeeDataPath, "Employee").then(() => {
      console.log("initEmployeeData import done");
    });
  }
);