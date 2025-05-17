const express = require('express')
const router = express.Router();

const authController = require('../controllers/authController')


router.route('/')
    // .post(authController.handleLogin)
    .post(authController.handleLoginDb)

module.exports = router