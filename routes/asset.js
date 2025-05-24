const express = require('express')
const router = express.Router();

const assetController = require('../controllers/assetController')


router.route('/:id')
    .get(assetController.getAssetById)
    .patch(assetController.changeAsset)

router.route('/employee/:id')
    .get(assetController.getAssetByEmployeeId)

router.route('/department/:id')
    .get(assetController.getAssetByDepartmentId)

router.route('/')
    .get(assetController.getAllAssets)
    .post(assetController.postAsset)   

    

module.exports = router