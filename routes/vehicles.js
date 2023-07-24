const express = require('express')
const catchAsync = require('../utilities/catchAsync')
const { isLoggedIn } = require('../middleware.js')
const vehicles = require('../controllers/vehicles')

const router = express.Router({ mergeParams: true })



router.get('/', isLoggedIn, catchAsync(vehicles.showAllVehicles))

router.post('/', isLoggedIn, catchAsync(vehicles.filterVehicles))

module.exports = router