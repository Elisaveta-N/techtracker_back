const express = require('express')
const router = express.Router();

const testController = require('../controllers/testController')


// router.route('/:id')
//     .get(testController.getAssetById)

// router.route('/employee/:id')
//     .get(testController.getAssetByEmployeeId)

router.route('/')
    .get(testController.getTest)    

module.exports = router