const express = require('express')
const router = express.Router();

const assetController = require('../controllers/assetController')


router.route('/:id')
    .get(assetController.getAssetById)

router.route('/employee/:id')
    .get(assetController.getAssetByEmployeeId)

router.route('/department/:id')
    .get(assetController.getAssetByDepartmentId)

router.route('/')
    .get(assetController.getAllAssets)    

module.exports = router