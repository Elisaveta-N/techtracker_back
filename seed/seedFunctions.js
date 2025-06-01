const fs = require("fs/promises");
const prisma = require('../lib/prisma');
const {getPathForJson} = require('./config')


async function exportData(fileName, tableName) {
  try {
    const Model = prisma[tableName];
    if (!Model) {
      throw new Error(
        `Table ${tableName} does not exist in the Prisma schema.`
      );
    }

    const data = await Model.findMany();

    await fs.writeFile(fileName, JSON.stringify(data, null, 2));
    console.log(`✅ Data exported successfully to ${fileName}`);
  } catch (error) {
    console.error("❌ Error exporting data:", error.message);
  } finally {
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
      await Model.create({
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
      fileName = getPathForJson(tableName);
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


module.exports = {exportTables, importData, exportData, generateSN}