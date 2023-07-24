const express = require('express')
const catchAsync = require('../utils/catchAsync')
const { validateVehicle, isLoggedIn } = require('../middleware.js')
const home = require('../controllers/home')
const router = express.Router()

router.get('/', isLoggedIn, home.showHomePage)

router.post('/', isLoggedIn, validateVehicle, catchAsync(home.newVehicle))

router.patch('/', isLoggedIn, catchAsync(home.exitVehicle))

module.exports = router