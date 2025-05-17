const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logoutController');


router.route('/')
    // .get(logoutController.handleLogout)
    .get(logoutController.handleLogoutDb)

module.exports = router