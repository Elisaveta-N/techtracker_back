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
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let sn = '';

  for (let i = 0; i < 10; i++) {
    sn += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return sn;
}

function generateAssets() {
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
      assetModel: "AOC Professional 27P2Q",
    },
  ];

  let data = []
  let id = 0

  nomenclature.forEach(item => {
    for(let i=0; i<2; ++i){
        const sn = generateSN()
        const row = 
        {
            id: id++,
            assetModel: item.assetModel,
            employee: null,
            employeeId: null,
            assetType: item.assetType,
            assetSN: sn,
            assetStatus: 'inStock'
        }
        data.push(row)
    }
  })

  return data
}



console.log(generateAssets());
