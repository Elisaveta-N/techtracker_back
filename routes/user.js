const express = require('express')
const router = express.Router();

const userController = require('../controllers/userController')


router.route('/detailes')
    .get(userController.getUserDetailes)

module.exports = router