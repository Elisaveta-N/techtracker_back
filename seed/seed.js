const { seedAsset } = require("./seedAsset");
const { seedDepartment } = require("./seedDepartment");
const { seedEmployee } = require("./seedEmployee");


// DELETE FROM public."Asset";
// DELETE FROM public."Employee";
// DELETE FROM public."Department";


seedAsset(2).then(() => {
  seedDepartment().then(() => {
    seedEmployee().then(()=>{
        console.log('Initial data generation completed')
    });
  });
});
