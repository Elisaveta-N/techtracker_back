const express = require('express')
const router = express.Router();

const assetController = require('../controllers/assetController')


router.route('/:id')
    .get(assetController.getAssetByIdDto)
    .patch(assetController.changeAsset)

router.route('/employee/:id')
    .get(assetController.getAssetByEmployeeId)

router.route('/department/:id')
    .get(assetController.getAssetByDepartmentId)

router.route('/')
    .get(assetController.getAllAssetsDto)
    .post(assetController.postAssetDto)   

    

module.exports = router